export interface Education {
  id: string;
  institution: string;
  degree: string;
  year: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface ResumeData {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  linkedin: string;
  summary: string;
  skills: string[];
  education: Education[];
  experience: Experience[];
}

export interface AtsAnalysis {
  score: number;
  missingKeywords: string[];
  tips: string[];
}

export enum PaymentStatus {
  IDLE = 'IDLE',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}