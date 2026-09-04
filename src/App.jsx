import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProductProvider } from './context/ProductContext';
import { WishlistProvider } from './context/WishlistContext';
import { ChatProvider } from './context/ChatContext';
import { NotificationProvider } from './context/NotificationContext';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { MarketplacePage } from './pages/MarketplacePage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { SellItemPage } from './pages/SellItemPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { MyListingsPage } from './pages/MyListingsPage';
import { WishlistPage } from './pages/WishlistPage';
import { MessagesPage } from './pages/MessagesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

// Scroll to Top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ProductProvider>
          <WishlistProvider>
            <ChatProvider>
              <NotificationProvider>
                <Router>
                  <ScrollToTop />
                  <div className="app-container">
                    <Navbar />
                    <main className="main-content">
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/marketplace" element={<MarketplacePage />} />
                        <Route path="/product/:id" element={<ProductDetailsPage />} />
                        <Route path="/sell" element={<SellItemPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/admin/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/my-listings" element={<MyListingsPage />} />
                        <Route path="/wishlist" element={<WishlistPage />} />
                        <Route path="/messages" element={<MessagesPage />} />
                        <Route path="/notifications" element={<NotificationsPage />} />
                        <Route path="/admin" element={<AdminDashboardPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="*" element={<HomePage />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                </Router>
              </NotificationProvider>
            </ChatProvider>
          </WishlistProvider>
        </ProductProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
