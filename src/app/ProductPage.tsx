import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Heart, Share2, Truck, ShieldCheck, RotateCcw, Star, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { productApi } from '../services/productApi';
import { Product } from '../types';
import { formatCurrency } from '../lib/utils';
import { LoadingSpinner } from '../components/ui/Loading';
import { SEO } from '../components/SEO';

export default function ProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      // Try to fetch product by ID first
      let productData = await productApi.getById(productId!);
      
      // If not found by ID, try to fetch by slug
      if (!productData) {
        productData = await productApi.getProductBySlug(productId!);
      }
      
      if (productData) {
        setProduct(productData);
      } else {
        console.error('Product not found:', productId);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      // Optional: Show success message
    }
  };

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    if (type === 'increase') {
      setQuantity(prev => Math.min(prev + 1, product?.stock || 10));
    } else {
      setQuantity(prev => Math.max(prev - 1, 1));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <LoadingSpinner />
        <span className="ml-3 text-[10px] font-bold uppercase tracking-widest text-gold">Loading Masterpiece...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-cream rounded-full mb-4">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-display text-near-black">Product Not Found</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          The product you're looking for doesn't exist or has been removed from our collection.
        </p>
        <Link 
          to="/shop" 
          className="inline-block bg-near-black text-white px-8 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-gold transition-colors"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={product.title}
        description={product.description.substring(0, 160)}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-gold transition-colors">Shop</Link>
            <span>/</span>
            <Link to={`/category/${product.category.toLowerCase().replace(/ /g, '-')}`} className="hover:text-gold transition-colors">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-gold line-clamp-1">{product.title}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-cream border border-warm-beige overflow-hidden">
              <img 
                src={product.images[selectedImage]} 
                alt={product.title} 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 flex-shrink-0 bg-cream border transition-all ${
                      selectedImage === idx ? 'border-gold ring-2 ring-gold/20' : 'border-warm-beige hover:border-gold'
                    }`}
                  >
                    <img src={img} alt={`${product.title} view ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-walnut bg-cream px-3 py-1">
                  {product.category}
                </span>
                {product.featured && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gold border border-gold px-3 py-1">
                    Featured
                  </span>
                )}
                {product.stock > 0 ? (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-mint-700 bg-mint-50 px-3 py-1">
                    In Stock ({product.stock})
                  </span>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-red-500 bg-red-50 px-3 py-1">
                    Out of Stock
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-display text-near-black tracking-tight">
                {product.title}
              </h1>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                  {product.reviews?.length || 0} Reviews
                </span>
              </div>
              
              <p className="text-3xl font-light text-near-black">
                {formatCurrency(product.price)}
              </p>
              
              <p className="text-gray-666 leading-relaxed border-t border-warm-beige pt-6">
                {product.description}
              </p>
            </div>

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="space-y-4">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-walnut">Specifications</h3>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex border-b border-warm-beige pb-2">
                      <span className="w-1/3 font-bold text-near-black">{key}</span>
                      <span className="w-2/3 text-gray-666">{value as string}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="flex items-center border border-warm-beige h-12">
                  <button 
                    onClick={() => handleQuantityChange('decrease')}
                    disabled={quantity <= 1}
                    className="w-12 h-full flex items-center justify-center hover:bg-cream transition-colors disabled:opacity-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-16 text-center text-sm font-bold">{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange('increase')}
                    disabled={quantity >= (product.stock || 10)}
                    className="w-12 h-full flex items-center justify-center hover:bg-cream transition-colors disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-near-black text-white py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
                
                <button className="w-12 h-12 border border-warm-beige flex items-center justify-center hover:bg-cream transition-colors group">
                  <Heart className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                </button>
                <button className="w-12 h-12 border border-warm-beige flex items-center justify-center hover:bg-cream transition-colors group">
                  <Share2 className="w-5 h-5 text-gray-400 group-hover:text-gold transition-colors" />
                </button>
              </div>

              {/* Delivery Info */}
              <div className="space-y-4 p-6 bg-cream/30 border border-warm-beige">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-gold" />
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-near-black">Free UK Delivery</p>
                    <p className="text-[10px] text-gray-500">Estimated delivery: 3-5 business days</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-gold" />
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-near-black">Secure Checkout</p>
                    <p className="text-[10px] text-gray-500">Cash on Delivery available</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-gold" />
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-near-black">14-Day Returns</p>
                    <p className="text-[10px] text-gray-500">Hassle-free returns policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="mt-20 pt-12 border-t border-warm-beige">
            <h3 className="text-xl font-display text-near-black mb-8">Customer Reviews</h3>
            <div className="space-y-6">
              {product.reviews.map((review) => (
                <div key={review.id} className="border-b border-warm-beige pb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-bold text-near-black">{review.userName}</p>
                      <p className="text-[10px] text-gray-400">{review.date}</p>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`w-3 h-3 ${star <= review.rating ? 'fill-gold text-gold' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-666">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}