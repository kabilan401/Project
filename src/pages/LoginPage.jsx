import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, Sparkles, ShieldCheck, UserCheck, ArrowRight, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginAsDemo, loginAsAdmin } = useAuth();
  const { addToast } = useToast();

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    if (location.pathname === '/admin/login' || location.search.includes('mode=admin')) {
      setIsAdminMode(true);
      setEmail('admin@campusmart.in');
    }
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please enter your credentials to login', 'error');
      return;
    }

    if (isAdminMode || email === 'admin@campusmart.in') {
      const res = login('admin@campusmart.in', password);
      addToast('Welcome Administrator! Accessing Admin Console.', 'success');
      navigate('/admin');
    } else {
      const res = login(email, password);
      addToast(`Welcome back, ${res.user.name}!`, 'success');
      navigate('/marketplace');
    }
  };

  const handleDemoStudentLogin = () => {
    loginAsDemo();
    addToast('Logged in as Demo Student!', 'success');
    navigate('/marketplace');
  };

  const handleAdminQuickLogin = () => {
    loginAsAdmin();
    addToast('Logged in as CampusMart Administrator!', 'success');
    navigate('/admin');
  };

  return (
    <div className="login-page page-container" style={{ maxWidth: '520px', paddingTop: '2.5rem' }}>
      <div style={{
        background: '#ffffff',
        border: isAdminMode ? '2px solid #ef4444' : '1px solid #e2e8f0',
        borderRadius: '24px',
        padding: '2.5rem',
        boxShadow: 'var(--shadow-lg)',
        transition: 'all 0.3s ease'
      }}>
        {/* Toggle Student vs Admin Login Mode */}
        <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '14px', padding: '4px', marginBottom: '2rem' }}>
          <button
            type="button"
            onClick={() => {
              setIsAdminMode(false);
              setEmail('');
            }}
            style={{
              flex: 1,
              padding: '0.65rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.9rem',
              border: 'none',
              backgroundColor: !isAdminMode ? '#4f46e5' : 'transparent',
              color: !isAdminMode ? '#ffffff' : '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease'
            }}
          >
            <GraduationCap size={16} /> Student Login
          </button>

          <button
            type="button"
            onClick={() => {
              setIsAdminMode(true);
              setEmail('admin@campusmart.in');
            }}
            style={{
              flex: 1,
              padding: '0.65rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.9rem',
              border: 'none',
              backgroundColor: isAdminMode ? '#dc2626' : 'transparent',
              color: isAdminMode ? '#ffffff' : '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease'
            }}
          >
            <ShieldCheck size={16} /> Admin Portal
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="brand-icon" style={{
            width: '52px',
            height: '52px',
            margin: '0 auto 1rem',
            borderRadius: '16px',
            background: isAdminMode ? 'linear-gradient(135deg, #dc2626, #991b1b)' : 'linear-gradient(135deg, #4f46e5, #6366f1)'
          }}>
            {isAdminMode ? <ShieldCheck size={28} /> : <Lock size={26} />}
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>
            {isAdminMode ? 'Admin Portal Access' : 'Student Login'}
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.925rem', marginTop: '0.35rem' }}>
            {isAdminMode ? 'Enter administrator credentials to manage platform' : 'Login to buy, sell & chat with peers on campus'}
          </p>
        </div>

        {/* 1-Click Fast Demo Credentials Bar */}
        <div style={{
          backgroundColor: isAdminMode ? '#fee2e2' : '#eef2ff',
          border: isAdminMode ? '1.5px solid #fca5a5' : '1.5px solid #c7d2fe',
          borderRadius: '16px',
          padding: '1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: isAdminMode ? '#991b1b' : '#4f46e5' }}>
            <Sparkles size={16} /> 1-Click Instant Login
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {!isAdminMode ? (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleDemoStudentLogin}
                style={{ flex: 1 }}
              >
                <UserCheck size={14} /> Instant Student Login
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={handleAdminQuickLogin}
                style={{ flex: 1 }}
              >
                <ShieldCheck size={14} /> Instant Admin Login
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{isAdminMode ? 'Admin Email' : 'Student Email'}</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                className="form-control"
                placeholder={isAdminMode ? 'admin@campusmart.in' : 'student@college.edu'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '42px' }}
                required
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
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: isAdminMode ? '#dc2626' : '#4f46e5' }}
              />
              Remember me
            </label>
            <a
              href="#forgot"
              onClick={(e) => {
                e.preventDefault();
                addToast('Password reset instructions sent to email', 'info');
              }}
              style={{ color: isAdminMode ? '#dc2626' : '#4f46e5', fontWeight: 600 }}
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className={`btn ${isAdminMode ? 'btn-danger' : 'btn-primary'}`}
            style={{ width: '100%', height: '48px', fontSize: '1rem' }}
          >
            {isAdminMode ? 'Login to Admin Dashboard' : 'Login to CampusMart'}
          </button>
        </form>

        {!isAdminMode && (
          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: '#64748b' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#4f46e5', fontWeight: 700 }}>
              Register Here
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
