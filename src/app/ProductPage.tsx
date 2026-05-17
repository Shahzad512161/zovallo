import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Star, Minus, Plus, Truck, ShieldCheck, RefreshCw, ShoppingBag } from 'lucide-react';
import { PRODUCTS } from '../data/dummyData';
import { ProductCard } from '../components/ui/ProductCard';
import { useCart } from '../context/CartContext';

export default function ProductPage() {
  const { addToCart } = useCart();
  const { productId } = useParams();
  const product = PRODUCTS.find(p => p.id === productId);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product?.image || '');
  const [activeTab, setActiveTab] = useState<'specs' | 'delivery' | 'reviews'>('specs');

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center pt-20 space-y-4">
        <h2 className="text-2xl font-display text-near-black">Product Not Found</h2>
        <Link to="/shop" className="text-walnut underline underline-offset-4 font-bold uppercase text-xs tracking-widest">
          Back to Shop
        </Link>
      </div>
    );
  }

  // Ensure activeImage is set if it hasn't been yet (e.g. on mount or product change)
  useMemo(() => {
    setActiveImage(product.image);
  }, [product.id]);

  const gallery = product.images || [product.image];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-gray-a0">
        <Link to="/" className="hover:text-near-black transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/shop" className="hover:text-near-black transition-colors">Shop</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to={`/category/${product.category.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-near-black transition-colors">{product.category}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-near-black">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Left: Images */}
        <div className="space-y-6">
          <div className="aspect-square bg-cream overflow-hidden">
            <img 
              src={activeImage} 
              alt={product.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {gallery.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`aspect-square bg-cream overflow-hidden border-2 transition-all ${activeImage === img ? 'border-walnut' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
               <span className="bg-light-mint px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-mint-700">
                {product.category}
              </span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3 h-3 ${i < 4 ? 'fill-gold text-gold' : 'text-warm-beige'}`} />
                ))}
                <span className="text-[10px] font-bold text-gray-a0 ml-1">(12 Reviews)</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-display text-near-black leading-tight tracking-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
              <p className="text-2xl font-light text-walnut">£{product.price.toLocaleString()}</p>
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-mint-700 bg-mint-50 px-2 py-0.5 rounded-full">
                <div className="w-1.5 h-1.5 bg-mint-400 rounded-full animate-pulse" />
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-gray-666 font-light leading-relaxed">
              {product.description}
            </p>
            {product.features && (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-[12px] text-near-black font-medium">
                    <span className="w-1.5 h-1.5 bg-mint-400 rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <div className="flex items-center border border-warm-beige h-12">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-12 h-full flex items-center justify-center hover:bg-cream transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 h-full flex items-center justify-center text-sm font-bold border-x border-warm-beige bg-white">
                {quantity}
              </span>
              <button 
                onClick={() => setQuantity(q => q + 1)}
                className="w-12 h-full flex items-center justify-center hover:bg-cream transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button 
              onClick={() => product && addToCart(product, quantity)}
              className="flex-1 w-full sm:w-auto bg-near-black text-white h-12 text-[11px] font-bold uppercase tracking-widest hover:bg-gold transition-all duration-300 flex items-center justify-center gap-2 px-8"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Cart
            </button>
            <button className="flex-1 w-full sm:w-auto border-2 border-near-black text-near-black h-12 text-[11px] font-bold uppercase tracking-widest hover:bg-near-black hover:text-white transition-all duration-300">
              Buy Now
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-warm-beige">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-cream rounded-full flex items-center justify-center">
                <Truck className="w-4 h-4 text-walnut" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest">Free Delivery</p>
                <p className="text-[10px] text-gray-a0">On all bulky orders</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-cream rounded-full flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-walnut" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest">10 Year Warranty</p>
                <p className="text-[10px] text-gray-a0">For your peace of mind</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-cream rounded-full flex items-center justify-center">
                <RefreshCw className="w-4 h-4 text-walnut" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest">30 Day Trial</p>
                <p className="text-[10px] text-gray-a0">Free returns & swaps</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="space-y-8">
        <div className="flex flex-wrap border-b border-warm-beige">
          <button 
            onClick={() => setActiveTab('specs')}
            className={`px-8 py-4 text-[11px] font-bold uppercase tracking-widest transition-all relative ${activeTab === 'specs' ? 'text-near-black' : 'text-gray-a0 hover:text-near-black'}`}
          >
            Specifications
            {activeTab === 'specs' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-near-black" />}
          </button>
          <button 
            onClick={() => setActiveTab('delivery')}
            className={`px-8 py-4 text-[11px] font-bold uppercase tracking-widest transition-all relative ${activeTab === 'delivery' ? 'text-near-black' : 'text-gray-a0 hover:text-near-black'}`}
          >
            Delivery & Returns
            {activeTab === 'delivery' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-near-black" />}
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`px-8 py-4 text-[11px] font-bold uppercase tracking-widest transition-all relative ${activeTab === 'reviews' ? 'text-near-black' : 'text-gray-a0 hover:text-near-black'}`}
          >
            Reviews ({product.reviews?.length || 0})
            {activeTab === 'reviews' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-near-black" />}
          </button>
        </div>

        <div className="p-8 bg-cream/30 min-h-[300px]">
          {activeTab === 'specs' && (
            <div className="max-w-3xl">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                {product.specs ? Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <dt className="text-[10px] font-bold uppercase tracking-widest text-walnut">{key}</dt>
                    <dd className="text-sm font-medium text-near-black">{value}</dd>
                  </div>
                )) : (
                  <p className="text-sm text-gray-666 font-light">Detailed specifications are being compiled for this product.</p>
                )}
              </dl>
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="max-w-3xl space-y-8">
              <div className="space-y-4">
                <h4 className="text-xl font-display text-near-black">Standard Delivery</h4>
                <p className="text-sm text-gray-666 font-light leading-relaxed">
                  We offer free standard delivery on all orders over £500. For smaller items, delivery costs £4.99 within mainland UK.
                  Delivery usually takes 3-5 working days for in-stock items. Special bulky item delivery may take up to 10 days.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="text-xl font-display text-near-black">Returns Policy</h4>
                <p className="text-sm text-gray-666 font-light leading-relaxed">
                  Not completely satisfied with your purchase? No problem. We have a 30-day hassle-free returns policy. 
                  Items must be returned in their original packaging and in a resalable condition.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
             <div className="space-y-12">
               {product.reviews && product.reviews.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {product.reviews.map(review => (
                     <div key={review.id} className="bg-white p-6 shadow-sm space-y-4">
                       <div className="flex justify-between items-start">
                         <div className="space-y-1">
                           <p className="text-xs font-bold uppercase tracking-wider">{review.userName}</p>
                           <p className="text-[10px] text-gray-a0">{review.date}</p>
                         </div>
                         <div className="flex gap-0.5">
                           {[...Array(5)].map((_, i) => (
                             <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-gold text-gold' : 'text-warm-beige'}`} />
                           ))}
                         </div>
                       </div>
                       <p className="text-sm text-gray-666 font-light italic">"{review.comment}"</p>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="text-center py-12 space-y-4">
                   <p className="text-lg font-display text-near-black">No reviews yet</p>
                   <p className="text-sm text-gray-666 font-light">Be the first to share your thoughts on this piece.</p>
                   <button className="text-[11px] font-bold uppercase tracking-widest text-walnut underline underline-offset-4">
                     Write a Review
                   </button>
                 </div>
               )}
             </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <section className="space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-display text-near-black">Complete the Look</h2>
          <div className="w-12 h-0.5 bg-gold mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
          {relatedProducts.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400 font-light italic">
              No matching pieces found right now.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
