import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Валідація пароля
  const validatePassword = (pwd) => {
    return pwd.length >= 6;
  };

  // Валідація номера телефону (10 цифр)
  const validatePhone = (ph) => {
    // Видаляємо всі нецифрові символи
    let digitsOnly = ph.replace(/\D/g, '');
    
    // Якщо номер починається з 380, видаляємо 38
    if (digitsOnly.startsWith('380')) {
      digitsOnly = digitsOnly.substring(2);
    }
    
    return digitsOnly.length === 10;
  };

  const isPasswordValid = validatePassword(password);
  const isPhoneValid = validatePhone(phone);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Перевірка валідності
    if (!username.trim()) {
      setError('Будь ласка, введіть логін');
      return;
    }
    if (!name.trim()) {
      setError('Будь ласка, введіть ім\'я');
      return;
    }
    if (!isPhoneValid) {
      setError('Формат номера: +380XXXXXXXXX або 0XXXXXXXXX (10 цифр)');
      return;
    }
    if (!isPasswordValid) {
      setError('Пароль не відповідає вимогам безпеки');
      return;
    }

    setLoading(true);
    try {
      await register(username, password, name, phone);
      alert('Реєстрація успішна! Тепер увійдіть.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Помилка реєстрації');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Реєстрація</h1>
        
        {error && (
          <div className="error-message">
            <strong>❌ Помилка:</strong> {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Логін</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={username && username.trim() ? 'success' : username ? 'error' : ''}
              required
            />
            {username && !username.trim() && (
              <small className="error-text">Логін не може бути порожнім</small>
            )}
          </div>

          <div className="form-group">
            <label>Ім'я</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={name && name.trim() ? 'success' : name ? 'error' : ''}
              required
            />
            {name && !name.trim() && (
              <small className="error-text">Ім'я не може бути порожнім</small>
            )}
          </div>

          <div className="form-group">
            <label>Номер телефону</label>
            <input
              type="tel"
              placeholder="+380989105975 або 0989105975"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={phone && isPhoneValid ? 'success' : phone ? 'error' : ''}
              required
            />
            {phone && !isPhoneValid && (
              <small className="error-text">Формат: +380XXXXXXXXX або 0XXXXXXXXX (10 цифр)</small>
            )}
            {phone && isPhoneValid && (
              <small className="success-text">✓ Номер правильний</small>
            )}
          </div>

          <div className="form-group">
            <label>Пароль</label>
            <input
              type="password"
              placeholder="Введіть пароль (мінімум 6 символів)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={password && isPasswordValid ? 'success' : password ? 'error' : ''}
              required
              minLength={6}
            />
            {password && password.length > 0 && password.length < 6 && (
              <small className="error-text">Пароль повинен містити мінімум 6 символів</small>
            )}
            {password && password.length >= 6 && (
              <small className="success-text">✓ Пароль підходить</small>
            )}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading || !isPasswordValid || !isPhoneValid || !username || !name}
          >
            {loading ? 'Завантаження...' : 'Реєстрація'}
          </button>
        </form>

        <p className="auth-link">
          Вже маєте обліку? <a href="/login">Вхід</a>
        </p>
      </div>
    </div>
  );
}
