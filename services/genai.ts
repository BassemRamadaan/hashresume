import { GoogleGenAI, Type } from "@google/genai";

// Initialize the client. API_KEY is assumed to be available in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAISuggestions = async (
  type: 'summary' | 'experience' | 'skills',
  currentText: string
): Promise<string[]> => {
  // Graceful fallback if key is missing in dev environment
  if (!process.env.API_KEY) {
    console.warn("Gemini API Key missing");
    return [
        "Results-oriented professional with a focus on efficiency and scalability.",
        "Experienced specialist capable of driving projects from conception to delivery.",
        "Dedicated team player with a strong background in agile methodologies."
    ];
  }

  let prompt = "";
  
  if (type === 'summary') {
    prompt = `You are an expert CV writer for the MENA region. Rewrite the following professional summary to be ATS-friendly, impactful, and concise. Provide 3 distinct variations (Junior, Mid-level, Senior tone).
    
    Current Text: "${currentText || 'Professional seeking new opportunities.'}"`;
  } else if (type === 'experience') {
    prompt = `You are an expert CV writer. Rewrite the following job description bullet point to use strong action verbs and imply results. Provide 3 distinct variations.
    
    Current Text: "${currentText || 'Worked on a project.'}"`;
  } else if (type === 'skills') {
    prompt = `Based on the following context/text, suggest a list of 5-8 relevant technical and soft skills (single strings).
    
    Context: "${currentText}"`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return ["No suggestions available."];
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return [
      "Error contacting AI service.",
      "Please check your internet connection.",
      "Try again in a few moments."
    ];
  }
};
