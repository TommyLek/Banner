import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { upload } from '../middleware/upload.js';
import { generateImage, ReferenceImage } from '../services/gemini.js';
import { resizeAndSave, listImages } from '../services/imageProcessor.js';
import { parseSizeString, BANNER_SIZES } from '../config/bannerSizes.js';
import { getLogoBuffer } from './logos.js';

const router = Router();

// Get available banner sizes
router.get('/sizes', (_req: Request, res: Response) => {
  res.json(BANNER_SIZES);
});

// List all generated images
router.get('/images', async (_req: Request, res: Response) => {
  try {
    const images = await listImages();
    res.json({ images });
  } catch (error) {
    console.error('Error listing images:', error);
    res.status(500).json({ error: 'Failed to list images' });
  }
});

// Generate a new banner
router.post('/generate', upload.single('referenceImage'), async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const { prompt, size, logoIds } = req.body;

    if (!file) {
      res.status(400).json({ error: 'Reference image is required' });
      return;
    }

    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    if (!size) {
      res.status(400).json({ error: 'Size is required' });
      return;
    }

    const dimensions = parseSizeString(size);
    if (!dimensions) {
      res.status(400).json({ error: 'Invalid size format. Use format like "1200x628" or a preset ID.' });
      return;
    }

    const { width, height } = dimensions;

    // Build array of reference images
    const referenceImages: ReferenceImage[] = [
      {
        base64: file.buffer.toString('base64'),
        mimeType: file.mimetype,
      },
    ];

    // Add logos if provided
    if (logoIds) {
      const logoIdArray = typeof logoIds === 'string' ? JSON.parse(logoIds) : logoIds;

      for (const logoId of logoIdArray) {
        const logoData = await getLogoBuffer(logoId);
        if (logoData) {
          referenceImages.push({
            base64: logoData.buffer.toString('base64'),
            mimeType: logoData.mimeType,
          });
        }
      }
    }

    console.log(`Generating banner: ${width}x${height} with ${referenceImages.length} reference image(s) and prompt: "${prompt.substring(0, 50)}..."`);

    // Call Gemini API
    const generatedImageBuffer = await generateImage(
      referenceImages,
      prompt,
      width,
      height
    );

    // Save the generated image
    const filename = `${uuidv4()}.png`;
    const imageUrl = await resizeAndSave(generatedImageBuffer, filename, width, height);

    res.json({
      success: true,
      image: {
        id: filename.replace('.png', ''),
        url: imageUrl,
        width,
        height,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error generating image:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate image';
    res.status(500).json({ error: message });
  }
});

export default router;
