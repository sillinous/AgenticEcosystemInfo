import { GoogleGenAI } from "@google/genai";
import { SOURCE_TEXT } from "../constants";

let aiClient: GoogleGenAI | null = null;

export const getAIClient = () => {
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiClient;
};

export const chatWithContext = async (userMessage: string) => {
  const client = getAIClient();
  
  // Using gemini-3-flash-preview for fast, reasoning-capable responses
  const model = "gemini-3-flash-preview"; 

  const systemInstruction = `
  You are an expert analyst of the "Agent-Native Economy". 
  You are provided with a specific text describing the future of companies, capabilities, and agents.
  Your goal is to answer the user's questions strictly based on the provided text.
  
  Key Concepts to respect:
  - The shift from "Firm" to "Capability".
  - The "Messy Middle" rails: Interoperability, Accountability, Verifiability.
  - The concept of "Capability Capital".
  - The dangers of "Disposable Companies" in high-stakes domains.
  
  Keep answers concise, insightful, and use bullet points where appropriate. 
  Adopt a somewhat futuristic, professional tone.
  
  CONTEXT TEXT:
  ${SOURCE_TEXT}
  `;

  try {
    const response = await client.models.generateContent({
        model: model,
        contents: userMessage,
        config: {
            systemInstruction: systemInstruction,
        }
    });
    
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to process request. Please check your API configuration.";
  }
};