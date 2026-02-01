import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

export default function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>CHAYKOF & LOFT BAR</h1>
          <p>Мінімалістичний затишок, смачні напої та легкі страви щодня.</p>
          <div className="hero-tags">
            <span>☕ Кава</span>
            <span>🥐 Сніданки</span>
            <span>🍰 Десерти</span>
            <span>🍹 Коктейлі</span>
          </div>
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
            <p>Кава та чай з якісних зерен і листя</p>
          </div>

          <div className="feature">
            <div className="feature-icon">🍹</div>
            <h3>Коктейлі</h3>
            <p>Класика і легкі авторські мікси</p>
          </div>

          <div className="feature">
            <div className="feature-icon">🍰</div>
            <h3>Десерти</h3>
            <p>Ніжні тістечка та сезонні солодощі</p>
          </div>

          <div className="feature">
            <div className="feature-icon">👨‍👩‍👧‍👦</div>
            <h3>Сімейна атмосфера</h3>
            <p>Тихий простір для роботи й зустрічей</p>
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
