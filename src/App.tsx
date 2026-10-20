import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUpRight,
  Calendar,
  Check,
  ChevronDown,
  MapPin,
  Menu,
  MessageCircle,
  Send,
  Settings,
  Shield,
  Timer,
  Wrench,
  X,
} from 'lucide-react';
import {
  CurrencyCode,
  DEFAULT_SITE_CONFIG,
  FAQS,
  FleetBike,
  formatMoney,
  INCLUDED_COMPARISON,
  Lang,
  SiteConfig,
  THAI_CIRCUITS,
  UI_STRINGS,
} from './data/siteData';
import { ApexReveal, KerbRule, TelemetryScrollRail } from './components/MotionPrimitives';
import { HeroVideoStage } from './components/HeroVideoStage';

// Code-split secondary views/modals so initial main bundle parses in <50ms
const BikeDetailPage = lazy(() =>
  import('./components/BikeDetailPage').then((m) => ({ default: m.BikeDetailPage }))
);
const OwnerCmsModal = lazy(() =>
  import('./components/OwnerCmsModal').then((m) => ({ default: m.OwnerCmsModal }))
);
const ClientProposalDrawer = lazy(() =>
  import('./components/ClientProposalDrawer').then((m) => ({ default: m.ClientProposalDrawer }))
);

const CMS_STORAGE_KEY = 'apex9_site_cms_v2';
const ENQUIRIES_STORAGE_KEY = 'apex9_local_enquiries_v1';

function normalizeWebpPaths(cfg: SiteConfig): SiteConfig {
  return {
    ...cfg,
    bikes: cfg.bikes.map((b) => ({
      ...b,
      image: b.image.replace(/\.jpg$/i, '.webp'),
      pitImage: b.pitImage.replace(/\.jpg$/i, '.webp'),
    })),
  };
}

interface LocalEnquiry {
  id: string;
  createdAt: string;
  name: string;
  contact: string;
  bikeName: string;
  circuitName: string;
  date: string;
  days: number;
  totalDisplay: string;
  weight: string;
  notes: string;
}

export function App() {
  const searchParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const isClientPreviewMode =
    searchParams.get('client') === '1' || searchParams.get('proposal') === '1';

  const initialLang = useMemo<Lang>(() => {
    const q = searchParams.get('lang');
    if (q === 'th' || q === 'zh' || q === 'en') return q;
    const saved = localStorage.getItem('apex9_lang');
    if (saved === 'th' || saved === 'zh' || saved === 'en') return saved;
    return 'en';
  }, [searchParams]);

  const [lang, setLang] = useState<Lang>(initialLang);
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [config, setConfig] = useState<SiteConfig>(() => {
    try {
      const cached = localStorage.getItem(CMS_STORAGE_KEY);
      if (cached) return normalizeWebpPaths(JSON.parse(cached));
    } catch {
      // ignore invalid cache
    }
    return DEFAULT_SITE_CONFIG;
  });

  // Pre-warm all bike, pit & circuit WebP images immediately in browser memory
  useEffect(() => {
    const allUrls = [
      ...DEFAULT_SITE_CONFIG.bikes.map((b) => b.image),
      '/images/pit-mechanic-team.webp',
      ...THAI_CIRCUITS.map((c) => c.image),
    ];
    allUrls.forEach((src) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
    });
  }, []);

  // Non-blocking background sync for CMS overrides
  useEffect(() => {
    fetch('/api/cms')
      .then((r) => (r.ok ? r.json() : null))
      .then((serverCms) => {
        if (serverCms && serverCms.brandName && Array.isArray(serverCms.bikes)) {
          setConfig(normalizeWebpPaths(serverCms));
        }
      })
      .catch(() => {});
  }, []);

  const [activeBikeSlug, setActiveBikeSlug] = useState<string | null>(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#/bike/')) return hash.replace('#/bike/', '').trim();
    return null;
  });

  const [cmsOpen, setCmsOpen] = useState<boolean>(() => window.location.hash === '#cms');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fleetFilter, setFleetFilter] = useState<'ALL' | 'SUPERSPORT' | 'LITER'>('ALL');
  const [expandedCardIds, setExpandedCardIds] = useState<Record<string, boolean>>({
    'yamaha-yzf-r9': true,
  });
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Booking Calculator & Enquiry State
  const [bookingBikeId, setBookingBikeId] = useState<string>('yamaha-yzf-r9');
  const [bookingCircuitId, setBookingCircuitId] = useState<string>('chang-buriram');
  const [bookingDays, setBookingDays] = useState<1 | 2 | 3>(1);
  const [bookingDate, setBookingDate] = useState<string>('2026-11-07');
  const [selectedAddons, setSelectedAddons] = useState<Record<number, boolean>>({});
  const [riderName, setRiderName] = useState('');
  const [riderContact, setRiderContact] = useState('');
  const [riderWeight, setRiderWeight] = useState('');
  const [riderNotes, setRiderNotes] = useState('');
  const [riderLevel, setRiderLevel] = useState<'novice' | 'inter' | 'fast'>('inter');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [localEnquiries, setLocalEnquiries] = useState<LocalEnquiry[]>(() => {
    try {
      const raw = localStorage.getItem(ENQUIRIES_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('apex9_lang', lang);
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
  }, [lang]);

  useEffect(() => {
    const onHashChange = () => {
      const h = window.location.hash;
      if (h.startsWith('#/bike/')) {
        setActiveBikeSlug(h.replace('#/bike/', '').trim());
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (h === '#cms') {
        setCmsOpen(true);
      } else {
        setActiveBikeSlug(null);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const navigateToBikePage = (slug: string) => {
    window.location.hash = `#/bike/${slug}`;
    setActiveBikeSlug(slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateHomeSection = (sectionId?: string) => {
    setActiveBikeSlug(null);
    setMobileMenuOpen(false);
    if (sectionId) {
      window.location.hash = `#${sectionId}`;
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      window.history.pushState(null, '', window.location.pathname + window.location.search);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSaveConfig = async (updated: SiteConfig) => {
    const clean = normalizeWebpPaths(updated);
    setConfig(clean);
    localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(clean));
    try {
      await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clean),
      });
    } catch {
      // Static deploy works via localStorage seamlessly
    }
  };

  const handleResetConfig = async () => {
    setConfig(DEFAULT_SITE_CONFIG);
    localStorage.removeItem(CMS_STORAGE_KEY);
    try {
      await fetch('/api/cms', { method: 'DELETE' });
    } catch {
      // ignore
    }
    showToast('Default configuration restored.');
  };

  const filteredBikes = useMemo(() => {
    if (fleetFilter === 'SUPERSPORT') {
      return config.bikes.filter((b) => b.classTag === 'SUPERSPORT');
    }
    if (fleetFilter === 'LITER') {
      return config.bikes.filter((b) => b.classTag !== 'SUPERSPORT');
    }
    return config.bikes;
  }, [config.bikes, fleetFilter]);

  const activeBikeObj = useMemo(
    () => config.bikes.find((b) => b.slug === activeBikeSlug) || null,
    [config.bikes, activeBikeSlug]
  );

  const selectedBookingBike =
    config.bikes.find((b) => b.id === bookingBikeId) || config.bikes[0];
  const selectedCircuitObj =
    THAI_CIRCUITS.find((c) => c.id === bookingCircuitId) || THAI_CIRCUITS[0];

  const daysMultiplier = bookingDays === 1 ? 1 : bookingDays === 2 ? 1.8 : 2.55;
  const addonsUsdTotal = INCLUDED_COMPARISON.addons[lang].reduce((sum, addon, idx) => {
    if (!selectedAddons[idx]) return sum;
    const factor = addon.priceUsd === 420 ? 1 : bookingDays;
    return sum + addon.priceUsd * factor;
  }, 0);
  const grandTotalUsd = Math.round(selectedBookingBike.priceUsd * daysMultiplier + addonsUsdTotal);

  const buildBookingMessage = (customBike?: FleetBike, customDays?: 1 | 2 | 3) => {
    const bike = customBike || selectedBookingBike;
    const d = customDays || bookingDays;
    const mult = d === 1 ? 1 : d === 2 ? 1.8 : 2.55;
    const est = formatMoney(
      Math.round(bike.priceUsd * mult + (customBike ? 0 : addonsUsdTotal)),
      currency
    );
    const circuitTitle = selectedCircuitObj.name[lang];

    if (lang === 'th') {
      return `สวัสดีทีมงาน ${config.brandName} สนใจจองเช่ารถแข่งลงสนาม:\n• รุ่นรถ: ${bike.name}\n• สนาม: ${circuitTitle}\n• จำนวนวัน: ${d} วัน (${bookingDate})\n• ยอดประมาณการ: ${est}\n${riderWeight ? `• น้ำหนักผู้ขี่: ${riderWeight} กก.\n` : ''}รบกวนเช็คคิวว่างและรายละเอียดเพิ่มเติมครับ/ค่ะ`;
    }
    if (lang === 'zh') {
      return `您好 ${config.brandName} 车队，我想预订泰国赛道日租车：\n• 车型：${bike.name}\n• 赛道：${circuitTitle}\n• 天数：${d} 天（计划日期：${bookingDate}）\n• 预估费用：${est}\n${riderWeight ? `• 骑士体重：${riderWeight} kg\n` : ''}请帮我确认档期详情，谢谢！`;
    }
    return `Hi ${config.brandName} Team! I'd like to book a track-day race bike in Thailand:\n• Machine: ${bike.name}\n• Circuit: ${circuitTitle}\n• Duration: ${d} Day(s) (${bookingDate})\n• Est. Package: ${est}\n${riderWeight ? `• Rider Weight: ${riderWeight} kg\n` : ''}Please confirm pit availability!`;
  };

  const triggerWhatsappBooking = (customBike?: FleetBike, customDays?: 1 | 2 | 3) => {
    const digits = config.whatsappNumber.replace(/\D/g, '') || '66819940909';
    const text = encodeURIComponent(buildBookingMessage(customBike, customDays));
    window.open(`https://wa.me/${digits}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const triggerMessengerBooking = async (customBike?: FleetBike, customDays?: 1 | 2 | 3) => {
    const text = buildBookingMessage(customBike, customDays);
    try {
      await navigator.clipboard.writeText(text);
      showToast('Booking summary copied! Opening Facebook Messenger...');
    } catch {
      showToast('Opening Facebook Messenger...');
    }
    const handle = config.messengerHandle.replace(/^@/, '').trim() || 'ButlerGarage';
    setTimeout(() => {
      window.open(`https://m.me/${handle}`, '_blank', 'noopener,noreferrer');
    }, 350);
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const refId = `APX-${Math.floor(100000 + Math.random() * 900000)}`;
    const record: LocalEnquiry = {
      id: refId,
      createdAt: new Date().toISOString(),
      name: riderName.trim() || 'Track Rider',
      contact: riderContact.trim(),
      bikeName: selectedBookingBike.name,
      circuitName: selectedCircuitObj.name.en,
      date: bookingDate,
      days: bookingDays,
      totalDisplay: formatMoney(grandTotalUsd, currency),
      weight: riderWeight.trim(),
      notes: `[${riderLevel.toUpperCase()}] ${riderNotes.trim()}`,
    };

    const nextLocal = [record, ...localEnquiries];
    setLocalEnquiries(nextLocal);
    localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(nextLocal));

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });
      if (res.ok) {
        const json = await res.json();
        if (json?.enquiry?.id) {
          setSubmittedRef(json.enquiry.id);
          return;
        }
      }
    } catch {
      // Static fallback succeeds cleanly via localStorage
    }
    setSubmittedRef(refId);
  };

  return (
    <div className="min-h-screen bg-[#08090C] text-[#F4F5F7] flex flex-col">
      <TelemetryScrollRail />

      {/* Top Sticky Motorsport Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#08090C]/88 backdrop-blur-md border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigateHomeSection()}
            className="flex items-center gap-2.5 text-left cursor-pointer group shrink-0"
          >
            <div className="w-8 h-8 rounded bg-[#E62429] flex items-center justify-center font-display font-extrabold italic text-white text-lg tracking-tighter">
              A9
            </div>
            <div>
              <div className="font-display text-lg sm:text-xl font-extrabold uppercase tracking-tight text-white leading-none">
                {config.brandName}
              </div>
              <div className="hidden xl:block text-[10px] font-mono-tech text-zinc-400 tracking-wider mt-0.5">
                {config.brandSub[lang]}
              </div>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-zinc-300">
            <button
              type="button"
              onClick={() => navigateHomeSection('fleet')}
              className="hover:text-white transition cursor-pointer"
            >
              {UI_STRINGS.nav.fleet[lang]}
            </button>
            <button
              type="button"
              onClick={() => navigateHomeSection('included')}
              className="hover:text-white transition cursor-pointer"
            >
              {UI_STRINGS.nav.included[lang]}
            </button>
            <button
              type="button"
              onClick={() => navigateHomeSection('circuits')}
              className="hover:text-white transition cursor-pointer"
            >
              {UI_STRINGS.nav.circuits[lang]}
            </button>
            <button
              type="button"
              onClick={() => navigateHomeSection('faq')}
              className="hover:text-white transition cursor-pointer"
            >
              {UI_STRINGS.nav.faq[lang]}
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <div
              role="group"
              aria-label="Language switcher"
              className="flex items-center bg-white/6 border border-white/12 rounded-lg p-0.5"
            >
              {([
                { code: 'en', label: 'EN' },
                { code: 'th', label: 'ไทย' },
                { code: 'zh', label: '中文' },
              ] as const).map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setLang(item.code)}
                  className={`px-2 sm:px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                    lang === item.code
                      ? 'bg-[#E62429] text-white'
                      : 'text-zinc-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <select
              aria-label="Currency selector"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="hidden sm:block bg-white/6 border border-white/12 rounded-lg px-2 py-1.5 text-xs font-mono-tech font-semibold text-zinc-200 cursor-pointer"
            >
              <option value="USD" className="bg-[#0D1016]">USD $</option>
              <option value="THB" className="bg-[#0D1016]">THB ฿</option>
              <option value="CNY" className="bg-[#0D1016]">CNY ¥</option>
            </select>

            <button
              type="button"
              onClick={() => navigateHomeSection('booking')}
              className="hidden md:inline-flex items-center gap-1.5 bg-[#E62429] hover:bg-[#c81d22] text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition cursor-pointer"
            >
              <span>{UI_STRINGS.nav.bookNow[lang]}</span>
            </button>

            <button
              type="button"
              aria-label="Menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-white/6 border border-white/12 text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-[#0D1016] border-b border-white/15 px-4 pt-3 pb-5 space-y-3 overflow-hidden"
            >
              <div className="flex flex-col space-y-1">
                <button
                  type="button"
                  onClick={() => navigateHomeSection('fleet')}
                  className="text-left py-2.5 px-3 rounded-lg hover:bg-white/5 text-sm font-medium text-white"
                >
                  {UI_STRINGS.nav.fleet[lang]}
                </button>
                <button
                  type="button"
                  onClick={() => navigateHomeSection('included')}
                  className="text-left py-2.5 px-3 rounded-lg hover:bg-white/5 text-sm font-medium text-white"
                >
                  {UI_STRINGS.nav.included[lang]}
                </button>
                <button
                  type="button"
                  onClick={() => navigateHomeSection('circuits')}
                  className="text-left py-2.5 px-3 rounded-lg hover:bg-white/5 text-sm font-medium text-white"
                >
                  {UI_STRINGS.nav.circuits[lang]}
                </button>
                <button
                  type="button"
                  onClick={() => navigateHomeSection('faq')}
                  className="text-left py-2.5 px-3 rounded-lg hover:bg-white/5 text-sm font-medium text-white"
                >
                  {UI_STRINGS.nav.faq[lang]}
                </button>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {(['USD', 'THB', 'CNY'] as const).map((curr) => (
                    <button
                      key={curr}
                      type="button"
                      onClick={() => setCurrency(curr)}
                      className={`px-2.5 py-1.5 rounded text-xs font-mono-tech font-semibold ${
                        currency === curr ? 'bg-white text-black' : 'bg-white/8 text-zinc-300'
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => navigateHomeSection('booking')}
                  className="flex-1 py-2.5 px-4 rounded-lg bg-[#E62429] text-white text-xs font-semibold text-center"
                >
                  {UI_STRINGS.nav.bookNow[lang]}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ROUTE 1: DEDICATED INDIVIDUAL BIKE PAGE (#/bike/:slug) */}
      {activeBikeObj ? (
        <main className="flex-1">
          <Suspense fallback={<div className="min-h-screen bg-[#08090C] pt-28 text-center text-zinc-400">Loading machine build sheet...</div>}>
            <BikeDetailPage
              bike={activeBikeObj}
              allBikes={config.bikes}
              lang={lang}
              currency={currency}
              onBack={() => navigateHomeSection('fleet')}
              onSelectBikePage={navigateToBikePage}
              onBookBikeWithDays={(id, d) => {
                setBookingBikeId(id);
                setBookingDays(d);
                navigateHomeSection('booking');
              }}
              onBookWhatsapp={(bike, d) => triggerWhatsappBooking(bike, d)}
              onBookMessenger={(bike, d) => triggerMessengerBooking(bike, d)}
            />
          </Suspense>
        </main>
      ) : (
        /* ROUTE 2: MAIN COMPLETE FLAGSHIP WEBSITE */
        <main className="flex-1">
          <HeroVideoStage
            config={config}
            lang={lang}
            onChangeVideoMode={(mode) => setConfig({ ...config, activeVideoMode: mode })}
            onOpenWhatsapp={() => triggerWhatsappBooking()}
          />

          {/* 2. RACE FLEET & TRANSPARENT PRICING SECTION (Instant Render — Zero Lazy-Load Pop-in!) */}
          <section id="fleet" className="py-20 sm:py-24 bg-[#08090C]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <KerbRule />
                    <span className="font-mono-tech text-xs font-semibold tracking-[0.16em] text-[#E62429] uppercase">
                      {UI_STRINGS.fleetSection.eyebrow[lang]}
                    </span>
                  </div>
                  <h2 className="font-display text-4xl sm:text-5xl font-extrabold uppercase text-white tracking-tight">
                    {UI_STRINGS.fleetSection.heading[lang]}
                  </h2>
                  <p className="mt-3 text-sm sm:text-base text-zinc-300 leading-relaxed">
                    {UI_STRINGS.fleetSection.subheading[lang]}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {([
                    { id: 'ALL', label: UI_STRINGS.fleetSection.filterAll[lang] },
                    { id: 'SUPERSPORT', label: UI_STRINGS.fleetSection.filterSupersport[lang] },
                    { id: 'LITER', label: UI_STRINGS.fleetSection.filterLiter[lang] },
                  ] as const).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setFleetFilter(tab.id)}
                      className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold border transition cursor-pointer ${
                        fleetFilter === tab.id
                          ? 'bg-white text-[#08090C] border-white'
                          : 'bg-[#101319] text-zinc-300 border-white/12 hover:border-white/30'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                {filteredBikes.map((bike, index) => {
                  const isExpanded = !!expandedCardIds[bike.id];
                  return (
                    <article
                      key={bike.id}
                      className="h-full flex flex-col bg-[#101319] border border-white/12 hover:border-white/28 rounded-xl overflow-hidden transition-colors group"
                    >
                      <div
                        onClick={() => navigateToBikePage(bike.slug)}
                        className="relative aspect-[16/10] w-full overflow-hidden bg-[#161A24] cursor-pointer"
                      >
                        <img
                          src={bike.image}
                          alt={bike.name}
                          loading="eager"
                          decoding="async"
                          fetchPriority={index < 3 ? 'high' : 'auto'}
                          width={840}
                          height={469}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#101319] via-transparent to-black/35 opacity-80" />
                        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                          <span className="px-2.5 py-1 rounded bg-[#08090C]/85 backdrop-blur border border-white/15 font-mono-tech text-[11px] font-semibold text-white">
                            {bike.year} · {bike.classTag}
                          </span>
                          {bike.featuredBadge && (
                            <span className="px-2.5 py-1 rounded bg-[#E62429] text-white font-mono-tech text-[10px] font-bold">
                              {bike.featuredBadge[lang]}
                            </span>
                          )}
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                          <div>
                            <span className="font-mono-tech text-2xl sm:text-3xl font-extrabold text-white">
                              {formatMoney(bike.priceUsd, currency)}
                            </span>
                            <span className="text-xs text-zinc-300 ml-1.5">
                              {UI_STRINGS.fleetSection.perDay[lang]}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between space-y-5">
                        <div>
                          <button
                            type="button"
                            onClick={() => navigateToBikePage(bike.slug)}
                            className="text-left group/title cursor-pointer"
                          >
                            <h3 className="font-display text-2xl font-extrabold uppercase text-white group-hover/title:text-[#E62429] transition-colors">
                              {bike.name}
                            </h3>
                          </button>
                          <p className="mt-1.5 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                            {bike.tagline[lang]}
                          </p>

                          <div className="mt-4 grid grid-cols-3 gap-2 py-3 border-y border-white/10 text-center">
                            <div>
                              <div className="text-[10px] font-mono-tech text-zinc-400">POWER</div>
                              <div className="font-mono-tech text-sm font-bold text-white">
                                {bike.whp} WHP
                              </div>
                            </div>
                            <div className="border-x border-white/10">
                              <div className="text-[10px] font-mono-tech text-zinc-400">WEIGHT</div>
                              <div className="font-mono-tech text-sm font-bold text-white">
                                {bike.weightKg} KG
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] font-mono-tech text-zinc-400">BURIRAM</div>
                              <div className="font-mono-tech text-sm font-bold text-white">
                                {bike.lapBuriram}
                              </div>
                            </div>
                          </div>

                          <div className="mt-3.5">
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedCardIds((prev) => ({
                                  ...prev,
                                  [bike.id]: !prev[bike.id],
                                }))
                              }
                              className="inline-flex items-center gap-1.5 text-xs font-mono-tech font-semibold text-zinc-300 hover:text-white transition cursor-pointer"
                            >
                              <ChevronDown
                                className={`w-3.5 h-3.5 text-[#E62429] transition-transform ${
                                  isExpanded ? 'rotate-180' : ''
                                }`}
                              />
                              <span>
                                {isExpanded
                                  ? UI_STRINGS.fleetSection.hideIncludedToggle[lang]
                                  : UI_STRINGS.fleetSection.whatsIncludedToggle[lang]}
                              </span>
                            </button>

                            {isExpanded && (
                              <ul className="mt-2.5 space-y-1.5 pl-1">
                                {bike.includedHighlights[lang].slice(0, 4).map((inc, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-start gap-2 text-xs text-zinc-300"
                                  >
                                    <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                                    <span>{inc}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>

                        <div className="pt-2 grid grid-cols-2 gap-2.5">
                          <button
                            type="button"
                            onClick={() => navigateToBikePage(bike.slug)}
                            className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-white/7 hover:bg-white/14 border border-white/12 text-xs font-semibold text-white transition cursor-pointer"
                          >
                            <span>{UI_STRINGS.fleetSection.viewBikePage[lang]}</span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-[#E62429]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setBookingBikeId(bike.id);
                              navigateHomeSection('booking');
                            }}
                            className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#E62429] hover:bg-[#c81d22] text-xs font-semibold text-white transition cursor-pointer"
                          >
                            <span>{UI_STRINGS.fleetSection.bookThisBike[lang]}</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 3. HIGH-CONTRAST LIGHT EDITORIAL SECTION: WHAT'S INCLUDED & PIT CREW */}
          <section id="included" className="py-20 sm:py-24 bg-[#F5F5F3] text-[#0B0D12]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <ApexReveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                <div className="lg:col-span-6">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <span className="h-[3px] w-8 bg-[#E62429]" />
                    <span className="font-mono-tech text-xs font-bold tracking-[0.16em] text-[#E62429] uppercase">
                      {UI_STRINGS.includedSection.eyebrow[lang]}
                    </span>
                  </div>
                  <h2 className="font-display text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-[#0B0D12] leading-[0.98]">
                    {UI_STRINGS.includedSection.heading[lang]}
                  </h2>
                  <p className="mt-4 text-sm sm:text-base text-zinc-700 leading-relaxed">
                    {lang === 'th'
                      ? 'ลืมความวุ่นวายเรื่องรถสไลด์ การเซ็ตช่วงล่าง หรือการเตรียมเครื่องมือเข้าพิต เพียงถือชุดแข่งและหมวกกันน็อกมาถึงสนาม (หรือเช่าชุดครบเซ็ตจากเรา) ทีมช่างเรซซิ่งของเราดูแลรถคุณตั้งแต่ปล่อยตัวรอบแรกจนจบวัน'
                      : lang === 'zh'
                        ? '告别繁琐的拖车物流、工具搬运与轮胎拆装烦恼。您只需抵达赛场维修站穿上装备（亦可现场租赁全套连体皮衣头盔），我们的专业赛事技师团队全程为您保驾护航。'
                        : 'Forget trailer logistics, suspension guesswork, or wrenching between 35°C sessions. Walk straight into an air-conditioned pit box where your race machine is pre-heated to 80°C on tire warmers and tuned to your exact body weight.'}
                  </p>
                </div>

                <div className="lg:col-span-6">
                  <div className="relative rounded-2xl overflow-hidden shadow-xl border border-black/10 aspect-[16/10] bg-zinc-200">
                    <img
                      src="/images/pit-mechanic-team.webp"
                      alt="Pro pit box race mechanics fitting tire warmers and tuning suspension"
                      loading="eager"
                      decoding="async"
                      width={840}
                      height={469}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </ApexReveal>

              <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                <ApexReveal className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-black/8 shadow-sm">
                  <div className="flex items-center gap-2.5 pb-4 border-b border-black/10">
                    <Wrench className="w-5 h-5 text-[#E62429]" />
                    <h3 className="font-display text-2xl font-extrabold uppercase text-[#0B0D12]">
                      {UI_STRINGS.includedSection.includedColTitle[lang]}
                    </h3>
                  </div>
                  <div className="mt-5 space-y-4">
                    {INCLUDED_COMPARISON.included[lang].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3.5">
                        <div className="w-6 h-6 rounded-full bg-[#10B981]/15 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-4 h-4 text-[#059669]" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm sm:text-base text-[#0B0D12]">
                            {item.title}
                          </div>
                          <p className="text-xs sm:text-sm text-zinc-600 mt-0.5 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ApexReveal>

                <ApexReveal delay={0.08} className="lg:col-span-5 bg-[#0E1117] text-white rounded-2xl p-6 sm:p-8 border border-black/15 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 pb-4 border-b border-white/10">
                      <Shield className="w-5 h-5 text-[#E62429]" />
                      <h3 className="font-display text-2xl font-extrabold uppercase text-white">
                        {UI_STRINGS.includedSection.addonsColTitle[lang]}
                      </h3>
                    </div>

                    <div className="mt-5 divide-y divide-white/10">
                      {INCLUDED_COMPARISON.addons[lang].map((addon, idx) => (
                        <div key={idx} className="py-3.5 first:pt-0 flex items-center justify-between gap-4">
                          <span className="text-xs sm:text-sm text-zinc-200 leading-snug">
                            {addon.name}
                          </span>
                          <div className="text-right shrink-0">
                            <div className="font-mono-tech text-sm sm:text-base font-bold text-white">
                              {formatMoney(addon.priceUsd, currency)}
                            </div>
                            <div className="text-[10px] font-mono-tech text-zinc-400">
                              {addon.unit}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 text-xs text-zinc-300 leading-relaxed">
                    {lang === 'th'
                      ? 'หมายเหตุโปร่งใส: ค่าน้ำมันเบนซินออกเทนสูงและค่าสมัครสนามคิดตามราคาจริงหน้างาน หรือแจ้งทีมงานเพื่อจัดแพ็กเกจเหมาจ่ายรวมครบ 100% ได้ทันที'
                      : lang === 'zh'
                        ? '透明承诺：高标号赛用燃油及赛道门票均按实际成本结算，绝无溢价；亦可联系客服定制“机票酒店+全包下赛道”省心套餐。'
                        : 'Transparent Policy: Track fuel & circuit pass are settled strictly at paddock cost—or request a single 100% all-inclusive quote on WhatsApp.'}
                  </div>
                </ApexReveal>
              </div>
            </div>
          </section>

          {/* 4. THAILAND PREMIER CIRCUITS SECTION */}
          <section id="circuits" className="py-20 sm:py-24 bg-[#08090C] border-b border-white/10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <ApexReveal className="max-w-3xl">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <KerbRule />
                  <span className="font-mono-tech text-xs font-semibold tracking-[0.16em] text-[#E62429] uppercase">
                    {UI_STRINGS.circuitsSection.eyebrow[lang]}
                  </span>
                </div>
                <h2 className="font-display text-4xl sm:text-5xl font-extrabold uppercase text-white tracking-tight">
                  {UI_STRINGS.circuitsSection.heading[lang]}
                </h2>
              </ApexReveal>

              <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-7">
                {THAI_CIRCUITS.map((circuit) => (
                  <div
                    key={circuit.id}
                    className="h-full flex flex-col bg-[#101319] border border-white/12 rounded-xl overflow-hidden"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#161A24]">
                      <img
                        src={circuit.image}
                        alt={circuit.name[lang]}
                        loading="eager"
                        decoding="async"
                        width={840}
                        height={469}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#08090C]/85 border border-white/15 font-mono-tech text-[11px] font-bold text-white">
                        {circuit.grade}
                      </span>
                    </div>

                    <div className="flex-1 p-6 flex flex-col justify-between space-y-5">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-[#E62429] font-medium">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span>{circuit.location[lang]}</span>
                        </div>
                        <h3 className="mt-1.5 font-display text-2xl font-extrabold uppercase text-white">
                          {circuit.name[lang]}
                        </h3>

                        <div className="mt-3 flex items-center gap-4 py-2.5 border-y border-white/10 font-mono-tech text-xs text-zinc-200">
                          <span>{circuit.lengthKm}</span>
                          <span className="text-white/25">/</span>
                          <span>{circuit.turns} TURNS</span>
                          <span className="text-white/25">/</span>
                          <span>{circuit.straightM}M STRAIGHT</span>
                        </div>

                        <p className="mt-3 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                          {circuit.description[lang]}
                        </p>

                        <div className="mt-4 p-3 rounded-lg bg-black/40 border border-white/8">
                          <div className="flex items-center gap-1.5 text-[11px] font-mono-tech text-zinc-400 mb-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#E62429]" />
                            <span>{UI_STRINGS.circuitsSection.nextTrackDaysLabel[lang]}</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {circuit.nextDates.map((dt, dIdx) => (
                              <span
                                key={dIdx}
                                className="px-2 py-0.5 rounded bg-white/8 font-mono-tech text-[11px] text-zinc-200"
                              >
                                {dt}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setBookingCircuitId(circuit.id);
                          navigateHomeSection('booking');
                        }}
                        className="w-full py-2.5 px-4 rounded-lg bg-white/8 hover:bg-[#E62429] border border-white/15 hover:border-[#E62429] text-xs sm:text-sm font-semibold text-white transition cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Timer className="w-4 h-4" />
                        <span>{UI_STRINGS.circuitsSection.selectCircuitBtn[lang]}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 5. INTERACTIVE BOOKING CONFIGURATOR + WHATSAPP / MESSENGER + ENQUIRY FORM */}
          <section id="booking" className="py-20 sm:py-24 bg-[#0B0E14] border-b border-white/10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <ApexReveal className="max-w-3xl">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <KerbRule />
                  <span className="font-mono-tech text-xs font-semibold tracking-[0.16em] text-[#E62429] uppercase">
                    {UI_STRINGS.bookingSection.eyebrow[lang]}
                  </span>
                </div>
                <h2 className="font-display text-4xl sm:text-5xl font-extrabold uppercase text-white tracking-tight">
                  {UI_STRINGS.bookingSection.heading[lang]}
                </h2>
                <p className="mt-3 text-sm sm:text-base text-zinc-300 leading-relaxed">
                  {UI_STRINGS.bookingSection.sub[lang]}
                </p>
              </ApexReveal>

              <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <form
                  onSubmit={handleEnquirySubmit}
                  className="lg:col-span-7 bg-[#11151E] border border-white/12 rounded-2xl p-6 sm:p-8 space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono-tech font-semibold text-zinc-300 uppercase mb-2">
                        {UI_STRINGS.bookingSection.selectBike[lang]}
                      </label>
                      <select
                        value={bookingBikeId}
                        onChange={(e) => setBookingBikeId(e.target.value)}
                        className="w-full bg-[#08090C] border border-white/18 rounded-lg px-3.5 py-3 text-sm text-white font-medium"
                      >
                        {config.bikes.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name} ({formatMoney(b.priceUsd, currency)}/day)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono-tech font-semibold text-zinc-300 uppercase mb-2">
                        {UI_STRINGS.bookingSection.selectCircuit[lang]}
                      </label>
                      <select
                        value={bookingCircuitId}
                        onChange={(e) => setBookingCircuitId(e.target.value)}
                        className="w-full bg-[#08090C] border border-white/18 rounded-lg px-3.5 py-3 text-sm text-white font-medium"
                      >
                        {THAI_CIRCUITS.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name[lang]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono-tech font-semibold text-zinc-300 uppercase mb-2">
                      {UI_STRINGS.bookingSection.selectDays[lang]}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {([
                        { d: 1 as const, label: UI_STRINGS.bookingSection.day1[lang] },
                        { d: 2 as const, label: UI_STRINGS.bookingSection.day2[lang] },
                        { d: 3 as const, label: UI_STRINGS.bookingSection.day3[lang] },
                      ]).map((opt) => (
                        <button
                          key={opt.d}
                          type="button"
                          onClick={() => setBookingDays(opt.d)}
                          className={`py-3 px-3.5 rounded-lg border text-xs sm:text-sm font-semibold text-left transition cursor-pointer ${
                            bookingDays === opt.d
                              ? 'border-[#E62429] bg-[#E62429]/15 text-white'
                              : 'border-white/12 bg-[#08090C] text-zinc-300 hover:border-white/25'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono-tech font-semibold text-zinc-300 uppercase mb-2">
                      {UI_STRINGS.includedSection.addonsColTitle[lang]}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {INCLUDED_COMPARISON.addons[lang].map((addon, idx) => (
                        <label
                          key={idx}
                          className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition ${
                            selectedAddons[idx]
                              ? 'border-[#E62429] bg-[#E62429]/10'
                              : 'border-white/10 bg-[#08090C]'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={!!selectedAddons[idx]}
                            onChange={(e) =>
                              setSelectedAddons({ ...selectedAddons, [idx]: e.target.checked })
                            }
                            className="mt-1 accent-[#E62429]"
                          />
                          <div className="text-xs leading-snug">
                            <div className="text-white font-medium">{addon.name}</div>
                            <div className="font-mono-tech text-[#10B981] font-semibold mt-0.5">
                              +{formatMoney(addon.priceUsd, currency)} ({addon.unit})
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                    <div>
                      <label className="block text-xs text-zinc-300 mb-1.5">
                        {UI_STRINGS.bookingSection.riderName[lang]} *
                      </label>
                      <input
                        required
                        type="text"
                        value={riderName}
                        onChange={(e) => setRiderName(e.target.value)}
                        placeholder="Alex Chen / Somchai K."
                        className="w-full bg-[#08090C] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-300 mb-1.5">
                        {UI_STRINGS.bookingSection.riderContact[lang]} *
                      </label>
                      <input
                        required
                        type="text"
                        value={riderContact}
                        onChange={(e) => setRiderContact(e.target.value)}
                        placeholder="+66 81 234 5678 / WeChat / Email"
                        className="w-full bg-[#08090C] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-300 mb-1.5">
                        {UI_STRINGS.bookingSection.preferredDate[lang]}
                      </label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full bg-[#08090C] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-300 mb-1.5">
                        {UI_STRINGS.bookingSection.riderWeight[lang]}
                      </label>
                      <input
                        type="number"
                        value={riderWeight}
                        onChange={(e) => setRiderWeight(e.target.value)}
                        placeholder="75"
                        className="w-full bg-[#08090C] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-300 mb-1.5">
                      {UI_STRINGS.bookingSection.riderLevel[lang]}
                    </label>
                    <select
                      value={riderLevel}
                      onChange={(e) => setRiderLevel(e.target.value as 'novice' | 'inter' | 'fast')}
                      className="w-full bg-[#08090C] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white"
                    >
                      <option value="novice">{UI_STRINGS.bookingSection.levels.novice[lang]}</option>
                      <option value="inter">{UI_STRINGS.bookingSection.levels.inter[lang]}</option>
                      <option value="fast">{UI_STRINGS.bookingSection.levels.fast[lang]}</option>
                    </select>
                  </div>

                  <div>
                    <textarea
                      rows={3}
                      value={riderNotes}
                      onChange={(e) => setRiderNotes(e.target.value)}
                      placeholder={UI_STRINGS.bookingSection.notesPlaceholder[lang]}
                      className="w-full bg-[#08090C] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white"
                    />
                  </div>

                  {submittedRef ? (
                    <div className="p-4 rounded-xl bg-[#10B981]/15 border border-[#10B981]/50 text-white space-y-1.5">
                      <div className="flex items-center gap-2 font-semibold text-sm text-[#10B981]">
                        <Check className="w-4 h-4" />
                        <span>{UI_STRINGS.bookingSection.submittedTitle[lang]}</span>
                      </div>
                      <p className="text-xs text-zinc-200">
                        Reference Code: <strong className="font-mono-tech">{submittedRef}</strong> — {selectedBookingBike.name} ({bookingDays}d @ {selectedCircuitObj.name[lang]}). You can also message us immediately on WhatsApp or Messenger on the right for real-time confirmation!
                      </p>
                      <button
                        type="button"
                        onClick={() => setSubmittedRef(null)}
                        className="text-xs underline text-zinc-300 hover:text-white cursor-pointer"
                      >
                        Send another enquiry
                      </button>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 rounded-lg bg-white hover:bg-zinc-200 text-[#08090C] font-bold text-sm sm:text-base transition cursor-pointer"
                    >
                      {UI_STRINGS.bookingSection.submitForm[lang]}
                    </button>
                  )}
                </form>

                <div className="lg:col-span-5 lg:sticky lg:top-24 bg-[#11151E] border border-white/15 rounded-2xl p-6 sm:p-7 space-y-5">
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedBookingBike.image}
                      alt={selectedBookingBike.name}
                      width={160}
                      height={100}
                      className="w-24 h-16 rounded-lg object-cover border border-white/15 shrink-0"
                    />
                    <div>
                      <div className="text-[11px] font-mono-tech text-[#E62429] font-semibold uppercase">
                        SELECTED RACE PACKAGE
                      </div>
                      <h3 className="font-display text-2xl font-extrabold uppercase text-white leading-tight">
                        {selectedBookingBike.name}
                      </h3>
                      <div className="text-xs text-zinc-400">
                        {selectedCircuitObj.name[lang]} · {bookingDays} Day(s)
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#08090C] border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-xs text-zinc-400 font-mono-tech">
                      <span>{UI_STRINGS.bookingSection.estimatedTotal[lang]}</span>
                      <span>{currency}</span>
                    </div>
                    <div className="font-mono-tech text-3xl sm:text-4xl font-extrabold text-white">
                      {formatMoney(grandTotalUsd, currency)}
                    </div>
                    <div className="text-xs text-[#10B981]">
                      ✓ Pro Race Mechanic + Enclosed Track Transport + Pit Box + Tire Warmers Included
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => triggerWhatsappBooking()}
                      className="w-full py-3.5 px-5 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-[#08090C] font-bold text-sm sm:text-base transition flex items-center justify-center gap-2.5 cursor-pointer shadow-lg shadow-[#25D366]/20"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>{UI_STRINGS.bookingSection.sendWhatsapp[lang]}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => triggerMessengerBooking()}
                      className="w-full py-3.5 px-5 rounded-xl bg-[#0084FF] hover:bg-[#0073e0] text-white font-bold text-sm sm:text-base transition flex items-center justify-center gap-2.5 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>{UI_STRINGS.bookingSection.sendMessenger[lang]}</span>
                    </button>
                  </div>

                  <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-lg bg-white/5">
                      <div className="text-[10px] font-mono-tech text-zinc-400">INSTAGRAM</div>
                      <div className="font-mono-tech font-semibold text-white truncate mt-0.5">
                        @{config.instagramHandle.replace(/^@/, '')}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/5">
                      <div className="text-[10px] font-mono-tech text-zinc-400">LINE ID</div>
                      <div className="font-mono-tech font-semibold text-white truncate mt-0.5">
                        {config.lineId}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/5">
                      <div className="text-[10px] font-mono-tech text-zinc-400">WECHAT</div>
                      <div className="font-mono-tech font-semibold text-white truncate mt-0.5">
                        {config.wechatId}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 6. TRILINGUAL FAQ ACCORDION */}
          <section id="faq" className="py-20 bg-[#08090C]">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <ApexReveal className="text-center mb-10">
                <span className="font-mono-tech text-xs font-semibold tracking-[0.18em] text-[#E62429] uppercase">
                  RIDER BRIEFING & FAQ
                </span>
                <h2 className="mt-2 font-display text-3xl sm:text-5xl font-extrabold uppercase text-white">
                  {UI_STRINGS.nav.faq[lang]}
                </h2>
              </ApexReveal>

              <div className="space-y-3">
                {FAQS.map((item, idx) => {
                  const open = openFaqIdx === idx;
                  return (
                    <div
                      key={idx}
                      className="bg-[#101319] border border-white/12 rounded-xl overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIdx(open ? null : idx)}
                        className="w-full px-5 sm:px-6 py-4.5 flex items-center justify-between gap-4 text-left cursor-pointer"
                      >
                        <span className="font-semibold text-sm sm:text-base text-white">
                          {item.q[lang]}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#E62429] shrink-0 transition-transform ${
                            open ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {open && (
                        <div className="px-5 sm:px-6 pb-5 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-white/8 pt-3.5">
                          {item.a[lang]}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </main>
      )}

      {/* CLEAN MOTORSPORT FOOTER + OWNER SELF-EDIT HANDOVER CMS TRIGGER */}
      <footer className="bg-[#050608] border-t border-white/10 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-[#E62429] inline-flex items-center justify-center font-display font-extrabold italic text-white text-sm">
                A9
              </span>
              <span className="font-display text-lg font-extrabold uppercase text-white">
                {config.brandName}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1.5">
              Bangkok · Pattaya Bira · Chang International Circuit Buriram · EN / ไทย / 中文
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => triggerWhatsappBooking()}
              className="px-3.5 py-2 rounded-lg bg-white/6 hover:bg-white/12 text-xs font-medium text-zinc-200 transition cursor-pointer"
            >
              WhatsApp Desk
            </button>
            <button
              type="button"
              onClick={() => triggerMessengerBooking()}
              className="px-3.5 py-2 rounded-lg bg-white/6 hover:bg-white/12 text-xs font-medium text-zinc-200 transition cursor-pointer"
            >
              FB Messenger
            </button>
            <button
              type="button"
              onClick={() => setCmsOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/6 hover:bg-[#E62429]/20 border border-white/12 text-xs font-mono-tech text-zinc-300 hover:text-white transition cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-[#E62429]" />
              <span>Owner CMS (Edit Text & Prices)</span>
            </button>
          </div>
        </div>
      </footer>

      <button
        type="button"
        aria-label="Quick WhatsApp Booking"
        onClick={() => triggerWhatsappBooking()}
        className="fixed bottom-4 right-4 z-40 sm:hidden w-13 h-13 rounded-full bg-[#25D366] text-[#08090C] shadow-xl flex items-center justify-center cursor-pointer"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {cmsOpen && (
        <Suspense fallback={null}>
          <OwnerCmsModal
            open={cmsOpen}
            config={config}
            localEnquiries={localEnquiries}
            onClose={() => {
              setCmsOpen(false);
              if (window.location.hash === '#cms') {
                window.history.pushState(null, '', window.location.pathname + window.location.search);
              }
            }}
            onSaveConfig={handleSaveConfig}
            onResetConfig={handleResetConfig}
          />
        </Suspense>
      )}

      {isClientPreviewMode && (
        <Suspense fallback={null}>
          <ClientProposalDrawer
            visible={isClientPreviewMode}
            onChangeLang={setLang}
            onOpenOwnerCms={() => setCmsOpen(true)}
            onOpenR9Page={() => navigateToBikePage('yamaha-yzf-r9')}
          />
        </Suspense>
      )}

      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-6 right-6 z-50 bg-[#141821] border border-white/20 text-white text-xs sm:text-sm font-medium px-4 py-3 rounded-xl shadow-2xl"
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default App;
