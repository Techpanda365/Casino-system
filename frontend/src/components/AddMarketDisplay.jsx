import React from 'react';

function AddMarketDisplay({ settings }) {
  if (!settings.addMarketEnabled) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 mt-4">
      <div className="bg-gradient-to-r from-amber-500/20 to-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-2 mb-3 text-center">
        <span className="text-amber-400 font-bold text-sm uppercase tracking-wider">{settings.addMarketTitle || 'Add Your Market'}</span>
      </div>
      <div className="bg-white/[0.03] border border-white/[0.12] rounded-lg overflow-hidden">
        {settings.addMarketContent && (
          <div className="p-4 border-b border-white/[0.06] text-slate-300 text-xs leading-relaxed" dangerouslySetInnerHTML={{ __html: settings.addMarketContent }} />
        )}
        {(settings.addMarketWhatsapp || settings.addMarketEmail) && (
          <div className="p-4 flex flex-wrap items-center gap-3">
            {settings.addMarketWhatsapp && (
              <a href={`https://wa.me/${settings.addMarketWhatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-green-600/20 border border-green-500/30 rounded-lg text-green-400 text-sm hover:bg-green-600/30 transition">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
            )}
            {settings.addMarketEmail && (
              <a href={`mailto:${settings.addMarketEmail}`}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-400 text-sm hover:bg-blue-600/30 transition">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 4.9 4 4 4Z"/><path d="M22 6L12 13L2 6"/></svg>
                Email Us
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default AddMarketDisplay;