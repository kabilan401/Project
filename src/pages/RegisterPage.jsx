import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Building, GraduationCap, Phone, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: 'IIT Delhi',
    department: 'Computer Science & Engg',
    year: '1st Year',
    phone: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) newErrors.email = 'Valid email address is required';
    if (!formData.password || formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.college.trim()) newErrors.college = 'College name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      addToast('Please correct the highlighted registration errors', 'error');
      return;
    }

    const res = register(formData);
    addToast(`Registration successful! Welcome to CampusMart, ${res.user.name}.`, 'success');
    navigate('/marketplace');
  };

  return (
    <div className="register-page page-container" style={{ maxWidth: '640px', paddingTop: '2.5rem' }}>
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '24px',
        padding: '2.5rem',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>Join CampusMart</h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.35rem' }}>
            Create your verified student account to buy and sell on campus
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="name"
                className={`form-control ${errors.name ? 'error' : ''}`}
                placeholder="Rohan Sharma"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">College Email *</label>
              <input
                type="email"
                name="email"
                className={`form-control ${errors.email ? 'error' : ''}`}
                placeholder="student@iitd.ac.in"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                name="password"
                className={`form-control ${errors.password ? 'error' : ''}`}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">College / University *</label>
              <input
                type="text"
                name="college"
                className={`form-control ${errors.college ? 'error' : ''}`}
                placeholder="IIT Delhi"
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
                placeholder="Computer Science"
                value={formData.department}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Academic Year</label>
              <select name="year" className="form-control" value={formData.year} onChange={handleChange}>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Postgraduate / PhD">Postgraduate / PhD</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                className={`form-control ${errors.phone ? 'error' : ''}`}
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1rem' }}>
            Create Student Account
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#64748b' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#4f46e5', fontWeight: 700 }}>
            Login Here
          </Link>
        </div>
      </div>
    </div>
  );
};
