import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Shield, HelpCircle, Mail, Globe, Github, Twitter, Instagram, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand Column */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <div className="brand-icon" style={{ width: 34, height: 34 }}>
              <ShoppingBag size={20} />
            </div>
            <span>CampusMart</span>
          </Link>
          <p className="footer-tagline">
            “Buy. Sell. Connect.” — India's premiere peer-to-peer campus marketplace designed exclusively for university students.
          </p>
          <div className="social-links">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="GitHub">
              <Github size={18} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="Twitter">
              <Twitter size={18} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div>
          <h4 className="footer-title">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/" className="footer-link">Home</Link></li>
            <li><Link to="/marketplace" className="footer-link">Marketplace</Link></li>
            <li><Link to="/sell" className="footer-link">Sell Item</Link></li>
            <li><Link to="/about" className="footer-link">About Us</Link></li>
            <li><Link to="/contact" className="footer-link">Contact Support</Link></li>
          </ul>
        </div>

        {/* Categories Column */}
        <div>
          <h4 className="footer-title">Top Categories</h4>
          <ul className="footer-links">
            <li><Link to="/marketplace?category=Books%20%26%20Notes" className="footer-link">Books & Notes</Link></li>
            <li><Link to={`/marketplace?category=${encodeURIComponent('Scientific Calculators')}`} className="footer-link">Scientific Calculators</Link></li>
            <li><Link to={`/marketplace?category=${encodeURIComponent('Lab Equipment & Aprons')}`} className="footer-link">Lab Equipment & Aprons</Link></li>
            <li><Link to={`/marketplace?category=${encodeURIComponent('Laptops & Electronics')}`} className="footer-link">Laptops & Electronics</Link></li>
            <li><Link to={`/marketplace?category=${encodeURIComponent('Hostel & Dorm Essentials')}`} className="footer-link">Hostel Essentials</Link></li>
            <li><Link to={`/marketplace?category=${encodeURIComponent('Campus Bicycles')}`} className="footer-link">Campus Bicycles</Link></li>
          </ul>
        </div>

        {/* Support & Safety Column */}
        <div>
          <h4 className="footer-title">Support & Trust</h4>
          <ul className="footer-links">
            <li><Link to="/about#safety" className="footer-link">Student Safety Guidelines</Link></li>
            <li><Link to="/contact#faq" className="footer-link">Help Center & FAQ</Link></li>
            <li><Link to="/about#guidelines" className="footer-link">Community Guidelines</Link></li>
            <li><a href="#terms" onClick={(e) => { e.preventDefault(); alert("Terms of Service: CampusMart strictly enforces authentic student transactions on campus grounds."); }} className="footer-link">Terms of Service</a></li>
            <li><a href="#privacy" onClick={(e) => { e.preventDefault(); alert("Privacy Policy: Student data and contact info are stored locally and never sold."); }} className="footer-link">Privacy Policy</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} CampusMart Inc. Built for college students with ❤️</p>
        <p style={{ display: 'flex', gap: '1rem' }}>
          <span>🔒 Verified Campus Network</span>
          <span>⚡ Lightning Fast Peer-to-Peer</span>
        </p>
      </div>
    </footer>
  );
};
