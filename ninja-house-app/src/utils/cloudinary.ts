/**
 * Cloudinary Media Helper for Ninja House App
 * Cloud Name: akbhdsaa
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'akbhdsaa';
const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}`;

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'scale' | 'fit' | 'limit' | 'thumb' | 'pad' | 'crop';
  quality?: 'auto' | 'auto:best' | 'auto:good' | 'auto:eco' | 'auto:low' | number;
  format?: 'auto' | 'webp' | 'avif' | 'png' | 'jpg';
  gravity?: 'auto' | 'center' | 'face' | 'faces';
  blur?: number;
  dpr?: number | 'auto';
  aspectRatio?: string;
  effects?: string[];
}

export interface VideoTransformOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'scale' | 'fit' | 'limit' | 'pad';
  quality?: 'auto' | 'auto:best' | 'auto:good' | 'auto:eco' | 'auto:low' | number;
  format?: 'auto' | 'mp4' | 'webm' | 'm3u8';
  fps?: number;
  startOffset?: string | number;
  duration?: string | number;
}

/**
 * Builds transformation string for Cloudinary URLs
 */
function buildTransformString(options: ImageTransformOptions): string {
  const transforms: string[] = [];

  // Default optimization flags
  const format = options.format ?? 'auto';
  const quality = options.quality ?? 'auto';
  transforms.push(`f_${format}`, `q_${quality}`);

  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  if (options.crop) transforms.push(`c_${options.crop}`);
  if (options.gravity) transforms.push(`g_${options.gravity}`);
  if (options.aspectRatio) transforms.push(`ar_${options.aspectRatio}`);
  if (options.dpr) transforms.push(`dpr_${options.dpr}`);
  if (options.blur) transforms.push(`e_blur:${options.blur}`);
  if (options.effects && options.effects.length > 0) {
    transforms.push(...options.effects);
  }

  return transforms.join(',');
}

/**
 * Normalizes a public ID or path to Cloudinary asset URL
 * Handles clean public IDs (e.g. 'ninja-house/hero_logo'), full Cloudinary URLs, or relative assets
 */
export function getCloudinaryImageUrl(
  publicIdOrPath: string,
  options: ImageTransformOptions = {}
): string {
  if (!publicIdOrPath) return '';

  // If it's already an external non-Cloudinary URL, return as is
  if (publicIdOrPath.startsWith('http://') || (publicIdOrPath.startsWith('https://') && !publicIdOrPath.includes('cloudinary.com'))) {
    return publicIdOrPath;
  }

  const transformStr = buildTransformString(options);

  // If already a Cloudinary URL
  if (publicIdOrPath.includes('res.cloudinary.com')) {
    if (transformStr) {
      return publicIdOrPath.replace('/image/upload/', `/image/upload/${transformStr}/`);
    }
    return publicIdOrPath;
  }

  // Clean public ID (remove leading slash or /assets/ prefix if passed)
  let cleanId = publicIdOrPath.replace(/^\/+/, '');
  if (cleanId.startsWith('assets/')) {
    cleanId = cleanId.replace('assets/', '');
  }

  // If ID doesn't have a folder prefix, default to ninja-house/
  const finalId = cleanId.includes('/') ? cleanId : `ninja-house/${cleanId}`;

  return `${BASE_URL}/image/upload/${transformStr}/${finalId}`;
}

/**
 * Returns an ultra-low quality blurred placeholder for Progressive Image Loading
 */
export function getCloudinaryBlurPlaceholder(publicIdOrPath: string): string {
  return getCloudinaryImageUrl(publicIdOrPath, {
    width: 30,
    quality: 'auto:low',
    blur: 800,
    format: 'auto'
  });
}

/**
 * Generates Cloudinary Video URL with optimizations
 */
export function getCloudinaryVideoUrl(
  publicIdOrPath: string,
  options: VideoTransformOptions = {}
): string {
  if (!publicIdOrPath) return '';

  if (publicIdOrPath.startsWith('http://') || (publicIdOrPath.startsWith('https://') && !publicIdOrPath.includes('cloudinary.com'))) {
    return publicIdOrPath;
  }

  const transforms: string[] = [];
  const quality = options.quality ?? 'auto';
  transforms.push(`q_${quality}`);

  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  if (options.crop) transforms.push(`c_${options.crop}`);
  if (options.fps) transforms.push(`fps_${options.fps}`);
  if (options.startOffset !== undefined) transforms.push(`so_${options.startOffset}`);
  if (options.duration !== undefined) transforms.push(`du_${options.duration}`);

  const transformStr = transforms.join(',');

  if (publicIdOrPath.includes('res.cloudinary.com')) {
    if (transformStr) {
      return publicIdOrPath.replace('/video/upload/', `/video/upload/${transformStr}/`);
    }
    return publicIdOrPath;
  }

  let cleanId = publicIdOrPath.replace(/^\/+/, '');
  if (cleanId.startsWith('assets/')) {
    cleanId = cleanId.replace('assets/', '');
  }
  const finalId = cleanId.includes('/') ? cleanId : `ninja-house/videos/${cleanId}`;

  return `${BASE_URL}/video/upload/${transformStr ? transformStr + '/' : ''}${finalId}`;
}

/**
 * Generates a poster image from a video at a specific frame (default: start)
 */
export function getCloudinaryVideoPoster(
  publicIdOrPath: string,
  startOffset: string | number = 0,
  options: ImageTransformOptions = {}
): string {
  let cleanId = publicIdOrPath.replace(/^\/+/, '');
  if (cleanId.startsWith('assets/')) {
    cleanId = cleanId.replace('assets/', '');
  }
  // Strip video extensions if any
  cleanId = cleanId.replace(/\.(mp4|mov|webm|mkv)$/i, '');
  const finalId = cleanId.includes('/') ? cleanId : `ninja-house/videos/${cleanId}`;

  const transformStr = buildTransformString({
    ...options,
    effects: [`so_${startOffset}`, ...(options.effects || [])]
  });

  return `${BASE_URL}/video/upload/${transformStr}/${finalId}.jpg`;
}

/**
 * Pre-mapped assets for Ninja House
 */
export const NINJA_MEDIA = {
  logos: {
    main: 'ninja-house/NinjaLOGO',
    symbol: 'ninja-house/logo',
    alt: 'ninja-house/LOGO_NINJA_HOUSE',
    full2: 'ninja-house/Logo2',
  },
  programs: {
    animesYramen: 'ninja-house/animesYramen1',
    animesYramenLogo: 'ninja-house/animesYramenLogo',
    overhead: 'ninja-house/overHead1',
    overheadLogo: 'ninja-house/overheadLogo',
    freakuencia: 'ninja-house/freakuencia1',
    freakuenciaLogo: 'ninja-house/FreakuenciaLogo',
    malditoPlastico: 'ninja-house/malditoPlastico1',
    malditoPlasticoLogo: 'ninja-house/malditoPlasticoLogo',
    cineInfarto: 'ninja-house/CineInfarto1',
    cineInfartoLogo: 'ninja-house/cineinfartoLogo',
    lanzalo: 'ninja-house/lanzalo1',
  },
  schedule: {
    horizontal: 'ninja-house/programacionH1',
    horizontalAlt: 'ninja-house/programacionH',
  },
  collectibles: {
    toy: 'ninja-house/cyberpunk_ninja_toy',
    hoodie: 'ninja-house/dojo_streetwear_hoodie',
    keyboard: 'ninja-house/ninja_mechanical_keyboard',
  },
  banners: {
    hero: 'ninja-house/banner',
    hero2: 'ninja-house/banner 2',
  }
} as const;
