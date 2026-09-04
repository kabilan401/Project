import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  PlusCircle, 
  Search, 
  ShieldCheck, 
  ArrowRight, 
  TrendingUp, 
  Clock, 
  Star, 
  CheckCircle2, 
  Users, 
  Sparkles, 
  MessageSquare, 
  Handshake, 
  Lock 
} from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { useProducts } from '../context/ProductContext';
import { CategoryCard } from '../components/CategoryCard';
import { ProductCard } from '../components/ProductCard';
import { SafetySection } from '../components/SafetySection';

export const HomePage = () => {
  const navigate = useNavigate();
  const { products } = useProducts();
  const [heroSearch, setHeroSearch] = useState('');

  const featuredProducts = products.filter((p) => p.featured || p.price > 1000).slice(0, 4);
  const recentlyAddedProducts = products.slice(0, 4);
  const popularProducts = products.filter((p) => p.popular || p.views > 150).slice(0, 4);

  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/marketplace');
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #eef2ff 0%, #ffffff 50%, #f1f5f9 100%)',
        padding: '4.5rem 1.5rem 5rem',
        borderBottom: '1px solid #e2e8f0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '3rem',
          alignItems: 'center'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#e0e7ff',
              color: '#4f46e5',
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: 700,
              marginBottom: '1.25rem'
            }}>
              <Sparkles size={16} /> Exclusive Peer-to-Peer College Marketplace
            </div>

            <h1 style={{
              fontSize: '3.2rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#0f172a',
              lineHeight: 1.15,
              marginBottom: '1.25rem'
            }}>
              Buy & Sell Within Your Campus
            </h1>

            <p style={{
              fontSize: '1.2rem',
              color: '#475569',
              lineHeight: 1.6,
              marginBottom: '2rem',
              maxWidth: '560px'
            }}>
              Find affordable books, calculators, electronics, hostel items, and cycles from verified students around your college.
            </p>

            {/* Quick Hero Search Bar */}
            <form onSubmit={handleHeroSearchSubmit} style={{ display: 'flex', gap: '0.5rem', maxWidth: '560px', marginBottom: '2rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={20} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search 'B.S. Grewal', 'Casio Calculator', 'Laptop'..."
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  style={{ paddingLeft: '48px', height: '52px', fontSize: '1rem', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ height: '52px', padding: '0 1.5rem', borderRadius: '14px' }}>
                Search
              </button>
            </form>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/marketplace" className="btn btn-primary btn-lg">
                <ShoppingBag size={20} /> Browse Products
              </Link>
              <Link to="/sell" className="btn btn-outline btn-lg" style={{ backgroundColor: '#ffffff' }}>
                <PlusCircle size={20} /> Sell an Item
              </Link>
            </div>
          </div>

          {/* Hero Visual Card Stack */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '100%',
              maxWidth: '440px',
              background: '#ffffff',
              borderRadius: '24px',
              padding: '1.5rem',
              boxShadow: '0 25px 50px -12px rgba(79, 70, 229, 0.25)',
              border: '1px solid #c7d2fe',
              position: 'relative',
              zIndex: 2
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Trending on IIT Delhi</span>
                <span style={{ fontSize: '0.75rem', background: '#d1fae5', color: '#065f46', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '9999px' }}>Verified Student</span>
              </div>
              
              <div style={{ width: '100%', height: '200px', borderRadius: '16px', overflow: 'hidden', marginBottom: '1rem' }}>
                <img src={products[0]?.images[0]} alt="Hero featured product" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>{products[0]?.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>₹{products[0]?.price}</span>
                  <span style={{ fontSize: '0.875rem', color: '#94a3b8', textDecoration: 'line-through', marginLeft: '0.5rem' }}>₹{products[0]?.originalPrice}</span>
                </div>
                <Link to={`/product/${products[0]?.id}`} className="btn btn-soft btn-sm">
                  View <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Browse Categories Section */}
      <section className="page-container" style={{ paddingTop: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Explore Campus Needs</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>Browse Categories</h2>
          </div>
          <Link to="/marketplace" className="btn btn-soft btn-sm">
            View All Categories <ArrowRight size={16} />
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '1.25rem'
        }}>
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="page-container" style={{ paddingTop: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Sparkles size={16} /> Curated Picks
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>Featured Products</h2>
          </div>
          <Link to="/marketplace" className="btn btn-outline btn-sm">
            See Marketplace <ArrowRight size={16} />
          </Link>
        </div>

        <div className="product-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* How CampusMart Works */}
      <section style={{ backgroundColor: '#ffffff', borderVertical: '1px solid #e2e8f0', padding: '4rem 1.5rem', margin: '4rem 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Simple & Seamless</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>How CampusMart Works</h2>
            <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Buying and selling with students around your hostel is quick, safe, and transparent.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{ textAlign: 'center', padding: '2rem', background: '#f8fafc', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontWeight: 800, fontSize: '1.4rem' }}>
                1
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>List or Search Items</h3>
              <p style={{ color: '#64748b', fontSize: '0.925rem', lineHeight: 1.5 }}>
                Sellers upload product details and photos in 60 seconds. Buyers search by category, college, or price.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '2rem', background: '#f8fafc', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontWeight: 800, fontSize: '1.4rem' }}>
                2
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Chat & Agree on Price</h3>
              <p style={{ color: '#64748b', fontSize: '0.925rem', lineHeight: 1.5 }}>
                Use in-app messaging to negotiate price, ask product questions, and agree on a convenient campus spot.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '2rem', background: '#f8fafc', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontWeight: 800, fontSize: '1.4rem' }}>
                3
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Meet & Complete Deal</h3>
              <p style={{ color: '#64748b', fontSize: '0.925rem', lineHeight: 1.5 }}>
                Meet at your hostel library, canteen or Quad. Inspect the product, make UPI/cash payment, and enjoy!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Added Products */}
      <section className="page-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Clock size={16} /> Fresh Today
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>Recently Added</h2>
          </div>
          <Link to="/marketplace" className="btn btn-soft btn-sm">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="product-grid">
          {recentlyAddedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Student Safety Section */}
      <div className="page-container">
        <SafetySection />
      </div>

      {/* Popular Products */}
      <section className="page-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <TrendingUp size={16} /> High Demand
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>Popular Products</h2>
          </div>
          <Link to="/marketplace" className="btn btn-outline btn-sm">
            Explore Marketplace <ArrowRight size={16} />
          </Link>
        </div>

        <div className="product-grid">
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="page-container" style={{ marginTop: '3rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
          borderRadius: '24px',
          padding: '3.5rem 2rem',
          color: '#ffffff',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(79, 70, 229, 0.3)'
        }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem' }}>
            Ready to Declutter Your Hostel Room?
          </h2>
          <p style={{ fontSize: '1.15rem', color: '#e0e7ff', maxWidth: '600px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
            Turn your unused semester books, extra headphones, calculators, or cycle into instant cash today.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/sell" className="btn btn-secondary btn-lg" style={{ backgroundColor: '#ffffff', color: '#4f46e5' }}>
              <PlusCircle size={20} /> Sell an Item Now
            </Link>
            <Link to="/register" className="btn btn-outline btn-lg" style={{ color: '#ffffff', borderColor: '#ffffff' }}>
              Join CampusMart
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
