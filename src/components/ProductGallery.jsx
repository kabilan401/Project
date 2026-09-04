import React, { useState } from 'react';

export const ProductGallery = ({ images = [], productName }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div style={{ width: '100%', height: '380px', backgroundColor: '#f1f5f9', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
        No Image Available
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      {/* Main Image */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '75%',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        backgroundColor: '#ffffff'
      }}>
        <img
          src={images[activeImageIndex] || images[0]}
          alt={`${productName} view ${activeImageIndex + 1}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'opacity 0.3s ease'
          }}
        />
      </div>

      {/* Gallery Thumbnails */}
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              style={{
                width: '72px',
                height: '72px',
                minWidth: '72px',
                borderRadius: '12px',
                overflow: 'hidden',
                border: activeImageIndex === idx ? '2.5px solid #4f46e5' : '1px solid #e2e8f0',
                padding: 0,
                cursor: 'pointer',
                opacity: activeImageIndex === idx ? 1 : 0.7,
                transition: 'all 0.2s ease'
              }}
            >
              <img src={img} alt={`thumbnail ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
