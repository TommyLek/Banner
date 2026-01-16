const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent';

export interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
        inlineData?: {
          mimeType: string;
          data: string;
        };
      }>;
    };
  }>;
  error?: {
    message: string;
    code: number;
  };
}

export interface ReferenceImage {
  base64: string;
  mimeType: string;
}

// Calculate closest supported aspect ratio
function getAspectRatio(width: number, height: number): string {
  const ratio = width / height;
  const supportedRatios = [
    { name: '1:1', value: 1 },
    { name: '2:3', value: 2/3 },
    { name: '3:2', value: 3/2 },
    { name: '3:4', value: 3/4 },
    { name: '4:3', value: 4/3 },
    { name: '4:5', value: 4/5 },
    { name: '5:4', value: 5/4 },
    { name: '9:16', value: 9/16 },
    { name: '16:9', value: 16/9 },
    { name: '21:9', value: 21/9 },
  ];

  let closest = supportedRatios[0];
  let minDiff = Math.abs(ratio - closest.value);

  for (const r of supportedRatios) {
    const diff = Math.abs(ratio - r.value);
    if (diff < minDiff) {
      minDiff = diff;
      closest = r;
    }
  }

  return closest.name;
}

export async function generateImage(
  referenceImages: ReferenceImage[],
  prompt: string,
  width: number,
  height: number
): Promise<Buffer> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_api_key_here') {
    throw new Error('GEMINI_API_KEY is not configured. Please add your API key to backend/.env');
  }

  if (referenceImages.length === 0) {
    throw new Error('At least one reference image is required');
  }

  const aspectRatio = getAspectRatio(width, height);

  const hasLogos = referenceImages.length > 1;
  const enhancedPrompt = hasLogos
    ? `${prompt}

Maintain the style, colors, and visual identity from the reference images. Include the logos/branding provided in the reference images.`
    : `${prompt}

Maintain the style, colors, and visual identity from the reference image.`;

  // Build parts array with text prompt and all reference images
  const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [
    { text: enhancedPrompt },
  ];

  for (const img of referenceImages) {
    parts.push({
      inlineData: {
        mimeType: img.mimeType,
        data: img.base64,
      },
    });
  }

  const requestBody = {
    contents: [
      {
        parts,
      },
    ],
    generationConfig: {
      responseModalities: ['TEXT', 'IMAGE'],
      imageConfig: {
        aspectRatio,
        imageSize: '2K',
      },
    },
  };

  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }

  const data: GeminiResponse = await response.json();

  if (data.error) {
    throw new Error(`Gemini API error: ${data.error.message}`);
  }

  // Find the image in the response
  const imagePart = data.candidates?.[0]?.content?.parts?.find(
    (part) => part.inlineData?.data
  );

  if (!imagePart?.inlineData?.data) {
    throw new Error('No image was generated. The API response did not contain image data.');
  }

  return Buffer.from(imagePart.inlineData.data, 'base64');
}
