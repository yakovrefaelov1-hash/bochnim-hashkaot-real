'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { TrendingUp, Menu, X } from 'lucide-react';

export function Header() {
  const { user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => { logout(); router.push('/'); };

  const navLinks = [
    { href: '/past-deals', label: 'עסקאות מוצלחות' },
    { href: '/providers', label: 'ספקים' },
    { href: '/tenders', label: 'מכרזים פעילים' },
    { href: '/blog', label: 'בלוג' },
  ];

  return (
    <header style={{
      background: 'var(--white)',
      borderBottom: '0.5px solid var(--gray-100)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 56,
      }}>
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontWeight: 500,
          color: 'var(--gray-900)',
          textDecoration: 'none',
          fontSize: 15,
        }}>
          <TrendingUp size={18} strokeWidth={1.5} />
          בוחנים השקעות
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 24, fontSize: 14, fontWeight: 400 }}>
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} style={{ color: 'var(--gray-500)', textDecoration: 'none', transition: 'color 0.15s ease' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--gray-900)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray-500)')}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/post-tender" className="btn-primary" style={{ fontSize: 13, padding: '8px 16px' }}>
            פרסם מכרז
          </Link>
          {!user && (
            <>
              <Link href="/auth/login" style={{ color: 'var(--gray-500)', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>כניסה</Link>
              <Link href="/auth/register" className="btn-secondary" style={{ fontSize: 13, padding: '7px 14px' }}>הרשמה</Link>
            </>
          )}
          {user && (
            <button onClick={handleLogout} style={{ color: 'var(--gray-500)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>התנתק</button>
          )}
        </div>
      </div>
    </header>
  );
}
