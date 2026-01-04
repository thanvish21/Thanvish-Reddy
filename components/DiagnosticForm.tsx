
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface DiagnosticFormProps {
  onSubmit: (profile: UserProfile) => void;
  onLogout?: () => void;
}

export const DiagnosticForm: React.FC<DiagnosticFormProps> = ({ onSubmit, onLogout }) => {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>({
    codename: '',
    level: 'Average',
    strengths: '',
    weaknesses: '',
    dailyStudyTime: 12,
    targetPercentile: '98+',
    isCollegeStudent: true,
    collegeHours: '8 AM - 3 PM',
    energyProfile: 'Medium',
    jeeAttempt: 'January',
    collegeYear: '2nd Year',
    diagnosticAnswers: []
  });

  const diagnosticQuestions = [
    { key: 'jeeAttempt', q: "Which attempt are you targeting?", type: 'select', options: ['January', 'April'] },
    { key: 'collegeYear', q: "Current college year?", type: 'select', options: ['1st Year', '2nd Year'] },
    { key: 'isCollegeStudent', q: "Do you attend college regularly?", type: 'select', options: ['Yes', 'No'] },
    { key: 'collegeHours', q: "Typical college hours? (e.g., 8am-4pm).", type: 'text', condition: (p: any) => p.isCollegeStudent },
    { key: 'energyProfile', q: "Fatigue level after college? (High, Medium, Low)", type: 'select', options: ['High', 'Medium', 'Low'], condition: (p: any) => p.isCollegeStudent },
    { key: 'level', q: "Current syllabus coverage? (Beginner, Average, Strong)", type: 'select', options: ['Beginner', 'Average', 'Strong'] },
    { key: 'dailyStudyTime', q: "Effective hours you can grind AFTER college?", type: 'number', default: 6 },
    { key: 'targetPercentile', q: "Target percentile or marks improvement?", type: 'text' }
  ];

  const handleNext = (val: any) => {
    let value = val;
    const currentKey = diagnosticQuestions[step].key;
    
    if (currentKey === 'isCollegeStudent') value = val === 'Yes';
    
    const updatedProfile = { ...profile, [currentKey]: value };
    setProfile(updatedProfile);
    
    let nextStep = step + 1;
    while (nextStep < diagnosticQuestions.length && diagnosticQuestions[nextStep].condition && !diagnosticQuestions[nextStep].condition(updatedProfile)) {
      nextStep++;
    }

    if (nextStep < diagnosticQuestions.length) {
      setStep(nextStep);
    } else {
      onSubmit(updatedProfile);
    }
  };

  const currentQ = diagnosticQuestions[step];

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-slate-900 border border-red-900/30 rounded-3xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <div className="text-6xl font-black text-red-500 italic">SYSTEM-X</div>
      </div>
      
      <div className="mb-8 relative flex justify-between items-start">
        <div>
          <span className="text-xs font-bold text-red-500 tracking-widest uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            Protocol Assessment
          </span>
          <h2 className="text-3xl font-black mt-2 text-white italic uppercase tracking-tighter">Diagnostic {step + 1}</h2>
        </div>
        {onLogout && (
          <button 
            onClick={onLogout}
            className="text-[10px] font-black text-slate-600 hover:text-red-500 uppercase tracking-[0.2em] transition-colors"
          >
            ABORT
          </button>
        )}
      </div>

      <div className="h-1.5 w-full bg-slate-800 mb-8 rounded-full overflow-hidden">
        <div className="h-full bg-red-600 transition-all duration-500 ease-out" style={{ width: `${((step + 1) / diagnosticQuestions.length) * 100}%` }} />
      </div>

      <div className="space-y-6">
        <p className="text-xl text-slate-100 font-medium leading-relaxed">{currentQ.q}</p>
        
        {currentQ.type === 'select' && (
          <div className="grid gap-3">
            {currentQ.options?.map(opt => (
              <button
                key={opt}
                onClick={() => handleNext(opt)}
                className="p-5 text-left bg-slate-800 hover:bg-red-900/20 border border-slate-700 hover:border-red-500/50 rounded-2xl transition-all font-bold text-lg"
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {(currentQ.type === 'text' || currentQ.type === 'number') && (
          <div className="space-y-4">
            <input
              type={currentQ.type}
              autoFocus
              className="w-full p-5 bg-slate-950 border border-slate-800 rounded-2xl text-white text-lg focus:ring-2 focus:ring-red-600 outline-none transition-all"
              placeholder="..."
              defaultValue={currentQ.default}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleNext(currentQ.type === 'number' ? parseInt((e.target as HTMLInputElement).value) : (e.target as HTMLInputElement).value);
              }}
            />
            <button
              onClick={() => {
                const input = document.querySelector('input') as HTMLInputElement;
                handleNext(currentQ.type === 'number' ? parseInt(input.value) : input.value);
              }}
              className="w-full p-5 bg-red-600 hover:bg-red-500 rounded-2xl font-black text-lg shadow-lg shadow-red-900/20 transition-transform active:scale-95"
            >
              CONTINUE
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
