'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { apiGet } from '@/lib/api';
import { PastDeal } from '@/types';
import { HeroSection } from '@/components/home/HeroSection';
import { StatsBar } from '@/components/home/StatsBar';
import { FomoSection } from '@/components/home/FomoSection';
import { HowItWorks } from '@/components/home/HowItWorks';
import { ProviderCategories } from '@/components/home/ProviderCategories';
import { CtaBanner } from '@/components/home/CtaBanner';

interface PastDealsResponse {
  data: PastDeal[];
  pagination: { total: number };
}

interface StatsResponse {
  total_deals: number;
  avg_return: number;
  total_invested: number;
  max_return: number;
}

export default function HomePage() {
  const { data: dealsData } = useQuery<PastDealsResponse>({
    queryKey: ['past-deals-home'],
    queryFn: () => apiGet('/past-deals?limit=6'),
  });

  const { data: stats } = useQuery<StatsResponse>({
    queryKey: ['past-deals-stats'],
    queryFn: () => apiGet('/past-deals/stats'),
  });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <HeroSection />

      {/* Stats bar */}
      <StatsBar stats={stats} />

      {/* FOMO Section — עסקאות עבר */}
      <FomoSection deals={dealsData?.data ?? []} total={dealsData?.pagination?.total ?? 0} />

      {/* איך זה עובד */}
      <HowItWorks />

      {/* קטגוריות ספקים */}
      <ProviderCategories />

      {/* CTA */}
      <CtaBanner />
    </div>
  );
}
