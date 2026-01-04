
export interface UserProfile {
  codename: string;
  level: 'Beginner' | 'Average' | 'Strong';
  strengths: string;
  weaknesses: string;
  dailyStudyTime: number;
  targetPercentile: string;
  isCollegeStudent: boolean;
  collegeHours: string;
  energyProfile: 'Low' | 'Medium' | 'High';
  jeeAttempt: 'January' | 'April';
  collegeYear: '1st Year' | '2nd Year';
  diagnosticAnswers?: string[];
}

export interface StudyTask {
  id: string;
  subject: 'Physics' | 'Chemistry' | 'Maths';
  topic: string;
  type: 'Theory' | 'Problem Solving' | 'Revision' | 'SKIP' | 'Light Prep';
  duration: string;
  priority: 'High' | 'Medium' | 'Low';
  energyRequired: 'Low' | 'Medium' | 'High';
  description: string;
  isHighROI?: boolean;
}

export interface DayPlan {
  date: string;
  tasks: StudyTask[];
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
