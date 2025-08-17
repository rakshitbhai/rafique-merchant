import React, { useEffect, useMemo, useRef, useState, memo, lazy, Suspense } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { variants } from '../hooks/useAdvancedAnimations';
import { useInView } from 'react-intersection-observer';
import { formatPrice } from './utils';

const baseImgParams = 'auto=format&fit=crop&q=70'; // balanced quality
const mockProperties = [
    { id: 1, title: 'Skyline Penthouse', location: 'Downtown Core', price: 5400000, type: 'Penthouse', beds: 4, baths: 5, size: 6200, image: 'https://images.unsplash.com/photo-1502005097973-6a7082348e28', blurb: 'Glass-framed panoramic city vistas with private roof deck and spa.' },
    { id: 2, title: 'Coastal Glass Villa', location: 'Azure Coast', price: 8700000, type: 'Villa', beds: 6, baths: 7, size: 9800, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c', blurb: 'Seamless indoor-outdoor flow, infinity edge pool and ocean horizon.' },
    { id: 3, title: 'Modern Heritage Estate', location: 'Old Ridge', price: 12500000, type: 'Estate', beds: 8, baths: 9, size: 15200, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750', blurb: 'Restored classical detailing integrated with advanced sustainability systems.' },
    { id: 4, title: 'Lakeview Retreat', location: 'Emerald Lake', price: 4600000, type: 'Villa', beds: 5, baths: 5, size: 7200, image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c', blurb: 'Timber-accented serenity with private dock and cantilevered terrace.' },
    { id: 5, title: 'Urban Luxe Loft', location: 'Arts District', price: 2100000, type: 'Loft', beds: 2, baths: 2, size: 2800, image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb', blurb: 'Double-height volume, industrial beams, curated gallery illumination.' },
    { id: 6, title: 'Desert Horizon Residence', location: 'Sunspire Dunes', price: 6900000, type: 'Residence', beds: 5, baths: 6, size: 8400, image: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8', blurb: 'Thermal-mass architecture oriented for passive cooling and sunrise framing.' }
];

// formatPrice imported from utils

const Properties = () => {
    const [query, setQuery] = useState('');
    const [type, setType] = useState('');
    const [sort, setSort] = useState('');
    const [selected, setSelected] = useState(null); // modal property id
    const [showStats, setShowStats] = useState(false);
    const totalValue = mockProperties.reduce((a, b) => a + b.price, 0);
    const statsRef = useRef(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'swipe'
    const { ref: statsRowRef, inView: statsInView } = useInView({ triggerOnce: true, threshold: 0.3 });
    const { ref: deckRef, inView: deckInView } = useInView({ triggerOnce: false, threshold: 0.2 });
    const [isNarrow, setIsNarrow] = useState(false);

    // Detect narrow viewport to default to swipe mode option
    // Throttled resize listener to avoid layout thrash
    useEffect(() => {
        let frame = null;
        const check = () => {
            if (frame) return;
            frame = requestAnimationFrame(() => {
                setIsNarrow(window.innerWidth < 640);
                frame = null;
            });
        };
        check();
        window.addEventListener('resize', check, { passive: true });
        return () => { window.removeEventListener('resize', check); if (frame) cancelAnimationFrame(frame); };
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
                {!(viewMode === 'swipe' && isNarrow) && (
                    <div ref={statsRowRef}>
                        {statsInView && <StatsRow show={showStats} statsRef={statsRef} total={totalValue} count={mockProperties.length} />}
                    </div>
                )}
                {viewMode === 'grid' && (
                    <motion.div className="grid properties-grid mosaic responsive" layout initial="initial" animate="animate" variants={variants.staggerContainer}>
                        {filtered.map((p, i) => (
                            <PropertyCard key={p.id} property={p} index={i} feature={i === 0} onQuickView={() => setSelected(p)} />
                        ))}
                    </motion.div>
                )}
                {viewMode === 'swipe' && (
                    <div ref={deckRef}>
                        {deckInView && (
                            <Suspense fallback={<div style={{ height: 520, display: 'grid', placeItems: 'center', fontSize: '.6rem', letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--color-neutral-500)' }}>Loading deck…</div>}>
                                <LazySwipeDeck items={filtered} onSelect={setSelected} />
                            </Suspense>
                        )}
                    </div>
                )}
            </div>
            <AnimatePresence>
                {selected && (
                    <Suspense fallback={null}>
                        <LazyPropertyModal property={selected} onClose={() => setSelected(null)} />
                    </Suspense>
                )}
            </AnimatePresence>
        </section>
    );
};
// Lazy loaded heavy subcomponents
const LazyPropertyModal = lazy(() => import(/* webpackChunkName: 'property-modal' */ './chunks/PropertyModal'));
const LazySwipeDeck = lazy(() => import(/* webpackChunkName: 'swipe-deck' */ './chunks/SwipeDeck'));
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

const PropertyCard = memo(({ property, index, feature = false, onQuickView }) => {
    const { id, image, title, price, location, type, beds, baths, size } = property;
    const [loaded, setLoaded] = useState(false);
    const widthMain = feature ? 1400 : 900;
    const baseJpg = `${image}?w=${widthMain}&${baseImgParams}&fm=jpg`;
    const srcSetJpg = `${image}?w=480&${baseImgParams}&fm=jpg 480w, ${image}?w=720&${baseImgParams}&fm=jpg 720w, ${image}?w=900&${baseImgParams}&fm=jpg 900w, ${image}?w=1400&${baseImgParams}&fm=jpg 1400w`;
    const srcSetWebp = `${image}?w=480&${baseImgParams}&fm=webp 480w, ${image}?w=720&${baseImgParams}&fm=webp 720w, ${image}?w=900&${baseImgParams}&fm=webp 900w, ${image}?w=1400&${baseImgParams}&fm=webp 1400w`;
    const srcSetAvif = `${image}?w=480&${baseImgParams}&fm=avif 480w, ${image}?w=720&${baseImgParams}&fm=avif 720w, ${image}?w=900&${baseImgParams}&fm=avif 900w, ${image}?w=1400&${baseImgParams}&fm=avif 1400w`;
    const lowBlur = `${image}?w=80&blur=80&auto=format&q=20`;
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
            {!loaded && <div className="card-skeleton"><div className="skel-shimmer" /></div>}
            <motion.figure className="card-media" variants={variants.propertyCardMedia} style={{ margin: 0 }}>
                <picture>
                    <source type="image/avif" srcSet={srcSetAvif} sizes={feature ? '(min-width: 1100px) 560px, (min-width:640px) 50vw, 100vw' : '(min-width:900px) 320px, (min-width:640px) 33vw, 100vw'} />
                    <source type="image/webp" srcSet={srcSetWebp} sizes={feature ? '(min-width: 1100px) 560px, (min-width:640px) 50vw, 100vw' : '(min-width:900px) 320px, (min-width:640px) 33vw, 100vw'} />
                    <img
                        src={baseJpg}
                        srcSet={srcSetJpg}
                        sizes={feature ? '(min-width: 1100px) 560px, (min-width:640px) 50vw, 100vw' : '(min-width:900px) 320px, (min-width:640px) 33vw, 100vw'}
                        alt={title}
                        loading="lazy"
                        decoding="async"
                        onLoad={() => setLoaded(true)}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: loaded ? 1 : 0.15, transition: 'opacity 600ms ease', filter: loaded ? 'none' : 'blur(14px) saturate(120%)' }}
                    />
                </picture>
                {/* Ultra low-res blurred background layer */}
                {!loaded && <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: `url(${lowBlur})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(20px) saturate(140%)', transition: 'opacity 400ms ease', opacity: 0.9 }} />}
            </motion.figure>
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
});
PropertyCard.displayName = 'PropertyCard';


export default Properties;
