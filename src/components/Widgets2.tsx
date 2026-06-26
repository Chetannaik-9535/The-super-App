import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { Play, Pause, Square } from 'lucide-react';

export const NotesWidget = () => {
  const { notes, setNotes } = useStore();

  return (
    <div className="bg-zinc-900 border border-white/5 rounded-lg p-6 flex flex-col w-full h-full">
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h3 className="text-xs uppercase tracking-widest font-bold text-white flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span> Personal Memos
        </h3>
        <span className="text-[10px] text-slate-500 italic">Auto-saved</span>
      </div>
      <textarea
        className="flex-grow text-sm font-serif leading-relaxed text-slate-300 bg-zinc-950/50 p-4 rounded border border-white/5 italic resize-none outline-none placeholder:text-slate-600 custom-scrollbar"
        placeholder="Type your notes here..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
    </div>
  );
};

export const TimerWidget = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create an alarm sound
    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
    audioRef.current = audio;
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (isActive && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds(rem => rem - 1);
      }, 1000);
    } else if (isActive && remainingSeconds === 0) {
      setIsActive(false);
      audioRef.current?.play();
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, remainingSeconds]);

  const handleStart = () => {
    if (!isActive && remainingSeconds === 0) {
      const total = hours * 3600 + minutes * 60 + seconds;
      if (total > 0) {
        setTotalSeconds(total);
        setRemainingSeconds(total);
        setIsActive(true);
      }
    } else if (!isActive && remainingSeconds > 0) {
      setIsActive(true); // Resume
    }
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleStop = () => {
    setIsActive(false);
    setRemainingSeconds(0);
    setTotalSeconds(0);
  };

  const incHour = () => !isActive && setHours(h => h < 23 ? h + 1 : h);
  const decHour = () => !isActive && setHours(h => h > 0 ? h - 1 : h);
  const incMin = () => !isActive && setMinutes(m => m < 59 ? m + 1 : m);
  const decMin = () => !isActive && setMinutes(m => m > 0 ? m - 1 : m);
  const incSec = () => !isActive && setSeconds(s => s < 59 ? s + 1 : s);
  const decSec = () => !isActive && setSeconds(s => s > 0 ? s - 1 : s);

  const displayHours = Math.floor(remainingSeconds / 3600);
  const displayMinutes = Math.floor((remainingSeconds % 3600) / 60);
  const displaySecs = remainingSeconds % 60;

  const percentage = totalSeconds > 0 ? (remainingSeconds / totalSeconds) * 100 : 100;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-zinc-900 border border-white/5 rounded-lg p-6 flex flex-col items-center justify-center relative overflow-hidden w-full h-full">
      <div className="flex w-full h-full items-center justify-between gap-4">
        <div className="flex flex-col items-center relative shrink-0">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-zinc-800" />
            <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="4" fill="transparent" 
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="text-emerald-500 transition-all duration-1000 ease-linear" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center mt-1">
            <span className="text-3xl font-mono text-white tracking-tighter">{String(displayHours).padStart(2, '0')}:{String(displayMinutes).padStart(2, '0')}:{String(displaySecs).padStart(2, '0')}</span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-bold">Remaining</span>
          </div>
        </div>

        <div className="flex flex-col h-full justify-center px-2 flex-1">
          <div className="flex justify-between text-center mb-6 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            <div className="flex flex-col items-center gap-1">
              <button onClick={incHour} className="hover:text-emerald-400 transition-colors">▲</button>
              <span className="text-2xl text-white font-mono">{String(hours).padStart(2, '0')}</span>
              <button onClick={decHour} className="hover:text-emerald-400 transition-colors">▼</button>
            </div>
            <div className="flex flex-col justify-center text-xl pb-5">:</div>
            <div className="flex flex-col items-center gap-1">
              <button onClick={incMin} className="hover:text-emerald-400 transition-colors">▲</button>
              <span className="text-2xl text-white font-mono">{String(minutes).padStart(2, '0')}</span>
              <button onClick={decMin} className="hover:text-emerald-400 transition-colors">▼</button>
            </div>
            <div className="flex flex-col justify-center text-xl pb-5">:</div>
            <div className="flex flex-col items-center gap-1">
              <button onClick={incSec} className="hover:text-emerald-400 transition-colors">▲</button>
              <span className="text-2xl text-white font-mono">{String(seconds).padStart(2, '0')}</span>
              <button onClick={decSec} className="hover:text-emerald-400 transition-colors">▼</button>
            </div>
          </div>
          <div className="flex gap-2 justify-center w-full">
            {isActive ? (
               <button onClick={handlePause} className="px-2 py-1.5 text-[10px] uppercase font-bold tracking-widest bg-emerald-500 text-black rounded flex-1">Pause</button>
            ) : (
               <button onClick={handleStart} className="px-2 py-1.5 text-[10px] uppercase font-bold tracking-widest bg-emerald-500 text-black rounded flex-1">Start</button>
            )}
            <button onClick={handleStop} className="px-2 py-1.5 text-[10px] uppercase font-bold tracking-widest border border-white/20 text-white rounded flex-1">Reset</button>
          </div>
        </div>
      </div>
    </div>
  );
};
