import React from 'react';
import { useCart } from '../context/CartContext';
import API_BASE_URL, { BACKEND_HOST } from '../config/api';
import '../styles/ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = React.useState(1);

  const variants = Array.isArray(product.variants) && product.variants.length > 0
    ? product.variants
    : [{ id: `${product.id}-default`, label: 'Стандарт', price: product.price, is_default: true }];

  const defaultVariant = variants.find(v => v.is_default) || variants[0];
  const [selectedVariantId, setSelectedVariantId] = React.useState(defaultVariant?.id);

  const selectedVariant = variants.find(v => String(v.id) === String(selectedVariantId)) || defaultVariant;

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    setQuantity(1);
  };

  const handleImageError = (e) => {
    console.error('Image load error for:', e.target.src, e);
    e.target.style.display = 'none';
    const placeholder = e.target.parentElement?.querySelector('.product-image-placeholder');
    if (placeholder) {
      placeholder.style.display = 'flex';
    }
  };

  // Функція для отримання правильної URL для зображення
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) {
      console.warn('No image URL for product:', product.name);
      return '';
    }
    
    let finalUrl = '';
    
    // Якщо це повна URL (http/https), повертаємо як є
    if (imageUrl.startsWith('http')) {
      finalUrl = imageUrl;
    }
    // Якщо це відносна URL (/uploads/...)
    else if (imageUrl.startsWith('/uploads')) {
      // Використовуємо BACKEND_HOST для отримання файлів
      finalUrl = BACKEND_HOST + imageUrl;
    }
    // Інші випадки - додаємо backend host
    else {
      finalUrl = BACKEND_HOST + '/' + imageUrl;
    }
    
    console.log(`Image URL for ${product.name}:`, { original: imageUrl, final: finalUrl });
    return finalUrl;
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        {product.image_url ? (
          <img 
            src={getImageUrl(product.image_url)}
            alt={product.name} 
            className="product-image" 
            onError={handleImageError}
          />
        ) : null}
        <div className="product-image-placeholder">
          Немає фото
        </div>
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>

        <div className="variant-select">
          <label htmlFor={`variant-${product.id}`}>Виберіть вагу/порцію</label>
          <select
            id={`variant-${product.id}`}
            value={selectedVariantId}
            onChange={(e) => setSelectedVariantId(e.target.value)}
          >
            {variants.map(v => (
              <option key={v.id} value={v.id}>
                {v.label}{v.grams ? ` • ${v.grams} г` : ''} — {v.price} ₴
              </option>
            ))}
          </select>
        </div>
        
        <div className="product-footer">
          <div className="price-section">
            <span className="price">{selectedVariant?.price ?? product.price} ₴</span>
          </div>
          
          <div className="quantity-section">
            <button 
              className="qty-btn"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              −
            </button>
            <input 
              type="number" 
              value={quantity} 
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              className="qty-input"
            />
            <button 
              className="qty-btn"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>
          
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            До кошика
          </button>
        </div>
      </div>
    </div>
  );
}
