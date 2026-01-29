import React from 'react';
import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>🏠 Контакти</h3>
          <p>вулиця Центральна, Сахновщина, Харківська область</p>
          <p>☎️ <a href="tel:0962596128">0962596128</a></p>
        </div>

        <div className="footer-section">
          <h3>🕐 Години роботи</h3>
          <p>Пн-Нд: 07:45 - 22:00</p>
        </div>

        <div className="footer-section">
          <h3>📱 Соціальні мережі</h3>
          <a href="https://www.instagram.com/chaykof_official/" target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          <br />
          <a href="https://www.facebook.com/profile.php?id=100051160608109" target="_blank" rel="noopener noreferrer">
            Facebook
          </a>
        </div>

        <div className="footer-section">
          <h3>📍 Локація</h3>
          <a href="https://maps.app.goo.gl/N2jXVjJb53sT6X2r7" target="_blank" rel="noopener noreferrer">
            На Google Maps
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Сімейне кафе CHAYKOF & LOFT BAR. Усі права захищені.</p>
      </div>
    </footer>
  );
}
