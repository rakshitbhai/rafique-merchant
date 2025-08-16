import { useEffect, useRef, useState } from 'react';
import { useAnimation, useInView } from 'framer-motion';

// Lightweight runtime performance heuristic (runs once on module load)
// Falls back gracefully if unavailable environment APIs
const perfHeuristic = (() => {
    if (typeof window === 'undefined') return false;
    try {
        const lowHW = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
        const lowMem = (navigator.deviceMemory && navigator.deviceMemory <= 4);
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const conn = navigator.connection || navigator.webkitConnection || navigator.mozConnection;
        const slowNet = conn && ['slow-2g', '2g'].includes(conn.effectiveType);
        return lowHW || lowMem || reduced || slowNet;
    } catch (e) { return false; }
})();

// Advanced easing curves for luxury feel
export const easings = {
    luxury: [0.25, 0.1, 0.25, 1.0],
    elegant: [0.4, 0.0, 0.2, 1.0],
    sophisticated: [0.2, 0.8, 0.2, 1.0],
    refined: [0.16, 1, 0.3, 1],
    premium: [0.645, 0.045, 0.355, 1],
    silk: [0.33, 0.11, 0.15, 1],
};

// Animation variants for consistent orchestration
// NOTE: We intentionally avoid animating expensive CSS properties (filter / large box-shadows)
// when in performance mode. This reduces paint & composite cost on low-end devices + mobile.
export const variants = {
    // Page load sequence
    pageLoad: {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: {
                duration: perfHeuristic ? 0.45 : 0.7,
                ease: easings.elegant,
                staggerChildren: perfHeuristic ? 0.05 : 0.09
            }
        }
    },

    // Sophisticated reveal with scale
    revealLuxury: {
        initial: {
            opacity: 0,
            y: perfHeuristic ? 28 : 44,
            scale: perfHeuristic ? 1 : 0.97,
            // omit filter in performance mode
            ...(perfHeuristic ? {} : { filter: 'blur(4px)' })
        },
        animate: {
            opacity: 1,
            y: 0,
            scale: 1,
            ...(perfHeuristic ? {} : { filter: 'blur(0px)' }),
            transition: {
                duration: perfHeuristic ? 0.55 : 0.95,
                ease: perfHeuristic ? easings.elegant : easings.silk,
            }
        }
    },

    // Card hover with magnetic effect
    cardMagnetic: {
        initial: { scale: 1, y: 0 },
        hover: perfHeuristic ? { scale: 1.015, y: -4 } : {
            scale: 1.02,
            y: -8,
            transition: { type: 'spring', stiffness: 400, damping: 25 }
        },
        tap: { scale: 0.985, transition: { duration: 0.1 } }
    },

    // Staggered children animation
    staggerContainer: {
        initial: {},
        animate: {
            transition: {
                staggerChildren: 0.11,
                delayChildren: 0.18
            }
        }
    },

    staggerChild: {
        initial: { opacity: 0, y: perfHeuristic ? 18 : 32, scale: 0.96, ...(perfHeuristic ? {} : { filter: 'blur(6px)' }) },
        animate: {
            opacity: 1,
            y: 0,
            scale: 1,
            ...(perfHeuristic ? {} : { filter: 'blur(0px)' }),
            transition: { duration: perfHeuristic ? 0.45 : 0.7, ease: perfHeuristic ? easings.elegant : easings.silk }
        }
    },

    // Morphing button
    buttonMorph: {
        initial: { scale: 1, borderRadius: 50 },
        hover: {
            scale: 1.035,
            borderRadius: 58,
            boxShadow: "0 14px 34px -10px rgba(212, 175, 55, 0.35)",
            transition: {
                type: 'spring',
                stiffness: 220,
                damping: 26,
                mass: 0.9
            }
        },
        tap: {
            scale: 0.96,
            transition: { duration: 0.08 }
        }
    },

    // Text reveal with mask
    textReveal: perfHeuristic ? {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easings.elegant } }
    } : {
        initial: { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
        animate: { clipPath: 'inset(0 0% 0 0)', opacity: 1, transition: { duration: 1.2, ease: easings.sophisticated } }
    },

    // Parallax floating
    float: {
        animate: {
            y: [0, -10, 0],
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    },

    // Card entrance variant (snappy yet smooth)
    cardIn: {
        initial: { opacity: 0, y: 50, scale: 0.95 },
        animate: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
        }
    },

    // Unified property card (entrance + hover refinement)
    propertyCard: {
        initial: { opacity: 0, y: perfHeuristic ? 28 : 42, scale: perfHeuristic ? 1 : 0.95, ...(perfHeuristic ? {} : { filter: 'blur(6px)' }) },
        animate: {
            opacity: 1,
            y: 0,
            scale: 1,
            ...(perfHeuristic ? {} : { filter: 'blur(0px)' }),
            transition: { duration: perfHeuristic ? 0.55 : 0.8, ease: perfHeuristic ? easings.elegant : easings.silk }
        },
        hover: perfHeuristic ? { scale: 1.01, y: -3 } : {
            scale: 1.012,
            y: -4,
            transition: { type: 'spring', stiffness: 210, damping: 28, mass: 0.9 }
        },
        tap: { scale: 0.988, y: -1, transition: { duration: 0.1 } }
    },

    // Card media subtle cinematic scale
    propertyCardMedia: perfHeuristic ? {
        initial: { scale: 1 },
        hover: { scale: 1.02, transition: { duration: 0.8, ease: easings.luxury } }
    } : {
        initial: { scale: 1, filter: 'saturate(104%) contrast(104%)' },
        hover: { scale: 1.035, filter: 'saturate(112%) contrast(110%)', transition: { duration: 1.2, ease: easings.luxury } }
    },

    // New subtle professional variants
    fadeInUp: perfHeuristic ? {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easings.elegant } }
    } : {
        initial: { opacity: 0, y: 28, filter: 'blur(4px)' },
        animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: easings.silk } }
    },
    fadeInBlur: perfHeuristic ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easings.elegant } }
    } : {
        initial: { opacity: 0, y: 24, filter: 'blur(10px)' },
        animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.85, ease: easings.silk } }
    },
    sectionReveal: perfHeuristic ? {
        initial: { opacity: 0, y: 36 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easings.elegant } }
    } : {
        initial: { opacity: 0, y: 56, scale: 0.985, filter: 'blur(6px)' },
        animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 1.0, ease: easings.silk } }
    },
    cascadeParent: {
        initial: {},
        animate: { transition: { staggerChildren: 0.08, delayChildren: 0.25 } }
    },
    cascadeItem: perfHeuristic ? {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easings.elegant } }
    } : {
        initial: { opacity: 0, y: 20, filter: 'blur(6px)' },
        animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: easings.silk } }
    }
};

// Advanced scroll-triggered animations hook
export const useScrollAnimation = (threshold = 0.3, once = true) => {
    const ref = useRef(null);
    const isInView = useInView(ref, {
        threshold,
        once,
        margin: "-100px 0px -100px 0px"
    });
    const controls = useAnimation();

    useEffect(() => {
        if (isInView) {
            controls.start("animate");
        } else if (!once) {
            controls.start("initial");
        }
    }, [isInView, controls, once]);

    return { ref, controls, isInView };
};

// Magnetic cursor effect for cards
export const useMagneticEffect = () => {
    const ref = useRef(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const handleMouseMove = (e) => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = (e.clientX - centerX) * 0.15;
            const deltaY = (e.clientY - centerY) * 0.15;

            element.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.02)`;
        };

        const handleMouseLeave = () => {
            element.style.transform = 'translate(0px, 0px) scale(1)';
        };

        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            element.removeEventListener('mousemove', handleMouseMove);
            element.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return ref;
};

// Advanced loading sequence
export const useLoadingSequence = (duration = 2000) => {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setIsLoading(false), 300);
                    return 100;
                }
                return prev + Math.random() * 15;
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return { isLoading, progress };
};

// Smooth scroll with easing
export const smoothScrollTo = (target, duration = 1500) => {
    const targetElement = document.querySelector(target);
    if (!targetElement) return;
    const startY = window.pageYOffset;
    const targetRectTop = targetElement.getBoundingClientRect().top; // single layout read
    const destinationY = startY + targetRectTop - 70; // account for navbar height
    const distance = destinationY - startY;
    if (Math.abs(distance) < 4) return; // trivial distance
    let startTime = null;
    let rafId;
    const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const step = (ts) => {
        if (!startTime) startTime = ts;
        const elapsed = ts - startTime;
        const p = Math.min(1, elapsed / duration);
        const eased = easeInOutCubic(p);
        window.scrollTo(0, startY + distance * eased);
        if (p < 1) rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
};

const animationUtils = {
    variants,
    easings,
    useScrollAnimation,
    useMagneticEffect,
    useLoadingSequence,
    smoothScrollTo
};

export default animationUtils;
