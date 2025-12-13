import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateResumeContent = async (
  section: string,
  context: string,
  currentContent: string
): Promise<string> => {
  try {
    const prompt = `
      You are an expert ATS-friendly resume writer.
      
      Task: Write or rewrite high-quality, professional content for the "${section}" section of a CV.
      
      User Context: "${context}"
      Current Content (if any): "${currentContent}"
      
      Guidelines:
      1. Use strong action verbs (e.g., Spearheaded, Developed, Optimized, Engineered).
      2. Focus on achievements and quantifiable results (numbers, percentages, efficiency gains) where possible.
      3. Keep the tone professional, concise, and impactful. Avoid fluff.
      4. For "Experience", provide 3-4 bullet points.
      5. For "Summary", provide a powerful, career-focused 3-sentence summary.
      6. Return ONLY the suggested text. No markdown formatting, no intro/outro.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || "Could not generate suggestion.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating suggestions. Please check your connection.";
  }
};

export const analyzeJobDescription = async (jobDescription: string): Promise<string[]> => {
  try {
    const prompt = `
      You are a career coach and ATS specialist.
      
      Task: Extract the most important technical and soft skills from the following job description.
      
      Job Description:
      "${jobDescription}"
      
      Output Rules:
      1. Return ONLY a comma-separated list of skills.
      2. Do not include labels like "Technical Skills:" or "Soft Skills:".
      3. Prioritize skills that are keywords likely to be scanned by an ATS.
      4. Limit to the top 15 most relevant skills.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text?.trim() || "";
    if (!text) return [];
    
    // Split by comma and cleanup
    return text.split(',').map(s => s.trim()).filter(s => s.length > 0);

  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
};
