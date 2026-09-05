import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  GraduationCap, 
  Star, 
  Edit3, 
  ShoppingBag, 
  Heart, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { ProductCard } from '../components/ProductCard';
import { Modal } from '../components/Modal';

export const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { products } = useProducts();
  const { wishlistIds } = useWishlist();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('listings'); // 'listings' | 'sold' | 'saved'
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    name: '',
    college: '',
    department: '',
    year: '',
    phone: '',
    location: ''
  });

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        college: user.college || '',
        department: user.department || '',
        year: user.year || '',
        phone: user.phone || '',
        location: user.location || ''
      });
    }
  }, [user, editModalOpen]);

  const isAdmin = user?.isAdmin || user?.role === 'Admin';

  const myListings = products.filter((p) => p.seller.id === user?.id || p.seller.name === user?.name);
  const activeListings = myListings.filter((p) => p.status === 'Active');
  const soldItems = myListings.filter((p) => p.status === 'Sold');
  const savedProducts = products.filter((p) => wishlistIds.includes(p.id));

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateProfile(editForm);
    addToast(`${isAdmin ? 'Admin' : 'Student'} profile updated and saved!`, 'success');
    setEditModalOpen(false);
  };

  return (
    <div className="profile-page page-container">
      {/* Cover & Profile Header Card */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
        marginBottom: '2rem'
      }}>
        <div style={{ height: '140px', background: isAdmin ? 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' : 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' }}></div>
        
        <div style={{ padding: '0 2rem 2rem', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginTop: '-50px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.25rem' }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: isAdmin ? '#dc2626' : '#4f46e5',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                border: '4px solid #ffffff',
                boxShadow: 'var(--shadow-md)'
              }}>
                {isAdmin ? <ShieldCheck size={48} /> : <User size={48} />}
              </div>
              <div style={{ marginBottom: '0.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>{user?.name}</h1>
                  <span style={{
                    fontSize: '0.75rem',
                    background: isAdmin ? '#fee2e2' : '#d1fae5',
                    color: isAdmin ? '#991b1b' : '#065f46',
                    fontWeight: 700,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem'
                  }}>
                    <ShieldCheck size={14} /> {isAdmin ? 'Verified Administrator' : 'Verified Student'}
                  </span>
                </div>
                <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                  {user?.department || (isAdmin ? 'Operations' : 'Engineering')} • {user?.year || (isAdmin ? 'System Staff' : '1st Year')}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-outline" onClick={() => setEditModalOpen(true)}>
                <Edit3 size={16} /> Edit {isAdmin ? 'Admin' : 'Student'} Profile
              </button>
              {isAdmin ? (
                <Link to="/admin" className="btn btn-primary" style={{ backgroundColor: '#dc2626', borderColor: '#dc2626' }}>
                  <ShieldCheck size={16} /> Admin Dashboard
                </Link>
              ) : (
                <Link to="/my-listings" className="btn btn-primary">
                  <ShoppingBag size={16} /> Manage Listings
                </Link>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.25rem',
            marginTop: '1.75rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #f1f5f9'
          }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                {isAdmin ? 'Organization / HQ' : 'University'}
              </span>
              <div style={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                <Building size={16} color={isAdmin ? '#dc2626' : '#4f46e5'} /> {user?.college || 'CampusMart HQ'}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Contact Email</span>
              <div style={{ fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                <Mail size={16} color={isAdmin ? '#dc2626' : '#4f46e5'} /> {user?.email}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Phone</span>
              <div style={{ fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                <Phone size={16} color={isAdmin ? '#dc2626' : '#4f46e5'} /> {user?.phone}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                {isAdmin ? 'Access Level' : 'Seller Score'}
              </span>
              <div style={{ fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                {isAdmin ? '🔐 Full System Administrator' : `⭐ ${user?.rating || 5.0} / 5.0 (${user?.reviewsCount || 14} deals)`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1.5px solid #e2e8f0', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('listings')}
          style={{
            padding: '0.75rem 1.25rem',
            fontWeight: 700,
            fontSize: '1rem',
            color: activeTab === 'listings' ? '#4f46e5' : '#64748b',
            borderBottom: activeTab === 'listings' ? '3px solid #4f46e5' : '3px solid transparent',
            marginBottom: '-1.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <ShoppingBag size={18} /> Active Listings ({activeListings.length})
        </button>

        <button
          onClick={() => setActiveTab('sold')}
          style={{
            padding: '0.75rem 1.25rem',
            fontWeight: 700,
            fontSize: '1rem',
            color: activeTab === 'sold' ? '#4f46e5' : '#64748b',
            borderBottom: activeTab === 'sold' ? '3px solid #4f46e5' : '3px solid transparent',
            marginBottom: '-1.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <CheckCircle2 size={18} /> Sold Items ({soldItems.length})
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          style={{
            padding: '0.75rem 1.25rem',
            fontWeight: 700,
            fontSize: '1rem',
            color: activeTab === 'saved' ? '#4f46e5' : '#64748b',
            borderBottom: activeTab === 'saved' ? '3px solid #4f46e5' : '3px solid transparent',
            marginBottom: '-1.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Heart size={18} /> Saved Wishlist ({savedProducts.length})
        </button>
      </div>

      {/* Tab Content Display */}
      {activeTab === 'listings' && (
        activeListings.length === 0 ? (
          <div className="empty-state">
            <ShoppingBag size={40} color="#94a3b8" />
            <h3 className="empty-title">No Active Listings</h3>
            <p className="empty-desc">You don't have any items currently listed for sale.</p>
            <Link to="/sell" className="btn btn-primary">Sell an Item Now</Link>
          </div>
        ) : (
          <div className="product-grid">
            {activeListings.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )
      )}

      {activeTab === 'sold' && (
        soldItems.length === 0 ? (
          <div className="empty-state">
            <CheckCircle2 size={40} color="#94a3b8" />
            <h3 className="empty-title">No Sold Products Yet</h3>
            <p className="empty-desc">When you mark items as sold, they will appear in your sales history here.</p>
          </div>
        ) : (
          <div className="product-grid">
            {soldItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )
      )}

      {activeTab === 'saved' && (
        savedProducts.length === 0 ? (
          <div className="empty-state">
            <Heart size={40} color="#94a3b8" />
            <h3 className="empty-title">Wishlist is Empty</h3>
            <p className="empty-desc">Click the heart icon on any product card to save it for later.</p>
            <Link to="/marketplace" className="btn btn-primary">Explore Marketplace</Link>
          </div>
        ) : (
          <div className="product-grid">
            {savedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )
      )}

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={isAdmin ? "Edit Admin Profile" : "Edit Student Profile"}
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setEditModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleEditSubmit} style={{ backgroundColor: isAdmin ? '#dc2626' : undefined, borderColor: isAdmin ? '#dc2626' : undefined }}>
              Save {isAdmin ? 'Admin' : 'Student'} Profile
            </button>
          </>
        }
      >
        <form onSubmit={handleEditSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              value={editForm.name}
              onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{isAdmin ? "Organization / Headquarters" : "College / University"}</label>
            <input
              type="text"
              className="form-control"
              value={editForm.college}
              onChange={(e) => setEditForm((prev) => ({ ...prev, college: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{isAdmin ? "Department / Operations Unit" : "Department / Branch"}</label>
            <input
              type="text"
              className="form-control"
              value={editForm.department}
              onChange={(e) => setEditForm((prev) => ({ ...prev, department: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{isAdmin ? "Designation / Access Role" : "Academic Year"}</label>
            <input
              type="text"
              className="form-control"
              value={editForm.year}
              onChange={(e) => setEditForm((prev) => ({ ...prev, year: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              className="form-control"
              value={editForm.phone}
              onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{isAdmin ? "Office / Admin HQ Location" : "Hostel / Campus Room Location"}</label>
            <input
              type="text"
              className="form-control"
              value={editForm.location}
              onChange={(e) => setEditForm((prev) => ({ ...prev, location: e.target.value }))}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
