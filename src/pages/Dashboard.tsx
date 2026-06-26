import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileWidget, WeatherWidget, NewsWidget } from '../components/Widgets';
import { TimerWidget, NotesWidget } from '../components/Widgets2';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-slate-200 flex flex-col p-6 font-sans">
      <header className="flex justify-between items-center mb-6 border-b border-white/10 pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-sm flex items-center justify-center font-black text-black">S</div>
          <h1 className="text-2xl font-light tracking-widest text-white">SUPER<span className="font-bold">APP</span></h1>
        </div>
        <div className="flex gap-6 text-[10px] uppercase tracking-widest font-medium text-slate-400">
          <span className="text-emerald-400 border-b border-emerald-400">Dashboard</span>
          <button onClick={() => navigate('/movies')} className="hover:text-emerald-400 transition-colors">Entertainment</button>
          <button onClick={() => navigate('/categories')} className="hover:text-emerald-400 transition-colors">Categories</button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-6 gap-4 flex-grow">
        <div className="md:col-span-4 md:row-span-2">
          <ProfileWidget />
        </div>
        <div className="md:col-span-4 md:row-span-2">
          <WeatherWidget />
        </div>
        <div className="md:col-span-4 md:row-span-2">
          <TimerWidget />
        </div>
        <div className="md:col-span-8 md:row-span-4">
          <NotesWidget />
        </div>
        <div className="md:col-span-4 md:row-span-4">
          <NewsWidget />
        </div>
      </div>

      <footer className="mt-4 flex justify-between items-center text-[10px] text-slate-500 border-t border-white/5 pt-4 shrink-0">
        <div className="flex gap-4">
          <span>Version 1.0.4-stable</span>
          <span>&copy; {new Date().getFullYear()} SUPER APP INC.</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="uppercase tracking-widest font-semibold text-emerald-500">Systems Operational</span>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
