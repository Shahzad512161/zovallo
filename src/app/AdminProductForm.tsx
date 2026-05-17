import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  X, 
  Image as ImageIcon,
  Tag,
  Info,
  Layers,
  ChevronRight
} from 'lucide-react';
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp, getDocs, orderBy, query } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { Product, Category } from '../types';

export default function AdminProductForm() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!productId;

  const [loading, setLoading] = useState(isEdit);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: number]: number }>({});
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    slug: '',
    description: '',
    price: 0,
    category: '',
    images: [''],
    stock: 0,
    specifications: {
      'Material': '',
      'Dimensions': '',
      'Assembly': 'No assembly required'
    },
    featured: false
  });

  useEffect(() => {
    async function fetchData() {
      // Fetch categories
      const catsSnap = await getDocs(query(collection(db, 'categories'), orderBy('name', 'asc')));
      setCategories(catsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));

      if (isEdit) {
        const docRef = doc(db, 'products', productId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData(docSnap.data() as Product);
        } else {
          alert('Product not found');
          navigate('/admin/products');
        }
        setLoading(false);
      }
    }
    fetchData();
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSpecChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...(prev.specifications || {}),
        [key]: value
      }
    }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...(formData.images || [])];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleFileUpload = async (index: number, file: File) => {
    if (!file) return;

    const storageRef = ref(storage, `products/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(prev => ({ ...prev, [index]: progress }));
      }, 
      (error) => {
        console.error("Upload error:", error);
        alert("Failed to upload image");
      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          handleImageChange(index, downloadURL);
          setUploadProgress(prev => {
            const newState = { ...prev };
            delete newState[index];
            return newState;
          });
        });
      }
    );
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, images: [...(prev.images || []), ''] }));
  };

  const removeImageField = (index: number) => {
    const newImages = (formData.images || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const productData = {
        ...formData,
        updatedAt: serverTimestamp(),
      };

      if (isEdit) {
        await setDoc(doc(db, 'products', productId), productData, { merge: true });
      } else {
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: serverTimestamp()
        });
      }

      navigate('/admin/products');
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-sm font-bold uppercase tracking-widest text-gold">Syncing Specifications...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="flex items-center justify-between border-b border-warm-beige pb-8">
        <div className="flex items-center gap-6">
          <Link to="/admin/products" className="p-3 bg-white border border-warm-beige hover:bg-gold transition-colors block">
            <ArrowLeft className="w-5 h-5 text-near-black" />
          </Link>
          <div>
            <h1 className="text-3xl font-display text-near-black uppercase tracking-tight">
              {isEdit ? 'Curate Artpiece' : 'Introduce Masterpiece'}
            </h1>
            <p className="text-gray-400 text-sm mt-1">Refining the physical essence of your collection.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Admin <ChevronRight className="w-3 h-3" /> Inventory <ChevronRight className="w-3 h-3" /> {isEdit ? 'Edit' : 'New'}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Core Identity */}
          <section className="bg-white border border-warm-beige p-10 space-y-8">
            <div className="flex items-center gap-3 border-l-4 border-gold pl-4">
              <Info className="w-5 h-5 text-gold" />
              <h2 className="text-lg font-display text-near-black uppercase">Core Identity</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut">Master Title</label>
                <input 
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-cream border border-warm-beige py-4 px-6 text-base font-display focus:border-gold outline-none"
                  placeholder="e.g. Royal Oak Dining Table"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-walnut">Internal Slug</label>
                  <input 
                    required
                    name="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                    className="w-full bg-cream border border-warm-beige py-3 px-4 text-sm font-mono focus:border-gold outline-none"
                    placeholder="royal-oak-table"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-walnut">Collection Hierarchy</label>
                  <select 
                    required
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-cream border border-warm-beige py-3 px-4 text-sm focus:border-gold outline-none appearance-none"
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut">Physical Narrative</label>
                <textarea 
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  className="w-full bg-cream border border-warm-beige py-4 px-6 text-sm leading-relaxed focus:border-gold outline-none resize-none"
                  placeholder="Describe the craftsmanship, material, and soul of this piece..."
                />
              </div>
            </div>
          </section>

          {/* Visual Assets */}
          <section className="bg-white border border-warm-beige p-10 space-y-8">
            <div className="flex items-center gap-3 border-l-4 border-gold pl-4">
              <ImageIcon className="w-5 h-5 text-gold" />
              <h2 className="text-lg font-display text-near-black uppercase">Visual Assets</h2>
            </div>
            
            <div className="space-y-6">
              {formData.images?.map((img, idx) => (
                <div key={idx} className="p-6 bg-cream/50 border border-warm-beige space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-walnut">Perspective {idx + 1}</label>
                    {formData.images!.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeImageField(idx)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-[8px] font-bold uppercase text-gray-400">Direct URL</span>
                      <input 
                        value={img}
                        onChange={(e) => handleImageChange(idx, e.target.value)}
                        className="w-full bg-white border border-warm-beige py-2 px-4 text-xs focus:border-gold outline-none"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <span className="text-[8px] font-bold uppercase text-gray-400">Upload Image</span>
                      <div className="relative">
                        <input 
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleFileUpload(idx, e.target.files[0])}
                          className="hidden"
                          id={`file-upload-${idx}`}
                        />
                        <label 
                          htmlFor={`file-upload-${idx}`}
                          className="w-full bg-white border border-warm-beige py-2 px-4 text-[10px] font-bold uppercase tracking-widest text-near-black hover:bg-gold hover:text-white transition-all transition-colors cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Plus className="w-3 h-3" /> Choose File
                        </label>
                      </div>
                    </div>
                  </div>

                  {uploadProgress[idx] !== undefined && (
                    <div className="w-full h-1 bg-warm-beige rounded-full overflow-hidden mt-2">
                      <div 
                        className="h-full bg-gold transition-all duration-300"
                        style={{ width: `${uploadProgress[idx]}%` }}
                      />
                    </div>
                  )}

                  {img && (
                    <div className="w-24 h-24 border border-warm-beige relative group">
                      <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-near-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <button 
                type="button" 
                onClick={addImageField}
                className="w-full border-2 border-dashed border-warm-beige py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:border-gold hover:text-gold transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Perspective Angle
              </button>
            </div>
          </section>

          {/* Precise Specifications */}
          <section className="bg-white border border-warm-beige p-10 space-y-8">
            <div className="flex items-center gap-3 border-l-4 border-gold pl-4">
              <Layers className="w-5 h-5 text-gold" />
              <h2 className="text-lg font-display text-near-black uppercase">Precise Specifications</h2>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Object.entries(formData.specifications || {}).map(([key, value]) => (
                  <div key={key} className="space-y-1 relative group">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-walnut">{key}</label>
                      <button 
                        type="button" 
                        onClick={() => {
                          const newSpecs = { ...formData.specifications };
                          delete (newSpecs as any)[key];
                          setFormData(prev => ({ ...prev, specifications: newSpecs }));
                        }}
                        className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <input 
                      value={value as string}
                      onChange={(e) => handleSpecChange(key, e.target.value)}
                      className="w-full bg-cream border border-warm-beige py-3 px-4 text-sm focus:border-gold outline-none"
                    />
                  </div>
                ))}
              </div>
              
              <div className="flex gap-4 p-6 bg-cream/30 border border-warm-beige border-dashed">
                <input 
                  type="text" 
                  id="new-spec-key"
                  placeholder="Spec Name (e.g. Weight)"
                  className="flex-1 bg-white border border-warm-beige py-2 px-4 text-xs outline-none focus:border-gold"
                />
                <button 
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('new-spec-key') as HTMLInputElement;
                    if (input.value) {
                      handleSpecChange(input.value, '');
                      input.value = '';
                    }
                  }}
                  className="bg-near-black text-white px-6 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-gold transition-colors"
                >
                  Add Spec
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Commercial Intel */}
        <aside className="space-y-8">
          <div className="bg-near-black text-white p-10 space-y-8 sticky top-44">
            <div className="flex items-center gap-3 border-l-4 border-gold pl-4">
              <Tag className="w-5 h-5 text-gold" />
              <h2 className="text-lg font-display uppercase">Commercial Intel</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">List Price (GBP)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold font-bold">£</span>
                  <input 
                    required
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 py-4 pl-10 pr-6 text-xl font-display outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Inventory volume</label>
                <input 
                  required
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 py-4 px-6 text-xl font-display outline-none focus:border-gold"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Feature Highlight</span>
                <button 
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, featured: !prev.featured }))}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${formData.featured ? 'bg-gold' : 'bg-gray-600'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${formData.featured ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gold text-near-black py-5 text-[11px] font-bold uppercase tracking-widest hover:bg-white transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? 'Authenticating...' : (isEdit ? 'Archive Changes' : 'Publish Entry')}
              </button>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
