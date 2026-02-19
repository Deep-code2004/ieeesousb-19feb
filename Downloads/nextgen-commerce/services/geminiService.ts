// FIX: Replaced the MOCK service with a real implementation of the Google Gemini API.
import { GoogleGenAI } from "@google/genai";

// FIX: Initialize the GoogleGenAI client with the API key from environment variables as per guidelines.
// It is assumed that process.env.API_KEY is pre-configured and available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const systemInstruction = "You are an AI shopping assistant for an e-commerce platform called NextGen Commerce. Your goal is to help users find products, answer questions about items, and provide a helpful and intelligent shopping experience. Be friendly and conversational.";

/**
 * Calls the Gemini API to get a chat response.
 * @param {string} prompt The user's message.
 * @returns {Promise<string>} A promise that resolves with the bot's response.
 */
export const getChatResponse = async (prompt: string): Promise<string> => {
  console.log("Calling Gemini API for NextGen with prompt:", prompt);

  try {
    // FIX: Use the recommended `ai.models.generateContent` method to query the Gemini API.
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Use the recommended model for general text tasks.
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    // FIX: Extract the text response directly from the `response.text` property.
    const text = response.text;

    if (text) {
      return text;
    } else {
      return "I'm not sure how to respond to that. Could you please ask about products or deals?";
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Sorry, I'm having trouble connecting to my knowledge base right now. Please try again in a moment.";
  }
};