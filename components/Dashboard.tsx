
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, StudyTask, DayPlan } from '../types';
import { getMentorResponse } from '../services/geminiService';

interface DashboardProps {
  profile: UserProfile;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ profile, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'plan' | 'mentor' | 'analysis' | 'profile'>('plan');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model', parts: { text: string }[] }[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isCollegeDay, setIsCollegeDay] = useState(true);
  const [slideModeActive, setSlideModeActive] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping]);

  // Rolling Day Plan (No hard dates)
  const day1Plan: DayPlan = {
    date: 'Rolling Plan Alpha',
    tasks: [
      { id: '1', subject: 'Chemistry', topic: 'Modern Physics Formulas', type: 'Light Prep', duration: '30m', priority: 'High', energyRequired: 'Low', description: 'Transit time task: Memorize De-Broglie & Photoelectric formulas.', isHighROI: true },
      { id: '2', subject: 'Maths', topic: 'Vector & 3D (Core)', type: 'Problem Solving', duration: '2.5h', priority: 'High', energyRequired: 'High', description: 'Main study slot: Dot/Cross product PYQs. Do this when fresh.', isHighROI: true },
      { id: '3', subject: 'Physics', topic: 'Modern Physics PYQs', type: 'Problem Solving', duration: '1.5h', priority: 'Medium', energyRequired: 'Medium', description: 'Post-college recovery slot: Dual nature questions.', isHighROI: true },
      { id: '4', subject: 'Chemistry', topic: 'Surface Chemistry', type: 'Revision', duration: '1h', priority: 'Medium', energyRequired: 'Low', description: 'Late night slot: Direct NCERT reading. Zero calculation.', isHighROI: true },
      { id: '5', subject: 'Maths', topic: 'Integration (Hard)', type: 'SKIP', duration: '0h', priority: 'Low', energyRequired: 'High', description: 'Too much time for too little marks right now. Skip.', isHighROI: false }
    ]
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    const msg = userInput.trim();
    setUserInput('');
    
    // Check for SLIDE protocol
    if (msg.toUpperCase() === 'SLIDE') {
      setSlideModeActive(true);
      setChatHistory(prev => [...prev, { role: 'user', parts: [{ text: "SLIDE" }] }]);
    } else {
      setChatHistory(prev => [...prev, { role: 'user', parts: [{ text: msg }] }]);
    }
    
    setIsTyping(true);
    
    // Inject current status into the prompt implicitly
    const statusMsg = `[Status: ${isCollegeDay ? 'Regular College Day' : 'Holiday/Self Study Day'}] ${msg}`;
    const response = await getMentorResponse(profile, chatHistory, statusMsg);
    
    setChatHistory(prev => [...prev, { role: 'model', parts: [{ text: response }] }]);
    setIsTyping(false);
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden text-slate-200">
      {/* Sidebar */}
      <div className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-8 border-b border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
            <h1 className="text-2xl font-black text-white tracking-tighter italic uppercase">System X</h1>
          </div>
          <p className="text-[10px] text-red-500 uppercase font-black tracking-[0.2em]">User: {profile.codename}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'plan', label: 'Rolling Plan', icon: '⚔️' },
            { id: 'mentor', label: 'Mentor Uplink', icon: '⚡' },
            { id: 'analysis', label: 'Kill Rate', icon: '🎯' },
            { id: 'profile', label: 'Acc Details', icon: '👤' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl font-bold transition-all ${
                activeTab === item.id ? 'bg-red-600/10 text-red-500 border border-red-600/20' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto space-y-4">
          <div className="p-4 bg-slate-800/30 border border-slate-700 rounded-2xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] uppercase font-black text-slate-500">College Day</span>
              <button 
                onClick={() => setIsCollegeDay(!isCollegeDay)}
                className={`w-10 h-5 rounded-full relative transition-colors ${isCollegeDay ? 'bg-red-600' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isCollegeDay ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
            <p className="text-[10px] text-slate-400 italic">
              {isCollegeDay ? 'Mode: Recovery + Sprints' : 'Mode: Maximum Output'}
            </p>
          </div>

          <button 
            onClick={onLogout}
            className="w-full p-3 bg-slate-800 hover:bg-red-950/30 text-slate-500 hover:text-red-500 border border-slate-700 hover:border-red-900/50 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
          >
            TERMINATE SESSION
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-20 bg-slate-950 border-b border-slate-900 flex items-center justify-between px-10">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-xs font-black uppercase text-slate-500">Status:</span>
              <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${isCollegeDay ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
                {isCollegeDay ? 'College Recovery Active' : 'Maximum Output Protocol'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
              LINKED_ID: {profile.codename}
            </div>
            <button 
              onClick={onLogout}
              className="px-4 py-2 border border-slate-800 rounded-lg text-[10px] font-black text-slate-500 hover:text-red-500 hover:border-red-900/50 uppercase tracking-widest transition-all"
            >
              LOGOUT
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar p-10">
          {activeTab === 'plan' && (
            <div className="max-w-4xl space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex justify-between items-start border-b border-slate-800 pb-8">
                <div>
                  <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase">Plan Alpha</h2>
                  <p className="text-slate-500 mt-4 text-lg max-w-xl">
                    Internal Clock: <span className="text-red-500 font-bold uppercase tracking-widest">{profile.jeeAttempt === 'January' ? 'Emergency Phase' : 'Improvement Phase'}</span>. 
                    {isCollegeDay && " Energy optimization active for college schedule."}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {day1Plan.tasks.map((task, idx) => (
                  <div key={task.id} className={`group relative flex items-center gap-8 p-8 border rounded-3xl transition-all ${
                    task.type === 'SKIP' ? 'bg-slate-950 border-slate-900 opacity-40 grayscale' : 'bg-slate-900/40 border-slate-800 hover:border-red-600/50 hover:bg-slate-900/60 shadow-xl'
                  } ${slideModeActive && task.type !== 'SKIP' ? 'border-green-500/50 bg-green-900/10' : ''}`}>
                    <div className={`text-3xl font-black italic ${task.type === 'SKIP' ? 'text-slate-800' : 'text-slate-700 group-hover:text-red-600'}`}>0{idx + 1}</div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                          task.subject === 'Maths' ? 'bg-blue-900/30 text-blue-400' : task.subject === 'Physics' ? 'bg-purple-900/30 text-purple-400' : 'bg-emerald-900/30 text-emerald-400'
                        }`}>{task.subject}</span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase bg-slate-800 text-slate-400`}>
                          Energy: {task.energyRequired}
                        </span>
                        {task.isHighROI && (
                          <span className="text-[10px] font-black bg-red-600 text-white px-2 py-0.5 rounded italic">HIGH ROI</span>
                        )}
                        {slideModeActive && task.type !== 'SKIP' && (
                          <span className="text-[10px] font-black text-green-500 uppercase ml-auto">✓ Completed</span>
                        )}
                      </div>
                      <h3 className="text-2xl font-black text-white tracking-tight">{task.topic}</h3>
                      <p className="text-slate-400 mt-1 font-medium leading-tight">{task.description}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[10px] text-slate-600 uppercase font-black mb-1">{task.type}</div>
                      <div className={`text-3xl font-black ${task.type === 'SKIP' ? 'text-slate-800 line-through' : 'text-white'}`}>{task.duration}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'mentor' && (
            <div className="flex flex-col h-[calc(100vh-14rem)] max-w-4xl mx-auto border border-slate-900 rounded-3xl bg-slate-900/20 overflow-hidden relative">
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8"
              >
                {chatHistory.length === 0 && (
                  <div className="text-center py-20 opacity-30">
                    <div className="text-8xl mb-6">⛓️</div>
                    <h3 className="text-3xl font-black text-white italic uppercase">Awaiting Status Report</h3>
                    <p className="text-slate-400 text-lg mt-2 font-medium">Attempt Phase: <span className="text-red-500">{profile.jeeAttempt}</span>. Type <span className="text-white font-bold">SLIDE</span> to finish the day.</p>
                  </div>
                )}
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-6 rounded-3xl ${
                      msg.role === 'user' 
                      ? 'bg-red-600 text-white font-bold rounded-tr-none shadow-xl shadow-red-900/20' 
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none prose prose-invert prose-red max-w-none'
                    }`}>
                      {msg.parts[0].text === 'SLIDE' ? (
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">🛝</span>
                          <span className="tracking-widest uppercase italic font-black">DAY SLIDE: ALL TASKS COMPLETED</span>
                        </div>
                      ) : (
                        <div dangerouslySetInnerHTML={{ __html: msg.parts[0].text.replace(/\n/g, '<br/>') }} />
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-900 px-6 py-4 rounded-full border border-slate-800">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-6 bg-slate-900/50 border-t border-slate-800">
                <div className="relative">
                  <input
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={slideModeActive ? "Type your answer..." : "Report status or type SLIDE to finish day..."}
                    className="w-full p-6 bg-slate-950 border-2 border-slate-800 rounded-2xl text-white font-bold outline-none focus:border-red-600 transition-all pr-20 shadow-inner"
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-4 bg-red-600 hover:bg-red-500 rounded-xl transition-all active:scale-90 shadow-lg shadow-red-900/20"
                  >
                    ⚡
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="max-w-5xl space-y-10">
              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-10">
                <h3 className="text-2xl font-black mb-6 text-white uppercase italic">Internal Metrics</h3>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="p-6 bg-slate-950/50 rounded-2xl border border-slate-800">
                      <p className="text-xs text-slate-500 uppercase font-black mb-1">Time Urgency</p>
                      <p className="text-3xl font-black text-red-500 italic uppercase">
                        {profile.jeeAttempt === 'January' ? 'Extreme' : 'Moderate'}
                      </p>
                    </div>
                    <div className="p-6 bg-slate-950/50 rounded-2xl border border-slate-800">
                      <p className="text-xs text-slate-500 uppercase font-black mb-1">Recovery Delta</p>
                      <p className="text-3xl font-black text-blue-500 italic">OPTIMIZED</p>
                    </div>
                  </div>
                  <div className="bg-red-950/10 border border-red-900/20 rounded-2xl p-6">
                    <h4 className="font-black text-red-500 uppercase text-xs mb-4">Phase Strategy</h4>
                    <p className="text-sm text-slate-300 leading-relaxed italic">
                      {profile.jeeAttempt === 'January' ? 
                        "Currently in Marks Extraction mode. Do not attempt new derivations. Focus purely on PYQ patterns and formula application." : 
                        "Currently in Balanced Learning mode. Strategic inclusion of high-ROI new chapters allowed. Maintain strict problem-solving/theory ratio."
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-4xl space-y-8 animate-in fade-in zoom-in-95 duration-500">
              <div className="flex items-center justify-between border-b border-slate-800 pb-6">
                <div>
                  <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Academic Account</h2>
                  <p className="text-slate-500 mt-1">Diagnostic parameters locked for {profile.codename}.</p>
                </div>
                <div className="px-4 py-2 bg-red-600/10 border border-red-600/20 rounded-xl">
                  <span className="text-red-500 font-black italic">UID: SYSTEM-X-{profile.codename.toUpperCase()}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-6">
                  <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest">Base Intel</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <span className="text-slate-500 font-bold uppercase text-xs">Target Attempt</span>
                      <span className="text-red-500 font-black italic">{profile.jeeAttempt}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <span className="text-slate-500 font-bold uppercase text-xs">Current Year</span>
                      <span className="text-white font-black italic">{profile.collegeYear}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <span className="text-slate-500 font-bold uppercase text-xs">Coverage Level</span>
                      <span className="text-white font-black italic">{profile.level}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <span className="text-slate-500 font-bold uppercase text-xs">Target Percentile</span>
                      <span className="text-blue-500 font-black italic">{profile.targetPercentile}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-6">
                  <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest">Environment Intel</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <span className="text-slate-500 font-bold uppercase text-xs">College Student</span>
                      <span className={`font-black italic ${profile.isCollegeStudent ? 'text-green-500' : 'text-slate-500'}`}>
                        {profile.isCollegeStudent ? 'YES' : 'NO'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <span className="text-slate-500 font-bold uppercase text-xs">College Hours</span>
                      <span className="text-white font-black italic">{profile.collegeHours || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <span className="text-slate-500 font-bold uppercase text-xs">Post-College Energy</span>
                      <span className={`font-black italic ${
                        profile.energyProfile === 'High' ? 'text-red-500' : profile.energyProfile === 'Medium' ? 'text-orange-500' : 'text-green-500'
                      }`}>
                        {profile.energyProfile}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8">
                <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Protocol Efficiency</h3>
                <div className="grid grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-1 bg-slate-800 mx-auto mb-2 rounded-full overflow-hidden">
                      <div className="h-full bg-red-600 w-[65%]" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Focus Density</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-1 bg-slate-800 mx-auto mb-2 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[80%]" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Pattern Recognition</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-1 bg-slate-800 mx-auto mb-2 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 w-[40%]" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Recovery Alpha</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
