
import React, { useState, useEffect } from 'react';
import { UserProfile } from './types';
import { DiagnosticForm } from './components/DiagnosticForm';
import { Dashboard } from './components/Dashboard';
import { Login } from './components/Login';

const App: React.FC = () => {
  const [codename, setCodename] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Load existing profile from localStorage if available
  useEffect(() => {
    const savedProfile = localStorage.getItem('system_x_profile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setProfile(parsed);
        setCodename(parsed.codename);
      } catch (e) {
        localStorage.removeItem('system_x_profile');
      }
    }
  }, []);

  const handleLogin = (name: string) => {
    setCodename(name);
    // If the saved profile codename matches, we're good. 
    // Otherwise, if it's a new codename, we proceed to diagnostic.
    if (profile && profile.codename !== name) {
      setProfile(null);
    }
  };

  const handleLogout = () => {
    setCodename(null);
    setProfile(null);
    localStorage.removeItem('system_x_profile');
  };

  const handleDiagnosticComplete = (newProfile: UserProfile) => {
    const finalProfile = { ...newProfile, codename: codename! };
    setProfile(finalProfile);
    localStorage.setItem('system_x_profile', JSON.stringify(finalProfile));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-red-600 selection:text-white">
      {!codename ? (
        <div className="container mx-auto px-4 py-20 flex flex-col items-center">
          <div className="text-center mb-12 relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <span className="text-[15rem] font-black italic">X</span>
            </div>
            <h1 className="text-8xl font-black tracking-tighter text-white mb-4 italic relative z-10">
              SYSTEM <span className="text-red-600">X</span>
            </h1>
            <p className="text-xl text-slate-500 font-bold tracking-[0.4em] uppercase relative z-10">
              Personal JEE Combat Mentor
            </p>
          </div>
          <Login onLogin={handleLogin} />
        </div>
      ) : !profile ? (
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-2xl mx-auto mb-10 text-center relative">
            <button 
              onClick={handleLogout}
              className="absolute -top-4 -left-4 p-2 text-slate-500 hover:text-red-500 text-xs font-black uppercase tracking-widest transition-colors"
            >
              ← BACK TO LOGIN
            </button>
            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">
              Welcome, <span className="text-red-600">{codename}</span>
            </h2>
            <p className="text-slate-500 mt-2 font-bold uppercase tracking-widest text-sm">
              Sourcing initial parameters for combat optimization.
            </p>
          </div>
          <DiagnosticForm onSubmit={handleDiagnosticComplete} onLogout={handleLogout} />
        </div>
      ) : (
        <Dashboard profile={profile} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;
