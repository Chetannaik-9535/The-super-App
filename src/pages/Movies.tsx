import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { searchMovieByGenre, fetchMovieDetails } from '../services/apiServices';
import { X, Star, Clock, Calendar } from 'lucide-react';

const MovieModal = ({ movieId, onClose }: { movieId: string, onClose: () => void }) => {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await fetchMovieDetails(movieId);
        setDetails(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [movieId]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
        <div className="animate-spin w-12 h-12 border-4 border-white/20 border-t-emerald-500 rounded-full"></div>
      </div>
    );
  }

  if (!details) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-zinc-900 border border-white/5 w-full max-w-4xl rounded-lg overflow-hidden shadow-2xl flex flex-col md:flex-row relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-10 bg-black/50 p-2 rounded text-white hover:bg-emerald-500 hover:text-black transition-colors border border-white/10">
          <X className="w-4 h-4" />
        </button>

        <div className="w-full md:w-2/5 aspect-[2/3] md:aspect-auto border-r border-white/5">
          <img 
            src={details.Poster !== 'N/A' ? details.Poster : 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=500&q=60'} 
            alt={details.Title} 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full md:w-3/5 p-8 flex flex-col">
          <div className="flex flex-wrap gap-2 mb-4">
            {details.Genre.split(', ').map((g: string) => (
              <span key={g} className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] rounded-full border border-emerald-500/20 uppercase font-bold tracking-tighter">{g}</span>
            ))}
          </div>

          <h2 className="text-3xl font-bold text-white mb-2 leading-tight">{details.Title}</h2>
          
          <div className="flex items-center gap-6 text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-6">
            <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-emerald-500"/> {details.Year}</div>
            <div className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-emerald-500"/> {details.Runtime}</div>
            <div className="flex items-center gap-1.5"><Star className="w-3 h-3 text-emerald-500"/> {details.imdbRating}</div>
          </div>

          <p className="text-slate-300 leading-relaxed text-sm mb-8 flex-1 italic border-l-2 border-emerald-500 pl-4 bg-zinc-950/50 py-2">{details.Plot}</p>

          <div className="bg-black/50 rounded p-4 border border-white/5 flex flex-col gap-2">
            <p className="text-xs text-slate-400"><span className="text-emerald-500 font-bold uppercase tracking-widest">Director:</span> {details.Director}</p>
            <p className="text-xs text-slate-400"><span className="text-emerald-500 font-bold uppercase tracking-widest">Cast:</span> {details.Actors}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Movies = () => {
  const navigate = useNavigate();
  const { categories } = useStore();
  const [moviesByCategory, setMoviesByCategory] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllMovies = async () => {
      const results: Record<string, any[]> = {};
      try {
        for (const cat of categories) {
          const movies = await searchMovieByGenre(cat);
          results[cat] = movies.filter((m: any) => m.Poster && m.Poster !== 'N/A');
        }
        setMoviesByCategory(results);
      } catch (err) {
        console.error("Failed to fetch movies:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllMovies();
  }, [categories]);

  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans p-6 flex flex-col">
      <header className="flex justify-between items-center mb-6 border-b border-white/10 pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-sm flex items-center justify-center font-black text-black">S</div>
          <h1 className="text-2xl font-light tracking-widest text-white">SUPER<span className="font-bold">APP</span></h1>
        </div>
        <div className="flex gap-6 text-[10px] uppercase tracking-widest font-medium text-slate-400">
          <button onClick={() => navigate('/dashboard')} className="hover:text-emerald-400 transition-colors">Dashboard</button>
          <span className="text-emerald-400 border-b border-emerald-400">Entertainment</span>
          <button onClick={() => navigate('/categories')} className="hover:text-emerald-400 transition-colors">Categories</button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
        <div className="flex items-center gap-2 mb-8 mt-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
          <h2 className="text-xs font-bold uppercase tracking-widest text-white">Curated Entertainment</h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin w-12 h-12 border-4 border-white/10 border-t-emerald-500 rounded-full"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {categories.map(category => (
              <div key={category} className="bg-zinc-900/50 p-6 rounded-lg border border-white/5">
                <h3 className="text-sm font-bold text-emerald-500 mb-4 uppercase tracking-widest">{category}</h3>
                <div className="flex overflow-x-auto gap-4 pb-4 custom-scrollbar snap-x">
                  {moviesByCategory[category]?.map(movie => (
                    <div 
                      key={`${category}-${movie.imdbID}`}
                      className="min-w-[160px] w-[160px] aspect-[2/3] shrink-0 rounded overflow-hidden cursor-pointer group relative snap-start border border-white/5 hover:border-emerald-500 transition-colors"
                      onClick={() => setSelectedMovie(movie.imdbID)}
                    >
                      <img src={movie.Poster} alt={movie.Title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                        <p className="text-white font-bold leading-tight line-clamp-2 text-sm">{movie.Title}</p>
                        <p className="text-emerald-500 text-[10px] font-bold mt-1">{movie.Year}</p>
                      </div>
                    </div>
                  ))}
                  {(!moviesByCategory[category] || moviesByCategory[category].length === 0) && (
                    <div className="text-slate-500 italic py-8 text-sm">No titles found.</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedMovie && (
        <MovieModal movieId={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
};

export default Movies;
