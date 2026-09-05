import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid, List, Search, SlidersHorizontal, PackageX, Sparkles } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from '../components/ProductCard';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';

export const MarketplacePage = () => {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'All';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [priceRange, setPriceRange] = useState(40000);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Sync URL search params
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedCondition('All');
    setPriceRange(40000);
    setSortBy('newest');
    setSearchParams({});
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Only display Admin approved active products
      if (p.status !== 'Active') {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesCollege = p.college.toLowerCase().includes(query);
        const matchesCategory = p.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCollege && !matchesCategory) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'All' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // Condition filter
      if (selectedCondition !== 'All' && p.condition.toLowerCase() !== selectedCondition.toLowerCase()) {
        return false;
      }

      // Price range filter
      if (p.price > priceRange) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'popular') return (b.views || 0) - (a.views || 0);
      // default newest
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [products, searchQuery, selectedCategory, selectedCondition, priceRange, sortBy]);

  return (
    <div className="marketplace-page page-container">
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">College Marketplace</h1>
          <p className="page-subtitle">Browse verified listings from students across top universities</p>
        </div>

        {/* View Mode Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '4px' }}>
          <button
            onClick={() => setViewMode('grid')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: viewMode === 'grid' ? '#4f46e5' : 'transparent',
              color: viewMode === 'grid' ? '#ffffff' : '#64748b',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
          >
            <Grid size={16} /> Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: viewMode === 'list' ? '#4f46e5' : 'transparent',
              color: viewMode === 'list' ? '#ffffff' : '#64748b',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
          >
            <List size={16} /> List
          </button>
        </div>
      </div>

      {/* Top Search Bar Row */}
      <div style={{ marginBottom: '2rem' }}>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearchSubmit={(val) => {
            if (val) setSearchParams({ search: val });
            else setSearchParams({});
          }}
          showFilterToggle={true}
          onToggleFilter={() => setShowMobileFilter(!showMobileFilter)}
        />
      </div>

      {/* Main Layout Grid (Filter Sidebar + Products Display) */}
      <div style={{ display: 'grid', gridTemplateColumns: showMobileFilter ? '1fr' : '280px 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Desktop Filter Panel */}
        <div className={`filter-sidebar ${showMobileFilter ? 'mobile-show' : ''}`}>
          <FilterPanel
            selectedCategory={selectedCategory}
            setSelectedCategory={(cat) => {
              setSelectedCategory(cat);
              if (cat !== 'All') setSearchParams({ category: cat });
              else setSearchParams({});
            }}
            selectedCondition={selectedCondition}
            setSelectedCondition={setSelectedCondition}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            sortBy={sortBy}
            setSortBy={setSortBy}
            resetFilters={resetFilters}
            totalResultsCount={filteredProducts.length}
          />
        </div>

        {/* Product Cards Container */}
        <div>
          {/* Active Filter Chips */}
          {(selectedCategory !== 'All' || selectedCondition !== 'All' || searchQuery || priceRange < 40000) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Active Filters:</span>
              {selectedCategory !== 'All' && (
                <span className="badge-condition" style={{ position: 'static', background: '#e0e7ff', color: '#4f46e5' }}>
                  Category: {selectedCategory}
                </span>
              )}
              {selectedCondition !== 'All' && (
                <span className="badge-condition" style={{ position: 'static', background: '#fef3c7', color: '#92400e' }}>
                  Condition: {selectedCondition}
                </span>
              )}
              {searchQuery && (
                <span className="badge-condition" style={{ position: 'static', background: '#e0f2fe', color: '#0369a1' }}>
                  Query: "{searchQuery}"
                </span>
              )}
              {priceRange < 40000 && (
                <span className="badge-condition" style={{ position: 'static', background: '#d1fae5', color: '#065f46' }}>
                  Under ₹{priceRange.toLocaleString('en-IN')}
                </span>
              )}
              <button onClick={resetFilters} style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 600, textDecoration: 'underline', marginLeft: '0.5rem' }}>
                Clear All
              </button>
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <PackageX size={36} />
              </div>
              <h3 className="empty-title">No Products Found</h3>
              <p className="empty-desc">
                We couldn't find any products matching your selected search or filter criteria. Try resetting filters or searching with different keywords.
              </p>
              <button className="btn btn-primary" onClick={resetFilters}>
                Reset Filters
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'product-grid' : 'product-list'}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode={viewMode} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
