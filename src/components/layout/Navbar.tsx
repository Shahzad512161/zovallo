import { ShoppingBag, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../../data/dummyData';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50">
      {/* Announcement Bar */}
      <div className="bg-walnut text-cream text-[10px] sm:text-[11px] py-2 text-center tracking-[0.1em] font-medium uppercase">
        Free White Glove Delivery on Orders Over £1,500 • Next Day Dispatch
      </div>

      <div className="bg-white border-b border-warm-beige px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
        <div className="flex items-center space-x-4 sm:space-x-8">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tighter text-near-black">
              LUXWOOD<span className="text-gold">.</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6 text-[12px] font-medium text-gray-666 uppercase tracking-wide">
            <Link to="/" className="text-near-black border-b border-gold pt-0.5">Home</Link>
            <Link to="/shop" className="hover:text-near-black transition-colors pt-0.5">Collections</Link>
            <Link to="/about" className="hover:text-near-black transition-colors pt-0.5">Our Story</Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4 sm:space-x-6 text-[12px] sm:text-[13px] font-semibold">
          <div className="hidden md:block relative">
            <input 
              type="text" 
              placeholder="Search collections..." 
              className="bg-[#F5F5F2] border-none rounded-sm py-2 pl-4 pr-4 text-[12px] w-40 lg:w-56 focus:ring-1 focus:ring-gold outline-none"
            />
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link to="/auth" className="hover:text-gold transition-colors hidden sm:inline">
              Sign In
            </Link>
            <div className="hidden sm:block w-px h-4 bg-warm-beige"></div>
            <Link to="/cart" className="relative flex items-center space-x-1 hover:text-gold transition-colors">
              <span className="bg-olive text-white text-[9px] absolute -top-2 -right-2 px-1 rounded-full min-w-[14px] text-center">0</span>
              <span className="uppercase tracking-wider">Cart (£0.00)</span>
            </Link>
            <button className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-5 h-5 text-walnut" /> : <Menu className="w-5 h-5 text-walnut" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-warm-beige py-6 px-6 space-y-6 shadow-xl">
          <div className="space-y-4">
            <Link to="/" onClick={() => setIsOpen(false)} className="block text-sm font-bold uppercase tracking-widest text-walnut border-b border-warm-beige pb-2">Home</Link>
            <Link to="/shop" onClick={() => setIsOpen(false)} className="block text-sm font-bold uppercase tracking-widest text-walnut border-b border-warm-beige pb-2">Collections</Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="block text-sm font-bold uppercase tracking-widest text-walnut border-b border-warm-beige pb-2">Our Story</Link>
            <Link to="/auth" onClick={() => setIsOpen(false)} className="block text-sm font-bold uppercase tracking-widest text-walnut border-b border-warm-beige pb-2">Sign In</Link>
          </div>
          
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-gray-a0 uppercase tracking-[0.2em]">Categories</p>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.slice(0, 6).map(cat => (
                <Link 
                  key={cat} 
                  to={`/category/${cat.toLowerCase().replace(/ /g, '-')}`}
                  onClick={() => setIsOpen(false)}
                  className="text-xs py-2 px-3 bg-cream border border-warm-beige text-walnut"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
