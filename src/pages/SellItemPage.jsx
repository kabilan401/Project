import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { PlusCircle, Upload, Eye, CheckCircle2, ShieldCheck, Sparkles, Image as ImageIcon, X, FolderPlus, QrCode } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNotifications } from '../context/NotificationContext';
import { Modal } from '../components/Modal';

export const SellItemPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const qrInputRef = useRef(null);
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
    college: user?.college || 'University Campus',
    department: user?.department || 'Computer Science & Engg',
    location: user?.location || 'Main Hostel Block B',
    contactPreference: 'Both Chat & Phone',
    imageUrlInput: '',
    images: [],
    upiId: user?.upiId || (user?.phone ? `${user.phone.replace(/[^0-9]/g, '')}@paytm` : 'student@upi'),
    paymentQrImage: user?.paymentQrImage || ''
  });

  const [errors, setErrors] = useState({});
  const [previewOpen, setPreviewOpen] = useState(false);

  const sampleLibraryImages = [
    { label: 'Engineering Book', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80' },
    { label: 'Calculator', url: 'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48a?auto=format&fit=crop&w=800&q=80' },
    { label: 'Laptop', url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80' },
    { label: 'Bicycle', url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80' },
    { label: 'Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' },
    { label: 'Backpack', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Open device photo gallery / file manager
  const handleOpenDeviceGallery = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Read selected image files from photo library as Base64 Data URLs
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        addToast('Please select a valid image file', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64Data = uploadEvent.target.result;
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, base64Data]
        }));
        addToast('Image uploaded from device library!', 'success');
      };
      reader.readAsDataURL(file);
    });
  };

  const handleQrUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid QR scanner image', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setFormData((prev) => ({
        ...prev,
        paymentQrImage: uploadEvent.target.result
      }));
      addToast('Payment QR Scanner uploaded from device gallery!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleAddImageUrl = () => {
    if (formData.imageUrlInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, prev.imageUrlInput.trim()],
        imageUrlInput: ''
      }));
      addToast('Image URL added!', 'success');
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
      addToast('Selected from sample library', 'info');
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

    const finalImages = formData.images.length > 0 ? formData.images : [sampleLibraryImages[0].url];

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
        <p className="page-subtitle">Upload photos from your device gallery and list your items to peers in 60 seconds</p>
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
            placeholder="Describe the condition, key features, reason for selling, and included accessories..."
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>

        {/* Product Images - Device Gallery Upload & URL Picker */}
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '2rem 0 1.25rem', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
          2. Product Images & Device Gallery
        </h3>

        {/* Hidden File Input for Device Photo Library */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          multiple
          style={{ display: 'none' }}
        />

        {/* Primary Upload Zone: Photo Library */}
        <div
          onClick={handleOpenDeviceGallery}
          style={{
            border: '2px dashed #6366f1',
            backgroundColor: '#eef2ff',
            borderRadius: '16px',
            padding: '2rem 1.5rem',
            textAlign: 'center',
            cursor: 'pointer',
            marginBottom: '1.5rem',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            color: '#4f46e5',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            margin: '0 auto 0.75rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <FolderPlus size={26} />
          </div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
            Choose Photos from Device Library / Gallery
          </h4>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Tap to open Android Gallery, Camera Roll, or File Manager (JPEG, PNG, WEBP)
          </p>
        </div>

        {/* Option B: Enter Web Image URL */}
        <div className="form-group">
          <label className="form-label">Or Add Image via Web URL</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="url"
              className="form-control"
              placeholder="https://images.unsplash.com/..."
              value={formData.imageUrlInput}
              onChange={(e) => setFormData((prev) => ({ ...prev, imageUrlInput: e.target.value }))}
            />
            <button type="button" className="btn btn-outline" onClick={handleAddImageUrl}>
              Add URL
            </button>
          </div>
        </div>

        {/* Option C: Sample Library Quick Select */}
        <div style={{ marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Or pick from Sample Image Library:</span>
          <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.4rem', overflowX: 'auto', paddingBottom: '0.35rem' }}>
            {sampleLibraryImages.map((sample, idx) => (
              <div
                key={idx}
                onClick={() => handleAddSampleImage(sample.url)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <img
                  src={sample.url}
                  alt={sample.label}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '10px',
                    objectFit: 'cover',
                    border: formData.images.includes(sample.url) ? '2.5px solid #4f46e5' : '1px solid #e2e8f0'
                  }}
                />
                <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.2rem', whiteSpace: 'nowrap' }}>{sample.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Image Previews Gallery */}
        {formData.images.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ marginBottom: '0.5rem' }}>Selected Images ({formData.images.length}):</label>
            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
              {formData.images.map((img, i) => (
                <div key={i} style={{ position: 'relative', width: '90px', height: '90px', borderRadius: '12px', overflow: 'hidden', border: '2px solid #6366f1', boxShadow: 'var(--shadow-sm)' }}>
                  <img src={img} alt={`upload ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      background: 'rgba(239, 68, 68, 0.9)',
                      color: '#ffffff',
                      borderRadius: '50%',
                      padding: '3px',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'center'
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
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

        </div>

        {/* Section 4: Payment QR Scanner Upload */}
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '2rem 0 1.25rem', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <QrCode size={20} color="#4f46e5" /> 4. Seller Payment QR Code Scanner (For Buyer Direct Payment)
        </h3>

        {/* Hidden File Input for QR Code Upload */}
        <input
          type="file"
          ref={qrInputRef}
          onChange={handleQrUpload}
          accept="image/*"
          style={{ display: 'none' }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', alignItems: 'center', backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
          <div>
            <label className="form-label">Your UPI ID (VPA)</label>
            <input
              type="text"
              name="upiId"
              className="form-control"
              placeholder="e.g. alex@okicici or 9876543210@paytm"
              value={formData.upiId}
              onChange={handleChange}
            />
            <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem', display: 'block' }}>
              Buyers will use this UPI ID or scan your QR code to pay you directly.
            </span>
          </div>

          <div>
            <label className="form-label">Upload Custom Payment QR Image (Optional)</label>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => qrInputRef.current && qrInputRef.current.click()}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#ffffff' }}
              >
                <FolderPlus size={16} /> Choose QR from Gallery
              </button>
              {formData.paymentQrImage && (
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => setFormData((prev) => ({ ...prev, paymentQrImage: '' }))}
                >
                  <X size={14} /> Remove QR
                </button>
              )}
            </div>
          </div>
        </div>

        {/* QR Code Scanner Preview Box */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          backgroundColor: '#eef2ff',
          border: '1.5px solid #c7d2fe',
          borderRadius: '16px',
          padding: '1rem 1.25rem'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '12px',
            backgroundColor: '#ffffff',
            border: '2px solid #6366f1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            flexShrink: 0
          }}>
            <img
              src={formData.paymentQrImage || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=${encodeURIComponent(formData.upiId || 'student@upi')}&pn=Seller&cu=INR`}
              alt="Payment QR Preview"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#1e1b4b', fontSize: '0.95rem' }}>
              {formData.paymentQrImage ? 'Custom QR Code Scanner Ready!' : 'Default Auto-Generated UPI Scanner Active'}
            </div>
            <p style={{ fontSize: '0.825rem', color: '#475569', margin: '0.2rem 0 0' }}>
              Buyers can scan this QR code directly from their GPay/PhonePe app to pay you when purchasing "{formData.name || 'this item'}".
            </p>
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
              src={formData.images[0] || sampleLibraryImages[0].url}
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
