'use client';
import Link from 'next/link';
export function HeroSection() {
  return (
    <section style={{background:"linear-gradient(135deg,#0A1F30 0%,#1B4F72 50%,#2E86AB 100%)",color:"white",padding:"80px 0",position:"relative",overflow:"hidden"}} dir="rtl">
      <div style={{maxWidth:"1200px",margin:"0 auto",padding:"0 24px"}}>
        <div style={{maxWidth:"700px"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:"8px",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:"999px",padding:"6px 16px",fontSize:"0.875rem",fontWeight:"500",marginBottom:"24px"}}>
            <span style={{width:"8px",height:"8px",borderRadius:"50%",background:"#f5a623",display:"inline-block"}}/>
            פלטפורמה מספר 1 לחיפוש עסקאות נדלן בישראל
          </div>
          <h1 style={{fontSize:"3.5rem",fontWeight:"bold",lineHeight:"1.2",marginBottom:"24px"}}>
            מצא את העסקה הבאה שלך
            <span style={{color:"#f5a623"}}> בלחיצת כפתור</span>
          </h1>
          <p style={{fontSize:"1.2rem",color:"#bfdbfe",marginBottom:"32px",lineHeight:"1.7",maxWidth:"600px"}}>
            פרסם מכרז ב-60 שניות. קבל הצעות מיזמים, יועצים ומלווי משקיעים מנוסים.
            ראה עסקאות אמיתיות עם תשואות מוכחות — ואז תחליט.
          </p>
          <div style={{display:"flex",gap:"16px",flexWrap:"wrap"}}>
            <Link href="/post-tender" style={{background:"linear-gradient(135deg,#f5a623,#e8920f)",color:"white",padding:"16px 32px",borderRadius:"16px",textDecoration:"none",fontWeight:"bold",fontSize:"1.1rem",boxShadow:"0 8px 24px rgba(245,166,35,0.4)"}}>
              📋 פרסם מכרז חינם
            </Link>
            <Link href="/past-deals" style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",color:"white",padding:"16px 32px",borderRadius:"16px",textDecoration:"none",fontWeight:"bold",fontSize:"1.1rem"}}>
              📈 ראה עסקאות מוצלחות
            </Link>
          </div>
          <div style={{display:"flex",gap:"24px",marginTop:"40px",fontSize:"0.9rem",color:"#bfdbfe",flexWrap:"wrap"}}>
            <span>✅ ללא עמלת הצלחה</span>
            <span>✅ פרסום חינמי</span>
            <span>✅ ספקים מאומתים</span>
          </div>
        </div>
      </div>
    </section>
  );
}
