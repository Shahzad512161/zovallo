export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-display text-walnut mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 border border-warm-beige shadow-sm">
          <h3 className="text-gray-500 text-sm uppercase tracking-wider">Total Orders</h3>
          <p className="text-3xl font-bold text-walnut">0</p>
        </div>
        <div className="bg-white p-6 border border-warm-beige shadow-sm">
          <h3 className="text-gray-500 text-sm uppercase tracking-wider">Total Products</h3>
          <p className="text-3xl font-bold text-walnut">4</p>
        </div>
        <div className="bg-white p-6 border border-warm-beige shadow-sm">
          <h3 className="text-gray-500 text-sm uppercase tracking-wider">Total Customers</h3>
          <p className="text-3xl font-bold text-walnut">0</p>
        </div>
      </div>
      
      <div className="mt-12 space-y-4">
        <h2 className="text-xl font-display text-walnut">Recent Activity</h2>
        <div className="bg-white border border-warm-beige h-64 flex items-center justify-center text-gray-400">
          No recent activity to display.
        </div>
      </div>
    </div>
  );
}
