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
  X,
  Upload,
  AlertCircle
} from 'lucide-react';
import { Category } from '../types';
import { categoryApi } from '../services/categoryApi';
import { Skeleton } from '../components/ui/Loading';

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Partial<Category> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryApi.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Convert file to Base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Compress image before converting
  const compressImage = (file: File, maxWidth: number = 800): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const reader2 = new FileReader();
              reader2.readAsDataURL(blob);
              reader2.onload = () => resolve(reader2.result as string);
              reader2.onerror = reject;
            } else {
              reject(new Error('Failed to compress image'));
            }
          }, file.type, 0.7);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 500KB)
    if (file.size > 500 * 1024) {
      alert('Image must be less than 500KB. Please compress your image.');
      return;
    }

    setUploadingImage(true);
    try {
      // Compress and convert to Base64
      const base64String = await compressImage(file, 600);
      setImagePreview(base64String);
      setCurrentCategory(prev => ({ ...prev, image: base64String }));
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Failed to process image");
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    setCurrentCategory(prev => ({ ...prev, image: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCategory?.name || !currentCategory?.slug) return;

    setIsSubmitting(true);
    try {
      if (currentCategory.id) {
        await categoryApi.update(currentCategory.id, currentCategory);
      } else {
        await categoryApi.create(currentCategory as Omit<Category, 'id'>);
      }
      setIsModalOpen(false);
      setImagePreview('');
      await fetchCategories();
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
      await categoryApi.delete(id);
      await fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category");
    }
  };

  const handleEdit = (category: Category) => {
    setCurrentCategory(category);
    setImagePreview(category.image || '');
    setIsModalOpen(true);
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display text-near-black uppercase tracking-tight">Product Categories</h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">Organize your furniture boutique's collection.</p>
        </div>
        <button 
          onClick={() => {
            setCurrentCategory({});
            setImagePreview('');
            setIsModalOpen(true);
          }}
          className="bg-near-black text-white px-4 sm:px-6 py-2.5 sm:py-3 text-[10px] sm:text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gold transition-all duration-300 w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" /> Add New Category
        </button>
      </div>

      {/* Filters & Search - Responsive */}
      <div className="bg-white border border-warm-beige p-4 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-cream border-none py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-gold outline-none"
          />
        </div>
        <button className="w-full sm:w-auto bg-white border border-warm-beige px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-cream transition-colors">
          <Filter className="w-3.5 h-3.5" /> Sort A-Z
        </button>
      </div>

      {/* Categories Grid - Fully Responsive */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="bg-white border border-warm-beige group overflow-hidden">
              <Skeleton className="aspect-[4/3] w-full" />
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <Skeleton className="h-5 sm:h-6 w-3/4" />
                <Skeleton className="h-3 sm:h-4 w-1/2" />
                <div className="space-y-2">
                  <Skeleton className="h-2 sm:h-3 w-full" />
                  <Skeleton className="h-2 sm:h-3 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-12 sm:py-20 border border-dashed border-warm-beige">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 text-sm">No categories found. Create your first category!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredCategories.map((category) => (
            <div key={category.id} className="bg-white border border-warm-beige group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="aspect-[4/3] bg-cream relative overflow-hidden">
                {category.image ? (
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                    <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 mb-2" />
                    <span className="text-[8px] sm:text-[10px] uppercase font-bold">No Preview</span>
                  </div>
                )}
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-1 sm:gap-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                  <button 
                    onClick={() => handleEdit(category)}
                    className="p-1.5 sm:p-2 bg-white text-near-black hover:bg-gold hover:text-near-black transition-colors shadow-lg rounded"
                    aria-label="Edit category"
                  >
                    <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(category.id)}
                    className="p-1.5 sm:p-2 bg-near-black text-white hover:bg-red-500 transition-colors shadow-lg rounded"
                    aria-label="Delete category"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base sm:text-lg font-display text-near-black uppercase tracking-tight line-clamp-1">
                    {category.name}
                  </h3>
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300 flex-shrink-0" />
                </div>
                <p className="text-[8px] sm:text-[10px] font-mono text-walnut font-bold uppercase tracking-widest mb-3 sm:mb-4 truncate">
                  /{category.slug}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-400 line-clamp-2 leading-relaxed">
                  {category.description || 'No description provided for this collection.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal - Fully Responsive */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-3 sm:px-4">
          <div className="absolute inset-0 bg-near-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white max-w-lg w-full relative z-10 shadow-2xl border border-warm-beige p-5 sm:p-8 md:p-12 max-h-[90vh] overflow-y-auto">
            <button 
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-400 hover:text-near-black transition-colors" 
              onClick={() => setIsModalOpen(false)}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div className="mb-6 sm:mb-10">
              <h2 className="text-xl sm:text-2xl font-display text-near-black uppercase tracking-tight">
                {currentCategory?.id ? 'Edit Category' : 'New Category'}
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">Define a new curated collection.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                {/* Category Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block">Category Name</label>
                  <input 
                    required
                    value={currentCategory?.name || ''}
                    onChange={(e) => setCurrentCategory(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-cream border border-warm-beige py-2.5 sm:py-3 px-3 sm:px-4 text-sm focus:border-gold outline-none transition-colors"
                    placeholder="e.g. Sofa Sets"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block">Slug (URL Path)</label>
                  <input 
                    required
                    value={currentCategory?.slug || ''}
                    onChange={(e) => setCurrentCategory(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                    className="w-full bg-cream border border-warm-beige py-2.5 sm:py-3 px-3 sm:px-4 text-sm font-mono focus:border-gold outline-none transition-colors"
                    placeholder="e.g. sofa-sets"
                  />
                </div>

                {/* Image Upload - New Feature */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block">Category Image</label>
                  
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="relative w-full aspect-[16/9] bg-cream border border-warm-beige rounded-lg overflow-hidden">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* Upload Button */}
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="category-image-upload"
                      disabled={uploadingImage}
                    />
                    <label
                      htmlFor="category-image-upload"
                      className={`w-full border-2 border-dashed border-warm-beige py-6 sm:py-8 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:border-gold hover:text-gold transition-all flex flex-col items-center justify-center gap-3 cursor-pointer rounded-lg ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {uploadingImage ? (
                        <>
                          <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                          <span>Processing Image...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 sm:w-8 sm:h-8" />
                          <span>{imagePreview ? 'Change Image' : 'Upload Image'}</span>
                          <span className="text-[8px] text-gray-300">(Max 500KB, JPG, PNG, GIF)</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block">Description</label>
                  <textarea 
                    value={currentCategory?.description || ''}
                    onChange={(e) => setCurrentCategory(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full bg-cream border border-warm-beige py-2.5 sm:py-3 px-3 sm:px-4 text-sm focus:border-gold outline-none resize-none transition-colors"
                    placeholder="Brief description of this collection..."
                  />
                </div>
              </div>

              {/* Form Buttons - Responsive */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 border-2 border-near-black py-3 sm:py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-near-black hover:text-white transition-all duration-300"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-near-black text-white py-3 sm:py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-gold hover:text-near-black transition-all duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Collection'}
                </button>
              </div>
            </form>

            {/* Image Info Note */}
            <div className="mt-4 p-3 bg-mint-50 border border-mint-200 rounded text-[9px] text-mint-700">
              <strong className="flex items-center gap-1">💡 Tip:</strong> Images are stored directly in Firestore. Keep images under 500KB for best performance.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}