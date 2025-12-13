import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData, ATSAnalysis, JobMatchAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

export const generateResumeContent = async (
  section: string,
  context: string,
  currentContent: string
): Promise<string> => {
  if (!process.env.API_KEY) return "API Key missing. Cannot generate content.";

  let promptTemplate = "";
  
  // Custom templates based on section
  switch (section) {
    case 'experience':
      promptTemplate = `
        Task: Write or rewrite a professional job description for the experience section of a CV.
        Context: ${context}
        Current Content: "${currentContent}"
        
        Guidelines:
        - Use bullet points (•).
        - Start each bullet with a strong action verb (e.g., Orchestrated, Developed, Accelerated).
        - QUANTIFY achievements where possible (e.g., "Increased revenue by 20%", "Managed team of 5").
        - Focus on results and impact, not just duties.
        - Keep it concise and ATS-friendly.
      `;
      break;
    case 'summary':
      promptTemplate = `
        Task: Write a powerful professional summary for a CV.
        Context: ${context}
        Current Content: "${currentContent}"
        
        Guidelines:
        - Write 3-4 impactful sentences.
        - Highlight years of experience, key skills, and major achievements.
        - Tailor it to the job title provided in the context.
        - Avoid generic clichés like "hard worker".
      `;
      break;
    case 'projects':
      promptTemplate = `
        Task: Write a compelling project description.
        Context: ${context}
        Current Content: "${currentContent}"
        
        Guidelines:
        - Briefly explain what the project does.
        - Mention specific technologies used.
        - Highlight the problem solved or the value added.
      `;
      break;
    case 'skills':
       promptTemplate = `
        Task: Generate a comma-separated list of top technical and soft skills for a CV.
        Job Title/Context: ${context}
        Current Skills: "${currentContent}"
        
        Guidelines:
        - Return ONLY a comma-separated list.
        - Prioritize hard skills relevant to the job title.
        - Include key industry keywords for ATS optimization.
      `;
      break;
    default:
      promptTemplate = `
        Task: Write high-quality content for the "${section}" section of a CV.
        Context: ${context}
        Current Content: "${currentContent}"
        
        Guidelines:
        - Professional tone.
        - Concise and clear.
        - ATS-friendly phrasing.
      `;
  }

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: promptTemplate,
      config: {
        systemInstruction: `You are an expert ATS-friendly resume writer. Return ONLY the suggested text.`
      }
    });

    return response.text?.trim() || "Could not generate suggestion.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating suggestions. Please check your connection or API key.";
  }
};

export const analyzeATSScore = async (data: ResumeData): Promise<ATSAnalysis> => {
  if (!process.env.API_KEY) return { score: 0, tips: ["API Key missing."] };

  try {
    const prompt = `
      Analyze this resume JSON data for ATS compatibility and overall quality.
      Resume Data: ${JSON.stringify(data)}
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "Score from 0 to 100" },
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 critical, short improvements to increase the score"
            }
          }
        }
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text) as ATSAnalysis;
  } catch (error) {
    console.error("ATS Score Error", error);
    return { score: 0, tips: ["Could not analyze resume. Please try again."] };
  }
};

export const calculateJobMatch = async (resumeData: ResumeData, jobDescription: string): Promise<JobMatchAnalysis> => {
  if (!process.env.API_KEY) return { matchPercentage: 0, missingKeywords: [], advice: "API Key missing." };

  try {
    const prompt = `
      Compare this resume against the job description.
      Resume: ${JSON.stringify(resumeData)}
      Job Description: "${jobDescription.substring(0, 5000)}"
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchPercentage: { type: Type.INTEGER, description: "Match percentage from 0 to 100" },
            missingKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of critical keywords missing from the resume"
            },
            advice: { type: Type.STRING, description: "Short advice on how to improve the match" }
          }
        }
      }
    });

     const text = response.text || "{}";
    return JSON.parse(text) as JobMatchAnalysis;
  } catch (error) {
    console.error("Job Match Error", error);
    return { matchPercentage: 0, missingKeywords: [], advice: "Analysis failed. Please try again." };
  }
};

export const analyzeJobDescription = async (jobDescription: string): Promise<string[]> => {
  if (!process.env.API_KEY) return [];
  try {
    const prompt = `Extract top 15 technical skills from this JD as a list: ${jobDescription.substring(0, 2000)}`;
    const response = await ai.models.generateContent({ 
      model: model, 
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    const text = response.text || "[]";
    return JSON.parse(text) as string[];
  } catch (e) { return []; }
};