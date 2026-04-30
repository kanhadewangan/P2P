"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { LogOut, Send, Search, UserCircle, Wallet, History, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [balance, setBalance] = useState<number>(0);
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentId = payload.id;
        setCurrentUserId(currentId);

        const balanceRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/balance`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBalance(balanceRes.data.balance);

        const usersRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/bulk`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(usersRes.data || []);

        const txRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/transaction/transactions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTransactions(txRes.data || []);
      } catch (err: any) {
        if (err.response?.status === 403 || err.response?.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const filteredUsers = users.filter(user =>
    user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <UserCircle className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-white">Pay<span className="text-blue-500">Fast</span> App</span>
          </div>
          <div className="flex items-center gap-4 relative">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-slate-400 hover:text-blue-400 flex items-center gap-2 transition-colors text-sm font-medium border border-slate-800 px-4 py-2 rounded-full hover:bg-slate-800"
            >
              <History className="w-4 h-4" /> <span className="hidden sm:inline">History</span>
            </button>
            
            {showHistory && (
              <div className="absolute top-full mt-2 right-0 sm:right-auto sm:left-[-100px] w-80 max-h-96 overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50">
                <div className="p-4 border-b border-slate-800 sticky top-0 bg-slate-900/90 backdrop-blur-md">
                  <h3 className="font-bold text-white">Transaction History</h3>
                </div>
                <div className="p-2 space-y-1">
                  {transactions.length === 0 ? (
                    <p className="text-slate-500 text-center py-4 text-sm">No transactions yet.</p>
                  ) : (
                    transactions.map((tx: any) => {
                      const isSent = tx.fromUserId?._id === currentUserId;
                      const otherUser = isSent ? tx.toUserId : tx.fromUserId;
                      return (
                        <div key={tx._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-800 ${isSent ? 'text-red-400' : 'text-green-400'}`}>
                              {isSent ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-200">
                                {isSent ? 'Sent to' : 'Received from'}
                              </p>
                              <p className="text-xs text-slate-400">
                                {otherUser ? `${otherUser.firstname} ${otherUser.lastname}` : 'Unknown'}
                              </p>
                            </div>
                          </div>
                          <div className={`font-bold ${isSent ? 'text-red-400' : 'text-green-400'}`}>
                            {isSent ? '-' : '+'}${tx.amount}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-400 flex items-center gap-2 transition-colors text-sm font-medium border border-slate-800 px-4 py-2 rounded-full hover:bg-slate-800"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <p className="text-blue-100 font-medium mb-2">Available Balance</p>
          <div className="text-5xl font-black text-white flex items-center gap-4">
            <Wallet className="w-10 h-10 opacity-80" />
            ${balance.toFixed(2)}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-white">Send Money</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full md:w-80 bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map(user => (
              <div key={user._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-blue-500/50 transition-colors group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-lg font-bold text-white uppercase group-hover:bg-blue-600 transition-colors">
                    {user.firstname[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-200">{user.firstname} {user.lastname}</h3>
                    <p className="text-sm text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/transfer?id=${user._id}&name=${encodeURIComponent(user.firstname + ' ' + user.lastname)}`)}
                  className="w-full bg-slate-800 hover:bg-blue-600 text-white font-medium rounded-xl py-2.5 flex items-center justify-center gap-2 transition-colors"
                >
                  <Send className="w-4 h-4" /> Send Money
                </button>
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-800 rounded-2xl">
                <p className="text-slate-500">No users found</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
