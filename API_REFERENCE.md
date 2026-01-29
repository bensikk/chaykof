# 📡 API Reference - CHAYKOF & LOFT BAR

Всі API endpoints розташовані на: `http://localhost:5000/api`

## 🔐 Аутентифікація

### Реєстрація

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "Ім'я користувача"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Ім'я користувача",
    "role": "user"
  }
}
```

### Вхід

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Ім'я користувача",
    "role": "admin"
  }
}
```

### Отримання профілю

```http
GET /auth/profile
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "Ім'я користувача",
  "role": "admin"
}
```

---

## 🍽️ Категорії

### Отримання всіх категорій

```http
GET /categories
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Гарячі напої",
    "description": "Чай, кава, гарячий шоколад",
    "icon": "☕",
    "created_at": "2024-01-22T10:30:00Z"
  },
  {
    "id": 2,
    "name": "Холодні напої",
    "description": "Сокі, лимонади, холодний чай",
    "icon": "🧊",
    "created_at": "2024-01-22T10:30:00Z"
  }
]
```

### Отримання категорії з товарами

```http
GET /categories/:id
```

**Response (200):**
```json
{
  "category": {
    "id": 1,
    "name": "Гарячі напої",
    "description": "Чай, кава, гарячий шоколад",
    "icon": "☕"
  },
  "products": [
    {
      "id": 1,
      "name": "Еспресо",
      "description": "Класичний крепкий еспресо",
      "price": "40.00",
      "category_id": 1,
      "image_url": "https://...",
      "available": true
    }
  ]
}
```

---

## 🛍️ Товари

### Отримання всіх товарів

```http
GET /products
GET /products?category=1
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Еспресо",
    "description": "Класичний крепкий еспресо",
    "price": "40.00",
    "image_url": "https://...",
    "available": true,
    "category_id": 1,
    "category_name": "Гарячі напої"
  }
]
```

### Отримання одного товару

```http
GET /products/:id
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Еспресо",
  "description": "Класичний крепкий еспресо",
  "price": "40.00",
  "image_url": "https://...",
  "available": true,
  "category_id": 1,
  "category_name": "Гарячі напої"
}
```

### Додавання товару (Адмін)

```http
POST /products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Нова кава",
  "description": "Опис нової кави",
  "price": 65,
  "category_id": 1,
  "image_url": "https://example.com/coffee.jpg"
}
```

**Response (201):**
```json
{
  "message": "Product created successfully",
  "product": {
    "id": 17,
    "name": "Нова кава",
    "description": "Опис нової кави",
    "price": "65.00",
    "category_id": 1,
    "image_url": "https://example.com/coffee.jpg",
    "available": true,
    "created_at": "2024-01-22T10:30:00Z",
    "updated_at": "2024-01-22T10:30:00Z"
  }
}
```

### Редагування товару (Адмін)

```http
PUT /products/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Оновлена кава",
  "description": "Новий опис",
  "price": 70,
  "category_id": 1,
  "image_url": "https://example.com/coffee.jpg",
  "available": true
}
```

**Response (200):**
```json
{
  "message": "Product updated successfully",
  "product": { ... }
}
```

### Видалення товару (Адмін)

```http
DELETE /products/:id
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "message": "Product deleted successfully"
}
```

---

## 📦 Замовлення

### Створення замовлення

```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    },
    {
      "product_id": 3,
      "quantity": 1
    }
  ]
}
```

**Response (201):**
```json
{
  "message": "Order created successfully",
  "order": {
    "id": 1,
    "user_id": 1,
    "total_price": "125.00",
    "status": "pending",
    "created_at": "2024-01-22T10:30:00Z",
    "updated_at": "2024-01-22T10:30:00Z"
  }
}
```

### Отримання замовлень користувача

```http
GET /orders
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "total_price": "125.00",
    "status": "pending",
    "created_at": "2024-01-22T10:30:00Z",
    "items": [
      {
        "id": 1,
        "product_id": 1,
        "quantity": 2,
        "price": "40.00",
        "product_name": "Еспресо"
      }
    ]
  }
]
```

### Отримання одного замовлення

```http
GET /orders/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "user_id": 1,
  "total_price": "125.00",
  "status": "pending",
  "created_at": "2024-01-22T10:30:00Z",
  "items": [
    {
      "id": 1,
      "product_id": 1,
      "quantity": 2,
      "price": "40.00",
      "product_name": "Еспресо"
    }
  ]
}
```

---

## 🧪 Тестування API

### З використанням curl

```bash
# Реєстрація
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password","name":"Test User"}'

# Вхід
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password"}'

# Отримання товарів
curl http://localhost:5000/api/products
```

### З використанням Postman

1. Відкрийте Postman
2. Створіть нову колекцію "CHAYKOF API"
3. Додайте requests з вище наведених прикладів
4. Встановіть змінну оточення `token` для аутентифікації

---

## ⚠️ Коди помилок

| Код | Опис |
|-----|------|
| `200` | Успіх |
| `201` |創作успішно |
| `400` | Невірні дані |
| `401` | Немає аутентифікації |
| `403` | Немає дозволу (не адмін) |
| `404` | Не знайдено |
| `500` | Помилка сервера |

---

## 📝 Примітки

- Всі токени мають строк дійсності 7 днів
- Токен передається у заголовку: `Authorization: Bearer <token>`
- Пароль користувачів хешується bcrypt
- Ціни зберігаються з 2 знаками після коми

---

**API Версія:** 1.0.0
