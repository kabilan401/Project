import React, { useState } from 'react';
import { QrCode, Copy, Check, Smartphone, Send, ShieldCheck, X, CreditCard } from 'lucide-react';
import { Modal } from './Modal';
import { useToast } from '../context/ToastContext';
import { useChat } from '../context/ChatContext';
import { useNavigate } from 'react-router-dom';

export const PaymentQrModal = ({ isOpen, onClose, product, user }) => {
  const { addToast } = useToast();
  const { startConversationWithSeller, sendMessage } = useChat();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  if (!product) return null;

  const sellerName = product.seller?.name || 'Seller';
  const price = product.price || 0;
  const upiId = product.upiId || product.seller?.upiId || (product.seller?.email ? `${product.seller.email.split('@')[0]}@upi` : 'student@upi');
  
  // Fallback to QR server API if seller didn't upload a custom image
  const defaultQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(sellerName)}&am=${price}&cu=INR`;
  const qrImage = product.paymentQrImage || product.seller?.paymentQrImage || defaultQrUrl;

  const handleCopyUpi = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(upiId);
      setCopied(true);
      addToast(`UPI ID "${upiId}" copied to clipboard!`, 'success');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleSendPaymentConfirmation = () => {
    const convId = startConversationWithSeller(product, user);
    const confirmMessage = `Hi ${sellerName}, I have scanned your Payment QR Scanner and transferred ₹${price.toLocaleString('en-IN')} for "${product.name}". Please check your UPI app and let me know when we can meet on campus for handover! 🤝💳`;
    
    sendMessage(convId, confirmMessage, user?.id || 'user-101');
    addToast('Payment confirmation message sent to seller in chat!', 'success');
    onClose();
    navigate('/messages');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Scan Seller Payment QR Code"
      footer={
        <div style={{ display: 'flex', gap: '0.75rem', width: '100%', justifyContent: 'space-between' }}>
          <button className="btn btn-outline" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-primary" onClick={handleSendPaymentConfirmation}>
            <Send size={16} /> Paid? Notify Seller in Chat
          </button>
        </div>
      }
    >
      <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
        {/* Product & Price Header */}
        <div style={{
          background: 'linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%)',
          padding: '1rem',
          borderRadius: '16px',
          marginBottom: '1.25rem',
          border: '1px solid #c7d2fe'
        }}>
          <span style={{ fontSize: '0.8rem', color: '#4f46e5', fontWeight: 700, textTransform: 'uppercase' }}>
            Amount Payable to {sellerName}
          </span>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1e1b4b', margin: '0.2rem 0' }}>
            ₹{price.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#475569', fontWeight: 600 }}>
            📦 Item: {product.name}
          </div>
        </div>

        {/* QR Scanner Display Frame */}
        <div style={{
          position: 'relative',
          display: 'inline-block',
          padding: '1.25rem',
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.2)',
          border: '3px solid #6366f1',
          marginBottom: '1.25rem'
        }}>
          <img
            src={qrImage}
            alt={`Payment QR Code for ${sellerName}`}
            style={{
              width: '240px',
              height: '240px',
              objectFit: 'contain',
              borderRadius: '12px',
              display: 'block'
            }}
          />
          <div style={{
            marginTop: '0.5rem',
            fontSize: '0.75rem',
            color: '#059669',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            gap: '0.3rem'
          }}>
            <ShieldCheck size={14} /> Verified Student UPI Scanner
          </div>
        </div>

        {/* Copy UPI ID Box */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          backgroundColor: '#f8fafc',
          border: '1.5px dashed #cbd5e1',
          borderRadius: '12px',
          padding: '0.75rem 1rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>UPI VPA ID:</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', fontFamily: 'monospace' }}>
              {upiId}
            </div>
          </div>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={handleCopyUpi}
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy UPI'}
          </button>
        </div>

        {/* Step-by-Step Payment Instructions */}
        <div style={{
          textAlign: 'left',
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          padding: '1rem',
          fontSize: '0.85rem',
          color: '#475569'
        }}>
          <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Smartphone size={16} color="#4f46e5" /> Quick Payment Steps:
          </div>
          <ol style={{ paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <li>Open Google Pay, PhonePe, Paytm, BHIM, or any UPI payment app on your phone.</li>
            <li>Scan the QR code above directly with your phone camera or payment app.</li>
            <li>Pay <strong>₹{price.toLocaleString('en-IN')}</strong> directly to <strong>{sellerName}</strong>.</li>
            <li>Click <strong>"Paid? Notify Seller in Chat"</strong> to inform {sellerName} & arrange campus pickup!</li>
          </ol>
        </div>
      </div>
    </Modal>
  );
};
