import axios from 'axios';

export const fetchCurrentWeather = async (city: string) => {
  const response = await axios.get(`/api/weather?city=${encodeURIComponent(city)}`);
  return response.data;
};

export const fetchTopHeadlines = async (category = "general") => {
  const response = await axios.get(`/api/news?category=${category}`);
  return response.data.articles || [];
};

export const searchMovieByGenre = async (query: string) => {
  const response = await axios.get(`/api/movies?search=${encodeURIComponent(query)}`);
  return response.data.Search || [];
};

export const fetchMovieDetails = async (imdbID: string) => {
  const response = await axios.get(`/api/movie-details?id=${imdbID}`);
  return response.data;
};
