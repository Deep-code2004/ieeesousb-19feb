import { GoogleGenAI, Tool } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { ChatMessage, Place } from "../types";

let ai: GoogleGenAI | null = null;

const initializeAI = () => {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

// ============================================================================
// DATA EXTRACTION PROTOCOL
// ============================================================================
// To integrate the Map with Gemini text responses, we use a custom tagging protocol.
// The System Instruction (constants.ts) tells Gemini to append a specific
// tag format {{DATA:Name|Lat|Lng|Address}} for every place it finds.
// We then use this Regex to extract that hidden structured data while 
// presenting the clean natural language text to the user.
// ============================================================================

// Regex to extract the custom data tags we asked the model to generate
// Format: {{DATA:Name|Lat|Lng|Address}}
// Using [^|]* is safer to ensure we don't greedily eat pipes
const PLACE_TAG_REGEX = /\{\{DATA:([^|]*?)\|([^|]*?)\|([^|]*?)\|([^}]*?)\}\}/g;

interface ParseResult {
  cleanText: string;
  places: Place[];
}

const parseResponse = (text: string): ParseResult => {
  const places: Place[] = [];
  let match;
  
  // Clone text to remove tags for display
  let cleanText = text;

  // We loop through all matches to extract data
  while ((match = PLACE_TAG_REGEX.exec(text)) !== null) {
    const [fullTag, name, latStr, lngStr, address] = match;
    
    // Sanitize and parse coordinates
    // Replace commas with dots, remove internal spaces
    const lat = parseFloat(latStr.trim().replace(',', '.'));
    const lng = parseFloat(lngStr.trim().replace(',', '.'));

    // Strict validation check: Must be a finite number, not NaN, and not 0,0 (unless actually 0,0 which is rare for POIs)
    const isValidCoordinate = (num: number) => typeof num === 'number' && !isNaN(num) && isFinite(num);

    if (isValidCoordinate(lat) && isValidCoordinate(lng) && (Math.abs(lat) > 0.0001 || Math.abs(lng) > 0.0001)) {
      places.push({
        id: Math.random().toString(36).substr(2, 9),
        name: name.trim(),
        coordinates: { lat, lng },
        address: address.trim(),
        description: `Located at ${address.trim()}`
      });
    }
  }

  // Remove the tags from the display text
  cleanText = cleanText.replace(PLACE_TAG_REGEX, '');

  return { cleanText, places };
};

export const sendMessageToGemini = async (
  prompt: string, 
  userLocation?: { latitude: number; longitude: number }
): Promise<Partial<ChatMessage>> => {
  const client = initializeAI();
  
  // Enable Google Maps grounding tool
  const tools: Tool[] = [{ googleMaps: {} }];
  
  // Prepare tool config with user location if available
  const toolConfig = userLocation ? {
    retrievalConfig: {
      latLng: {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude
      }
    }
  } : undefined;

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: tools,
        toolConfig: toolConfig,
        // Note: responseMimeType and responseSchema are NOT allowed when using googleMaps tool
      }
    });

    const rawText = response.text || "I couldn't find any information about that.";
    const { cleanText, places } = parseResponse(rawText);
    
    // Extract grounding chunks (URLs) if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
      role: 'model',
      text: cleanText,
      places: places,
      groundingChunks: groundingChunks as any // Cast because our internal type is slightly simplified
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};