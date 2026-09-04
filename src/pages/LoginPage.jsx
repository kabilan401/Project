import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Sparkles, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loginAsDemo, loginAsAdmin } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please enter your email and password', 'error');
      return;
    }
    const res = login(email, password);
    if (res.success) {
      addToast(`Welcome back, ${res.user.name}!`, 'success');
      if (res.user.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/marketplace');
      }
    }
  };

  const handleDemoStudentLogin = () => {
    const res = loginAsDemo();
    addToast('Logged in as Demo Student (Rohan Sharma)!', 'success');
    navigate('/marketplace');
  };

  const handleAdminLogin = () => {
    const res = loginAsAdmin();
    addToast('Logged in as CampusMart Administrator!', 'success');
    navigate('/admin');
  };

  return (
    <div className="login-page page-container" style={{ maxWidth: '480px', paddingTop: '3rem' }}>
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '24px',
        padding: '2.5rem',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="brand-icon" style={{ width: '48px', height: '48px', margin: '0 auto 1rem', borderRadius: '14px' }}>
            <Lock size={26} />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>Welcome Back</h1>
          <p style={{ color: '#64748b', fontSize: '0.925rem', marginTop: '0.35rem' }}>
            Login to your CampusMart student account
          </p>
        </div>

        {/* Demo Fast Login Bar */}
        <div style={{
          backgroundColor: '#eef2ff',
          border: '1.5px solid #c7d2fe',
          borderRadius: '16px',
          padding: '1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: '#4f46e5' }}>
            <Sparkles size={16} /> Instant 1-Click Demo Login
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleDemoStudentLogin}
              style={{ flex: 1 }}
            >
              <UserCheck size={14} /> Demo Student
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleAdminLogin}
              style={{ flex: 1 }}
            >
              <ShieldCheck size={14} /> Admin Mode
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">College / Personal Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                className="form-control"
                placeholder="rohan.s@iitd.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '42px' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '42px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: '#4f46e5' }}
              />
              Remember me
            </label>
            <a
              href="#forgot"
              onClick={(e) => {
                e.preventDefault();
                addToast('Password reset link sent to your college email!', 'info');
              }}
              style={{ color: '#4f46e5', fontWeight: 600 }}
            >
              Forgot password?
            </a>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '48px' }}>
            Login to CampusMart
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: '#64748b' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#4f46e5', fontWeight: 700 }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};
