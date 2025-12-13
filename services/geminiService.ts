import { GoogleGenAI } from "@google/genai";
import { ResumeData, ATSAnalysis, JobMatchAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

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
      2. Focus on achievements and quantifiable results.
      3. Keep the tone professional, concise, and impactful.
      4. For "Experience", provide 3-4 bullet points.
      5. For "Summary", provide a powerful 3-sentence summary.
      6. Return ONLY the suggested text.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text?.trim() || "Could not generate suggestion.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating suggestions. Please check your connection.";
  }
};

export const analyzeATSScore = async (data: ResumeData): Promise<ATSAnalysis> => {
  try {
    const prompt = `
      Analyze this resume JSON data for ATS compatibility and overall quality.
      Resume Data: ${JSON.stringify(data)}
      
      Return a JSON object with this exact structure (no markdown):
      {
        "score": number (0-100),
        "tips": ["string", "string", "string"] (3 critical, short improvements)
      }
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    const text = response.text || "{}";
    return JSON.parse(text) as ATSAnalysis;
  } catch (error) {
    console.error("ATS Score Error", error);
    return { score: 0, tips: ["Could not analyze resume."] };
  }
};

export const calculateJobMatch = async (resumeData: ResumeData, jobDescription: string): Promise<JobMatchAnalysis> => {
  try {
    const prompt = `
      Compare this resume against the job description.
      Resume: ${JSON.stringify(resumeData)}
      Job Description: "${jobDescription.substring(0, 2000)}"
      
      Return a JSON object with this exact structure (no markdown):
      {
        "matchPercentage": number (0-100),
        "missingKeywords": ["string", "string", "string"],
        "advice": "Short summary of how to improve match"
      }
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

     const text = response.text || "{}";
    return JSON.parse(text) as JobMatchAnalysis;
  } catch (error) {
    console.error("Job Match Error", error);
    return { matchPercentage: 0, missingKeywords: [], advice: "Analysis failed." };
  }
};

export const analyzeJobDescription = async (jobDescription: string): Promise<string[]> => {
  // Legacy function kept for backward compatibility if needed, but we prefer calculateJobMatch
  try {
    const prompt = `Extract top 15 technical skills from this JD as a comma-separated list: ${jobDescription.substring(0, 1000)}`;
    const response = await ai.models.generateContent({ model: model, contents: prompt });
    return response.text?.split(',').map(s => s.trim()) || [];
  } catch (e) { return []; }
};