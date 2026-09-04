import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, Trash2, MessageSquare, ShoppingBag, Tag, Sparkles, AlertCircle } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useToast } from '../context/ToastContext';

export const NotificationsPage = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const { addToast } = useToast();

  const handleMarkAllRead = () => {
    markAllAsRead();
    addToast('All notifications marked as read', 'info');
  };

  const getIcon = (type) => {
    switch (type) {
      case 'message': return <MessageSquare size={18} color="#0284c7" />;
      case 'listing': return <ShoppingBag size={18} color="#4f46e5" />;
      case 'sale': return <Sparkles size={18} color="#10b981" />;
      case 'price': return <Tag size={18} color="#d97706" />;
      default: return <Bell size={18} color="#6366f1" />;
    }
  };

  return (
    <div className="notifications-page page-container" style={{ maxWidth: '780px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Notifications ({notifications.length})</h1>
          <p className="page-subtitle">Stay updated on your product listings, inquiries, and campus sales</p>
        </div>

        {unreadCount > 0 && (
          <button className="btn btn-outline btn-sm" onClick={handleMarkAllRead}>
            <CheckCheck size={16} /> Mark All as Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Bell size={36} />
          </div>
          <h3 className="empty-title">No Notifications Yet</h3>
          <p className="empty-desc">You are all caught up! Updates regarding your listings will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markAsRead(notif.id)}
              style={{
                background: notif.read ? '#ffffff' : '#f0fdf4',
                border: notif.read ? '1px solid #e2e8f0' : '1.5px solid #a7f3d0',
                borderRadius: '16px',
                padding: '1.15rem 1.25rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: notif.read ? '#f1f5f9' : '#e0e7ff',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                flexShrink: 0
              }}>
                {getIcon(notif.type)}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{notif.title}</h4>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{notif.time}</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.45 }}>{notif.message}</p>
                
                {notif.link && (
                  <Link
                    to={notif.link}
                    style={{ fontSize: '0.8rem', color: '#4f46e5', fontWeight: 700, marginTop: '0.4rem', display: 'inline-block' }}
                  >
                    View Details →
                  </Link>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(notif.id);
                  addToast('Notification removed', 'info');
                }}
                style={{ color: '#94a3b8', padding: '4px' }}
                title="Remove Notification"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
