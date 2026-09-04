import React from 'react';
import { ShoppingBag, ShieldCheck, Users, Heart, Sparkles, BookOpen, Lock } from 'lucide-react';
import { SafetySection } from '../components/SafetySection';

export const AboutPage = () => {
  return (
    <div className="about-page page-container" style={{ maxWidth: '900px' }}>
      <div className="page-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          backgroundColor: '#e0e7ff',
          color: '#4f46e5',
          padding: '0.4rem 1rem',
          borderRadius: '9999px',
          fontSize: '0.875rem',
          fontWeight: 700,
          marginBottom: '1rem'
        }}>
          <Sparkles size={16} /> CampusMart Story
        </div>
        <h1 className="page-title" style={{ fontSize: '2.8rem' }}>About CampusMart</h1>
        <p className="page-subtitle" style={{ fontSize: '1.15rem' }}>
          Empowering college students to buy, sell, and connect safely within their university campus.
        </p>
      </div>

      {/* Story Card */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '24px',
        padding: '2.5rem',
        boxShadow: 'var(--shadow-md)',
        marginBottom: '3rem'
      }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
          What is CampusMart?
        </h2>
        <p style={{ color: '#475569', fontSize: '1.025rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          CampusMart is a hyper-local peer-to-peer marketplace built exclusively for college students. University life moves fast, and semesters change quickly — leaving students with unused engineering textbooks, scientific calculators, hostel study lamps, bicycles, and electronics.
        </p>
        <p style={{ color: '#475569', fontSize: '1.025rem', lineHeight: 1.7 }}>
          Instead of dealing with external commercial buyers or paying high shipping fees, CampusMart allows verified students on campus to connect directly, chat, agree on a price, and exchange items safely within their hostel quarters or university grounds.
        </p>
      </div>

      {/* Why Created & Benefits */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.75rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <BookOpen size={24} />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>Why It Was Created</h3>
          <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Textbooks and scientific gear are expensive when bought brand new every semester. We created CampusMart so senior students can pass down expensive course books and lab instruments to junior students at affordable prices.
          </p>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.75rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Users size={24} />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>How It Helps Students</h3>
          <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Sellers make fast money from items sitting idle in their rooms. Buyers save up to 70% compared to retail prices, while fostering a supportive campus community network.
          </p>
        </div>
      </div>

      {/* Community Guidelines */}
      <div id="guidelines" style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '24px',
        padding: '2.5rem',
        boxShadow: 'var(--shadow-md)',
        marginBottom: '3rem'
      }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
          Community Guidelines
        </h2>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', listStyle: 'none' }}>
          <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <ShieldCheck size={20} color="#4f46e5" style={{ minWidth: '20px', marginTop: '2px' }} />
            <div>
              <strong>Authentic Student Identification:</strong> Always register with your genuine name and university email domain.
            </div>
          </li>
          <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <ShieldCheck size={20} color="#4f46e5" style={{ minWidth: '20px', marginTop: '2px' }} />
            <div>
              <strong>Honest Product Condition:</strong> Describe items accurately. Do not hide defects or upload misleading photos.
            </div>
          </li>
          <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <ShieldCheck size={20} color="#4f46e5" style={{ minWidth: '20px', marginTop: '2px' }} />
            <div>
              <strong>Academic Integrity:</strong> Prohibited items include proxy attendance devices, leaked exam papers, or unauthorized lab test answers.
            </div>
          </li>
          <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <ShieldCheck size={20} color="#4f46e5" style={{ minWidth: '20px', marginTop: '2px' }} />
            <div>
              <strong>Respectful Communication:</strong> Keep chat conversations polite, friendly, and focused on campus trade agreements.
            </div>
          </li>
        </ul>
      </div>

      {/* Safety Section */}
      <div id="safety">
        <SafetySection />
      </div>
    </div>
  );
};
