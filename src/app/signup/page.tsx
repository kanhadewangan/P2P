"use client";
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Mail, Lock, User, UserSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/signup`, formData);
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-slate-400">Join PayFast and start transferring.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">First Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-light"
                placeholder="John"
                value={formData.firstname}
                onChange={e => setFormData({ ...formData, firstname: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Last Name</label>
            <div className="relative">
              <UserSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-light"
                placeholder="Doe"
                value={formData.lastname}
                onChange={e => setFormData({ ...formData, lastname: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="email"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-light"
                placeholder="john@example.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="password"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-light"
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl py-3 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 mt-6"
          >
            {loading ? 'Creating...' : 'Sign Up'}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-500 hover:text-blue-400 font-medium transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
