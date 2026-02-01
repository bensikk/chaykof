import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import logo from '../assets/logo.svg';
import '../styles/Header.css';

export default function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <img src={logo} alt="Chaykof Logo" className="logo-image" />
          <div className="logo-text">
            <div className="logo-title">CHAYKOF</div>
            <div className="logo-subtitle">сімейне кафе</div>
          </div>
        </Link>

        <button
          className="mobile-menu-toggle"
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-label="Перемкнути меню"
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <div className={`header-controls ${menuOpen ? 'open' : ''}`}>
          <nav className="nav">
            <Link to="/" className="nav-link" onClick={closeMenu}>Головна</Link>
            <Link to="/menu" className="nav-link" onClick={closeMenu}>Меню</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="nav-link admin-link" onClick={closeMenu}>🔧 Адмін</Link>
            )}
            {(user?.role === 'manager' || user?.role === 'admin') && (
              <Link to="/manager" className="nav-link manager-link" onClick={closeMenu}>👨‍💼 Менеджер</Link>
            )}
          </nav>

          <div className="header-actions">
            <Link to="/cart" className="cart-link" onClick={closeMenu}>
              🛒 Кошик ({cart.length})
            </Link>

            {user ? (
              <div className="user-menu">
                <span className="user-name">{user.name || user.username || user.email}</span>
                <button className="btn btn-secondary" onClick={() => { logout(); closeMenu(); }}>
                  Вихід
                </button>
              </div>
            ) : (
              <div className="auth-links">
                <Link to="/login" className="btn btn-secondary" onClick={closeMenu}>Вхід</Link>
                <Link to="/register" className="btn btn-primary" onClick={closeMenu}>Реєстрація</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
