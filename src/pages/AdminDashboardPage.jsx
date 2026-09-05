import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  Users, 
  ShoppingBag, 
  CheckCircle2, 
  Flag, 
  TrendingUp, 
  ShieldCheck, 
  Trash2, 
  Check, 
  Tag, 
  RotateCcw,
  Sparkles,
  User,
  Rocket,
  XCircle,
  Key,
  UserPlus,
  Eye,
  Lock,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { MOCK_ADMIN_STATS, CATEGORIES } from '../data/mockData';
import { useProducts } from '../context/ProductContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { Modal } from '../components/Modal';

export const AdminDashboardPage = () => {
  const { user, adminDatabase, addAdminAccount, updateAdminPassword, deleteAdminAccount } = useAuth();
  const { products, deleteProduct, clearAllProducts, approveProduct, rejectProduct } = useProducts();
  const { addToast } = useToast();
  const { addNotification } = useNotifications();

  if (!user?.isAdmin) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '5rem 1.5rem', maxWidth: '540px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
          <ShieldCheck size={36} />
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
          Admin Web Access Restricted
        </h2>
        <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '2rem' }}>
          The Admin Web Console is restricted to verified administrators. Please register or login with an Admin Account to access platform management.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/admin/login" className="btn btn-danger btn-lg">
            <ShieldCheck size={18} /> Admin Portal Login
          </Link>
          <Link to="/register" className="btn btn-outline btn-lg">
            Register Admin Account
          </Link>
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState('verifications'); // 'verifications' | 'admindb' | 'overview' | 'products' | 'students' | 'categories' | 'reported'
  const [productStatusFilter, setProductStatusFilter] = useState('all'); // 'all' | 'Pending Verification' | 'Active' | 'Rejected'
  const [students, setStudents] = useState(MOCK_ADMIN_STATS.studentsList);
  const [reportedListings, setReportedListings] = useState(MOCK_ADMIN_STATS.reportedItems);
  const [studentSearch, setStudentSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [adminSearch, setAdminSearch] = useState('');

  // New Admin Form State
  const [addAdminModalOpen, setAddAdminModalOpen] = useState(false);
  const [newAdminForm, setNewAdminForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Platform Supervisor',
    department: 'Content Verification & Safety',
    phone: ''
  });

  // Password Edit Modal
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');

  const pendingProducts = products.filter((p) => p.status === 'Pending Verification');
  const activeProducts = products.filter((p) => p.status === 'Active');
  const rejectedProducts = products.filter((p) => p.status === 'Rejected');

  const handleApproveProduct = (prod) => {
    approveProduct(prod.id);
    addNotification(
      'Listing Approved! 🎉',
      `Your product "${prod.name}" has been accepted by Admin and is now live on the public marketplace.`,
      'listing',
      `/product/${prod.id}`
    );
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
    addToast(`🚀 Accepted & Launched "${prod.name}" onto live website!`, 'success');
  };

  const handleRejectProduct = (prod) => {
    const reason = window.prompt(`Enter rejection reason for seller (${prod.seller.name}):`, 'Item listing does not comply with campus safety guidelines.');
    if (reason !== null) {
      rejectProduct(prod.id, reason);
      addNotification(
        'Listing Rejected 🔴',
        `Your product "${prod.name}" was rejected by Admin. Reason: ${reason}`,
        'listing',
        `/my-listings`
      );
      addToast(`Rejected product "${prod.name}". Seller notified.`, 'info');
    }
  };

  const toggleStudentStatus = (id) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: s.status === 'Active' ? 'Suspended' : 'Active' } : s
      )
    );
    addToast('Student account status updated!', 'info');
  };

  const handleResolveReport = (id) => {
    setReportedListings((prev) => prev.filter((r) => r.id !== id));
    addToast('Reported item resolved and cleared.', 'success');
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear ALL products and reset to a fresh website?')) {
      clearAllProducts();
      addToast('All products cleared! Website reset to fresh state.', 'success');
    }
  };

  const handleCreateNewAdmin = (e) => {
    e.preventDefault();
    if (!newAdminForm.name || !newAdminForm.email || !newAdminForm.password) {
      addToast('Please fill all required admin fields', 'error');
      return;
    }

    addAdminAccount(newAdminForm);
    addToast(`New Admin account created for ${newAdminForm.name}! Credentials stored in Admin DB.`, 'success');
    setNewAdminForm({
      name: '',
      email: '',
      password: '',
      role: 'Platform Supervisor',
      department: 'Content Verification & Safety',
      phone: ''
    });
    setAddAdminModalOpen(false);
  };

  const handleSavePasswordChange = () => {
    if (!editingAdmin || !newPasswordInput) return;
    updateAdminPassword(editingAdmin.id, newPasswordInput);
    addToast(`Password updated for admin "${editingAdmin.name}"!`, 'success');
    setEditingAdmin(null);
    setNewPasswordInput('');
  };

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.college.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const filteredAdminProducts = products.filter((p) => {
    if (productStatusFilter !== 'all' && p.status !== productStatusFilter) {
      return false;
    }
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.seller.name.toLowerCase().includes(productSearch.toLowerCase());
    return matchesSearch;
  });

  const filteredAdminsInDb = adminDatabase.filter((a) =>
    a.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
    a.email.toLowerCase().includes(adminSearch.toLowerCase()) ||
    a.role.toLowerCase().includes(adminSearch.toLowerCase())
  );

  return (
    <div className="admin-dashboard-page page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#fee2e2', color: '#991b1b', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            <ShieldCheck size={14} /> CampusMart Admin Console & Database
          </div>
          <h1 className="page-title">Platform Admin Control Center</h1>
          <p className="page-subtitle">Verify pending product launches, accept/reject listings, and manage Admin Database credentials</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-outline btn-sm" style={{ backgroundColor: '#ffffff' }} onClick={() => setAddAdminModalOpen(true)}>
            <UserPlus size={16} color="#dc2626" /> Add Admin Credential
          </button>
          <button className="btn btn-danger btn-sm" onClick={handleClearAllData}>
            <RotateCcw size={16} /> Reset Fresh Website (Clear All)
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem'
      }}>
        {/* Metric 1: Pending Product Verifications */}
        <div
          onClick={() => setActiveTab('verifications')}
          style={{
            background: pendingProducts.length > 0 ? '#fffbebf0' : '#ffffff',
            border: pendingProducts.length > 0 ? '2px solid #f59e0b' : '1px solid #e2e8f0',
            borderRadius: '18px',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#b45309', fontSize: '0.825rem', fontWeight: 800 }}>
            <span>PENDING VERIFICATIONS</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: pendingProducts.length > 0 ? '#d97706' : '#0f172a', marginTop: '0.5rem', fontFamily: 'var(--font-heading)' }}>
            {pendingProducts.length}
          </div>
          <span style={{ fontSize: '0.78rem', color: pendingProducts.length > 0 ? '#d97706' : '#64748b', fontWeight: 700 }}>
            {pendingProducts.length > 0 ? '⚠️ Action Required: Accept/Reject' : 'Queue clear'}
          </span>
        </div>

        {/* Metric 2: Live Approved Products */}
        <div
          onClick={() => setActiveTab('products')}
          style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.85rem', fontWeight: 700 }}>
            <span>LIVE APPROVED PRODUCTS</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginTop: '0.5rem', fontFamily: 'var(--font-heading)' }}>
            {activeProducts.length}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>Published on website</span>
        </div>

        {/* Metric 3: Admin Users Database */}
        <div
          onClick={() => setActiveTab('admindb')}
          style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.85rem', fontWeight: 700 }}>
            <span>ADMIN DATABASE USERS</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#dc2626', marginTop: '0.5rem', fontFamily: 'var(--font-heading)' }}>
            {adminDatabase.length}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Registered Admin Accounts</span>
        </div>

        {/* Metric 4: Registered Students */}
        <div
          onClick={() => setActiveTab('students')}
          style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.85rem', fontWeight: 700 }}>
            <span>REGISTERED STUDENTS</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginTop: '0.5rem', fontFamily: 'var(--font-heading)' }}>
            {students.length}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Active student profiles</span>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '2rem', borderBottom: '1.5px solid #e2e8f0' }}>
        {[
          { id: 'verifications', label: `🚀 Verify Product Launches (${pendingProducts.length})`, highlight: pendingProducts.length > 0 },
          { id: 'admindb', label: `🔑 Admin Users & DB (${adminDatabase.length})` },
          { id: 'products', label: `All Products (${products.length})` },
          { id: 'students', label: `Students (${students.length})` },
          { id: 'categories', label: 'Categories' },
          { id: 'reported', label: `Reported (${reportedListings.length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.65rem 1.15rem',
              borderRadius: '12px',
              fontSize: '0.9rem',
              fontWeight: activeTab === tab.id ? 700 : 500,
              backgroundColor: activeTab === tab.id ? (tab.highlight ? '#d97706' : '#4f46e5') : '#ffffff',
              color: activeTab === tab.id ? '#ffffff' : tab.highlight ? '#b45309' : '#475569',
              border: activeTab === tab.id ? 'none' : tab.highlight ? '1.5px solid #f59e0b' : '1px solid #e2e8f0',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SECTION 1: VERIFY PRODUCT LAUNCHES (ACCEPT OR REJECT) */}
      {activeTab === 'verifications' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Rocket color="#d97706" size={22} /> Product Launch Verification Queue ({pendingProducts.length})
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.2rem' }}>
                Verify student submitted products. Click <strong>Accept & Launch</strong> to make the product live on the public website, or <strong>Reject</strong> to return it with feedback.
              </p>
            </div>
          </div>

          {pendingProducts.length === 0 ? (
            <div className="empty-state" style={{ padding: '3rem 1.5rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <CheckCircle size={36} />
              </div>
              <h3 className="empty-title">All Products Verified!</h3>
              <p className="empty-desc">There are currently zero product launches waiting for admin verification.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
              {pendingProducts.map((prod) => (
                <div
                  key={prod.id}
                  style={{
                    border: '2px solid #f59e0b',
                    backgroundColor: '#fffdf5',
                    borderRadius: '18px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between',
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  <div>
                    {/* Header preview thumbnail & details */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{ width: '90px', height: '90px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#e2e8f0', flexShrink: 0 }}>
                        <img src={prod.images[0]} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', background: '#fef3c7', color: '#92400e', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
                          🟡 Pending Verification
                        </span>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0.35rem 0 0.2rem', color: '#0f172a', lineHeight: 1.3 }}>
                          {prod.name}
                        </h4>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#4f46e5' }}>
                          ₹{prod.price.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    {/* Metadata tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.8rem', color: '#475569', backgroundColor: '#ffffff', padding: '0.75rem', borderRadius: '12px', border: '1px solid #fef3c7', marginBottom: '1rem' }}>
                      <div><strong>Category:</strong> {prod.category}</div>
                      <div>• <strong>Condition:</strong> {prod.condition}</div>
                      <div>• <strong>Seller:</strong> {prod.seller.name}</div>
                      <div>• <strong>College:</strong> {prod.college}</div>
                      <div>• <strong>UPI ID:</strong> {prod.upiId}</div>
                    </div>

                    <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                      {prod.description}
                    </p>
                  </div>

                  {/* Accept / Reject Action Bar */}
                  <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid #feebe8' }}>
                    <button
                      className="btn btn-success"
                      onClick={() => handleApproveProduct(prod)}
                      style={{ flex: 1, backgroundColor: '#059669', borderColor: '#059669', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 700 }}
                    >
                      <Rocket size={16} /> Accept & Launch
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() => handleRejectProduct(prod)}
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 700 }}
                    >
                      <XCircle size={16} /> Reject
                    </button>

                    <Link to={`/product/${prod.id}`} className="btn btn-outline btn-sm" style={{ backgroundColor: '#ffffff' }} title="Preview">
                      <Eye size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: ADMIN USER DATABASE & CREDENTIALS MANAGEMENT */}
      {activeTab === 'admindb' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck color="#dc2626" size={22} /> Admin Credentials & User Database ({filteredAdminsInDb.length})
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.2rem' }}>
                View persistent admin accounts, update admin passwords, and add new verified administrator credentials.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search admin DB..."
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                style={{ maxWidth: '220px', height: '40px' }}
              />
              <button className="btn btn-danger btn-sm" onClick={() => setAddAdminModalOpen(true)}>
                <UserPlus size={16} /> Add Admin
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#64748b' }}>
                  <th style={{ padding: '0.75rem' }}>Admin Name</th>
                  <th style={{ padding: '0.75rem' }}>Email Credential</th>
                  <th style={{ padding: '0.75rem' }}>Designation Role</th>
                  <th style={{ padding: '0.75rem' }}>Department / HQ</th>
                  <th style={{ padding: '0.75rem' }}>Phone</th>
                  <th style={{ padding: '0.75rem' }}>Status</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdminsInDb.map((adm) => (
                  <tr key={adm.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700, color: '#0f172a' }}>
                      {adm.name}
                    </td>
                    <td style={{ padding: '0.85rem 0.75rem', fontWeight: 600, color: '#dc2626' }}>
                      {adm.email}
                    </td>
                    <td style={{ padding: '0.85rem 0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', background: '#fee2e2', color: '#991b1b', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '9999px' }}>
                        {adm.role}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 0.75rem' }}>{adm.department}</td>
                    <td style={{ padding: '0.85rem 0.75rem' }}>{adm.phone}</td>
                    <td style={{ padding: '0.85rem 0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', background: '#d1fae5', color: '#065f46', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '9999px' }}>
                        {adm.status || 'Active'}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 0.75rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => {
                            setEditingAdmin(adm);
                            setNewPasswordInput(adm.password || '');
                          }}
                          title="Change Password"
                        >
                          <Key size={14} /> Password
                        </button>
                        {adminDatabase.length > 1 && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => {
                              if (window.confirm(`Delete admin account for "${adm.name}"?`)) {
                                deleteAdminAccount(adm.id);
                                addToast(`Removed admin user "${adm.name}" from DB`, 'info');
                              }
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '2rem', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <Sparkles size={32} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>CampusMart Fresh Marketplace</h2>
          <p style={{ color: '#64748b', maxWidth: '520px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
            The platform is active and protected by Admin Product Launch Verification. Students submit items, and admins verify and launch them live.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => setActiveTab('verifications')}>
              <Rocket size={16} /> Go to Verify Product Launches ({pendingProducts.length})
            </button>
            <button className="btn btn-danger btn-sm" onClick={handleClearAllData}>
              <RotateCcw size={16} /> Reset Fresh Website
            </button>
          </div>
        </div>
      )}

      {/* SECTION 4: ALL PRODUCTS REGISTRY */}
      {activeTab === 'products' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>All Products Registry ({filteredAdminProducts.length})</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Filter products..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                style={{ maxWidth: '240px', height: '40px' }}
              />
              {products.length > 0 && (
                <button className="btn btn-danger btn-sm" onClick={handleClearAllData}>
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Sub-status Filter Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: `All Items (${products.length})` },
              { id: 'Pending Verification', label: `🟡 Pending Approval (${pendingProducts.length})` },
              { id: 'Active', label: `🟢 Approved Live (${activeProducts.length})` },
              { id: 'Rejected', label: `🔴 Rejected (${rejectedProducts.length})` }
            ].map((stFilter) => (
              <button
                key={stFilter.id}
                type="button"
                onClick={() => setProductStatusFilter(stFilter.id)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '9999px',
                  fontSize: '0.8rem',
                  fontWeight: productStatusFilter === stFilter.id ? 700 : 500,
                  backgroundColor: productStatusFilter === stFilter.id ? '#4f46e5' : '#f8fafc',
                  color: productStatusFilter === stFilter.id ? '#ffffff' : '#64748b',
                  border: '1px solid #cbd5e1',
                  cursor: 'pointer'
                }}
              >
                {stFilter.label}
              </button>
            ))}
          </div>

          {filteredAdminProducts.length === 0 ? (
            <div className="empty-state">
              <ShoppingBag size={36} color="#94a3b8" />
              <h3 className="empty-title">No Products Found</h3>
              <p className="empty-desc">No items match the selected status or search query.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#64748b' }}>
                    <th style={{ padding: '0.75rem' }}>Product Title</th>
                    <th style={{ padding: '0.75rem' }}>Category</th>
                    <th style={{ padding: '0.75rem' }}>Price</th>
                    <th style={{ padding: '0.75rem' }}>Seller</th>
                    <th style={{ padding: '0.75rem' }}>Verification Status</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdminProducts.map((prod) => (
                    <tr key={prod.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700, maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {prod.name}
                      </td>
                      <td style={{ padding: '0.85rem 0.75rem' }}>{prod.category}</td>
                      <td style={{ padding: '0.85rem 0.75rem', fontWeight: 800, color: '#4f46e5' }}>₹{prod.price}</td>
                      <td style={{ padding: '0.85rem 0.75rem' }}>{prod.seller.name}</td>
                      <td style={{ padding: '0.85rem 0.75rem' }}>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.55rem',
                            borderRadius: '9999px',
                            backgroundColor:
                              prod.status === 'Pending Verification' ? '#fef3c7' : prod.status === 'Active' ? '#d1fae5' : '#fee2e2',
                            color:
                              prod.status === 'Pending Verification' ? '#92400e' : prod.status === 'Active' ? '#065f46' : '#991b1b'
                          }}
                        >
                          {prod.status === 'Pending Verification'
                            ? '🟡 Pending Admin Approval'
                            : prod.status === 'Active'
                            ? '🟢 Live & Approved'
                            : prod.status === 'Rejected'
                            ? '🔴 Rejected by Admin'
                            : prod.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 0.75rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                          {prod.status !== 'Active' && (
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleApproveProduct(prod)}
                              style={{ backgroundColor: '#059669', color: '#ffffff', border: 'none' }}
                            >
                              Accept & Launch
                            </button>
                          )}
                          {prod.status !== 'Rejected' && (
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => handleRejectProduct(prod)}
                              style={{ color: '#dc2626', borderColor: '#fee2e2' }}
                            >
                              Reject
                            </button>
                          )}
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => {
                              if (window.confirm(`Delete product listing "${prod.name}" permanently?`)) {
                                deleteProduct(prod.id);
                                addToast(`Admin deleted product "${prod.name}"`, 'info');
                              }
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SECTION 5: MANAGE STUDENTS */}
      {activeTab === 'students' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Registered Students</h3>
          {students.length === 0 ? (
            <div className="empty-state">
              <Users size={36} color="#94a3b8" />
              <h3 className="empty-title">No Students Registered Yet</h3>
              <p className="empty-desc">New student registrations will appear here in real time.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#64748b' }}>
                    <th style={{ padding: '0.75rem' }}>Student Name</th>
                    <th style={{ padding: '0.75rem' }}>Email</th>
                    <th style={{ padding: '0.75rem' }}>Status</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((st) => (
                    <tr key={st.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700 }}>{st.name}</td>
                      <td style={{ padding: '0.85rem 0.75rem' }}>{st.email}</td>
                      <td style={{ padding: '0.85rem 0.75rem' }}>{st.status}</td>
                      <td style={{ padding: '0.85rem 0.75rem', textAlign: 'right' }}>
                        <button className="btn btn-outline btn-sm" onClick={() => toggleStudentStatus(st.id)}>
                          Toggle Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SECTION 6: CATEGORIES */}
      {activeTab === 'categories' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>Active Marketplace Categories</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {CATEGORIES.map((cat) => (
              <div key={cat.id} style={{ border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: cat.bg, color: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  <Tag size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{cat.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Active category</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 7: REPORTED ITEMS */}
      {activeTab === 'reported' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>Flagged & Reported Items</h3>

          {reportedListings.length === 0 ? (
            <div className="empty-state">
              <CheckCircle2 size={36} color="#10b981" />
              <h3 className="empty-title">All Reports Clear</h3>
              <p className="empty-desc">No flagged or reported items in queue.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reportedListings.map((item) => (
                <div key={item.id} style={{ border: '1px solid #fee2e2', backgroundColor: '#fff5f5', borderRadius: '14px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', background: '#dc2626', color: '#ffffff', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>
                      {item.status}
                    </span>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0.35rem 0 0.15rem' }}>{item.productName}</h4>
                    <p style={{ fontSize: '0.875rem', color: '#7f1d1d' }}>
                      <strong>Reporter:</strong> {item.reporter} • <strong>Reason:</strong> {item.reason}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-primary btn-sm" onClick={() => handleResolveReport(item.id)}>
                      <Check size={14} /> Dismiss & Keep
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleResolveReport(item.id)}>
                      <Trash2 size={14} /> Remove Listing
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal: Add New Admin to Database */}
      <Modal
        isOpen={addAdminModalOpen}
        onClose={() => setAddAdminModalOpen(false)}
        title="Register New Administrator to Database"
      >
        <form onSubmit={handleCreateNewAdmin}>
          <div className="form-group">
            <label className="form-label">Full Admin Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Vikramaditya Singh"
              value={newAdminForm.name}
              onChange={(e) => setNewAdminForm((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Admin Email Address *</label>
            <input
              type="email"
              className="form-control"
              placeholder="e.g. supervisor@campusmart.in"
              value={newAdminForm.email}
              onChange={(e) => setNewAdminForm((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Admin Password Credential *</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={newAdminForm.password}
              onChange={(e) => setNewAdminForm((prev) => ({ ...prev, password: e.target.value }))}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Role Designation</label>
              <input
                type="text"
                className="form-control"
                value={newAdminForm.role}
                onChange={(e) => setNewAdminForm((prev) => ({ ...prev, role: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                placeholder="+91 99000 12345"
                value={newAdminForm.phone}
                onChange={(e) => setNewAdminForm((prev) => ({ ...prev, phone: e.target.value }))}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => setAddAdminModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-danger">
              <UserPlus size={16} /> Create Admin Database Account
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Change Admin Password */}
      <Modal
        isOpen={!!editingAdmin}
        onClose={() => setEditingAdmin(null)}
        title={`Update Password for Admin: ${editingAdmin?.name}`}
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setEditingAdmin(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={handleSavePasswordChange}>Save New Password</button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Admin Email</label>
          <input type="text" className="form-control" value={editingAdmin?.email || ''} disabled />
        </div>
        <div className="form-group">
          <label className="form-label">New Password Credential</label>
          <input
            type="text"
            className="form-control"
            value={newPasswordInput}
            onChange={(e) => setNewPasswordInput(e.target.value)}
            placeholder="Enter new password"
          />
        </div>
      </Modal>
    </div>
  );
};
