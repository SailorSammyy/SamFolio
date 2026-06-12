'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

function getDeviceTier() {
  if (typeof window === 'undefined') return 'high';
  const cores = navigator.hardwareConcurrency || 2;
  const isTouch = navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth <= 768;
  if (isTouch && isSmallScreen) return cores <= 4 ? 'low' : 'mid';
  return cores <= 2 ? 'low' : 'high';
}

const TIER_DEFAULTS = {
  low:  { starsCount: 30, dprCap: 1, glow: false, frameSkip: 1 },
  mid:  { starsCount: 50, dprCap: 1, glow: true,  frameSkip: 1 },
  high: { starsCount: 90, dprCap: 2, glow: true,  frameSkip: 0 },
};

function GravityStarsBackground({
  starsCount,
  starsSize = 2,
  starsOpacity = 0.75,
  glowIntensity = 15,
  glowAnimation = 'ease',
  glowEnabled,
  movementSpeed = 0.3,
  mouseInfluence = 120,
  mouseGravity = 'attract',
  gravityStrength = 75,
  starsInteraction = false,
  starsInteractionType = 'bounce',
  starColor = '#ffffff',
  className,
  ...props
}) {
  const tier = React.useMemo(() => getDeviceTier(), []);
  const tierCfg = TIER_DEFAULTS[tier];

  const resolvedCount = starsCount ?? tierCfg.starsCount;
  const enableGlow    = glowEnabled !== undefined ? glowEnabled : tierCfg.glow;
  const dprCap        = tierCfg.dprCap;
  const frameSkip     = tierCfg.frameSkip;

  const containerRef  = React.useRef(null);
  const canvasRef     = React.useRef(null);
  const animRef       = React.useRef(null);
  const starsRef      = React.useRef([]);
  const mouseRef      = React.useRef({ x: -9999, y: -9999 });
  const frameCount    = React.useRef(0);
  const hiddenRef     = React.useRef(false);

  const dprRef        = React.useRef(1);
  const sizeRef       = React.useRef({ width: 800, height: 600 });

  const readColor = React.useCallback(() => starColor, [starColor]);

  const initStars = React.useCallback((w, h) => {
    starsRef.current = Array.from({ length: resolvedCount }).map(() => {
      const angle = Math.random() * Math.PI * 2;
      const speed = movementSpeed * (0.5 + Math.random() * 0.5);
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * starsSize + 1,
        opacity: starsOpacity,
        baseOpacity: starsOpacity,
        mass: Math.random() * 0.5 + 0.5,
        glowMultiplier: 1,
        glowVelocity: 0,
      };
    });
  }, [resolvedCount, movementSpeed, starsOpacity, starsSize]);

  const redistributeStars = React.useCallback((w, h) => {
    starsRef.current.forEach((p) => {
      p.x = Math.random() * w;
      p.y = Math.random() * h;
    });
  }, []);

  const resizeCanvas = React.useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const rect = container.getBoundingClientRect();
    const nextDpr = Math.max(1, Math.min(window.devicePixelRatio || 1, dprCap));
    dprRef.current = nextDpr;
    canvas.width  = Math.max(1, Math.floor(rect.width  * nextDpr));
    canvas.height = Math.max(1, Math.floor(rect.height * nextDpr));
    canvas.style.width  = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    sizeRef.current = { width: rect.width, height: rect.height };
    if (starsRef.current.length === 0) {
      initStars(rect.width, rect.height);
    } else {
      redistributeStars(rect.width, rect.height);
    }
  }, [dprCap, initStars, redistributeStars]);

  React.useEffect(() => {
    const onMouseMove = (e) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onTouchMove = (e) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const t = e.touches[0];
      if (!t) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: t.clientX - rect.left, y: t.clientY - rect.top };
    };

    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  React.useEffect(() => {
    const onVisibility = () => { hiddenRef.current = document.hidden; };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  React.useEffect(() => {
    resizeCanvas();
    const container = containerRef.current;
    const ro = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(resizeCanvas)
      : null;
    if (container && ro) ro.observe(container);
    window.addEventListener('resize', resizeCanvas, { passive: true });
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (ro && container) ro.disconnect();
    };
  }, [resizeCanvas]);

  const updateStars = React.useCallback(() => {
    const { width: w, height: h } = sizeRef.current;
    const mouse = mouseRef.current;
    const stars = starsRef.current;

    for (let i = 0; i < stars.length; i++) {
      const p = stars[i];

      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.hypot(dx, dy);

      if (dist < mouseInfluence && dist > 0) {
        const force = (mouseInfluence - dist) / mouseInfluence;
        const nx = dx / dist;
        const ny = dy / dist;
        const g = force * (gravityStrength * 0.001);

        if (mouseGravity === 'attract') {
          p.vx += nx * g;
          p.vy += ny * g;
        } else {
          p.vx -= nx * g;
          p.vy -= ny * g;
        }

        p.opacity = Math.min(1, p.baseOpacity + force * 0.4);

        if (enableGlow) {
          const targetGlow = 1 + force * 2;
          const currentGlow = p.glowMultiplier;
          if (glowAnimation === 'instant') {
            p.glowMultiplier = targetGlow;
          } else if (glowAnimation === 'ease') {
            p.glowMultiplier = currentGlow + (targetGlow - currentGlow) * 0.15;
          } else {
            const spring = (targetGlow - currentGlow) * 0.2;
            p.glowVelocity = p.glowVelocity * 0.85 + spring;
            p.glowMultiplier = currentGlow + p.glowVelocity;
          }
        }
      } else {
        p.opacity = Math.max(p.baseOpacity * 0.3, p.opacity - 0.02);
        if (enableGlow) {
          const currentGlow = p.glowMultiplier;
          if (glowAnimation === 'instant') {
            p.glowMultiplier = 1;
          } else if (glowAnimation === 'ease') {
            p.glowMultiplier = Math.max(1, currentGlow + (1 - currentGlow) * 0.08);
          } else {
            const spring = (1 - currentGlow) * 0.15;
            p.glowVelocity = p.glowVelocity * 0.9 + spring;
            p.glowMultiplier = Math.max(1, currentGlow + p.glowVelocity);
          }
        }
      }

      if (starsInteraction) {
        for (let j = i + 1; j < stars.length; j++) {
          const o = stars[j];
          const dx2 = o.x - p.x;
          const dy2 = o.y - p.y;
          const d   = Math.hypot(dx2, dy2);
          const minD = p.size + o.size + 5;
          if (d < minD && d > 0) {
            if (starsInteractionType === 'bounce') {
              const nx = dx2 / d;
              const ny = dy2 / d;
              const speed = (p.vx - o.vx) * nx + (p.vy - o.vy) * ny;
              if (speed < 0) continue;
              const impulse = (2 * speed) / (p.mass + o.mass);
              p.vx -= impulse * o.mass * nx; p.vy -= impulse * o.mass * ny;
              o.vx += impulse * p.mass * nx; o.vy += impulse * p.mass * ny;
              const overlap = (minD - d) * 0.5;
              p.x -= nx * overlap; p.y -= ny * overlap;
              o.x += nx * overlap; o.y += ny * overlap;
            } else {
              const mf = (minD - d) / minD;
              p.glowMultiplier += mf * 0.5;
              o.glowMultiplier += mf * 0.5;
              const af = mf * 0.01;
              p.vx += dx2 * af; p.vy += dy2 * af;
              o.vx -= dx2 * af; o.vy -= dy2 * af;
            }
          }
        }
      }

      p.x += p.vx;
      p.y += p.vy;

      p.vx += (Math.random() - 0.5) * 0.001;
      p.vy += (Math.random() - 0.5) * 0.001;

      p.vx *= 0.999;
      p.vy *= 0.999;

      if (p.x < 0) p.x = w;
      else if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      else if (p.y > h) p.y = 0;
    }
  }, [mouseInfluence, mouseGravity, gravityStrength, glowAnimation, enableGlow, starsInteraction, starsInteractionType]);

  const drawStars = React.useCallback((ctx) => {
    const dpr   = dprRef.current;
    const color = readColor();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (const p of starsRef.current) {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle   = color;

      if (enableGlow) {
        ctx.shadowColor = color;
        ctx.shadowBlur  = glowIntensity * p.glowMultiplier * 2;
      }

      ctx.beginPath();
      ctx.arc(p.x * dpr, p.y * dpr, p.size * dpr, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }, [enableGlow, glowIntensity, readColor]);

  const animate = React.useCallback(() => {
    animRef.current = requestAnimationFrame(animate);

    if (hiddenRef.current) return;

    if (frameSkip > 0) {
      frameCount.current = (frameCount.current + 1) % (frameSkip + 1);
      if (frameCount.current !== 0) return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    updateStars();
    drawStars(ctx);
  }, [updateStars, drawStars, frameSkip]);

  React.useEffect(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
        animRef.current = null;
      }
    };
  }, [animate]);

  return (
    <div
      ref={containerRef}
      data-slot="gravity-stars-background"
      className={cn('relative size-full overflow-hidden', className)}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}

export { GravityStarsBackground };
