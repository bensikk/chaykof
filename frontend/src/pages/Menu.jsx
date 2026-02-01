import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import API_BASE_URL from '../config/api';
import '../styles/Menu.css';

export default function Menu() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const productsGridRef = useRef(null);

  // Групування категорій
  const categoryGroups = {
    'Поїсти': ['Піца', 'Бургери', 'Фритюр', 'Хот-Дог', 'Японія', 'Салати', 'Перші страви', 'Паста', 'Соуси'],
    'Попити': ['Кава', 'Чай', 'Фреші', 'Лимонади', 'Напої', 'Коктейлі'],
    'Попити міцного': ['Алкоголь', 'Вино'],
    'Закусити': ['Закуски'],
    'Подиміти': ['Кальян']
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    // Прокручуємо до продуктів коли змінюється категорія
    if (selectedCategory && productsGridRef.current) {
      setTimeout(() => {
        productsGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      setCategories(response.data);
      if (response.data.length > 0) {
        setSelectedCategory(response.data[0].id);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      console.log('Products fetched:', response.data);
      console.log('Sample product image_urls:', response.data.slice(0, 3).map(p => ({ name: p.name, image_url: p.image_url })));
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category_id === selectedCategory)
    : products;

  return (
    <div className="menu">
      <h1>Наше Меню</h1>
      
      <div className="menu-sections">
        {Object.entries(categoryGroups).map(([groupName, groupCategories]) => {
          const groupCats = categories.filter(cat => groupCategories.includes(cat.name));
          if (groupCats.length === 0) return null;
          
          return (
            <div key={groupName} className="category-group">
              <h2 className="group-title">{groupName}</h2>
              <div className="categories">
                {groupCats.map(category => (
                  <button
                    key={category.id}
                    className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <span>{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="products-grid" ref={productsGridRef}>
        {loading ? (
          <p className="loading">Завантаження...</p>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="no-products">Немає товарів у цій категорії</p>
        )}
      </div>
    </div>
  );
}
