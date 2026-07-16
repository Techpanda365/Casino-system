import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth, AuthProvider } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';

const API = 'http://localhost:5000/api/public';
const FORUM_API = 'http://localhost:5000/api/forums';

const BADGE_COLORS = {
  bronze: 'bg-amber-700/30 text-amber-400 border-amber-700/40',
  silver: 'bg-slate-400/20 text-slate-300 border-slate-400/30',
  gold: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  diamond: 'bg-cyan-400/20 text-cyan-300 border-cyan-400/30',
  platinum: 'bg-purple-400/20 text-purple-300 border-purple-400/30'
};

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

const SECTION_SHORT = {
  'special-game': 'Special Game',
  'guessing-forum': 'Guessing Forum',
  'expert-forum': 'Expert Forum',
  'trick-zone': 'Kalyan Trick',
  'fix-game': 'Fix Game',
  'ratan-khatri': 'Ratan Khatri',
  'final-trick': 'Final Trick',
  'evergreen-trick': 'EverGreen Trick'
};

const SECTION_ORDER = ['special-game', 'guessing-forum', 'expert-forum', 'trick-zone', 'fix-game', 'ratan-khatri', 'final-trick', 'evergreen-trick'];
const PAGE_SIZE = 10;

function ForumSectionPage() {
  const { slug } = useParams();
  return (
    <AuthProvider slug={slug}>
      <ForumSectionPageInner />
    </AuthProvider>
  );
}

function ForumSectionPageInner() {
  const { slug, section, postId } = useParams();
  const { user, token } = useAuth();
  const [forums, setForums] = useState([]);
  const [allForums, setAllForums] = useState([]);
  const [settings, setSettings] = useState({});
  const [likes, setLikes] = useState({});
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState('posts');
  const [showLogin, setShowLogin] = useState(false);
  const [replyText, setReplyText] = useState({});
  const [replying, setReplying] = useState({});

  const sectionLabel = SECTION_LABELS[section] || section;

  useEffect(() => {
    if (!slug) return;
    setPage(1);
    axios.get(`${API}/settings/${slug}`).then((r) => setSettings(r.data || {})).catch(() => {});
    axios.get(`${API}/forums/${slug}`).then((r) => {
      setAllForums(r.data);
      if (postId) {
        setForums(r.data.filter(f => f._id === postId));
      } else {
        setForums(r.data.filter(f => f.section === section));
      }
    }).catch(() => {});
  }, [slug, section, postId]);

  const totalPages = Math.ceil(forums.length / PAGE_SIZE);
  const pagedForums = forums.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const activeSections = SECTION_ORDER.filter(s => allForums.some(f => f.section === s));

  const handleLike = async (id) => {
    if (!token) { setShowLogin(true); return; }
    try {
      const r = await axios.post(`${FORUM_API}/like/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setLikes(prev => ({ ...prev, [id]: { count: r.data.likes, liked: r.data.liked } }));
    } catch {}
  };

  const handleReply = async (postId) => {
    const content = replyText[postId]?.trim();
    if (!content || !token) { if (!token) setShowLogin(true); return; }
    setReplying(prev => ({ ...prev, [postId]: true }));
    try {
      const r = await axios.post(`${FORUM_API}/reply/${postId}`, { content }, { headers: { Authorization: `Bearer ${token}` } });
      setForums(prev => prev.map(f => f._id === postId ? { ...f, replies: [...(f.replies || []), r.data.reply] } : f));
      setReplyText(prev => ({ ...prev, [postId]: '' }));
    } catch {}
    setReplying(prev => ({ ...prev, [postId]: false }));
  };

  const getLikeData = (post) => {
    const local = likes[post._id];
    if (local) return local;
    return { count: post.likes?.length || 0, liked: false };
  };

  const getBadge = (content) => {
    const len = content?.length || 0;
    if (len > 300) return 'platinum';
    if (len > 200) return 'diamond';
    if (len > 100) return 'gold';
    if (len > 50) return 'silver';
    return 'bronze';
  };

  const isExpert = (title) => {
    const words = ['expert', 'fix', 'game', 'trick', 'final', 'ratan'];
    return words.some(w => title?.toLowerCase().includes(w));
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 60) return `${diffMin} min ago`;
    const diffHrs = Math.floor(diffMin / 60);
    if (diffHrs < 24) return `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`;
    return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const renderHeader = () => (
    <header className="bg-gradient-to-r from-amber-600 to-amber-500 shadow-lg shadow-amber-500/10">
      <div className="px-3 py-1.5 max-w-7xl mx-auto flex items-center gap-2">
        {settings.logo && <img src={settings.logo} alt="Logo" className="h-7 w-auto" />}
        <div className="flex-1">
          <h1 className="text-sm font-bold tracking-wide text-white">{settings.siteName || 'Lucky Bazar'}</h1>
          <p className="text-[8px] font-medium text-white/70">{settings.siteName || 'Lucky Bazar'} • FAST RESULT • FREE GAME</p>
        </div>
        {user ? (
          <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-[8px] font-bold">{user.name[0].toUpperCase()}</div>
            <span className="text-white text-[10px] font-medium">{user.name}</span>
          </div>
        ) : (
          <button onClick={() => setShowLogin(true)} className="text-white text-[10px] bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition">Login</button>
        )}
      </div>
    </header>
  );

  const renderNav = () => {
    if (activeSections.length === 0) return null;
    return (
      <div className="bg-black/30 border-b border-white/[0.08] overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-1 px-2 py-1.5 text-[11px] whitespace-nowrap">
          <Link to={`/site/${slug}`} className="px-2.5 py-1 rounded-md text-slate-400 hover:text-amber-400 transition font-medium">Home</Link>
          {activeSections.map(s => (
            <Link key={s} to={`/site/${slug}/forum/${s}`}
              className={`px-2.5 py-1 rounded-md transition font-medium ${s === section ? 'text-amber-400 bg-amber-500/15' : 'text-slate-300 hover:text-amber-400 hover:bg-amber-500/10'}`}
            >
              {SECTION_SHORT[s] || s}
            </Link>
          ))}
          <Link to={`/site/${slug}/about`} className="px-2.5 py-1 rounded-md text-slate-400 hover:text-amber-400 transition font-medium">About</Link>
          <Link to={`/site/${slug}/api`} className="px-2.5 py-1 rounded-md text-slate-400 hover:text-amber-400 transition font-medium">API</Link>
        </div>
      </div>
    );
  };

  if (forums.length === 0 && !postId) {
    return (
      <div className="min-h-screen bg-[#0a0a14]">
        {renderHeader()}
        {renderNav()}
        <main className="max-w-4xl mx-auto p-3">
          <div className="text-center py-12 text-slate-500 text-sm">No posts in {sectionLabel} yet.</div>
          <div className="text-center">
            <Link to={`/site/${slug}`} className="text-amber-400 hover:text-amber-300 text-xs font-medium">← Back to Home</Link>
          </div>
        </main>
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a14]">
      {renderHeader()}
      {renderNav()}

      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-3 py-2 flex items-center gap-2 text-[10px] text-slate-500">
        <Link to={`/site/${slug}`} className="hover:text-amber-400 transition">Home</Link>
        <span>/</span>
        <span className="text-amber-400/80">{sectionLabel}</span>
      </div>

      {/* Forum Banner */}
      <div className="max-w-4xl mx-auto px-3 mb-3">
        <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 rounded-lg p-4 text-center">
          <h1 className="text-amber-400 font-bold text-sm uppercase tracking-wider">
            {settings.siteName || 'Lucky Bazar'} {sectionLabel}
          </h1>
          <p className="text-slate-500 text-[10px] mt-1 max-w-xl mx-auto">
            {settings.siteName || 'Lucky Bazar'} Satta Matka Guessing Forum For Kalyan Milan Main Bazar Rajdhani Madhur Matka Time Bazar Morning Madhur Sridevi All Matka Guessing Open To Close Free Ank Kalyan Fix Jodi Aaj Ke Liye
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="max-w-4xl mx-auto px-3 mb-3 flex gap-2">
        {user ? (
          <Link to={`/admin/forums?section=${section}`} className="flex-1 bg-gradient-to-r from-amber-600 to-amber-500 text-white text-xs font-bold py-2.5 rounded-lg text-center hover:from-amber-500 hover:to-amber-400 transition shadow-lg shadow-amber-500/20">
            📝 Post Your Guessing
          </Link>
        ) : (
          <button onClick={() => setShowLogin(true)} className="flex-1 bg-gradient-to-r from-amber-600 to-amber-500 text-white text-xs font-bold py-2.5 rounded-lg text-center hover:from-amber-500 hover:to-amber-400 transition shadow-lg shadow-amber-500/20">
            📝 Login to Post
          </button>
        )}
        {settings.appDownloadLink && (
          <a href={settings.appDownloadLink} target="_blank" rel="noopener noreferrer"
            className="flex-1 bg-white/5 border border-white/[0.12] text-slate-300 text-xs font-bold py-2.5 rounded-lg text-center hover:bg-white/10 transition"
          >
            📲 Download App
          </a>
        )}
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-3 mb-3">
        <div className="flex gap-1 border-b border-white/[0.08]">
          <button onClick={() => setTab('posts')}
            className={`px-4 py-2 text-xs font-medium transition ${tab === 'posts' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Posts ({forums.length})
          </button>
          <button onClick={() => setTab('rules')}
            className={`px-4 py-2 text-xs font-medium transition ${tab === 'rules' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Posting Rules
          </button>
        </div>
      </div>

      {tab === 'rules' ? (
        <div className="max-w-4xl mx-auto px-3 mb-3">
          <div className="bg-white/[0.02] border border-white/[0.08] rounded-lg p-4 text-xs text-slate-400 space-y-2">
            <h3 className="text-amber-400 font-bold text-sm mb-2">📋 Posting Rules</h3>
            <p>• 3 Open Ya 3 Close</p>
            <p>• 6 JODI</p>
            <p>• 8 PANNA</p>
            <p className="text-amber-400/80">• Result time se 10 min pehle game post karna hoga....!!!!</p>
            <p>• Do not post your contact details.</p>
            <p>• Read All Rules</p>
          </div>
        </div>
      ) : (
        <>
          <main className="max-w-4xl mx-auto px-3 space-y-2">
            {pagedForums.length === 0 && (
              <div className="text-center py-8 text-slate-500 text-sm">No posts found.</div>
            )}
            {pagedForums.map((f, idx) => {
              const badge = getBadge(f.content);
              const expert = isExpert(f.title);
              const ld = getLikeData(f);
              const globalIdx = (page - 1) * PAGE_SIZE + idx + 1;

              return (
                <div key={f._id} id={`post-${f._id}`} className="bg-white/[0.02] border border-white/[0.08] rounded-lg overflow-hidden hover:border-amber-500/20 transition-all">
                  {/* User Info */}
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.06]">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white text-[10px] font-bold">
                      {(f.userName || settings.siteName || 'LB')[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-white font-semibold text-xs truncate">{f.userName || settings.siteName || 'admin'}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-medium ${BADGE_COLORS[f.userBadge || badge]}`}>
                          {f.userBadge === 'diamond' || f.userBadge === 'platinum' ? 'superAdmin' : (f.userBadge || badge)} Badge
                        </span>
                        {expert && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full border bg-green-500/20 text-green-400 border-green-500/30 font-medium">expert</span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500">{formatTime(f.createdAt)}</div>
                    </div>
                    <div className="text-slate-600 text-[10px] font-mono">#{globalIdx}</div>
                  </div>

                  {f.title && (
                    <div className="px-3 pt-2">
                      <h3 className="text-amber-400/80 font-semibold text-xs uppercase tracking-wide">{f.title}</h3>
                    </div>
                  )}

                  <div className="px-3 py-2">
                    <div className="text-slate-300 text-xs font-mono leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: f.content }} />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 px-3 py-1.5 border-t border-white/[0.04] bg-white/[0.01]">
                    <button onClick={() => handleLike(f._id)} className={`flex items-center gap-1 text-[10px] transition ${ld.liked ? 'text-rose-400' : 'text-slate-500 hover:text-rose-400'}`}>
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill={ld.liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      {ld.count > 0 && <span>{ld.count}</span>}
                    </button>
                    <span className="text-slate-500 text-[10px]">{f.replies?.length || 0} replies</span>
                  </div>

                  {/* Replies */}
                  {f.replies && f.replies.length > 0 && (
                    <div className="px-3 py-2 border-t border-white/[0.04] bg-white/[0.01] space-y-2">
                      {f.replies.map((r, ri) => (
                        <div key={ri} className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white text-[7px] font-bold shrink-0 mt-0.5">
                            {r.userName ? r.userName[0].toUpperCase() : 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-white text-[10px] font-medium">{r.userName}</span>
                              <span className="text-slate-600 text-[8px]">{formatTime(r.createdAt)}</span>
                            </div>
                            <div className="text-slate-400 text-[11px]">{r.content}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply input */}
                  {postId && (
                    <div className="px-3 py-2 border-t border-white/[0.04] bg-white/[0.01]">
                      {token ? (
                        <div className="flex items-center gap-2">
                          <input value={replyText[f._id] || ''} onChange={e => setReplyText(prev => ({ ...prev, [f._id]: e.target.value }))}
                            className="w-full bg-white/[0.05] border border-white/[0.08] rounded px-2 py-1.5 text-[11px] text-slate-300 placeholder-slate-600"
                            placeholder="Write a reply..." />
                          <button onClick={() => handleReply(f._id)} disabled={replying[f._id]}
                            className="text-amber-400 text-[10px] font-medium hover:text-amber-300 transition disabled:opacity-50">
                            {replying[f._id] ? '...' : 'Post'}
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setShowLogin(true)} className="text-amber-400/60 text-[10px] hover:text-amber-400 transition">Login to reply</button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </main>

          {totalPages > 1 && (
            <div className="max-w-4xl mx-auto px-3 mt-4 flex items-center justify-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded text-[11px] font-medium transition ${p === page ? 'bg-amber-500 text-white' : 'bg-white/[0.05] text-slate-400 hover:bg-white/[0.1]'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* SEO Footer */}
      <div className="max-w-4xl mx-auto px-3 mt-4 mb-2">
        <div className="bg-white/[0.02] border border-white/[0.08] rounded-lg p-3 text-center">
          <p className="text-slate-500 text-[10px] leading-relaxed">
            {settings.siteName || 'Lucky Bazar'} Satta Matka Guessing Forum For Kalyan Milan Main Bazar Rajdhani Madhur Matka Time Bazar Morning Madhur Sridevi All Matka Guessing Open To Close Free Ank Kalyan Fix Jodi Aaj Ke Liye Today Locky Fix Matka Satta Number Satta Matka 143 24 131Games satta king Matta Batta Online Matka Play Trusted Best सात्त मटका कल्याण मधुर मटका रेसुल्ट ऑनलाइन
          </p>
        </div>
      </div>

      <footer className="border-t border-white/[0.12] mt-2 py-2 text-center text-slate-600 text-[9px]"
        dangerouslySetInnerHTML={{ __html: settings.footer || `&copy; ${settings.siteName || 'Lucky Bazar'}. All rights reserved.` }}
      />

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}

export default ForumSectionPage;
