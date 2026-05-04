export function StatsBar({ stats }: { stats?: {
  total_deals?: number;
  avg_return?: number;
  total_invested?: number;
  max_return?: number;
} }) {
  const fmt = (n: number) =>
    n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` :
    n >= 1000 ? `${(n / 1000).toFixed(0)}K` :
    String(n);

  const items = [
    { value: `${stats?.total_deals ?? 0}+`, label: 'עסקאות שנסגרו' },
    { value: `${stats?.avg_return ?? 0}%`, label: 'תשואה ממוצעת' },
    { value: stats?.total_invested ? fmt(stats.total_invested) : '0', label: 'הושקע בסך הכל' },
    { value: `${stats?.max_return ?? 0}%`, label: 'תשואה מקסימלית' },
  ];

  return (
    <div className="py-10" style={{ background: '#111827' }} dir="rtl">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {items.map(item => (
          <div key={item.label} className="group">
            <div
              className="text-3xl md:text-4xl font-black mb-1.5 transition-transform duration-300 group-hover:scale-110"
              style={{ color: '#F5A623' }}
            >
              {item.value}
            </div>
            <div className="text-sm text-slate-400 font-medium">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
