import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ArrowRight, Eye, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useProducts } from '../context/ProductContext';
import { useToast } from '../context/ToastContext';
import { ProductCard } from '../components/ProductCard';

export const WishlistPage = () => {
  const { wishlistIds, removeFromWishlist, clearWishlist } = useWishlist();
  const { products } = useProducts();
  const { addToast } = useToast();

  const savedProducts = products.filter((p) => wishlistIds.includes(p.id));

  const handleClearAll = () => {
    if (window.confirm('Clear all items from your wishlist?')) {
      clearWishlist();
      addToast('Wishlist cleared', 'info');
    }
  };

  return (
    <div className="wishlist-page page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Saved Wishlist ({savedProducts.length})</h1>
          <p className="page-subtitle">Products you saved to compare or purchase later</p>
        </div>

        {savedProducts.length > 0 && (
          <button className="btn btn-outline btn-sm" onClick={handleClearAll}>
            <Trash2 size={14} /> Clear All
          </button>
        )}
      </div>

      {savedProducts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Heart size={36} />
          </div>
          <h3 className="empty-title">Your Wishlist is Empty</h3>
          <p className="empty-desc">
            Save items you like by tapping the heart icon on product cards while browsing the marketplace.
          </p>
          <Link to="/marketplace" className="btn btn-primary">
            <ShoppingBag size={18} /> Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="product-grid">
          {savedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
