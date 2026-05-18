import { Link } from "react-router-dom";
import {
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  ShieldCheck,
  Truck,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../lib/utils";
import { EmptyState } from "../components/ui/EmptyState";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, subtotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EmptyState
          icon={ShoppingBag}
          title="Your Cart is Empty"
          description="Looks like you haven't added any premium furniture to your cart yet. Explore our masterfully crafted autumnal collection."
          actionText="Explore Collections"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items List */}
        <div className="flex-1 space-y-8">
          <div className="flex items-center justify-between border-b border-warm-beige pb-6">
            <h1 className="text-3xl font-display text-near-black">
              Shopping Cart
            </h1>
            <Link
              to="/shop"
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-walnut hover:text-near-black transition-colors group"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              Continue Shopping
            </Link>
          </div>

          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row gap-6 p-6 bg-white border border-warm-beige group transition-all hover:shadow-md"
              >
                <Link
                  to={`/product/${item.id}`}
                  className="w-32 aspect-square bg-cream overflow-hidden flex-shrink-0"
                >
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-gray-a0 uppercase tracking-widest mb-1">
                        {item.category}
                      </p>
                      <Link to={`/product/${item.id}`}>
                        <h3 className="text-lg font-display text-near-black hover:text-gold transition-colors">
                          {item.title}
                        </h3>
                      </Link>
                    </div>
                    <p className="text-lg font-light text-near-black">
                      {formatCurrency(item.price)}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-6 sm:mt-0">
                    <div className="flex items-center border border-warm-beige h-10">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-10 h-full flex items-center justify-center hover:bg-cream transition-colors border-r border-warm-beige"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-12 h-full flex items-center justify-center text-xs font-bold bg-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-10 h-full flex items-center justify-center hover:bg-cream transition-colors border-l border-warm-beige"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <aside className="w-full lg:w-[380px] space-y-6">
          <div className="bg-cream/30 border border-warm-beige p-8 sticky top-44">
            <h2 className="text-xl font-display text-near-black mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-gray-666">Subtotal</span>
                <span className="font-medium text-near-black">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-666">Delivery</span>
                <span className="text-mint-700 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-666">Estimated Tax</span>
                <span className="font-medium text-near-black">£0.00</span>
              </div>
              <div className="pt-4 border-t border-warm-beige flex justify-between items-baseline">
                <span className="text-lg font-display text-near-black">
                  Total
                </span>
                <span className="text-2xl font-light text-walnut">
                  {formatCurrency(subtotal)}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <Link
                to="/checkout"
                className="block w-full bg-near-black text-white py-4 text-[11px] font-bold uppercase tracking-widest text-center hover:bg-gold transition-all duration-300"
              >
                Proceed to Checkout
              </Link>
              <div className="flex flex-col gap-4 py-6 border-t border-warm-beige mt-6">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-mint-700" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-666">
                    Secure Checkout Guaranteed
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-mint-700" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-666">
                    White Glove Delivery available
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
