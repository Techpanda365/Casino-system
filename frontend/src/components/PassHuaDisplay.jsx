import React from 'react';

function PassHuaDisplay({ data }) {
  const colors = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444', '#f59e0b'];
  const [borderColor, setBorderColor] = React.useState(colors[0]);

  React.useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % colors.length;
      setBorderColor(colors[i]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!data || !data.entries || data.entries.length === 0) return null;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  return (
    <section className="mt-2 max-w-7xl mx-auto px-4">
      <div className="bg-white/[0.03] rounded-lg overflow-hidden transition-all duration-500"
        style={{ border: '2.5px solid', borderColor, boxShadow: `0 0 16px ${borderColor}55` }}
      >

        {/* Header with stickers on both sides */}
        <div className="bg-gradient-to-r from-green-500/20 to-green-500/5 border-b border-green-500/20 px-3 py-2 text-center">
          <div className="flex items-center justify-center gap-2">
            {/* Left Sticker */}
            <span className="text-xl animate-bounce text-yellow-400">🎉</span>
            <span className="text-xl animate-bounce delay-75 text-pink-400">✨</span>
            <span className="text-xl animate-bounce delay-150 text-purple-400">🌟</span>
            
            <h2 className="text-green-400 font-bold text-sm uppercase tracking-widest">
              AAJ KYA PASS HUA
            </h2>
            
            {/* Right Sticker */}
            <span className="text-xl animate-bounce delay-150 text-purple-400">🌟</span>
            <span className="text-xl animate-bounce delay-75 text-pink-400">✨</span>
            <span className="text-xl animate-bounce text-yellow-400">🎉</span>
          </div>
          
          {/* Extra sticker line below */}
          {/* <div className="flex justify-center gap-1 mt-1 text-lg">
            <span className="animate-pulse">🎊</span>
            <span className="animate-pulse delay-75">🏆</span>
            <span className="animate-pulse delay-150">💫</span>
            <span className="animate-pulse delay-100">⭐</span>
            <span className="animate-pulse delay-200">🎈</span>
            <span className="text-green-400 text-xs font-bold mx-1">CONGRATULATIONS!</span>
            <span className="animate-pulse delay-200">🎈</span>
            <span className="animate-pulse delay-100">⭐</span>
            <span className="animate-pulse delay-150">💫</span>
            <span className="animate-pulse delay-75">🏆</span>
            <span className="animate-pulse">🎊</span>
          </div> */}
        </div>

        {/* Date */}
        <div className="border-b border-white/[0.06] px-3 py-1.5 text-center">
          <span className="text-slate-400 text-xs font-mono">
            Date :- <span className="text-white font-semibold">{formatDate(data.date)}</span>
          </span>
        </div>

        {/* Entries */}
        <div className="px-3 py-3 space-y-1.5">
          {data.entries.map((e, i) => (
            <div
              key={i}
              className="flex items-center justify-center gap-1 text-xs text-center flex-wrap"
            >
              <span className="text-amber-400 font-bold uppercase tracking-wide">
                {e.marketName}
              </span>
              <span className="text-slate-500">=&gt;</span>
              <span className="text-green-400 font-semibold">{e.description}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default PassHuaDisplay;