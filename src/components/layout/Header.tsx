'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export function Header() {
  const { user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => { logout(); router.push('/'); };

  return (
    <header style={{background:"white",borderBottom:"1px solid #e2e8f0",position:"sticky",top:0,zIndex:50,boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
      <div style={{maxWidth:"1200px",margin:"0 auto",padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",height:"64px"}}>
        <Link href="/" style={{display:"flex",alignItems:"center",gap:"8px",fontWeight:"bold",color:"#1b4f72",textDecoration:"none",fontSize:"1.1rem"}}>
          🏦 בוחנים השקעות
        </Link>
        <nav style={{display:"flex",alignItems:"center",gap:"24px",fontSize:"0.9rem",fontWeight:"500",color:"#475569"}}>
          <Link href="/past-deals" style={{color:"#475569",textDecoration:"none"}}>עסקאות מוצלחות</Link>
          <Link href="/providers" style={{color:"#475569",textDecoration:"none"}}>ספקים</Link>
          <Link href="/tenders" style={{color:"#475569",textDecoration:"none"}}>מכרזים פעילים</Link>
        </nav>
        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
          <Link href="/post-tender" style={{background:"linear-gradient(135deg,#f5a623,#e8920f)",color:"white",padding:"8px 20px",borderRadius:"10px",textDecoration:"none",fontWeight:"bold",fontSize:"0.9rem"}}>
            פרסם מכרז חינם
          </Link>
          {!user && (
            <>
              <Link href="/auth/login" style={{color:"#1b4f72",textDecoration:"none",fontWeight:"500",fontSize:"0.9rem"}}>כניסה</Link>
              <Link href="/auth/register" style={{border:"2px solid #1b4f72",color:"#1b4f72",padding:"6px 16px",borderRadius:"10px",textDecoration:"none",fontWeight:"500",fontSize:"0.9rem"}}>הרשמה</Link>
            </>
          )}
          {user && (
            <button onClick={handleLogout} style={{color:"#dc2626",background:"none",border:"none",cursor:"pointer",fontWeight:"500"}}>התנתק</button>
          )}
        </div>
      </div>
    </header>
  );
}
