# Gemini Geo-Explorer Integration Docs

## Overview
This application integrates the **Gemini API** with a dynamic **Interactive Map** to create a conversational geospatial explorer. It allows users to ask natural language questions (e.g., "Find jazz clubs in Ahmedabad") and see results plotted instantly on the map.

## Architecture

### 1. The Map Engine (Frontend)
*   **Library**: `react-leaflet` (Leaflet JS).
*   **Tile Provider**: CartoDB Dark Matter (Matches the "Cyberpunk/Neon" theme).
*   **Why Leaflet?**: It provides a "Google Maps-like" interaction model (pan, zoom, pins, popups) without requiring a restricted/paid Google Maps Javascript API key for rendering.
*   **State Management**: The `App.tsx` holds the source of truth for `mapCenter`, `zoom`, and `places`.

### 2. The Data Pipeline (Gemini + Grounding)
The core challenge in AI map apps is getting **structured coordinates** (Lat/Lng) from a **text-based LLM**. We solve this using a "Prompt Engineering Protocol" rather than just reliance on tools.

#### The Protocol
1.  **Grounding**: We enable the `{ googleMaps: {} }` tool. This gives the model access to real-world location data.
2.  **Structured Output Injection**: We instruct the system (in `constants.ts`) to output a hidden tag for every place it finds:
    `{{DATA:PlaceName|Latitude|Longitude|ShortAddress}}`
3.  **Parsing**: The `geminiService.ts` listens for this regex pattern. When found, it:
    *   Extracts the coordinate data.
    *   Validates it (NaN checks).
    *   Constructs a `Place` object.
    *   Strips the tag from the visible text so the user only sees the natural response.

## Scalability & Future Work

### Adding New Features
*   **Route Planning**: Add a new tool definition or system instruction to request "Path from A to B", then parse a new tag `{{ROUTE:StartLat|StartLng|EndLat|EndLng}}` and draw a `Polyline` on the map.
*   **Category Filtering**: The `Place` object can be extended with a `category` field. You can ask Gemini to output `{{DATA:Name|Lat|Lng|Address|Category}}` and map different categories to different neon icon colors.

### Mobile Responsiveness
The app uses `h-[100dvh]` (Dynamic Viewport Height) to ensure the map feels native on mobile browsers by ignoring the dynamic address bar area.
