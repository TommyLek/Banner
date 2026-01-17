# Banner Generator

En intern webapp för att generera webbbanners med hjälp av Google Gemini API. Ladda upp referensbilder, skriv en prompt och få AI-genererade banners i olika format.

## Funktioner

- Generera banners från referensbilder med AI
- Stöd för flera bannerstorlekar (Social Media, Leaderboard, Medium Rectangle, Full Banner)
- Logotypbibliotek för att inkludera logotyper i genererade banners
- Ladda ner eller ta bort genererade bilder

## Tech Stack

- **Frontend:** Vite, React, TypeScript, Tailwind CSS
- **Backend:** Express.js, TypeScript, Sharp, Multer
- **Image API:** Google Gemini API (`gemini-2.0-flash-exp-image-generation`)

## Installation

```bash
# Installera alla dependencies
npm run install:all
```

## Miljövariabler

Skapa `backend/.env` med följande:

```env
GEMINI_API_KEY=din-api-nyckel
PORT=3001
```

Hämta API-nyckel från https://aistudio.google.com/

## Utveckling

```bash
# Kör både frontend och backend
npm run dev

# Kör endast frontend (port 5173)
npm run dev:frontend

# Kör endast backend (port 3001)
npm run dev:backend
```

## API Endpoints

| Metod | Endpoint | Beskrivning |
|-------|----------|-------------|
| POST | `/api/generate` | Generera banner (multipart/form-data) |
| GET | `/api/sizes` | Lista tillgängliga bannerstorlekar |
| GET | `/api/images` | Lista genererade bilder |
| DELETE | `/api/images/:id` | Ta bort en bild |
| GET | `/api/logos` | Lista logotyper |
| POST | `/api/logos` | Ladda upp logotyp |
| DELETE | `/api/logos/:id` | Ta bort logotyp |

## Bannerstorlekar

| ID | Storlek | Beskrivning |
|----|---------|-------------|
| social | 1200x628 | Social Media |
| leaderboard | 728x90 | Leaderboard |
| medium-rect | 300x250 | Medium Rectangle |
| full-banner | 1500x500 | Full Banner |

## Projektstruktur

```
/frontend    - Vite + React + TypeScript + Tailwind CSS
/backend     - Express.js + TypeScript
  /uploads   - Genererade bilder
  /logos     - Uppladdade logotyper
```
