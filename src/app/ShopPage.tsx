import { ProductCard } from '../components/ui/ProductCard';
import { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, PackageOpen } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';
import { SEO } from '../components/SEO';
import { productApi } from '../services/productApi';
import { categoryApi } from '../services/categoryApi';
import { Product, Category } from '../types';
import { LoadingSpinner } from '../components/ui/Loading';

export default function ShopPage() {
  const { categoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortBy, setSortBy] = useState('latest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch real data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        productApi.getAll(),
        categoryApi.getAllCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Sync search from URL
  useEffect(() => {
    const query = searchParams.get('search');
    if (query !== null) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  // Sync category from URL
  useEffect(() => {
    if (categoryId && categories.length > 0) {
      const matchedCategory = categories.find(c => c.slug === categoryId);
      if (matchedCategory) {
        setSelectedCategory(matchedCategory.name);
      } else {
        const formattedCategory = categoryId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        setSelectedCategory(formattedCategory);
      }
    } else {
      setSelectedCategory('All');
    }
  }, [categoryId, categories]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Search Filter
    if (searchQuery) {
      result = result.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price Range Filter
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sorting
    switch (sortBy) {
      case 'low-to-high':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'high-to-low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'latest':
        result.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(0);
          const dateB = b.createdAt?.toDate?.() || new Date(0);
          return dateB.getTime() - dateA.getTime();
        });
        break;
    }

    return result;
  }, [products, selectedCategory, searchQuery, priceRange, sortBy]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <LoadingSpinner />
        <span className="ml-3 text-[10px] font-bold uppercase tracking-widest text-gold">Loading Collection...</span>
      </div>
    );
  }

  const categoryNames = ['All', ...categories.map(c => c.name)];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <SEO 
        title={selectedCategory === 'All' ? 'Shop All' : `Shop ${selectedCategory}`}
        description={`Explore our curated selection of ${selectedCategory.toLowerCase()} pieces. Premium furniture designed for comfort and crafted to last.`}
      />
      {/* Page Header */}
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl md:text-5xl font-display text-near-black tracking-tight">
          {selectedCategory === 'All' ? 'Shop All Collections' : selectedCategory}
        </h1>
        <p className="text-gray-666 font-light max-w-2xl mx-auto">
          Discover our curated selection of premium furniture pieces, designed for comfort and crafted to last.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar (Desktop) */}
        <aside className="hidden lg:block w-64 space-y-8 flex-shrink-0">
          <div className="space-y-6">
            {/* Search */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-walnut">Search</h4>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-a0" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Keyword..."
                  className="w-full bg-cream border border-warm-beige py-2 pl-10 pr-4 text-xs outline-none focus:border-gold"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-walnut">Categories</h4>
              <div className="space-y-1">
                {categoryNames.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`block w-full text-left text-[12px] py-1.5 px-3 transition-colors ${selectedCategory === cat ? 'bg-near-black text-white' : 'hover:bg-cream text-gray-666'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-walnut">Price Range</h4>
              <div className="space-y-4">
                <input 
                  type="range" 
                  min="0" 
                  max="5000" 
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full accent-walnut"
                />
                <div className="flex justify-between text-[11px] font-bold text-gray-666">
                  <span>£0</span>
                  <span>£{priceRange[1]}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-white border-y border-warm-beige py-4 px-4 gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button 
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 border border-warm-beige px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-near-black"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
              <p className="text-[11px] font-bold text-gray-a0 uppercase tracking-widest">
                Showing {filteredProducts.length} Results
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <span className="text-[11px] font-bold text-gray-a0 uppercase tracking-widest hidden sm:inline">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-cream border border-warm-beige px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-near-black outline-none focus:border-gold cursor-pointer"
              >
                <option value="latest">Latest Arrivals</option>
                <option value="low-to-high">Price: Low to High</option>
                <option value="high-to-low">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
              />
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="py-20 border border-dashed border-warm-beige">
              <EmptyState 
                icon={PackageOpen}
                title="No matches found"
                description="We couldn't find any products matching your current filters. Try adjusting your search or clearing the filters."
                actionText="Clear all filters"
                onAction={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                  setPriceRange([0, 5000]);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute inset-y-0 left-0 w-[280px] bg-white shadow-2xl p-6 space-y-8 overflow-y-auto">
            <div className="flex justify-between items-center border-b border-warm-beige pb-4">
              <h3 className="text-sm font-bold uppercase tracking-widest">Filter & Sort</h3>
              <button onClick={() => setShowMobileFilters(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-8">
              {/* Categories */}
              <div className="space-y-4">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-walnut">Categories</h4>
                <div className="grid grid-cols-1 gap-2">
                  {categoryNames.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setShowMobileFilters(false);
                      }}
                      className={`text-left text-[12px] py-2 px-3 border border-warm-beige ${selectedCategory === cat ? 'bg-near-black text-white' : 'bg-cream text-gray-666'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-4">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-walnut">Max Price</h4>
                <input 
                  type="range" 
                  min="0" 
                  max="5000" 
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full accent-walnut"
                />
                <div className="flex justify-between text-[11px] font-bold text-gray-666">
                  <span>£0</span>
                  <span>£{priceRange[1]}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowMobileFilters(false)}
              className="w-full bg-near-black text-white py-4 text-[11px] font-bold uppercase tracking-widest"
            >
              Show Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}