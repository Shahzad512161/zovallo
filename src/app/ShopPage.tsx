import { PRODUCTS, CATEGORIES } from '../data/dummyData';
import { ProductCard } from '../components/ui/ProductCard';
import { useState } from 'react';

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredProducts = selectedCategory === 'All' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-display text-near-black tracking-tight">Shop All Collections</h1>
        <p className="text-gray-666 font-light">Fine furniture for every corner of your home.</p>
      </div>

      {/* category filter bar */}
      <div className="flex flex-wrap justify-center gap-4 py-8 border-y border-warm-beige">
        <button 
          onClick={() => setSelectedCategory('All')}
          className={`px-8 py-2 text-[11px] font-bold tracking-widest uppercase transition-all duration-300 ${selectedCategory === 'All' ? 'bg-near-black text-white shadow-lg' : 'text-near-black hover:bg-cream border border-warm-beige'}`}
        >
          ALL
        </button>
        {CATEGORIES.map(cat => (
          <button 
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-8 py-2 text-[11px] font-bold tracking-widest uppercase transition-all duration-300 ${selectedCategory === cat ? 'bg-near-black text-white shadow-lg' : 'text-near-black hover:bg-cream border border-warm-beige'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-20 grayscale opacity-50 space-y-4">
          <p className="text-2xl font-display text-walnut">Coming Soon</p>
          <p className="text-sm">We're updating this collection with new premium pieces.</p>
        </div>
      )}
    </div>
  );
}
