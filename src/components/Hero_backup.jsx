import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Spline from '@splinetool/react-spline';

const Hero = () => {
    const { scrollY } = useScroll();
    const [splineLoaded, setSplineLoaded] = useState(false);
    const [splineFailed, setSplineFailed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Mobile detection
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Loading sequence
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    // Smooth parallax transforms (reduced on mobile)
    const titleY = useTransform(scrollY, [0, 500], [0, isMobile ? -30 : -60]);
    const contentY = useTransform(scrollY, [0, 400], [0, isMobile ? -20 : -40]);
    const splineY = useTransform(scrollY, [0, 300], [0, isMobile ? -15 : -30]);

    // Smooth animation variants
    const fadeUpVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }
        }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const buttonVariants = {
        initial: { scale: 1 },
        hover: { 
            scale: 1.05,
            transition: { duration: 0.2, ease: "easeOut" }
        },
        tap: { scale: 0.98 }
    };

    return (
        <>
            {/* Advanced Loading Sequence */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{
                            opacity: 0,
                            scale: 1.1,
                            transition: { duration: 0.8, ease: easings.elegant }
                        }}
                        className="loading-overlay"
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'linear-gradient(135deg, #0c0c0f, #141417)',
                            zIndex: 9999,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6, ease: easings.refined }}
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '2rem',
                                color: 'var(--color-gold)',
                                marginBottom: '2rem',
                                letterSpacing: '0.1em'
                            }}
                        >
                            Rafique Merchant
                        </motion.div>

                        <div style={{
                            width: '300px',
                            height: '2px',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '2px',
                            overflow: 'hidden'
                        }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.3, ease: easings.elegant }}
                                style={{
                                    height: '100%',
                                    background: 'linear-gradient(90deg, var(--color-gold), var(--color-gold-soft))',
                                    borderRadius: '2px'
                                }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <section id="home" className="hero section-pad">
                {/* Enhanced parallax background */}
                <motion.div
                    className="hero-bg"
                    style={{ y: backgroundY }}
                />
                <div className="hero-overlay-noise" />

                <div className="container hero-content">
                    <div className="hero-layout">
                        {/* Left side - Text content */}
                        <motion.div
                            className="hero-text-content"
                            variants={heroTextVariants}
                            initial="initial"
                            animate={!isLoading ? "animate" : "initial"}
                        >
                            {/* Main Headline with Enhanced Typography */}
                            <motion.div style={{ y: titleY }}>
                                <motion.h1
                                    className="hero-title-redesign"
                                    variants={wordVariants}
                                >
                                    <span className="title-line-1">Curating</span>
                                    <span className="title-line-2">
                                        <span className="title-accent">Refined</span>
                                        <span className="title-emphasis">Living Spaces</span>
                                    </span>
                                    <motion.div
                                        className="title-underline"
                                        initial={{ width: 0 }}
                                        animate={!isLoading ? { width: "100%" } : { width: 0 }}
                                        transition={{ delay: 2.5, duration: 1.2, ease: easings.luxury }}
                                    />
                                </motion.h1>
                            </motion.div>

                            {/* Sophisticated Description */}
                            <motion.div style={{ y: contentY }}>
                                <motion.div
                                    variants={wordVariants}
                                    className="hero-description-redesign"
                                >
                                    <div className="description-intro">
                                        <span className="highlight-text">Rafique Merchant</span> delivers an exclusive portfolio
                                    </div>
                                    <div className="description-main">
                                        of distinguished properties, blending architectural excellence
                                        with timeless elegance across <span className="location-emphasis">prime urban and coastal locales</span>.
                                    </div>

                                    {/* Key Features */}
                                    <div className="hero-features">
                                        <motion.div
                                            className="feature-item"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={!isLoading ? { opacity: 1, x: 0 } : {}}
                                            transition={{ delay: 3.0, duration: 0.6 }}
                                        >
                                            <div className="feature-icon">◊</div>
                                            <span>Bespoke Advisory</span>
                                        </motion.div>
                                        <motion.div
                                            className="feature-item"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={!isLoading ? { opacity: 1, x: 0 } : {}}
                                            transition={{ delay: 3.2, duration: 0.6 }}
                                        >
                                            <div className="feature-icon">◊</div>
                                            <span>Global Network</span>
                                        </motion.div>
                                        <motion.div
                                            className="feature-item"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={!isLoading ? { opacity: 1, x: 0 } : {}}
                                            transition={{ delay: 3.4, duration: 0.6 }}
                                        >
                                            <div className="feature-icon">◊</div>
                                            <span>Exclusive Access</span>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Redesigned CTA Section */}
                            <motion.div
                                className="hero-cta-redesign"
                                variants={wordVariants}
                            >
                                <div className="cta-primary-section">
                                    <motion.button
                                        className="cta-primary"
                                        variants={variants.buttonMorph}
                                        initial="initial"
                                        whileHover="hover"
                                        whileTap="tap"
                                        onClick={() => {
                                            document.getElementById('portfolio')?.scrollIntoView({
                                                behavior: 'smooth',
                                                block: 'start'
                                            });
                                        }}
                                    >
                                        <span className="cta-icon">→</span>
                                        <span className="cta-text">Explore Portfolio</span>
                                    </motion.button>

                                    <motion.button
                                        className="cta-secondary"
                                        variants={variants.buttonMorph}
                                        initial="initial"
                                        whileHover="hover"
                                        whileTap="tap"
                                        transition={{ delay: 0.1 }}
                                        onClick={() => {
                                            document.getElementById('contact')?.scrollIntoView({
                                                behavior: 'smooth',
                                                block: 'start'
                                            });
                                        }}
                                    >
                                        <span className="cta-text">Private Consultation</span>
                                        <span className="cta-arrow">↗</span>
                                    </motion.button>
                                </div>

                                {/* Trust Indicator */}
                                <motion.div
                                    className="trust-indicator"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={!isLoading ? { opacity: 1, y: 0 } : {}}
                                    transition={{ delay: 3.6, duration: 0.8 }}
                                >
                                    <div className="trust-stats">
                                        <div className="stat">
                                            <span className="stat-number">$2.8B+</span>
                                            <span className="stat-label">Portfolio Value</span>
                                        </div>
                                        <div className="stat-divider"></div>
                                        <div className="stat">
                                            <span className="stat-number">150+</span>
                                            <span className="stat-label">Premium Properties</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </motion.div>

                        {/* Right side - 3D Spline model */}
                        <motion.div
                            className="hero-spline-container"
                            style={{ y: splineY }}
                            initial={{ opacity: 0, scale: 0.8, x: 100 }}
                            animate={!isLoading ? {
                                opacity: 1,
                                scale: 1,
                                x: 0,
                                transition: {
                                    delay: 2.0,
                                    duration: 1.5,
                                    ease: easings.luxury
                                }
                            } : {}}
                        >
                            <div
                                className="spline-hero-wrapper glass-strong"
                                style={{
                                    position: 'relative',
                                    width: '100%',
                                    height: '100%',
                                    overflow: 'hidden'
                                }}
                            >
                                <AnimatePresence>
                                    {!splineLoaded && !splineFailed && (
                                        <motion.div
                                            className="spline-hero-loading"
                                            initial={{ opacity: 1 }}
                                            exit={{ opacity: 0, transition: { duration: 0.8 } }}
                                        >
                                            <motion.div
                                                animate={{
                                                    scale: [1, 1.2, 1],
                                                    opacity: [0.6, 1, 0.6],
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                                className="loading-spinner"
                                            />
                                            <p>Loading 3D Experience...</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <AnimatePresence>
                                    {splineFailed && (
                                        <motion.div
                                            className="spline-hero-fallback"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            <div className="fallback-icon">🏠</div>
                                            <p>3D Preview Unavailable</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: splineLoaded ? 1 : 0 }}
                                    transition={{ duration: 1.0 }}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        position: 'relative'
                                    }}
                                >
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        <Spline
                                            scene="https://prod.spline.design/tGjJ6QDIi3y-GRzV/scene.splinecode"
                                            onLoad={(splineApp) => {
                                                console.log('Hero Spline loaded successfully');
                                                setSplineLoaded(true);

                                                // Force proper sizing after load
                                                setTimeout(() => {
                                                    const canvas = document.querySelector('.spline-hero-wrapper canvas');
                                                    const container = document.querySelector('.spline-hero-wrapper');
                                                    if (canvas && container) {
                                                        canvas.style.width = '100%';
                                                        canvas.style.height = '100%';
                                                        canvas.width = container.offsetWidth;
                                                        canvas.height = container.offsetHeight;

                                                        // Force redraw
                                                        if (splineApp && splineApp.setSize) {
                                                            splineApp.setSize(container.offsetWidth, container.offsetHeight);
                                                        }
                                                    }
                                                }, 100);
                                            }}
                                            onError={(e) => {
                                                console.error('Hero Spline error:', e);
                                                setSplineFailed(true);
                                            }}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                minWidth: '100%',
                                                minHeight: '100%',
                                                maxWidth: '100%',
                                                maxHeight: '100%',
                                                display: 'block',
                                                borderRadius: 'inherit'
                                            }}
                                        />
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Enhanced floating values */}
                    <motion.div
                        className="values"
                        variants={variants.staggerContainer}
                        initial="initial"
                        animate={!isLoading ? "animate" : "initial"}
                    >
                        {[
                            {
                                title: "Discretion",
                                description: "Private, confidential representation for high‑net‑worth clients worldwide."
                            },
                            {
                                title: "Precision Insight",
                                description: "Data‑driven valuation and bespoke market intelligence that informs every acquisition."
                            },
                            {
                                title: "Global Network",
                                description: "Access to an off‑market inventory cultivated through decades of trusted relationships."
                            },
                            {
                                title: "End‑to‑End Service",
                                description: "From architectural due diligence to lifestyle integration, we steward every detail."
                            }
                        ].map((value, index) => (
                            <motion.div
                                key={value.title}
                                className="value glass"
                                variants={variants.staggerChild}
                                animate={floatVariants.animate}
                                custom={index}
                                whileHover={{
                                    scale: 1.05,
                                    rotateY: 5,
                                    transition: { duration: 0.3 }
                                }}
                            >
                                <motion.h3
                                    initial={{ opacity: 0 }}
                                    animate={{
                                        opacity: 1,
                                        transition: { delay: 2 + index * 0.2 }
                                    }}
                                >
                                    {value.title}
                                </motion.h3>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{
                                        opacity: 1,
                                        transition: { delay: 2.2 + index * 0.2 }
                                    }}
                                >
                                    {value.description}
                                </motion.p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default Hero;
