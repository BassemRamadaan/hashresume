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

export interface RubricItem {
  category: string;
  score: number;
  maxScore?: number;
  status: 'good' | 'warning' | 'critical';
  tips: string[];
}

export interface AtsAnalysis {
  overallScore: number;
  breakdown: RubricItem[];
  missingKeywords: string[];
}

export enum PaymentStatus {
  IDLE = 'IDLE',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}