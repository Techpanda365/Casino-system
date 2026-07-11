import React, { useState, useEffect } from 'react';

function BannerSlider({ banners }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!banners || banners.length < 2) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners]);

  if (!banners || banners.length === 0) return null;

  const goTo = (idx) => setCurrent(idx);
  const prev = () => setCurrent(prev => (prev - 1 + banners.length) % banners.length);
  const next = () => setCurrent(prev => (prev + 1) % banners.length);

  return (
    <div className="max-w-7xl mx-auto px-4 mt-4 relative">
      <div className="relative overflow-hidden rounded-lg" style={{ aspectRatio: '16/5' }}>
        {banners.map((b, idx) => (
          <a
            key={b._id}
            href={b.linkUrl || '#'}
            target={b.linkUrl ? '_blank' : undefined}
            rel={b.linkUrl ? 'noreferrer' : undefined}
            className={`absolute inset-0 transition-opacity duration-700 ${idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <img src={b.imageUrl} alt={b.title || 'Banner'} className="w-full h-full object-cover" />
            {b.title && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <span className="text-white text-sm font-medium">{b.title}</span>
              </div>
            )}
          </a>
        ))}
      </div>

      {banners.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition text-sm">‹</button>
          <button onClick={next} className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition text-sm">›</button>
          <div className="flex justify-center gap-1.5 mt-2">
            {banners.map((_, idx) => (
              <button key={idx} onClick={() => goTo(idx)}
                className={`w-2 h-2 rounded-full transition-all ${idx === current ? 'bg-amber-400 w-4' : 'bg-white/20 hover:bg-white/40'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default BannerSlider;
