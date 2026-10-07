import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLOUD_NAME = process.env.VITE_CLOUDINARY_CLOUD_NAME || 'akbhdsaa';
const API_KEY = process.env.CLOUDINARY_API_KEY || '128275187432123';
const API_SECRET = process.env.CLOUDINARY_API_SECRET || 'jU1f3sewX5jHoBZKCPQB47Z9oY8';

const FOLDER = 'ninja-house';
const ASSETS_DIR = path.resolve(__dirname, '../public/assets');

function generateSignature(params, apiSecret) {
  const sortedKeys = Object.keys(params).sort();
  const serialized = sortedKeys.map(k => `${k}=${params[k]}`).join('&');
  return crypto.createHash('sha1').update(serialized + apiSecret).digest('hex');
}

async function uploadFile(filePath) {
  const fileName = path.basename(filePath);
  const ext = path.extname(fileName).toLowerCase();
  const baseName = path.basename(fileName, ext);
  
  // Decide resource type (image or video)
  const isVideo = ['.mp4', '.mov', '.webm', '.avi', '.mkv'].includes(ext);
  const resourceType = isVideo ? 'video' : 'image';
  
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = isVideo ? `${FOLDER}/videos` : FOLDER;
  const publicId = baseName;

  const paramsToSign = {
    folder,
    overwrite: 'true',
    public_id: publicId,
    timestamp: String(timestamp),
  };

  const signature = generateSignature(paramsToSign, API_SECRET);

  const fileBuffer = fs.readFileSync(filePath);
  const mimeType = isVideo ? `video/${ext.slice(1)}` : (ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : (ext === '.svg' ? 'image/svg+xml' : 'image/png'));
  const dataUri = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;

  const formData = new URLSearchParams();
  formData.append('file', dataUri);
  formData.append('api_key', API_KEY);
  formData.append('timestamp', String(timestamp));
  formData.append('folder', folder);
  formData.append('public_id', publicId);
  formData.append('overwrite', 'true');
  formData.append('signature', signature);

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    const result = await res.json();
    if (result.secure_url) {
      console.log(`✅ [${resourceType.toUpperCase()}] Subido con éxito: ${fileName} -> ${result.secure_url}`);
      return result;
    } else {
      console.error(`❌ Error subiendo ${fileName}:`, result.error?.message || result);
      return null;
    }
  } catch (err) {
    console.error(`❌ Falló la petición para ${fileName}:`, err.message);
    return null;
  }
}

async function main() {
  console.log(`🚀 Iniciando subida de assets a Cloudinary [Cloud: ${CLOUD_NAME}]...`);
  if (!fs.existsSync(ASSETS_DIR)) {
    console.error(`Directorio no encontrado: ${ASSETS_DIR}`);
    return;
  }

  const files = fs.readdirSync(ASSETS_DIR);
  const mediaFiles = files.filter(f => /\.(png|jpe?g|webp|svg|gif|mp4|webm)$/i.test(f));

  console.log(`📁 Encontrados ${mediaFiles.length} archivos para subir en /public/assets\n`);

  let successCount = 0;
  for (const file of mediaFiles) {
    const fullPath = path.join(ASSETS_DIR, file);
    const res = await uploadFile(fullPath);
    if (res) successCount++;
  }

  console.log(`\n🎉 Completado: ${successCount}/${mediaFiles.length} archivos subidos a Cloudinary en la carpeta '${FOLDER}'`);
}

main();
