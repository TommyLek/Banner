# Planeringsuppdrag: Banner Generator med Google Gemini API (Nano Banana Pro)

## Projektbeskrivning

Jag vill bygga en intern webapp där vårt team kan generera bannerbilder till vår hemsida. Arbetsflödet är:

1. Användaren drar in en referensbild (annonsunderlag från vår marknadsbyrå)
2. Användaren skriver en prompt som beskriver önskad output
3. Appen anropar Google Gemini API (Nano Banana Pro) med referensbilden och prompten
4. Genererade bilder visas och kan laddas ner i olika bannerformat

## Om Nano Banana Pro

Nano Banana Pro är Googles bildgenereringsmodell byggd på Gemini 3 Pro. Den är särskilt bra på:
- Bildgenerering och redigering baserat på referensbilder
- Skarp textrendering (perfekt för banners med text)
- Bibehålla karaktärskonsistens och stil
- Upp till 4K-upplösning
- Kombinera flera referensbilder (upp till 6-8 stycken)

Modellnamn för API: `gemini-3-pro-image-preview`

## Tekniska krav

**Frontend (React)**
- Drag-and-drop uppladdning av referensbilder
- Förhandsvisning av uppladdad referensbild  
- Textfält för prompt/instruktioner
- Dropdown eller knappar för att välja output-storlek (t.ex. 1200x628 för sociala medier, 728x90 leaderboard, 300x250 medium rectangle)
- Galleri som visar genererade bilder
- Möjlighet att ladda ner genererade bilder
- Enkel och intuitiv UI – detta är ett internt verktyg

**Backend (Node.js/Express)**
- Endpoint för att ta emot referensbild + prompt + önskad storlek
- Konvertera uppladdad bild till base64
- Skicka request till Google Gemini API
- Returnera genererade bilder till frontend
- Skydda API-nycklar (ska aldrig exponeras i frontend)

**Google Gemini API (Nano Banana Pro)**
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent`
- Autentisering via API-nyckel (`x-goog-api-key` header)
- Dokumentation: https://ai.google.dev/gemini-api/docs/nanobanana

Exempel på API-anrop med referensbild:
```bash
curl -s -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -H 'Content-Type: application/json' \
  -d "{
    \"contents\": [{
      \"parts\":[
        {\"text\": \"Create a website banner based on this ad design, keep the same style and colors\"},
        {
          \"inline_data\": {
            \"mime_type\":\"image/jpeg\",
            \"data\": \"<BASE64_IMAGE_DATA>\"
          }
        }
      ]
    }]
  }"
```

## Frågor att besvara i planeringen

1. **Autentisering**: Behöver vi användarinloggning i appen, eller räcker det att appen är tillgänglig internt? (Börja utan för MVP)

2. **Bildlagring**: Ska genererade bilder sparas permanent (databas/filsystem) eller bara visas temporärt?

3. **API-begränsningar**: Vilka rate limits och kostnader har Gemini API? Behöver vi implementera någon form av kvotering?

4. **Hosting**: Var ska appen hostas? (Vercel för frontend, egen server/molntjänst för backend?)

5. **Bildformat**: Hur hanterar vi olika output-storlekar? Generera direkt i rätt storlek eller beskära efteråt?

## Önskad output från planeringen

1. **Arkitekturskiss** – översikt över komponenter och dataflöde
2. **Tech stack** – konkreta val av bibliotek och verktyg
3. **API-design** – endpoints och dataformat
4. **Filstruktur** – hur projektet ska organiseras
5. **Utvecklingsplan** – uppdelning i milstolpar/sprints
6. **Risker och öppna frågor** – vad behöver vi undersöka mer?

## Kommandon för att komma igång

När planeringen är klar, skapa projektstrukturen med:
- Vite + React för frontend
- Express för backend
- Separata mappar för frontend och backend i samma repo (monorepo-struktur)

## Förberedelser

1. Skaffa en Gemini API-nyckel från Google AI Studio: https://aistudio.google.com/
2. Testa API:et manuellt först för att förstå response-formatet

---

Börja med att ställa eventuella förtydligande frågor, sedan vill jag ha en detaljerad plan innan vi skriver någon kod.
