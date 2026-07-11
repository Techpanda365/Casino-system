// frontend/src/components/CasinoSpinner.jsx

import React, { useState } from 'react';

function CasinoSpinner({ onResult }) {
  const [spinning, setSpinning] = useState(false);
  const [currentNumber, setCurrentNumber] = useState('?');
  const [history, setHistory] = useState([]);

  // ✅ YEH FUNCTION COMPONENT KE ANDAR HAI
  const generateRandomResult = () => {
    const randomNum = Math.floor(Math.random() * 10);
    const threeDigit = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    const twoDigit = String(Math.floor(Math.random() * 100)).padStart(2, '0');
    const jodi = `${threeDigit}-${twoDigit}`;
    
    return {
      number: randomNum,
      threeDigit: threeDigit,
      twoDigit: twoDigit,
      jodi: jodi
    };
  };

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    
    let count = 0;
    const maxCount = 20 + Math.floor(Math.random() * 10);
    const interval = setInterval(() => {
      const num = Math.floor(Math.random() * 10);
      setCurrentNumber(num);
      count++;
      
      if (count >= maxCount) {
        clearInterval(interval);
        const finalResult = generateRandomResult(); // ✅ YAHAN USE HOTA HAI
        setCurrentNumber(finalResult.number);
        setHistory(prev => [finalResult, ...prev].slice(0, 10));
        onResult?.(finalResult);
        setSpinning(false);
      }
    }, 100 + Math.random() * 50);
  };

  return (
    <div className="bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-900 p-6 rounded-2xl border-2 border-amber-400/30 shadow-2xl">
      {/* Spinner Wheel */}
      <div className="relative w-48 h-48 mx-auto mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-amber-400/30 shadow-lg shadow-amber-500/20">
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-amber-900/50 to-amber-700/50 flex items-center justify-center">
            <span className="text-6xl font-bold text-amber-400 drop-shadow-lg glow">
              {currentNumber}
            </span>
          </div>
        </div>
        
        {/* Spinner Decorations */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-amber-400 rounded-full shadow-lg shadow-amber-500/50"></div>
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-2 h-2 bg-amber-400/30 rounded-full"
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${i * 45}deg) translate(70px)`,
            }}
          />
        ))}
      </div>

      {/* Spin Button */}
      <button 
        onClick={spin}
        disabled={spinning}
        className={`w-full py-3 rounded-xl font-bold text-lg uppercase tracking-wider transition-all ${
          spinning 
            ? 'bg-amber-600/50 text-amber-300/50 cursor-not-allowed' 
            : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50'
        }`}
      >
        {spinning ? '🎰 Spinning...' : '🎰 SPIN NOW'}
      </button>

      {/* History */}
      {history.length > 0 && (
        <div className="mt-4">
          <div className="text-amber-400/60 text-xs uppercase tracking-wider mb-2">Last Results</div>
          <div className="flex gap-2 flex-wrap">
            {history.map((h, i) => (
              <div key={i} className="bg-black/40 px-3 py-1 rounded-lg border border-amber-400/20">
                <span className="text-amber-400 font-mono font-bold">{h.jodi}</span>
              </div>
            ))}
          </div>
        </div>
      )}

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