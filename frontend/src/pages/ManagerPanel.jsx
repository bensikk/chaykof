import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';
import '../styles/ManagerPanel.css';

export default function ManagerPanel() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('today');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    if (user?.role !== 'manager' && user?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Статус замовлення оновлено!');
      fetchOrders();
    } catch (err) {
      alert('Помилка: ' + err.response?.data?.error || err.message);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { label: 'Очікує', class: 'status-pending' },
      accepted: { label: 'Прийнято', class: 'status-accepted' },
      preparing: { label: 'Готується', class: 'status-preparing' },
      ready: { label: 'Готово', class: 'status-ready' },
      completed: { label: 'Завершено', class: 'status-completed' },
      cancelled: { label: 'Скасовано', class: 'status-cancelled' }
    };
    const badge = badges[status] || { label: status, class: '' };
    return <span className={`status-badge ${badge.class}`}>{badge.label}</span>;
  };

  const filterByDate = (order) => {
    const orderDate = new Date(order.created_at);
    const now = new Date();
    
    switch(dateFilter) {
      case 'today':
        return orderDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return orderDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return orderDate >= monthAgo;
      default:
        return true;
    }
  };

  const filteredOrders = orders.filter(order => {
    const statusMatch = filter === 'all' || order.status === filter;
    const dateMatch = filterByDate(order);
    const searchMatch = searchTerm === '' || 
      order.id.toString().includes(searchTerm) ||
      order.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user_login || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user_email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user_phone || '').includes(searchTerm);
    
    return statusMatch && dateMatch && searchMatch;
  });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  return (
    <div className="manager-panel">
      <h1>👨‍💼 Панель менеджера - Замовлення</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Пошук за номером, ім'ям, телефоном або логіном..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="search-input"
        />
      </div>

      <div className="date-filters">
        <button
          className={`date-btn ${dateFilter === 'today' ? 'active' : ''}`}
          onClick={() => { setDateFilter('today'); setCurrentPage(1); }}
        >
          Сьогодні
        </button>
        <button
          className={`date-btn ${dateFilter === 'all' ? 'active' : ''}`}
          onClick={() => { setDateFilter('all'); setCurrentPage(1); }}
        >
          Всі дати
        </button>
        <button
          className={`date-btn ${dateFilter === 'week' ? 'active' : ''}`}
          onClick={() => { setDateFilter('week'); setCurrentPage(1); }}
        >
          Тиждень
        </button>
        <button
          className={`date-btn ${dateFilter === 'month' ? 'active' : ''}`}
          onClick={() => { setDateFilter('month'); setCurrentPage(1); }}
        >
          Місяць
        </button>
      </div>

      <div className="filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => { setFilter('all'); setCurrentPage(1); }}
        >
          Всі ({orders.length})
        </button>
        <button
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => { setFilter('pending'); setCurrentPage(1); }}
        >
          Очікують ({orders.filter(o => o.status === 'pending').length})
        </button>
        <button
          className={`filter-btn ${filter === 'accepted' ? 'active' : ''}`}
          onClick={() => { setFilter('accepted'); setCurrentPage(1); }}
        >
          Прийнято ({orders.filter(o => o.status === 'accepted').length})
        </button>
        <button
          className={`filter-btn ${filter === 'preparing' ? 'active' : ''}`}
          onClick={() => { setFilter('preparing'); setCurrentPage(1); }}
        >
          Готується ({orders.filter(o => o.status === 'preparing').length})
        </button>
        <button
          className={`filter-btn ${filter === 'ready' ? 'active' : ''}`}
          onClick={() => { setFilter('ready'); setCurrentPage(1); }}
        >
          Готово ({orders.filter(o => o.status === 'ready').length})
        </button>
      </div>

      <div className="results-info">
        Показано {currentOrders.length} з {filteredOrders.length} замовлень
      </div>

      {loading ? (
        <p className="loading">Завантаження...</p>
      ) : (
        <>
        <div className="orders-list">
          {currentOrders.length > 0 ? (
            currentOrders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>Замовлення #{order.id}</h3>
                    <p className="order-date">
                      {new Date(order.created_at).toLocaleString('uk-UA')}
                    </p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                <div className="order-customer">
                  <p><strong>Клієнт:</strong> {order.user_name}</p>
                  <p><strong>Логін:</strong> {order.user_login || '—'}</p>
                  {order.user_phone && <p><strong>📞 Телефон:</strong> {order.user_phone}</p>}
                  {order.user_email && <p><strong>Email:</strong> {order.user_email}</p>}
                </div>

                <div className="order-items">
                  <h4>Товари:</h4>
                  {order.items && order.items.map((item, idx) => (
                    <div key={idx} className="order-item">
                      <span>{item.product_name}{item.variant_label ? ` (${item.variant_label}${item.variant_grams ? ` • ${item.variant_grams} г` : ''})` : ''}</span>
                      <span>x{item.quantity}</span>
                      <span>{(item.price * item.quantity).toFixed(2)} ₴</span>
                    </div>
                  ))}
                </div>

                <div className="order-total">
                  <strong>Всього:</strong>
                  <strong>{parseFloat(order.total_price).toFixed(2)} ₴</strong>
                </div>

                <div className="order-actions">
                  {order.status === 'pending' && (
                    <>
                      <button
                        className="btn btn-success"
                        onClick={() => updateOrderStatus(order.id, 'accepted')}
                      >
                        ✓ Прийняти
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      >
                        ✗ Скасувати
                      </button>
                    </>
                  )}
                  {order.status === 'accepted' && (
                    <button
                      className="btn btn-primary"
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                    >
                      🍳 Почати готувати
                    </button>
                  )}
                  {order.status === 'preparing' && (
                    <button
                      className="btn btn-warning"
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                    >
                      ✓ Готово
                    </button>
                  )}
                  {order.status === 'ready' && (
                    <button
                      className="btn btn-success"
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                    >
                      ✓ Видано
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="no-orders">Немає замовлень за обраними фільтрами</p>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              ← Попередня
            </button>
            
            <div className="pagination-pages">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`pagination-page ${currentPage === index + 1 ? 'active' : ''}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Наступна →
            </button>
          </div>
        )}
        </>
      )}
    </div>
  );
}
