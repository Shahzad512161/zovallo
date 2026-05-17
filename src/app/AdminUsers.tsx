import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Shield, 
  User as UserIcon,
  Mail,
  Calendar,
  MoreVertical,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User } from '../types';

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setUsers(snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as User)));
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAdmin = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, { role: newRole });
      fetchUsers();
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("Failed to update user role");
    }
  };

  const filteredUsers = users.filter(u => 
    u.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display text-near-black uppercase tracking-tight">Customer Intelligence</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your boutique's growing community.</p>
        </div>
        <div className="flex items-center gap-2 px-6 py-3 bg-mint-50 text-mint-700 border border-mint-200">
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">{users.length} Active Records</span>
        </div>
      </div>

      <div className="bg-white border border-warm-beige">
        <div className="p-6 border-b border-warm-beige flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name, email, or account ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-cream border-none py-3 pl-12 pr-4 text-sm focus:ring-1 focus:ring-gold"
            />
          </div>
          <button className="w-full md:w-auto bg-white border border-warm-beige px-6 py-3 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-cream">
            <Filter className="w-4 h-4" /> Filter by Segment
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-cream/50">
                <th className="px-8 py-5 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Identity</th>
                <th className="px-8 py-5 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Communication</th>
                <th className="px-8 py-5 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Joined</th>
                <th className="px-8 py-5 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Authority</th>
                <th className="px-8 py-5 text-right text-[10px] font-bold uppercase tracking-widest text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-beige">
              {loading ? (
                <tr><td colSpan={5} className="px-8 py-12 text-center text-gold text-[10px] uppercase font-bold tracking-widest">Accessing records...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-12 text-center text-gray-400 text-sm">No customers found in your database.</td></tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.uid} className="hover:bg-cream/20 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-cream rounded-full flex items-center justify-center border border-warm-beige text-near-black">
                          <UserIcon className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-near-black">{user.displayName || 'Anonymous Partner'}</span>
                          <span className="text-[10px] font-mono text-gray-400">ID: {user.uid.slice(0, 12).toUpperCase()}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-xs text-gray-666">
                        <Mail className="w-3.5 h-3.5 text-walnut" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {user.createdAt?.toDate().toLocaleDateString('en-GB') || 'N/A'}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1.5 w-fit ${
                        user.role === 'admin' ? 'bg-near-black text-gold border border-gold' : 'bg-warm-beige text-walnut'
                      }`}>
                        {user.role === 'admin' && <Shield className="w-3 h-3" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => toggleAdmin(user.uid, user.role)}
                          className="p-2 text-near-black hover:text-gold transition-colors"
                          title={user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-near-black transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
