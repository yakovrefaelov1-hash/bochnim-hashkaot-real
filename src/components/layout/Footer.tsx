'use client';
import Link from 'next/link';
export function Footer() {
  return (
    <footer style={{background:"#0a1f30",color:"white",marginTop:"64px"}} dir="rtl">
      <div style={{maxWidth:"1200px",margin:"0 auto",padding:"48px 24px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"32px",marginBottom:"32px"}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"12px"}}>
              <span style={{fontSize:"1.5rem"}}>🏦</span>
              <span style={{fontWeight:"bold",fontSize:"1.1rem"}}>בוחנים השקעות</span>
            </div>
            <p style={{color:"#93c5fd",fontSize:"0.875rem",lineHeight:"1.6"}}>
              פלטפורמה מקצועית לחיבור בין משקיעים לספקי שירותי נדלן.
            </p>
          </div>
          <div>
            <h4 style={{fontWeight:"600",marginBottom:"12px",color:"#bfdbfe"}}>למשקיעים</h4>
            <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:"8px",fontSize:"0.875rem",color:"#93c5fd"}}>
              <li><Link href="/post-tender" style={{color:"#93c5fd",textDecoration:"none"}}>פרסם מכרז</Link></li>
              <li><Link href="/past-deals" style={{color:"#93c5fd",textDecoration:"none"}}>עסקאות מוצלחות</Link></li>
              <li><Link href="/providers" style={{color:"#93c5fd",textDecoration:"none"}}>חפש ספקים</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{fontWeight:"600",marginBottom:"12px",color:"#bfdbfe"}}>לספקים</h4>
            <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:"8px",fontSize:"0.875rem",color:"#93c5fd"}}>
              <li><Link href="/auth/register?role=provider" style={{color:"#93c5fd",textDecoration:"none"}}>הצטרף כספק</Link></li>
              <li><Link href="/subscribe" style={{color:"#93c5fd",textDecoration:"none"}}>תוכניות מחיר</Link></li>
              <li><Link href="/tenders" style={{color:"#93c5fd",textDecoration:"none"}}>מכרזים פעילים</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{fontWeight:"600",marginBottom:"12px",color:"#bfdbfe"}}>עזרה</h4>
            <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:"8px",fontSize:"0.875rem",color:"#93c5fd"}}>
              <li><a href="mailto:support@bochnim.co.il" style={{color:"#93c5fd",textDecoration:"none"}}>support@bochnim.co.il</a></li>
              <li><Link href="/terms" style={{color:"#93c5fd",textDecoration:"none"}}>תנאי שימוש</Link></li>
              <li><Link href="/privacy" style={{color:"#93c5fd",textDecoration:"none"}}>מדיניות פרטיות</Link></li>
            </ul>
          </div>
        </div>
        <div style={{borderTop:"1px solid #1e3a5f",paddingTop:"24px",textAlign:"center",fontSize:"0.75rem",color:"#64748b"}}>
          © {new Date().getFullYear()} בוחנים השקעות בעמ · כל הזכויות שמורות
        </div>
      </div>
    </footer>
  );
}
