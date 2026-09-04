import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState(() => {
    const saved = localStorage.getItem('campusmart_wishlist');
    return saved ? JSON.parse(saved) : ['prod-1', 'prod-3', 'prod-7', 'prod-20'];
  });

  useEffect(() => {
    localStorage.setItem('campusmart_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const toggleWishlist = (productId) => {
    setWishlistIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlistIds.includes(productId);
  };

  const removeFromWishlist = (productId) => {
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
  };

  const clearWishlist = () => {
    setWishlistIds([]);
  };

  return (
    <WishlistContext.Provider value={{
      wishlistIds,
      wishlistCount: wishlistIds.length,
      toggleWishlist,
      isInWishlist,
      removeFromWishlist,
      clearWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};
