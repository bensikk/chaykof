# ⚡ Швидкий старт CHAYKOF

## 1️⃣ Встановлення (один раз)

```bash
# 1. Клонуй репозиторій
git clone <url>
cd chaykof

# 2. Встанови залежності
cd backend && npm install
cd ../frontend && npm install

# 3. Налаштуй .env
cd ../backend
cp .env.example .env
# Відредагуй .env з параметрами PostgreSQL

# 4. Створи базу даних
# У PostgreSQL/PgAdmin створи базу "chaykof_db"

# 5. Запусти setup скрипт
node -e "const pool = require('./config/database'); const fs = require('fs'); const sql = fs.readFileSync('../database/setup.sql', 'utf8'); pool.query(sql).then(() => { console.log('✅ DB готова!'); process.exit(0); });"
```

## 2️⃣ Запуск проекту

### Backend (термінал 1)
```bash
cd backend
npm start
```
Працює на: http://localhost:5000

### Frontend (термінал 2)
```bash
cd frontend
npm run dev
```
Працює на: http://localhost:3000

### На мобільному (термінал 2)
```bash
cd frontend
npm run dev -- --host
```
Працює на: http://192.168.x.x:3000

## 3️⃣ Вхід в систему

- **Адмін**: `admin` / `password` → http://localhost:3000/admin
- **Менеджер**: `manager` / `password` → http://localhost:3000/manager
- **Користувач**: `user` / `password`

## 4️⃣ Додавання товарів

### Через адмін-панель (рекомендовано)
1. Зайди як `admin`
2. Натисни "Додати товар"
3. Заповни форму та завантаж фото
4. Готово!

### Через SQL (масово)
```bash
# Редагуй database/add_products.sql
cd backend
node -e "const pool = require('./config/database'); const fs = require('fs'); const sql = fs.readFileSync('../database/add_products.sql', 'utf8'); pool.query(sql).then(() => { console.log('Товари додано!'); process.exit(0); });"
```

## 🛠️ Корисні команди

```bash
# Перегляд категорій
cd backend
node -e "const pool = require('./config/database'); pool.query('SELECT * FROM categories').then(r => { console.table(r.rows); process.exit(); });"

# Перегляд товарів
node -e "const pool = require('./config/database'); pool.query('SELECT p.name, c.name as category, p.price FROM products p JOIN categories c ON p.category_id = c.id').then(r => { console.table(r.rows); process.exit(); });"

# Скинути БД
node -e "const pool = require('./config/database'); const fs = require('fs'); const sql = fs.readFileSync('../database/setup.sql', 'utf8'); pool.query(sql).then(() => { console.log('БД скинута!'); process.exit(0); });"
```

## 📂 Структура файлів

```
chaykof/
├── README.md           ← Детальна документація
├── QUICKSTART.md       ← Цей файл
├── database/
│   ├── setup.sql       ← Головний скрипт БД
│   ├── add_products.sql ← Шаблон для товарів
│   └── README.md       ← База даних довідка
├── backend/            ← API (Node.js + Express)
└── frontend/           ← UI (React + Vite)
```

## 🎯 Категорії (19 шт)

**Поїсти:** Піца, Бургери, Фритюр, Хот-Дог, Японія, Салати, Перші страви, Паста, Соуси

**Попити:** Кава, Чай, Фреші, Лимонади, Напої, Коктейлі

**Попити міцного:** Алкоголь, Вино

**Інше:** Закуски, Кальян

---

**Готово!** Проект має працювати. Якщо щось не так - дивись [README.md](./README.md)
