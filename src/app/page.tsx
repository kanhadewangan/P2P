import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0px); }
        }
        .blob { animation: float 15s infinite ease-in-out alternate; }
        .blob-2 { animation: float 20s infinite ease-in-out alternate-reverse; }
        
        .fade-in-up {
          opacity: 0;
          animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
      `}} />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="blob absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[120px]" />
        <div className="blob-2 absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-2xl text-center space-y-8">
        <h1 className="fade-in-up text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-slate-400 drop-shadow-sm">
          Pay<span className="text-blue-500">Fast</span>
        </h1>
        <p className="fade-in-up delay-100 text-xl md:text-2xl text-slate-400 font-light">
          The future of fast, secure, and beautiful digital payments.
        </p>
        
        <div className="fade-in-up delay-200 flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link 
            href="/signup" 
            className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 rounded-full font-semibold hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.3)]"
          >
            Get Started
          </Link>
          <Link 
            href="/login" 
            className="w-full sm:w-auto px-8 py-4 bg-slate-800 text-white rounded-full font-semibold hover:bg-slate-700 transition-all border border-slate-700 hover:border-slate-600 hover:scale-105 active:scale-95"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
