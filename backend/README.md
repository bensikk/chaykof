# Backend - CHAYKOF & LOFT BAR

Node.js/Express сервер для управління меню та замовленнями.

## 📦 Встановлення

```bash
npm install
```

## ⚙️ Налаштування

1. Скопіюйте `.env.example` до `.env`
2. Налаштуйте параметри:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=chaykof_db
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

PORT=5000
NODE_ENV=development
```

## 🚀 Запуск

### Розробка
```bash
npm run dev
```

### Виробництво
```bash
npm start
```

## 📁 Структура

```
backend/
├── config/
│   └── database.js        # Конфігурація PostgreSQL
├── middleware/
│   └── auth.js            # JWT та перевірка ролей
├── routes/
│   ├── auth.js            # Реєстрація/Вхід
│   ├── products.js        # Управління товарами
│   ├── categories.js      # Категорії
│   └── orders.js          # Замовлення
├── server.js              # Головна точка входу
├── package.json
└── .env
```

## 🔑 Middleware

### `verifyToken`
Перевіряє JWT токен у заголовку `Authorization: Bearer <token>`

### `isAdmin`
Перевіряє, чи користувач має роль `admin`

## 📡 API Endpoints

Див. [README.md](../README.md) для повного списку endpoints.

## 🔒 Безпека

- JWT токени з шифруванням
- Bcrypt для хеширування паролів
- Перевірка ролей
- Валідація вводу
- CORS конфігурація

## 🗄️ База даних

Підключається до PostgreSQL за допомогою `pg` модуля.

## 📝 Залежності

- `express` - веб-фреймворк
- `pg` - драйвер PostgreSQL
- `jsonwebtoken` - JWT токени
- `bcryptjs` - хеширування паролів
- `cors` - Cross-Origin запити
- `dotenv` - змінні оточення

---

**Версія:** 1.0.0
