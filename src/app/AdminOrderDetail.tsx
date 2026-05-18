import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Printer,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Clock,
  AlertCircle,
} from "lucide-react";
import { formatCurrency } from "../lib/utils";
import { Order } from "../types";
import { orderApi } from "../services/orderApi";

export default function AdminOrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const data = await orderApi.getById(orderId!);
      setOrder(data);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: Order["orderStatus"]) => {
    if (!order) return;
    setUpdating(true);
    try {
      await orderApi.updateOrderStatus(order.id, newStatus);
      setOrder((prev) => (prev ? { ...prev, orderStatus: newStatus } : null));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const printInvoice = () => {
    if (!order) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow pop-ups to print the invoice");
      return;
    }
    // Print content same as before (kept for brevity)
    const printContent = `...`; // Keep your existing print content
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
    printWindow.onafterprint = () => printWindow.close();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] sm:min-h-[500px] md:min-h-[600px]">
        <div className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-gold animate-pulse">
          Accessing Secure Records...
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] sm:min-h-[500px] md:min-h-[600px] space-y-3 sm:space-y-4 px-4">
        <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300" />
        <p className="text-gray-400 font-medium text-sm sm:text-base">
          Order not found in our database.
        </p>
        <Link
          to="/admin/orders"
          className="text-gold font-bold uppercase tracking-widest text-[9px] sm:text-[10px] hover:underline"
        >
          Return to Ledger
        </Link>
      </div>
    );
  }

  const statusColors = {
    pending: "bg-gold/10 text-walnut border-gold/20",
    processing: "bg-near-black/5 text-near-black border-near-black/10",
    shipped: "bg-blue-50 text-blue-600 border-blue-100",
    delivered: "bg-mint-50 text-mint-700 border-mint-100",
    cancelled: "bg-red-50 text-red-600 border-red-100",
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-5 lg:px-6 space-y-6 sm:space-y-8 md:space-y-10 pb-12 sm:pb-16 md:pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-5 md:gap-6">
        <div className="space-y-3 sm:space-y-4">
          <button
            onClick={() => navigate("/admin/orders")}
            className="flex items-center gap-1.5 sm:gap-2 text-gray-400 hover:text-near-black transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">
              Back to Ledger
            </span>
          </button>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-display text-near-black uppercase tracking-tight">
              Order #{order.id.slice(-8).toUpperCase()}
            </h1>
            <span
              className={`px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-sm border text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] ${statusColors[order.orderStatus]}`}
            >
              {order.orderStatus}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-gray-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1.5 sm:gap-2">
              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {order.createdAt
                ?.toDate()
                .toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
            </span>
            <span className="flex items-center gap-1.5 sm:gap-2">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {order.createdAt
                ?.toDate()
                .toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
          <button
            onClick={printInvoice}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-2.5 md:py-3 bg-white border border-warm-beige text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-near-black hover:bg-cream transition-colors rounded"
          >
            <Printer className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />{" "}
            Print Invoice
          </button>
          <div className="relative group">
            <button
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-2.5 md:py-3 bg-near-black text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-widest hover:bg-gold transition-colors disabled:opacity-50 rounded"
              disabled={updating}
            >
              Update Status {updating && "..."}
            </button>
            <div className="absolute right-0 top-full mt-2 w-44 sm:w-48 bg-white border border-warm-beige shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 rounded">
              {(
                [
                  "pending",
                  "processing",
                  "shipped",
                  "delivered",
                  "cancelled",
                ] as Order["orderStatus"][]
              ).map((status) => (
                <button
                  key={status}
                  onClick={() => updateStatus(status)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left text-[9px] sm:text-[10px] font-bold uppercase tracking-widest hover:bg-cream transition-colors disabled:opacity-50"
                  disabled={order.orderStatus === status}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8 md:space-y-10">
          {/* Products Table */}
          <section className="bg-white border border-warm-beige overflow-hidden rounded-lg">
            <div className="px-4 sm:px-5 md:px-6 lg:px-8 py-3 sm:py-4 md:py-5 lg:py-6 border-b border-warm-beige flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-cream/30">
              <h2 className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-near-black">
                Order Contents
              </h2>
              <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {order.products.length} Items
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] sm:min-w-[600px]">
                <tbody className="divide-y divide-warm-beige">
                  {order.products.map((p, idx) => (
                    <tr key={idx}>
                      <td className="px-3 sm:px-4 md:px-5 lg:px-8 py-3 sm:py-4 md:py-5 lg:py-6 w-16 sm:w-20 md:w-24">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-cream border border-warm-beige rounded overflow-hidden">
                          <img
                            src={p.image}
                            alt={p.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-2 sm:px-3 md:px-4 py-3 sm:py-4 md:py-5 lg:py-6">
                        <p className="text-xs sm:text-sm font-bold text-near-black">
                          {p.title}
                        </p>
                        <p className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">
                          ID: {p.productId.slice(-8).toUpperCase()}
                        </p>
                      </td>
                      <td className="px-2 sm:px-3 md:px-4 py-3 sm:py-4 md:py-5 lg:py-6 text-center">
                        <p className="text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          Qty
                        </p>
                        <p className="text-xs sm:text-sm font-medium mt-1">
                          {p.quantity}
                        </p>
                      </td>
                      <td className="px-3 sm:px-4 md:px-5 lg:px-8 py-3 sm:py-4 md:py-5 lg:py-6 text-right">
                        <p className="text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          Price
                        </p>
                        <p className="text-xs sm:text-sm font-bold mt-1 text-near-black">
                          {formatCurrency(p.price)}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 sm:p-5 md:p-6 lg:p-8 bg-near-black text-white">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
                <div>
                  <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">
                    Settlement Total
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 font-medium italic">
                    Includes all applicable duties and carriage fees.
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl sm:text-3xl md:text-4xl font-display font-bold leading-none">
                    {formatCurrency(order.totalPrice)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Payment Details */}
          <section className="bg-white border border-warm-beige p-4 sm:p-5 md:p-6 lg:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 rounded-lg">
            <div className="flex items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-mint-50 flex items-center justify-center rounded-full">
                <CreditCard className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-mint-700" />
              </div>
              <div>
                <h3 className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-near-black mb-0.5 sm:mb-1">
                  Payment Method
                </h3>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Cash on Delivery (COD)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-mint-700 bg-mint-50 px-3 sm:px-4 py-1.5 sm:py-2 border border-mint-100 rounded">
              <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Transaction
              Verified
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 sm:space-y-8 md:space-y-10">
          {/* Customer Intelligence */}
          <section className="bg-white border border-warm-beige rounded-lg overflow-hidden">
            <div className="px-4 sm:px-5 md:px-6 lg:px-8 py-3 sm:py-4 md:py-5 lg:py-6 border-b border-warm-beige bg-cream/30">
              <h2 className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-near-black">
                Customer Profile
              </h2>
            </div>
            <div className="p-4 sm:p-5 md:p-6 lg:p-8 space-y-5 sm:space-y-6 md:space-y-7 lg:space-y-8">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-gold/10 text-gold flex items-center justify-center rounded-full text-base sm:text-lg md:text-xl font-display font-bold">
                  {order.customerInfo.fullName.charAt(0)}
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-near-black">
                    {order.customerInfo.fullName}
                  </p>
                  <p className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-0.5">
                    UID: {order.userId.slice(-8).toUpperCase()}
                  </p>
                </div>
              </div>
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-walnut mt-0.5" />
                  <div>
                    <p className="text-[7px] sm:text-[8px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                      Comms Endpoint
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-near-black break-words">
                      {order.customerInfo.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-walnut mt-0.5" />
                  <div>
                    <p className="text-[7px] sm:text-[8px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                      Contact Line
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-near-black">
                      {order.customerInfo.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Shipping Coordinates */}
          <section className="bg-white border border-warm-beige rounded-lg overflow-hidden">
            <div className="px-4 sm:px-5 md:px-6 lg:px-8 py-3 sm:py-4 md:py-5 lg:py-6 border-b border-warm-beige bg-cream/30">
              <h2 className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-near-black">
                Shipping Coordinates
              </h2>
            </div>
            <div className="p-4 sm:p-5 md:p-6 lg:p-8 space-y-5 sm:space-y-6 md:space-y-7 lg:space-y-8">
              <div className="flex items-start gap-3 sm:gap-4">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-walnut mt-0.5 flex-shrink-0" />
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <p className="text-[7px] sm:text-[8px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                      Physical Address
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-near-black leading-relaxed">
                      {order.customerInfo.address}
                    </p>
                    <p className="text-[10px] sm:text-xs font-medium text-gray-500 mt-1 uppercase tracking-widest">
                      {order.customerInfo.city}, {order.customerInfo.postalCode}
                    </p>
                    <p className="text-[10px] sm:text-xs font-medium text-gold mt-0.5 uppercase tracking-widest">
                      {order.customerInfo.country}
                    </p>
                  </div>
                  {order.customerInfo.notes && (
                    <div className="p-3 sm:p-4 bg-gold/5 border border-gold/10 italic rounded">
                      <p className="text-[7px] sm:text-[8px] font-bold uppercase tracking-widest text-walnut mb-1 sm:mb-2">
                        Delivery Directives
                      </p>
                      <p className="text-[10px] sm:text-[11px] text-walnut leading-relaxed">
                        "{order.customerInfo.notes}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="pt-4 sm:pt-5 md:pt-6 border-t border-warm-beige space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-walnut" />
                  <div>
                    <p className="text-[7px] sm:text-[8px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                      Fulfillment Mode
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-near-black uppercase tracking-widest">
                      Standard Carrier
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-walnut" />
                  <div>
                    <p className="text-[7px] sm:text-[8px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                      Packaging Status
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-near-black uppercase tracking-widest">
                      Ready for Despatch
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
