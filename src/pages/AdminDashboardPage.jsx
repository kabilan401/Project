import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  User
} from 'lucide-react';
import { MOCK_ADMIN_STATS, CATEGORIES } from '../data/mockData';
import { useProducts } from '../context/ProductContext';
import { useToast } from '../context/ToastContext';

export const AdminDashboardPage = () => {
  const { products, deleteProduct, clearAllProducts } = useProducts();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'students' | 'products' | 'categories' | 'reported' | 'stats'
  const [students, setStudents] = useState(MOCK_ADMIN_STATS.studentsList);
  const [reportedListings, setReportedListings] = useState(MOCK_ADMIN_STATS.reportedItems);
  const [studentSearch, setStudentSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');

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

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.college.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const filteredAdminProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.seller.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="admin-dashboard-page page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#fee2e2', color: '#991b1b', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            <ShieldCheck size={14} /> CampusMart Admin Console
          </div>
          <h1 className="page-title">Platform Admin Dashboard</h1>
          <p className="page-subtitle">Monitor marketplace analytics, moderate student users and products</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/profile" className="btn btn-outline btn-sm" style={{ backgroundColor: '#ffffff' }}>
            <ShieldCheck size={16} color="#dc2626" /> Edit Admin Profile
          </Link>
          <button className="btn btn-danger btn-sm" onClick={handleClearAllData}>
            <RotateCcw size={16} /> Reset Fresh Website (Clear All Products)
          </button>
        </div>
      </div>

      {/* Top 5 Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem'
      }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.85rem', fontWeight: 700 }}>
            <span>REGISTERED STUDENTS</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginTop: '0.5rem', fontFamily: 'var(--font-heading)' }}>
            {students.length}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Active student accounts</span>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.85rem', fontWeight: 700 }}>
            <span>TOTAL PRODUCTS</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginTop: '0.5rem', fontFamily: 'var(--font-heading)' }}>
            {products.length}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>Live items listed</span>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.85rem', fontWeight: 700 }}>
            <span>PRODUCTS SOLD</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginTop: '0.5rem', fontFamily: 'var(--font-heading)' }}>
            {products.filter(p => p.status === 'Sold').length}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>Completed sales</span>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.85rem', fontWeight: 700 }}>
            <span>FLAGGED ITEMS</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flag size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#dc2626', marginTop: '0.5rem', fontFamily: 'var(--font-heading)' }}>
            {reportedListings.length}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Moderation queue</span>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.85rem', fontWeight: 700 }}>
            <span>PLATFORM HEALTH</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981', marginTop: '0.5rem', fontFamily: 'var(--font-heading)' }}>
            Fresh State
          </div>
          <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>Ready for real users</span>
        </div>
      </div>

      {/* Admin Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '2rem', borderBottom: '1.5px solid #e2e8f0' }}>
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'products', label: `Manage Products (${products.length})` },
          { id: 'students', label: `Manage Students (${students.length})` },
          { id: 'categories', label: 'Categories' },
          { id: 'reported', label: `Reported Items (${reportedListings.length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.65rem 1.15rem',
              borderRadius: '12px',
              fontSize: '0.9rem',
              fontWeight: activeTab === tab.id ? 700 : 500,
              backgroundColor: activeTab === tab.id ? '#4f46e5' : '#ffffff',
              color: activeTab === tab.id ? '#ffffff' : '#475569',
              border: activeTab === tab.id ? '1px solid #4f46e5' : '1px solid #e2e8f0',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Section: Overview */}
      {activeTab === 'overview' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '2rem', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <Sparkles size={32} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>CampusMart Fresh Marketplace</h2>
          <p style={{ color: '#64748b', maxWidth: '520px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
            The platform is clean and ready. Students can now register, post used engineering books, scientific calculators, laptops, and cycles from scratch.
          </p>
          <button className="btn btn-danger btn-sm" onClick={handleClearAllData}>
            <RotateCcw size={16} /> Reset All Products
          </button>
        </div>
      )}

      {/* Section: Manage Products */}
      {activeTab === 'products' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Active Products Registry ({filteredAdminProducts.length})</h3>
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

          {filteredAdminProducts.length === 0 ? (
            <div className="empty-state">
              <ShoppingBag size={36} color="#94a3b8" />
              <h3 className="empty-title">Zero Products Listed</h3>
              <p className="empty-desc">The marketplace is completely fresh and clean.</p>
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
                    <th style={{ padding: '0.75rem' }}>Status</th>
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
                        <span className={prod.status === 'Sold' ? 'badge-sold' : 'badge-condition'} style={{ position: 'static' }}>
                          {prod.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 0.75rem', textAlign: 'right' }}>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            deleteProduct(prod.id);
                            addToast(`Admin deleted product "${prod.name}"`, 'info');
                          }}
                        >
                          <Trash2 size={14} /> Delete
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

      {/* Section: Manage Students */}
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

      {/* Section: Categories */}
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

      {/* Section: Reported Items */}
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
    </div>
  );
};
