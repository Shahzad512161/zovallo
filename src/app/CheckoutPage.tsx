import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { formatCurrency } from "../lib/utils";
import { Order } from "../types";
import { SEO } from "../components/SEO";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  CheckCircle2,
  ArrowLeft,
  ShoppingBag,
  MapPin,
  Phone,
  Mail,
  User,
  MessageSquare,
  AlertCircle,
  X,
  Globe,
} from "lucide-react";

// Country codes with validation patterns
const countryCodes = [
  {
    code: "+44",
    country: "United Kingdom",
    pattern: "^[0-9]{10,11}$",
    example: "7123456789",
  },
  {
    code: "+353",
    country: "Ireland",
    pattern: "^[0-9]{9,10}$",
    example: "851234567",
  },
  {
    code: "+33",
    country: "France",
    pattern: "^[0-9]{9}$",
    example: "612345678",
  },
  {
    code: "+49",
    country: "Germany",
    pattern: "^[0-9]{10,11}$",
    example: "15123456789",
  },
  {
    code: "+1",
    country: "United States",
    pattern: "^[0-9]{10}$",
    example: "2125551234",
  },
  {
    code: "+61",
    country: "Australia",
    pattern: "^[0-9]{9,10}$",
    example: "412345678",
  },
  {
    code: "+81",
    country: "Japan",
    pattern: "^[0-9]{10}$",
    example: "9012345678",
  },
  {
    code: "+86",
    country: "China",
    pattern: "^[0-9]{11}$",
    example: "13812345678",
  },
];

export default function CheckoutPage() {
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState(
    countryCodes[0],
  );

  const [formData, setFormData] = useState({
    fullName: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    country: "United Kingdom",
    city: "",
    address: "",
    postalCode: "",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (validationError) setValidationError(null);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryName = e.target.value;
    const countryCodeData = countryCodes.find((c) => c.country === countryName);
    if (countryCodeData) {
      setSelectedCountryCode(countryCodeData);
    }
    setFormData((prev) => ({ ...prev, country: countryName }));
  };

  const validatePhoneNumber = () => {
    const phoneRegex = new RegExp(selectedCountryCode.pattern);
    const phoneNumber = formData.phone.replace(/\s/g, "");

    if (!phoneNumber) {
      setValidationError("Please enter your phone number");
      return false;
    }

    if (!phoneRegex.test(phoneNumber)) {
      setValidationError(
        `Please enter a valid ${selectedCountryCode.country} phone number (${selectedCountryCode.example})`,
      );
      return false;
    }
    return true;
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setValidationError("Please enter your full name");
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setValidationError("Please enter a valid email address");
      return false;
    }
    if (!validatePhoneNumber()) {
      return false;
    }
    if (formData.address.length < 10) {
      setValidationError("Please provide a complete street address");
      return false;
    }
    if (!formData.city.trim()) {
      setValidationError("Please enter your city");
      return false;
    }
    if (!formData.postalCode.trim()) {
      setValidationError("Please enter your postal code");
      return false;
    }
    return true;
  };

  const handleProceedToConfirmation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setValidationError("Please login to continue");
      return;
    }

    if (cart.length === 0) {
      setValidationError("Your cart is empty");
      return;
    }

    if (validateForm()) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmOrder = async () => {
    setShowConfirmModal(false);
    setLoading(true);

    try {
      const fullPhoneNumber = `${selectedCountryCode.code} ${formData.phone}`;

      const orderData: Omit<Order, "id" | "createdAt"> = {
        userId: user!.uid,
        customerInfo: {
          ...formData,
          phone: fullPhoneNumber,
        },
        products: cart.map((item) => ({
          productId: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.images[0],
        })),
        totalPrice: subtotal,
        orderStatus: "pending",
        paymentMethod: "COD",
      };

      const docRef = await addDoc(collection(db, "orders"), {
        ...orderData,
        createdAt: serverTimestamp(),
      });
      setOrderId(docRef.id);
      setOrderComplete(true);
      clearCart();
    } catch (error) {
      console.error("Error placing order:", error);
      setValidationError(
        "Failed to place order. Please check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-32 text-center space-y-6 sm:space-y-8">
        <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-mint-50 rounded-full mb-4">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-mint-700" />
        </div>
        <div className="space-y-3 sm:space-y-4">
          <h1 className="text-3xl sm:text-4xl font-display text-near-black">
            Thank You For Your Order
          </h1>
          <p className="text-gray-666 font-light text-base sm:text-lg max-w-md mx-auto">
            Your piece is being prepared for its new home. We'll contact you
            shortly for delivery confirmation.
          </p>
          <div className="bg-cream/50 p-4 sm:p-6 rounded-lg border border-warm-beige inline-block mt-6 sm:mt-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-walnut mb-1">
              Order Reference
            </p>
            <p className="text-lg sm:text-xl font-mono text-near-black font-bold">
              #{orderId?.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-6 sm:pt-8">
          <Link
            to="/shop"
            className="bg-near-black text-white px-6 sm:px-10 py-3 sm:py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-gold transition-all duration-300"
          >
            Continue Shopping
          </Link>
          <Link
            to="/profile"
            className="border-2 border-near-black text-near-black px-6 sm:px-10 py-3 sm:py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-near-black hover:text-white transition-all duration-300"
          >
            Profile
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-32 text-center space-y-6">
        <h2 className="text-xl sm:text-2xl font-display">
          No items to checkout
        </h2>
        <Link
          to="/shop"
          className="text-walnut underline underline-offset-4 font-bold uppercase text-xs tracking-widest"
        >
          Go to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
      <SEO
        title="Secure Checkout"
        description="Finalize your luxury furniture order with Zovallo. Secure delivery and handling guaranteed."
      />

      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-12 xl:gap-16">
        {/* Checkout Form */}
        <div className="flex-1 space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-warm-beige pb-4 pt-4 sm:pb-5 md:pb-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-display text-near-black">
              Shipping Details
            </h1>
            <Link
              to="/cart"
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-walnut hover:text-near-black transition-colors group w-fit"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              Return to Cart
            </Link>
          </div>

          {/* Error Message */}
          {validationError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 text-xs sm:text-sm rounded-lg">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <p className="text-xs sm:text-sm">{validationError}</p>
            </div>
          )}

          <form
            onSubmit={handleProceedToConfirmation}
            className="space-y-6 sm:space-y-8 md:space-y-10"
          >
            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
              {/* Full Name */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-walnut block">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-a0" />
                  <input
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-cream border border-warm-beige py-2.5 sm:py-3 pl-9 sm:pl-10 pr-3 sm:pr-4 text-sm outline-none focus:border-gold transition-colors rounded"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-walnut block">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-a0" />
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-cream border border-warm-beige py-2.5 sm:py-3 pl-9 sm:pl-10 pr-3 sm:pr-4 text-sm outline-none focus:border-gold transition-colors rounded"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              {/* Phone with Country Code */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-walnut block">
                  Phone Number *
                </label>
                <div className="flex gap-2">
                  <div className="relative w-28 sm:w-32">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-a0" />
                    <select
                      value={selectedCountryCode.code}
                      onChange={(e) => {
                        const code = e.target.value;
                        const countryData = countryCodes.find(
                          (c) => c.code === code,
                        );
                        if (countryData) {
                          setSelectedCountryCode(countryData);
                          setFormData((prev) => ({
                            ...prev,
                            country: countryData.country,
                          }));
                        }
                      }}
                      className="w-full bg-cream border border-warm-beige py-2.5 sm:py-3 pl-9 sm:pl-10 pr-2 text-sm outline-none focus:border-gold transition-colors rounded appearance-none"
                    >
                      {countryCodes.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-a0" />
                    <input
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={selectedCountryCode.example}
                      className="w-full bg-cream border border-warm-beige py-2.5 sm:py-3 pl-9 sm:pl-10 pr-3 sm:pr-4 text-sm outline-none focus:border-gold transition-colors rounded"
                    />
                  </div>
                </div>
                <p className="text-[7px] sm:text-[8px] text-gray-400">
                  Example: {selectedCountryCode.example}
                </p>
              </div>

              {/* Country */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-walnut block">
                  Country *
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleCountryChange}
                  className="w-full bg-cream border border-warm-beige py-2.5 sm:py-3 px-3 sm:px-4 text-sm outline-none focus:border-gold transition-colors appearance-none rounded"
                >
                  {countryCodes.map((c) => (
                    <option key={c.country} value={c.country}>
                      {c.country}
                    </option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-walnut block">
                  City *
                </label>
                <input
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-cream border border-warm-beige py-2.5 sm:py-3 px-3 sm:px-4 text-sm outline-none focus:border-gold transition-colors rounded"
                  placeholder="London"
                />
              </div>

              {/* Postal Code */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-walnut block">
                  Postal Code *
                </label>
                <input
                  name="postalCode"
                  required
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full bg-cream border border-warm-beige py-2.5 sm:py-3 px-3 sm:px-4 text-sm outline-none focus:border-gold transition-colors rounded"
                  placeholder="SW1A 1AA"
                />
              </div>

              {/* Address */}
              <div className="sm:col-span-2 space-y-1.5 sm:space-y-2">
                <label className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-walnut block">
                  Street Address *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 sm:top-3 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-a0" />
                  <textarea
                    name="address"
                    required
                    rows={2}
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-cream border border-warm-beige py-2.5 sm:py-3 pl-9 sm:pl-10 pr-3 sm:pr-4 text-sm outline-none focus:border-gold resize-none transition-colors rounded"
                    placeholder="123 Main Street, Apartment 4B"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="sm:col-span-2 space-y-1.5 sm:space-y-2">
                <label className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-walnut block">
                  Order Notes (Optional)
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-2.5 sm:top-3 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-a0" />
                  <textarea
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="E.g. Building floor, gate code, special delivery instructions..."
                    className="w-full bg-cream border border-warm-beige py-2.5 sm:py-3 pl-9 sm:pl-10 pr-3 sm:pr-4 text-sm outline-none focus:border-gold resize-none transition-colors rounded"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-4 sm:space-y-5 md:space-y-6 pt-4 sm:pt-6 md:pt-8 lg:pt-10 border-t border-warm-beige">
              <h2 className="text-lg sm:text-xl font-display text-near-black">
                Payment Method
              </h2>
              <div className="bg-mint-50 border border-mint-200 p-4 sm:p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 rounded-lg">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-mint-700" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-near-black">
                      Cash On Delivery (COD)
                    </p>
                    <p className="text-[10px] sm:text-xs text-mint-700">
                      Pay when your furniture arrives at your doorstep
                    </p>
                  </div>
                </div>
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-mint-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full" />
                </div>
              </div>
            </div>

            {/* Review Order Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-near-black text-white py-3 sm:py-4 md:py-5 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest hover:bg-gold transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50 rounded"
            >
              {loading ? "Processing Order..." : "Review Order"}
              {!loading && (
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </button>
          </form>
        </div>

        {/* Order Summary Sidebar - Responsive */}
        <aside className="w-full lg:w-[380px] xl:w-[420px] space-y-5 sm:space-y-6">
          <div className="bg-cream/30 border border-warm-beige p-4 sm:p-5 md:p-6 lg:p-8 sticky top-20 md:top-32 lg:top-44 rounded-lg">
            <h2 className="text-lg sm:text-xl font-display text-near-black mb-4 sm:mb-5 md:mb-6">
              Review Order
            </h2>

            {/* Cart Items */}
            <div className="space-y-3 sm:space-y-4 max-h-[300px] sm:max-h-[350px] md:max-h-[400px] overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 sm:gap-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white border border-warm-beige flex-shrink-0 rounded overflow-hidden">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-display text-near-black truncate">
                      {item.title}
                    </h4>
                    <p className="text-[9px] sm:text-[10px] text-gray-666 uppercase tracking-widest mt-0.5">
                      {item.category}
                    </p>
                    <div className="flex justify-between items-center mt-1 sm:mt-2">
                      <p className="text-[10px] sm:text-[11px] font-bold text-gray-a0">
                        QTY: {item.quantity}
                      </p>
                      <p className="text-xs sm:text-sm font-medium text-near-black">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 sm:space-y-3 pt-4 sm:pt-5 md:pt-6 border-t border-warm-beige mt-4 sm:mt-5 md:mt-6">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-666">Order Subtotal</span>
                <span className="font-medium text-near-black">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-666">Standard Delivery</span>
                <span className="text-mint-700 font-bold uppercase tracking-wider text-[9px] sm:text-[10px]">
                  FREE
                </span>
              </div>
              <div className="pt-2 sm:pt-3 border-t border-warm-beige flex justify-between items-baseline">
                <span className="text-base sm:text-lg font-display text-near-black">
                  Order Total
                </span>
                <span className="text-lg sm:text-xl md:text-2xl font-light text-walnut">
                  {formatCurrency(subtotal)}
                </span>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-mint-700" />
                <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.1em] text-gray-a0">
                  Dispatched within 24-48 hours
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-mint-700" />
                <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.1em] text-gray-a0">
                  White glove placement included
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Confirmation Modal - Responsive with buttons at bottom */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center px-3 sm:px-4">
          <div
            className="absolute inset-0 bg-near-black/80 backdrop-blur-sm"
            onClick={() => setShowConfirmModal(false)}
          />
          <div className="bg-white w-full max-w-md sm:max-w-lg relative z-10 shadow-2xl border border-warm-beige rounded-t-xl sm:rounded-lg overflow-hidden animate-slide-up sm:animate-fade-in">
            {/* Header */}
            <div className="p-4 sm:p-5 md:p-6 border-b border-warm-beige flex justify-between items-center bg-gold/5">
              <h3 className="text-base sm:text-lg md:text-xl font-display text-near-black">
                Confirm Your Order
              </h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-gray-400 hover:text-near-black transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto">
              {/* Delivery Details */}
              <div className="space-y-2 sm:space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-walnut">
                  Delivery Details
                </h4>
                <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                  <p>
                    <span className="font-bold">Name:</span> {formData.fullName}
                  </p>
                  <p>
                    <span className="font-bold">Email:</span> {formData.email}
                  </p>
                  <p>
                    <span className="font-bold">Phone:</span>{" "}
                    {selectedCountryCode.code} {formData.phone}
                  </p>
                  <p>
                    <span className="font-bold">Address:</span>{" "}
                    {formData.address}, {formData.city}, {formData.postalCode},{" "}
                    {formData.country}
                  </p>
                  {formData.notes && (
                    <p>
                      <span className="font-bold">Notes:</span> {formData.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-2 sm:space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-walnut">
                  Order Summary
                </h4>
                <div className="space-y-1.5 sm:space-y-2">
                  {cart.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-xs sm:text-sm"
                    >
                      <span className="truncate max-w-[150px] sm:max-w-[200px]">
                        {item.title} x{item.quantity}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-warm-beige pt-2 mt-2">
                    <div className="flex justify-between font-bold text-sm sm:text-base">
                      <span>Total</span>
                      <span className="text-gold">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Note */}
              <div className="bg-mint-50 p-2.5 sm:p-3 rounded-lg text-center">
                <p className="text-[9px] sm:text-[10px] text-mint-700">
                  <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                  Cash on Delivery selected. Pay when your order arrives.
                </p>
              </div>
            </div>

            {/* Action Buttons - Always at bottom */}
            <div className="p-4 sm:p-5 md:p-6 border-t border-warm-beige bg-cream/30 flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="order-2 sm:order-1 flex-1 border-2 border-near-black py-2.5 sm:py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-near-black hover:text-white transition-all duration-300 rounded"
              >
                Edit Details
              </button>
              <button
                onClick={handleConfirmOrder}
                disabled={loading}
                className="order-1 sm:order-2 flex-1 bg-near-black text-white py-2.5 sm:py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gold hover:text-near-black transition-all duration-300 disabled:opacity-50 rounded"
              >
                {loading ? "Placing Order..." : "Confirm Order"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add animation styles */}
      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
        @media (min-width: 640px) {
          .animate-fade-in {
            animation: fadeIn 0.2s ease-out;
          }
        }
      `}</style>
    </div>
  );
}
