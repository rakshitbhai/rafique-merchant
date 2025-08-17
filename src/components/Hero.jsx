import React, { useEffect, useRef, useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import portraitImg from '../assets/rafique-merchant.png';
import { variants, smoothScrollTo } from '../hooks/useAdvancedAnimations';
// Lazy load heavy Spline runtime only when needed (reduces initial JS on low-end devices)
const LazySpline = lazy(() => import(/* webpackChunkName: 'spline-hero' */ '@splinetool/react-spline'));

const Hero = () => {
    const splineRef = useRef(null);
    const [mountSpline, setMountSpline] = useState(false);
    const [splineLoaded, setSplineLoaded] = useState(false);
    const [splineFailed, setSplineFailed] = useState(false);
    // Whether we are permitted to load Spline (reduced motion gate / user override)
    const [allowSpline, setAllowSpline] = useState(true);
    const [userEnabledSpline, setUserEnabledSpline] = useState(false);
    const prefersReducedMotion = useReducedMotion();
    // Signature colloquial words and extended creative phrases
    const signatureItems = [
        'Jordarr Excellence',
        'Jabardast Listings',
        'Alflaatoon Vision'
    ];
    const [sigIndex, setSigIndex] = useState(0);
    const heroVisibleRef = useRef(true);
    // Rotate signature items only while hero section is in/near viewport
    useEffect(() => {
        const heroEl = document.getElementById('home');
        if (!heroEl) return;
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => { heroVisibleRef.current = e.isIntersecting; });
        }, { rootMargin: '0px 0px -40% 0px', threshold: 0.15 });
        io.observe(heroEl);
        let frame; let lastTs = 0; let acc = 0;
        const cycleEvery = 2600;
        const loop = (ts) => {
            frame = requestAnimationFrame(loop);
            if (!heroVisibleRef.current) { lastTs = ts; return; }
            if (!lastTs) lastTs = ts;
            const delta = ts - lastTs; lastTs = ts; acc += delta;
            if (acc >= cycleEvery) {
                setSigIndex(i => (i + 1) % signatureItems.length);
                acc = 0;
            }
        };
        frame = requestAnimationFrame(loop);
        return () => { io.disconnect(); if (frame) cancelAnimationFrame(frame); };
    }, [signatureItems.length]);

    // Determine allowance (respect prefers-reduced-motion only). Mobile now allowed; we optimize height via CSS.
    useEffect(() => {
        if (prefersReducedMotion && !userEnabledSpline) {
            setAllowSpline(false);
        } else {
            setAllowSpline(true);
        }
    }, [prefersReducedMotion, userEnabledSpline]);

    // Lazy mount Spline when hero in view (saves initial payload)
    useEffect(() => {
        const el = splineRef.current;
        if (!el) return;
        if (!allowSpline) return; // do not observe if not allowed
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) { setMountSpline(true); io.disconnect(); } });
        }, { threshold: 0.15 });
        io.observe(el);
        return () => io.disconnect();
    }, [allowSpline]);

    // Safety timeout: if Spline never calls onLoad within 12s, mark failed
    useEffect(() => {
        if (!allowSpline || splineLoaded || splineFailed || !mountSpline) return;
        const t = setTimeout(() => { if (!splineLoaded) setSplineFailed(true); }, 12000);
        return () => clearTimeout(t);
    }, [allowSpline, splineLoaded, splineFailed, mountSpline]);

    return (
        <section id="home" className="hero section-pad">
            <div className="hero-bg" />
            <div className="hero-overlay-noise" />
            {/* Static accents now rely solely on CSS keyframe animation (no JS driven per-frame updates) */}
            <div className="hero-accent accent-a" aria-hidden="true" />
            <div className="hero-accent accent-b" aria-hidden="true" />
            <div className="container hero-layout">
                <motion.div
                    className="hero-content"
                    initial="initial"
                    animate="animate"
                    variants={variants.staggerContainer}
                >
                    <motion.span className="hero-kicker" variants={variants.textReveal}>Luxury Real Estate</motion.span>
                    <motion.h1 className="hero-title" variants={variants.revealLuxury}>
                        Curating <strong>Refined Living Spaces</strong>
                    </motion.h1>
                    <motion.p className="hero-sub" variants={variants.revealLuxury}>
                        Rafique Merchant delivers an exclusive portfolio of distinguished properties, blending architectural excellence with timeless elegance across prime urban and coastal locales.
                    </motion.p>
                    <motion.div className="hero-cta-group" variants={variants.staggerContainer}>
                        <motion.button
                            variants={variants.buttonMorph}
                            className="cta"
                            onClick={() => smoothScrollTo('#portfolio', 850)}
                        >Browse Properties</motion.button>
                        <motion.button
                            variants={variants.buttonMorph}
                            className="cta btn-outline"
                            onClick={() => smoothScrollTo('#contact', 900)}
                        >Arrange a Consultation</motion.button>
                    </motion.div>
                    <motion.div className="values" variants={variants.staggerContainer}>
                        {valueBlocks.map(v => (
                            <motion.div key={v.title} className="value glass" variants={variants.staggerChild}>
                                <h3>{v.title}</h3>
                                <p>{v.copy}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
                <div className="hero-right-stack">
                    <motion.div
                        ref={splineRef}
                        className={`hero-spline glass-strong ${splineLoaded ? 'is-loaded' : ''}`}
                        initial={{ opacity: 0, y: 60, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] } }}
                        aria-label={allowSpline ? 'Interactive 3D Interior Visualization' : 'Static decorative hero visual'}
                        aria-busy={allowSpline && !splineLoaded && !splineFailed}
                        data-visual-mode={allowSpline ? '3d' : 'static'}
                    >
                        {allowSpline && !mountSpline && (
                            <div className="spline-inline-loading" aria-hidden="true">
                                <span className="pulse-dot" />
                                <span className="load-text">Preparing…</span>
                            </div>
                        )}
                        {allowSpline && mountSpline && !splineLoaded && !splineFailed && (
                            <div className="spline-inline-loading">
                                <span className="pulse-dot" />
                                <span className="load-text">Loading space…</span>
                            </div>
                        )}
                        {splineFailed && (
                            <div className="spline-inline-fallback">3D unavailable</div>
                        )}
                        {allowSpline && mountSpline && !splineFailed && (
                            <Suspense fallback={<div className="spline-inline-loading"><span className="pulse-dot" /><span className="load-text">Loading 3D…</span></div>}>
                                <LazySpline
                                    scene="https://prod.spline.design/tGjJ6QDIi3y-GRzV/scene.splinecode"
                                    onLoad={() => setSplineLoaded(true)}
                                    onError={() => setSplineFailed(true)}
                                    style={{ opacity: splineLoaded ? 1 : 0, transition: 'opacity 900ms ease 150ms' }}
                                />
                            </Suspense>
                        )}
                        {allowSpline && <div className="spline-gradient-mask" />}
                        {!allowSpline && !splineFailed && (
                            <div className="spline-static-fallback" aria-hidden="true">
                                <div className="fallback-ring" />
                                {prefersReducedMotion && !userEnabledSpline && (
                                    <button type="button" className="enable-3d-btn" onClick={() => setUserEnabledSpline(true)}>Enable 3D</button>
                                )}
                            </div>
                        )}
                    </motion.div>
                    <motion.figure className="founder-card glass" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }} viewport={{ once: true }}>
                        <div className="founder-img-wrap">
                            <img src={portraitImg} alt="Rafique Merchant" loading="lazy" width={172} height={172} />
                        </div>
                        <figcaption className="founder-text">
                            <div className="founder-meta">
                                <h3>Rafique Merchant</h3>
                                <p>Founder & Principal Advisor</p>
                            </div>
                            <div className="signature-inline" aria-label="Signature expressions" role="group">
                                <div className="signature-words-viewport" role="listbox" aria-live="polite">
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={sigIndex}
                                            className="signature-word-pill"
                                            role="option"
                                            aria-selected="true"
                                            initial={{ y: 14, opacity: 0, scale: .94, filter: 'blur(6px)' }}
                                            animate={{ y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: .85, ease: [0.16, 1, 0.3, 1] } }}
                                            exit={{ y: -14, opacity: 0, scale: .96, filter: 'blur(6px)', transition: { duration: .55, ease: [0.4, 0, 0.2, 1] } }}
                                            whileHover={{ scale: 1.04, boxShadow: '0 0 0 1px rgba(212,175,55,0.55),0 10px 26px -10px rgba(212,175,55,0.45)' }}
                                        >{signatureItems[sigIndex]}</motion.span>
                                    </AnimatePresence>
                                </div>
                            </div>
                        </figcaption>
                    </motion.figure>
                </div>
            </div>
        </section>
    );
};

const valueBlocks = [
    { title: 'Discretion', copy: 'Private, confidential representation for high‑net‑worth clients worldwide.' },
    { title: 'Precision Insight', copy: 'Data‑driven valuation and bespoke market intelligence that informs every acquisition.' },
    { title: 'Global Network', copy: 'Access to an off‑market inventory cultivated through decades of trusted relationships.' },
    { title: 'End‑to‑End Service', copy: 'From architectural due diligence to lifestyle integration, we steward every detail.' },
];

export default Hero;
