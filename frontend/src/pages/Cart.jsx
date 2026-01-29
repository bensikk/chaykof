import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../styles/Cart.css';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const { user, token } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const handleCheckout = async () => {
    if (!user) {
      alert('Будь ласка, увійдіть в аккаунт');
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    try {
      const items = cart.map(item => ({
        product_id: item.id,
        variant_id: item.variant?.id,
        quantity: item.quantity
      }));

      await axios.post('/api/orders', { items }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Замовлення успішно створено!');
      clearCart();
    } catch (err) {
      alert('Помилка при оформленні замовлення: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <h1>🛒 Ваш кошик</h1>
        <div className="empty-cart">
          <p>Кошик порожній</p>
          <a href="/menu" className="btn btn-primary">Перейти в меню</a>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>🛒 Ваш кошик</h1>

      <div className="cart-container">
        <div className="cart-items">
          {cart.map(item => (
            <div key={`${item.id}-${item.variant?.id ?? 'default'}`} className="cart-item">
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                {item.variant && (
                  <p className="cart-item-variant">{item.variant.label}{item.variant.grams ? ` • ${item.variant.grams} г` : ''}</p>
                )}
                <p>{item.price} ₴</p>
              </div>

              <div className="cart-item-quantity">
                <button onClick={() => updateQuantity(item.id, item.variant?.id, item.quantity - 1)}>−</button>
                <input type="number" value={item.quantity} readOnly />
                <button onClick={() => updateQuantity(item.id, item.variant?.id, item.quantity + 1)}>+</button>
              </div>

              <div className="cart-item-total">
                {(item.price * item.quantity).toFixed(2)} ₴
              </div>

              <button 
                className="btn btn-danger"
                onClick={() => removeFromCart(item.id, item.variant?.id)}
              >
                Видалити
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Сумарна вартість</h2>
          <div className="summary-line">
            <span>Товари ({cart.length}):</span>
            <span>{getTotalPrice().toFixed(2)} ₴</span>
          </div>
          <div className="summary-total">
            <strong>Всього:</strong>
            <strong>{getTotalPrice().toFixed(2)} ₴</strong>
          </div>

          <button 
            className="btn btn-primary btn-block"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? 'Обробка...' : 'Оформити замовлення'}
          </button>

          <button 
            className="btn btn-secondary btn-block"
            onClick={clearCart}
          >
            Очистити кошик
          </button>
        </div>
      </div>
    </div>
  );
}
