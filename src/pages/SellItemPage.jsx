import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { PlusCircle, Upload, Eye, CheckCircle2, ShieldCheck, Sparkles, Image as ImageIcon, X } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNotifications } from '../context/NotificationContext';
import { Modal } from '../components/Modal';

export const SellItemPage = () => {
  const navigate = useNavigate();
  const { addProduct } = useProducts();
  const { user } = useAuth();
  const { addToast } = useToast();
  const { addNotification } = useNotifications();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Books & Notes',
    price: '',
    originalPrice: '',
    condition: 'Like New',
    description: '',
    college: user?.college || 'IIT Delhi',
    department: user?.department || 'Computer Science & Engg',
    location: user?.location || 'Main Hostel Block B',
    contactPreference: 'Both Chat & Phone',
    imageUrlInput: '',
    images: []
  });

  const [errors, setErrors] = useState({});
  const [previewOpen, setPreviewOpen] = useState(false);

  const defaultSampleImages = [
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddImageUrl = () => {
    if (formData.imageUrlInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, prev.imageUrlInput.trim()],
        imageUrlInput: ''
      }));
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAddSampleImage = (imgUrl) => {
    if (!formData.images.includes(imgUrl)) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imgUrl]
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product title is required';
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = 'Valid price in ₹ is required';
    if (!formData.description.trim() || formData.description.length < 15) {
      newErrors.description = 'Provide a description (at least 15 characters)';
    }
    if (!formData.college.trim()) newErrors.college = 'College name is required';
    if (!formData.location.trim()) newErrors.location = 'Campus location is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (!validate()) {
      addToast('Please fill all required fields correctly', 'error');
      return;
    }

    const finalImages = formData.images.length > 0 ? formData.images : [defaultSampleImages[0]];

    const newProd = addProduct(
      {
        ...formData,
        images: finalImages
      },
      user
    );

    // Confetti celebration
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    addToast(`Successfully published "${newProd.name}"!`, 'success');
    addNotification(
      'Listing Published!',
      `Your item "${newProd.name}" is now live on CampusMart marketplace.`,
      'listing',
      `/product/${newProd.id}`
    );

    navigate(`/product/${newProd.id}`);
  };

  return (
    <div className="sell-item-page page-container" style={{ maxWidth: '840px' }}>
      <div className="page-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: '#e0e7ff',
          color: '#4f46e5',
          padding: '0.35rem 0.9rem',
          borderRadius: '9999px',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '0.75rem'
        }}>
          <Sparkles size={16} /> Campus Listing Wizard
        </div>
        <h1 className="page-title">Sell an Item on CampusMart</h1>
        <p className="page-subtitle">List your books, electronics, calculators, or hostel items to peers in 60 seconds</p>
      </div>

      <form onSubmit={handlePublish} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '2rem', boxShadow: 'var(--shadow-md)' }}>
        {/* Basic Product Info */}
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
          1. Product Details
        </h3>

        <div className="form-group">
          <label className="form-label">Product Name / Title *</label>
          <input
            type="text"
            name="name"
            className={`form-control ${errors.name ? 'error' : ''}`}
            placeholder="e.g. Higher Engineering Mathematics - B.S. Grewal (44th Ed.)"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Category *</label>
            <select name="category" className="form-control" value={formData.category} onChange={handleChange}>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Condition *</label>
            <select name="condition" className="form-control" value={formData.condition} onChange={handleChange}>
              <option value="Brand New">Brand New (Unopened)</option>
              <option value="Like New">Like New (Mint Condition)</option>
              <option value="Gently Used">Gently Used (Minor Wear)</option>
              <option value="Fair">Fair (Fully Functional)</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Selling Price (₹) *</label>
            <input
              type="number"
              name="price"
              className={`form-control ${errors.price ? 'error' : ''}`}
              placeholder="e.g. 450"
              value={formData.price}
              onChange={handleChange}
            />
            {errors.price && <span className="error-text">{errors.price}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Original Purchase Price (₹)</label>
            <input
              type="number"
              name="originalPrice"
              className="form-control"
              placeholder="e.g. 899 (Optional line-through)"
              value={formData.originalPrice}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Product Description *</label>
          <textarea
            name="description"
            className={`form-control ${errors.description ? 'error' : ''}`}
            rows="4"
            placeholder="Describe the condition, key features, reason for selling, and any included accessories..."
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>

        {/* Product Images */}
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '2rem 0 1.25rem', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
          2. Product Images
        </h3>

        <div className="form-group">
          <label className="form-label">Add Product Image URL</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="url"
              className="form-control"
              placeholder="https://images.unsplash.com/..."
              value={formData.imageUrlInput}
              onChange={(e) => setFormData((prev) => ({ ...prev, imageUrlInput: e.target.value }))}
            />
            <button type="button" className="btn btn-outline" onClick={handleAddImageUrl}>
              Add Image
            </button>
          </div>
        </div>

        {/* Sample Images Quick Pick */}
        <div style={{ marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Or select sample product image:</span>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem', overflowX: 'auto' }}>
            {defaultSampleImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="Sample product preview"
                onClick={() => handleAddSampleImage(img)}
                style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover', cursor: 'pointer', border: formData.images.includes(img) ? '2px solid #4f46e5' : '1px solid #e2e8f0' }}
              />
            ))}
          </div>
        </div>

        {/* Selected Images Previews */}
        {formData.images.length > 0 && (
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {formData.images.map((img, i) => (
              <div key={i} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                <img src={img} alt={`upload ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(i)}
                  style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(239,68,68,0.9)', color: '#ffffff', borderRadius: '50%', padding: '2px' }}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Location & Seller Preference */}
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '2rem 0 1.25rem', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
          3. Location & Contact Preferences
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">College / University *</label>
            <input
              type="text"
              name="college"
              className={`form-control ${errors.college ? 'error' : ''}`}
              placeholder="e.g. IIT Delhi"
              value={formData.college}
              onChange={handleChange}
            />
            {errors.college && <span className="error-text">{errors.college}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Department / Branch</label>
            <input
              type="text"
              name="department"
              className="form-control"
              placeholder="e.g. Computer Science & Engg"
              value={formData.department}
              onChange={handleChange}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Campus Location / Hostel *</label>
            <input
              type="text"
              name="location"
              className={`form-control ${errors.location ? 'error' : ''}`}
              placeholder="e.g. Kumaon Hostel, Room 214"
              value={formData.location}
              onChange={handleChange}
            />
            {errors.location && <span className="error-text">{errors.location}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Contact Preference</label>
            <select name="contactPreference" className="form-control" value={formData.contactPreference} onChange={handleChange}>
              <option value="Both Chat & Phone">Both In-App Chat & Phone</option>
              <option value="In-App Chat Only">In-App Chat Only</option>
              <option value="Phone Only">Phone Only</option>
            </select>
          </div>
        </div>

        {/* Buttons Action Bar */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
          <button type="button" className="btn btn-outline" onClick={() => setPreviewOpen(true)}>
            <Eye size={18} /> Preview Listing
          </button>
          <button type="submit" className="btn btn-primary btn-lg">
            <PlusCircle size={20} /> Publish Listing
          </button>
        </div>
      </form>

      {/* Preview Modal */}
      <Modal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Listing Preview"
        footer={
          <button className="btn btn-primary" onClick={() => setPreviewOpen(false)}>
            Close Preview
          </button>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ width: '100%', height: '220px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
            <img
              src={formData.images[0] || defaultSampleImages[0]}
              alt="Preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div>
            <span className="card-category">{formData.category}</span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0.25rem 0' }}>{formData.name || 'Untitled Product'}</h3>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4f46e5' }}>₹{formData.price || '0'}</div>
            <p style={{ color: '#475569', fontSize: '0.9rem', marginTop: '0.5rem' }}>{formData.description || 'No description provided.'}</p>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.75rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
              🏫 {formData.college} • 📍 {formData.location}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
