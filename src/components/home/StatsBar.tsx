export function StatsBar({ stats }: {
  stats?: { total_deals?: number; avg_return?: number; total_invested?: number; max_return?: number };
}) {
  const fmt = (n: number) =>
    n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` :
    n >= 1_000 ? `${(n / 1_000).toFixed(0)}K` : String(n);

  const items = [
    { value: `${stats?.total_deals ?? 0}+`, label: 'עסקאות שנסגרו' },
    { value: `${stats?.avg_return ?? 0}%`, label: 'תשואה ממוצעת' },
    { value: stats?.total_invested ? fmt(stats.total_invested) : '0', label: 'הושקע בסך הכל' },
    { value: `${stats?.max_return ?? 0}%`, label: 'תשואה מקסימלית' },
  ];

  return (
    <div style={{ background: 'var(--gray-50)', borderBottom: '0.5px solid var(--gray-100)', padding: '32px 0' }} dir="rtl">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, textAlign: 'center' }}>
        {items.map(item => (
          <div key={item.label} className="card-metric">
            <div style={{ fontSize: 22, fontWeight: 500, color: 'var(--gray-900)', marginBottom: 4 }}>
              {item.value}
            </div>
            <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
