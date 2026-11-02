import { HeroBanner } from '@/components/home/hero-banner';
import { FeaturesSection } from '@/components/home/features-section';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroBanner />
      <FeaturesSection />
    </main>
  );
}