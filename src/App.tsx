/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import HomePage from './app/HomePage';
import ShopPage from './app/ShopPage';
import ProductPage from './app/ProductPage';
import CartPage from './app/CartPage';
import LoginPage from './app/LoginPage';
import RegisterPage from './app/RegisterPage';
import CheckoutPage from './app/CheckoutPage';
import AdminDashboard from './app/AdminDashboard';
import AdminCategories from './app/AdminCategories';
import AdminProducts from './app/AdminProducts';
import AdminOrders from './app/AdminOrders';
import AdminUsers from './app/AdminUsers';
import AdminProductForm from './app/AdminProductForm';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminLayout } from './components/admin/AdminLayout';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Admin Route Component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, loading } = useAuth();

  if (loading) return null;

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <AdminLayout>{children}</AdminLayout>;
};

// Placeholder components for future implementation
const Placeholder = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center min-h-[400px] bg-cream/30 border-2 border-dashed border-warm-beige m-8">
    <h2 className="text-xl font-display text-gray-400 uppercase tracking-[0.2em]">{title} Coming Soon</h2>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Routes>
              {/* Customer Routes Area */}
              <Route path="*" element={
                <>
                  <Navbar />
                  <main className="flex-grow pt-40">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/shop" element={<ShopPage />} />
                      <Route path="/category/:categoryId" element={<ShopPage />} />
                      <Route path="/product/:productId" element={<ProductPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/auth" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/checkout" element={
                        <ProtectedRoute>
                          <CheckoutPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/about" element={<Placeholder title="Our Story" />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                  <Footer />
                </>
              } />

              {/* Admin Routes Area */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="/admin/categories" element={
                <AdminRoute>
                  <AdminCategories />
                </AdminRoute>
              } />
              <Route path="/admin/products" element={
                <AdminRoute>
                  <AdminProducts />
                </AdminRoute>
              } />
              <Route path="/admin/products/new" element={
                <AdminRoute>
                  <AdminProductForm />
                </AdminRoute>
              } />
              <Route path="/admin/products/edit/:productId" element={
                <AdminRoute>
                  <AdminProductForm />
                </AdminRoute>
              } />
              <Route path="/admin/orders" element={
                <AdminRoute>
                  <AdminOrders />
                </AdminRoute>
              } />
              <Route path="/admin/customers" element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              } />
              <Route path="/admin/settings" element={
                <AdminRoute>
                  <Placeholder title="Admin Settings" />
                </AdminRoute>
              } />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
