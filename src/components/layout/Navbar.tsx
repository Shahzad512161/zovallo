import { ShoppingBag, User, Menu, X, Search, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../../data/dummyData';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems, subtotal } = useCart();
  const { user, profile, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 shadow-sm">
      {/* Header 01: Announcement Bar */}
      <div className="bg-walnut text-cream text-[10px] sm:text-[11px] py-2 text-center tracking-[0.15em] font-medium uppercase px-4 flex justify-center items-center gap-4">
        <span>Free Delivery Across UK | Cash On Delivery Available | Premium Furniture Collection</span>
        {isAdmin && (
          <Link to="/admin" className="bg-gold text-near-black px-2 py-0.5 rounded text-[9px] font-bold hover:bg-white transition-colors ml-4">
            GO TO ADMIN PANEL
          </Link>
        )}
      </div>

      {/* Header 02: Main Header */}
      <div className="bg-white border-b border-warm-beige px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Link to="/" className="flex items-center">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tighter text-near-black">
              LUXWOOD<span className="text-gold">.</span>
            </h1>
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-2xl hidden md:block">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const query = (e.currentTarget.elements.namedItem('q') as HTMLInputElement).value;
              if (query.trim()) {
                navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
              }
            }}
            className="relative group"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-a0 group-focus-within:text-gold transition-colors" />
            <input 
              name="q"
              type="text" 
              placeholder="Search for sofas, beds, dining tables..." 
              className="w-full bg-[#F5F5F2] border border-transparent rounded-full py-2.5 pl-11 pr-4 text-[13px] focus:bg-white focus:border-gold focus:ring-4 focus:ring-gold/5 outline-none transition-all placeholder:text-gray-a0/70"
            />
          </form>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center space-x-3 sm:space-x-6">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex flex-col items-end">
                <span className="text-[10px] font-bold text-near-black uppercase tracking-widest leading-none truncate max-w-[100px]">{user.displayName || 'Me'}</span>
                <button 
                  onClick={handleLogout}
                  className="text-[9px] text-walnut font-bold uppercase tracking-widest hover:text-gold transition-colors"
                >
                  Logout
                </button>
              </div>
              <div className="w-8 h-8 bg-cream border border-warm-beige rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-near-black" />
              </div>
            </div>
          ) : (
            <Link to="/auth" className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-near-black hover:text-gold transition-colors group">
              <User className="w-5 h-5" />
              <span className="hidden lg:inline">Account</span>
            </Link>
          )}
          
          <div className="w-px h-6 bg-warm-beige hidden sm:block"></div>

          <Link to="/cart" className="relative flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-near-black hover:text-gold transition-colors group">
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-white text-[9px] font-bold px-1 rounded-full min-w-[15px] h-[15px] flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="hidden lg:inline">Cart (£{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })})</span>
          </Link>

          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6 text-walnut" /> : <Menu className="w-6 h-6 text-walnut" />}
          </button>
        </div>
      </div>

      {/* Header 03: Navigation Menu Bar */}
      <div className="bg-white border-b border-warm-beige hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center space-x-8 h-12">
            {CATEGORIES.map(cat => (
              <Link 
                key={cat} 
                to={`/category/${cat.toLowerCase().replace(/ /g, '-')}`}
                className="text-[11px] font-bold text-gray-666 hover:text-near-black uppercase tracking-widest transition-colors relative group py-2"
              >
                {cat}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-warm-beige py-6 px-6 space-y-8 shadow-2xl overflow-y-auto max-h-[80vh]">
          {/* Mobile Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-a0" />
            <input 
              type="text" 
              placeholder="Search collections..." 
              className="w-full bg-cream border border-warm-beige rounded-none py-3 pl-11 pr-4 text-sm outline-none focus:border-gold"
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-gray-a0 uppercase tracking-[0.25em] border-b border-warm-beige pb-2">Collections</p>
              <div className="grid grid-cols-1 gap-1">
                {CATEGORIES.map(cat => (
                  <Link 
                    key={cat} 
                    to={`/category/${cat.toLowerCase().replace(/ /g, '-')}`}
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-medium py-2 text-near-black hover:text-gold flex justify-between items-center group"
                  >
                    {cat}
                    <span className="text-gray-a0 group-hover:text-gold">→</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-warm-beige">
              {user ? (
                <div className="col-span-1 bg-near-black text-white py-3 text-[11px] font-bold uppercase tracking-widest text-center flex items-center justify-center gap-2 cursor-pointer" onClick={handleLogout}>
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </div>
              ) : (
                <Link to="/auth" onClick={() => setIsOpen(false)} className="bg-near-black text-white py-3 text-[11px] font-bold uppercase tracking-widest text-center">Account</Link>
              )}
              <Link to="/cart" onClick={() => setIsOpen(false)} className="bg-warm-beige text-near-black py-3 text-[11px] font-bold uppercase tracking-widest text-center">Cart ({totalItems})</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
