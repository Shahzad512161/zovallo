import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  ExternalLink,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";
import { formatCurrency } from "../lib/utils";
import { Order } from "../types";
import { orderApi } from "../services/orderApi";
import { LoadingSpinner } from "../components/ui/Loading";
import { EmptyState } from "../components/ui/EmptyState";

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderApi.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: Order["orderStatus"]) => {
    try {
      await orderApi.updateOrderStatus(id, newStatus);
      await fetchOrders();
      if (selectedOrder?.id === id) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, orderStatus: newStatus } : null,
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update order status");
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus =
      statusFilter === "All" || o.orderStatus === statusFilter.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      o.id.toLowerCase().includes(query) ||
      o.customerInfo.fullName.toLowerCase().includes(query) ||
      o.customerInfo.email.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const stats = [
    { label: "Pending", count: orders.filter((o) => o.orderStatus === "pending").length, color: "text-gold" },
    { label: "Processing", count: orders.filter((o) => o.orderStatus === "processing").length, color: "text-near-black" },
    { label: "Shipped", count: orders.filter((o) => o.orderStatus === "shipped").length, color: "text-blue-500" },
    { label: "Delivered", count: orders.filter((o) => o.orderStatus === "delivered").length, color: "text-mint-700" },
  ];

  return (
    <div className="space-y-5 sm:space-y-6 md:space-y-8 lg:space-y-10 px-3 sm:px-4 md:px-5 lg:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-5 md:gap-6">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-display text-near-black uppercase tracking-tight">
            Order Fulfilment
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Manage deliveries and customer satisfaction.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 sm:gap-5 md:gap-6">
          {stats.map((s, idx) => (
            <div key={idx} className="text-right">
              <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-0.5 sm:mb-1">
                {s.label}
              </p>
              <p className={`text-base sm:text-lg md:text-xl font-display font-bold ${s.color}`}>
                {s.count}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-10">
        
        {/* Orders List */}
        <div className="flex-1 space-y-4 sm:space-y-5 md:space-y-6">
          {/* Search & Filter Bar */}
          <div className="bg-white border border-warm-beige p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 rounded-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders (ID, Customer, Email)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-cream border-none py-2 sm:py-2.5 pl-9 sm:pl-10 pr-3 sm:pr-4 text-xs sm:text-sm focus:ring-1 focus:ring-gold outline-none rounded"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-cream border-none py-2 sm:py-2.5 px-3 sm:px-4 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest outline-none rounded"
            >
              <option>All</option>
              <option>Pending</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>
          </div>

          {/* Orders Table */}
          <div className="bg-white border border-warm-beige overflow-hidden rounded-lg">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] sm:min-w-[600px]">
                <thead>
                  <tr className="bg-cream/50">
                    <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-3 md:py-4 text-left text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Order Ref
                    </th>
                    <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-3 md:py-4 text-left text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Customer
                    </th>
                    <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-3 md:py-4 text-left text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Date
                    </th>
                    <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-3 md:py-4 text-left text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Total
                    </th>
                    <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-3 md:py-4 text-right text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warm-beige">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-3 sm:px-4 md:px-5 lg:px-6 py-12 sm:py-16 md:py-20 lg:py-24">
                        <div className="flex flex-col items-center justify-center gap-3 sm:gap-4">
                          <LoadingSpinner />
                          <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-gold text-center">
                            Scanning ledger...
                          </p>
                        </div>
                       </td>
                    </tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-3 sm:px-4 md:px-5 lg:px-6 py-12 sm:py-16 md:py-20">
                        <EmptyState icon={Package} title="No Orders Found" description="We couldn't find any orders matching your current filters." />
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className={`cursor-pointer transition-colors ${selectedOrder?.id === order.id ? "bg-gold/5" : "hover:bg-cream/20"}`}
                      >
                        <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-3 sm:py-4 md:py-5 lg:py-6">
                          <span className="font-mono text-[10px] sm:text-xs font-bold">
                            #{order.id.slice(-8).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-3 sm:py-4 md:py-5 lg:py-6">
                          <span className="text-xs sm:text-sm font-bold text-near-black line-clamp-1">
                            {order.customerInfo.fullName}
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-3 sm:py-4 md:py-5 lg:py-6">
                          <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                            {order.createdAt?.toDate().toLocaleDateString("en-GB")}
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-3 sm:py-4 md:py-5 lg:py-6">
                          <span className="text-xs sm:text-sm font-medium">
                            {formatCurrency(order.totalPrice)}
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-3 sm:py-4 md:py-5 lg:py-6 text-right">
                          <span className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 text-[7px] sm:text-[8px] md:text-[9px] font-bold uppercase tracking-widest rounded-sm ${
                            order.orderStatus === "delivered" ? "bg-mint-50 text-mint-700" :
                            order.orderStatus === "pending" ? "bg-gold/10 text-walnut" :
                            "bg-gray-100 text-gray-400"
                          }`}>
                            {order.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Order Details Panel */}
        <aside className="w-full lg:w-[380px] xl:w-[450px]">
          {selectedOrder ? (
            <div className="bg-white border border-warm-beige p-4 sm:p-5 md:p-6 lg:p-8 sticky top-20 md:top-32 lg:top-44 space-y-5 sm:space-y-6 md:space-y-8 lg:space-y-10 rounded-lg">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                    Order Details
                  </p>
                  <h3 className="text-base sm:text-lg md:text-xl font-display font-bold text-near-black">
                    #{selectedOrder.id.slice(-8).toUpperCase()}
                  </h3>
                </div>
                <div className="flex gap-1 sm:gap-2">
                  <Link to={`/admin/orders/${selectedOrder.id}`} className="p-1.5 sm:p-2 hover:bg-cream transition-colors text-gray-400 rounded" title="View Full Intel">
                    <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>
                  <button className="p-1.5 sm:p-2 hover:bg-cream transition-colors text-gray-400 rounded" onClick={() => setSelectedOrder(null)}>
                    <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                {/* Status Update */}
                <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-cream/50 border border-warm-beige rounded-lg">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-gold" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-walnut mb-1">
                      Status Update
                    </p>
                    <div className="relative">
                      <select
                        value={selectedOrder.orderStatus}
                        onChange={(e) => updateStatus(selectedOrder.id, e.target.value as Order["orderStatus"])}
                        className="w-full bg-transparent border-none p-0 text-xs sm:text-sm font-bold text-near-black appearance-none focus:ring-0 cursor-pointer"
                      >
                        <option value="pending">Mark as Pending</option>
                        <option value="processing">Mark as Processing</option>
                        <option value="shipped">Mark as Shipped</option>
                        <option value="delivered">Mark as Delivered</option>
                        <option value="cancelled">Mark as Cancelled</option>
                      </select>
                      <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Customer Intelligence */}
                <div className="space-y-3 sm:space-y-4">
                  <h4 className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                    Customer Intelligence
                  </h4>
                  <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm break-all">
                      <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-walnut flex-shrink-0" />
                      <span className="font-medium">{selectedOrder.customerInfo.email}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                      <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-walnut flex-shrink-0" />
                      <span className="font-medium">{selectedOrder.customerInfo.phone}</span>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-walnut mt-0.5 flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="font-medium break-words">{selectedOrder.customerInfo.address}</span>
                        <span className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-tighter">
                          {selectedOrder.customerInfo.city}, {selectedOrder.customerInfo.postalCode}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Contents */}
                <div className="space-y-2 sm:space-y-3">
                  <h4 className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                    Order Contents
                  </h4>
                  <div className="space-y-3 sm:space-y-4 max-h-40 sm:max-h-48 overflow-y-auto pr-1 sm:pr-2">
                    {selectedOrder.products.map((p, idx) => (
                      <div key={idx} className="flex gap-2 sm:gap-3 md:gap-4">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-cream border border-warm-beige flex-shrink-0 rounded overflow-hidden">
                          <img src={p.image} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] sm:text-xs font-bold text-near-black leading-tight truncate">
                            {p.title}
                          </p>
                          <div className="flex justify-between mt-1 flex-wrap gap-1">
                            <span className="text-[8px] sm:text-[9px] text-gray-400 uppercase font-bold">
                              QTY: {p.quantity}
                            </span>
                            <span className="text-[9px] sm:text-[10px] font-medium">
                              {formatCurrency(p.price)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="p-4 sm:p-5 md:p-6 bg-near-black text-white space-y-3 sm:space-y-4 rounded-lg">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-gray-400">
                      Total Settlement
                    </span>
                    <span className="text-base sm:text-lg md:text-xl font-display font-bold">
                      {formatCurrency(selectedOrder.totalPrice)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-mint-400">
                    <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Paid via Cash on Delivery
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[400px] sm:h-[500px] lg:h-[600px] bg-cream/30 border border-dashed border-warm-beige flex flex-col items-center justify-center text-center p-6 sm:p-8 md:p-10 rounded-lg">
              <Package className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 text-gray-300 mb-3 sm:mb-4" />
              <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Select an order from the ledger to view full intelligence and fulfilment history.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}