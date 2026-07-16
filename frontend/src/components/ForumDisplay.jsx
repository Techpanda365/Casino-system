import React from 'react';
import { Link, useParams } from 'react-router-dom';

const SECTION_LABELS = {
  'special-game': 'Special Game Zone',
  'guessing-forum': 'Guessing Forum',
  'expert-forum': 'Expert Forum',
  'trick-zone': 'Kalyan Trick Forum',
  'fix-game': 'All Market Free Fix Game',
  'ratan-khatri': 'Ratan Khatri Fix Panel Chart',
  'final-trick': 'Final Number Trick Chart',
  'evergreen-trick': 'EverGreen Trick Zone'
};

const SECTION_ORDER = ['special-game', 'guessing-forum', 'expert-forum', 'trick-zone', 'fix-game', 'ratan-khatri', 'final-trick', 'evergreen-trick'];

function ForumDisplay({ forums }) {
  const { slug } = useParams();
  if (!forums || forums.length === 0) return null;

  const sections = SECTION_ORDER
    .map(s => ({ key: s, label: SECTION_LABELS[s] || s, items: forums.filter(f => f.section === s) }))
    .filter(s => s.items.length > 0);

  return (
    <section className="mt-2 max-w-7xl mx-auto px-4 space-y-3">
      {sections.map(section => (
        <div key={section.key}>
          <Link to={`/site/${slug}/forum/${section.key}`} className="block">
            <div className="bg-gradient-to-r from-amber-500/20 to-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-2 text-center hover:border-amber-400/40 hover:bg-amber-500/[0.04] transition-all group">
              <span className="text-amber-400 font-bold text-sm uppercase tracking-wider group-hover:text-amber-300 transition">{section.label}</span>
            </div>
          </Link>
        </div>
      ))}
    </section>
  );
}

export default ForumDisplay;
