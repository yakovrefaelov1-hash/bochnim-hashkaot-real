'use client';
import Link from 'next/link';

export default function SubscribeCancelPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center card p-8">
        <div className="text-4xl mb-4">😔</div>
        <h1 className="text-xl font-bold text-slate-800 mb-3">התשלום בוטל</h1>
        <p className="text-slate-500 mb-6 text-sm">לא בוצע חיוב. תוכל לנסות שוב בכל עת.</p>
        <div className="flex gap-3">
          <Link href="/subscribe" className="flex-1 btn-primary text-center py-2.5 rounded-xl text-sm">נסה שוב</Link>
          <Link href="/" className="flex-1 btn-outline text-center py-2.5 rounded-xl text-sm">דף הבית</Link>
        </div>
      </div>
    </div>
  );
}
