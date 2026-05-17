import React, { useEffect, useState } from 'react';
import { 
  ShoppingBag, 
  Package, 
  Users, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter
} from 'lucide-react';
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { formatCurrency } from '../lib/utils';
import { Order, Product, User } from '../types';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    totalCustomers: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [ordersSnap, productsSnap, usersSnap] = await Promise.all([
          getDocs(collection(db, 'orders')),
          getDocs(collection(db, 'products')),
          getDocs(collection(db, 'users'))
        ]);

        const orders = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

        setStats({
          totalOrders: ordersSnap.size,
          totalProducts: productsSnap.size,
          totalRevenue,
          totalCustomers: usersSnap.size
        });

        // Get 5 recent orders
        const recentQ = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(5));
        const recentSnap = await getDocs(recentQ);
        setRecentOrders(recentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const cards = [
    { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: TrendingUp, color: 'bg-mint-50 text-mint-700', growth: '+12.5%', isUp: true },
    { label: 'Total Orders', value: stats.totalOrders.toString(), icon: ShoppingBag, color: 'bg-gold/10 text-near-black', growth: '+8.2%', isUp: true },
    { label: 'Total products', value: stats.totalProducts.toString(), icon: Package, color: 'bg-near-black text-white', growth: '3 New', isUp: true },
    { label: 'Total Customers', value: stats.totalCustomers.toString(), icon: Users, color: 'bg-warm-beige text-walnut', growth: '-2.4%', isUp: false },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-sm font-bold uppercase tracking-widest animate-pulse">Loading Analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display text-near-black uppercase tracking-tight">Executive Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Real-time overview of your furniture boutique.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-warm-beige px-4 py-2 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-cream transition-colors">
            <Filter className="w-3.5 h-3.5" /> Filter
          </button>
          <button className="bg-near-black text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gold transition-colors">
            <Calendar className="w-3.5 h-3.5" /> This Month
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white border border-warm-beige p-6 relative overflow-hidden group">
            <div className="flex justify-between items-start relative z-10">
              <div className={`p-3 ${card.color}`}>
                <card.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold ${card.isUp ? 'text-mint-700' : 'text-red-500'}`}>
                {card.growth} {card.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              </div>
            </div>
            <div className="mt-8 relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{card.label}</p>
              <h3 className="text-2xl font-display font-bold text-near-black">{card.value}</h3>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-cream/30 rounded-full translate-x-16 -translate-y-16 group-hover:scale-110 transition-transform duration-500" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white border border-warm-beige">
          <div className="p-6 border-b border-warm-beige flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest text-near-black">Recent Orders</h3>
            <Link to="/admin/orders" className="text-[10px] font-bold uppercase tracking-widest text-gold hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-cream/50">
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Order ID</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Customer</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Total</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-beige">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-cream/20 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold">#{order.id.slice(-6).toUpperCase()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-near-black">{order.customerInfo.fullName}</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-tighter">{order.customerInfo.city}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium">{formatCurrency(order.totalPrice)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full ${
                        order.orderStatus === 'delivered' ? 'bg-mint-50 text-mint-700' :
                        order.orderStatus === 'pending' ? 'bg-gold/10 text-walnut' :
                        'bg-gray-100 text-gray-400'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[10px] font-bold uppercase tracking-widest text-near-black hover:text-gold transition-colors">Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Stock Alert */}
        <div className="space-y-6">
          <div className="bg-near-black text-white p-8 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest">Global Settings</h3>
            <div className="space-y-4">
              <button className="w-full bg-white/10 hover:bg-white/20 py-3 rounded text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                Manage Promotions
              </button>
              <button className="w-full bg-gold text-near-black py-3 rounded text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                Export Sales Report
              </button>
            </div>
          </div>

          <div className="bg-white border border-warm-beige p-6 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-near-black">Inventory Alerts</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-red-50 border-l-4 border-red-500">
                <div className="flex-1">
                  <p className="text-xs font-bold text-near-black">Royal Velvet Sofa</p>
                  <p className="text-[10px] text-red-500 font-bold uppercase">Only 2 in stock</p>
                </div>
                <button className="text-[9px] font-bold uppercase tracking-widest text-near-black hover:underline">Restock</button>
              </div>
              <div className="flex items-center gap-4 p-3 bg-gold/5 border-l-4 border-gold">
                <div className="flex-1">
                  <p className="text-xs font-bold text-near-black">Scandinavian Table</p>
                  <p className="text-[10px] text-walnut font-bold uppercase">8 in stock</p>
                </div>
                <button className="text-[9px] font-bold uppercase tracking-widest text-near-black hover:underline">View</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Missing Link import
import { Link } from 'react-router-dom';
