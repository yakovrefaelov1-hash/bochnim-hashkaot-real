import type { Metadata } from 'next';
import { Heebo } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/Toaster';

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  variable: '--font-heebo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'בוחנים השקעות — פלטפורמה לחיפוש עסקאות נדל"ן',
  description: 'משקיעים מפרסמים מכרז. יזמים, יועצים וספקים מגישים הצעות. גלה עסקאות מהעבר עם תשואות אמיתיות.',
  keywords: 'השקעות נדל"ן, יזמים, יועצי השקעות, פרסייל, נדל"ן בחו"ל, מגרשים',
  openGraph: {
    title: 'בוחנים השקעות',
    description: 'מצא עסקאות נדל"ן מנצחות עם ספקים מנוסים',
    locale: 'he_IL',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <body className="min-h-screen bg-slate-50 font-heebo antialiased">
        <QueryProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
