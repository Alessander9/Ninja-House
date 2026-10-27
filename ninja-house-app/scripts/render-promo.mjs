#!/usr/bin/env node
/**
 * Renderiza /video a MP4 frame por frame (determinista, sin frames perdidos).
 *
 * Uso:
 *   1) npm run dev            (en otra terminal)
 *   2) npm run render:video   [-- --url http://localhost:5173 --out promo/ninja-house-promo.mp4]
 */
import { spawn } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { chromium } from 'playwright'
import ffmpegPath from 'ffmpeg-static'

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => (a.startsWith('--') ? [...acc, [a.slice(2), arr[i + 1]]] : acc), []),
)
const BASE = args.url ?? 'http://localhost:5173'
const OUT = resolve(args.out ?? 'promo/ninja-house-promo.mp4')

mkdirSync(dirname(OUT), { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 })
console.log(`▶ Abriendo ${BASE}/video?render=1`)
await page.goto(`${BASE}/video?render=1`, { waitUntil: 'networkidle' })
await page.waitForFunction(() => window.__videoReady === true, null, { timeout: 60_000 })

const { duration, fps } = await page.evaluate(() => window.__videoMeta)
const total = Math.round(duration * fps)
console.log(`🎬 ${total} frames @ ${fps}fps → ${OUT}`)

const ff = spawn(ffmpegPath, [
  '-y', '-loglevel', 'error',
  '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart', OUT,
], { stdio: ['pipe', 'inherit', 'inherit'] })

const started = Date.now()
for (let i = 0; i < total; i++) {
  await page.evaluate((t) => window.__seek(t), i / fps)
  const buf = await page.screenshot({ type: 'jpeg', quality: 95 })
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r))
  if (i % fps === 0) {
    const pct = ((i / total) * 100).toFixed(0).padStart(3)
    process.stdout.write(`\r  ${pct}%  frame ${i}/${total}  (${((Date.now() - started) / 1000).toFixed(0)}s)`)
  }
}
ff.stdin.end()
await new Promise((res, rej) => ff.on('close', (code) => (code === 0 ? res() : rej(new Error(`ffmpeg salió con código ${code}`)))))
await browser.close()
console.log(`\n✅ Listo: ${OUT}`)
