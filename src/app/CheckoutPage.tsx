import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { formatCurrency } from '../lib/utils';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  CheckCircle2, 
  ArrowLeft,
  ShoppingBag,
  MapPin,
  Phone,
  Mail,
  User,
  MessageSquare
} from 'lucide-react';

export default function CheckoutPage() {
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    country: 'United Kingdom',
    city: '',
    address: '',
    postalCode: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);

    try {
      const orderData = {
        userId: user.uid,
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        total: subtotal,
        status: 'pending',
        shippingDetails: formData,
        paymentMethod: 'COD',
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      setOrderId(docRef.id);
      setOrderComplete(true);
      clearCart();
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-32 text-center space-y-8">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-mint-50 rounded-full mb-4">
          <CheckCircle2 className="w-12 h-12 text-mint-700" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-display text-near-black">Thank You For Your Order</h1>
          <p className="text-gray-666 font-light text-lg">
            Your piece is being prepared for its new home. We'll contact you shortly for delivery confirmation.
          </p>
          <div className="bg-cream/50 p-6 rounded-lg border border-warm-beige inline-block mt-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-walnut mb-1">Order Reference</p>
            <p className="text-xl font-mono text-near-black font-bold">#{orderId?.slice(-8).toUpperCase()}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link 
            to="/shop" 
            className="bg-near-black text-white px-10 py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-gold transition-all duration-300"
          >
            Continue Shopping
          </Link>
          <Link 
            to="/" 
            className="border-2 border-near-black text-near-black px-10 py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-near-black hover:text-white transition-all duration-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center space-y-6">
        <h2 className="text-2xl font-display">No items to checkout</h2>
        <Link to="/shop" className="text-walnut underline underline-offset-4 font-bold uppercase text-xs tracking-widest">
          Go to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Checkout Form */}
        <div className="flex-1 space-y-12">
          <div className="flex items-center justify-between border-b border-warm-beige pb-6">
            <h1 className="text-3xl font-display text-near-black">Shipping Details</h1>
            <Link to="/cart" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-walnut hover:text-near-black transition-colors group">
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              Return to Cart
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-a0" />
                  <input 
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-cream border border-warm-beige py-3 pl-10 pr-4 text-sm outline-none focus:border-gold"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-a0" />
                  <input 
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-cream border border-warm-beige py-3 pl-10 pr-4 text-sm outline-none focus:border-gold"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-a0" />
                  <input 
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+44 000 000 0000"
                    className="w-full bg-cream border border-warm-beige py-3 pl-10 pr-4 text-sm outline-none focus:border-gold"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block">Country</label>
                <select 
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full bg-cream border border-warm-beige py-3 px-4 text-sm outline-none focus:border-gold"
                >
                  <option>United Kingdom</option>
                  <option>Ireland</option>
                  <option>France</option>
                  <option>Germany</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block">City</label>
                <input 
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-cream border border-warm-beige py-3 px-4 text-sm outline-none focus:border-gold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block">Postal Code</label>
                <input 
                  name="postalCode"
                  required
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full bg-cream border border-warm-beige py-3 px-4 text-sm outline-none focus:border-gold"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block">Street Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-a0" />
                  <textarea 
                    name="address"
                    required
                    rows={2}
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-cream border border-warm-beige py-3 pl-10 pr-4 text-sm outline-none focus:border-gold resize-none"
                  />
                </div>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block">Order Notes (Optional)</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-a0" />
                  <textarea 
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="E.g. Building floor, gate code, etc."
                    className="w-full bg-cream border border-warm-beige py-3 pl-10 pr-4 text-sm outline-none focus:border-gold resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-10 border-t border-warm-beige">
              <h2 className="text-xl font-display text-near-black">Payment Method</h2>
              <div className="bg-mint-50 border border-mint-200 p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-mint-700" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-near-black">Cash On Delivery (COD)</p>
                    <p className="text-xs text-mint-700">Pay when your furniture arrives at your doorstep.</p>
                  </div>
                </div>
                <div className="w-5 h-5 bg-mint-700 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-near-black text-white py-5 text-[11px] font-bold uppercase tracking-widest hover:bg-gold transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? 'Processing Order...' : 'Place Secure Order'}
              {!loading && <ShieldCheck className="w-4 h-4" />}
            </button>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <aside className="w-full lg:w-[420px]">
          <div className="bg-cream/30 border border-warm-beige p-8 sticky top-44 space-y-8">
            <h2 className="text-xl font-display text-near-black">Review Order</h2>
            
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-20 bg-white border border-warm-beige flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="text-sm font-display text-near-black line-clamp-1">{item.name}</h4>
                    <p className="text-[10px] text-gray-666 uppercase tracking-widest">{item.category}</p>
                    <div className="flex justify-between items-center pt-1">
                      <p className="text-[11px] font-bold text-gray-a0">QTY: {item.quantity}</p>
                      <p className="text-sm font-medium text-near-black">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-8 border-t border-warm-beige">
              <div className="flex justify-between text-sm">
                <span className="text-gray-666">Order Subtotal</span>
                <span className="font-medium text-near-black">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-666">Standard Delivery</span>
                <span className="text-mint-700 font-bold uppercase tracking-widest text-[10px]">Complimentary</span>
              </div>
              <div className="pt-4 border-t border-warm-beige flex justify-between items-baseline">
                <span className="text-lg font-display text-near-black">Order Total</span>
                <span className="text-2xl font-light text-walnut">{formatCurrency(subtotal)}</span>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4 text-mint-700" />
                <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-gray-a0">Dispatched within 24-48 hours</p>
              </div>
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4 text-mint-700" />
                <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-gray-a0">White glove placement included</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
