export function FomoSection({ deals, total }: { deals: { title?: string; return_rate?: number; location?: string; deal_type?: string }[]; total: number }) {
  return (
    <section className="py-20" style={{ background: '#F8FAFC' }} dir="rtl">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            🔥 מוכח בשטח
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-3">
            עסקאות שנסגרו
          </h2>
          <p className="text-slate-500 text-lg">
            {total} עסקאות הושלמו בהצלחה על ידי ספקים בפלטפורמה
          </p>
        </div>

        {deals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                style={{ boxShadow: '0 2px 12px rgba(15,23,42,0.06)' }}
              >
                <div className="flex items-start justify-between mb-4 gap-3">
                  <h3 className="font-bold text-[#0F172A] text-sm leading-snug flex-1">
                    {deal.title ?? 'עסקת נדל"ן'}
                  </h3>
                  <div
                    className="rounded-xl px-3 py-2 text-center flex-shrink-0 text-white"
                    style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
                  >
                    <div className="text-lg font-black leading-none">{deal.return_rate ?? 0}%</div>
                    <div className="text-xs opacity-80">תשואה</div>
                  </div>
                </div>
                {deal.location && (
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <span>📍</span>
                    <span>{deal.location}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <div className="text-4xl mb-3">📈</div>
            <p>עסקאות יתווספו בקרוב</p>
          </div>
        )}

        <div className="text-center mt-10">
          <a
            href="/past-deals"
            className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:gap-3 transition-all duration-200 text-sm"
          >
            ראה את כל העסקאות
            <span>←</span>
          </a>
        </div>
      </div>
    </section>
  );
}
