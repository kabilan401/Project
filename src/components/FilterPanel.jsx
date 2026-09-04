import React from 'react';
import { RotateCcw, Filter, Check } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';

export const FilterPanel = ({
  selectedCategory,
  setSelectedCategory,
  selectedCondition,
  setSelectedCondition,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  resetFilters,
  totalResultsCount
}) => {
  const conditions = ['All', 'Brand New', 'Like New', 'Gently Used', 'Fair'];

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.05rem' }}>
          <Filter size={18} color="#4f46e5" />
          <span>Filters ({totalResultsCount} Items)</span>
        </div>
        <button
          onClick={resetFilters}
          className="btn btn-outline btn-sm"
          style={{ fontSize: '0.8rem', padding: '0.25rem 0.6rem' }}
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* Sort By Option */}
      <div>
        <label className="form-label" style={{ marginBottom: '0.5rem' }}>Sort Products</label>
        <select
          className="form-control"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      {/* Category Filter */}
      <div>
        <label className="form-label" style={{ marginBottom: '0.5rem' }}>Category</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '220px', overflowY: 'auto', paddingRight: '0.25rem' }}>
          <button
            onClick={() => setSelectedCategory('All')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              padding: '0.5rem 0.75rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: selectedCategory === 'All' ? 700 : 500,
              backgroundColor: selectedCategory === 'All' ? '#eef2ff' : 'transparent',
              color: selectedCategory === 'All' ? '#4f46e5' : '#334155',
              textAlign: 'left'
            }}
          >
            <span>All Categories</span>
            {selectedCategory === 'All' && <Check size={16} />}
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: selectedCategory === cat.name ? 700 : 500,
                backgroundColor: selectedCategory === cat.name ? '#eef2ff' : 'transparent',
                color: selectedCategory === cat.name ? '#4f46e5' : '#334155',
                textAlign: 'left'
              }}
            >
              <span>{cat.name}</span>
              {selectedCategory === cat.name && <Check size={16} />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <label className="form-label">Max Price</label>
          <span style={{ fontWeight: 700, color: '#4f46e5', fontSize: '0.95rem' }}>₹{priceRange.toLocaleString('en-IN')}</span>
        </div>
        <input
          type="range"
          min="100"
          max="40000"
          step="250"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#4f46e5', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
          <span>₹100</span>
          <span>₹40,000+</span>
        </div>
      </div>

      {/* Condition Filter */}
      <div>
        <label className="form-label" style={{ marginBottom: '0.5rem' }}>Item Condition</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {conditions.map((cond) => (
            <button
              key={cond}
              onClick={() => setSelectedCondition(cond)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: selectedCondition === cond ? 700 : 500,
                backgroundColor: selectedCondition === cond ? '#4f46e5' : '#f1f5f9',
                color: selectedCondition === cond ? '#ffffff' : '#475569',
                border: 'none',
                transition: 'all 0.15s ease'
              }}
            >
              {cond}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
