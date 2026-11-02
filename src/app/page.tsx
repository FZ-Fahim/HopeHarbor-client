import { HeroBanner } from '@/components/home/hero-banner';
import { FeaturesSection } from '@/components/home/features-section';
import { RecentEventsSection } from '@/components/home/recent-events-section';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroBanner />
      <FeaturesSection />
      <RecentEventsSection />
    </main>
  );
}