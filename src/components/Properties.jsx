import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform, useReducedMotion } from 'framer-motion';
import { variants } from '../hooks/useAdvancedAnimations';

const mockProperties = [
    { id: 1, title: 'Skyline Penthouse', location: 'Downtown Core', price: 5400000, type: 'Penthouse', beds: 4, baths: 5, size: 6200, image: 'https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=1600&q=80', blurb: 'Glass-framed panoramic city vistas with private roof deck and spa.' },
    { id: 2, title: 'Coastal Glass Villa', location: 'Azure Coast', price: 8700000, type: 'Villa', beds: 6, baths: 7, size: 9800, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80', blurb: 'Seamless indoor-outdoor flow, infinity edge pool and ocean horizon.' },
    { id: 3, title: 'Modern Heritage Estate', location: 'Old Ridge', price: 12500000, type: 'Estate', beds: 8, baths: 9, size: 15200, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80', blurb: 'Restored classical detailing integrated with advanced sustainability systems.' },
    { id: 4, title: 'Lakeview Retreat', location: 'Emerald Lake', price: 4600000, type: 'Villa', beds: 5, baths: 5, size: 7200, image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1600&q=80', blurb: 'Timber-accented serenity with private dock and cantilevered terrace.' },
    { id: 5, title: 'Urban Luxe Loft', location: 'Arts District', price: 2100000, type: 'Loft', beds: 2, baths: 2, size: 2800, image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1600&q=80', blurb: 'Double-height volume, industrial beams, curated gallery illumination.' },
    { id: 6, title: 'Desert Horizon Residence', location: 'Sunspire Dunes', price: 6900000, type: 'Residence', beds: 5, baths: 6, size: 8400, image: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=1600&q=80', blurb: 'Thermal-mass architecture oriented for passive cooling and sunrise framing.' }
];

const formatPrice = n => '$' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const Properties = () => {
    const [query, setQuery] = useState('');
    const [type, setType] = useState('');
    const [sort, setSort] = useState('');
    const [selected, setSelected] = useState(null); // modal property id
    const [showStats, setShowStats] = useState(false);
    const totalValue = mockProperties.reduce((a, b) => a + b.price, 0);
    const statsRef = useRef(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'swipe'
    const [isNarrow, setIsNarrow] = useState(false);

    // Detect narrow viewport to default to swipe mode option
    useEffect(() => {
        const check = () => setIsNarrow(window.innerWidth < 640);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    useEffect(() => {
        if (isNarrow) setViewMode('swipe');
        else if (viewMode === 'swipe') setViewMode('grid');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isNarrow]);

    const filtered = useMemo(() => {
        let list = mockProperties.filter(p =>
            (!type || p.type === type) &&
            (!query || p.title.toLowerCase().includes(query.toLowerCase()) || p.location.toLowerCase().includes(query.toLowerCase()))
        );
        if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
        if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
        return list;
    }, [query, type, sort]);

    // Animate stats when scrolled into view
    useEffect(() => {
        const el = statsRef.current; if (!el) return;
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) { setShowStats(true); io.disconnect(); } });
        }, { threshold: 0.4 });
        io.observe(el); return () => io.disconnect();
    }, []);

    return (
        <section id="portfolio" className="properties-section section-pad">
            <div className="section-bg-fade" />
            <div className="container">
                <motion.div initial="initial" animate="animate" variants={variants.staggerContainer}>
                    <motion.h2 className="section-heading" variants={variants.revealLuxury}>Featured Portfolio</motion.h2>
                    <motion.p className="subheading" style={{ marginBottom: '2.2rem' }} variants={variants.revealLuxury}>
                        A curated selection of distinguished residences exemplifying craftsmanship, location advantage and asset resilience.
                    </motion.p>
                </motion.div>
                <div className="portfolio-top-bar">
                    <div className="filters-inline">
                        {['', 'Penthouse', 'Villa', 'Estate', 'Loft', 'Residence'].map(t => (
                            <button key={t || 'All'} className={`filter-pill ${t === type ? 'active' : ''}`} onClick={() => setType(t)}>{t || 'All'}</button>
                        ))}
                    </div>
                    <div className="filter-bar refined">
                        <input placeholder="Search title/location" value={query} onChange={e => setQuery(e.target.value)} />
                        <select value={sort} onChange={e => setSort(e.target.value)}>
                            <option value="">Sort</option>
                            <option value="price-asc">Price ↑</option>
                            <option value="price-desc">Price ↓</option>
                        </select>
                        <button type="button" className="filter-pill" style={{ fontWeight: 600, ...(viewMode === 'swipe' ? { boxShadow: '0 0 0 1px rgba(212,175,55,.4)', borderColor: 'rgba(212,175,55,.6)', color: 'var(--color-neutral-100)', background: 'rgba(212,175,55,0.25)' } : {}) }} onClick={() => setViewMode(v => v === 'grid' ? 'swipe' : 'grid')}>
                            {viewMode === 'swipe' ? 'Grid Mode' : 'Swipe Mode'}
                        </button>
                    </div>
                </div>
                <StatsRow show={showStats} statsRef={statsRef} total={totalValue} count={mockProperties.length} />
                {viewMode === 'grid' && (
                    <motion.div className="grid properties-grid mosaic responsive" layout initial="initial" animate="animate" variants={variants.staggerContainer}>
                        {filtered.map((p, i) => (
                            <PropertyCard key={p.id} property={p} index={i} feature={i === 0} onQuickView={() => setSelected(p)} />
                        ))}
                    </motion.div>
                )}
                {viewMode === 'swipe' && (
                    <SwipeDeck items={filtered} onSelect={setSelected} />
                )}
            </div>
            <AnimatePresence>
                {selected && (
                    <PropertyModal property={selected} onClose={() => setSelected(null)} />
                )}
            </AnimatePresence>
        </section>
    );
};
const StatNumber = ({ target, prefix = '', duration = 1400 }) => {
    const [val, setVal] = useState(0);
    useEffect(() => {
        let start = null; const from = 0; const to = target;
        const step = (ts) => { if (!start) start = ts; const p = Math.min(1, (ts - start) / duration); const eased = 1 - Math.pow(1 - p, 3); setVal(Math.round(from + (to - from) * eased)); if (p < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
    }, [target, duration]);
    return <span>{prefix}{val.toLocaleString()}</span>;
};

const StatsRow = ({ show, statsRef, total, count }) => {
    const prefersReduced = useReducedMotion();
    return (
        <motion.div
            ref={statsRef}
            className="portfolio-stats"
            aria-hidden={!show}
            variants={variants.cascadeParent}
            initial="initial"
            animate={show ? 'animate' : 'initial'}
        >
            {[{
                label: 'Assets Curated', value: show ? <StatNumber target={count} /> : <span>0</span>
            }, {
                label: 'Aggregate Value', value: show ? <StatNumber target={total} prefix="$" /> : <span>$0</span>
            }, {
                label: 'Global Categories', value: show ? <StatNumber target={5} /> : <span>0</span>
            }].map(item => (
                <motion.div key={item.label} className="stat-block" variants={prefersReduced ? undefined : variants.cascadeItem}>
                    <label>{item.label}</label>
                    {item.value}
                </motion.div>
            ))}
        </motion.div>
    );
};

const PropertyCard = ({ property, index, feature = false, onQuickView }) => {
    const { id, image, title, price, location, type, beds, baths, size, blurb } = property;
    const [hiResLoaded, setHiResLoaded] = useState(false);

    // Low-quality placeholder (LQIP) using Unsplash param & high-res swap
    const lowSrc = image + '&q=10&blur=50';
    const hiSrc = image;

    useEffect(() => {
        const img = new Image();
        img.src = hiSrc;
        img.onload = () => setHiResLoaded(true);
    }, [hiSrc]);

    // Preload low quality (already near instant from Unsplash) – no state needed.

    return (
        <motion.article
            className={`card glass-strong ${feature ? 'feature-card' : ''}`}
            aria-labelledby={`prop-${id}-title`}
            variants={variants.propertyCard}
            layout
            whileHover="hover"
            whileTap="tap"
            style={{ '--card-index': index }}
        >
            {!hiResLoaded && <div className="card-skeleton"><div className="skel-shimmer" /></div>}
            <motion.div
                className="card-media"
                variants={variants.propertyCardMedia}
                style={{ backgroundImage: `url(${hiResLoaded ? hiSrc : lowSrc})`, filter: hiResLoaded ? 'none' : 'blur(18px) saturate(120%)', transition: 'filter 800ms ease' }}
            />
            <div className="card-content">
                <span className="badge">{type}</span>
                <h3 id={`prop-${id}-title`} style={{ margin: '0.9rem 0 .4rem', fontSize: feature ? '1.65rem' : '1.25rem', fontWeight: 500 }}>{title}</h3>
                <div className="price">{formatPrice(price)}</div>
                <div className="location">{location}</div>
                <div className="card-meta-row">
                    <span>{beds} BD</span>
                    <span>{baths} BA</span>
                    <span>{size.toLocaleString()} SF</span>
                </div>
            </div>
            <button
                type="button"
                className="quick-view-tag"
                aria-label={`View details for ${title}`}
                onClick={onQuickView}
            >View</button>
        </motion.article>
    );
};

const PropertyModal = ({ property, onClose }) => {
    return (
        <motion.div className="modal-portal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-backdrop" onClick={onClose} />
            <motion.div className="modal-panel glass-strong" role="dialog" aria-modal="true" aria-label={property.title}
                initial={{ y: 60, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }}
                exit={{ y: 40, opacity: 0, scale: 0.92, transition: { duration: 0.4 } }}
            >
                <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
                <div className="modal-media" style={{ backgroundImage: `url(${property.image})` }} />
                <div className="modal-body">
                    <h3 className="modal-title">{property.title}</h3>
                    <div className="modal-price">{formatPrice(property.price)}</div>
                    <div className="modal-meta">{property.beds} BD • {property.baths} BA • {property.size.toLocaleString()} SF • {property.location}</div>
                    <p style={{ color: 'var(--color-neutral-300)', lineHeight: 1.5, marginTop: '1rem' }}>{property.blurb}</p>
                    <div className="modal-actions">
                        <button className="cta">Request Viewing</button>
                        <button className="cta btn-outline" onClick={onClose}>Close</button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// SwipeDeck component for Tinder-like interaction (mobile focus)
const SwipeDeck = ({ items, onSelect }) => {
    const [deck, setDeck] = useState(items);
    const animatingRef = useRef(false);
    // Reset when items changes
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

// Isolated swipe card component (safe hooks usage)
const SwipeCard = ({ card, index, deckLength, isTop, onSelect, cycleTop, animatingRef }) => {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-300, 300], [-18, 18]);
    const controls = useAnimation();
    const mountedRef = useRef(false);

    // Track mount status to prevent calling controls.start before mounted
    useEffect(() => {
        mountedRef.current = true;
        return () => { mountedRef.current = false; };
    }, []);

    // Initial / stack position animation
    useEffect(() => {
        if (!mountedRef.current) return;
        controls.start({
            scale: 1 - (deckLength - 1 - index) * 0.028,
            y: (deckLength - 1 - index) * 16,
            opacity: 1,
            transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] }
        });
    }, [controls, deckLength, index]);

    const handleDragEnd = (event, info) => {
        if (!isTop || animatingRef.current) return;
        const threshold = 120;
        const velocity = info.velocity.x;
        const offset = info.offset.x;
        const dir = offset > 0 ? 1 : -1;
        const shouldFly = Math.abs(offset) > threshold || Math.abs(velocity) > 650;
        if (shouldFly) {
            animatingRef.current = true;
            if (mountedRef.current) {
                controls.start({
                    x: dir * (window.innerWidth + 260),
                    y: -140,
                    rotate: dir * 26,
                    scale: 1.05,
                    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] }
                }).then(() => {
                    if (mountedRef.current) {
                        cycleTop();
                        animatingRef.current = false;
                    }
                });
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
            style={{ backgroundImage: `url(${p.image}&q=60)`, zIndex: 10 + index, x, rotate }}
            initial={{ scale: 0.94, y: 40, opacity: 0 }}
            drag={isTop ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.22}
            onDragEnd={handleDragEnd}
            whileDrag={{ scale: 1.04, y: -4 }}
            onDoubleClick={() => onSelect(p)}
            animate={controls}
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

export default Properties;
