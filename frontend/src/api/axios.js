import axios from 'axios';

// Налаштування базового URL для API
const api = axios.create({
  baseURL: window.location.origin,
});

export default api;
