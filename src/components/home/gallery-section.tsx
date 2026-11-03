import { MapPin } from 'lucide-react';

const galleryPhotos = [
  {
    title: 'Winter Warmth Clothes Drive',
    location: 'Mirpur 10, Dhaka',
    category: 'Donation',
    image:
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Blanket Distribution for the Needy',
    location: 'Mohammadpur Town Hall, Dhaka',
    category: 'Winter Relief',
    image:
      'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Neighborhood Canal Cleanup Initiative',
    location: 'Rayer Bazar, Dhaka',
    category: 'Environment',
    image:
      'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Urban Tree Plantation Week',
    location: 'Uttara Sector 11, Dhaka',
    category: 'Afforestation',
    image:
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Free Health Screening & Medicine Drive',
    location: 'Badda, Dhaka',
    category: 'Healthcare',
    image:
      'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Youth Education & Book Sharing Hub',
    location: 'Dhanmondi Lake, Dhaka',
    category: 'Education',
    image:
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800',
  },
];

export function GallerySection() {
  return (
    <section className="bg-slate-50/60 dark:bg-[#0d131f] border-y border-slate-200/80 dark:border-slate-800 transition-colors py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
            <span>📸 Ground Reality</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Documenting Community Compassion
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 sm:text-base">
            Unfiltered moments from winter warmth drives in Mirpur, blanket handouts in Mohammadpur, and urban afforestation.
          </p>
        </div>

        {/* Photo Gallery Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {galleryPhotos.map((item, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900 shadow-sm ${index === 0 ? 'aspect-[4/3] lg:col-span-2 lg:row-span-2 lg:h-full lg:aspect-auto' : index === 3 ? 'aspect-[4/3]' : 'aspect-[16/10]'}`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17] via-slate-950/40 to-transparent" />

              {/* Photo Caption Content */}
              <div className="absolute inset-x-0 bottom-0 space-y-1.5 p-5 text-white">
                <span className="inline-block rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold text-amber-300 backdrop-blur-sm">
                  {item.category}
                </span>
                <h3 className="text-base font-bold leading-snug">
                  {item.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                  <span>{item.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
