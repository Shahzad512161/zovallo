import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Filter,
  Layers,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Tag
} from 'lucide-react';
import { collection, getDocs, deleteDoc, doc, query, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { formatCurrency } from '../lib/utils';
import { Product } from '../types';
import { Link } from 'react-router-dom';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display text-near-black uppercase tracking-tight">Product Inventory</h1>
          <p className="text-gray-400 text-sm mt-1">Total volume: {products.length} active pieces</p>
        </div>
        <Link 
          to="/admin/products/new"
          className="bg-near-black text-white px-6 py-4 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gold transition-all duration-300 shadow-lg"
        >
          <Plus className="w-4 h-4" /> Add Masterpiece
        </Link>
      </div>

      {/* Control Bar */}
      <div className="bg-white border border-warm-beige p-6 flex flex-col lg:flex-row gap-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by title, category, or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-cream border-none py-3 pl-12 pr-4 text-sm focus:ring-1 focus:ring-gold"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-walnut" />
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-cream border-none py-3 px-6 text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-1 focus:ring-gold"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button className="bg-white border border-warm-beige px-6 py-3 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-cream">
            <Layers className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white border border-warm-beige overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-cream/50">
                <th className="px-8 py-5 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Product</th>
                <th className="px-8 py-5 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</th>
                <th className="px-8 py-5 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Pricing</th>
                <th className="px-8 py-5 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Stock Status</th>
                <th className="px-8 py-5 text-right text-[10px] font-bold uppercase tracking-widest text-gray-400">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-beige">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-gold">Synchronizing Inventory...</td>
                </tr>
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-gray-400 text-sm">No products matched your search criteria.</td>
                </tr>
              ) : (
                paginatedProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-cream/20 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-cream border border-warm-beige overflow-hidden">
                          <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-near-black mb-0.5 line-clamp-1">{p.title}</span>
                          <span className="text-[10px] font-mono text-gray-400">SKU: {p.id.slice(0, 8).toUpperCase()}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <Tag className="w-3 h-3 text-gold" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-walnut">{p.category}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-light text-near-black">{formatCurrency(p.price)}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1.5">
                        <div className="w-24 h-1 bg-cream rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${p.stock < 5 ? 'bg-red-500' : 'bg-mint-700'}`} 
                            style={{ width: `${Math.min((p.stock / 20) * 100, 100)}%` }} 
                          />
                        </div>
                        <span className={`text-[10px] font-bold uppercase ${p.stock < 5 ? 'text-red-500' : 'text-mint-700'}`}>
                          {p.stock} Available
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          to={`/product/${p.id}`} 
                          target="_blank"
                          className="p-2 text-gray-400 hover:text-gold transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link 
                          to={`/admin/products/edit/${p.id}`}
                          className="p-2 text-near-black hover:text-gold transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(p.id)}
                          className="p-2 text-near-black hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Info */}
        <div className="p-8 bg-cream/30 border-t border-warm-beige flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Showing {Math.min(filteredProducts.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(filteredProducts.length, currentPage * itemsPerPage)} of {filteredProducts.length} masterpieces
          </p>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 bg-white border border-warm-beige text-gray-400 disabled:opacity-50 hover:bg-cream transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center px-4 text-[10px] font-bold uppercase tracking-widest border border-warm-beige bg-white">
              Page {currentPage} of {totalPages || 1}
            </div>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 bg-white border border-warm-beige text-near-black hover:bg-gold transition-colors disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
