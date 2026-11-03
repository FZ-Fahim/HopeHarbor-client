import { HeroBanner } from '@/components/home/hero-banner';
import { FeaturesSection } from '@/components/home/features-section';
import { RecentEventsSection } from '@/components/home/recent-events-section';
import { GallerySection } from '@/components/home/gallery-section';
import { NewsletterSection } from '@/components/home/newsletter-section';

export default function Home() {
  return (
    <main className="min-h-screen -mt-20">
      <HeroBanner />
      <FeaturesSection />
      <RecentEventsSection />
      <GallerySection />
      <NewsletterSection />
    </main>
  );
}
