import React, { useState } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

export const SearchBar = ({ searchQuery, setSearchQuery, onSearchSubmit, placeholder = "Search books, laptops, cycles, calculators...", showFilterToggle, onToggleFilter }) => {
  const [localQuery, setLocalQuery] = useState(searchQuery || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(localQuery);
    if (onSearchSubmit) onSearchSubmit(localQuery);
  };

  const handleClear = () => {
    setLocalQuery('');
    setSearchQuery('');
    if (onSearchSubmit) onSearchSubmit('');
  };

  return (
    <form className="search-bar-wrapper" onSubmit={handleSubmit} style={{ position: 'relative', display: 'flex', gap: '0.5rem', width: '100%' }}>
      <div style={{ position: 'relative', flex: 1 }}>
        <Search 
          size={20} 
          color="#94a3b8" 
          style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} 
        />
        <input
          type="text"
          className="form-control"
          placeholder={placeholder}
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          style={{
            paddingLeft: '48px',
            paddingRight: localQuery ? '40px' : '16px',
            height: '48px',
            fontSize: '1rem',
            borderRadius: '12px',
            border: '1.5px solid #cbd5e1',
            backgroundColor: '#ffffff'
          }}
        />
        {localQuery && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
              padding: '4px'
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      <button type="submit" className="btn btn-primary" style={{ height: '48px', padding: '0 1.5rem', borderRadius: '12px' }}>
        <Search size={18} />
        <span>Search</span>
      </button>

      {showFilterToggle && (
        <button
          type="button"
          className="btn btn-outline"
          onClick={onToggleFilter}
          style={{ height: '48px', padding: '0 1rem', borderRadius: '12px' }}
        >
          <SlidersHorizontal size={18} />
          <span>Filters</span>
        </button>
      )}
    </form>
  );
};
