
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (codename: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [input, setInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setIsVerifying(true);
    // Simulate system verification
    setTimeout(() => {
      onLogin(input);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in duration-700">
      <div className="w-full max-w-md p-10 bg-slate-900/50 border border-slate-800 rounded-[2rem] shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50" />
        
        <div className="text-center mb-10">
          <div className="inline-block p-4 rounded-2xl bg-red-600/10 border border-red-600/20 mb-4">
            <span className="text-3xl">🔐</span>
          </div>
          <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">Identity Verification</h2>
          <p className="text-slate-500 text-sm mt-2 font-bold tracking-widest uppercase">System X Access Point</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block ml-1">
              Candidate Codename
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="E.g. AIR_ONE_2025"
              disabled={isVerifying}
              className="w-full p-5 bg-slate-950 border border-slate-800 rounded-2xl text-white font-mono text-lg focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all placeholder:text-slate-800"
            />
          </div>

          <button
            type="submit"
            disabled={isVerifying || !input.trim()}
            className={`w-full p-5 rounded-2xl font-black text-lg transition-all relative overflow-hidden flex items-center justify-center gap-3 ${
              isVerifying 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
              : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/20 active:scale-95'
            }`}
          >
            {isVerifying ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-600 border-t-red-600 rounded-full animate-spin" />
                VERIFYING...
              </>
            ) : (
              'INITIALIZE LINK'
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-800/50">
          <div className="flex justify-between items-center text-[10px] font-black text-slate-600 tracking-widest">
            <span>SECURE LINK: ACTIVE</span>
            <span>ENCRYPTION: AES-256</span>
          </div>
        </div>
      </div>
      
      <p className="mt-8 text-slate-600 text-xs font-bold uppercase tracking-[0.3em] animate-pulse">
        Direct Mentor Uplink Only
      </p>
    </div>
  );
};
