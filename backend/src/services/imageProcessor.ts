import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '../../uploads');

export async function ensureUploadsDir(): Promise<void> {
  try {
    await fs.access(uploadsDir);
  } catch {
    await fs.mkdir(uploadsDir, { recursive: true });
  }
}

export async function resizeAndSave(
  imageBuffer: Buffer,
  filename: string,
  width: number,
  height: number
): Promise<string> {
  await ensureUploadsDir();

  const outputPath = path.join(uploadsDir, filename);

  await sharp(imageBuffer)
    .resize(width, height, {
      fit: 'cover',
      position: 'center',
    })
    .png()
    .toFile(outputPath);

  return `/uploads/${filename}`;
}

export async function listImages(): Promise<string[]> {
  await ensureUploadsDir();

  const files = await fs.readdir(uploadsDir);
  return files
    .filter(f => /\.(png|jpg|jpeg|webp|gif)$/i.test(f))
    .map(f => `/uploads/${f}`);
}

export async function deleteImage(imageId: string): Promise<boolean> {
  const filename = imageId.endsWith('.png') ? imageId : `${imageId}.png`;
  const filePath = path.join(uploadsDir, filename);

  try {
    await fs.unlink(filePath);
    return true;
  } catch {
    return false;
  }
}
