import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Search, 
  Send, 
  ShoppingBag, 
  Phone, 
  MoreVertical, 
  CheckCheck, 
  MapPin, 
  Circle,
  User
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';

export const MessagesPage = () => {
  const { conversations, activeConvId, setActiveConvId, activeConversation, sendMessage } = useChat();
  const { user } = useAuth();

  const [inputMessage, setInputMessage] = useState('');
  const [searchConv, setSearchConv] = useState('');

  const filteredConversations = conversations.filter((c) =>
    c.otherUser.name.toLowerCase().includes(searchConv.toLowerCase()) ||
    c.productName.toLowerCase().includes(searchConv.toLowerCase())
  );

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeConversation) return;

    const sentText = inputMessage;
    sendMessage(activeConversation.id, sentText, user?.id || 'user-101');
    setInputMessage('');

    // Simulate seller auto-reply after 1.2s for interactive feel
    setTimeout(() => {
      const autoReplies = [
        "Sounds good! Let's meet near the Central Library around 4 PM today.",
        "Yes, the product is in great condition! I can bring it to your hostel block.",
        "Sure, I can give you a ₹50 student discount if you pick it up today!",
        "Alright, let me know when you reach the campus canteen."
      ];
      const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
      sendMessage(activeConversation.id, randomReply, activeConversation.otherUser.id);
    }, 1200);
  };

  return (
    <div className="messages-page page-container">
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title">Campus Chat & Messages</h1>
        <p className="page-subtitle">Connect directly with student buyers and sellers on campus</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        gap: '0',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '24px',
        height: '680px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Left Sidebar: Conversation List */}
        <div style={{ borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
          {/* Search Box */}
          <div style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-control"
                placeholder="Search conversations..."
                value={searchConv}
                onChange={(e) => setSearchConv(e.target.value)}
                style={{ paddingLeft: '36px', height: '40px', fontSize: '0.875rem', borderRadius: '10px' }}
              />
            </div>
          </div>

          {/* Conversations Scroll Box */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredConversations.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                No active chats found.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isActive = conv.id === (activeConversation?.id);
                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    style={{
                      padding: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      cursor: 'pointer',
                      backgroundColor: isActive ? '#eef2ff' : 'transparent',
                      borderLeft: isActive ? '4px solid #4f46e5' : '4px solid transparent',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ position: 'relative' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={22} />
                      </div>
                      <span style={{
                        position: 'absolute',
                        bottom: '2px',
                        right: '2px',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: conv.otherUser.status === 'online' ? '#10b981' : '#cbd5e1',
                        border: '2px solid #ffffff'
                      }} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.925rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {conv.otherUser.name}
                        </div>
                        <span style={{ fontSize: '0.725rem', color: '#94a3b8' }}>{conv.lastTimestamp}</span>
                      </div>

                      <div style={{ fontSize: '0.8rem', color: '#4f46e5', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {conv.productName}
                      </div>

                      <div style={{ fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '0.1rem' }}>
                        {conv.lastMessage}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Main Chat Window */}
        {activeConversation ? (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header Bar */}
            <div style={{
              padding: '0.85rem 1.25rem',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              backgroundColor: '#ffffff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {activeConversation.otherUser.name}
                    <span style={{ fontSize: '0.75rem', color: activeConversation.otherUser.status === 'online' ? '#10b981' : '#94a3b8' }}>
                      • {activeConversation.otherUser.status === 'online' ? 'Online' : 'Offline'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.775rem', color: '#64748b' }}>
                    {activeConversation.otherUser.college}
                  </div>
                </div>
              </div>

              {/* Product Reference Pill */}
              <Link
                to={`/product/${activeConversation.productId}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  backgroundColor: '#f1f5f9',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  color: '#334155'
                }}
              >
                <img src={activeConversation.productImage} alt="Product" style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'cover' }} />
                <span style={{ fontWeight: 600, maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {activeConversation.productName}
                </span>
                <span style={{ fontWeight: 800, color: '#4f46e5' }}>₹{activeConversation.productPrice}</span>
              </Link>
            </div>

            {/* Message Bubble Scroll Area */}
            <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {activeConversation.messages.map((msg) => {
                const isMe = msg.senderId === (user?.id || 'user-101');
                return (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: isMe ? 'flex-end' : 'flex-start',
                      maxWidth: '70%'
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: isMe ? '#4f46e5' : '#ffffff',
                        color: isMe ? '#ffffff' : '#0f172a',
                        padding: '0.75rem 1rem',
                        borderRadius: isMe ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                        boxShadow: 'var(--shadow-sm)',
                        fontSize: '0.925rem',
                        lineHeight: 1.45,
                        border: isMe ? 'none' : '1px solid #e2e8f0'
                      }}
                    >
                      {msg.text}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.2rem', textAlign: isMe ? 'right' : 'left' }}>
                      {msg.timestamp}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Footer */}
            <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid #e2e8f0', backgroundColor: '#ffffff', display: 'flex', gap: '0.75rem' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Type your message to seller..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                style={{ height: '46px', borderRadius: '12px' }}
              />
              <button type="submit" className="btn btn-primary" style={{ height: '46px', padding: '0 1.25rem', borderRadius: '12px' }}>
                <Send size={18} /> Send
              </button>
            </form>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
};
