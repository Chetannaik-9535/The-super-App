import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { fetchCurrentWeather, fetchTopHeadlines } from '../services/apiServices';
import { Cloud, Droplets, Wind, User as UserIcon } from 'lucide-react';

export const ProfileWidget = () => {
  const { user, categories } = useStore();
  
  if (!user) return null;

  return (
    <div className="bg-zinc-900 border border-white/5 p-6 rounded-lg flex flex-col justify-between w-full h-full">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 p-[2px] shrink-0">
          <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center text-xl font-bold italic text-white">
            {user.name.substring(0, 2).toUpperCase()}
          </div>
        </div>
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-white leading-tight truncate">{user.name}</h2>
          <p className="text-xs text-slate-400 truncate">@{user.username}</p>
          <p className="text-[10px] mt-1 text-slate-500 truncate">{user.email}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-4 overflow-y-auto custom-scrollbar">
        {categories.map(cat => (
          <span key={cat} className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] rounded-full border border-emerald-500/20 uppercase font-bold tracking-tighter whitespace-nowrap">
            {cat}
          </span>
        ))}
      </div>
    </div>
  );
};

export const WeatherWidget = () => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        const data = await fetchCurrentWeather('San Francisco');
        setWeather(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadWeather();
  }, []);

  if (loading) return <div className="bg-zinc-900 border border-white/5 rounded-lg p-6 flex items-center justify-center w-full h-full"><div className="animate-spin w-8 h-8 border-4 border-white/20 border-t-emerald-500 rounded-full" /></div>;
  if (!weather) return <div className="bg-zinc-900 border border-white/5 rounded-lg p-6 flex items-center justify-center w-full h-full text-slate-500">Weather unavailable</div>;

  return (
    <div className="bg-zinc-900 border border-white/5 rounded-lg flex flex-col w-full h-full relative overflow-hidden">
      <div className="bg-emerald-600 h-1 absolute top-0 left-0 right-0"></div>
      <div className="p-6 flex flex-col justify-center h-full">
        <div className="flex justify-between items-center w-full">
          <div>
            <p className="text-4xl font-light text-white">{Math.round(weather.main.temp)}°C</p>
            <p className="text-[11px] uppercase tracking-widest text-slate-400 mt-1">{weather.name}</p>
            <p className="text-[10px] text-emerald-400 font-medium italic mt-0.5 capitalize">{weather.weather[0].description}</p>
          </div>
          <div className="text-right grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-slate-400">
            <p>Wind</p><p className="text-white text-right">{weather.wind.speed} km/h</p>
            <p>Hum.</p><p className="text-white text-right">{weather.main.humidity}%</p>
            <p>Pres.</p><p className="text-white text-right">{weather.main.pressure} mb</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NewsWidget = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const data = await fetchTopHeadlines();
        setArticles(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadNews();
  }, []);

  useEffect(() => {
    if (articles.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % articles.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [articles]);

  if (articles.length === 0) return <div className="bg-zinc-900 border border-white/5 rounded-lg w-full h-full flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-white/20 border-t-emerald-500 rounded-full" /></div>;

  const article = articles[currentIndex];

  return (
    <div className="bg-zinc-900 border border-white/5 rounded-lg overflow-hidden flex flex-col w-full h-full relative">
      <div className="h-40 bg-zinc-800 relative shrink-0">
        <img src={article.urlToImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&h=600&fit=crop'} alt={article.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent"></div>
        <div className="absolute bottom-3 left-3">
          <span className="bg-emerald-500 text-black text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">Trending</span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mb-2">News • {new Date(article.publishedAt || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
        <h4 className="text-lg font-bold text-white leading-snug mb-3 line-clamp-2">{article.title}</h4>
        <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-3">
          {article.description || 'No description available for this article.'}
        </p>
        <div className="mt-auto flex gap-1 pt-2">
          {articles.slice(0, 4).map((_, idx) => (
             <div key={idx} className={`h-1 flex-grow ${idx === currentIndex % 4 ? 'bg-emerald-500' : 'bg-white/10'}`}></div>
          ))}
        </div>
      </div>
    </div>
  );
};
