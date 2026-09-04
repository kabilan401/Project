import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS } from '../data/mockData';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    // Clear any legacy mock items from browser local storage to guarantee a fresh website
    const hasReset = localStorage.getItem('campusmart_fresh_reset_v2');
    if (!hasReset) {
      localStorage.removeItem('campusmart_products');
      localStorage.removeItem('campusmart_wishlist');
      localStorage.removeItem('campusmart_chats');
      localStorage.removeItem('campusmart_notifications');
      localStorage.setItem('campusmart_fresh_reset_v2', 'true');
      return [];
    }
    const saved = localStorage.getItem('campusmart_products');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('campusmart_products', JSON.stringify(products));
  }, [products]);

  const addProduct = (newProdData, currentUser) => {
    const newId = 'prod-' + Date.now();
    const newProduct = {
      id: newId,
      name: newProdData.name,
      price: Number(newProdData.price),
      originalPrice: newProdData.originalPrice ? Number(newProdData.originalPrice) : Math.round(Number(newProdData.price) * 1.8),
      category: newProdData.category,
      condition: newProdData.condition,
      description: newProdData.description,
      images: newProdData.images && newProdData.images.length > 0 ? newProdData.images : [
        'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80'
      ],
      seller: {
        id: currentUser?.id || 'user-' + Date.now(),
        name: currentUser?.name || 'Student User',
        avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        rating: currentUser?.rating || 5.0,
        reviewsCount: currentUser?.reviewsCount || 0,
        college: newProdData.college || currentUser?.college || 'University Campus',
        department: newProdData.department || currentUser?.department || 'General',
        year: currentUser?.year || '1st Year',
        phone: currentUser?.phone || '+91 98765 43210',
        email: currentUser?.email || 'student@college.edu'
      },
      college: newProdData.college || currentUser?.college || 'University Campus',
      location: newProdData.location || 'Campus Hostel',
      department: newProdData.department || 'General',
      postedDate: 'Just now',
      createdAt: new Date().toISOString(),
      status: 'Active',
      views: 1,
      featured: false,
      popular: false
    };

    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const markAsSold = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'Sold' } : p))
    );
  };

  const markAsActive = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'Active' } : p))
    );
  };

  const clearAllProducts = () => {
    setProducts([]);
    localStorage.removeItem('campusmart_products');
  };

  const getProductById = (id) => {
    return products.find((p) => p.id === id);
  };

  return (
    <ProductContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      markAsSold,
      markAsActive,
      clearAllProducts,
      getProductById
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
};
