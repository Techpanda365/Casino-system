import React, { forwardRef } from 'react';

const SECTION_ORDER = [
  'weekly', 'weekly-patti', 'weekly-open-close', 'weekly-jodi',
  'cardlist', 'card-list-220',
  'jodi-count', 'jodi-family', 'penal-count', 'penal-total'
];

const SECTION_LABELS = {
  'weekly': 'Weekly Charts',
  'weekly-patti': 'Weekly Patti/Penal Chart',
  'weekly-open-close': 'Weekly Open/Close Line',
  'weekly-jodi': 'Weekly Jodi Chart',
  'cardlist': 'Card Lists',
  'card-list-220': 'All 220 Card List',
  'jodi-count': 'Matka Jodi Count Chart',
  'jodi-family': 'Matka Jodi Family Chart',
  'penal-count': 'Penal Count Chart',
  'penal-total': 'Penal Total Chart'
};

const ChartsDisplay = forwardRef(({ charts, selectedMarket, onClearFilter }, ref) => {
  if (charts.length === 0) return null;

  const filtered = selectedMarket
    ? charts.filter(c => c.marketName?.toLowerCase() === selectedMarket.toLowerCase())
    : charts;

  const renderCards = (items) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {items.map((c) => (
        <div key={c._id} className="bg-white/[0.03] border border-white/[0.12] rounded-lg overflow-hidden hover:border-amber-500/15 transition-all duration-300">
          <div className="bg-gradient-to-r from-amber-500/15 to-amber-500/5 border-b border-white/[0.12] px-3 py-1.5 text-center">
            <span className="text-amber-400/80 font-semibold text-sm">{c.title}</span>
          </div>
          <div className="p-3">
            <div className="text-slate-400 text-xs font-mono leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: c.content }} />
          </div>
        </div>
      ))}
    </div>
  );

  const sections = SECTION_ORDER
    .map(type => ({ type, items: filtered.filter(c => c.type === type), label: SECTION_LABELS[type] || type }))
    .filter(s => s.items.length > 0);

  return (
    <section ref={ref} className="mt-2 max-w-7xl mx-auto px-4 space-y-2 scroll-mt-20">
      {selectedMarket && (
        <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
          <span className="text-amber-400 text-sm font-semibold">Showing charts for: {selectedMarket}</span>
          <button onClick={onClearFilter} className="text-slate-400 text-xs hover:text-white transition px-2 py-1 border border-white/[0.12] rounded">Clear Filter</button>
        </div>
      )}
      {sections.map(section => (
        <div key={section.type}>
          <div className="bg-gradient-to-r from-amber-500/20 to-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-1.5 mb-2 text-center">
            <span className="text-amber-400 font-bold text-sm uppercase tracking-wider">{section.label}</span>
          </div>
          {renderCards(section.items)}
        </div>
      ))}
      {filtered.length === 0 && selectedMarket && (
        <div className="text-center py-8 text-slate-500 text-sm">No charts found for <span className="text-amber-400">{selectedMarket}</span>. Add charts in admin panel.</div>
      )}
    </section>
  );
});

ChartsDisplay.displayName = 'ChartsDisplay';
export default ChartsDisplay;
