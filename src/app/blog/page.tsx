import Link from 'next/link';
import { Calendar, Tag, ArrowLeft, BookOpen } from 'lucide-react';

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

const CATEGORY_COLORS: Record<string, string> = {
  'השקעות נדל"ן': 'bg-blue-50 text-blue-700',
  'טיפים למשקיעים': 'bg-amber-50 text-amber-700',
  'שוק הנדל"ן': 'bg-emerald-50 text-emerald-700',
  'ספקים מומלצים': 'bg-purple-50 text-purple-700',
};

export default function BlogPage() {
  const featured = ARTICLES.find(a => a.featured);
  const rest = ARTICLES.filter(a => !a.featured);

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Page header */}
      <div className="border-b border-slate-100 py-14 px-4" style={{ background: 'linear-gradient(160deg, #EFF6FF 0%, #FFFFFF 60%)' }}>
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            <BookOpen className="w-4 h-4" strokeWidth={1.75} />
            בלוג השקעות
          </div>
          <h1 className="text-4xl font-bold text-[#0F172A] mb-3">מדריכים ותובנות</h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            ידע מעשי להשקעות נדל"ן חכמות — מאנשי מקצוע עם ניסיון אמיתי בשטח
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                cat === 'הכל'
                  ? 'text-white border-transparent'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-primary/40 hover:text-primary'
              }`}
              style={cat === 'הכל' ? { background: 'linear-gradient(135deg, #1B4F72, #2E86AB)', border: 'none' } : {}}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured article */}
        {featured && (
          <div
            className="rounded-2xl overflow-hidden border border-slate-100 mb-10 hover:shadow-lg transition-all duration-300 group"
            style={{ boxShadow: '0 2px 12px rgba(15,23,42,0.06)' }}
          >
            <div
              className="h-3 w-full"
              style={{ background: 'linear-gradient(135deg, #1B4F72, #2E86AB)' }}
            />
            <div className="p-8 md:p-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                  מאמר מומלץ
                </span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${CATEGORY_COLORS[featured.category]}`}>
                  {featured.category}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] mb-3 group-hover:text-primary transition-colors">
                {featured.title}
              </h2>
              <p className="text-slate-500 leading-relaxed mb-6 max-w-2xl">{featured.desc}</p>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
                    {featured.date}
                  </span>
                  <span>{featured.readTime}</span>
                </div>
                <button
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:gap-3 transition-all duration-200"
                >
                  קרא עוד
                  <ArrowLeft className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Articles grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map(article => (
            <article
              key={article.id}
              className="rounded-2xl border border-slate-100 bg-white overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col"
              style={{ boxShadow: '0 2px 12px rgba(15,23,42,0.06)' }}
            >
              <div
                className="h-1.5 w-full"
                style={{ background: 'linear-gradient(135deg, #1B4F72, #2E86AB)' }}
              />
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[article.category]}`}>
                    {article.category}
                  </span>
                </div>
                <h3 className="font-bold text-[#0F172A] text-base leading-snug mb-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                  {article.desc}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
                    {article.date}
                  </div>
                  <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:gap-2.5 transition-all duration-200">
                    קרא עוד
                    <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div
          className="mt-16 rounded-2xl p-8 md:p-10 text-center text-white"
          style={{ background: 'linear-gradient(135deg, #0A1F30 0%, #1B4F72 60%, #2E86AB 100%)' }}
        >
          <h3 className="text-xl font-bold mb-2">קבל מאמרים חדשים ישירות למייל</h3>
          <p className="text-blue-200 text-sm mb-6">ללא ספאם. רק תוכן איכותי, פעם בשבוע.</p>
          <div className="flex gap-3 max-w-sm mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              dir="ltr"
              className="flex-1 rounded-xl px-4 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white flex-shrink-0 transition-all duration-200"
              style={{ background: 'linear-gradient(135deg, #F5A623, #E8920F)' }}
            >
              הרשם
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
