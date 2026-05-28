import { GoogleGenAI } from "@google/genai";

// Server-only. GEMINI_API_KEY must never be imported into a "use client" file
// or logged. The single AI provider for the whole app.
export const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
