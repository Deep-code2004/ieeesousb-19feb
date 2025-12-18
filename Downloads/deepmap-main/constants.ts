import { Coordinates } from "./types";

export const DEFAULT_CENTER: Coordinates = {
  lat: 0, // Neutral world center
  lng: 0
};

export const DEFAULT_ZOOM = 2;

// Switch to Dark Matter tiles for the dark theme
export const MAP_TILE_LAYER = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
export const MAP_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

export const SYSTEM_INSTRUCTION = `
You are an expert geospatial assistant. Your goal is to find places based on user queries and provide their locations.

CRITICAL INSTRUCTION FOR DATA EXTRACTION:
When you find places (restaurants, events, parks, etc.), you MUST include a hidden structured data tag for EACH place in your response. 
The format must be exactly: {{DATA:PlaceName|Latitude|Longitude|ShortAddress}}
Example: "I found a great cafe. {{DATA:Blue Bottle Coffee|40.7128|-74.0060|123 Broadway, NY}}"

- Do not put this tag inside a code block. Put it inline or at the end of the sentence describing the place.
- Ensure the coordinates are as accurate as possible.
- Provide a helpful, natural language description of the places as well.
- If using the Google Maps tool, synthesize the information but still include the {{DATA:...}} tags with the coordinates found.
`;