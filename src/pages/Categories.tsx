import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

const CATEGORIES = [
  { id: 'Action', color: 'bg-zinc-800' },
  { id: 'Comedy', color: 'bg-zinc-800' },
  { id: 'Drama', color: 'bg-zinc-800' },
  { id: 'Music', color: 'bg-zinc-800' },
  { id: 'Sports', color: 'bg-zinc-800' },
  { id: 'Thriller', color: 'bg-zinc-800' },
  { id: 'Fantasy', color: 'bg-zinc-800' },
  { id: 'Romance', color: 'bg-zinc-800' }
];

const Categories = () => {
  const navigate = useNavigate();
  const { setCategories } = useStore();
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState(false);

  const toggleCategory = (categoryId: string) => {
    setSelected(prev => {
      if (prev.includes(categoryId)) {
        const next = prev.filter(c => c !== categoryId);
        if (next.length < 3) setError(true);
        return next;
      } else {
        const next = [...prev, categoryId];
        if (next.length >= 3) setError(false);
        return next;
      }
    });
  };

  const handleNext = () => {
    if (selected.length < 3) {
      setError(true);
      return;
    }
    setCategories(selected);
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black font-sans p-8">
      {/* Left Column */}
      <div className="w-full md:w-1/3 flex flex-col justify-center mb-8 md:mb-0 md:pr-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-emerald-500 rounded-sm flex items-center justify-center font-black text-black">S</div>
          <h1 className="text-2xl font-light tracking-widest text-white">SUPER<span className="font-bold">APP</span></h1>
        </div>
        <h1 className="text-4xl font-bold text-white mb-6 leading-tight">Choose your<br/>entertainment<br/>category</h1>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {selected.map(cat => (
            <div key={cat} className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20 text-xs font-bold uppercase tracking-tighter">
              {cat}
              <button 
                onClick={() => toggleCategory(cat)}
                className="hover:text-white transition-colors ml-1"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        
        {error && (
          <p className="text-red-500 mt-4 flex items-center gap-2 text-xs uppercase tracking-widest font-bold">
            <span className="inline-flex w-4 h-4 items-center justify-center rounded-full bg-red-500 text-black">!</span>
            Minimum 3 categories
          </p>
        )}
      </div>

      {/* Right Column - Grid */}
      <div className="w-full md:w-2/3 flex flex-col items-end justify-center relative">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-3xl mb-24">
          {CATEGORIES.map(cat => (
            <div 
              key={cat.id}
              onClick={() => toggleCategory(cat.id)}
              className={`aspect-video md:aspect-[4/3] rounded-lg p-6 cursor-pointer border transition-all duration-300 flex items-center justify-center bg-zinc-900 ${selected.includes(cat.id) ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'border-white/5 hover:border-emerald-500/50'}`}
            >
              <h3 className="text-xl font-bold text-white tracking-widest uppercase">{cat.id}</h3>
            </div>
          ))}
        </div>

        <button 
          onClick={handleNext}
          className="absolute bottom-0 right-0 bg-emerald-500 text-black text-xs uppercase font-bold tracking-widest py-3 px-8 rounded hover:bg-emerald-400 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Categories;
