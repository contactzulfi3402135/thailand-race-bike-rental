import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, MessageCircle, Pause, Play, Video } from 'lucide-react';
import { Lang, SiteConfig, UI_STRINGS } from '../data/siteData';
import { KerbRule } from './MotionPrimitives';

interface HeroVideoStageProps {
  config: SiteConfig;
  lang: Lang;
  onChangeVideoMode: (mode: 'track' | 'pov' | 'custom') => void;
  onOpenWhatsapp: () => void;
}

export const HeroVideoStage: React.FC<HeroVideoStageProps> = ({
  config,
  lang,
  onChangeVideoMode,
  onOpenWhatsapp,
}) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [paused, setPaused] = useState(false);
  const [attachVideo, setAttachVideo] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);

  // Give high-priority WebP bike cards a crisp 100ms head start on HTTP/2 before streaming video
  useEffect(() => {
    const timer = setTimeout(() => setAttachVideo(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.78], [1, 0.18]);

  const videoSrc =
    config.activeVideoMode === 'custom' && config.customVideoUrl.trim()
      ? config.customVideoUrl.trim()
      : config.activeVideoMode === 'pov'
        ? '/videos/hero-pov-fast.mp4'
        : '/videos/hero-track-fast.mp4';

  useEffect(() => {
    setVideoPlaying(false);
    setPaused(false);
  }, [videoSrc]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setPaused(false);
    } else {
      videoRef.current.pause();
      setPaused(true);
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] w-full flex flex-col justify-end overflow-hidden bg-[#08090C] pt-24 pb-20 sm:pb-12"
    >
      {/* Instant Zero-Delay Poster Layer + Smooth Fade-In Fast Video Stream */}
      <motion.div style={{ y: videoY }} className="absolute inset-0 w-full h-[112%] -top-[6%] z-0">
        <img
          src="/images/hero-pov-fallback.webp"
          alt="Track POV"
          fetchPriority="high"
          decoding="sync"
          className="absolute inset-0 h-full w-full object-cover object-center scale-[1.02]"
        />

        {attachVideo && (
          <video
            key={videoSrc}
            ref={videoRef}
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onPlaying={() => setVideoPlaying(true)}
            onCanPlay={() => setVideoPlaying(true)}
            className={`relative h-full w-full object-cover object-center scale-[1.02] transition-opacity duration-300 ${
              videoPlaying ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Crisp Editorial Readability Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(8,9,12,0.68) 0%, rgba(8,9,12,0.28) 42%, rgba(8,9,12,0.88) 84%, rgba(8,9,12,0.98) 100%)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 20% 75%, rgba(8,9,12,0.72) 0%, rgba(8,9,12,0) 65%)',
          }}
        />
      </motion.div>

      {/* Main Hero Foreground Content — Renders Immediately at Full Contrast (Zero Opacity Wait!) */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-3 mb-4">
            <KerbRule />
            <span className="font-mono-tech text-[11px] sm:text-xs font-semibold tracking-[0.18em] text-zinc-200 uppercase">
              {config.heroEyebrow[lang]}
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase leading-[0.96] text-white tracking-tight">
            {config.heroTitle[lang]}
          </h1>

          <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg text-zinc-200/95 leading-relaxed max-w-2xl">
            {config.heroSubtitle[lang]}
          </p>

          {/* Primary Conversion Actions */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#fleet"
              className="inline-flex items-center justify-center gap-2 bg-[#E62429] hover:bg-[#c81d22] active:scale-[0.98] text-white font-semibold text-sm sm:text-base px-6 py-3.5 rounded-lg transition-all shadow-lg shadow-[#E62429]/25"
            >
              <span>{UI_STRINGS.hero.ctaPrimary[lang]}</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={onOpenWhatsapp}
              className="inline-flex items-center justify-center gap-2.5 bg-white/10 hover:bg-white/18 backdrop-blur-md border border-white/20 text-white font-semibold text-sm sm:text-base px-5 py-3.5 rounded-lg transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>{UI_STRINGS.hero.ctaWhatsapp[lang]}</span>
            </button>
          </div>
        </div>

        {/* Bottom Telemetry Strip + Video Camera Switcher */}
        <div className="mt-8 sm:mt-10 pt-5 border-t border-white/15 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-zinc-300 font-medium">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#10B981]" />
              {UI_STRINGS.hero.statBikes[lang]}
            </span>
            <span className="text-white/25 hidden sm:inline">/</span>
            <span>{UI_STRINGS.hero.statCrew[lang]}</span>
            <span className="text-white/25 hidden sm:inline">/</span>
            <span className="font-mono-tech text-xs text-white">{UI_STRINGS.hero.statLangs[lang]}</span>
          </div>

          {/* Interactive POV / Track Video Reel Selector */}
          <div className="flex items-center gap-1.5 self-start md:self-auto bg-black/55 backdrop-blur-md border border-white/15 rounded-lg p-1">
            <Video className="w-3.5 h-3.5 text-zinc-400 ml-2 mr-0.5 shrink-0" />
            <button
              type="button"
              onClick={() => onChangeVideoMode('track')}
              className={`px-2.5 py-1.5 rounded text-[11px] font-mono-tech font-semibold transition cursor-pointer ${
                config.activeVideoMode === 'track'
                  ? 'bg-[#E62429] text-white'
                  : 'text-zinc-300 hover:text-white'
              }`}
            >
              {UI_STRINGS.hero.reelTrack[lang]}
            </button>
            <button
              type="button"
              onClick={() => onChangeVideoMode('pov')}
              className={`px-2.5 py-1.5 rounded text-[11px] font-mono-tech font-semibold transition cursor-pointer ${
                config.activeVideoMode === 'pov'
                  ? 'bg-[#E62429] text-white'
                  : 'text-zinc-300 hover:text-white'
              }`}
            >
              {UI_STRINGS.hero.reelPov[lang]}
            </button>
            {config.customVideoUrl.trim() && (
              <button
                type="button"
                onClick={() => onChangeVideoMode('custom')}
                className={`px-2.5 py-1.5 rounded text-[11px] font-mono-tech font-semibold transition cursor-pointer ${
                  config.activeVideoMode === 'custom'
                    ? 'bg-[#E62429] text-white'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                {UI_STRINGS.hero.reelCustom[lang]}
              </button>
            )}
            <button
              type="button"
              onClick={togglePlay}
              aria-label={paused ? 'Play hero video' : 'Pause hero video'}
              className="p-1.5 text-zinc-300 hover:text-white transition cursor-pointer"
            >
              {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
