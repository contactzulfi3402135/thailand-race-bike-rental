import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export const APEX_EASE = [0.22, 1, 0.36, 1] as const;

export const TelemetryScrollRail: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 320,
    damping: 36,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX: smoothProgress, transformOrigin: '0% 50%' }}
      className="fixed top-0 left-0 right-0 h-[3px] bg-[#E62429] z-50 pointer-events-none"
    />
  );
};

interface ApexRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  yOffset?: number;
}

export const ApexReveal: React.FC<ApexRevealProps> = ({
  children,
  delay = 0,
  className = '',
  yOffset = 18,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 'some' }}
      transition={{ duration: 0.45, delay, ease: APEX_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const KerbRule: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center gap-1.5 ${className}`} aria-hidden="true">
    <span className="h-[3px] w-8 bg-[#E62429]" />
    <span className="h-[3px] w-3 bg-white/85" />
    <span className="h-[3px] w-3 bg-[#E62429]" />
  </div>
);
