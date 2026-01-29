-- Оновлення паролів для демо-акаунтів
-- Пароль для всіх: "password"
-- Bcrypt хеш: $2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi

UPDATE users 
SET password = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE email IN ('admin@chaykof.com', 'manager@chaykof.com', 'user@chaykof.com');

-- Перевірка
SELECT id, name, email, role FROM users WHERE email IN ('admin@chaykof.com', 'manager@chaykof.com', 'user@chaykof.com');
