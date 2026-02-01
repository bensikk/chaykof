// API Configuration
// Це дозволяє змінювати backend URL залежно від середовища

const isDevelopment = import.meta.env.DEV;

// Отримуємо hostname
const hostname = window.location.hostname;

// Визначаємо backend URL
let API_BASE_URL = '/api';
let BACKEND_HOST = '';

if (isDevelopment) {
  // На localhost фронтенд і бекенд на різних портах
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    API_BASE_URL = 'http://localhost:5000/api';
    BACKEND_HOST = 'http://localhost:5000';
  } else {
    // Для IP адрес (мобільний телефон)
    API_BASE_URL = `http://${hostname}:5000/api`;
    BACKEND_HOST = `http://${hostname}:5000`;
  }
}

export default API_BASE_URL;
export { BACKEND_HOST };
