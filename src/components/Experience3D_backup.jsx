import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Spline from '@splinetool/react-spline';
import { variants, easings, useScrollAnimation } from '../hooks/useAdvancedAnimations';

const Experience3D = () => {
    const [loaded, setLoaded] = useState(false);
    const [failed, setFailed] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);
    const wrapperRef = useRef(null);
    const [shouldMount, setShouldMount] = useState(false);
    const { ref, controls, isInView } = useScrollAnimation(0.15);

    useEffect(() => {
        const el = wrapperRef.current;
        if (!el) return;
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    setShouldMount(true);
                    // Simulate loading progress
                    const interval = setInterval(() => {
                        setLoadProgress(prev => {
                            if (prev >= 90) {
                                clearInterval(interval);
                                return 90;
                            }
                            return prev + Math.random() * 10;
                        });
                    }, 200);
                    io.disconnect();
                }
            });
        }, { threshold: 0.15 });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    const containerVariants = {
        initial: {},
        animate: {
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    };

    const splineVariants = {
        initial: {
            opacity: 0,
            scale: 1,
            rotateY: 0
        },
        animate: {
            opacity: 1,
            scale: 1,
            rotateY: 0,
            transition: {
                duration: 1.2,
                ease: easings.luxury
            }
        }
    };

    const loadingVariants = {
        initial: { opacity: 1 },
        exit: {
            opacity: 0,
            scale: 0.9,
            transition: { duration: 0.8, ease: easings.elegant }
        }
    };

    const progressVariants = {
        initial: { width: 0 },
        animate: {
            width: `${loadProgress}%`,
            transition: { duration: 0.5, ease: easings.refined }
        }
    };

    const pulseVariants = {
        animate: {
            scale: [1, 1.2, 1],
            opacity: [0.6, 1, 0.6],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <section id="experience" className="section-pad experience-3d-section" aria-label="3D Spatial Showcase">
            <div className="container">
                <motion.div
                    ref={ref}
                    initial="initial"
                    animate={controls}
                    variants={containerVariants}
                >
                    <motion.h2
                        className="section-heading"
                        variants={variants.revealLuxury}
                    >
                        Immersive Perspective
                    </motion.h2>
                    <motion.p
                        className="subheading"
                        style={{ marginBottom: 'clamp(1.5rem, 4vw, 2.2rem)' }}
                        variants={{
                            initial: { opacity: 0, y: 30 },
                            animate: {
                                opacity: 1,
                                y: 0,
                                transition: { duration: 0.8, ease: easings.refined }
                            }
                        }}
                    >
                        Explore a refined interior spatial study – rotate, pan and inspect architectural composition directly in your browser.
                    </motion.p>

                    <motion.div
                        ref={wrapperRef}
                        className={`spline-wrapper glass-strong ${loaded ? 'is-loaded' : ''}`}
                        aria-busy={!loaded && !failed}
                        aria-live="polite"
                        variants={splineVariants}
                    >
                        <AnimatePresence>
                            {!loaded && !failed && shouldMount && (
                                <motion.div
                                    className="spline-loading"
                                    role="status"
                                    variants={loadingVariants}
                                    initial="initial"
                                    exit="exit"
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '1.5rem',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'linear-gradient(145deg, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.45))',
                                        backdropFilter: 'blur(18px) saturate(140%)',
                                        WebkitBackdropFilter: 'blur(18px) saturate(140%)',
                                        borderRadius: '32px'
                                    }}
                                >
                                    <motion.div
                                        variants={pulseVariants}
                                        animate="animate"
                                        style={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            background: 'var(--color-gold)',
                                            position: 'relative',
                                            boxShadow: '0 0 0 0 rgba(212, 175, 55, 0.55)'
                                        }}
                                    />

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3, duration: 0.6 }}
                                        style={{
                                            fontSize: '.8rem',
                                            letterSpacing: '.2em',
                                            textTransform: 'uppercase',
                                            color: 'var(--color-neutral-300)',
                                            textAlign: 'center'
                                        }}
                                    >
                                        Loading 3D Experience
                                    </motion.div>

                                    {/* Enhanced progress bar */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        style={{
                                            width: '200px',
                                            height: '3px',
                                            background: 'rgba(255,255,255,0.1)',
                                            borderRadius: '3px',
                                            overflow: 'hidden',
                                            position: 'relative'
                                        }}
                                    >
                                        <motion.div
                                            variants={progressVariants}
                                            initial="initial"
                                            animate="animate"
                                            style={{
                                                height: '100%',
                                                background: 'linear-gradient(90deg, var(--color-gold), var(--color-gold-soft))',
                                                borderRadius: '3px',
                                                boxShadow: '0 0 8px rgba(212, 175, 55, 0.5)'
                                            }}
                                        />

                                        {/* Shimmer effect */}
                                        <motion.div
                                            animate={{
                                                x: [-100, 200],
                                                transition: {
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: "linear"
                                                }
                                            }}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                                                width: '100px'
                                            }}
                                        />
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.7, duration: 0.4 }}
                                        style={{
                                            fontSize: '.65rem',
                                            color: 'var(--color-neutral-500)',
                                            letterSpacing: '.1em'
                                        }}
                                    >
                                        {Math.round(loadProgress)}%
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {failed && (
                                <motion.div
                                    className="spline-fallback"
                                    role="alert"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                        transition: { duration: 0.5 }
                                    }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        display: 'grid',
                                        placeItems: 'center',
                                        textAlign: 'center',
                                        padding: '2rem',
                                        background: 'linear-gradient(145deg, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.45))',
                                        backdropFilter: 'blur(16px) saturate(140%)',
                                        WebkitBackdropFilter: 'blur(16px) saturate(140%)',
                                        borderRadius: '32px'
                                    }}
                                >
                                    <div>
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 200,
                                                damping: 15
                                            }}
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                background: '#ef4444',
                                                margin: '0 auto 1rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '1.2rem'
                                            }}
                                        >
                                            ⚠
                                        </motion.div>
                                        <p style={{ margin: '0 0 0.5rem', fontSize: '.9rem' }}>
                                            3D scene unavailable right now.
                                        </p>
                                        <small style={{
                                            letterSpacing: '.15em',
                                            opacity: .7,
                                            fontSize: '.7rem'
                                        }}>
                                            Please retry later.
                                        </small>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {shouldMount && !failed && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: loaded ? 1 : 0 }}
                                transition={{ duration: 0.8, ease: easings.luxury }}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '32px',
                                    overflow: 'hidden'
                                }}
                            >
                                <Spline
                                    scene="https://prod.spline.design/tGjJ6QDIi3y-GRzV/scene.splinecode"
                                    onLoad={() => {
                                        console.log('Spline loaded successfully');
                                        setLoadProgress(100);
                                        setTimeout(() => setLoaded(true), 300);
                                    }}
                                    onError={(e) => {
                                        console.error('Spline load error:', e);
                                        setFailed(true);
                                    }}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                    }}
                                />
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Experience3D;
