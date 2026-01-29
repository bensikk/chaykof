-- SQL скрипти для CHAYKOF & LOFT BAR

-- Видалення існуючих таблиць та типів (якщо існують)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- Створення типу enum для ролей
CREATE TYPE user_role AS ENUM ('user', 'admin', 'manager');

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

-- Варіанти товарів (вага/грамовка та ціна)
CREATE TABLE product_variants (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    label VARCHAR(100) NOT NULL,
    grams INTEGER,
    price DECIMAL(10, 2) NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_product_variants_default ON product_variants(product_id) WHERE is_default = true;

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

-- Вставка тестових даних

-- Користувачі (пароль для всіх: "password")
INSERT INTO users (email, password, name, role) VALUES
    ('admin@chaykof.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Адміністратор', 'admin'),
    ('manager@chaykof.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Менеджер', 'manager'),
    ('user@chaykof.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Тестовий користувач', 'user');

-- Категорії
INSERT INTO categories (name, description, icon) VALUES
    ('Піца', 'Піца на тонкому тісті', '🍕'),
    ('Бургери', 'Бургери та сети', '🍔'),
    ('Фритюр', 'Закуски з фритюру', '🍟'),
    ('Соуси', 'Соуси до страв', '🥫'),
    ('Хот-Дог', 'Хот-доги', '🌭'),
    ('Японія', 'Роли та суші', '🍣'),
    ('Салати', 'Салати та зелені страви', '🥗'),
    ('Перші страви', 'Супи та окрошка', '🍲'),
    ('Паста', 'Паста', '🍝');

-- Товари
INSERT INTO products (name, description, price, category_id, available) VALUES
    -- Піца
    ('Грибна', 'Піца з грибами', 145, 1, true),
    ('Діабола', 'Піца з пікантною ковбасою', 145, 1, true),
    ('Курка-Ананас', 'Курка, ананас', 150, 1, true),
    ('Курка-Гриби', 'Курка, гриби', 155, 1, true),
    ('Болоньєзе', 'Фарш болоньєзе', 145, 1, true),
    ('Бастручо', 'Піца з бастурмою', 145, 1, true),
    ('Салямі', 'Салямі та сир', 150, 1, true),
    ('Пепероні', 'Пепероні, сир', 150, 1, true),
    ('4 сира', 'Мікс сирів', 155, 1, true),
    ('Морська', 'Морепродукти', 195, 1, true),
    ('Піца Прошуто ді Парма', 'Прошуто, пармезан', 195, 1, true),
    ('Піца Джамайка', 'Шинка, ананас', 145, 1, true),
    ('Піца Пепероні з беконом та пармезаном', 'Пепероні, бекон, пармезан', 180, 1, true),

    -- Бургери
    ('Бургер Меню', 'Піг бургер, картопля фрі, соус, Coca-Cola 0.33', 250, 2, true),
    ('Шеф', 'Фірмовий бургер', 220, 2, true),
    ('Чікен з соусом Стілтон', 'Курка, соус стілтон', 180, 2, true),
    ('Пулед Порк', 'Томлене свинне м''ясо', 170, 2, true),
    ('Піг', 'Свинний бургер', 180, 2, true),
    ('Чікен', 'Курячий бургер', 185, 2, true),
    ('Чіз', 'Бургер з сиром', 195, 2, true),
    ('Міні', 'Малий бургер', 100, 2, true),

    -- Фритюр
    ('Батат Фрі', 'Батат фрі, соус на вибір', 140, 3, true),
    ('Картопляні Діпи', 'Картопляні діпи', 65, 3, true),
    ('Картопля ФРІ "Стандарт"', 'Класична картопля фрі', 55, 3, true),
    ('Картопля ФРІ "Пармезан"', 'Фрі з пармезаном', 60, 3, true),
    ('Картопля ФРІ "Паприка"', 'Фрі з паприкою', 55, 3, true),
    ('Картопля по Селянськи "Стандарт"', 'Запечена картопля', 65, 3, true),
    ('Картопля по Селянськи "Паприка"', 'Запечена картопля з паприкою', 65, 3, true),
    ('Картопляні Кульки', 'Картопляні кульки', 70, 3, true),
    ('Чікен Нагетси 5шт+кетчуп', 'Курячі нагетси, 5 шт', 90, 3, true),
    ('Чікен Нагетси 8шт+кетчуп', 'Курячі нагетси, 8 шт', 130, 3, true),
    ('Курячі Крильця 4шт', 'Крильця курячі, 4 шт', 140, 3, true),
    ('Курячі Крильця 7шт', 'Крильця курячі, 7 шт', 230, 3, true),
    ('Сирні палички в паніровці 4шт', 'Сирні палички, 4 шт', 140, 3, true),
    ('Сирні палички в паніровці 7шт', 'Сирні палички, 7 шт', 240, 3, true),

    -- Соуси
    ('Кетчуп', 'Соус кетчуп', 10, 4, true),
    ('Сирний', 'Сирний соус', 10, 4, true),
    ('Класичний', 'Класичний соус', 10, 4, true),
    ('Кисло-Солодкий', 'Кисло-солодкий соус', 10, 4, true),
    ('Барбекю', 'Соус BBQ', 10, 4, true),
    ('Брусничний', 'Брусничний соус', 15, 4, true),
    ('Часниковий', 'Часниковий соус', 15, 4, true),

    -- Хот-доги
    ('Баварський', 'Хот-дог баварський', 60, 5, true),
    ('Баварський XL', 'Хот-дог баварський XL', 80, 5, true),
    ('Хот-дог з сиром', 'Хот-дог з сиром', 55, 5, true),
    ('Хот-дог Молочний', 'Хот-дог молочний', 55, 5, true),
    ('Хот-дог Курячий', 'Хот-дог курячий', 70, 5, true),

    -- Японія
    ('Філадельфія класік', 'Рол з лососем та сиром', 280, 6, true),
    ('Філадельфія лайт', 'Рол з лососем', 260, 6, true),
    ('Філадельфія в кунжуті', 'Рол з кунжутом', 240, 6, true),
    ('Філадельфія темпура', 'Темпура рол', 285, 6, true),
    ('Каліфорнія з лососем', 'Рол з лососем', 265, 6, true),
    ('Каліфорнія з креветкою в ікрі', 'Рол з креветкою', 275, 6, true),
    ('Каліфорнія ЧІЗ', 'Рол з сиром', 290, 6, true),
    ('Зелений дракон', 'Рол з авокадо та вугрем', 365, 6, true),
    ('Золотой дракон', 'Рол з вугрем', 365, 6, true),
    ('Червоний дракон', 'Рол з лососем', 340, 6, true),
    ('Тигровий дракон', 'Рол з тигровою креветкою', 320, 6, true),
    ('Рол з крабом та креветкою', 'Краб і креветка', 250, 6, true),
    ('Рол з смаженим лососем', 'Смажений лосось', 290, 6, true),
    ('Макі з креветкою', 'Макі рол з креветкою', 159, 6, true),
    ('Макі з вугрем', 'Макі рол з вугрем', 169, 6, true),
    ('Макі з лососем', 'Макі рол з лососем', 149, 6, true),
    ('Макі з авокадо', 'Макі рол з авокадо', 120, 6, true),
    ('Макі з огірком', 'Макі рол з огірком', 99, 6, true),
    ('Гункан з вугрем', 'Гункан з вугрем', 75, 6, true),
    ('Гункан з лососем', 'Гункан з лососем', 55, 6, true),
    ('Гункан з креветкою', 'Гункан з креветкою', 55, 6, true),
    ('Гункан з крабом', 'Гункан з крабом', 50, 6, true),
    ('Нігірі з вугрем', 'Нігірі з вугрем', 69, 6, true),
    ('Нігірі з лососем', 'Нігірі з лососем', 55, 6, true),
    ('Нігірі з тигровою креветкою', 'Нігірі з креветкою', 55, 6, true),
    ('Креветки в темпурі 4шт', 'Креветки в темпурі, 4 шт', 199, 6, true),
    ('Креветки в темпурі 6шт', 'Креветки в темпурі, 6 шт', 299, 6, true),
    ('Суші бургер з Лососем', 'Суші бургер з лососем', 260, 6, true),
    ('Суші бургер з Крабом', 'Суші бургер з крабом', 240, 6, true),

    -- Салати
    ('Зелений з тигровою креветкою', 'Мікс салатів, тигрова креветка, пармезан', 245, 7, true),
    ('Зелений з лососем', 'Мікс салатів, лосось, пармезан', 195, 7, true),
    ('Цезарь з куркою', 'Класичний цезар з куркою', 190, 7, true),
    ('Цезарь з тигровою креветкою', 'Цезар з тигровою креветкою', 240, 7, true),
    ('Цезарь з лососем', 'Цезар з лососем', 230, 7, true),
    ('Грецький', 'Салат з фетою та овочами', 180, 7, true),
    ('Овочевий', 'Овочевий салат', 100, 7, true),
    ('Хіяши', 'Чука, горіховий соус', 170, 7, true),

    -- Перші страви
    ('Окрошка з куркою', 'Окрошка з куркою', 110, 8, true),
    ('Окрошка з лососем', 'Окрошка з лососем', 190, 8, true),
    ('Солянка', 'Солянка з лимоном', 130, 8, true),

    -- Паста
    ('Паста Болоньєзе', 'Паста болоньєзе', 140, 9, true),
    ('Фарфале з куркою та грибами', 'Фарфале, курка, гриби', 140, 9, true);

-- Для кожного товару створюємо варіанти: стандартний (базова ціна) та великий (+35%)
INSERT INTO product_variants (product_id, label, grams, price, is_default)
SELECT id, 'Стандарт', NULL, price, true FROM products;

INSERT INTO product_variants (product_id, label, grams, price, is_default)
SELECT id, 'Великий', NULL, ROUND(price * 1.35, 2), false FROM products;
