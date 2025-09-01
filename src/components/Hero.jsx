import React, { useEffect, useRef, Suspense, lazy } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import portraitImg from '../assets/rafique-merchant.png';
import { smoothScrollTo } from '../hooks/useAdvancedAnimations';
import OptimizedMotion from './OptimizedMotion';
import { useHero3D, useUserPreferences } from '../store/hooks';
// Lazy load heavy Spline runtime only when needed (reduces initial JS on low-end devices)
const LazySpline = lazy(() => import(/* webpackChunkName: 'spline-hero' */ '@splinetool/react-spline'));

const Hero = () => {
    const dispatch = useDispatch();
    const splineRef = useRef(null);
    const prefersReducedMotion = useReducedMotion();

    const {
        splineLoaded,
        splineFailed,
        allowSpline,
        mountSpline,
        userEnabledSpline,
        signatureIndex,
        canAutoload,
        setSplineLoaded,
        setSplineFailed,
        setAllowSpline,
        setMountSpline,
        setUserEnabledSpline,
    } = useHero3D();

    const { detectDeviceCapabilities } = useUserPreferences();
    // Signature colloquial words and extended creative phrases
    const signatureItems = [
        'Jordarr Excellence',
        'Jabardast Listings',
        'Alflaatoon Vision'
    ];

    const heroVisibleRef = useRef(true);

    // Initialize device capabilities detection
    useEffect(() => {
        detectDeviceCapabilities();
    }, [detectDeviceCapabilities]);
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
                // Update signature index through Redux
                dispatch({ type: 'ui/setSignatureIndex', payload: (signatureIndex + 1) % signatureItems.length });
                acc = 0;
            }
        };
        frame = requestAnimationFrame(loop);
        return () => { io.disconnect(); if (frame) cancelAnimationFrame(frame); };
    }, [signatureItems.length, signatureIndex, dispatch]);

    // Determine allowance based on user preferences and device capabilities
    useEffect(() => {
        // Allow only if (not reduced motion) OR user explicitly enabled, and device capable or user forced
        if ((userEnabledSpline || !prefersReducedMotion) && (canAutoload || userEnabledSpline)) {
            setAllowSpline(true);
        } else {
            setAllowSpline(false);
        }
    }, [prefersReducedMotion, userEnabledSpline, canAutoload, setAllowSpline]);

    // Lazy mount Spline when hero in view (only if capable or user opted in)
    useEffect(() => {
        const el = splineRef.current;
        if (!el) return;
        if (!allowSpline) return; // not allowed yet
        if (!canAutoload && !userEnabledSpline) return; // waiting for user to enable
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) { setMountSpline(true); io.disconnect(); } });
        }, { threshold: 0.2 });
        io.observe(el);
        return () => io.disconnect();
    }, [allowSpline, canAutoload, userEnabledSpline, setMountSpline]);

    // Safety timeout: if Spline never calls onLoad within 12s, mark failed
    useEffect(() => {
        if (!allowSpline || splineLoaded || splineFailed || !mountSpline) return;
        const t = setTimeout(() => { if (!splineLoaded) setSplineFailed(true); }, 12000);
        return () => clearTimeout(t);
    }, [allowSpline, splineLoaded, splineFailed, mountSpline, setSplineFailed]);

    return (
        <section id="home" className="hero section-pad">
            

            <div className="container hero-layout"> 
                <OptimizedMotion
                    className="hero-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, staggerChildren: 0.15, delayChildren: 0.2 }}
                >
                    <OptimizedMotion
                        initial={{ opacity: 0, y: 30, blur: 4 }}
                        animate={{ opacity: 1, y: 0, blur: 0 }}
                        transition={{ type: "spring", stiffness: 160, damping: 25, delay: 0.3 }}
                    >
                        <span className="hero-kicker">Luxury Real Estate</span>
                    </OptimizedMotion>
                    <OptimizedMotion
                        initial={{ opacity: 0, y: 40, scale: 0.98, blur: 6 }}
                        animate={{ opacity: 1, y: 0, scale: 1, blur: 0 }}
                        transition={{ type: "spring", stiffness: 140, damping: 22, delay: 0.4 }}
                    >
                        <h1 className="hero-title">
                            Curating <strong>Refined Living Spaces</strong>
                        </h1>
                    </OptimizedMotion>
                    <OptimizedMotion
                        initial={{ opacity: 0, y: 30, blur: 4 }}
                        animate={{ opacity: 1, y: 0, blur: 0 }}
                        transition={{ type: "spring", stiffness: 150, damping: 23, delay: 0.6 }}
                    >
                        <p className="hero-sub">
                            Rafique Merchant delivers an exclusive portfolio of distinguished properties, blending architectural excellence with timeless elegance across prime urban and coastal locales.
                        </p>
                    </OptimizedMotion>
                    <OptimizedMotion
                        className="hero-cta-group"
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 160, damping: 25, delay: 0.8 }}
                    >
                        <motion.button
                            className="cta"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{
                                scale: 1.035,
                                boxShadow: "0 14px 34px -10px rgba(212, 175, 55, 0.35)",
                                transition: { type: 'spring', stiffness: 220, damping: 26 }
                            }}
                            whileTap={{ scale: 0.96 }}
                            transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.9 }}
                            onClick={() => smoothScrollTo('#portfolio', 850)}
                        >Browse Properties</motion.button>
                        <motion.button
                            className="cta btn-outline"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{
                                scale: 1.035,
                                boxShadow: "0 14px 34px -10px rgba(212, 175, 55, 0.25)",
                                transition: { type: 'spring', stiffness: 220, damping: 26 }
                            }}
                            whileTap={{ scale: 0.96 }}
                            transition={{ type: "spring", stiffness: 200, damping: 25, delay: 1.0 }}
                            onClick={() => smoothScrollTo('#contact', 900)}
                        >Arrange a Consultation</motion.button>
                    </OptimizedMotion>
                    <OptimizedMotion
                        className="values"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, staggerChildren: 0.12, delayChildren: 0.1 }}
                    >
                        {valueBlocks.map((v, index) => (
                            <OptimizedMotion
                                key={v.title}
                                className="value glass"
                                initial={{ opacity: 0, y: 35, scale: 0.95, blur: 8 }}
                                animate={{ opacity: 1, y: 0, scale: 1, blur: 0 }}
                                whileHover={{
                                    scale: 1.02,
                                    y: -2,
                                    transition: { type: 'spring', stiffness: 300, damping: 30 }
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 160,
                                    damping: 22,
                                    delay: 1.3 + (index * 0.15)
                                }}
                            >
                                <h3>{v.title}</h3>
                                <p>{v.copy}</p>
                            </OptimizedMotion>
                        ))}
                    </OptimizedMotion>
                </OptimizedMotion>
              

                <div className="hero-right-stack">
                    <OptimizedMotion
                        ref={splineRef}
                        className={`hero-spline glass-strong ${splineLoaded ? 'is-loaded' : ''}`}
                        initial={{ opacity: 0, y: 60, scale: 0.9, blur: 12 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            blur: 0,
                            transition: {
                                duration: 1.2,
                                ease: [0.25, 0.1, 0.25, 1],
                                type: "spring",
                                stiffness: 120,
                                damping: 25
                            }
                        }}
                        aria-label={allowSpline ? 'Interactive 3D Interior Visualization' : 'Static decorative hero visual'}
                        aria-busy={allowSpline && !splineLoaded && !splineFailed}
                        data-visual-mode={allowSpline ? '3d' : 'static'}
                    >
                        {allowSpline && canAutoload && !mountSpline && (
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
                                {(!canAutoload || prefersReducedMotion) && !userEnabledSpline && (
                                    <button type="button" className="enable-3d-btn" onClick={() => setUserEnabledSpline(true)}>Activate 3D Experience</button>
                                )}
                            </div>
                        )}
                    </OptimizedMotion>

                    
                    <OptimizedMotion
                        className="founder-card glass"
                        initial={{ opacity: 0, y: 50, scale: 0.95, blur: 8 }}
                        whileInView={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            blur: 0,
                            transition: {
                                duration: 0.9,
                                ease: [0.16, 1, 0.3, 1],
                                type: "spring",
                                stiffness: 140,
                                damping: 22
                            }
                        }}
                        viewport={{ once: true }}
                        whileHover={{
                            scale: 1.02,
                            y: -5,
                            transition: { type: 'spring', stiffness: 300, damping: 30 }
                        }}
                    >
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
                                            key={signatureIndex}
                                            className="signature-word-pill"
                                            role="option"
                                            aria-selected="true"
                                            initial={{ y: 20, opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
                                            animate={{
                                                y: 0,
                                                opacity: 1,
                                                scale: 1,
                                                filter: 'blur(0px)',
                                                transition: {
                                                    duration: 0.85,
                                                    ease: [0.16, 1, 0.3, 1],
                                                    type: "spring",
                                                    stiffness: 160,
                                                    damping: 20
                                                }
                                            }}
                                            exit={{
                                                y: -20,
                                                opacity: 0,
                                                scale: 0.95,
                                                filter: 'blur(6px)',
                                                transition: {
                                                    duration: 0.55,
                                                    ease: [0.4, 0, 0.2, 1]
                                                }
                                            }}
                                            whileHover={{
                                                scale: 1.04,
                                                boxShadow: '0 0 0 1px rgba(212,175,55,0.55), 0 10px 26px -10px rgba(212,175,55,0.45)',
                                                transition: { type: 'spring', stiffness: 300, damping: 30 }
                                            }}
                                            style={{
                                                willChange: "transform, opacity, filter",
                                                backfaceVisibility: "hidden"
                                            }}
                                        >{signatureItems[signatureIndex]}</motion.span>
                                    </AnimatePresence>
                                </div>
                            </div>
                        </figcaption>
                    </OptimizedMotion>
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
