# 📁 Структура проекту CHAYKOF & LOFT BAR

```
chaycof/
│
├── 📄 README.md                 # Основна документація
├── 📄 SETUP_GUIDE.md            # Крок за кроком інструкція запуску
├── 📄 DATABASE_SETUP.md         # Інструкції для PostgreSQL та PGAdmin
├── 📄 API_REFERENCE.md          # Повна документація API endpoints
│
├── 📁 frontend/                 # React + Vite додаток
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx       # Шапка з меню навігації
│   │   │   ├── Footer.jsx       # Підвал сайту
│   │   │   └── ProductCard.jsx  # Компонент картки товару
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx  # Контекст для аутентифікації
│   │   │   └── CartContext.jsx  # Контекст для кошика
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Головна сторінка
│   │   │   ├── Menu.jsx         # Сторінка меню
│   │   │   ├── AdminPanel.jsx   # Адмін-панель для управління товарами
│   │   │   ├── Login.jsx        # Сторінка входу
│   │   │   ├── Register.jsx     # Сторінка реєстрації
│   │   │   └── Cart.jsx         # Сторінка кошика
│   │   │
│   │   ├── styles/
│   │   │   ├── index.css        # Глобальні стилі
│   │   │   ├── Header.css
│   │   │   ├── Footer.css
│   │   │   ├── Home.css
│   │   │   ├── Menu.css
│   │   │   ├── ProductCard.css
│   │   │   ├── Auth.css
│   │   │   ├── AdminPanel.css
│   │   │   ├── Cart.css
│   │   │   └── App.css
│   │   │
│   │   ├── App.jsx              # Головний компонент додатка
│   │   ├── main.jsx             # Точка входу React
│   │   └── index.css            # Глобальні стилі
│   │
│   ├── index.html               # HTML шаблон
│   ├── package.json             # Залежності frontend
│   ├── vite.config.js           # Конфігурація Vite
│   ├── .gitignore
│   ├── README.md                # Документація frontend
│   └── .env                     # (не збереження в git)
│
├── 📁 backend/                  # Node.js/Express сервер
│   ├── config/
│   │   └── database.js          # PostgreSQL конфігурація
│   │
│   ├── middleware/
│   │   └── auth.js              # JWT перевірка та ролі (admin/user)
│   │
│   ├── routes/
│   │   ├── auth.js              # Реєстрація, вхід, профіль
│   │   ├── products.js          # CRUD операції над товарами
│   │   ├── categories.js        # Отримання категорій
│   │   └── orders.js            # Управління замовленнями
│   │
│   ├── uploads/                 # Папка для завантажень
│   │
│   ├── server.js                # Головний файл сервера
│   ├── package.json             # Залежності backend
│   ├── .env                     # (не збереження в git)
│   ├── .env.example             # Шаблон .env
│   ├── .gitignore
│   ├── README.md                # Документація backend
│   └── node_modules/            # (не збереження в git)
│
└── 📁 database/                 # SQL скрипти
    ├── init.sql                 # Ініціалізація БД (таблиці, індекси, тестові дані)
    └── README.md                # Документація БД
```

---

## 🔄 Структура даних

### Користувачі (users)
```
id (PK)
email (UNIQUE)
password (bcrypt хеш)
name
role (enum: 'user', 'admin')
created_at
updated_at
```

### Категорії (categories)
```
id (PK)
name
description
icon
created_at
```

### Товари (products)
```
id (PK)
name
description
price
category_id (FK)
image_url
available
created_at
updated_at
```

### Замовлення (orders)
```
id (PK)
user_id (FK)
total_price
status
created_at
updated_at
```

### Деталі замовлень (order_items)
```
id (PK)
order_id (FK)
product_id (FK)
quantity
price
created_at
```

---

## 📊 API Структура

```
/api
├── /auth
│   ├── POST   /register
│   ├── POST   /login
│   └── GET    /profile (protected)
│
├── /products
│   ├── GET    /
│   ├── GET    /:id
│   ├── POST   / (admin)
│   ├── PUT    /:id (admin)
│   └── DELETE /:id (admin)
│
├── /categories
│   ├── GET    /
│   └── GET    /:id
│
└── /orders
    ├── POST   / (protected)
    ├── GET    / (protected)
    └── GET    /:id (protected)
```

---

## 🔐 Безпека

### Аутентифікація
- JWT токени (exp: 7 днів)
- Bcrypt хеширування паролів
- Токен в localStorage (frontend)

### Авторизація
- Перевірка ролі на backend для адмін-операцій
- Перевірка user_id для операцій замовлення

### CORS
- Дозволено: localhost:3000
- Дозволено: localhost:5000

---

## 📱 Сторінки Frontend

| Сторінка | URL | Доступ | Опис |
|----------|-----|--------|------|
| Головна | `/` | Всі | Вітаємо та інформація |
| Меню | `/menu` | Всі | Перегляд товарів |
| Кошик | `/cart` | Всі | Оформлення замовлення |
| Вхід | `/login` | Гості | Аутентифікація |
| Реєстрація | `/register` | Гості | Реєстрація нового користувача |
| Адмін-панель | `/admin` | Адмін | Управління товарами |

---

## 🛠️ Технологічний стек

### Frontend
- **React 18** - UI бібліотека
- **Vite** - Сборщик
- **React Router** - Маршрутизація
- **Axios** - HTTP запити
- **CSS3** - Стилізація (адаптивна)

### Backend
- **Node.js** - Runtime
- **Express** - Веб-фреймворк
- **PostgreSQL** - БД
- **pg** - PostgreSQL драйвер
- **JWT** - Аутентифікація
- **bcryptjs** - Хеширування паролів
- **CORS** - Cross-Origin запити

### Database
- **PostgreSQL 12+** - Реляційна БД
- **PGAdmin 4** - UI для управління БД

---

## 📋 Залежності

### Frontend (package.json)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.17.0",
    "axios": "^1.6.2"
  }
}
```

### Backend (package.json)
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.10.0",
    "dotenv": "^16.3.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.1.2",
    "cors": "^2.8.5"
  }
}
```

---

## 📈 Процес розробки

1. **Розробка frontend** → `npm run dev` в `frontend/`
2. **Розробка backend** → `npm run dev` в `backend/`
3. **Тестування API** → http://localhost:5000/api/health
4. **Тестування UI** → http://localhost:3000

---

## 🚀 Деплоєм

### Frontend Build
```bash
cd frontend
npm run build
# Генерує dist/ папку
```

### Backend готовий до запуску як є
```bash
npm start
```

---

## 🔗 Швидкі посилання

- 🌐 Frontend: http://localhost:3000
- ⚙️ Backend: http://localhost:5000
- 📊 PGAdmin: http://localhost:5050
- 📖 [Setup Guide](./SETUP_GUIDE.md)
- 📡 [API Reference](./API_REFERENCE.md)
- 🗄️ [Database Setup](./DATABASE_SETUP.md)

---

**Версія:** 1.0.0  
**Останнє оновлення:** Січень 2025
