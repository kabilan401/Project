import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ContactPage = () => {
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      addToast('Please fill in all required fields', 'error');
      return;
    }
    addToast('Thank you! Your message has been sent to CampusMart support.', 'success');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const faqs = [
    {
      question: 'Is CampusMart completely free for students to use?',
      answer: 'Yes! CampusMart is 100% free for college students. There are zero listing fees, zero seller commissions, and zero hidden transaction costs.'
    },
    {
      question: 'How do I complete a transaction safely with a buyer/seller?',
      answer: 'Use our in-app chat to arrange a meeting in a public campus location like the central canteen or library. Inspect the product thoroughly before making cash or UPI payment.'
    },
    {
      question: 'Can I sell items if I am not currently a college student?',
      answer: 'CampusMart is tailored specifically for university students, faculty, and campus residents to preserve trust and safety within college grounds.'
    },
    {
      question: 'What should I do if a buyer/seller does not show up?',
      answer: 'You can flag or report the listing. Our admin team monitors ghosting and uncooperative trading behavior to maintain high community reliability.'
    },
    {
      question: 'How do I edit or delete my listing after selling?',
      answer: 'Navigate to "My Listings" from your profile menu. Click "Mark as Sold" or "Delete" to update the listing status in real time.'
    }
  ];

  return (
    <div className="contact-page page-container" style={{ maxWidth: '1000px' }}>
      <div className="page-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="page-title">Contact CampusMart Support</h1>
        <p className="page-subtitle">Have questions or feedback? We are here to help 24/7</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2.5rem', marginBottom: '4rem' }}>
        {/* Left Column: Contact Cards */}
        <div>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#0f172a' }}>Get in Touch</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Email Support</div>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>support@campusmart.in</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Student Helpline</div>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>+91 1800-CAMPUS-MART</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Campus HQ</div>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>Student Union Center, Main Quad</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '2rem', boxShadow: 'var(--shadow-md)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', color: '#0f172a' }}>Send Us a Message</h3>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Your Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Rohan Sharma"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">College Email *</label>
              <input
                type="email"
                className="form-control"
                placeholder="rohan@iitd.ac.in"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Subject</label>
              <input
                type="text"
                className="form-control"
                placeholder="Inquiry or issue topic..."
                value={formData.subject}
                onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message *</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="How can we help you?"
                value={formData.message}
                onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              <Send size={18} /> Send Message
            </button>
          </form>
        </div>
      </div>

      {/* FAQ Section Accordion */}
      <div id="faq" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '2.5rem', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#e0e7ff', color: '#4f46e5', padding: '0.3rem 0.8rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            <HelpCircle size={14} /> Got Questions?
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Frequently Asked Questions</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease'
                }}
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '1.15rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    fontWeight: 700,
                    fontSize: '1.025rem',
                    color: '#0f172a',
                    backgroundColor: isOpen ? '#f8fafc' : '#ffffff',
                    textAlign: 'left'
                  }}
                >
                  <span>{faq.question}</span>
                  {isOpen ? <ChevronUp size={18} color="#4f46e5" /> : <ChevronDown size={18} color="#94a3b8" />}
                </button>

                {isOpen && (
                  <div style={{ padding: '0 1.25rem 1.25rem', backgroundColor: '#f8fafc', color: '#475569', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
