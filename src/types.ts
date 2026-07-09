export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Grant {
  id: string;
  title: string;
  provider: string;
  amount: number;
  deadline: string;
  category: string;
  eligibility: string;
  description: string;
  difficulty?: string;
  educationLevel?: string;
  externalLink?: string;
  logoUrl?: string;
  deadlineDays?: number;
}

export interface CareerStep {
  stepNumber: number;
  title: string;
  description: string;
  keySkills: string[];
  recommendedActions: string[];
}

export interface CareerRoadmap {
  role: string;
  steps: CareerStep[];
}

export interface EqualizerInput {
  role: string;
  experience: number;
  industry: string;
  location: string;
  currentSalary: number;
}

export interface SalaryInsights {
  averageIndustrySalary: number;
  fairMarketValue: number;
  estimatedGapPercent: number;
  negotiationTips: string[];
  empoweringClosing: string;
}
