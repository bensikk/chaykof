# Database Scripts

## Головний файл

**`setup.sql`** - Повний скрипт для налаштування бази даних:
- Створення всіх таблиць
- 3 тестові користувачі (admin/manager/user, пароль: "password")
- 19 категорій товарів
- Готовий до використання

## Як запустити

### Варіант 1: Через psql
```bash
psql -U postgres -d chaykof_db -f database/setup.sql
```

### Варіант 2: Через Node.js
```bash
cd backend
node -e "const pool = require('./config/database'); const fs = require('fs'); const sql = fs.readFileSync('../database/setup.sql', 'utf8'); pool.query(sql).then(r => { console.log('✅ Database setup complete!'); console.log('Categories:', r[r.length-2].rows[0].total_categories); console.log('Users:', r[r.length-1].rows[0].total_users); process.exit(0); }).catch(err => { console.error('❌ Error:', err.message); process.exit(1); });"
```

## Структура бази даних

### Таблиці:
- **users** - Користувачі (admin, manager, user)
- **categories** - Категорії товарів (19 шт)
- **products** - Товари
- **product_variants** - Варіанти товарів (розміри, грамовки)
- **orders** - Замовлення
- **order_items** - Позиції в замовленнях

### Категорії:
**Поїсти:** Піца, Бургери, Фритюр, Хот-Дог, Японія, Салати, Перші страви, Паста, Соуси

**Попити:** Кава, Чай, Фреші, Лимонади, Напої, Коктейлі

**Попити міцного:** Алкоголь, Вино

**Закусити:** Закуски

**Подиміти:** Кальян

## Додавання товарів

Використовуй адмін-панель: http://localhost:3000/admin
- Логін: `admin`
- Пароль: `password`

## Корисні команди

```bash
# Переглянути категорії
cd backend
node -e "const pool = require('./config/database'); pool.query('SELECT * FROM categories ORDER BY id').then(r => { console.table(r.rows); process.exit(); });"

# Переглянути товари
node -e "const pool = require('./config/database'); pool.query('SELECT p.id, p.name, c.name as category, p.price FROM products p JOIN categories c ON p.category_id = c.id ORDER BY c.id, p.name').then(r => { console.table(r.rows); process.exit(); });"

# Скинути БД та запустити setup знову
node -e "const pool = require('./config/database'); const fs = require('fs'); const sql = fs.readFileSync('../database/setup.sql', 'utf8'); pool.query(sql).then(() => { console.log('✅ Reset complete!'); process.exit(0); });"
```
