# 📝 Чекліст запуску CHAYKOF & LOFT BAR

## ✅ Перед початком розробки

### 1. Встановлення на комп'ютер
- [ ] Python (для деяких операцій)
- [ ] Node.js (https://nodejs.org/)
- [ ] Git (https://git-scm.com/)
- [ ] PostgreSQL (https://www.postgresql.org/)
- [ ] PGAdmin 4 (https://www.pgadmin.org/)
- [ ] VS Code або інший редактор (https://code.visualstudio.com/)

### 2. Налаштування PostgreSQL
- [ ] Встановіть PostgreSQL (запам'ятайте пароль postgres)
- [ ] Встановіть PGAdmin 4
- [ ] Відкрийте PGAdmin (http://localhost:5050)
- [ ] Підключіть сервер CHAYKOF_SERVER
- [ ] Створіть БД `chaykof_db`
- [ ] Запустіть SQL скрипт з `database/init.sql`
- [ ] Перевірте таблиці в PGAdmin

### 3. Backend налаштування
- [ ] Перейдіть у папку `backend/`
- [ ] Запустіть `npm install`
- [ ] Скопіюйте `.env.example` → `.env`
- [ ] Відредагуйте `.env` з вашими параметрами БД
- [ ] Запустіть `npm run dev`
- [ ] Перевірте http://localhost:5000/api/health

### 4. Frontend налаштування
- [ ] Перейдіть у папку `frontend/`
- [ ] Запустіть `npm install`
- [ ] Запустіть `npm run dev`
- [ ] Відкрийте http://localhost:3000 в браузері

### 5. Тестування
- [ ] Вхід: admin@chaykof.com / password
- [ ] Перегляд меню
- [ ] Додавання товару до кошика
- [ ] Оформлення замовлення
- [ ] Перегляд адмін-панелі (`/admin`)
- [ ] Додавання нового товару

---

## 📂 Важливі файли

### 📍 Основна документація
- `README.md` - Основна інформація
- `SETUP_GUIDE.md` - Пошагова інструкція запуску
- `DATABASE_SETUP.md` - Налаштування БД
- `API_REFERENCE.md` - Документація API
- `PROJECT_STRUCTURE.md` - Структура проекту

### 🗄️ База даних
- `database/init.sql` - SQL скрипти для ініціалізації

### 🎨 Frontend
- `frontend/package.json` - Залежності
- `frontend/vite.config.js` - Конфігурація Vite
- `frontend/index.html` - HTML шаблон
- `frontend/src/App.jsx` - Головний компонент
- `frontend/src/main.jsx` - Точка входу

### ⚙️ Backend
- `backend/package.json` - Залежності
- `backend/server.js` - Головний файл
- `backend/.env.example` - Шаблон змінних оточення
- `backend/config/database.js` - Конфігурація БД
- `backend/middleware/auth.js` - Аутентифікація та ролі

---

## 🔧 Команди

### Frontend
```bash
cd frontend
npm install          # Встановлення залежностей
npm run dev          # Запуск розробницького сервера
npm run build        # Будування для продакшену
npm run preview      # Preview будування
```

### Backend
```bash
cd backend
npm install          # Встановлення залежностей
npm run dev          # Запуск з nodemon (auto-reload)
npm start            # Просто запуск
```

### Database
```sql
-- Запустіть це у PGAdmin Query Tool:
-- файл: database/init.sql
```

---

## 🐛 Типові проблеми

### ❌ "Cannot connect to database"
**Вирішення:**
1. Перевірте, що PostgreSQL запущений
2. В PGAdmin перевірте з'єднання
3. Перевірте параметри у `.env` файлі
4. Перевірте пароль користувача postgres

### ❌ "Port 5000 already in use"
**Вирішення:**
```
Змініть PORT у backend/.env на 5001
```

### ❌ "npm install failed"
**Вирішення:**
```bash
npm install --legacy-peer-deps
```

### ❌ "Module not found"
**Вирішення:**
```bash
# В папці де ошибка:
npm install
```

---

## 📱 Ролі користувачів

### 👤 Звичайний користувач (role: 'user')
- ✅ Переглядати товари
- ✅ Переглядати категорії
- ✅ Додавати до кошика
- ✅ Оформити замовлення
- ✅ Переглядати свої замовлення
- ❌ Редагувати товари
- ❌ Додавати товари
- ❌ Видаляти товари

### 👨‍💼 Адміністратор (role: 'admin')
- ✅ Все як користувач
- ✅ Переглядати всіх користувачів
- ✅ Додавати нові товари
- ✅ Редагувати товари
- ✅ Видаляти товари
- ✅ Переглядати всі замовлення
- ✅ Доступ до адмін-панелі (`/admin`)

---

## 🎯 Ключові особливості

### 🏠 Головна сторінка
- Інформація про кафе
- Привітна атмосфера
- Швидкий доступ до меню

### 🍽️ Меню
- Категорії товарів
- Картки з фото і описом
- Фільтрація по категоріям
- Додавання до кошика

### 🛒 Кошик
- Перегляд доданих товарів
- Редагування кількості
- Видалення товарів
- Розрахунок загальної вартості

### 👤 Аутентифікація
- Реєстрація новоруч користувачів
- Вхід в систему
- Управління профілем

### 🔧 Адмін-панель
- Таблиця всіх товарів
- Форма додавання товару
- Редагування товару
- Видалення товару
- Управління доступністю

---

## 💾 Важливі дані

### Demo акаунти
```
Адміністратор:
  Email: admin@chaykof.com
  Пароль: password

Користувач:
  Email: user@chaykof.com
  Пароль: password
```

### Контакти кафе
```
📍 Адреса: вулиця Центральна, Сахновщина, Харківська область
📞 Телефон: 0962596128
🕐 Роботи: Пн-Нд: 07:45 - 22:00
📱 Instagram: @chaykof_official
👍 Facebook: CHAYKOF
```

---

## 📊 Основні таблиці БД

| Таблиця | Поля | Опис |
|---------|------|------|
| users | id, email, password, name, role, created_at, updated_at | Користувачі |
| categories | id, name, description, icon, created_at | Категорії меню |
| products | id, name, description, price, category_id, image_url, available, created_at, updated_at | Товари (меню) |
| orders | id, user_id, total_price, status, created_at, updated_at | Замовлення |
| order_items | id, order_id, product_id, quantity, price, created_at | Деталі замовлень |

---

## 🔗 Посилання

| Ресурс | URL |
|--------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| PGAdmin | http://localhost:5050 |
| Node.js | https://nodejs.org/ |
| React | https://react.dev/ |
| Vite | https://vitejs.dev/ |
| Express | https://expressjs.com/ |
| PostgreSQL | https://www.postgresql.org/ |

---

## 📚 Рекомендовані розширення VS Code

- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- Thunder Client (для тестування API)
- PostgreSQL (для роботи з БД)
- REST Client (для тестування API)

---

## 💡 Поради для розробки

1. **Hot Reload**: Frontend автоматично перезавантажується при змінах
2. **Backend**: Використовуйте nodemon для автоматичної перезаванта

жу (`npm run dev`)
3. **API Тестування**: Використовуйте Thunder Client або Postman
4. **БД**: Редагуйте дані через PGAdmin або SQL запити
5. **Гарячі клавіші**: F5 в VS Code для перезавантаження

---

## ✅ Фінальна перевірка перед запуском

- [ ] PostgreSQL запущений і доступний
- [ ] PGAdmin з'єднаний з БД
- [ ] БД `chaykof_db` створена
- [ ] SQL скрипти запущені
- [ ] Backend залежності встановлені
- [ ] Backend .env налаштований
- [ ] Backend запущений на :5000
- [ ] Frontend залежності встановлені
- [ ] Frontend запущений на :3000
- [ ] Сайт доступний у браузері
- [ ] Демо-акаунти працюють
- [ ] API endpoints реагують

---

## 🎉 Готово!

Ваш сайт для CHAYKOF & LOFT BAR повністю налаштований і готовий до розробки!

Якщо виникнуть питання, див. документацію:
- 📖 [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- 📡 [API_REFERENCE.md](./API_REFERENCE.md)
- 📋 [DATABASE_SETUP.md](./DATABASE_SETUP.md)

---

**Версія:** 1.0.0  
**Останнє оновлення:** Січень 2025
