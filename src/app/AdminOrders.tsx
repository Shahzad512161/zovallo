import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Clock
} from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { Order } from '../types';
import { orderApi } from '../services/orderApi';
import { LoadingSpinner } from '../components/ui/Loading';
import { EmptyState } from '../components/ui/EmptyState';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

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

  const updateStatus = async (id: string, newStatus: Order['orderStatus']) => {
    try {
      await orderApi.updateOrderStatus(id, newStatus);
      await fetchOrders();
      
      if (selectedOrder?.id === id) {
        setSelectedOrder(prev => prev ? { ...prev, orderStatus: newStatus } : null);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update order status");
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesStatus = statusFilter === 'All' || o.orderStatus === statusFilter.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      o.id.toLowerCase().includes(query) || 
      o.customerInfo.fullName.toLowerCase().includes(query) || 
      o.customerInfo.email.toLowerCase().includes(query);
    
    return matchesStatus && matchesSearch;
  });

  const stats = [
    { label: 'Pending', count: orders.filter(o => o.orderStatus === 'pending').length, color: 'text-gold' },
    { label: 'Processing', count: orders.filter(o => o.orderStatus === 'processing').length, color: 'text-near-black' },
    { label: 'Shipped', count: orders.filter(o => o.orderStatus === 'shipped').length, color: 'text-blue-500' },
    { label: 'Delivered', count: orders.filter(o => o.orderStatus === 'delivered').length, color: 'text-mint-700' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display text-near-black uppercase tracking-tight">Order Fulfilment</h1>
          <p className="text-gray-400 text-sm mt-1">Manage deliveries and customer satisfaction.</p>
        </div>
        <div className="flex gap-8">
          {stats.map((s, idx) => (
            <div key={idx} className="text-right">
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">{s.label}</p>
              <p className={`text-xl font-display font-bold ${s.color}`}>{s.count}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Orders List */}
        <div className="flex-1 space-y-6">
          <div className="bg-white border border-warm-beige p-4 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search orders (ID, Customer, Email)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-cream border-none py-2 pl-10 pr-4 text-xs focus:ring-1 focus:ring-gold"
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-cream border-none py-2 px-4 text-[10px] font-bold uppercase tracking-widest outline-none"
            >
              <option>All</option>
              <option>Pending</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>
          </div>

          <div className="bg-white border border-warm-beige overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-cream/50">
                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Order Ref</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Customer</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Total</th>
                    <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warm-beige">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-24">
                        <div className="flex flex-col items-center justify-center gap-4">
                          <LoadingSpinner />
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold text-center">Scanning ledger...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-24">
                        <EmptyState 
                          icon={Package}
                          title="No Orders Found"
                          description="We couldn't find any orders matching your current filters."
                        />
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr 
                        key={order.id} 
                        onClick={() => setSelectedOrder(order)}
                        className={`cursor-pointer transition-colors ${selectedOrder?.id === order.id ? 'bg-gold/5' : 'hover:bg-cream/20'}`}
                      >
                        <td className="px-6 py-6">
                          <span className="font-mono text-xs font-bold">#{order.id.slice(-8).toUpperCase()}</span>
                        </td>
                        <td className="px-6 py-6">
                          <span className="text-sm font-bold text-near-black">{order.customerInfo.fullName}</span>
                        </td>
                        <td className="px-6 py-6">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                            {order.createdAt?.toDate().toLocaleDateString('en-GB')}
                          </span>
                        </td>
                        <td className="px-6 py-6">
                          <span className="text-sm font-medium">{formatCurrency(order.totalPrice)}</span>
                        </td>
                        <td className="px-6 py-6 text-right">
                          <span className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-sm ${
                            order.orderStatus === 'delivered' ? 'bg-mint-50 text-mint-700' :
                            order.orderStatus === 'pending' ? 'bg-gold/10 text-walnut' :
                            'bg-gray-100 text-gray-400'
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
        <aside className="w-full lg:w-[450px]">
          {selectedOrder ? (
            <div className="bg-white border border-warm-beige p-8 sticky top-44 space-y-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Order Details</p>
                  <h3 className="text-xl font-display font-bold text-near-black">#{selectedOrder.id.slice(-8).toUpperCase()}</h3>
                </div>
                <div className="flex gap-2">
                  <Link 
                    to={`/admin/orders/${selectedOrder.id}`}
                    className="p-2 hover:bg-cream transition-colors text-gray-400"
                    title="View Full Intel"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </Link>
                  <button className="p-2 hover:bg-cream transition-colors text-gray-400" onClick={() => setSelectedOrder(null)}>
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4 p-4 bg-cream/50 border border-warm-beige">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-gold" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-walnut mb-1">Status Update</p>
                    <div className="relative">
                      <select 
                        value={selectedOrder.orderStatus}
                        onChange={(e) => updateStatus(selectedOrder.id, e.target.value as Order['orderStatus'])}
                        className="w-full bg-transparent border-none p-0 text-sm font-bold text-near-black appearance-none focus:ring-0 cursor-pointer"
                      >
                        <option value="pending">Mark as Pending</option>
                        <option value="processing">Mark as Processing</option>
                        <option value="shipped">Mark as Shipped</option>
                        <option value="delivered">Mark as Delivered</option>
                        <option value="cancelled">Mark as Cancelled</option>
                      </select>
                      <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Customer Intelligence</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center gap-4 text-sm">
                      <Mail className="w-4 h-4 text-walnut" />
                      <span className="font-medium">{selectedOrder.customerInfo.email}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <Phone className="w-4 h-4 text-walnut" />
                      <span className="font-medium">{selectedOrder.customerInfo.phone}</span>
                    </div>
                    <div className="flex items-start gap-4 text-sm">
                      <MapPin className="w-4 h-4 text-walnut mt-0.5" />
                      <div className="flex flex-col">
                        <span className="font-medium">{selectedOrder.customerInfo.address}</span>
                        <span className="text-xs text-gray-400 uppercase tracking-tighter">{selectedOrder.customerInfo.city}, {selectedOrder.customerInfo.postalCode}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Order Contents</h4>
                  <div className="space-y-4 max-h-48 overflow-y-auto pr-2">
                    {selectedOrder.products.map((p, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="w-12 h-12 bg-cream border border-warm-beige flex-shrink-0">
                          <img src={p.image} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-near-black leading-tight truncate">{p.title}</p>
                          <div className="flex justify-between mt-1">
                            <span className="text-[9px] text-gray-400 uppercase font-bold">QTY: {p.quantity}</span>
                            <span className="text-xs font-medium">{formatCurrency(p.price)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-near-black text-white space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Total Settlement</span>
                    <span className="text-xl font-display font-bold">{formatCurrency(selectedOrder.totalPrice)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-mint-400">
                    <CheckCircle className="w-3.5 h-3.5" /> Paid via Cash on Delivery
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[600px] bg-cream/30 border border-dashed border-warm-beige flex flex-col items-center justify-center text-center p-10">
              <Package className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Select an order from the ledger to view full intelligence and fulfilment history.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}