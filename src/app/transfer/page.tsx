"use client";
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

function TransferContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const name = searchParams.get('name');

  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleTransfer = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setErrorMessage("Please enter a valid amount");
      setStatus('error');
      return;
    }

    try {
      setStatus('loading');
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/transaction/transaction`, {
        toId: id,
        amount: Number(amount)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus('success');
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Transaction failed');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Transfer Successful!</h2>
          <p className="text-slate-400">You have successfully sent ${amount} to {name}.</p>
        </div>
        <Link href="/dashboard" className="inline-block w-full bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl py-3 transition-colors mt-4">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold text-white uppercase shadow-lg shadow-blue-500/20">
          {name ? name[0] : '?'}
        </div>
        <div>
          <p className="text-sm text-slate-400">Transferring to</p>
          <h3 className="text-xl font-bold text-slate-100">{name || 'Unknown User'}</h3>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300 ml-1">Amount (in USD)</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-500">$</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-3xl font-bold text-white placeholder:text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-right"
          />
        </div>
      </div>

      {status === 'error' && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}

      <button
        onClick={handleTransfer}
        disabled={status === 'loading'}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl py-4 transition-all active:scale-[0.98] disabled:opacity-50 text-lg mt-8 shadow-xl shadow-blue-500/20 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000" />
        {status === 'loading' ? 'Processing...' : `Send $${amount || '0'}`}
      </button>
    </div>
  );
}

export default function Transfer() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden">
          <Suspense fallback={<div className="text-slate-400 text-center py-8">Loading transfer details...</div>}>
            <TransferContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
