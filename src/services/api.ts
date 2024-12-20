import axios from 'axios';

const api = axios.create({
  baseURL: 'https://hbqoafwfjbosmsukeznn.supabase.co',
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhicW9hZndmamJvc21zdWtlem5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYxOTE5MzEsImV4cCI6MjA0MTc2NzkzMX0.d_kQm_SqosA7rxNrWVGi9VBAfq3Hpka4iwzcgmnwAUs',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhicW9hZndmamJvc21zdWtlem5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYxOTE5MzEsImV4cCI6MjA0MTc2NzkzMX0.d_kQm_SqosA7rxNrWVGi9VBAfq3Hpka4iwzcgmnwAUs'
  }
});

// Interceptor para tratar erros globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // O servidor respondeu com um status de erro
      console.error('Erro na resposta:', error.response.data);
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error('Erro na requisição:', error.request);
    } else {
      // Algo aconteceu na configuração da requisição
      console.error('Erro:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
