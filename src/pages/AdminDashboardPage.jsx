import React, { useState } from 'react';
import { 
  Users, 
  ShoppingBag, 
  CheckCircle2, 
  Flag, 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  ShieldCheck, 
  Trash2, 
  Check, 
  X, 
  Plus,
  Tag,
  Search,
  Filter
} from 'lucide-react';
import { MOCK_ADMIN_STATS, CATEGORIES } from '../data/mockData';
import { useProducts } from '../context/ProductContext';
import { useToast } from '../context/ToastContext';

export const AdminDashboardPage = () => {
  const { products, deleteProduct } = useProducts();
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
            <span>TOTAL STUDENTS</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginTop: '0.5rem', fontFamily: 'var(--font-heading)' }}>
            {MOCK_ADMIN_STATS.totalStudents.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>+12% this month</span>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.85rem', fontWeight: 700 }}>
            <span>TOTAL LISTINGS</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginTop: '0.5rem', fontFamily: 'var(--font-heading)' }}>
            {products.length || MOCK_ADMIN_STATS.totalListings}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>Active items</span>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.85rem', fontWeight: 700 }}>
            <span>PRODUCTS SOLD</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginTop: '0.5rem', fontFamily: 'var(--font-heading)' }}>
            {MOCK_ADMIN_STATS.productsSold}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>71.7% conversion</span>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.85rem', fontWeight: 700 }}>
            <span>REPORTED ITEMS</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flag size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#dc2626', marginTop: '0.5rem', fontFamily: 'var(--font-heading)' }}>
            {reportedListings.length}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#dc2626', fontWeight: 700 }}>Action Required</span>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.85rem', fontWeight: 700 }}>
            <span>VOLUME TRADED</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginTop: '0.5rem', fontFamily: 'var(--font-heading)' }}>
            {MOCK_ADMIN_STATS.totalRevenueVolume}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>Peer-to-peer volume</span>
        </div>
      </div>

      {/* Admin Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '2rem', borderBottom: '1.5px solid #e2e8f0' }}>
        {[
          { id: 'overview', label: 'Overview & Charts' },
          { id: 'students', label: 'Manage Students' },
          { id: 'products', label: 'Manage Products' },
          { id: 'categories', label: 'Manage Categories' },
          { id: 'reported', label: `Reported Listings (${reportedListings.length})` },
          { id: 'stats', label: 'Marketplace Statistics' }
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

      {/* Section 1: Overview & Charts */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
          {/* Chart 1: Monthly Growth */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={20} color="#4f46e5" /> Monthly Listings vs Sales Growth
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '220px', padding: '1rem 0', borderBottom: '1px solid #f1f5f9' }}>
              {MOCK_ADMIN_STATS.monthlyListings.map((m, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '160px' }}>
                    <div style={{ width: '18px', height: `${(m.listings / 450) * 100}%`, backgroundColor: '#6366f1', borderRadius: '4px 4px 0 0' }} title={`Listings: ${m.listings}`} />
                    <div style={{ width: '18px', height: `${(m.sales / 450) * 100}%`, backgroundColor: '#10b981', borderRadius: '4px 4px 0 0' }} title={`Sales: ${m.sales}`} />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{m.month}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#6366f1' }} />
                <span>New Listings</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#10b981' }} />
                <span>Products Sold</span>
              </div>
            </div>
          </div>

          {/* Chart 2: Category Breakdown */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Listings Share by Category
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {MOCK_ADMIN_STATS.categoryDistribution.map((cat, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    <span>{cat.name}</span>
                    <span style={{ color: '#4f46e5' }}>{cat.count} ({cat.percent}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${cat.percent}%`,
                        height: '100%',
                        backgroundColor: idx === 0 ? '#4f46e5' : idx === 1 ? '#0284c7' : idx === 2 ? '#7c3aed' : '#d97706',
                        borderRadius: '9999px'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Section 2: Manage Students */}
      {activeTab === 'students' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Student Directory ({filteredStudents.length})</h3>
            <input
              type="text"
              className="form-control"
              placeholder="Search student by name, email or college..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              style={{ maxWidth: '320px', height: '40px' }}
            />
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#64748b' }}>
                  <th style={{ padding: '0.75rem' }}>Student Name</th>
                  <th style={{ padding: '0.75rem' }}>College Email</th>
                  <th style={{ padding: '0.75rem' }}>University</th>
                  <th style={{ padding: '0.75rem' }}>Listings</th>
                  <th style={{ padding: '0.75rem' }}>Status</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((st) => (
                  <tr key={st.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700 }}>{st.name}</td>
                    <td style={{ padding: '0.85rem 0.75rem', color: '#475569' }}>{st.email}</td>
                    <td style={{ padding: '0.85rem 0.75rem' }}>{st.college}</td>
                    <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700 }}>{st.listings} items</td>
                    <td style={{ padding: '0.85rem 0.75rem' }}>
                      <span style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: st.status === 'Active' ? '#d1fae5' : '#fee2e2',
                        color: st.status === 'Active' ? '#065f46' : '#991b1b'
                      }}>
                        {st.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 0.75rem', textAlign: 'right' }}>
                      <button
                        className={`btn btn-sm ${st.status === 'Active' ? 'btn-outline' : 'btn-soft'}`}
                        onClick={() => toggleStudentStatus(st.id)}
                      >
                        {st.status === 'Active' ? 'Suspend Student' : 'Activate Account'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Section 3: Manage Products */}
      {activeTab === 'products' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Active Products Registry ({filteredAdminProducts.length})</h3>
            <input
              type="text"
              className="form-control"
              placeholder="Filter products..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              style={{ maxWidth: '320px', height: '40px' }}
            />
          </div>

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
                        <Trash2 size={14} /> Delete Listing
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Section 4: Manage Categories */}
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
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{cat.count} total items</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 5: Reported Listings */}
      {activeTab === 'reported' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>Flagged & Reported Items</h3>

          {reportedListings.length === 0 ? (
            <div className="empty-state">
              <CheckCircle2 size={36} color="#10b981" />
              <h3 className="empty-title">All Reports Resolved</h3>
              <p className="empty-desc">No pending student flagged listings require review.</p>
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

      {/* Section 6: Marketplace Statistics */}
      {activeTab === 'stats' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Detailed Campus Statistics</h3>
          <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6 }}>
            CampusMart currently serves 14+ university campuses across India including IIT Delhi, BITS Pilani, NIT Trichy, Anna University, and VIT Vellore. Average product turnaround time is 2.4 days with a 98.4% student satisfaction score.
          </p>
        </div>
      )}
    </div>
  );
};
