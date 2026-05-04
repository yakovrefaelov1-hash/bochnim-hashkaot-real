import Link from 'next/link';
import { Calendar, ArrowLeft, BookOpen } from 'lucide-react';

const CATEGORIES = ['הכל', 'השקעות נדל"ן', 'טיפים למשקיעים', 'שוק הנדל"ן', 'ספקים מומלצים'];

const ARTICLES = [
  {
    id: 1,
    title: '5 טעויות נפוצות שמשקיעים מתחילים עושים בנדל"ן',
    desc: 'לפני שאתה קופץ להשקעה הבאה שלך, קרא את המדריך הזה. ריכזנו את הטעויות הנפוצות ביותר — ואיך להימנע מהן.',
    category: 'טיפים למשקיעים',
    date: '18 באפריל 2025',
    readTime: '5 דקות קריאה',
    featured: true,
  },
  {
    id: 2,
    title: 'מה זה פריסייל ולמה משקיעים מנוסים אוהבים אותו?',
    desc: 'פריסייל הוא אחד המסלולים הפופולריים ביותר כיום. הסברנו מה זה, כמה רווח ריאלי אפשר לצפות, ומה הסיכונים.',
    category: 'השקעות נדל"ן',
    date: '10 באפריל 2025',
    readTime: '7 דקות קריאה',
    featured: false,
  },
  {
    id: 3,
    title: 'שוק הנדל"ן בישראל 2025 — מה קורה ולאן הולכים?',
    desc: 'ניתוח עדכני של מגמות השוק: מחירים, היצע וביקוש, ואזורים חמים להשקעה השנה.',
    category: 'שוק הנדל"ן',
    date: '3 באפריל 2025',
    readTime: '6 דקות קריאה',
    featured: false,
  },
  {
    id: 4,
    title: 'איך לבחור יועץ השקעות נדל"ן שאפשר לסמוך עליו',
    desc: '7 שאלות שאתה חייב לשאול לפני שאתה בוחר יועץ. לא כל מי שנקרא "יועץ השקעות" הוא אחד.',
    category: 'ספקים מומלצים',
    date: '28 במרץ 2025',
    readTime: '4 דקות קריאה',
    featured: false,
  },
  {
    id: 5,
    title: 'השקעה בנדל"ן בחו"ל — גרמניה, פורטוגל או ארה"ב?',
    desc: 'השוואה מעמיקה בין שלוש יעדות פופולריות: תשואות ממוצעות, מיסוי, ורמת סיכון.',
    category: 'השקעות נדל"ן',
    date: '20 במרץ 2025',
    readTime: '8 דקות קריאה',
    featured: false,
  },
  {
    id: 6,
    title: 'מה לשים בתיאור המכרז שלך כדי לקבל הצעות טובות יותר',
    desc: 'ספקים מנוסים חושפים: מה גורם להם לבחור להגיש הצעה למכרז אחד ולדלג על אחר.',
    category: 'טיפים למשקיעים',
    date: '12 במרץ 2025',
    readTime: '3 דקות קריאה',
    featured: false,
  },
];

const CATEGORY_BADGE: Record<string, { bg: string; color: string }> = {
  'השקעות נדל"ן': { bg: 'var(--blue-100)',   color: 'var(--blue-600)' },
  'טיפים למשקיעים': { bg: 'var(--amber-100)', color: 'var(--amber-600)' },
  'שוק הנדל"ן':    { bg: 'var(--green-100)',  color: 'var(--green-600)' },
  'ספקים מומלצים': { bg: 'var(--purple-50)',  color: 'var(--purple-700)' },
};

export default function BlogPage() {
  const featured = ARTICLES.find(a => a.featured);
  const rest = ARTICLES.filter(a => !a.featured);

  return (
    <div style={{ background: 'var(--white)', minHeight: '100vh' }} dir="rtl">
      {/* Page header */}
      <div style={{ borderBottom: '0.5px solid var(--gray-100)', padding: '56px 24px 48px', background: 'var(--white)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'var(--gray-50)', border: '0.5px solid var(--gray-100)',
            borderRadius: 'var(--radius-pill)', padding: '3px 12px',
            fontSize: 12, fontWeight: 500, color: 'var(--gray-500)', marginBottom: 16,
          }}>
            <BookOpen size={12} strokeWidth={1.5} />
            בלוג השקעות
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 500, color: 'var(--gray-900)', marginBottom: 8 }}>מדריכים ותובנות</h1>
          <p style={{ fontSize: 15, color: 'var(--gray-500)' }}>
            ידע מעשי להשקעות נדל"ן חכמות — מאנשי מקצוע עם ניסיון אמיתי בשטח
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 24px' }}>
        {/* Category filter */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 40 }}>
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat}
              style={{
                padding: '6px 14px', borderRadius: 'var(--radius-pill)',
                fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s ease',
                background: i === 0 ? 'var(--gray-900)' : 'var(--white)',
                color: i === 0 ? 'var(--white)' : 'var(--gray-500)',
                border: i === 0 ? 'none' : '0.5px solid var(--gray-100)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured article */}
        {featured && (
          <div className="card" style={{ marginBottom: 24, padding: 32 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span style={{
                background: 'var(--gray-900)', color: 'var(--white)',
                fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 'var(--radius-pill)',
              }}>
                מאמר מומלץ
              </span>
              {CATEGORY_BADGE[featured.category] && (
                <span style={{
                  background: CATEGORY_BADGE[featured.category].bg,
                  color: CATEGORY_BADGE[featured.category].color,
                  fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 'var(--radius-pill)',
                }}>
                  {featured.category}
                </span>
              )}
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 500, color: 'var(--gray-900)', marginBottom: 10 }}>
              {featured.title}
            </h2>
            <p style={{ fontSize: 14, color: 'var(--gray-500)', lineHeight: 1.6, marginBottom: 20 }}>{featured.desc}</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: 'var(--gray-500)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Calendar size={13} strokeWidth={1.5} />
                  {featured.date}
                </span>
                <span>{featured.readTime}</span>
              </div>
              <button className="btn-ghost" style={{ padding: 0, fontSize: 13 }}>
                קרא עוד
                <ArrowLeft size={13} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        )}

        {/* Articles grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 48 }}>
          {rest.map(article => (
            <article key={article.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: 10 }}>
                {CATEGORY_BADGE[article.category] && (
                  <span style={{
                    background: CATEGORY_BADGE[article.category].bg,
                    color: CATEGORY_BADGE[article.category].color,
                    fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 'var(--radius-pill)',
                  }}>
                    {article.category}
                  </span>
                )}
              </div>
              <h3 style={{ fontWeight: 500, color: 'var(--gray-900)', fontSize: 14, lineHeight: 1.4, marginBottom: 8, flex: 1 }}>
                {article.title}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.5, marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {article.desc}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '0.5px solid var(--gray-100)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--gray-500)' }}>
                  <Calendar size={12} strokeWidth={1.5} />
                  {article.date}
                </span>
                <button className="btn-ghost" style={{ padding: 0, fontSize: 12 }}>
                  קרא עוד
                  <ArrowLeft size={12} strokeWidth={1.5} />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter */}
        <div className="card" style={{ padding: 40, textAlign: 'center', background: 'var(--gray-50)' }}>
          <h3 style={{ fontSize: 18, fontWeight: 500, color: 'var(--gray-900)', marginBottom: 8 }}>קבל מאמרים חדשים ישירות למייל</h3>
          <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 24 }}>ללא ספאם. רק תוכן איכותי, פעם בשבוע.</p>
          <div style={{ display: 'flex', gap: 8, maxWidth: 360, margin: '0 auto' }}>
            <input
              type="email"
              placeholder="your@email.com"
              dir="ltr"
              className="input-field"
              style={{ flex: 1, fontSize: 13 }}
            />
            <button className="btn-primary" style={{ flexShrink: 0, fontSize: 13 }}>
              הרשם
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
