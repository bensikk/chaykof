import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';
import '../styles/AdminPanel.css';

export default function AdminPanel() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [variants, setVariants] = useState([{ label: 'Стандарт', grams: '', price: '', is_default: true }]);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    available: true
  });

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchProducts();
    fetchCategories();
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      setCategories(response.data);
      if (response.data.length > 0) {
        setSelectedCategory(response.data[0].id);
        if (!formData.category_id) {
          setFormData(prev => ({ ...prev, category_id: response.data[0].id }));
        }
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleVariantChange = (index, field, value) => {
    setVariants(prev => prev.map((v, i) => i === index ? { ...v, [field]: value } : v));
  };

  const addVariantRow = () => {
    setVariants(prev => [...prev, { label: '', grams: '', price: '', is_default: prev.length === 0 }]);
  };

  const removeVariantRow = (index) => {
    setVariants(prev => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length === 0) return [{ label: 'Стандарт', grams: '', price: '', is_default: true }];
      if (!next.some(v => v.is_default)) {
        next[0] = { ...next[0], is_default: true };
      }
      return next;
    });
  };

  const setDefaultVariant = (index) => {
    setVariants(prev => prev.map((v, i) => ({ ...v, is_default: i === index })));
  };

  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    setImageFile(file || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = formData.image_url;

      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('image', imageFile);
        console.log('Uploading image file:', imageFile.name);
        const uploadRes = await axios.post(`${API_BASE_URL}/products/upload`, uploadData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        // Зберігаємо тільки відносний шлях у БД
        imageUrl = uploadRes.data.url;
        console.log('Image uploaded, URL:', imageUrl);
        // Оновлюємо формData з новою URL
        setFormData(prev => ({ ...prev, image_url: imageUrl }));
        // Очищуємо imageFile після успішної загрузки
        setImageFile(null);
      }

      const fallbackPrice = formData.price ? Number(formData.price) : 0;
      const preparedVariants = variants.map(v => ({
        label: v.label || 'Варіант',
        grams: v.grams ? Number(v.grams) : null,
        price: v.price ? Number(v.price) : fallbackPrice,
        is_default: v.is_default === true
      }));

      const payload = { ...formData, image_url: imageUrl, variants: preparedVariants };
      console.log('Submitting payload:', payload);

      if (editingId) {
        console.log('Updating product:', editingId);
        await axios.put(`${API_BASE_URL}/products/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Товар оновлено!');
      } else {
        console.log('Creating new product');
        await axios.post(`${API_BASE_URL}/products`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Товар додано!');
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error('Submit error:', err.response?.data || err.message);
      alert('Помилка: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    const productVariants = Array.isArray(product.variants) && product.variants.length > 0
      ? product.variants.map(v => ({
          label: v.label,
          grams: v.grams ?? '',
          price: v.price,
          is_default: v.is_default
        }))
      : [{ label: 'Стандарт', grams: '', price: product.price, is_default: true }];
    setVariants(productVariants);
    setImageFile(null);
    setEditingId(product.id);
    setShowForm(true);
    
    // Автоматический скролл наверх
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Ви впевнені?')) {
      try {
        await axios.delete(`${API_BASE_URL}/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Товар видалено!');
        fetchProducts();
      } catch (err) {
        alert('Помилка: ' + err.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category_id: categories[0]?.id || '',
      image_url: '',
      available: true
    });
    setVariants([{ label: 'Стандарт', grams: '', price: '', is_default: true }]);
    setImageFile(null);
    setEditingId(null);
    setShowForm(false);
  };

  const previewImage = imageFile ? URL.createObjectURL(imageFile) : (formData.image_url || '');
  
  // Фильтруем товары по выбранной категории
  const filteredProducts = selectedCategory
    ? products.filter(p => p.category_id === selectedCategory)
    : products;

  return (
    <div className="admin-panel">
      <h1>🔧 Адмін-панель</h1>
      
      <div className="admin-actions">
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Скасувати' : '+ Додати товар'}
        </button>
      </div>

      {showForm && (
        <form className="product-form" onSubmit={handleSubmit}>
          <h2>{editingId ? 'Редагування товару' : 'Додання нового товару'}</h2>
          
          <div className="form-group">
            <label>Назва *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Опис</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Базова ціна (₴) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label>Категорія *</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                required
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Зображення</label>
            <input type="file" accept="image/*" onChange={handleImageFile} />
            {(previewImage) && (
              <div className="image-preview">
                <img src={previewImage} alt="Прев'ю" />
                {!imageFile && formData.image_url && (
                  <small>Поточне зображення використовується, якщо не завантажувати нове</small>
                )}
              </div>
            )}
          </div>

          <div className="variants-block">
            <div className="variants-header">
              <h3>Варіанти (грамовка / ціна)</h3>
              <button type="button" className="btn btn-secondary btn-sm" onClick={addVariantRow}>+ Додати варіант</button>
            </div>
            <div className="variant-list">
              {variants.map((variant, index) => (
                <div key={index} className="variant-row">
                  <div className="form-group">
                    <label>Назва</label>
                    <input
                      type="text"
                      value={variant.label}
                      onChange={(e) => handleVariantChange(index, 'label', e.target.value)}
                      placeholder="Напр., 310 г"
                    />
                  </div>
                  <div className="form-group">
                    <label>Вага (г)</label>
                    <input
                      type="number"
                      value={variant.grams}
                      onChange={(e) => handleVariantChange(index, 'grams', e.target.value)}
                      placeholder="310"
                    />
                  </div>
                  <div className="form-group">
                    <label>Ціна (₴)</label>
                    <input
                      type="number"
                      value={variant.price}
                      onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="variant-actions">
                    <label className="default-radio">
                      <input
                        type="radio"
                        name="defaultVariant"
                        checked={variant.is_default === true}
                        onChange={() => setDefaultVariant(index)}
                      />
                      За замовчуванням
                    </label>
                    {variants.length > 1 && (
                      <button type="button" className="btn btn-sm btn-danger" onClick={() => removeVariantRow(index)}>
                        Видалити
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group checkbox">
            <input
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleInputChange}
              id="available"
            />
            <label htmlFor="available">Доступно</label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-success">
              {editingId ? 'Оновити' : 'Додати'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Скасувати
            </button>
          </div>
        </form>
      )}

      <div className="products-table">
        <div className="table-header">
          <h2>Список товарів ({filteredProducts.length} / {products.length})</h2>
        </div>
        
        <div className="categories-filter">
          <button 
            className={`category-btn ${selectedCategory === null ? 'active' : ''}`}
            onClick={() => setSelectedCategory(null)}
          >
            Всі ({products.length})
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span>{category.icon}</span> {category.name} ({products.filter(p => p.category_id === category.id).length})
            </button>
          ))}
        </div>
        
        <div className="products-list">
          <table>
            <thead>
              <tr>
                <th>Назва</th>
                <th>Категорія</th>
                <th>Ціна</th>
                <th>Доступно</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id}>
                  <td data-label="Назва">{product.name}</td>
                  <td data-label="Категорія">{product.category_name}</td>
                  <td data-label="Ціна">{product.price} ₴</td>
                  <td data-label="Доступно">{product.available ? '✓' : '✗'}</td>
                  <td data-label="Дії" className="actions-cell">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleEdit(product)}
                    >
                      Редагувати
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(product.id)}
                    >
                      Видалити
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
