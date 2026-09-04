import React from 'react';
import { ShieldCheck, MapPin, Eye, Lock, Flag, MailCheck } from 'lucide-react';

export const SafetySection = () => {
  const tips = [
    {
      icon: MapPin,
      title: 'Meet on Campus',
      description: 'Always meet sellers or buyers in bright public campus spots like Central Library, Canteen, or Student Union.'
    },
    {
      icon: Eye,
      title: 'Inspect First',
      description: 'Verify books for missing pages, test electronic gadgets and inspect cycles thoroughly before paying.'
    },
    {
      icon: Lock,
      title: 'Never Share OTPs',
      description: 'CampusMart will never ask for your banking passwords, UPI PINs, or SMS OTPs.'
    },
    {
      icon: Flag,
      title: 'Report Issues',
      description: 'Spot something suspicious? Click "Report Listing" or notify campus admin moderators immediately.'
    },
    {
      icon: MailCheck,
      title: 'Use College Email',
      description: 'Interact with verified peers having official university .ac.in / .edu email domains.'
    }
  ];

  return (
    <section style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
      borderRadius: '24px',
      padding: '3rem 2rem',
      color: '#ffffff',
      margin: '3rem 0',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 20px 40px rgba(15, 23, 42, 0.2)'
    }}>
      <div style={{ maxWidth: '700px', margin: '0 auto 2.5rem', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: 'rgba(99, 102, 241, 0.25)',
          color: '#818cf8',
          padding: '0.35rem 0.9rem',
          borderRadius: '9999px',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '1rem',
          border: '1px solid rgba(129, 140, 248, 0.3)'
        }}>
          <ShieldCheck size={16} /> CampusMart Safety Standard
        </div>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem' }}>
          Student Safety First
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.6 }}>
          We are committed to maintaining a safe, transparent, and trusted peer-to-peer trading community across university campuses.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {tips.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}
            >
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                color: '#ffffff'
              }}>
                <Icon size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
