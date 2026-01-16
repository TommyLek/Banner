import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { upload } from '../middleware/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
const logosDir = path.join(__dirname, '../../logos');
const logosJsonPath = path.join(logosDir, 'logos.json');

export interface Logo {
  id: string;
  name: string;
  filename: string;
  url: string;
  mimeType: string;
  createdAt: string;
}

async function readLogos(): Promise<Logo[]> {
  try {
    const data = await fs.readFile(logosJsonPath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeLogos(logos: Logo[]): Promise<void> {
  await fs.writeFile(logosJsonPath, JSON.stringify(logos, null, 2));
}

// Get all logos
router.get('/', async (_req: Request, res: Response) => {
  try {
    const logos = await readLogos();
    res.json(logos);
  } catch (error) {
    console.error('Error reading logos:', error);
    res.status(500).json({ error: 'Failed to read logos' });
  }
});

// Upload a new logo
router.post('/', upload.single('logo'), async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const { name } = req.body;

    if (!file) {
      res.status(400).json({ error: 'Logo file is required' });
      return;
    }

    if (!name || !name.trim()) {
      res.status(400).json({ error: 'Logo name is required' });
      return;
    }

    const id = uuidv4();
    const ext = path.extname(file.originalname) || '.png';
    const filename = `${id}${ext}`;
    const filepath = path.join(logosDir, filename);

    // Save the file
    await fs.writeFile(filepath, file.buffer);

    const logo: Logo = {
      id,
      name: name.trim(),
      filename,
      url: `/logos/${filename}`,
      mimeType: file.mimetype,
      createdAt: new Date().toISOString(),
    };

    // Update logos.json
    const logos = await readLogos();
    logos.push(logo);
    await writeLogos(logos);

    res.status(201).json(logo);
  } catch (error) {
    console.error('Error uploading logo:', error);
    res.status(500).json({ error: 'Failed to upload logo' });
  }
});

// Delete a logo
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const logos = await readLogos();
    const logoIndex = logos.findIndex(l => l.id === id);

    if (logoIndex === -1) {
      res.status(404).json({ error: 'Logo not found' });
      return;
    }

    const logo = logos[logoIndex];

    // Delete the file
    const filepath = path.join(logosDir, logo.filename);
    try {
      await fs.unlink(filepath);
    } catch {
      // File might not exist, continue anyway
    }

    // Update logos.json
    logos.splice(logoIndex, 1);
    await writeLogos(logos);

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting logo:', error);
    res.status(500).json({ error: 'Failed to delete logo' });
  }
});

// Get a single logo by ID (for internal use)
export async function getLogoById(id: string): Promise<Logo | null> {
  const logos = await readLogos();
  return logos.find(l => l.id === id) || null;
}

// Get logo file buffer by ID
export async function getLogoBuffer(id: string): Promise<{ buffer: Buffer; mimeType: string } | null> {
  const logo = await getLogoById(id);
  if (!logo) return null;

  const filepath = path.join(logosDir, logo.filename);
  try {
    const buffer = await fs.readFile(filepath);
    return { buffer, mimeType: logo.mimeType };
  } catch {
    return null;
  }
}

export default router;
