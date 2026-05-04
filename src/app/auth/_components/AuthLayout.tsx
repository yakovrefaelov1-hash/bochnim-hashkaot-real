'use client';

import Link from 'next/link';

export function AuthLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-14"
      style={{ background: 'linear-gradient(160deg, #EFF6FF 0%, #FFFFFF 50%, #F0F9FF 100%)' }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 font-bold text-xl hover:opacity-80 transition-opacity"
            style={{ color: '#1B4F72' }}
          >
            <span className="text-3xl">🏦</span>
            בוחנים השקעות
          </Link>
          <div className="mt-5 w-12 h-1 rounded-full mx-auto" style={{ background: 'linear-gradient(135deg, #1B4F72, #2E86AB)' }} />
          <h1 className="text-xl font-bold mt-4" style={{ color: '#0F172A' }}>{title}</h1>
        </div>

        <div
          className="bg-white rounded-2xl p-7 md:p-9"
          style={{ boxShadow: '0 8px 40px rgba(27,79,114,0.12)', border: '1px solid #E2E8F0' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
