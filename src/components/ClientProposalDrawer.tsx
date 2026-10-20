import React, { useState } from 'react';
import { Check, ChevronRight, Edit3, Globe2, HelpCircle, Sparkles, X } from 'lucide-react';
import { Lang } from '../data/siteData';

interface ClientProposalDrawerProps {
  visible: boolean;
  onChangeLang: (l: Lang) => void;
  onOpenOwnerCms: () => void;
  onOpenR9Page: () => void;
}

export const ClientProposalDrawer: React.FC<ClientProposalDrawerProps> = ({
  visible,
  onChangeLang,
  onOpenOwnerCms,
  onOpenR9Page,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [answers, setAnswers] = useState({
    fleetBikes: '',
    homeTracks: '',
    videoFootage: '',
    platformChoice: 'Zero-Monthly-Fee Custom CMS (or Framer if preferred)',
    budgetNote: '',
  });
  const [sent, setSent] = useState(false);

  if (!visible) return null;

  const handleSubmitAnswers = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/client-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      });
    } catch {
      // Static deploy fallback
    }
    localStorage.setItem('apex9_client_answers', JSON.stringify(answers));
    setSent(true);
  };

  return (
    <>
      {/* Discreet Floating Pill ONLY shown when ?client=1 URL param is used */}
      <div className="fixed bottom-4 left-4 z-40 max-w-[calc(100vw-2rem)]">
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2.5 bg-[#0D1016]/95 hover:bg-[#151923] border border-[#E62429]/60 shadow-2xl rounded-full px-4 py-2.5 text-left text-white backdrop-blur-md transition cursor-pointer"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-[#10B981] shrink-0" />
          <span className="text-xs font-semibold">
            Custom Build Preview & Questions for Your Brand
          </span>
          <ChevronRight className="w-4 h-4 text-[#E62429] shrink-0" />
        </button>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0E1117] border border-white/15 rounded-2xl p-6 sm:p-7 text-white shadow-2xl space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-mono-tech text-[#E62429] font-semibold uppercase mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tailored Full Build Preview · Thailand Race Bike Rental</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase">
                  Built Around Your Exact Scope — Ready to Customize 100%
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Interactive 1-Click Feature Testers */}
            <div className="space-y-2.5">
              <div className="text-xs font-mono-tech text-zinc-400 uppercase font-semibold">
                Test Key Features Live Right Now:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onChangeLang('th');
                    setModalOpen(false);
                  }}
                  className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Globe2 className="w-3.5 h-3.5 text-[#E62429]" />
                  <span>Switch to ไทย</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChangeLang('zh');
                    setModalOpen(false);
                  }}
                  className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Globe2 className="w-3.5 h-3.5 text-[#E62429]" />
                  <span>Switch to 中文</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    onOpenR9Page();
                  }}
                  className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>YZF-R9 Page</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    onOpenOwnerCms();
                  }}
                  className="p-2.5 rounded-lg bg-[#E62429]/20 hover:bg-[#E62429]/30 border border-[#E62429]/50 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#E62429]" />
                  <span>Edit Prices Live</span>
                </button>
              </div>
            </div>

            {/* Flexible Hosting + Budget Note */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs sm:text-sm text-zinc-200 leading-relaxed">
              <div className="font-semibold text-white">
                Two Seamless Handover Options + Flexible Launch Pricing:
              </div>
              <p>
                <strong>1. Zero-Monthly-Fee Custom Web + Built-in Visual CMS (Live Right Now):</strong>{' '}
                Edit every bike price, spec, video, and EN/TH/ZH translation directly inside the built-in Owner Editor — with <strong>$0/month localization fees</strong> (Framer charges monthly per extra language) and ultra-fast CDN loading in Thailand & Mainland China.
              </p>
              <p>
                <strong>2. Native Framer Project Handover:</strong> If you prefer native Framer editing, we also build and transfer the exact matching design 1:1 directly into your Framer account.
              </p>
              <p className="text-[#10B981] font-medium">
                Budget Flexibility: Because the core architecture is already built specifically for your brand, we are happy to work well within—or even lower than—your posted $1.5k–$2k budget so you can put more capital into tires and track marketing.
              </p>
            </div>

            {/* 5 Quick Project Questions */}
            <form onSubmit={handleSubmitAnswers} className="space-y-3.5">
              <div className="flex items-center gap-2 text-xs font-mono-tech text-zinc-300 uppercase font-semibold">
                <HelpCircle className="w-4 h-4 text-[#E62429]" />
                <span>5 Quick Questions to Finalize Your Exact Launch Site (Reply Here or on Contra):</span>
              </div>

              <div>
                <label className="block text-xs text-zinc-300 mb-1">
                  1. Which exact bike models & daily THB/USD rates are in your initial fleet? (We pre-loaded YZF-R9, R1M, CBR1000RR-R, Panigale V4 S, M1000RR & ZX-6R)
                </label>
                <input
                  type="text"
                  value={answers.fleetBikes}
                  onChange={(e) => setAnswers({ ...answers, fleetBikes: e.target.value })}
                  placeholder="e.g., 2x Yamaha R9, 1x R1, 2x ZX-6R..."
                  className="w-full bg-[#08090C] border border-white/15 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-300 mb-1">
                  2. Which Thai circuits will you primarily serve at launch (Bira Pattaya, Chang Buriram, Thailand Circuit Nakhon Chai Si, Kaeng Krachan)?
                </label>
                <input
                  type="text"
                  value={answers.homeTracks}
                  onChange={(e) => setAnswers({ ...answers, homeTracks: e.target.value })}
                  placeholder="e.g., Bira + Chang Buriram..."
                  className="w-full bg-[#08090C] border border-white/15 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-300 mb-1">
                  3. Do you already have raw onboard GoPro / Insta360 POV footage from your bikes for us to cut & color-grade into the hero video?
                </label>
                <input
                  type="text"
                  value={answers.videoFootage}
                  onChange={(e) => setAnswers({ ...answers, videoFootage: e.target.value })}
                  placeholder="e.g., Yes, have 4K R9 lap footage ready..."
                  className="w-full bg-[#08090C] border border-white/15 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-300 mb-1">
                  4. Handover preference — Custom Zero-Fee Self-Editable Web App (hosted wherever you prefer) OR Native Framer Transfer?
                </label>
                <select
                  value={answers.platformChoice}
                  onChange={(e) => setAnswers({ ...answers, platformChoice: e.target.value })}
                  className="w-full bg-[#08090C] border border-white/15 rounded-lg px-3 py-2 text-xs text-white"
                >
                  <option>Zero-Monthly-Fee Custom Web + Visual CMS (Free Hosting anywhere)</option>
                  <option>Native Framer Build + Full Framer Account Transfer</option>
                  <option>Undecided — let&apos;s compare on a quick message</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-zinc-300 mb-1">
                  5. Your brand name, domain idea, LINE / WeChat IDs & preferred budget target:
                </label>
                <input
                  type="text"
                  value={answers.budgetNote}
                  onChange={(e) => setAnswers({ ...answers, budgetNote: e.target.value })}
                  placeholder="Share brand name / preferred budget package..."
                  className="w-full bg-[#08090C] border border-white/15 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-[#E62429] hover:bg-[#c81d22] text-xs sm:text-sm font-semibold text-white transition cursor-pointer flex items-center justify-center gap-2"
              >
                {sent ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Saved! You can also message directly on Contra anytime.</span>
                  </>
                ) : (
                  <span>Save Notes (or Reply Directly on Contra)</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
