# Banner Generator - Implementationsplan

## Översikt

Intern webapp för att generera bannerbilder med Google Gemini API (Nano Banana Pro).

**Arkitektur:**
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React/Vite    │────▶│  Express API    │────▶│  Gemini API     │
│   (Frontend)    │◀────│  (Backend)      │◀────│  (Bildgenerering)│
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                        ┌────────▼────────┐
                        │  /uploads       │
                        │  (Bildlagring)  │
                        └─────────────────┘
```

## Tech Stack

| Komponent | Teknologi |
|-----------|-----------|
| Frontend | Vite + React + TypeScript |
| Styling | Tailwind CSS |
| Backend | Express.js + TypeScript |
| Bildhantering | Sharp (resize/crop) |
| Filuppladdning | Multer |
| HTTP-klient | Axios |
| Lagring | Filsystem (./uploads) |

## Filstruktur

```
/banner-generator
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ImageUploader.tsx      # Drag-and-drop
│   │   │   ├── PromptInput.tsx        # Textfält för prompt
│   │   │   ├── SizeSelector.tsx       # Dropdown för storlekar
│   │   │   ├── ImageGallery.tsx       # Visar genererade bilder
│   │   │   └── ImageCard.tsx          # Enskild bild med download
│   │   ├── hooks/
│   │   │   └── useImageGeneration.ts  # API-anrop logik
│   │   ├── types/
│   │   │   └── index.ts               # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── generate.ts            # POST /api/generate
│   │   ├── services/
│   │   │   ├── gemini.ts              # Gemini API wrapper
│   │   │   └── imageProcessor.ts      # Sharp resize/crop
│   │   ├── middleware/
│   │   │   └── upload.ts              # Multer config
│   │   ├── config/
│   │   │   └── bannerSizes.ts         # Fördefinierade storlekar
│   │   └── index.ts                   # Express app
│   ├── uploads/                        # Genererade bilder
│   ├── package.json
│   └── .env
├── CLAUDE.md
└── package.json                        # Root scripts
```

## API Design

### POST /api/generate

**Request (multipart/form-data):**
```json
{
  "referenceImage": File,
  "prompt": "Skapa en banner med samma stil...",
  "size": "1200x628"
}
```

**Response:**
```json
{
  "success": true,
  "image": {
    "id": "abc123",
    "url": "/uploads/abc123.png",
    "width": 1200,
    "height": 628,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### GET /api/images

Listar alla genererade bilder.

### GET /uploads/:filename

Serverar genererade bilder.

## Bannerstorlekar

```typescript
const BANNER_SIZES = [
  { id: 'social', name: 'Social Media', width: 1200, height: 628 },
  { id: 'leaderboard', name: 'Leaderboard', width: 728, height: 90 },
  { id: 'medium-rect', name: 'Medium Rectangle', width: 300, height: 250 },
  { id: 'full-banner', name: 'Hel Banner', width: 1500, height: 500 },
];
```

## Utvecklingsplan

### Milestone 1: Projektsetup
- [ ] Skapa monorepo-struktur
- [ ] Konfigurera Vite + React + TypeScript
- [ ] Konfigurera Express + TypeScript
- [ ] Installera dependencies
- [ ] Skapa .env med GEMINI_API_KEY placeholder

### Milestone 2: Backend API
- [ ] Implementera Multer för filuppladdning
- [ ] Skapa Gemini API service
- [ ] Implementera Sharp för bildresize
- [ ] Skapa POST /api/generate endpoint
- [ ] Skapa GET /api/images endpoint
- [ ] Konfigurera statisk filservering för /uploads

### Milestone 3: Frontend UI
- [ ] Skapa ImageUploader med drag-and-drop
- [ ] Skapa PromptInput komponent
- [ ] Skapa SizeSelector dropdown
- [ ] Skapa ImageGallery för resultat
- [ ] Implementera useImageGeneration hook
- [ ] Lägg till laddningsindikator

### Milestone 4: Integration & Polish
- [ ] Koppla ihop frontend med backend
- [ ] Lägg till felhantering
- [ ] Testa hela flödet
- [ ] Fixa CORS-konfiguration

## Kritiska filer att skapa

1. `backend/src/services/gemini.ts` - Gemini API integration
2. `backend/src/services/imageProcessor.ts` - Sharp resize
3. `backend/src/routes/generate.ts` - Huvudendpoint
4. `frontend/src/components/ImageUploader.tsx` - Drag-drop
5. `frontend/src/hooks/useImageGeneration.ts` - API-anrop

## Verifikation

1. **Starta backend:** `cd backend && npm run dev`
2. **Starta frontend:** `cd frontend && npm run dev`
3. **Testa flödet:**
   - Ladda upp en testbild via drag-and-drop
   - Skriv en prompt
   - Välj storlek
   - Klicka "Generera"
   - Verifiera att bild visas i galleriet
   - Ladda ner bilden och kontrollera dimensioner

## Risker & Antaganden

- **API-nyckel:** Användaren måste ha en giltig Gemini API-nyckel
- **Gemini response-format:** Behöver verifiera exakt JSON-struktur vid implementation
- **Rate limits:** Ingen kvotering i MVP, kan läggas till senare
- **Autentisering:** Ingen inloggning - appen antas köras internt
