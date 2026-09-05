import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_CONVERSATIONS } from '../data/mockData';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('campusmart_chats');
    return saved ? JSON.parse(saved) : MOCK_CONVERSATIONS;
  });

  const [activeConvId, setActiveConvId] = useState(() => {
    return conversations[0]?.id || null;
  });

  useEffect(() => {
    localStorage.setItem('campusmart_chats', JSON.stringify(conversations));
  }, [conversations]);

  const activeConversation = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const sendMessage = (convId, text, senderId = 'user-101') => {
    if (!text.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      id: 'msg-' + Date.now(),
      senderId,
      text,
      timestamp: timeStr
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convId) {
          return {
            ...c,
            lastMessage: text,
            lastTimestamp: timeStr,
            messages: [...c.messages, newMsg]
          };
        }
        return c;
      })
    );
  };

  const startConversationWithSeller = (product, currentUser) => {
    // Check if conversation with seller for product already exists
    const existing = conversations.find(
      (c) => c.productId === product.id || (c.otherUser.id === product.seller.id)
    );

    if (existing) {
      setActiveConvId(existing.id);
      return existing.id;
    }

    const newConvId = 'conv-' + Date.now();
    const newConv = {
      id: newConvId,
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      productImage: product.images[0],
      otherUser: {
        id: product.seller.id,
        name: product.seller.name,
        college: product.seller.college,
        status: 'online'
      },
      lastMessage: `Hi ${product.seller.name}, I am interested in buying "${product.name}". Is it available?`,
      lastTimestamp: 'Just now',
      unread: false,
      messages: [
        {
          id: 'msg-start-' + Date.now(),
          senderId: currentUser?.id || 'user-101',
          text: `Hi ${product.seller.name}, I am interested in buying "${product.name}". Is it available?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveConvId(newConvId);
    return newConvId;
  };

  return (
    <ChatContext.Provider value={{
      conversations,
      activeConvId,
      setActiveConvId,
      activeConversation,
      sendMessage,
      startConversationWithSeller
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};
