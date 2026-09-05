import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MapPin, Eye, ArrowRight, CheckCircle2, User } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

export const ProductCard = ({ product, viewMode = 'grid' }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const isSaved = isInWishlist(product.id);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    if (!isSaved) {
      addToast(`Saved "${product.name.slice(0, 25)}..." to Wishlist!`, 'success');
    } else {
      addToast(`Removed from Wishlist`, 'info');
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="product-card" style={{ flexDirection: 'row', height: '180px' }}>
        <div style={{ width: '220px', minWidth: '220px', position: 'relative' }}>
          <div className="card-img-wrapper" style={{ paddingTop: '100%', height: '100%' }}>
            <img src={product.images[0]} alt={product.name} className="card-img" />
          </div>
          <span className={product.status === 'Sold' ? 'badge-sold' : 'badge-condition'}>
            {product.status === 'Sold' ? 'SOLD' : product.condition}
          </span>
        </div>

        <div className="card-content" style={{ flex: 1, padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="card-category">{product.category}</span>
            <button
              className={`card-wishlist-btn ${isSaved ? 'active' : ''}`}
              onClick={handleWishlistClick}
              title="Save to Wishlist"
              style={{ position: 'static', transform: 'none' }}
            >
              <Heart size={18} fill={isSaved ? '#ef4444' : 'none'} color={isSaved ? '#ef4444' : '#64748b'} />
            </button>
          </div>

          <Link to={`/product/${product.id}`} className="card-title" style={{ height: 'auto', marginBottom: '0.4rem' }}>
            {product.name}
          </Link>

          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
            <div className="card-price-row" style={{ marginBottom: 0 }}>
              <span className="card-price">₹{product.price.toLocaleString('en-IN')}</span>
              {product.originalPrice && (
                <span className="card-original-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <div className="card-seller-info" style={{ borderTop: 'none', padding: 0, marginTop: 0 }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <User size={13} />
                </div>
                <span style={{ fontWeight: 600 }}>{product.seller.name}</span>
                <span className="seller-location">
                  <MapPin size={12} /> {product.college}
                </span>
              </div>

              <Link to={`/product/${product.id}`} className="btn btn-outline btn-sm">
                View Details <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-card">
      <div className="card-img-wrapper">
        <img src={product.images[0]} alt={product.name} className="card-img" loading="lazy" />
        
        <span className={product.status === 'Sold' ? 'badge-sold' : 'badge-condition'}>
          {product.status === 'Sold' ? 'SOLD' : product.condition}
        </span>

        <button
          className={`card-wishlist-btn ${isSaved ? 'active' : ''}`}
          onClick={handleWishlistClick}
          aria-label="Add to Wishlist"
          title="Save to Wishlist"
        >
          <Heart size={18} fill={isSaved ? '#ef4444' : 'none'} color={isSaved ? '#ef4444' : '#64748b'} />
        </button>
      </div>

      <div className="card-content">
        <span className="card-category">{product.category}</span>
        
        <Link to={`/product/${product.id}`} className="card-title">
          {product.name}
        </Link>

        <div className="card-price-row">
          <span className="card-price">₹{product.price.toLocaleString('en-IN')}</span>
          {product.originalPrice && (
            <span className="card-original-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
          )}
        </div>

        <div className="card-seller-info">
          <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <User size={13} />
          </div>
          <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100px' }}>
            {product.seller.name}
          </span>

          <div className="seller-location">
            <MapPin size={12} />
            <span>{product.college.split(' ')[0]}</span>
          </div>
        </div>

        <div style={{ marginTop: '0.85rem', display: 'flex', gap: '0.5rem' }}>
          <Link to={`/product/${product.id}`} className="btn btn-outline btn-sm" style={{ width: '100%' }}>
            <Eye size={14} /> View Details
          </Link>
        </div>
      </div>
    </div>
  );
};
