export function CtaBanner() {
  return (
    <section
      className="py-24 text-white"
      style={{ background: 'linear-gradient(135deg, #0A1F30 0%, #1B4F72 55%, #2E86AB 100%)' }}
      dir="rtl"
    >
      <div className="max-w-3xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
          🚀 מוכן לצעד הבא?
        </div>

        <h2 className="text-3xl md:text-4xl font-bold mb-5">
          מוכן למצוא את ההשקעה הבאה שלך?
        </h2>

        <p className="text-blue-200 text-lg mb-10 leading-relaxed max-w-xl mx-auto">
          פרסם מכרז חינם וקבל הצעות מספקים מוסמכים תוך 48 שעות
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="/post-tender"
            className="inline-flex items-center gap-2 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #F5A623, #E8920F)', boxShadow: '0 8px 24px rgba(245,166,35,0.35)' }}
          >
            📋 פרסם מכרז עכשיו
          </a>
          <a
            href="/providers"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-all duration-200"
          >
            👥 עיין בספקים
          </a>
        </div>

        <div className="flex flex-wrap gap-6 justify-center mt-10 text-sm text-blue-200">
          <span>✅ ללא עמלת הצלחה</span>
          <span>✅ פרסום חינמי לחלוטין</span>
          <span>✅ ספקים מאומתים</span>
        </div>
      </div>
    </section>
  );
}
