export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  link?: string;
  description: string;
  technologies: string[];
}

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    linkedin: string;
    location: string;
    jobTitle: string;
  };
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  projects: ProjectItem[];
}

export type SectionType = 'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'projects';

export interface PaymentState {
  isVerified: boolean;
  referenceNumber: string;
}
