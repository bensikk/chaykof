# Інструкція налаштування PostgreSQL БД для CHAYKOF & LOFT BAR

## 1. Встановлення PostgreSQL (якщо ще не встановлено)
- Завантажте PostgreSQL з https://www.postgresql.org/download/
- Встановіть, запам'ятайте пароль користувача `postgres`
- Під час встановлення виберіть порт `5432` (за замовченням)

## 2. Встановлення PGAdmin 4
- Завантажте з https://www.pgadmin.org/download/
- Встановіть на вашу систему
- Запустіть PGAdmin 4

## 3. Підключення до PostgreSQL у PGAdmin 4

### Крок 1: Реєстрація сервера
1. Відкрийте PGAdmin 4 (зазвичай на http://localhost:5050)
2. Клацніть правою кнопкою на **Servers** → **Register** → **Server**
3. На закладці **General**:
   - Name: `CHAYKOF_SERVER`
4. На закладці **Connection**:
   - Host name: `localhost`
   - Port: `5432`
   - Username: `postgres`
   - Password: (введіть пароль, який ви встановили)
   - Збережіть пароль: ✓ (галочка)
5. Клацніть **Save**

### Крок 2: Створення бази даних
1. Розкрийте сервер `CHAYKOF_SERVER`
2. Правою кнопкою на **Databases** → **Create** → **Database**
3. Name: `chaykof_db`
4. Клацніть **Save**

## 4. Запуск SQL скрипту для створення таблиць

### Крок 1: Відкрийте Query Tool
1. Розкрийте `CHAYKOF_SERVER` → `Databases` → `chaykof_db`
2. Правою кнопкою на `chaykof_db` → **Query Tool**

### Крок 2: Скопіюйте та запустіть наступний SQL код:

```sql
-- Створення типу enum для ролей
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Таблиця користувачів
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role user_role DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблиця категорій товарів
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблиця товарів
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    image_url VARCHAR(500),
    available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблиця замовлень
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблиця деталей замовлень
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Індекси для оптимізації
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- Вставка тестових даних
INSERT INTO users (email, password, name, role) VALUES
    ('admin@chaykof.com', '$2b$10$G9QvJ8Nbt3PLiAfUIU4H.eYVTUAGfvn1isb2KIUgO2XeGw2DK.w.m', 'Admin User', 'admin'),
    ('user@chaykof.com', '$2b$10$G9QvJ8Nbt3PLiAfUIU4H.eYVTUAGfvn1isb2KIUgO2XeGw2DK.w.m', 'Test User', 'user');

INSERT INTO categories (name, description, icon) VALUES
    ('Гарячі напої', 'Чай, кава, гарячий шоколад', '☕'),
    ('Холодні напої', 'Сокі, лимонади, холодний чай', '🧊'),
    ('Коктейлі', 'Алкогольні та безалкогольні коктейлі', '🍹'),
    ('Закуски', 'Бутерброди, салати, закуски', '🥗'),
    ('Десерти', 'Тістечка, пирожки, мороженое', '🍰');

INSERT INTO products (name, description, price, category_id, available) VALUES
    ('Еспресо', 'Класичний крепкий еспресо', 40, 1, true),
    ('Капучино', 'Еспресо з молочною піною', 50, 1, true),
    ('Латте', 'Еспресо з гарячим молоком', 55, 1, true),
    ('Апельсиновий сік', 'Свіжовичавленний апельсиновий сік', 45, 2, true),
    ('Мохіто', 'Освіжаючий мохіто з м\'ятою', 70, 3, true),
    ('Цезар', 'Класичний коктейль', 80, 3, true),
    ('Цезар (безалкогольний)', 'Цезар без спирту', 60, 3, true),
    ('Цезар з беконом', 'Салат з курицею, беконом і сухариками', 120, 4, true),
    ('Овочевий салат', 'Свіжий овочевий салат з оливковою олією', 85, 4, true),
    ('Тістечко Наполеон', 'Ніжне тістечко з кремом', 95, 5, true),
    ('Панна-котта', 'Італійський десерт зі сливок', 110, 5, true);
```

### Крок 3: Натисніть **Execute** або `F5`

## 5. Верифікація створеної БД

Щоб перевірити, що все створено правильно:

```sql
-- Перегляньте всі таблиці
SELECT * FROM information_schema.tables WHERE table_schema = 'public';

-- Перегляньте користувачів
SELECT id, email, name, role FROM users;

-- Перегляньте категорії
SELECT * FROM categories;

-- Перегляньте товари з категоріями
SELECT p.id, p.name, p.price, c.name as category FROM products p
JOIN categories c ON p.category_id = c.id;
```

## 6. Деталі підключення для backend

Використовуйте ці параметри у файлі `.env`:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=chaykof_db
DB_USER=postgres
DB_PASSWORD=<ваш_пароль_postgres>
```

## 7. Описи ролей

### Адміністратор (role = 'admin')
- Може переглядати, додавати, редагувати, видаляти товари
- Може переглядати все замовлення
- Доступ до адмін-панелі

### Користувач (role = 'user')
- Може переглядати товари та категорії
- Може створювати замовлення
- Може переглядати свої замовлення
- Немає доступу до адмін-панелі

---

**Готово!** Тепер ваша база даних готова до роботи з backend приложенням.
