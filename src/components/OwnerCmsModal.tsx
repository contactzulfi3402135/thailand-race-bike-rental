import React, { useEffect, useState } from 'react';
import { Check, Download, Inbox, RotateCcw, Save, Settings, X } from 'lucide-react';
import { DEFAULT_SITE_CONFIG, SiteConfig } from '../data/siteData';

interface EnquiryRecord {
  id: string;
  createdAt: string;
  name?: string;
  contact?: string;
  bikeName?: string;
  circuitName?: string;
  date?: string;
  days?: number;
  totalDisplay?: string;
  weight?: string;
  notes?: string;
}

interface OwnerCmsModalProps {
  open: boolean;
  config: SiteConfig;
  localEnquiries: EnquiryRecord[];
  onClose: () => void;
  onSaveConfig: (updated: SiteConfig) => void;
  onResetConfig: () => void;
}

export const OwnerCmsModal: React.FC<OwnerCmsModalProps> = ({
  open,
  config,
  localEnquiries,
  onClose,
  onSaveConfig,
  onResetConfig,
}) => {
  const [draft, setDraft] = useState<SiteConfig>(config);
  const [tab, setTab] = useState<'brand' | 'fleet' | 'contacts' | 'inbox'>('fleet');
  const [savedNotice, setSavedNotice] = useState(false);
  const [serverEnquiries, setServerEnquiries] = useState<EnquiryRecord[]>([]);

  useEffect(() => {
    setDraft(config);
  }, [config]);

  useEffect(() => {
    if (open && tab === 'inbox') {
      fetch('/api/enquiries')
        .then((r) => (r.ok ? r.json() : []))
        .then((data) => {
          if (Array.isArray(data)) setServerEnquiries(data);
        })
        .catch(() => {});
    }
  }, [open, tab]);

  if (!open) return null;

  const combinedInbox = [
    ...serverEnquiries,
    ...localEnquiries.filter((le) => !serverEnquiries.some((se) => se.id === le.id)),
  ];

  const handleSave = () => {
    onSaveConfig(draft);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'site-cms-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-[#0D1016] border-l border-white/15 h-full flex flex-col text-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#08090C]">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-[#E62429]" />
            <div>
              <h2 className="font-display text-xl font-bold uppercase tracking-wide">
                Owner Self-Service Editor (CMS)
              </h2>
              <p className="text-xs text-zinc-400">
                Edit bike prices, EN/TH/ZH text, hero video & booking channels instantly — zero code required
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1 px-6 pt-3 pb-0 border-b border-white/10 bg-[#08090C] overflow-x-auto">
          {([
            { id: 'fleet', label: 'Bike Prices & Fleet' },
            { id: 'brand', label: 'Hero Text & Video (EN/TH/ZH)' },
            { id: 'contacts', label: 'WhatsApp / Messenger / Socials' },
            { id: 'inbox', label: `Enquiries (${combinedInbox.length})` },
          ] as const).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`px-3.5 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition cursor-pointer ${
                tab === item.id
                  ? 'border-[#E62429] text-white'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {tab === 'fleet' && (
            <div className="space-y-4">
              <p className="text-xs text-zinc-300 bg-white/5 border border-white/10 rounded-lg p-3">
                Change any bike name, USD daily rate (THB & CNY auto-calculate automatically!), power figure, or status below and click <strong>Save & Publish Live</strong>.
              </p>
              {draft.bikes.map((bike, idx) => (
                <div
                  key={bike.id}
                  className="p-4 rounded-xl bg-[#141821] border border-white/10 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1">
                      <label className="block text-[11px] font-mono-tech text-zinc-400 mb-1">
                        MODEL NAME
                      </label>
                      <input
                        type="text"
                        value={bike.name}
                        onChange={(e) => {
                          const next = [...draft.bikes];
                          next[idx] = { ...bike, name: e.target.value };
                          setDraft({ ...draft, bikes: next });
                        }}
                        className="w-full bg-[#08090C] border border-white/15 rounded-lg px-3 py-2 text-sm text-white"
                      />
                    </div>
                    <div className="w-full sm:w-32">
                      <label className="block text-[11px] font-mono-tech text-zinc-400 mb-1">
                        PRICE (USD/DAY)
                      </label>
                      <input
                        type="number"
                        value={bike.priceUsd}
                        onChange={(e) => {
                          const next = [...draft.bikes];
                          next[idx] = { ...bike, priceUsd: Number(e.target.value) || 0 };
                          setDraft({ ...draft, bikes: next });
                        }}
                        className="w-full bg-[#08090C] border border-white/15 rounded-lg px-3 py-2 text-sm font-mono-tech font-bold text-[#10B981]"
                      />
                    </div>
                    <div className="w-full sm:w-28">
                      <label className="block text-[11px] font-mono-tech text-zinc-400 mb-1">
                        POWER (WHP)
                      </label>
                      <input
                        type="number"
                        value={bike.whp}
                        onChange={(e) => {
                          const next = [...draft.bikes];
                          next[idx] = { ...bike, whp: Number(e.target.value) || 0 };
                          setDraft({ ...draft, bikes: next });
                        }}
                        className="w-full bg-[#08090C] border border-white/15 rounded-lg px-3 py-2 text-sm font-mono-tech text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono-tech text-zinc-400 mb-1">
                      SHORT TAGLINE (ENGLISH)
                    </label>
                    <input
                      type="text"
                      value={bike.tagline.en}
                      onChange={(e) => {
                        const next = [...draft.bikes];
                        next[idx] = {
                          ...bike,
                          tagline: { ...bike.tagline, en: e.target.value },
                        };
                        setDraft({ ...draft, bikes: next });
                      }}
                      className="w-full bg-[#08090C] border border-white/15 rounded-lg px-3 py-2 text-xs text-zinc-200"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'brand' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono-tech text-zinc-400 mb-1.5">
                  BRAND NAME (HEADER & FOOTER)
                </label>
                <input
                  type="text"
                  value={draft.brandName}
                  onChange={(e) => setDraft({ ...draft, brandName: e.target.value })}
                  className="w-full bg-[#141821] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm font-semibold text-white"
                />
              </div>

              {(['en', 'th', 'zh'] as const).map((locale) => (
                <div
                  key={locale}
                  className="p-4 rounded-xl bg-[#141821] border border-white/10 space-y-3"
                >
                  <div className="font-mono-tech text-xs font-bold text-[#E62429] uppercase">
                    {locale === 'en' ? 'ENGLISH COPY' : locale === 'th' ? 'THAI (ภาษาไทย) COPY' : 'CHINESE (简体中文) COPY'}
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Hero Headline</label>
                    <input
                      type="text"
                      value={draft.heroTitle[locale]}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          heroTitle: { ...draft.heroTitle, [locale]: e.target.value },
                        })
                      }
                      className="w-full bg-[#08090C] border border-white/15 rounded-lg px-3 py-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Hero Subtitle</label>
                    <textarea
                      rows={2}
                      value={draft.heroSubtitle[locale]}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          heroSubtitle: { ...draft.heroSubtitle, [locale]: e.target.value },
                        })
                      }
                      className="w-full bg-[#08090C] border border-white/15 rounded-lg px-3 py-2 text-xs text-zinc-200"
                    />
                  </div>
                </div>
              ))}

              <div className="p-4 rounded-xl bg-[#141821] border border-white/10 space-y-3">
                <div className="font-mono-tech text-xs font-bold text-white uppercase">
                  HERO VIDEO REEL SOURCE
                </div>
                <select
                  value={draft.activeVideoMode}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      activeVideoMode: e.target.value as 'track' | 'pov' | 'custom',
                    })
                  }
                  className="w-full bg-[#08090C] border border-white/15 rounded-lg px-3 py-2 text-sm text-white"
                >
                  <option value="track">Built-in 60fps Circuit Superbike Reel</option>
                  <option value="pov">Built-in Rider Onboard Cockpit POV Reel</option>
                  <option value="custom">Custom Hosted MP4 Video URL</option>
                </select>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">
                    Optional Custom GoPro / Insta360 Track Footage (.mp4 direct link)
                  </label>
                  <input
                    type="url"
                    placeholder="https://your-cdn.com/buriram-r9-pov-lap.mp4"
                    value={draft.customVideoUrl}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        customVideoUrl: e.target.value,
                        activeVideoMode: e.target.value.trim() ? 'custom' : draft.activeVideoMode,
                      })
                    }
                    className="w-full bg-[#08090C] border border-white/15 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {tab === 'contacts' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#141821] border border-white/10 space-y-3.5">
                <div>
                  <label className="block text-xs font-mono-tech text-zinc-400 mb-1">
                    WHATSAPP NUMBER (COUNTRY CODE + DIGITS, NO + SIGN)
                  </label>
                  <input
                    type="text"
                    value={draft.whatsappNumber}
                    onChange={(e) => setDraft({ ...draft, whatsappNumber: e.target.value })}
                    className="w-full bg-[#08090C] border border-white/15 rounded-lg px-3 py-2 text-sm font-mono-tech text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono-tech text-zinc-400 mb-1">
                    FACEBOOK PAGE / MESSENGER USERNAME (m.me/USERNAME)
                  </label>
                  <input
                    type="text"
                    value={draft.messengerHandle}
                    onChange={(e) => setDraft({ ...draft, messengerHandle: e.target.value })}
                    className="w-full bg-[#08090C] border border-white/15 rounded-lg px-3 py-2 text-sm font-mono-tech text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono-tech text-zinc-400 mb-1">
                    INSTAGRAM HANDLE (@HANDLE)
                  </label>
                  <input
                    type="text"
                    value={draft.instagramHandle}
                    onChange={(e) => setDraft({ ...draft, instagramHandle: e.target.value })}
                    className="w-full bg-[#08090C] border border-white/15 rounded-lg px-3 py-2 text-sm font-mono-tech text-white"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono-tech text-zinc-400 mb-1">
                      LINE OFFICIAL ID (THAILAND)
                    </label>
                    <input
                      type="text"
                      value={draft.lineId}
                      onChange={(e) => setDraft({ ...draft, lineId: e.target.value })}
                      className="w-full bg-[#08090C] border border-white/15 rounded-lg px-3 py-2 text-sm font-mono-tech text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono-tech text-zinc-400 mb-1">
                      WECHAT ID (CHINESE RIDERS)
                    </label>
                    <input
                      type="text"
                      value={draft.wechatId}
                      onChange={(e) => setDraft({ ...draft, wechatId: e.target.value })}
                      className="w-full bg-[#08090C] border border-white/15 rounded-lg px-3 py-2 text-sm font-mono-tech text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'inbox' && (
            <div className="space-y-3">
              {combinedInbox.length === 0 ? (
                <div className="text-center py-12 text-zinc-400 text-sm">
                  <Inbox className="w-8 h-8 mx-auto mb-2 text-zinc-500" />
                  <p>No direct form enquiries submitted yet. Submit a test booking on the site to see it appear instantly here!</p>
                </div>
              ) : (
                combinedInbox.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-[#141821] border border-white/10 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono-tech font-bold text-[#10B981]">{item.id}</span>
                      <span className="text-zinc-400">
                        {new Date(item.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {item.name} — <span className="text-[#E62429]">{item.bikeName}</span>
                    </div>
                    <div className="text-zinc-300">
                      Circuit: <strong>{item.circuitName}</strong> · Date: <strong>{item.date || 'Flexible'}</strong> · Duration: <strong>{item.days} day(s)</strong> · Est: <strong>{item.totalDisplay}</strong>
                    </div>
                    <div className="text-zinc-300">
                      Contact: <strong>{item.contact}</strong> · Weight: <strong>{item.weight || '—'} kg</strong>
                    </div>
                    {item.notes && <p className="text-zinc-400 pt-1">Notes: {item.notes}</p>}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer Action Bar */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#08090C] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setDraft(DEFAULT_SITE_CONFIG);
                onResetConfig();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-300 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
            <button
              type="button"
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-300 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#E62429] hover:bg-[#c81d22] text-xs sm:text-sm font-semibold text-white transition cursor-pointer"
          >
            {savedNotice ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved Live to Website!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save & Publish Live</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
