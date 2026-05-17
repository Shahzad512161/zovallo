import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group bg-white border border-warm-beige p-4 flex flex-col h-full hover:shadow-lg transition-all duration-300">
      <div className="bg-cream aspect-square w-full mb-4 flex items-center justify-center relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.featured && (
          <span className="absolute top-2 left-2 bg-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-tighter text-near-black border border-warm-beige shadow-sm">
            Best Seller
          </span>
        )}
      </div>
      
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-[10px] text-gray-a0 uppercase tracking-widest mb-1">{product.category}</p>
          <Link to={`/product/${product.id}`}>
            <h4 className="text-sm font-semibold text-near-black group-hover:text-gold transition-colors truncate">
              {product.name}
            </h4>
          </Link>
        </div>
        <span className="text-sm font-bold text-near-black whitespace-nowrap">
          {formatCurrency(product.price)}
        </span>
      </div>

      <p className="text-[11px] text-gray-666 line-clamp-2 min-h-[32px] mb-4">
        {product.description}
      </p>
      
      <button className="mt-auto w-full border border-warm-beige py-2 text-[11px] font-bold uppercase tracking-widest hover:bg-near-black hover:text-white transition-all duration-300">
        Add to Bag
      </button>
    </div>
  );
}
