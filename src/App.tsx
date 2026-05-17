/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import HomePage from './app/HomePage';
import ShopPage from './app/ShopPage';

// Placeholder components for future implementation
const Placeholder = ({ title }: { title: string }) => (
  <div className="min-h-[60vh] flex items-center justify-center pt-20">
    <h2 className="text-4xl font-display text-walnut uppercase tracking-widest">{title} Coming Soon</h2>
  </div>
);

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-40">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/category/:categoryId" element={<ShopPage />} />
            <Route path="/product/:productId" element={<Placeholder title="Product Detail" />} />
            <Route path="/cart" element={<Placeholder title="Your Cart" />} />
            <Route path="/auth" element={<Placeholder title="Authentication" />} />
            <Route path="/checkout" element={<Placeholder title="Checkout" />} />
            <Route path="/admin" element={<Placeholder title="Admin Panel" />} />
            <Route path="/about" element={<Placeholder title="Our Story" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
