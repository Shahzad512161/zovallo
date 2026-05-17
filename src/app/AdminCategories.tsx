import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Image as ImageIcon,
  ChevronRight,
  Filter,
  X
} from 'lucide-react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Category } from '../types';

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Partial<Category> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'categories'), orderBy('name', 'asc'));
      const snapshot = await getDocs(q);
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCategory?.name || !currentCategory?.slug) return;

    setIsSubmitting(true);
    try {
      if (currentCategory.id) {
        // Update
        const docRef = doc(db, 'categories', currentCategory.id);
        await updateDoc(docRef, currentCategory);
      } else {
        // Create
        await addDoc(collection(db, 'categories'), {
          ...currentCategory,
          createdAt: new Date()
        });
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await deleteDoc(doc(db, 'categories', id));
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category");
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display text-near-black uppercase tracking-tight">Product Categories</h1>
          <p className="text-gray-400 text-sm mt-1">Organize your furniture boutique's collection.</p>
        </div>
        <button 
          onClick={() => {
            setCurrentCategory({});
            setIsModalOpen(true);
          }}
          className="bg-near-black text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gold transition-all duration-300"
        >
          <Plus className="w-4 h-4" /> Add New Category
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border border-warm-beige p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-cream border-none py-2 pl-10 pr-4 text-xs focus:ring-1 focus:ring-gold"
          />
        </div>
        <button className="w-full md:w-auto bg-white border border-warm-beige px-6 py-2 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-cream">
          <Filter className="w-3.5 h-3.5" /> Sort A-Z
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white border border-warm-beige h-64 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((category) => (
            <div key={category.id} className="bg-white border border-warm-beige group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="aspect-[4/3] bg-cream relative overflow-hidden">
                {category.image ? (
                  <img src={category.image} alt={category.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                    <ImageIcon className="w-8 h-8 mb-2" />
                    <span className="text-[10px] uppercase font-bold">No Preview</span>
                  </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <button 
                    onClick={() => {
                      setCurrentCategory(category);
                      setIsModalOpen(true);
                    }}
                    className="p-2 bg-white text-near-black hover:bg-gold hover:text-near-black transition-colors shadow-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(category.id)}
                    className="p-2 bg-near-black text-white hover:bg-red-500 transition-colors shadow-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-display text-near-black uppercase tracking-tight">{category.name}</h3>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
                <p className="text-[10px] font-mono text-walnut font-bold uppercase tracking-widest mb-4">/{category.slug}</p>
                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                  {category.description || 'No description provided for this collection.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-near-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white max-w-lg w-full relative z-10 shadow-2xl border border-warm-beige p-8 sm:p-12">
            <button className="absolute top-6 right-6 text-gray-400 hover:text-near-black" onClick={() => setIsModalOpen(false)}>
              <X className="w-6 h-6" />
            </button>
            <div className="mb-10">
              <h2 className="text-2xl font-display text-near-black uppercase tracking-tight">
                {currentCategory?.id ? 'Edit Category' : 'New Category'}
              </h2>
              <p className="text-gray-400 text-sm">Define a new curated collection.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-walnut">Category Name</label>
                  <input 
                    required
                    value={currentCategory?.name || ''}
                    onChange={(e) => setCurrentCategory(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-cream border border-warm-beige py-3 px-4 text-sm focus:border-gold outline-none"
                    placeholder="e.g. Sofa Sets"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-walnut">Slug (URL Path)</label>
                  <input 
                    required
                    value={currentCategory?.slug || ''}
                    onChange={(e) => setCurrentCategory(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                    className="w-full bg-cream border border-warm-beige py-3 px-4 text-sm font-mono focus:border-gold outline-none"
                    placeholder="e.g. sofa-sets"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-walnut">Image URL</label>
                  <input 
                    value={currentCategory?.image || ''}
                    onChange={(e) => setCurrentCategory(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full bg-cream border border-warm-beige py-3 px-4 text-sm focus:border-gold outline-none"
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-walnut">Description</label>
                  <textarea 
                    value={currentCategory?.description || ''}
                    onChange={(e) => setCurrentCategory(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full bg-cream border border-warm-beige py-3 px-4 text-sm focus:border-gold outline-none resize-none"
                    placeholder="Brief description of this collection..."
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 border-2 border-near-black py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-near-black hover:text-white transition-all duration-300"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-near-black text-white py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-gold hover:text-near-black transition-all duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
