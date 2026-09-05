import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Heart, 
  MessageSquare, 
  Bell, 
  User, 
  PlusCircle, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck, 
  Sparkles,
  LayoutDashboard,
  Tag,
  Home,
  Store
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useNotifications } from '../context/NotificationContext';
import { useToast } from '../context/ToastContext';

export const Navbar = () => {
  const { user, isAuthenticated, logout, loginAsDemo, loginAsAdmin } = useAuth();
  const { wishlistCount } = useWishlist();
  const { unreadCount } = useNotifications();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'info');
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="brand-icon">
            <ShoppingBag size={22} />
          </div>
          <span>CampusMart</span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="nav-links">
          <li>
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Home size={16} />
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/marketplace" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Store size={16} />
              Marketplace
            </NavLink>
          </li>
          <li>
            <NavLink to="/marketplace?tab=categories" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Tag size={16} />
              Categories
            </NavLink>
          </li>
          <li>
            <NavLink to="/sell" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <PlusCircle size={16} />
              Sell Item
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <ShieldCheck size={16} />
              About
            </NavLink>
          </li>
        </ul>

        {/* Right Side Controls */}
        <div className="nav-right">
          {/* Sell Button CTA */}
          <Link to="/sell" className="btn btn-primary btn-sm btn-sell-nav">
            <PlusCircle size={16} />
            Sell Item
          </Link>

          {isAuthenticated ? (
            <>
              {/* Wishlist Link */}
              <Link to="/wishlist" className="nav-icon-btn" title="Wishlist">
                <Heart size={20} />
                {wishlistCount > 0 && <span className="badge-dot">{wishlistCount}</span>}
              </Link>

              {/* Messages Link */}
              <Link to="/messages" className="nav-icon-btn" title="Messages">
                <MessageSquare size={20} />
              </Link>

              {/* Notifications Link */}
              <Link to="/notifications" className="nav-icon-btn" title="Notifications">
                <Bell size={20} />
                {unreadCount > 0 && <span className="badge-dot">{unreadCount}</span>}
              </Link>

              {/* User Dropdown */}
              <div className="user-dropdown">
                <button
                  className="user-avatar-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.75rem', borderRadius: '9999px', background: '#f1f5f9' }}
                >
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: user?.isAdmin ? '#dc2626' : '#4f46e5', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {user?.isAdmin ? <ShieldCheck size={15} /> : <User size={15} />}
                  </div>
                  <span className="avatar-name">{user?.name.split(' ')[0]}</span>
                </button>

                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <div style={{ padding: '0.5rem 0.8rem', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user?.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{user?.college}</div>
                    </div>

                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      {user?.isAdmin ? <ShieldCheck size={16} color="#dc2626" /> : <User size={16} />}
                      {user?.isAdmin ? 'Admin Profile' : 'Student Profile'}
                    </Link>

                    <Link
                      to="/my-listings"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <ShoppingBag size={16} />
                      My Listings
                    </Link>

                    <Link
                      to="/wishlist"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Heart size={16} />
                      Saved Wishlist
                    </Link>

                    <Link
                      to="/admin"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <LayoutDashboard size={16} />
                      Admin Dashboard
                    </Link>

                    <div className="dropdown-divider"></div>

                    <button className="dropdown-item danger" onClick={handleLogout}>
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer open">
          <NavLink
            to="/"
            className="dropdown-item"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Home size={18} /> Home
          </NavLink>
          <NavLink
            to="/marketplace"
            className="dropdown-item"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Store size={18} /> Marketplace
          </NavLink>
          <NavLink
            to="/sell"
            className="dropdown-item"
            onClick={() => setMobileMenuOpen(false)}
          >
            <PlusCircle size={18} /> Sell an Item
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink
                to="/wishlist"
                className="dropdown-item"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Heart size={18} /> Wishlist ({wishlistCount})
              </NavLink>
              <NavLink
                to="/messages"
                className="dropdown-item"
                onClick={() => setMobileMenuOpen(false)}
              >
                <MessageSquare size={18} /> Messages
              </NavLink>
              <NavLink
                to="/notifications"
                className="dropdown-item"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Bell size={18} /> Notifications ({unreadCount})
              </NavLink>
              <NavLink
                to="/profile"
                className="dropdown-item"
                onClick={() => setMobileMenuOpen(false)}
              >
                {user?.isAdmin ? <ShieldCheck size={18} /> : <User size={18} />} {user?.isAdmin ? 'Admin Profile' : 'Student Profile'} ({user?.name.split(' ')[0]})
              </NavLink>
              <NavLink
                to="/my-listings"
                className="dropdown-item"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingBag size={18} /> My Listings
              </NavLink>
              <NavLink
                to="/admin"
                className="dropdown-item"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LayoutDashboard size={18} /> Admin Dashboard
              </NavLink>
              <button className="btn btn-danger btn-sm" onClick={handleLogout} style={{ marginTop: '1rem' }}>
                Logout
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
              <button
                className="btn btn-soft"
                onClick={() => {
                  loginAsDemo();
                  setMobileMenuOpen(false);
                  addToast('Logged in with Demo Student account!', 'success');
                }}
              >
                <Sparkles size={16} /> Demo Student Login
              </button>
              <Link
                to="/login"
                className="btn btn-outline"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn btn-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
