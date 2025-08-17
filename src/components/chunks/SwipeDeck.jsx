import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useMotionValue, useTransform, useReducedMotion } from 'framer-motion';
import { variants } from '../../hooks/useAdvancedAnimations';
import { formatPrice } from '../utils';

const SwipeDeck = ({ items, onSelect }) => {
  const [deck, setDeck] = useState(items);
  const animatingRef = useRef(false);
  useEffect(() => { setDeck(items); animatingRef.current = false; }, [items]);

  const cycleTop = useCallback(() => {
    setDeck(d => {
      if (!d.length) return d;
      const arr = [...d];
      const top = arr.pop();
      if (!top) return d;
      arr.unshift({ ...top, _cycle: (top._cycle || 0) + 1 });
      return arr;
    });
  }, []);

  return (
    <div className="swipe-deck">
      {deck.map((p, idx) => (
        <SwipeCard
          key={`${p.id}-${p._cycle || 0}`}
          card={p}
          index={idx}
          deckLength={deck.length}
          isTop={idx === deck.length - 1}
          onSelect={onSelect}
          cycleTop={cycleTop}
          animatingRef={animatingRef}
        />
      ))}
    </div>
  );
};

const SwipeCard = ({ card, index, deckLength, isTop, onSelect, cycleTop, animatingRef }) => {
  const x = useMotionValue(0);
  const prefersReduced = useReducedMotion();
  const rotate = useTransform(x, [-300, 300], prefersReduced ? [0, 0] : [-18, 18]);
  const controls = useAnimation();
  const mountedRef = useRef(false);
  const offscreenXRef = useRef(0);
  useEffect(() => { mountedRef.current = true; return () => { mountedRef.current = false; }; }, []);
  // Cache offscreen travel distance once per mount (avoid repeated layout reads on fast swipes)
  useEffect(() => { offscreenXRef.current = window.innerWidth + 260; }, []);
  useEffect(() => {
    if (!mountedRef.current) return;
    controls.start({
      scale: 1 - (deckLength - 1 - index) * 0.028,
      y: (deckLength - 1 - index) * 16,
      opacity: 1,
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] }
    });
  }, [controls, deckLength, index]);

  const handleDragEnd = (_, info) => {
    if (!isTop || animatingRef.current) return;
    const threshold = 120;
    const velocity = info.velocity.x;
    const offset = info.offset.x;
    const dir = offset > 0 ? 1 : -1;
    const shouldFly = Math.abs(offset) > threshold || Math.abs(velocity) > 650;
    if (shouldFly) {
      animatingRef.current = true;
      if (mountedRef.current) {
        let cycled = false;
        controls.start({
          x: dir * offscreenXRef.current,
          y: -120,
          rotate: dir * 24,
          scale: 1.04,
          transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] }
        }).finally(() => {
          if (!cycled && mountedRef.current) {
            cycleTop();
            animatingRef.current = false;
          }
        });
        // Early cycle for responsiveness (let next card appear while old continues visually off-screen)
        setTimeout(() => {
          if (!cycled && mountedRef.current) {
            cycled = true;
            cycleTop();
            animatingRef.current = false;
          }
        }, 260);
      }
    } else {
      if (mountedRef.current) {
        controls.start({ x: 0, y: 0, rotate: 0, scale: 1, transition: { type: 'spring', stiffness: 420, damping: 28 } });
      }
    }
  };

  const p = card;
  return (
    <motion.div
      className={`swipe-card glass-strong ${isTop ? 'top' : ''}`}
      style={{ backgroundImage: `url(${p.image}?w=900&auto=format&fit=crop&q=60)`, zIndex: 10 + index, x, rotate, boxShadow: isTop ? '0 18px 40px -18px rgba(0,0,0,.65),0 4px 14px -6px rgba(0,0,0,.5)' : undefined }}
      initial={{ scale: 0.94, y: 40, opacity: 0 }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.22}
      onDragEnd={handleDragEnd}
      whileDrag={prefersReduced ? undefined : { scale: 1.04, y: -4 }}
      onDoubleClick={() => onSelect(p)}
      animate={controls}
      variants={variants.propertyCard}
      transition={{ layout: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } }}
    >
      <div className="swipe-card-overlay">
        <div className="swipe-meta">
          <span className="badge" style={{ marginBottom: '.6rem' }}>{p.type}</span>
          <h3>{p.title}</h3>
          <p className="loc">{p.location}</p>
          <p className="price-line">{formatPrice(p.price)}</p>
          <div className="mini-meta">{p.beds} BD • {p.baths} BA • {p.size.toLocaleString()} SF</div>
        </div>
        <div className="swipe-actions">
          <button className="cta small" onClick={() => onSelect(p)}>Details</button>
        </div>
      </div>
    </motion.div>
  );
};

export default SwipeDeck;
