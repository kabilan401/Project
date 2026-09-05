import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  PlusCircle, 
  Trash2, 
  CheckCircle, 
  Eye, 
  Edit, 
  CheckCircle2, 
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNotifications } from '../context/NotificationContext';
import { Modal } from '../components/Modal';

export const MyListingsPage = () => {
  const navigate = useNavigate();
  const { products, deleteProduct, markAsSold, markAsActive, updateProduct } = useProducts();
  const { user } = useAuth();
  const { addToast } = useToast();
  const { addNotification } = useNotifications();

  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'sold' | 'drafts'
  const [editingProduct, setEditingProduct] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editUpiId, setEditUpiId] = useState('');
  const [editQrImage, setEditQrImage] = useState('');

  const myListings = products.filter((p) => p.seller.id === user?.id || p.seller.name === user?.name);

  const activeListings = myListings.filter((p) => p.status === 'Active');
  const soldListings = myListings.filter((p) => p.status === 'Sold');

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete listing "${name}"?`)) {
      deleteProduct(id);
      addToast(`Deleted listing "${name.slice(0, 20)}..."`, 'info');
    }
  };

  const handleMarkAsSold = (id, name) => {
    markAsSold(id);
    addToast(`Marked "${name.slice(0, 25)}..." as Sold! 🎉`, 'success');
    addNotification('Listing Marked Sold', `Your product "${name}" was marked as sold.`, 'sale');
  };

  const handleMarkAsActive = (id, name) => {
    markAsActive(id);
    addToast(`Reactivated listing "${name.slice(0, 25)}..."`, 'info');
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setEditPrice(product.price);
    setEditDesc(product.description);
    setEditUpiId(product.upiId || product.seller?.upiId || '');
    setEditQrImage(product.paymentQrImage || product.seller?.paymentQrImage || '');
  };

  const handleSaveEdit = () => {
    if (!editingProduct) return;
    updateProduct(editingProduct.id, {
      price: Number(editPrice),
      description: editDesc,
      upiId: editUpiId,
      paymentQrImage: editQrImage
    });
    addToast('Listing updated successfully!', 'success');
    setEditingProduct(null);
  };

  const displayedListings = activeTab === 'active' ? activeListings : activeTab === 'sold' ? soldListings : [];

  return (
    <div className="my-listings-page page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">My College Listings</h1>
          <p className="page-subtitle">Manage, edit, or mark your items as sold</p>
        </div>
        <Link to="/sell" className="btn btn-primary">
          <PlusCircle size={18} /> Post New Listing
        </Link>
      </div>

      {/* Tabs Row */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1.5px solid #e2e8f0', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('active')}
          style={{
            padding: '0.75rem 1.25rem',
            fontWeight: 700,
            fontSize: '1rem',
            color: activeTab === 'active' ? '#4f46e5' : '#64748b',
            borderBottom: activeTab === 'active' ? '3px solid #4f46e5' : '3px solid transparent',
            marginBottom: '-1.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <ShoppingBag size={18} /> Active Products ({activeListings.length})
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
          <CheckCircle2 size={18} /> Sold Products ({soldListings.length})
        </button>

        <button
          onClick={() => setActiveTab('drafts')}
          style={{
            padding: '0.75rem 1.25rem',
            fontWeight: 700,
            fontSize: '1rem',
            color: activeTab === 'drafts' ? '#4f46e5' : '#64748b',
            borderBottom: activeTab === 'drafts' ? '3px solid #4f46e5' : '3px solid transparent',
            marginBottom: '-1.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          Drafts (0)
        </button>
      </div>

      {displayedListings.length === 0 ? (
        <div className="empty-state">
          <ShoppingBag size={40} color="#94a3b8" />
          <h3 className="empty-title">
            {activeTab === 'active' ? 'No Active Listings Found' : activeTab === 'sold' ? 'No Sold Products' : 'No Draft Listings'}
          </h3>
          <p className="empty-desc">You have no items in this category.</p>
          <Link to="/sell" className="btn btn-primary">Create a New Listing</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {displayedListings.map((item) => (
            <div
              key={item.id}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                gap: '1.5rem',
                boxShadow: 'var(--shadow-sm)',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <img
                  src={item.images[0]}
                  alt={item.name}
                  style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span className="card-category" style={{ fontSize: '0.75rem' }}>{item.category}</span>
                    <span className={item.status === 'Sold' ? 'badge-sold' : 'badge-condition'} style={{ position: 'static' }}>
                      {item.status}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{item.name}</h3>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#4f46e5', marginTop: '0.2rem' }}>
                    ₹{item.price.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <Link to={`/product/${item.id}`} className="btn btn-outline btn-sm">
                  <Eye size={14} /> View
                </Link>

                <button className="btn btn-soft btn-sm" onClick={() => handleOpenEdit(item)}>
                  <Edit size={14} /> Edit
                </button>

                {item.status === 'Active' ? (
                  <button className="btn btn-soft btn-sm" onClick={() => handleMarkAsSold(item.id, item.name)} style={{ backgroundColor: '#d1fae5', color: '#065f46' }}>
                    <CheckCircle2 size={14} /> Mark as Sold
                  </button>
                ) : (
                  <button className="btn btn-soft btn-sm" onClick={() => handleMarkAsActive(item.id, item.name)}>
                    <RotateCcw size={14} /> Reactivate
                  </button>
                )}

                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id, item.name)}>
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Edit Modal */}
      <Modal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        title="Edit Listing Details"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setEditingProduct(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSaveEdit}>Save Changes</button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Price (₹)</label>
          <input
            type="number"
            className="form-control"
            value={editPrice}
            onChange={(e) => setEditPrice(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows="4"
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Seller Payment UPI ID (VPA)</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. name@upi or 9876543210@paytm"
            value={editUpiId}
            onChange={(e) => setEditUpiId(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};
