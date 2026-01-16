# Logotypbibliotek - Implementationsplan

## Översikt

Lägg till ett permanent logotypbibliotek där användare kan ladda upp logotyper som sedan kan väljas och inkluderas som referensbilder vid bannergenerering.

**Användarflöde:**
1. Ladda upp logotyper till biblioteket (en gång)
2. Vid generering: välj referensbild + prompt + storlek + **logotyper från biblioteket**
3. Gemini får alla valda logotyper som extra referensbilder

## Arkitektur

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React/Vite    │────▶│  Express API    │────▶│  Gemini API     │
│   (Frontend)    │◀────│  (Backend)      │◀────│  (Bildgenerering)│
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
           ┌────────▼────────┐      ┌────────▼────────┐
           │  /uploads       │      │  /logos         │
           │  (Genererade)   │      │  (Logotyper)    │
           └─────────────────┘      └─────────────────┘
```

## API Design

### POST /api/logos
Ladda upp ny logotyp.

**Request:** `multipart/form-data` med `logo` (File) och `name` (string)

**Response:**
```json
{
  "id": "uuid",
  "name": "Företagslogotyp",
  "url": "/logos/uuid.png",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### GET /api/logos
Lista alla logotyper.

### DELETE /api/logos/:id
Ta bort logotyp.

### POST /api/generate (uppdaterad)
Lägg till `logoIds` parameter.

**Request:**
```json
{
  "referenceImage": File,
  "prompt": "...",
  "size": "1200x628",
  "logoIds": ["uuid1", "uuid2"]
}
```

## Kritiska filer

| Fil | Åtgärd |
|-----|--------|
| `backend/src/routes/logos.ts` | Skapa |
| `backend/src/routes/generate.ts` | Ändra |
| `backend/src/services/gemini.ts` | Ändra |
| `backend/src/index.ts` | Ändra |
| `frontend/src/components/LogoLibrary.tsx` | Skapa |
| `frontend/src/components/LogoUploader.tsx` | Skapa |
| `frontend/src/hooks/useImageGeneration.ts` | Ändra |
| `frontend/src/App.tsx` | Ändra |
| `frontend/src/types/index.ts` | Ändra |
