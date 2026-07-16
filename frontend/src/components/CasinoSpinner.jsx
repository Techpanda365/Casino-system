import React, { useEffect, useState, useRef } from 'react';

const segments = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const colors = [
  '#ef4444','#f97316','#eab308','#22c55e','#06b6d4',
  '#3b82f6','#8b5cf6','#ec4899','#14b8a6','#f59e0b'
];

function CasinoSpinner({ onResult }) {
  const [result, setResult] = useState('958-2');
  const [angle, setAngle] = useState(0);
  const wheelRef = useRef(null);

  useEffect(() => {
    let timer;
    const spin = () => {
      const three = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
      const single = Math.floor(Math.random() * 10);
      const val = `${three}-${single}`;
      setResult(val);
      onResult?.({ jodi: val, number: single, threeDigit: three });

      // spin wheel — target segment index = single
      const segAngle = 360 / segments.length; // 36 deg per segment
      const targetSeg = single;
      // extra full spins + land on target segment
      const extraSpins = 3 + Math.floor(Math.random() * 3);
      const targetAngle = extraSpins * 360 + (360 - targetSeg * segAngle - segAngle / 2);
      setAngle(prev => prev + targetAngle);

      timer = setTimeout(spin, 3000 + Math.random() * 2000);
    };

    timer = setTimeout(spin, 800);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const segAngle = 360 / segments.length;

  return (
    <div className="bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-900 p-6 rounded-2xl border-2 border-amber-400/30 shadow-2xl">
      <div className="relative w-56 h-56 sm:w-64 sm:h-64 mx-auto mb-4 select-none">
        {/* Pointer */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20">
          <div className="w-0 h-0 border-l-[14px] border-r-[14px] border-t-[24px] border-l-transparent border-r-transparent border-t-amber-400 drop-shadow-lg" />
        </div>

        {/* Wheel */}
        <div
          ref={wheelRef}
          className="w-full h-full rounded-full overflow-hidden shadow-2xl shadow-amber-500/20"
          style={{
            transform: `rotate(${angle}deg)`,
            transition: 'transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)',
          }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {segments.map((n, i) => {
              const startAngle = i * segAngle;
              const endAngle = (i + 1) * segAngle;
              const midAngle = ((startAngle + endAngle) / 2) * Math.PI / 180;
              const r = 100;
              const x1 = 100 + r * Math.cos(startAngle * Math.PI / 180);
              const y1 = 100 + r * Math.sin(startAngle * Math.PI / 180);
              const x2 = 100 + r * Math.cos(endAngle * Math.PI / 180);
              const y2 = 100 + r * Math.sin(endAngle * Math.PI / 180);
              const largeArc = segAngle > 180 ? 1 : 0;
              // label position
              const lr = 65;
              const lx = 100 + lr * Math.cos(midAngle);
              const ly = 100 + lr * Math.sin(midAngle);

              return (
                <g key={i}>
                  <path
                    d={`M100,100 L${x1},${y1} A100,100 0 ${largeArc},1 ${x2},${y2} Z`}
                    fill={colors[i % colors.length]}
                    stroke="rgba(0,0,0,0.25)"
                    strokeWidth="1"
                  />
                  <text
                    x={lx}
                    y={ly}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="white"
                    fontSize="22"
                    fontWeight="bold"
                    fontFamily="monospace"
                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}
                  >
                    {n}
                  </text>
                </g>
              );
            })}
            {/* Center circle with result */}
            <circle cx="100" cy="100" r="36" fill="#111827" stroke="#fbbf24" strokeWidth="2.5" />
            <text x="100" y="100" textAnchor="middle" dominantBaseline="central" fill="#fbbf24" fontSize="15" fontWeight="bold" fontFamily="monospace" style={{ textShadow: '0 0 10px rgba(251,191,36,0.5)' }}>{result}</text>
          </svg>
        </div>
      </div>

      <style>{`
        .glow {
          text-shadow: 0 0 20px rgba(251, 191, 36, 0.5),
                       0 0 60px rgba(251, 191, 36, 0.2);
        }
      `}</style>
    </div>
  );
}

export default CasinoSpinner;
