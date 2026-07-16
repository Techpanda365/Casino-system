import React from 'react';

function AppDownload({ settings }) {
  const wp = settings.whatsappNumber;
  const email = settings.email;
  const tg = settings.telegramChannel;
  const appUrl = settings.appDownloadUrl;
  if (!wp && !email && !tg && !appUrl) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 mt-2">
      <div className="bg-white/[0.03] border border-white/[0.12] rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500/15 to-amber-500/5 border-b border-white/[0.12] px-3 py-1.5 text-center">
          <h2 className="text-amber-400/90 font-bold text-sm">📲 DOWNLOAD APP & CONNECT</h2>
          <p className="text-slate-600 text-xs">Fast Access • Live Updates • Free</p>
        </div>
        <div className="p-3">
          <div className="grid grid-cols-2 gap-2">
            {wp && (
              <a href={`https://wa.me/${wp}`} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.12] rounded-lg p-2.5 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all group">
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-semibold truncate">{wp}</div>
                  <div className="text-slate-500 text-[10px]">WhatsApp • Click to Chat</div>
                </div>
                <svg className="w-4 h-4 text-slate-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H7M17 7V17"/>
                </svg>
              </a>
            )}
            {tg && (
              <a href={tg} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.12] rounded-lg p-2.5 hover:bg-sky-500/10 hover:border-sky-500/30 transition-all group">
                <div className="w-9 h-9 rounded-full bg-sky-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-sky-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.127.087.497.087.497l-1.41 6.653c-.108.498-.407.622-.686.49l-3.235-2.394-1.563 1.506c-.173.173-.32.256-.537.202-.332-.082-.25-.392-.25-.392l-.95-3.244-1.84-.57c-.4-.128-.436-.404-.09-.61l7.153-2.918c.29-.135.63-.065.685-.185.005-.012.018-.047.025-.083z"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-semibold truncate">Telegram Channel</div>
                  <div className="text-slate-500 text-[10px]">Join for Live Updates</div>
                </div>
                <svg className="w-4 h-4 text-slate-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H7M17 7V17"/>
                </svg>
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`} className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.12] rounded-lg p-2.5 hover:bg-amber-500/10 hover:border-amber-500/30 transition-all group">
                <div className="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"/>
                    <path d="M22 6L12 13L2 6"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-semibold truncate">{email}</div>
                  <div className="text-slate-500 text-[10px]">Email Support</div>
                </div>
                <svg className="w-4 h-4 text-slate-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H7M17 7V17"/>
                </svg>
              </a>
            )}
        
            {appUrl && (
              <div className={`${wp && tg ? 'col-span-2' : ''} mt-1`}>
                <a href={appUrl} target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 text-white px-4 py-2.5 rounded-lg font-bold text-sm hover:from-amber-500 hover:to-amber-400 transition shadow-lg shadow-amber-500/20">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V15"/>
                    <path d="M7 10L12 15L17 10"/>
                    <path d="M12 15V3"/>
                  </svg>
                  Download Official App
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AppDownload;
