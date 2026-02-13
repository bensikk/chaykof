-- ================================================
-- CHAYKOF & LOFT BAR - Повний скрипт налаштування БД
-- ================================================

-- Видалення існуючих таблиць та типів
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- ================================================
-- СТВОРЕННЯ СТРУКТУРИ
-- ================================================

-- Створення типу enum для ролей
CREATE TYPE user_role AS ENUM ('user', 'admin', 'manager');

-- Таблиця користувачів
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
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
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    image_url VARCHAR(500),
    available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Варіанти товарів (вага/грамовка та ціна)
CREATE TABLE product_variants (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    label VARCHAR(150),
    grams INTEGER,
    price DECIMAL(10, 2) NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Унікальний індекс: тільки один варіант може бути дефолтним для кожного продукту
CREATE UNIQUE INDEX idx_product_variants_default ON product_variants(product_id) WHERE is_default = true;

-- Таблиця кошика
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id INTEGER REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id, variant_id)
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
    variant_id INTEGER REFERENCES product_variants(id),
    variant_label VARCHAR(150),
    variant_grams INTEGER,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Індекси для оптимізації
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ================================================
-- ТЕСТОВІ КОРИСТУВАЧІ
-- ================================================
-- Пароль для всіх: "password"
-- Хеш: $2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi

INSERT INTO users (username, email, password, name, role) VALUES
    ('admin', 'admin@chaykof.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Адміністратор', 'admin'),
    ('manager', 'manager@chaykof.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Менеджер', 'manager'),
    ('user', 'user@chaykof.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Тестовий користувач', 'user');

-- ================================================
-- КАТЕГОРІЇ (19 категорій)
-- ================================================

INSERT INTO categories (name, description, icon) VALUES
    -- ПОЇСТИ
    ('Піца', 'Піца на тонкому тісті', '🍕'),
    ('Бургери', 'Соковиті бургери', '🍔'),
    ('Фритюр', 'Картопля та закуски', '🍟'),
    ('Хот-Дог', 'Хот-доги на будь-який смак', '🌭'),
    ('Японія', 'Суші та роли', '🍣'),
    ('Салати', 'Свіжі салати', '🥗'),
    ('Перші страви', 'Супи та окрошка', '🍲'),
    ('Паста', 'Італійська паста', '🍝'),
    ('Соуси', 'Додаткові соуси', '🥫'),
    -- ПОПИТИ
    ('Кава', 'Гарячі кавові напої', '☕'),
    ('Чай', 'Чай та настої', '🍵'),
    ('Фреші', 'Свіжовижаті соки', '🍹'),
    ('Лимонади', 'Домашні лимонади', '🥤'),
    ('Напої', 'Прохолодні напої', '🧃'),
    ('Коктейлі', 'Безалкогольні коктейлі', '🍸'),
    -- ПОПИТИ МІЦНОГО
    ('Алкоголь', 'Міцні напої', '🍺'),
    ('Вино', 'Вина та шампанське', '🍷'),
    -- ПОДИМІТИ
    ('Кальян', 'Кальяни', '💨'),
    -- ЗАКУСИТИ
    ('Закуски', 'Закуски до напоїв', '🧀');

-- ================================================
-- ПРИКЛАДИ ТОВАРІВ
-- ================================================
-- Додай свої товари через адмін-панель або тут

-- Приклад піци з варіантами:
-- INSERT INTO products (name, description, price, category_id, image_url, available) VALUES
--     ('Маргарита', 'Класична піца з томатним соусом та моцарелою', 125.00, 1, '/uploads/margherita.jpg', true);
-- 
-- INSERT INTO product_variants (product_id, label, grams, price, is_default) VALUES
--     (1, '30см', 30, 125.00, true),
--     (1, '35см', 35, 155.00, false),
--     (1, '40см', 40, 185.00, false);

-- ================================================
-- ГОТОВО!
-- ================================================

SELECT 'Database setup completed successfully!' AS status;
SELECT COUNT(*) as total_categories FROM categories;
SELECT COUNT(*) as total_users FROM users;
