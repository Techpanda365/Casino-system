

// import React, { useEffect, useState, useCallback } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import axios from 'axios';
// import LiveTicker from '../components/LiveTicker';
// import GuessingZone from '../components/GuessingZone';

// import StarlineTable from '../components/StarlineTable';
// import StarlineChartsDisplay from '../components/StarlineChartsDisplay';

// import BannerSlider from '../components/BannerSlider';
// import ForumDisplay from '../components/ForumDisplay';
// import AddMarketDisplay from '../components/AddMarketDisplay';
// import AppDownload from '../components/AppDownload';
// import HistoryModal from '../components/HistoryModal';
// import PassHuaDisplay from '../components/PassHuaDisplay';
// import CasinoSpinner from '../components/CasinoSpinner';


// const API = 'http://localhost:5000/api/public';

// function PublicWebsite() {
//   const { slug } = useParams();
//   const [markets, setMarkets] = useState([]);
//   const [settings, setSettings] = useState({});
//   const [liveResults, setLiveResults] = useState([]);
//   const [guesses, setGuesses] = useState([]);
//   const [starlines, setStarlines] = useState([]);
//   const [charts, setCharts] = useState([]);
//   const [passHua, setPassHua] = useState(null);
//   const [banners, setBanners] = useState([]);
//   const [starlineCharts, setStarlineCharts] = useState([]);
//   const [forums, setForums] = useState([]);
//   const [notFound, setNotFound] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [historyModal, setHistoryModal] = useState(null);
//   const [spinnerResult, setSpinnerResult] = useState(null);
//   console.log(spinnerResult,"test")
//   const openHistory = (marketId, marketName, type) => {
//     setHistoryModal({ marketId, marketName, type });
//   };

//   const fetchLive = useCallback(async () => {
//     if (!slug) return;
//     try { const r = await axios.get(`${API}/live/${slug}`); setLiveResults(r.data); } catch {}
//   }, [slug]);

//   const handleRefresh = useCallback(async () => {
//     setRefreshing(true);
//     await fetchLive();
//     setTimeout(() => setRefreshing(false), 500);
//   }, [fetchLive]);

//   const handleSpinResult = (result) => {
//     setSpinnerResult(result);
//     console.log('🎰 Spinner Result:', result);
//   };

//   useEffect(() => {
//     if (!slug) return;
//     axios.get(`${API}/markets/${slug}`).then((r) => setMarkets(r.data)).catch(() => setNotFound(true));
//     axios.get(`${API}/settings/${slug}`).then((r) => setSettings(r.data || {})).catch(() => {});
//     axios.get(`${API}/guesses/${slug}`).then((r) => setGuesses(r.data)).catch(() => {});
//     axios.get(`${API}/starline/${slug}`).then((r) => setStarlines(r.data)).catch(() => {});
//     axios.get(`${API}/charts/${slug}`).then((r) => setCharts(r.data)).catch(() => {});
//     axios.get(`${API}/pass-hua/${slug}`).then((r) => setPassHua(r.data)).catch(() => {});
//     axios.get(`${API}/banners/${slug}`).then((r) => setBanners(r.data)).catch(() => {});
//     axios.get(`${API}/starline-charts/${slug}`).then((r) => setStarlineCharts(r.data)).catch(() => {});
//     axios.get(`${API}/forums/${slug}`).then((r) => setForums(r.data)).catch(() => {});
//     fetchLive();
//     const interval = setInterval(fetchLive, 30000);
//     return () => clearInterval(interval);
//   }, [slug, fetchLive]);

//   useEffect(() => {
//     if (!settings.siteName && !settings.favicon) return;
//     if (settings.siteName) {
//       document.title = settings.siteName;
//     }
//     if (settings.favicon) {
//       let link = document.querySelector("link[rel~='icon']");
//       if (!link) {
//         link = document.createElement('link');
//         link.rel = 'icon';
//         document.head.appendChild(link);
//       }
//       link.href = settings.favicon;
//     }
//   }, [settings.siteName, settings.favicon]);

//   if (!slug) {
//     return (
//       <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-5xl mb-4">🎯</div>
//           <h1 className="text-2xl font-bold text-amber-400 mb-2">{settings.siteName || 'Lucky Bazar'}</h1>
//           <p className="text-slate-600 text-sm">Fast Result Platform</p>
//         </div>
//       </div>
//     );
//   }

//   if (notFound) {
//     return (
//       <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-5xl mb-4">🔍</div>
//           <h1 className="text-2xl font-bold text-amber-400 mb-2">Site Not Found</h1>
//           <p className="text-slate-600 text-sm">This admin site does not exist.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="min-h-screen pb-6"
//       style={{
//         backgroundColor: settings.themeBg || '#0a0a14',
//         color: settings.themeText || '#ffffff',
//         '--theme-bg': settings.themeBg || '#0a0a14',
//         '--theme-card-bg': settings.themeCardBg || 'rgba(255,255,255,0.03)',
//         '--theme-border': settings.themeBorder || 'rgba(255,255,255,0.12)',
//         '--theme-primary': settings.themePrimary || '#f59e0b',
//         '--theme-primary-dark': settings.themePrimaryDark || '#d97706',
//         '--theme-text': settings.themeText || '#ffffff',
//         '--theme-text-muted': settings.themeTextMuted || '#94a3b8',
//         '--theme-section-bg': settings.themeSectionBg || 'linear-gradient(to right, rgba(245,158,11,0.2), rgba(245,158,11,0.05))',
//         '--theme-result-bg': settings.themeResultBg || '#f59e0b',
//         '--theme-result-text': settings.themeResultText || '#000000',
//         '--theme-section-text': settings.themeSectionText || '#f59e0b',
//         '--theme-card-radius': settings.themeCardRadius || '0.5rem',
//         '--theme-hover-bg': settings.themeHoverBg || 'rgba(255,255,255,0.08)',
//         '--theme-shadow': settings.themeShadow || 'rgba(245,158,11,0.2)',
//         '--theme-font': settings.themeFont || 'inherit',
//       }}
//     >
//       <style>{`
//         [class*="text-amber-400"] {
//           color: var(--theme-section-text) !important;
//         }
//         .bg-amber-400 {
//           background-color: var(--theme-result-bg) !important;
//         }
//         .bg-amber-500 {
//           background-color: var(--theme-primary-dark) !important;
//         }
//         [class*="border-amber-5"] {
//           border-color: var(--theme-primary-dark) !important;
//         }
//         [class*="shadow-amber-5"] {
//           box-shadow: 0 10px 15px -3px var(--theme-shadow), 0 4px 6px -2px var(--theme-shadow) !important;
//         }
//         [class*="hover:border-amber-5"]:hover {
//           border-color: var(--theme-hover-bg) !important;
//         }
//         [class*="hover:bg-amber-5"]:hover {
//           background-color: var(--theme-hover-bg) !important;
//         }
//         .text-black {
//           color: var(--theme-result-text) !important;
//         }
//         body, * {
//           font-family: var(--theme-font) !important;
//         }
//       `}</style>
//       <header
//         className="shadow-lg"
//         style={{
//           background: settings.themeHeaderBg || 'linear-gradient(to right, #d97706, #f59e0b)',
//         }}
//       >
//         <div className="max-w-7xl mx-auto px-4 py-3">
//           <div className="flex items-center gap-3">
//             {settings.logo && <img src={settings.logo} alt="" className="h-10 w-auto" />}
//             <div>
//               <h1 className="text-lg font-bold tracking-wide text-white">{settings.siteName || 'Lucky Bazar'}</h1>
//               <p className="text-xs font-medium text-white/60 uppercase tracking-widest">{settings.siteName || 'Lucky Bazar'} • FAST RESULT • FREE GAME</p>
//             </div>
//           </div>
//         </div>
//       </header>

//       {settings.header && (
//         <div
//           className="w-full text-center text-sm py-2 px-4 bg-red-600/90 text-white font-semibold"
//           dangerouslySetInnerHTML={{ __html: settings.header }}
//         />
//       )}

//       {/* Forum Navigation */}
//       {forums.length > 0 && (() => {
//         const SECTION_ORDER = ['special-game', 'guessing-forum', 'expert-forum', 'trick-zone', 'fix-game', 'ratan-khatri', 'final-trick', 'evergreen-trick'];
//         const SECTION_LABELS = {
//           'special-game': 'Special Game',
//           'guessing-forum': 'Guessing Forum',
//           'expert-forum': 'Expert Forum',
//           'trick-zone': 'Kalyan Trick',
//           'fix-game': 'Fix Game',
//           'ratan-khatri': 'Ratan Khatri',
//           'final-trick': 'Final Trick',
//           'evergreen-trick': 'EverGreen Trick'
//         };
//         const activeSections = SECTION_ORDER.filter(s => forums.some(f => f.section === s));
//         return (
//           <div className="bg-black/30 border-b border-white/[0.08] overflow-x-auto">
//             <div className="max-w-7xl mx-auto flex items-center gap-1 px-2 py-1.5 text-[11px] whitespace-nowrap">
//               <Link to={`/site/${slug}`} className="px-2.5 py-1 rounded-md text-slate-400 hover:text-amber-400 transition font-medium">Home</Link>
//               <Link to={`/site/${slug}/chart/jodi-count`} className="px-2.5 py-1 rounded-md text-slate-300 hover:text-amber-400 hover:bg-amber-500/10 transition font-medium">Charts</Link>
//               {activeSections.map(s => (
//                 <Link key={s} to={`/site/${slug}/forum/${s}`}
//                   className="px-2.5 py-1 rounded-md text-slate-300 hover:text-amber-400 hover:bg-amber-500/10 transition font-medium"
//                 >
//                   {SECTION_LABELS[s] || s}
//                 </Link>
//               ))}
//               <Link to={`/site/${slug}/about`} className="px-2.5 py-1 rounded-md text-slate-400 hover:text-amber-400 transition font-medium">About</Link>
//             </div>
//           </div>
//         );
//       })()}

//       <div className="max-w-7xl mx-auto px-4 mt-4 text-center">
//         <div className="bg-gradient-to-r from-amber-500/20 to-amber-500/5 border border-amber-500/20 rounded-lg py-3 px-4">
//           <p className="text-amber-400 font-bold text-base uppercase tracking-wider">World Me Sabse Fast Satta Matka Result</p>
//           <p className="text-slate-400 text-xs mt-1">{settings.siteName || 'Lucky Bazar'} • Fast Result • Free Game</p>
//           {settings.welcomeText && (
//             <p className="text-slate-500 text-xs mt-2">{settings.welcomeText}</p>
//           )}
//         </div>
//       </div>

//       <BannerSlider banners={banners} />

//       {(() => {
//         const finalAnkMarkets = markets.filter(m => m.finalAnk);
//         if (!settings.goldenAnk && finalAnkMarkets.length === 0 && !settings.luckyNumber) return null;
//         const hasLucky = !!settings.luckyNumber;
//         const hasGolden = !!settings.goldenAnk;
//         const hasFinal = finalAnkMarkets.length > 0;
//         const cols = (hasLucky ? 1 : 0) + (hasGolden ? 1 : 0) + (hasFinal ? 1 : 0);
//         return (
//           <div className="max-w-7xl mx-auto px-4 mt-4">
//             <div className="bg-gradient-to-br from-amber-500/15 to-amber-500/5 border border-amber-500/15 rounded-2xl overflow-hidden">
//               <div className="grid divide-x divide-white/[0.12]" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
//                 {hasLucky && (
//                   <div className="py-4 text-center">
//                     <div className="text-slate-500 text-xs uppercase tracking-widest mb-1">Today Lucky Number</div>
//                     <div className="text-amber-400 font-bold text-2xl tracking-widest">{settings.luckyNumber}</div>
//                   </div>
//                 )}
//                 {hasGolden && (
//                   <div className="py-4 text-center">
//                     <div className="text-slate-500 text-xs uppercase tracking-widest mb-1">Golden Ank</div>
//                     <div className="text-amber-400 font-bold text-2xl tracking-widest">{settings.goldenAnk}</div>
//                   </div>
//                 )}
//                 {hasFinal && (
//                   <div className="py-4 px-3">
//                     <div className="text-slate-500 text-xs uppercase tracking-widest mb-2 text-center">Final Ank</div>
//                     <div className="space-y-1">
//                       {finalAnkMarkets.map(m => (
//                         <div key={m._id} className="flex justify-between text-sm text-white/80">
//                           <span className="truncate mr-2">{m.name}</span>
//                           <span className="text-amber-400 font-bold">{m.finalAnk}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         );
//       })()}

//       <LiveTicker results={liveResults} onRefresh={handleRefresh} refreshing={refreshing} />

//       <div className="max-w-7xl mx-auto px-4 mt-4">
//         <div className="bg-gradient-to-br from-amber-500/15 to-amber-500/5 border border-amber-500/15 rounded-2xl p-4 space-y-2 text-sm text-white/80 leading-relaxed">
//           <p>🔥 बुकी-खाईवाल भाइयों के लिए बड़ी खबर!</p>
//           <p>📈 किसी भी कंपनी या मार्केट में डायरेक्ट खाता खुलवाने, कंपनी को कटिंग देने और बिना किसी टेंशन के व्यापार शुरू करने की पूरी सुविधा हमारे द्वारा दी जाएगी।</p>
//           <p>🚀 हमारी World Famous साइट पर अपना बाज़ार शुरू करवाने के लिए नीचे दिया गया चैनल जॉइन करें।</p>
//           <p>💎 ईमानदारी और विश्वसनीयता का दूसरा नाम – LuckyBazar.com</p>
//           <div className="flex flex-wrap gap-2 pt-2">
//             <a href={settings.whatsappNumber ? `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g,'')}` : '#'} target="_blank" rel="noopener noreferrer" className="inline-block bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">📢 Join WhatsApp Channel</a>
//             <a href={settings.email ? `mailto:${settings.email}` : '#'} className="inline-block bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">📧 Email Us</a>
//           </div>
//         </div>
//       </div>

//       <main className="max-w-7xl mx-auto px-4 mt-4">
//         {/* WORLD ME SABSE FAST SATTA MATKA RESULT - Heading */}
//         <div className="bg-gradient-to-r from-amber-500/20 to-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-2 mb-3 text-center">
//           <span className="text-amber-400 font-bold text-sm uppercase tracking-wider">WORLD ME SABSE FAST SATTA MATKA RESULT</span>
//         </div>

//         {/* Markets */}
//         {markets.length === 0 ? (
//           <div className="text-center py-8">
//             <p className="text-slate-600 text-sm">No markets added yet.</p>
//           </div>
//         ) : (
//           <div className="space-y-2">
//             {markets.map((m) => (
//               <div
//                 key={m._id}
//                 className={`relative px-3 py-3 rounded-lg border transition-all duration-300 ${
//                   m.result
//                     ? 'bg-amber-400 border-amber-500 shadow-lg shadow-amber-500/20'
//                     : 'bg-white/[0.03] border-white/[0.12] hover:border-amber-500/20'
//                 }`}
//               >
//                 <div className="absolute left-3 top-1/2 -translate-y-1/2">
//                   <button
//                     onClick={() => openHistory(m._id, m.name, 'jodi')}
//                     className={`px-2.5 py-1 rounded text-[11px] font-bold transition border ${
//                       m.result
//                         ? 'bg-black/10 text-black/70 hover:bg-black/20 border-black/20'
//                         : 'bg-white/[0.05] text-slate-400 hover:bg-amber-500/10 hover:text-amber-400 border-white/[0.12]'
//                     }`}
//                   >
//                     Jodi
//                   </button>
//                 </div>
//                 <div className="absolute right-3 top-1/2 -translate-y-1/2">
//                   <button
//                     onClick={() => openHistory(m._id, m.name, 'panel')}
//                     className={`px-2.5 py-1 rounded text-[11px] font-bold transition border ${
//                       m.result
//                         ? 'bg-black/10 text-black/70 hover:bg-black/20 border-black/20'
//                         : 'bg-white/[0.05] text-slate-400 hover:bg-amber-500/10 hover:text-amber-400 border-white/[0.12]'
//                     }`}
//                   >
//                     Panel
//                   </button>
//                 </div>
//                 <div className="text-center">
//                   <div className={`text-sm font-bold ${
//                     m.result ? 'text-black' : 'text-amber-400/80'
//                   }`}>
//                     {m.name}
//                   </div>
//                   {m.result ? (
//                     <>
//                       <div className="text-lg font-mono font-bold tracking-wider text-black mt-0.5">
//                         {m.result.openPatti}<span className="text-black/40">-</span>{m.result.jodi}<span className="text-black/40">-</span>{m.result.closePatti}
//                       </div>
//                       <div className="text-[11px] text-black/60 mt-0.5">{m.openTime} — {m.closeTime}</div>
//                     </>
//                   ) : (
//                     <>
//                       <div className="text-sm font-mono text-slate-700 mt-0.5">---</div>
//                       <div className="text-[11px] text-slate-600 mt-0.5">{m.openTime} — {m.closeTime}</div>
//                     </>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* ⭐ STARLINE CHARTS */}
//         <div className="mt-4">
//           <StarlineChartsDisplay charts={starlineCharts} />
//         </div>

//         {starlineCharts.length > 0 && (() => {
//           const bombayChart = starlineCharts.find(c => c.title?.toLowerCase().includes('main bombay'));
//           if (!bombayChart) return null;
//           const result = bombayChart.data?.[0]?.value || '130-4';
//           return (
//             <>
//               <div className="max-w-7xl mx-auto px-4 mt-4">
//                 <div className="bg-gradient-to-r from-amber-500/20 to-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-1.5 mb-2 text-center">
//                   <span className="text-amber-400 font-bold text-sm uppercase tracking-wider">MAIN BOMBAY 36 BAZAR</span>
//                 </div>
//                 <div className="bg-white/[0.03] border border-white/[0.12] rounded-lg p-4 text-center">
//                   <div className="text-4xl font-mono font-bold text-amber-400">{result}</div>
//                   <div className="text-slate-500 text-xs mt-1">Latest Result</div>
//                 </div>
//               </div>
//               <div className="max-w-7xl mx-auto px-4 mt-4">
//                 <CasinoSpinner onResult={handleSpinResult} />
//               </div>
//             </>
//           );
//         })()}

//         {/* Lucky Special Game Zone */}
//         <div className="max-w-7xl mx-auto px-4 mt-4">
//           <div className="bg-gradient-to-r from-amber-500/20 to-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-1.5 mb-2 text-center">
//             <span className="text-amber-400 font-bold text-sm uppercase tracking-wider">Lucky Special Game Zone</span>
//           </div>
//           <div className="flex justify-center">
//             <ForumDisplay forums={forums} />
//           </div>
//         </div>

//         {/* Lucky List */}
//         {charts.length > 0 && (() => {
//           const CHART_TYPES = ['weekly', 'weekly-patti', 'weekly-open-close', 'weekly-jodi', 'cardlist', 'card-list-220', 'jodi-count', 'jodi-family', 'penal-count', 'penal-total'];
//           const CHART_LABELS = {
//             'weekly': 'Weekly Charts',
//             'weekly-patti': 'Weekly Patti/Penal Chart',
//             'weekly-open-close': 'Weekly Open/Close Line',
//             'weekly-jodi': 'Weekly Jodi Chart',
//             'cardlist': 'Card Lists',
//             'card-list-220': 'All 220 Card List',
//             'jodi-count': 'Matka Jodi Count Chart',
//             'jodi-family': 'Matka Jodi Family Chart',
//             'penal-count': 'Penal Count Chart',
//             'penal-total': 'Penal Total Chart'
//           };
//           const sections = CHART_TYPES.map(t => ({ type: t, label: CHART_LABELS[t] || t, items: charts.filter(c => c.type === t) })).filter(s => s.items.length > 0);
//           if (sections.length === 0) return null;
//           return (
//             <div className="max-w-7xl mx-auto px-4 mt-4">
//               <div className="bg-gradient-to-r from-amber-500/20 to-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-1.5 mb-2 text-center">
//                 <span className="text-amber-400 font-bold text-sm uppercase tracking-wider">Lucky List</span>
//               </div>
//               <div className="flex flex-wrap justify-center gap-2">
//                 {sections.map(section => (
//                   <Link key={section.type} to={`/site/${slug}/chart/${section.type}`}
//                     className="bg-white/[0.03] border border-white/[0.12] rounded-lg px-4 py-2 text-center hover:border-amber-500/40 hover:bg-amber-500/[0.04] transition group min-w-[180px]"
//                   >
//                     <div className="text-amber-400 font-semibold text-xs uppercase tracking-wider group-hover:text-amber-300 transition">{section.label}</div>
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           );
//         })()}

//         {/* AAJ KYA PASS HUA */}
//         {passHua && passHua.entries && passHua.entries.length > 0 && (
//           <div className="mt-4">
//             <PassHuaDisplay data={passHua} />
//           </div>
//         )}

//         {/* FREE GAME ZONE */}

//         {/* Guessing Zone */}
//         {guesses.length > 0 && (
//           <div className="mt-4">
//             <GuessingZone guesses={guesses} date={new Date().toLocaleDateString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit' })} />
//           </div>
//         )}

//         {/* Weekly Charts - Inline */}
//         {charts.length > 0 && (() => {
//           const WEEKLY_TYPES = ['weekly-patti', 'weekly-open-close', 'weekly-jodi', 'card-list-220'];
//           const WEEKLY_LABELS = {
//             'weekly-patti': 'Lucky Bazar Weekly Patti Or Penal Chart',
//             'weekly-open-close': 'Lucky Bazar Weekly Line Open Or Close',
//             'weekly-jodi': 'Lucky Bazar Weekly Jodi Chart',
//             'card-list-220': 'All 220 Card List'
//           };
//           const items = WEEKLY_TYPES.filter(t => charts.some(c => c.type === t));
//           if (items.length === 0) return null;
//           return (
//             <div className="max-w-7xl mx-auto px-4 mt-4 space-y-3">
//               {items.map(type => {
//                 const typeCharts = charts.filter(c => c.type === type);
//                 return typeCharts.map(c => (
//                     <div key={c._id} className="bg-white/[0.03] border border-white/[0.12] rounded-lg overflow-hidden">
//                     <div className="px-3 py-1.5 text-center border-b border-white/[0.12] rainbow-bg">
//                       <span className="text-white font-bold text-sm uppercase tracking-wider">{WEEKLY_LABELS[type] || type}</span>
//                       {c.marketName && <span className="text-white/70 text-[10px] block">{c.marketName}</span>}
//                     </div>
//                     <div className="p-3">
//                       <div className="text-slate-300 text-xs font-mono leading-relaxed whitespace-pre-wrap text-center" dangerouslySetInnerHTML={{ __html: c.content }} />
//                     </div>
//                   </div>
//                 ));
//               })}
//             </div>
//           );
//         })()}
//       </main>

//       {/* SATTA MATKA JODI CHART + MATKA PANEL CHART */}
//       {markets.length > 0 && (
//         <div className="max-w-7xl mx-auto px-4 mt-4 space-y-4">
//           <div className="bg-white/[0.03] border border-white/[0.12] rounded-lg overflow-hidden">
//             <div className="bg-gradient-to-r from-amber-500/20 to-amber-500/5 border-b border-amber-500/20 px-3 py-2 text-center">
//               <h3 className="text-amber-400 font-bold text-sm uppercase tracking-widest">SATTA MATKA JODI CHART</h3>
//             </div>
//             <div className="flex flex-col items-center divide-y divide-white/[0.06]">
//               {markets.map(m => (
//                 <Link key={`j-${m._id}`} to={`/site/${slug}/chart/jodi-count/${encodeURIComponent(m.name)}`}
//                   className="w-full text-center px-3 py-2 text-xs text-slate-300 hover:text-amber-400 hover:bg-white/[0.03] transition"
//                 >
//                   {m.name} Chart
//                 </Link>
//               ))}
//             </div>
//           </div>
//           <div className="bg-white/[0.03] border border-white/[0.12] rounded-lg overflow-hidden">
//             <div className="bg-gradient-to-r from-amber-500/20 to-amber-500/5 border-b border-amber-500/20 px-3 py-2 text-center">
//               <h3 className="text-amber-400 font-bold text-sm uppercase tracking-widest">MATKA PANEL CHART</h3>
//             </div>
//             <div className="flex flex-col items-center divide-y divide-white/[0.06]">
//               {markets.map(m => (
//                 <Link key={`p-${m._id}`} to={`/site/${slug}/chart/penal-count/${encodeURIComponent(m.name)}`}
//                   className="w-full text-center px-3 py-2 text-xs text-slate-300 hover:text-amber-400 hover:bg-white/[0.03] transition"
//                 >
//                   {m.name} Panel Chart
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Other Sections - Neeche */}
//       <div className="mt-4">
//         <StarlineTable starlines={starlines} />
//       </div>

//       <AppDownload settings={settings} />

//       <AddMarketDisplay settings={settings} />

//       {settings.aboutUs && (
//         <section className="max-w-7xl mx-auto px-4 mt-4">
//           <div className="bg-gradient-to-r from-amber-500/20 to-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-2 mb-3 text-center">
//             <span className="text-amber-400 font-bold text-sm uppercase tracking-wider">About Us</span>
//           </div>
//           <div className="bg-white/[0.03] border border-white/[0.12] rounded-lg p-4 text-gray-300 text-xs leading-relaxed"
//             dangerouslySetInnerHTML={{ __html: settings.aboutUs }}
//           />
//         </section>
//       )}

//       <footer className="border-t border-white/[0.12] mt-6">
//         <div className="max-w-7xl mx-auto px-4 py-4 text-center text-slate-600 text-xs"
//           dangerouslySetInnerHTML={{ __html: settings.footer || `&copy; ${settings.siteName || 'Lucky Bazar'}. All rights reserved.` }}
//         />
//         <div className="pb-4 flex items-center justify-center gap-3">
//           <a href="/login" className="text-slate-500 text-xs hover:text-amber-400 transition">Admin</a>
//         </div>
//       </footer>

//       {historyModal && (
//         <HistoryModal
//           slug={slug}
//           marketId={historyModal.marketId}
//           marketName={historyModal.marketName}
//           type={historyModal.type}
//           onClose={() => setHistoryModal(null)}
//         />
//       )}

//       {/* Fixed Bottom Buttons */}
//       <div className="fixed bottom-0 left-0 right-0 z-50 flex">
//         <button onClick={() => window.location.href = `/site/${slug}/vip`}
//           className="flex-1 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-bold text-sm py-3 uppercase tracking-wider hover:from-amber-500 hover:to-amber-400 transition shadow-lg shadow-amber-500/20"
//         >
//           ⭐ VIP
//         </button>
//         <button onClick={() => window.location.reload()}
//           className="flex-1 bg-gradient-to-r from-slate-700 to-slate-600 text-white font-bold text-sm py-3 uppercase tracking-wider hover:from-slate-600 hover:to-slate-500 transition shadow-lg shadow-black/20"
//         >
//           🔄 Refresh
//         </button>
//       </div>

//       {/* Spacer so content isn't hidden behind fixed buttons */}
//       <div className="h-12" />
//     </div>
//   );
// }

// export default PublicWebsite;

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import LiveTicker from '../components/LiveTicker';
import GuessingZone from '../components/GuessingZone';
import StarlineTable from '../components/StarlineTable';
import StarlineChartsDisplay from '../components/StarlineChartsDisplay';
import BannerSlider from '../components/BannerSlider';
import ForumDisplay from '../components/ForumDisplay';
import AddMarketDisplay from '../components/AddMarketDisplay';
import AppDownload from '../components/AppDownload';
import HistoryModal from '../components/HistoryModal';
import PassHuaDisplay from '../components/PassHuaDisplay';
import CasinoSpinner from '../components/CasinoSpinner';

const API = 'http://localhost:5000/api/public';

function PublicWebsite() {
  const { slug } = useParams();
  const [markets, setMarkets] = useState([]);
  const [settings, setSettings] = useState({});
  const [liveResults, setLiveResults] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [starlines, setStarlines] = useState([]);
  const [charts, setCharts] = useState([]);
  const [passHua, setPassHua] = useState(null);
  const [banners, setBanners] = useState([]);
  const [starlineCharts, setStarlineCharts] = useState([]);
  const [forums, setForums] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [historyModal, setHistoryModal] = useState(null);
  const [spinnerResult, setSpinnerResult] = useState(null);
  const [showVipModal, setShowVipModal] = useState(false);
  console.log(spinnerResult, "test");

  const openHistory = (marketId, marketName, type) => {
    setHistoryModal({ marketId, marketName, type });
  };

  const fetchLive = useCallback(async () => {
    if (!slug) return;
    try { const r = await axios.get(`${API}/live/${slug}`); setLiveResults(r.data); } catch {}
  }, [slug]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchLive();
    setTimeout(() => setRefreshing(false), 500);
  }, [fetchLive]);

  const handleSpinResult = (result) => {
    setSpinnerResult(result);
    console.log('🎰 Spinner Result:', result);
  };

  useEffect(() => {
    if (!slug) return;
    axios.get(`${API}/markets/${slug}`).then((r) => setMarkets(r.data)).catch(() => setNotFound(true));
    axios.get(`${API}/settings/${slug}`).then((r) => setSettings(r.data || {})).catch(() => {});
    axios.get(`${API}/guesses/${slug}`).then((r) => setGuesses(r.data)).catch(() => {});
    axios.get(`${API}/starline/${slug}`).then((r) => setStarlines(r.data)).catch(() => {});
    axios.get(`${API}/charts/${slug}`).then((r) => setCharts(r.data)).catch(() => {});
    axios.get(`${API}/pass-hua/${slug}`).then((r) => setPassHua(r.data)).catch(() => {});
    axios.get(`${API}/banners/${slug}`).then((r) => setBanners(r.data)).catch(() => {});
    axios.get(`${API}/starline-charts/${slug}`).then((r) => setStarlineCharts(r.data)).catch(() => {});
    axios.get(`${API}/forums/${slug}`).then((r) => setForums(r.data)).catch(() => {});
    fetchLive();
    const interval = setInterval(fetchLive, 30000);
    return () => clearInterval(interval);
  }, [slug, fetchLive]);

  useEffect(() => {
    if (!settings.siteName && !settings.favicon) return;
    if (settings.siteName) {
      document.title = settings.siteName;
    }
    if (settings.favicon) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = settings.favicon;
    }
  }, [settings.siteName, settings.favicon]);

  // VIP Modal component
  const VipModal = () => {
    const premiumServices = [
      { icon: '🖥️', title: 'VIP Expert Terminal', desc: 'Live Decoding & Fix Market Ank' },
      { icon: '🎁', title: 'Scratch & Win Game', desc: "Get Today's Fix Ank For Free" },
      { icon: '⭐', title: 'Matka Astrology', desc: 'Your Lucky Number by Zodiac' },
      { icon: '📊', title: 'Magic Calculator', desc: 'Auto OTC & Panel Generator' },
      { icon: '🌙', title: 'Dream Number Guide', desc: 'Sapna Dekho Number Nikalo' },
      { icon: '🚀', title: 'Evergreen Matka Tricks', desc: 'Special Premium Content' },
      { icon: '🎁', title: 'Fix Open, Close & Jodi', desc: 'Kalyan Fix, Milan Fix, Rajdhani Fix' },
    ];

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
        <div 
          className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-amber-500/30 shadow-2xl shadow-amber-500/20"
          style={{ boxShadow: '0 0 60px rgba(245,158,11,0.15)' }}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-amber-600/20 to-amber-500/20 border-b border-amber-500/20 px-4 sm:px-6 py-4 flex justify-between items-center gap-2 backdrop-blur-sm min-w-0">
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2 truncate">
                💎 PREMIUM SERVICES ZONE 💎
              </h2>
              <p className="text-slate-400 text-xs mt-1 truncate">Unlock Exclusive Matka Features</p>
            </div>
            <button 
              onClick={() => setShowVipModal(false)}
              className="text-slate-400 hover:text-white transition text-2xl"
            >
              ✕
            </button>
          </div>

          {/* Services List */}
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {premiumServices.map((service, index) => (
              <div 
                key={index}
                className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-3 hover:border-amber-500/30 transition-all duration-300 hover:bg-amber-500/[0.05] group cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-xs group-hover:text-amber-400 transition uppercase tracking-wider">
                      {service.title}
                    </h3>
                    <p className="text-slate-400 text-[10px] mt-0.5">{service.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t border-white/[0.08] px-4 sm:px-6 py-4 bg-black/20">
            <div className="flex items-center justify-between gap-2 min-w-0">
              <span className="text-slate-500 text-xs truncate min-w-0">🔒 Premium Access • 24/7 Support</span>
              <button 
                onClick={() => setShowVipModal(false)}
                className="shrink-0 bg-gradient-to-r from-amber-600 to-amber-500 text-white px-4 sm:px-6 py-2 rounded-lg text-sm font-bold hover:from-amber-500 hover:to-amber-400 transition shadow-lg shadow-amber-500/20"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!slug) {
    return (
      <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🎯</div>
          <h1 className="text-2xl font-bold text-amber-400 mb-2">{settings.siteName || 'Lucky Bazar'}</h1>
          <p className="text-slate-600 text-sm">Fast Result Platform</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-amber-400 mb-2">Site Not Found</h1>
          <p className="text-slate-600 text-sm">This admin site does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pb-6"
      style={{
        backgroundColor: settings.themeBg || '#0a0a14',
        color: settings.themeText || '#ffffff',
        '--theme-bg': settings.themeBg || '#0a0a14',
        '--theme-card-bg': settings.themeCardBg || 'rgba(255,255,255,0.03)',
        '--theme-border': settings.themeBorder || 'rgba(255,255,255,0.12)',
        '--theme-primary': settings.themePrimary || '#f59e0b',
        '--theme-primary-dark': settings.themePrimaryDark || '#d97706',
        '--theme-text': settings.themeText || '#ffffff',
        '--theme-text-muted': settings.themeTextMuted || '#94a3b8',
        '--theme-section-bg': settings.themeSectionBg || 'linear-gradient(to right, rgba(245,158,11,0.2), rgba(245,158,11,0.05))',
        '--theme-result-bg': settings.themeResultBg || '#f59e0b',
        '--theme-result-text': settings.themeResultText || '#000000',
        '--theme-section-text': settings.themeSectionText || '#f59e0b',
        '--theme-card-radius': settings.themeCardRadius || '0.5rem',
        '--theme-hover-bg': settings.themeHoverBg || 'rgba(255,255,255,0.08)',
        '--theme-shadow': settings.themeShadow || 'rgba(245,158,11,0.2)',
        '--theme-font': settings.themeFont || 'inherit',
      }}
    >
      <style>{`
        [class*="text-amber-400"] {
          color: var(--theme-section-text) !important;
        }
        .bg-amber-400 {
          background-color: var(--theme-result-bg) !important;
        }
        .bg-amber-500 {
          background-color: var(--theme-primary-dark) !important;
        }
        [class*="border-amber-5"] {
          border-color: var(--theme-primary-dark) !important;
        }
        [class*="shadow-amber-5"] {
          box-shadow: 0 10px 15px -3px var(--theme-shadow), 0 4px 6px -2px var(--theme-shadow) !important;
        }
        [class*="hover:border-amber-5"]:hover {
          border-color: var(--theme-hover-bg) !important;
        }
        [class*="hover:bg-amber-5"]:hover {
          background-color: var(--theme-hover-bg) !important;
        }
        .text-black {
          color: var(--theme-result-text) !important;
        }
        body, * {
          font-family: var(--theme-font) !important;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
      
      <header
        className="shadow-lg"
        style={{
          background: settings.themeHeaderBg || 'linear-gradient(to right, #d97706, #f59e0b)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            {settings.logo && <img src={settings.logo} alt="" className="h-10 w-auto shrink-0" />}
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-bold tracking-wide text-white truncate">{settings.siteName || 'Lucky Bazar'}</h1>
              <p className="text-xs font-medium text-white/60 uppercase tracking-widest truncate">{settings.siteName || 'Lucky Bazar'} • FAST RESULT • FREE GAME</p>
            </div>
          </div>
        </div>
      </header>

      {settings.header && (
        <div
          className="w-full text-center text-sm py-2 px-4 bg-red-600/90 text-white font-semibold"
          dangerouslySetInnerHTML={{ __html: settings.header }}
        />
      )}

      {/* Forum Navigation */}
      {forums.length > 0 && (() => {
        const SECTION_ORDER = ['special-game', 'guessing-forum', 'expert-forum', 'fix-game', 'ratan-khatri', 'final-trick', 'evergreen-trick'];
        const SECTION_LABELS = {
          'special-game': 'Special Game',
          'guessing-forum': 'Guessing Forum',
          'expert-forum': 'Expert Forum',
          'fix-game': 'Fix Game',
          'ratan-khatri': 'Ratan Khatri',
          'final-trick': 'Final Trick',
          'evergreen-trick': 'EverGreen Trick'
        };
        const activeSections = SECTION_ORDER.filter(s => forums.some(f => f.section === s));
        return (
          <div className="bg-black/30 border-b border-white/[0.08] overflow-x-auto">
            <div className="max-w-7xl mx-auto flex items-center gap-1 px-2 py-1.5 text-[11px] whitespace-nowrap">
              {activeSections.map(s => (
                <Link key={s} to={`/site/${slug}/forum/${s}`}
                  className="px-2.5 py-1 rounded-md text-slate-300 hover:text-amber-400 hover:bg-amber-500/10 transition font-medium"
                >
                  {SECTION_LABELS[s] || s}
                </Link>
              ))}
            </div>
          </div>
        );
      })()}

      <div className="max-w-7xl mx-auto px-4 mt-4 text-center">
        <div className="bg-gradient-to-r from-amber-500/20 to-amber-500/5 border border-amber-500/20 rounded-lg py-3 px-4">
          {settings.welcomeText && (
            <p className="text-white font-bold text-sm">{settings.welcomeText}</p>
          )}
          <p className="text-slate-400 text-xs mt-1">{settings.siteName || 'Lucky Bazar'} • Fast Result • Free Game</p>
          <div className="mt-3 pt-3 border-t border-white/[0.08] text-xs text-slate-400 leading-relaxed">
            <p className="text-amber-400 font-semibold mb-1">Satta Matka LuckyBazar.com Kalyan Matka Result</p>
            <p>Lucky Bazar is the No. 1 Matka Sites welcomes you full-heartedly. Here below you can find the perfect guess by the top guesser along with the Fast Matka Result too. Aaj Ka Satta Kalyan Fix Single Jodi free update here you find top Matka Market of India Kalyan Main Milan Rajdhani* *kalyan Matka Tips *fast Matka Result *kalyan Main Rajdhani Matka Chart *Matka Guessing by Lucky Bazar By App Best Matka Site By Lucky Bazar 91</p>
          </div>
        </div>
      </div>

      <BannerSlider banners={banners} />

      {(() => {
        const finalAnkMarkets = markets.filter(m => m.finalAnk);
        if (!settings.goldenAnk && finalAnkMarkets.length === 0 && !settings.luckyNumber) return null;
        const hasLucky = !!settings.luckyNumber;
        const hasGolden = !!settings.goldenAnk;
        const hasFinal = finalAnkMarkets.length > 0;
        const cols = (hasLucky ? 1 : 0) + (hasGolden ? 1 : 0) + (hasFinal ? 1 : 0);
        const colsMap = { 1: 'md:grid-cols-1', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3' };
        return (
          <div className="max-w-7xl mx-auto px-4 mt-4">
            <div className="bg-gradient-to-br from-amber-500/15 to-amber-500/5 border border-amber-500/15 rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500/20 to-amber-500/5 border-b border-amber-500/20 px-3 py-1.5 text-center">
                <span className="text-amber-400 font-bold text-xs uppercase tracking-widest">Today Lucky Number</span>
              </div>
              <div className={`grid grid-cols-1 sm:grid-cols-2 ${colsMap[cols] || 'md:grid-cols-1'} divide-x divide-white/[0.12]`}>
                {hasLucky && (
                  <div className="py-4 text-center">
                    <div className="text-slate-500 text-xs uppercase tracking-widest mb-1">Today Lucky Number</div>
                    <div className="text-amber-400 font-bold text-2xl tracking-widest">{settings.luckyNumber}</div>
                  </div>
                )}
                {hasGolden && (
                  <div className="py-4 text-center">
                    <div className="text-slate-500 text-xs uppercase tracking-widest mb-1">Golden Ank</div>
                    <div className="text-amber-400 font-bold text-2xl tracking-widest">{settings.goldenAnk}</div>
                  </div>
                )}
                {hasFinal && (
                  <div className="py-4 px-3">
                    <div className="text-slate-500 text-xs uppercase tracking-widest mb-2 text-center">Final Ank</div>
                    <div className="space-y-1">
                      {finalAnkMarkets.map(m => (
                        <div key={m._id} className="flex justify-between text-sm text-white/80">
                          <span className="truncate mr-2">{m.name}</span>
                          <span className="text-amber-400 font-bold">{m.finalAnk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      <LiveTicker results={liveResults} onRefresh={handleRefresh} refreshing={refreshing} />

      <div className="max-w-7xl mx-auto px-4 mt-4">
        <div className="bg-gradient-to-br from-amber-500/15 to-amber-500/5 border border-amber-500/15 rounded-2xl px-3 py-3 sm:p-4 space-y-2 text-sm text-white/80 leading-relaxed">
          <p>🔥 बुकी-खाईवाल भाइयों के लिए बड़ी खबर!</p>
          <p>📈 किसी भी कंपनी या मार्केट में डायरेक्ट खाता खुलवाने, कंपनी को कटिंग देने और बिना किसी टेंशन के व्यापार शुरू करने की पूरी सुविधा हमारे द्वारा दी जाएगी।</p>
          <p>🚀 हमारी World Famous साइट पर अपना बाज़ार शुरू करवाने के लिए नीचे दिया गया चैनल जॉइन करें।</p>
          <p>💎 ईमानदारी और विश्वसनीयता का दूसरा नाम – LuckyBazar.com</p>
          <div className="flex flex-wrap gap-2 pt-2">
            <a href={settings.whatsappNumber ? `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g,'')}` : '#'} target="_blank" rel="noopener noreferrer" className="inline-block bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">📢 Join WhatsApp Channel</a>
            <a href={settings.email ? `mailto:${settings.email}` : '#'} className="inline-block bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">📧 Email Us</a>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 mt-4">
        {/* Guessing Section */}
        <div className="bg-gradient-to-br from-amber-500/15 to-amber-500/5 border border-amber-500/15 rounded-2xl p-4 mb-4 text-center space-y-2">
          <p className="text-amber-400 font-bold text-sm">🌍 Matka Guessing का असली मंच यहाँ है</p>
          <p className="text-white font-semibold text-xs">🏆 Guess करो और बनो No.1</p>
          <p className="text-slate-400 text-xs">📲 Download Lucky Bazar Forum App Today</p>
          <a href={settings.appDownloadUrl || '#'} target="_blank" rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-amber-600 to-amber-500 text-white font-bold text-xs px-6 py-2 rounded-lg hover:from-amber-500 hover:to-amber-400 transition shadow-lg shadow-amber-500/20"
          >
            📥 Download App
          </a>
          <div className="pt-3 border-t border-white/[0.08] text-xs text-slate-300 font-bold leading-loose tracking-wide px-2 break-words">
            KALYAN MATKA | MATKA RESULT | KALYAN MATKA TIPS | SATTA MATKA | MATKA.COM | MATKA PANA JODI TODAY | BATTA SATKA | MATKA PATTI JODI NUMBER | MATKA RESULTS | MATKA CHART | MATKA JODI | SATTA COM | FULL RATE GAME | MATKA GAME | MATKA WAPKA | ALL MATKA RESULT LIVE ONLINE | MATKA RESULT | KALYAN MATKA RESULT | LUCKY BAZAR MATKA 143 | MAIN MATKA
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-500/20 to-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-2 mb-3 text-center">
          <span className="text-amber-400 font-bold text-sm uppercase tracking-wider">WORLD ME SABSE FAST SATTA MATKA RESULT</span>
        </div>

        {markets.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-600 text-sm">No markets added yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {markets.map((m) => (
              <div
                key={m._id}
                className={`relative px-3 py-3 rounded-lg border transition-all duration-300 ${
                  m.result
                    ? 'bg-amber-400 border-amber-500 shadow-lg shadow-amber-500/20'
                    : 'bg-white/[0.03] border-white/[0.12] hover:border-amber-500/20'
                }`}
              >
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <button
                    onClick={() => openHistory(m._id, m.name, 'jodi')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition border ${
                      m.result
                        ? 'bg-black/10 text-black/70 hover:bg-black/20 border-black/20'
                        : 'bg-white/[0.05] text-slate-400 hover:bg-amber-500/10 hover:text-amber-400 border-white/[0.12]'
                    }`}
                  >
                    Jodi
                  </button>
                </div>
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <button
                    onClick={() => openHistory(m._id, m.name, 'panel')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition border ${
                      m.result
                        ? 'bg-black/10 text-black/70 hover:bg-black/20 border-black/20'
                        : 'bg-white/[0.05] text-slate-400 hover:bg-amber-500/10 hover:text-amber-400 border-white/[0.12]'
                    }`}
                  >
                    Panel
                  </button>
                </div>
                <div className="text-center px-10 sm:px-16">
                  <div className={`text-sm font-bold ${
                    m.result ? 'text-black' : 'text-amber-400/80'
                  }`}>
                    {m.name}
                  </div>
                  {m.result ? (
                    <>
                      <div className="text-sm sm:text-lg font-mono font-bold tracking-wider text-black mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap max-w-full">
                        {m.result.openPatti}<span className="text-black/40">-</span>{m.result.jodi}<span className="text-black/40">-</span>{m.result.closePatti}
                      </div>
                      <div className="text-[11px] text-black/60 mt-0.5">{m.openTime} — {m.closeTime}</div>
                    </>
                  ) : (
                    <>
                      <div className="text-sm font-mono text-slate-700 mt-0.5">---</div>
                      <div className="text-[11px] text-slate-600 mt-0.5">{m.openTime} — {m.closeTime}</div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="border rounded-lg px-3 py-2 mb-3 text-center" style={{ backgroundColor: 'var(--theme-card-bg)', borderColor: 'var(--theme-border)' }}>
          <p style={{ color: 'var(--theme-text-muted)' }} className="text-xs">Email for any inquiries Or Support:</p>
          <p style={{ color: 'var(--theme-primary)' }} className="font-semibold text-sm">{settings.email || 'support@luckybazar.com'}</p>
        </div>

        <div className="mt-4">
          <StarlineChartsDisplay charts={starlineCharts} />
        </div>

        {starlineCharts.length > 0 && (() => {
          const bombayChart = starlineCharts.find(c => c.title?.toLowerCase().includes('main bombay'));
          if (!bombayChart) return null;
          const result = bombayChart.data?.[0]?.value || '130-4';
          return (
            <>
              <div className="max-w-7xl mx-auto px-4 mt-4">
                <div className="bg-gradient-to-r from-amber-500/20 to-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-1.5 mb-2 flex items-center justify-between gap-2 min-w-0">
                  <span className="text-amber-400 font-bold text-sm uppercase tracking-wider truncate min-w-0">MAIN BOMBAY 36 BAZAR</span>
                  <Link to={`/site/${slug}/main-bombay-chart`}
                    className="shrink-0 bg-black/60 text-white text-[11px] font-semibold px-2.5 py-1 rounded hover:bg-black/80 transition">Chart</Link>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.12] rounded-lg p-4 text-center">
                  <div className="text-4xl font-mono font-bold text-amber-400">{result}</div>
                  <div className="text-slate-500 text-xs mt-1">Latest Result</div>
                </div>
              </div>
              <div className="max-w-7xl mx-auto px-4 mt-4">
                <CasinoSpinner onResult={handleSpinResult} />
              </div>
            </>
          );
        })()}

        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="bg-gradient-to-r from-amber-500/20 to-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-1.5 mb-2 text-center">
            <span className="text-amber-400 font-bold text-sm uppercase tracking-wider">LuckyBazar API — World's Fastest Satta Matka Result API</span>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.12] rounded-lg p-4 text-center">
            <button
              onClick={() => window.open('https://wa.me/' + (settings.whatsappNumber || '919999999999'), '_blank')}
              className="text-3xl mb-1 px-6 py-2 rounded-lg bg-amber-500/20 border border-amber-500/30 hover:bg-amber-500/30 transition-all cursor-pointer"
              style={{ color: 'var(--theme-primary)' }}
            >🚀CheckApiPricing🚀</button>
            <p className="text-slate-400 text-xs mt-2">Realtime Update, 100% Trusted Legacy</p>
            <p className="text-slate-400 text-xs">10X faster & 24/7 Support & Uptime</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="bg-gradient-to-r from-amber-500/20 to-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-1.5 mb-2 text-center">
            <span className="text-amber-400 font-bold text-sm uppercase tracking-wider">Lucky Special Game Zone</span>
          </div>
          <div className="flex justify-center">
            <ForumDisplay forums={forums} />
          </div>

          {charts.length > 0 && (() => {
            const CHART_TYPES = ['weekly', 'weekly-patti', 'weekly-open-close', 'weekly-jodi', 'cardlist', 'card-list-220', 'jodi-count', 'jodi-family', 'penal-count', 'penal-total'];
            const CHART_LABELS = {
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
            const sections = CHART_TYPES.map(t => ({ type: t, label: CHART_LABELS[t] || t, items: charts.filter(c => c.type === t) })).filter(s => s.items.length > 0);
            if (sections.length === 0) return null;
            return (
              <>
                <div className="bg-gradient-to-r from-amber-500/20 to-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-1.5 mb-2 text-center">
                  <span className="text-amber-400 font-bold text-sm uppercase tracking-wider">Jodi List</span>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {sections.map(section => (
                    <Link key={section.type} to={`/site/${slug}/chart/${section.type}`}
                      className="bg-white/[0.03] border border-white/[0.12] rounded-lg px-4 py-2 text-center hover:border-amber-500/40 hover:bg-amber-500/[0.04] transition group min-w-[140px] sm:min-w-[180px]"
                    >
                      <div className="text-amber-400 font-semibold text-xs uppercase tracking-wider group-hover:text-amber-300 transition">{section.label}</div>
                    </Link>
                  ))}
                </div>
              </>
            );
          })()}

          {(() => {
            const autoEntries = markets.filter(m => m.result).map(m => ({
              marketName: m.name,
              description: `${m.result.openPatti}-${m.result.jodi}-${m.result.closePatti}`
            }));
            const adminEntries = passHua && passHua.entries ? passHua.entries : [];
            const allEntries = [...adminEntries, ...autoEntries];
            if (allEntries.length === 0) return null;
            return (
              <div className="mt-4">
                <PassHuaDisplay data={{ date: passHua?.date || new Date().toISOString(), entries: allEntries }} />
              </div>
            );
          })()}

          {guesses.length > 0 && (
            <div className="mt-4">
              <GuessingZone guesses={guesses} date={new Date().toLocaleDateString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit' })} />
            </div>
          )}

          {charts.length > 0 && (() => {
            const WEEKLY_TYPES = ['weekly-patti', 'weekly-open-close', 'weekly-jodi', 'card-list-220'];
            const WEEKLY_LABELS = {
              'weekly-patti': 'Lucky Bazar Weekly Patti Or Penal Chart',
              'weekly-open-close': 'Lucky Bazar Weekly Line Open Or Close',
              'weekly-jodi': 'Lucky Bazar Weekly Jodi Chart',
              'card-list-220': 'All 220 Card List'
            };
            const items = WEEKLY_TYPES.filter(t => charts.some(c => c.type === t));
            if (items.length === 0) return null;
            return (
              <div className="space-y-3">
                {items.map(type => {
                  const typeCharts = charts.filter(c => c.type === type);
                  return typeCharts.map(c => (
                    <div key={c._id} className="bg-white/[0.03] border border-white/[0.12] rounded-lg overflow-hidden">
                      <div className="px-3 py-1.5 text-center border-b border-white/[0.12] rainbow-bg">
                        <span className="text-white font-bold text-sm uppercase tracking-wider">{WEEKLY_LABELS[type] || type}</span>
                        {c.marketName && <span className="text-white/70 text-[10px] block">{c.marketName}</span>}
                      </div>
                      <div className="p-3">
                        <div className="text-slate-300 text-xs font-mono leading-relaxed whitespace-pre-wrap text-center" dangerouslySetInnerHTML={{ __html: c.content }} />
                      </div>
                    </div>
                  ));
                })}
              </div>
            );
          })()}
        </div>

        {markets.length > 0 && (
          <div className="space-y-4">
            <div className="bg-white/[0.03] border border-white/[0.12] rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500/20 to-amber-500/5 border-b border-amber-500/20 px-3 py-2 text-center">
                <h3 className="text-amber-400 font-bold text-sm uppercase tracking-widest">SATTA MATKA JODI CHART</h3>
              </div>
              <div className="flex flex-col items-center divide-y divide-white/[0.06]">
                {markets.map(m => (
                  <Link key={`j-${m._id}`} to={`/site/${slug}/chart/jodi-count/${encodeURIComponent(m.name)}`}
                    className="w-full text-center px-3 py-2 text-xs text-slate-300 hover:text-amber-400 hover:bg-white/[0.03] transition"
                  >
                    {m.name} Chart
                  </Link>
                ))}
              </div>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.12] rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500/20 to-amber-500/5 border-b border-amber-500/20 px-3 py-2 text-center">
                <h3 className="text-amber-400 font-bold text-sm uppercase tracking-widest">MATKA PANEL CHART</h3>
              </div>
              <div className="flex flex-col items-center divide-y divide-white/[0.06]">
                {markets.map(m => (
                  <Link key={`p-${m._id}`} to={`/site/${slug}/chart/penal-count/${encodeURIComponent(m.name)}`}
                    className="w-full text-center px-3 py-2 text-xs text-slate-300 hover:text-amber-400 hover:bg-white/[0.03] transition"
                  >
                    {m.name} Panel Chart
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-4">
          <StarlineTable starlines={starlines} />
        </div>
      </main>

      <AppDownload settings={settings} />

      <AddMarketDisplay settings={settings} />

      {settings.aboutUs && (
        <section className="max-w-7xl mx-auto px-4 mt-4">
          <div className="bg-gradient-to-r from-amber-500/20 to-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-2 mb-3 text-center">
            <span className="text-amber-400 font-bold text-sm uppercase tracking-wider">About Us</span>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.12] rounded-lg p-4 text-gray-300 text-xs leading-relaxed"
            dangerouslySetInnerHTML={{ __html: settings.aboutUs }}
          />
        </section>
      )}

      <footer className="border-t border-white/[0.12] mt-6">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-slate-600 text-xs"
          dangerouslySetInnerHTML={{ __html: settings.footer || `&copy; ${settings.siteName || 'Lucky Bazar'}. All rights reserved.` }}
        />
        <div className="pb-4 flex items-center justify-center gap-3">
          <a href="/login" className="text-slate-500 text-xs hover:text-amber-400 transition">Admin</a>
        </div>
      </footer>

      {historyModal && (
        <HistoryModal
          slug={slug}
          marketId={historyModal.marketId}
          marketName={historyModal.marketName}
          type={historyModal.type}
          onClose={() => setHistoryModal(null)}
        />
      )}

      {/* Fixed Bottom Buttons */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex">
        <button 
          onClick={() => setShowVipModal(true)}
          className="flex-1 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-bold text-sm py-3 uppercase tracking-wider hover:from-amber-500 hover:to-amber-400 transition shadow-lg shadow-amber-500/20"
        >
          ⭐ VIP
        </button>
        <button 
          onClick={() => window.location.reload()}
          className="flex-1 bg-gradient-to-r from-slate-700 to-slate-600 text-white font-bold text-sm py-3 uppercase tracking-wider hover:from-slate-600 hover:to-slate-500 transition shadow-lg shadow-black/20"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="h-12" />

      {/* VIP Modal */}
      {showVipModal && <VipModal />}
    </div>
  );
}

export default PublicWebsite;
