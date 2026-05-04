'use client';

import Link from 'next/link';
import { TrendingUp } from 'lucide-react';

export function AuthLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '56px 24px',
      background: 'var(--white)',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontWeight: 500, fontSize: 15, color: 'var(--gray-900)', textDecoration: 'none',
          }}>
            <TrendingUp size={18} strokeWidth={1.5} />
            בוחנים השקעות
          </Link>
          <h1 style={{ fontSize: 18, fontWeight: 500, color: 'var(--gray-900)', marginTop: 20 }}>{title}</h1>
        </div>

        <div className="card" style={{ padding: 32 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
