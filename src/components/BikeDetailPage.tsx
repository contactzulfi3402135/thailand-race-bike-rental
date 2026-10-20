import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  Gauge,
  MessageCircle,
  Send,
  ShieldCheck,
  Timer,
  Wrench,
} from 'lucide-react';
import {
  CurrencyCode,
  FleetBike,
  formatMoney,
  Lang,
  UI_STRINGS,
} from '../data/siteData';
import { APEX_EASE, KerbRule } from './MotionPrimitives';

interface BikeDetailPageProps {
  bike: FleetBike;
  allBikes: FleetBike[];
  lang: Lang;
  currency: CurrencyCode;
  onBack: () => void;
  onSelectBikePage: (slug: string) => void;
  onBookBikeWithDays: (bikeId: string, days: 1 | 2 | 3) => void;
  onBookWhatsapp: (bike: FleetBike, days: 1 | 2 | 3) => void;
  onBookMessenger: (bike: FleetBike, days: 1 | 2 | 3) => void;
}

export const BikeDetailPage: React.FC<BikeDetailPageProps> = ({
  bike,
  allBikes,
  lang,
  currency,
  onBack,
  onSelectBikePage,
  onBookBikeWithDays,
  onBookWhatsapp,
  onBookMessenger,
}) => {
  const [selectedDays, setSelectedDays] = useState<1 | 2 | 3>(1);
  const [activePhoto, setActivePhoto] = useState<'main' | 'pit'>('main');

  const multiplier = selectedDays === 1 ? 1 : selectedDays === 2 ? 1.8 : 2.55;
  const packageTotalUsd = Math.round(bike.priceUsd * multiplier);
  const effectiveDailyUsd = Math.round(packageTotalUsd / selectedDays);

  return (
    <motion.div
      key={bike.id}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: APEX_EASE }}
      className="pt-24 pb-20 bg-[#08090C] min-h-screen"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb + Quick Bike Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/10">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-white transition cursor-pointer self-start"
          >
            <ArrowLeft className="w-4 h-4 text-[#E62429]" />
            <span>{UI_STRINGS.bikeDetail.backToFleet[lang]}</span>
          </button>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {allBikes.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => {
                  setActivePhoto('main');
                  onSelectBikePage(b.slug);
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-mono-tech whitespace-nowrap transition cursor-pointer ${
                  b.id === bike.id
                    ? 'bg-[#E62429] text-white font-semibold'
                    : 'bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {b.name.replace('Yamaha ', '').replace('Honda ', '').replace('Ducati ', '').replace('Kawasaki ', '').replace('BMW ', '')}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Split Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left: High-Res Visual Gallery + Lap Telemetry */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#101319] aspect-[16/10]">
              <img
                src={activePhoto === 'main' ? bike.image : bike.pitImage}
                alt={bike.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded bg-[#08090C]/85 backdrop-blur border border-white/15 font-mono-tech text-xs font-semibold text-white">
                  {bike.year} · {bike.classTag}
                </span>
                {bike.featuredBadge && (
                  <span className="px-3 py-1 rounded bg-[#E62429] text-white font-mono-tech text-xs font-semibold">
                    {bike.featuredBadge[lang]}
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Switcher + Circuit Lap Reference */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex gap-2.5 sm:col-span-1">
                <button
                  type="button"
                  onClick={() => setActivePhoto('main')}
                  className={`relative flex-1 aspect-[16/10] rounded-lg overflow-hidden border-2 transition cursor-pointer ${
                    activePhoto === 'main' ? 'border-[#E62429]' : 'border-white/15 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={bike.image} alt={bike.name} className="w-full h-full object-cover" />
                </button>
                <button
                  type="button"
                  onClick={() => setActivePhoto('pit')}
                  className={`relative flex-1 aspect-[16/10] rounded-lg overflow-hidden border-2 transition cursor-pointer ${
                    activePhoto === 'pit' ? 'border-[#E62429]' : 'border-white/15 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={bike.pitImage} alt="Pit box support" className="w-full h-full object-cover" />
                </button>
              </div>

              <div className="sm:col-span-2 grid grid-cols-2 gap-3 bg-[#101319] border border-white/10 rounded-lg p-3.5">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono-tech text-zinc-400">
                    <Timer className="w-3.5 h-3.5 text-[#E62429]" />
                    <span>CHANG BURIRAM GP</span>
                  </div>
                  <div className="font-mono-tech text-lg sm:text-xl font-bold text-white mt-0.5">
                    {bike.lapBuriram}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono-tech text-zinc-400">
                    <Timer className="w-3.5 h-3.5 text-[#E62429]" />
                    <span>BIRA PATTAYA</span>
                  </div>
                  <div className="font-mono-tech text-lg sm:text-xl font-bold text-white mt-0.5">
                    {bike.lapBira}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Pricing Tier Configurator & Direct Booking */}
          <div className="lg:col-span-5 bg-[#101319] border border-white/12 rounded-xl p-6 sm:p-7">
            <KerbRule className="mb-3" />
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase text-white leading-tight">
              {bike.name}
            </h1>
            <p className="mt-2.5 text-sm sm:text-base text-zinc-300 leading-relaxed">
              {bike.summary[lang]}
            </p>

            {/* Core Telemetry Strip */}
            <div className="mt-5 grid grid-cols-3 gap-2.5 pt-4 pb-5 border-y border-white/10">
              <div>
                <div className="text-[11px] font-mono-tech text-zinc-400">REAR WHEEL</div>
                <div className="font-mono-tech text-lg font-bold text-white">{bike.whp} WHP</div>
              </div>
              <div>
                <div className="text-[11px] font-mono-tech text-zinc-400">RACE WET</div>
                <div className="font-mono-tech text-lg font-bold text-white">{bike.weightKg} KG</div>
              </div>
              <div>
                <div className="text-[11px] font-mono-tech text-zinc-400">PEAK V-MAX</div>
                <div className="font-mono-tech text-lg font-bold text-white">{bike.topSpeedKmh} KM/H</div>
              </div>
            </div>

            {/* Package Selector */}
            <div className="mt-5">
              <div className="text-xs font-mono-tech font-semibold text-zinc-400 uppercase mb-2.5">
                {UI_STRINGS.bikeDetail.selectPackage[lang]}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { d: 1 as const, label: '1 DAY', badge: 'STANDARD' },
                  { d: 2 as const, label: '2 DAYS', badge: 'SAVE 10%' },
                  { d: 3 as const, label: '3 DAYS', badge: 'SAVE 15%' },
                ]).map((opt) => (
                  <button
                    key={opt.d}
                    type="button"
                    onClick={() => setSelectedDays(opt.d)}
                    className={`p-2.5 rounded-lg border text-left transition cursor-pointer ${
                      selectedDays === opt.d
                        ? 'border-[#E62429] bg-[#E62429]/15 text-white'
                        : 'border-white/10 bg-black/30 text-zinc-300 hover:border-white/25'
                    }`}
                  >
                    <div className="font-mono-tech text-xs font-bold">{opt.label}</div>
                    <div className="font-mono-tech text-[10px] text-[#E62429] font-semibold mt-0.5">
                      {opt.badge}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Calculated Rate */}
            <div className="mt-5 p-4 rounded-lg bg-[#08090C] border border-white/10 flex items-baseline justify-between">
              <div>
                <div className="text-[11px] font-mono-tech text-zinc-400 uppercase">
                  {selectedDays}-DAY TURNKEY TOTAL
                </div>
                <div className="font-mono-tech text-2xl sm:text-3xl font-bold text-white mt-0.5">
                  {formatMoney(packageTotalUsd, currency)}
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono-tech text-xs text-[#10B981] font-semibold">
                  {formatMoney(effectiveDailyUsd, currency)} / day
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5">Mechanic + Pit Included</div>
              </div>
            </div>

            {/* Instant Booking Buttons */}
            <div className="mt-5 space-y-2.5">
              <button
                type="button"
                onClick={() => onBookWhatsapp(bike, selectedDays)}
                className="w-full inline-flex items-center justify-center gap-2.5 bg-[#E62429] hover:bg-[#c81d22] text-white font-semibold py-3.5 px-5 rounded-lg transition cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{UI_STRINGS.bookingSection.sendWhatsapp[lang]}</span>
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => onBookMessenger(bike, selectedDays)}
                  className="inline-flex items-center justify-center gap-2 bg-white/8 hover:bg-white/14 border border-white/15 text-white text-xs sm:text-sm font-semibold py-3 px-4 rounded-lg transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-sky-400" />
                  <span>Messenger</span>
                </button>
                <button
                  type="button"
                  onClick={() => onBookBikeWithDays(bike.id, selectedDays)}
                  className="inline-flex items-center justify-center gap-2 bg-white/8 hover:bg-white/14 border border-white/15 text-white text-xs sm:text-sm font-semibold py-3 px-4 rounded-lg transition cursor-pointer"
                >
                  <Gauge className="w-3.5 h-3.5 text-[#E62429]" />
                  <span>Enquiry Form</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Full Race Build Spec Sheet + Included Matrix */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-[#101319] border border-white/10 rounded-xl p-6 sm:p-8">
            <div className="flex items-center gap-2.5 mb-5">
              <Wrench className="w-5 h-5 text-[#E62429]" />
              <h2 className="font-display text-2xl font-bold uppercase text-white">
                {UI_STRINGS.bikeDetail.buildSheetTitle[lang]}
              </h2>
            </div>
            <div className="divide-y divide-white/10">
              {bike.buildSheet.map((row, idx) => (
                <div key={idx} className="py-4 first:pt-0 last:pb-0 sm:grid sm:grid-cols-3 sm:gap-4">
                  <div className="font-mono-tech text-xs font-semibold text-zinc-400 uppercase">
                    {row.category[lang]}
                  </div>
                  <div className="mt-1 sm:mt-0 sm:col-span-2 text-sm text-zinc-100 leading-relaxed">
                    {row.detail[lang]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#101319] border border-white/10 rounded-xl p-6 sm:p-8 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3.5">
                <ShieldCheck className="w-5 h-5 text-[#10B981]" />
                <h3 className="font-display text-xl font-bold uppercase text-white">
                  {UI_STRINGS.includedSection.includedColTitle[lang]}
                </h3>
              </div>
              <ul className="space-y-2.5">
                {bike.includedHighlights[lang].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-200">
                    <Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-5 border-t border-white/10">
              <div className="text-xs font-mono-tech font-semibold text-zinc-400 uppercase mb-2.5">
                TRANSPARENT RIDER TERMS & OPTIONS
              </div>
              <ul className="space-y-2">
                {bike.riderNotes[lang].map((note, i) => (
                  <li key={i} className="text-xs sm:text-sm text-zinc-300 leading-relaxed pl-3 border-l-2 border-[#E62429]">
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
