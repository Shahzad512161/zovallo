import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
  key?: string | number;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  return (
    <div className="group bg-white border border-warm-beige p-4 flex flex-col h-full hover:shadow-xl transition-all duration-500">
      <Link 
        to={`/product/${product.id}`}
        className="bg-cream aspect-square w-full mb-4 flex items-center justify-center relative overflow-hidden"
        aria-label={`View details for ${product.title}`}
      >
        <img 
          src={product.images[0]} 
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          loading="lazy"
        />
        {product.featured && (
          <span className="absolute top-2 left-2 bg-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-tighter text-near-black border border-warm-beige shadow-sm z-10">
            Best Seller
          </span>
        )}
      </Link>
      
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-[10px] text-gray-a0 uppercase tracking-widest mb-1 font-bold">{product.category}</p>
          <Link to={`/product/${product.id}`}>
            <h4 className="text-sm font-bold text-near-black group-hover:text-gold transition-colors truncate">
              {product.title}
            </h4>
          </Link>
        </div>
        <span className="text-sm font-bold text-near-black whitespace-nowrap">
          {formatCurrency(product.price)}
        </span>
      </div>

      <p className="text-[11px] text-gray-666 line-clamp-2 min-h-[32px] mb-6 font-light leading-relaxed">
        {product.description}
      </p>
      
      <div className="mt-auto flex flex-col gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
          onClick={() => addToCart(product, 1)}
          className="w-full bg-near-black text-white py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gold transition-all duration-300"
          aria-label={`Add ${product.title} to cart`}
        >
          Add to Cart
        </button>
        <Link 
          to={`/product/${product.id}`}
          className="block w-full border border-warm-beige py-3 text-[10px] font-bold uppercase tracking-widest text-center hover:bg-cream transition-all duration-300"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
