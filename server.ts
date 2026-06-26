import express from 'express';
import path from 'path';
import axios from 'axios';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/weather', async (req, res) => {
    try {
      const { city } = req.query;
      const apiKey = process.env.OPENWEATHER_API_KEY;
      if (!apiKey) {
        // Fallback mock data if no key provided
        return res.json({
          main: { temp: 24, pressure: 1012, humidity: 60 },
          wind: { speed: 5.5 },
          weather: [{ main: 'Clear', icon: '01d', description: 'clear sky' }],
          name: city || 'New Delhi'
        });
      }
      
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city as string)}&units=metric&appid=${apiKey}`);
      res.json(response.data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/news', async (req, res) => {
    try {
      const { category } = req.query;
      const apiKey = process.env.NEWS_API_KEY;
      if (!apiKey) {
        // Fallback mock data
        return res.json({
          articles: [
            { title: "Global Tech Summit Highlights AI Advances", description: "The annual summit brought together leaders from around the world.", urlToImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&h=300&fit=crop" },
            { title: "New Space Telescope Captures Stunning Images", description: "Scientists are amazed by the clarity of the new deep space photos.", urlToImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&h=300&fit=crop" },
            { title: "Advances in Renewable Energy Sources", description: "Solar and wind power are becoming more efficient than ever.", urlToImage: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=500&h=300&fit=crop" }
          ]
        });
      }
      
      const response = await axios.get(`https://newsapi.org/v2/top-headlines?category=${category || 'general'}&language=en&apiKey=${apiKey}`);
      res.json(response.data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/movies', async (req, res) => {
    try {
      const { search } = req.query;
      const apiKey = process.env.OMDB_API_KEY;
      if (!apiKey) {
        return res.json({
          Search: [
            { Title: "The Matrix", Year: "1999", imdbID: "tt0133093", Poster: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg" },
            { Title: "Inception", Year: "2010", imdbID: "tt1375666", Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg" }
          ]
        });
      }
      
      const response = await axios.get(`https://www.omdbapi.com/?s=${encodeURIComponent(search as string)}&type=movie&apikey=${apiKey}`);
      res.json(response.data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get('/api/movie-details', async (req, res) => {
    try {
      const { id } = req.query;
      const apiKey = process.env.OMDB_API_KEY;
      if (!apiKey) {
        return res.json({
          Title: "The Matrix",
          Year: "1999",
          Genre: "Action, Sci-Fi",
          Runtime: "136 min",
          imdbRating: "8.7",
          Plot: "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.",
          Actors: "Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss",
          Poster: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg"
        });
      }
      
      const response = await axios.get(`https://www.omdbapi.com/?i=${id}&plot=full&apikey=${apiKey}`);
      res.json(response.data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
