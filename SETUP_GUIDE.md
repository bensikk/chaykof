# 🚀 Інструкція запуску проекту CHAYKOF & LOFT BAR

## Крок 1️⃣: Налаштування бази даних PostgreSQL

### На Windows:

1. **Встановіть PostgreSQL**
   - Завантажте з https://www.postgresql.org/download/windows/
   - Запустіть інсталятор
   - **ВАЖЛИВО**: Запам'ятайте пароль користувача `postgres`
   - Виберіть порт `5432` (за замовченням)

2. **Встановіть PGAdmin 4**
   - Завантажте з https://www.pgadmin.org/download/pgadmin-4-windows/
   - Встановіть на комп'ютер

3. **Відкрийте PGAdmin 4** (зазвичай на http://localhost:5050)

4. **Підключіться до серверу**
   - Розкрийте `Servers` в лівій панелі
   - Правою кнопкою → `Register` → `Server`
   - На вкладці `General`: Name = `CHAYKOF_SERVER`
   - На вкладці `Connection`:
     - Host name: `localhost`
     - Port: `5432`
     - Username: `postgres`
     - Password: (ваш пароль)
     - ✓ Save password
   - Клацніть `Save`

5. **Створіть базу даних**
   - Розкрийте `CHAYKOF_SERVER`
   - Правою кнопкою на `Databases` → `Create` → `Database`
   - Name: `chaykof_db`
   - Клацніть `Save`

6. **Запустіть SQL скрипт**
   - Розкрийте `CHAYKOF_SERVER` → `Databases` → `chaykof_db`
   - Правою кнопкою на `chaykof_db` → `Query Tool`
   - Відкрийте файл `database/init.sql`
   - Натисніть `F5` або клацніть `Execute`

**✓ База даних готова!**

---

## Крок 2️⃣: Встановлення Backend

1. **Откройте термінал у папці проекту:**

```bash
cd backend
```

2. **Встановіть залежності:**

```bash
npm install
```

3. **Створіть файл `.env`:**

Копіюйте `.env.example` і редагуйте:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=chaykof_db
DB_USER=postgres
DB_PASSWORD=your_password_here

JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

PORT=5000
NODE_ENV=development

UPLOAD_DIR=./uploads
```

4. **Запустіть сервер:**

```bash
npm run dev
```

**✓ Backend запуститься на http://localhost:5000**

---

## Крок 3️⃣: Встановлення Frontend

1. **Відкрийте новий термінал у папці проекту:**

```bash
cd frontend
```

2. **Встановіть залежності:**

```bash
npm install
```

3. **Запустіть розробницький сервер:**

```bash
npm run dev
```

**✓ Frontend запуститься на http://localhost:3000**

---

## 🎉 Все готово!

Відкрийте в браузері: **http://localhost:3000**

### Демо-акаунти для тестування:

**Адміністратор:**
- Email: `admin@chaykof.com`
- Пароль: `password`

**Користувач:**
- Email: `user@chaykof.com`
- Пароль: `password`

---

## 📋 Командна панель для користувача

### Користувач може:
- ✅ Переглядати меню
- ✅ Додавати товари до кошика
- ✅ Оформити замовлення
- ✅ Переглядати историю замовлень

### Адміністратор може (на `/admin`):
- ✅ Додавати нові товари
- ✅ Редагувати товари
- ✅ Видаляти товари
- ✅ Управляти категоріями
- ✅ Переглядати замовлення

---

## 🐛 Розв'язання проблем

### Помилка: "Cannot connect to database"

```bash
1. Перевірте, що PostgreSQL запущений
2. Перевірте параметри .env файлу
3. Перевірте пароль користувача postgres
```

### Помилка: "Port already in use"

```bash
# Змініть PORT у .env файлі на 5001 або іншу
# Для frontend, змініть вite.config.js на port: 3001
```

### Помилка: npm install failed

```bash
npm install --legacy-peer-deps
```

---

## 📱 Функціональність сайту

### 🏠 Головна сторінка
- Інформація про кафе
- Швидкий доступ до меню
- Контактна інформація

### 🍽️ Меню
- Категорії товарів
- Картки товарів з фото
- Опис та ціна
- Додавання до кошика

### 🛒 Кошик
- Перегляд доданих товарів
- Редагування кількості
- Видалення товарів
- Оформлення замовлення

### 👤 Вхід/Реєстрація
- Реєстрація нового користувача
- Вхід в систему
- Профіль користувача

### 🔧 Адмін-панель (http://localhost:3000/admin)
- Таблиця з усіма товарами
- Форма для додавання товару
- Кнопки редагування та видалення

---

## 📚 Корисні посилання

- PostgreSQL: https://www.postgresql.org/
- PGAdmin: https://www.pgadmin.org/
- React: https://react.dev/
- Vite: https://vitejs.dev/
- Express: https://expressjs.com/

---

## 💡 Поради

1. **Для розробки з гарячою перезагрузкою:**
   - Frontend автоматично перезагружається при змінах
   - Backend потребує перезагрузки (або використовуйте nodemon)

2. **Для додавання зображень:**
   - Використовуйте URL на зображення
   - Відредагуйте товар та вставте URL у поле "URL Зображення"

3. **Для змін в БД:**
   - Використовуйте PGAdmin 4 для управління БД
   - Не забудьте перезагрузити backend

---

**Успішного запуску! 🎉**

Якщо у вас виникли питання, див. [README.md](./README.md)
