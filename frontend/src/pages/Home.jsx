import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

export default function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>☕ Сімейне кафе CHAYKOF & LOFT BAR</h1>
          <p>Чайна та лофт-бар атмосфера для вашої сім'ї</p>
          <Link to="/menu" className="btn btn-primary btn-large">
            Переглянути меню
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <div className="feature">
            <div className="feature-icon">☕</div>
            <h3>Гарячі напої</h3>
            <p>Смачна кава, чай та гарячий шоколад для кожного</p>
          </div>

          <div className="feature">
            <div className="feature-icon">🍹</div>
            <h3>Коктейлі</h3>
            <p>Різноманітні класичні та авторські коктейлі</p>
          </div>

          <div className="feature">
            <div className="feature-icon">🍰</div>
            <h3>Десерти</h3>
            <p>Смачні тістечка та сладкі дива</p>
          </div>

          <div className="feature">
            <div className="feature-icon">👨‍👩‍👧‍👦</div>
            <h3>Сімейна атмосфера</h3>
            <p>Теплий та привітний атмос для всієї сім'ї</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h2>Готові до замовлення?</h2>
        <Link to="/menu" className="btn btn-primary btn-large">
          Перейти в меню
        </Link>
      </section>
    </div>
  );
}
