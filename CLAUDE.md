# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Banner Generator is an internal webapp for generating website banners using Google Gemini API. Users upload reference images, provide prompts, and receive generated banner images in various formats.

## Development Commands

```bash
# Install all dependencies
npm run install:all

# Run both frontend and backend in development mode
npm run dev

# Run frontend only (port 5173)
npm run dev:frontend

# Run backend only (port 3001)
npm run dev:backend
```

## Architecture

**Monorepo structure:**
```
/frontend  - Vite + React + TypeScript + Tailwind CSS
/backend   - Express.js + TypeScript
```

**Data Flow:**
1. User uploads reference image + prompt + desired size via React frontend
2. Backend receives request via POST /api/generate
3. Backend calls Google Gemini API with image and prompt
4. Sharp resizes generated image to requested dimensions
5. Image saved to /uploads and URL returned to frontend

## Tech Stack

- **Frontend:** Vite, React, TypeScript, Tailwind CSS
- **Backend:** Express.js, TypeScript, Sharp, Multer
- **Image API:** Google Gemini API (`gemini-2.0-flash-exp-image-generation`)

## API Endpoints

- `POST /api/generate` - Generate banner (multipart/form-data: referenceImage, prompt, size)
- `GET /api/sizes` - List available banner sizes
- `GET /api/images` - List generated images
- `GET /uploads/:filename` - Serve generated images

## Environment Variables

Backend requires (`backend/.env`):
- `GEMINI_API_KEY` - Google Gemini API key from https://aistudio.google.com/
- `PORT` - Server port (default: 3001)

## Banner Sizes

- `social` - 1200x628 (Social Media)
- `leaderboard` - 728x90 (Leaderboard)
- `medium-rect` - 300x250 (Medium Rectangle)
- `full-banner` - 1500x500 (Hel Banner)
