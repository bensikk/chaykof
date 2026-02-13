import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Вхід</h1>
        
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
            <label>Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={password ? 'success' : ''}
              required
            />
            {password && password.length < 6 && (
              <small className="error-text">Пароль надто короткий</small>
            )}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading || !username.trim() || !password}>
            {loading ? 'Завантаження...' : 'Вхід'}
          </button>
        </form>

        <p className="auth-link">
          Немаєте обліку? <a href="/register">Реєстрація</a>
        </p>

        <div className="demo-accounts">
          <p><strong>Демо-акаунти:</strong></p>
          <p>Логін: admin | Пароль: password</p>
          <p>Логін: manager | Пароль: password</p>
          <p>Логін: user | Пароль: password</p>
        </div>
      </div>
    </div>
  );
}
