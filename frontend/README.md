# Frontend - CHAYKOF & LOFT BAR

React + Vite додаток для веб-сайту кафе.

## 📦 Встановлення

```bash
npm install
```

## 🚀 Запуск

### Розробка
```bash
npm run dev
```

Сайт запуститься на `http://localhost:3000`

### Будування
```bash
npm run build
```

### Preview
```bash
npm run preview
```

## 📁 Структура

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx         # Шапка з навігацією
│   │   ├── Footer.jsx         # Підвал
│   │   └── ProductCard.jsx    # Картка товару
│   ├── context/
│   │   ├── AuthContext.jsx    # Контекст аутентифікації
│   │   └── CartContext.jsx    # Контекст кошика
│   ├── pages/
│   │   ├── Home.jsx           # Головна сторінка
│   │   ├── Menu.jsx           # Меню
│   │   ├── AdminPanel.jsx     # Адмін-панель
│   │   ├── Login.jsx          # Вхід
│   │   ├── Register.jsx       # Реєстрація
│   │   └── Cart.jsx           # Кошик
│   ├── styles/
│   │   ├── index.css          # Глобальні стилі
│   │   ├── Header.css
│   │   ├── Footer.css
│   │   ├── Home.css
│   │   ├── Menu.css
│   │   ├── ProductCard.css
│   │   ├── Auth.css
│   │   ├── AdminPanel.css
│   │   ├── Cart.css
│   │   └── App.css
│   ├── App.jsx                # Головний компонент
│   └── main.jsx               # Точка входу
├── index.html
├── package.json
└── vite.config.js
```

## 🎨 Сторінки

- **Головна** (`/`) - Привітання та інформація
- **Меню** (`/menu`) - Перегляд усіх товарів
- **Кошик** (`/cart`) - Оформлення замовлення
- **Вхід** (`/login`) - Аутентифікація
- **Реєстрація** (`/register`) - Реєстрація нових користувачів
- **Адмін-панель** (`/admin`) - Управління товарами (тільки адмін)

## 🛒 Контексти

### AuthContext
Керує аутентифікацією:
- `user` - поточний користувач
- `token` - JWT токен
- `login()` - вхід в систему
- `register()` - реєстрація
- `logout()` - вихід

### CartContext
Керує кошиком:
- `cart` - массив товарів
- `addToCart()` - додати товар
- `removeFromCart()` - видалити товар
- `updateQuantity()` - оновити кількість
- `clearCart()` - очистити кошик
- `getTotalPrice()` - загальна вартість

## 📱 Адаптивність

Сайт повністю адаптивний з точками розриву:
- Мобільні: < 768px
- Планшети: 768px - 1024px
- Комп'ютери: > 1024px

## 🎨 Кольорова схема

```css
--primary: #8B4513      /* Коричневий */
--secondary: #A0522D    /* Світліший коричневий */
--accent: #D2691E       /* Персиковий */
```

## 📞 API Integration

Frontend підключується до backend на `http://localhost:5000`

```javascript
// vite.config.js
server: {
  proxy: {
    '/api': 'http://localhost:5000'
  }
}
```

## 🔐 Аутентифікація

JWT токен зберігається у `localStorage` як `token`.

```javascript
// Кожний запит до адмін API
axios.get('/api/...', {
  headers: { Authorization: `Bearer ${token}` }
})
```

## 📚 Залежності

- `react` - React бібліотека
- `react-dom` - React DOM
- `react-router-dom` - маршрутизація
- `axios` - HTTP клієнт

## 🚀 Build & Deploy

###準備до production

```bash
npm run build
```

Генерує папку `dist/` з готовим до деплою кодом.

---

**Версія:** 1.0.0
