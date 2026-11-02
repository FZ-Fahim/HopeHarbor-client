import { Camera, MapPin } from 'lucide-react';

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
    <section className="py-16 sm:py-24 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <Camera className="w-3.5 h-3.5" />
            <span>Community Moments</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Actions Captured on the Ground
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Real snapshots from grassroots volunteer drives, blanket handouts, and environmental efforts organized by our members.
          </p>
        </div>

        {/* Photo Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryPhotos.map((item, index) => (
            <div
              key={index}
              className="group relative rounded-3xl overflow-hidden aspect-[4/3] bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-200/80 dark:border-slate-800"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

              {/* Photo Caption Content */}
              <div className="absolute bottom-0 inset-x-0 p-5 text-white space-y-1.5">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/90 text-white backdrop-blur-sm">
                  {item.category}
                </span>
                <h3 className="text-base font-bold leading-snug">
                  {item.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
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