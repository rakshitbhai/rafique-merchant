import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion, useMotionValue, useTransform } from 'framer-motion';
import { formatPrice } from '../utils';
import { imageCache, performanceMonitor } from '../../utils/imageCache';

/*
  Redesigned SwipeDeck:
  - Uses an index pointer instead of mutating an array (less GC & re-renders)
  - Renders only the top 3 cards + an ephemeral "leaving" card during fling
  - Velocity & distance based fling with spring settle for cancel
  - Early index advance timed to mid-flight for snappier feel without flicker
  - Keyboard accessibility (Left/Right to simulate swipe, Enter/Space for details)
  - Reduced motion friendly (no rotation / depth scale if prefers-reduced-motion)
  - Preloads next image to cut decode hitch
*/

const VISIBLE = 3;
const FLY_DISTANCE_EXTRA = 160; // extra px beyond viewport for off-screen flight
const FLY_DURATION = 0.38; // s
const THRESHOLD_PX = 110;
const THRESHOLD_VELO = 620;

const SwipeDeck = ({ items, onSelect }) => {
  const [index, setIndex] = useState(0); // pointer to current top
  const [leaving, setLeaving] = useState(null); // { item, dir, key }
  const len = items.length;
  const prefersReduced = useReducedMotion();
  const viewportW = useRef(typeof window !== 'undefined' ? window.innerWidth : 1024);

  // Update viewport width on resize (cheap)
  useEffect(() => {
    const h = () => { viewportW.current = window.innerWidth; };
    window.addEventListener('resize', h, { passive: true });
    return () => window.removeEventListener('resize', h);
  }, []);

  // Preload the image 2 steps ahead with caching
  useEffect(() => {
    if (!len) return;

    performanceMonitor.markStart('swipe-preload');
    const preloadIdx = (index + VISIBLE) % len;
    const imageUrl = imageCache.getImageUrls(items[preloadIdx].image, {
      widths: [720, 900],
      quality: 60,
      formats: ['webp', 'jpg']
    }).base;

    imageCache.preloadImage(imageUrl, 'low')
      .then(() => performanceMonitor.markEnd('swipe-preload'))
      .catch(() => performanceMonitor.markEnd('swipe-preload'));
  }, [index, items, len]);

  const goNext = useCallback((dir) => {
    // dir: 1 for right, -1 for left
    if (!len) return;
    setIndex(i => (i + 1) % len);
  }, [len]);

  const displayed = useMemo(() => {
    if (!len) return [];
    const arr = [];
    for (let o = 0; o < Math.min(VISIBLE, len); o++) {
      const idx = (index + o) % len;
      arr.push({ item: items[idx], offset: o, stackKey: `${items[idx].id}-${Math.floor((index + o) / len)}` });
    }
    return arr;
  }, [index, items, len]);

  // Public fling trigger used by keyboard / drag
  const triggerFling = useCallback((dir) => {
    if (!len) return;
    const top = items[index];
    const leaveKey = `${top.id}-leave-${Date.now()}`;
    setLeaving({ item: top, dir, key: leaveKey });
    // Advance index mid-flight for responsiveness
    setTimeout(() => { goNext(dir); }, FLY_DURATION * 500); // about half animation
    // Clear leaving after animation window
    setTimeout(() => { setLeaving(l => (l && l.key === leaveKey ? null : l)); }, FLY_DURATION * 1000 + 80);
  }, [len, items, index, goNext]);

  // Keyboard support
  useEffect(() => {
    const handler = (e) => {
      if (!len) return;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        triggerFling(e.key === 'ArrowRight' ? 1 : -1);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect && onSelect(items[index]);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [index, items, len, onSelect, triggerFling]);

  return (
    <div className="swipe-deck" aria-label="Property swipe deck" role="list" style={{ position: 'relative' }}>
      <AnimatePresence>
        {leaving && (
          <LeavingCard key={leaving.key} data={leaving} viewportW={viewportW} prefersReduced={prefersReduced} />
        )}
      </AnimatePresence>
      {displayed.map(({ item, offset, stackKey }) => (
        <CardLayer
          key={stackKey}
          item={item}
          offset={offset}
          onSelect={onSelect}
          isTop={offset === 0 && !leaving}
          triggerFling={triggerFling}
          prefersReduced={prefersReduced}
          viewportW={viewportW}
        />
      ))}
    </div>
  );
};

const CardLayer = ({ item, offset, onSelect, isTop, triggerFling, prefersReduced, viewportW }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-320, 320], prefersReduced ? [0, 0] : [-15, 15]);
  const scale = prefersReduced ? 1 : 1 - offset * 0.05;
  const y = prefersReduced ? offset * 10 : offset * 14;
  const shadow = offset === 0 ? '0 18px 40px -18px rgba(0,0,0,.65),0 4px 14px -6px rgba(0,0,0,.5)' : '0 8px 20px -12px rgba(0,0,0,.5)';
  const draggingRef = useRef(false);

  // Get optimized image URLs
  const imageUrls = useMemo(() =>
    imageCache.getImageUrls(item.image, {
      widths: [720, 900],
      quality: 60,
      formats: ['webp', 'jpg']
    }), [item.image]
  );

  const handleDragEnd = useCallback((_, info) => {
    if (!isTop) return;
    const dist = info.offset.x;
    const velo = info.velocity.x;
    const dir = dist > 0 ? 1 : -1;
    const should = Math.abs(dist) > THRESHOLD_PX || Math.abs(velo) > THRESHOLD_VELO;
    if (should) {
      draggingRef.current = false;
      triggerFling(dir);
    } else {
      // spring back
      x.stop();
    }
  }, [isTop, triggerFling, x]);

  return (
    <motion.div
      role={isTop ? 'option' : 'presentation'}
      aria-selected={isTop}
      className={`swipe-card glass-strong${isTop ? ' top' : ''}`}
      style={{
        backgroundImage: `url(${imageUrls.base})`,
        zIndex: 50 - offset,
        x,
        rotate,
        scale,
        y,
        boxShadow: shadow,
        cursor: isTop ? 'grab' : 'default',
        willChange: isTop ? 'transform' : 'auto'
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.25}
      onDragEnd={handleDragEnd}
      whileDrag={prefersReduced ? undefined : { scale: scale * 1.035, y: y - 4 }}
      initial={{ opacity: 0, scale: scale * 0.94, y: y + 20 }}
      animate={{ opacity: 1, scale, y, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
      exit={{ opacity: 0, y: y - 40, scale: scale * 0.9, transition: { duration: 0.25 } }}
      onDoubleClick={() => onSelect && onSelect(item)}
    >
      <CardInner item={item} onSelect={onSelect} />
    </motion.div>
  );
};

const LeavingCard = ({ data, viewportW, prefersReduced }) => {
  const { item, dir } = data;
  const dist = viewportW.current + FLY_DISTANCE_EXTRA;

  // Get optimized image URLs for leaving card
  const imageUrls = useMemo(() =>
    imageCache.getImageUrls(item.image, {
      widths: [720, 900],
      quality: 60,
      formats: ['webp', 'jpg']
    }), [item.image]
  );

  return (
    <motion.div
      className="swipe-card glass-strong leaving"
      style={{
        backgroundImage: `url(${imageUrls.base})`,
        zIndex: 100,
        position: 'absolute',
        inset: 0,
        cursor: 'default',
        willChange: 'transform, opacity'
      }}
      initial={{ x: 0, y: 0, rotate: 0, scale: 1 }}
      animate={{
        x: dir * dist,
        y: -120,
        rotate: prefersReduced ? 0 : dir * 26,
        scale: 1.05,
        opacity: 0.9,
        transition: { duration: FLY_DURATION, ease: [0.16, 1, 0.3, 1] }
      }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
    >
      <CardInner item={item} />
    </motion.div>
  );
};

const CardInner = ({ item, onSelect }) => (
  <div className="swipe-card-overlay">
    <div className="swipe-meta">
      <span className="badge" style={{ marginBottom: '.6rem' }}>{item.type}</span>
      <h3>{item.title}</h3>
      <p className="loc">{item.location}</p>
      <p className="price-line">{formatPrice(item.price)}</p>
      <div className="mini-meta">{item.beds} BD • {item.baths} BA • {item.size.toLocaleString()} SF</div>
    </div>
    {onSelect && <div className="swipe-actions"><button className="cta small" onClick={() => onSelect(item)}>Details</button></div>}
  </div>
);

export default SwipeDeck;
