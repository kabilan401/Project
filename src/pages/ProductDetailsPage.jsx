import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  MessageSquare, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Flag, 
  Calendar, 
  Share2, 
  CheckCircle2, 
  Star, 
  Building, 
  ArrowLeft,
  Eye,
  User,
  QrCode,
  CreditCard,
  XCircle
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useWishlist } from '../context/WishlistContext';
import { useChat } from '../context/ChatContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { ProductGallery } from '../components/ProductGallery';
import { ProductCard } from '../components/ProductCard';
import { ReportModal } from '../components/ReportModal';
import { PaymentQrModal } from '../components/PaymentQrModal';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, products, approveProduct, rejectProduct } = useProducts();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { startConversationWithSeller } = useChat();
  const { addToast } = useToast();
  const { user } = useAuth();

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const product = getProductById(id) || products[0];

  if (!product) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '5rem 1.5rem' }}>
        <h2>Product Not Found</h2>
        <p style={{ color: '#64748b', margin: '1rem 0' }}>The item you are looking for does not exist or has been removed.</p>
        <Link to="/marketplace" className="btn btn-primary">Back to Marketplace</Link>
      </div>
    );
  }

  const isOwner = user?.id === product.seller?.id || user?.name === product.seller?.name;
  const isAdmin = user?.isAdmin || false;

  // If rejected and viewer is not seller/admin, hide content
  if (product.status === 'Rejected' && !isOwner && !isAdmin) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '5rem 1.5rem', maxWidth: '520px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
          <XCircle size={36} />
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>Listing Rejected by Admin</h2>
        <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '2rem' }}>
          This product listing was rejected by admin moderation and is not visible to others on the public marketplace.
        </p>
        <Link to="/marketplace" className="btn btn-primary">Back to Marketplace</Link>
      </div>
    );
  }

  const isSaved = isInWishlist(product.id);

  const handleToggleWishlist = () => {
    toggleWishlist(product.id);
    if (!isSaved) {
      addToast(`Added "${product.name}" to your Wishlist`, 'success');
    } else {
      addToast('Removed from Wishlist', 'info');
    }
  };

  const handleStartChat = () => {
    const convId = startConversationWithSeller(product, user);
    addToast(`Opened conversation with ${product.seller.name}`, 'success');
    navigate('/messages');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Product link copied to clipboard!', 'success');
    } else {
      addToast('Link ready to share!', 'info');
    }
  };

  const similarProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id && p.status === 'Active')
    .slice(0, 4);

  const handleApproveByAdmin = () => {
    approveProduct(product.id);
    addToast(`Approved & Launched "${product.name}" onto website!`, 'success');
  };

  const handleRejectByAdmin = () => {
    const reason = window.prompt('Enter rejection reason for seller:', 'Product does not meet campus marketplace safety guidelines.');
    if (reason !== null) {
      rejectProduct(product.id, reason);
      addToast(`Product rejected. Seller notified.`, 'info');
    }
  };

  return (
    <div className="product-details-page page-container">
      {/* Admin / Seller Verification Callout Banner */}
      {product.status !== 'Active' && (
        <div style={{
          backgroundColor: product.status === 'Pending Verification' ? '#fef3c7' : '#fee2e2',
          border: product.status === 'Pending Verification' ? '1.5px solid #f59e0b' : '1.5px solid #ef4444',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <div>
            <div style={{ fontWeight: 800, color: product.status === 'Pending Verification' ? '#92400e' : '#991b1b', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={20} />
              {product.status === 'Pending Verification'
                ? '🟡 Pending Admin Verification & Approval'
                : '🔴 Product Rejected by Admin'}
            </div>
            <p style={{ fontSize: '0.875rem', color: product.status === 'Pending Verification' ? '#78350f' : '#7f1d1d', margin: '0.25rem 0 0' }}>
              {product.status === 'Pending Verification'
                ? 'This listing has been submitted and is awaiting Admin review before appearing on the public website marketplace.'
                : `This listing was rejected. Reason: ${product.rejectionReason || 'Did not meet campus guidelines.'}`}
            </p>
          </div>

          {user?.isAdmin && product.status === 'Pending Verification' && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-success btn-sm" onClick={handleApproveByAdmin} style={{ backgroundColor: '#059669', color: '#ffffff', border: 'none' }}>
                <CheckCircle2 size={16} /> Accept & Launch to Website
              </button>
              <button className="btn btn-danger btn-sm" onClick={handleRejectByAdmin}>
                Reject Product
              </button>
            </div>
          )}
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#64748b' }}>
        <Link to="/marketplace" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#4f46e5', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to Marketplace
        </Link>
        <span>/</span>
        <span>{product.category}</span>
        <span>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
          {product.name}
        </span>
      </div>

      {/* Main Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
        {/* Left Column: Gallery */}
        <div>
          <ProductGallery images={product.images} productName={product.name} />
          
          {/* Quick Item Attributes */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            marginTop: '2rem',
            background: '#ffffff',
            padding: '1.25rem',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            textAlign: 'center'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Condition</span>
              <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>{product.condition}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Department</span>
              <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>{product.department}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Views</span>
              <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '0.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
                <Eye size={14} color="#4f46e5" /> {product.views || 120}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Product Meta & Seller Card */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
            <span className="card-category" style={{ fontSize: '0.85rem' }}>{product.category}</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-outline btn-sm" onClick={handleShare} title="Share Link">
                <Share2 size={16} /> Share
              </button>
              <button
                className={`btn btn-outline btn-sm ${isSaved ? 'btn-danger' : ''}`}
                onClick={handleToggleWishlist}
                title="Save Wishlist"
              >
                <Heart size={16} fill={isSaved ? '#ffffff' : 'none'} />
                {isSaved ? 'Saved' : 'Wishlist'}
              </button>
            </div>
          </div>

          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.25, margin: '0.5rem 0 1rem' }}>
            {product.name}
          </h1>

          {/* Price & Status */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.5rem', background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span style={{ fontSize: '1.2rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            <span className={product.status === 'Sold' ? 'badge-sold' : 'badge-condition'} style={{ position: 'static', marginLeft: 'auto' }}>
              {product.status === 'Sold' ? 'SOLD OUT' : 'AVAILABLE'}
            </span>
          </div>

          {/* Location & Posted Date */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.9rem', color: '#475569', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Building size={16} color="#4f46e5" />
              <span><strong>College:</strong> {product.college}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={16} color="#4f46e5" />
              <span><strong>Location:</strong> {product.location}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={16} color="#4f46e5" />
              <span>Posted {product.postedDate}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.85rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => setQrModalOpen(true)}
              style={{ flex: '1 1 200px', backgroundColor: '#059669', borderColor: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <QrCode size={22} /> Pay via Seller QR Code
            </button>

            <button className="btn btn-outline btn-lg" onClick={handleStartChat} style={{ flex: '1 1 180px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <MessageSquare size={20} /> Chat Seller
            </button>

            <button
              className="btn btn-outline btn-lg"
              onClick={() => setShowContactInfo(!showContactInfo)}
              style={{ backgroundColor: '#ffffff', padding: '0 1rem' }}
              title="Call Seller"
            >
              <Phone size={20} /> {showContactInfo ? product.seller.phone : 'Contact Phone'}
            </button>
          </div>

          {/* Dedicated Instant Payment Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
            border: '1.5px solid #a7f3d0',
            borderRadius: '16px',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            gap: '1rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: '#059669',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                flexShrink: 0
              }}>
                <CreditCard size={24} />
              </div>
              <div>
                <div style={{ fontWeight: 800, color: '#065f46', fontSize: '0.975rem' }}>
                  Direct UPI Payment QR Scanner Available
                </div>
                <div style={{ fontSize: '0.825rem', color: '#047857', marginTop: '0.1rem' }}>
                  Scan {product.seller.name}'s QR Code to pay ₹{product.price.toLocaleString('en-IN')} instantly!
                </div>
              </div>
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setQrModalOpen(true)}
              style={{ backgroundColor: '#047857', borderColor: '#047857', whiteSpace: 'nowrap' }}
            >
              <QrCode size={14} /> View QR
            </button>
          </div>

          {showContactInfo && (
            <div style={{
              backgroundColor: '#e0e7ff',
              border: '1px solid #c7d2fe',
              padding: '1rem',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              color: '#3730a3',
              fontSize: '0.925rem'
            }}>
              <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Seller Direct Contact Details:</div>
              <div>📞 Phone: <strong>{product.seller.phone}</strong></div>
              <div>✉️ Email: <strong>{product.seller.email}</strong></div>
            </div>
          )}

          {/* Description */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.6rem', color: '#0f172a' }}>Description</h3>
            <p style={{ color: '#475569', lineHeight: 1.65, fontSize: '0.975rem', whiteSpace: 'pre-line' }}>
              {product.description}
            </p>
          </div>

          {/* Seller Information Card */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '20px',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <User size={28} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{product.seller.name}</h4>
                  <span style={{ fontSize: '0.75rem', background: '#d1fae5', color: '#065f46', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <ShieldCheck size={12} /> Verified Student
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.15rem' }}>
                  {product.seller.department} • {product.seller.year}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem', color: '#475569', borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem' }}>
              <div>🏫 <strong>College:</strong> {product.seller.college}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                ⭐ <strong>Rating:</strong> {product.seller.rating} / 5.0 ({product.seller.reviewsCount || 10} reviews)
              </div>
              <div>📅 <strong>Member since:</strong> {product.seller.joinedDate}</div>
              <div>📍 <strong>Hostel:</strong> {product.location}</div>
            </div>
          </div>

          {/* Report Button */}
          <button
            onClick={() => setReportModalOpen(true)}
            style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'none', border: 'none' }}
          >
            <Flag size={14} /> Report suspicious listing or seller
          </button>
        </div>
      </div>

      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
        <section style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem', color: '#0f172a' }}>
            Similar Products in {product.category}
          </h2>
          <div className="product-grid">
            {similarProducts.map((simProd) => (
              <ProductCard key={simProd.id} product={simProd} />
            ))}
          </div>
        </section>
      )}

      {/* Report Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        product={product}
      />

      {/* Payment QR Modal */}
      <PaymentQrModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        product={product}
        user={user}
      />
    </div>
  );
};
