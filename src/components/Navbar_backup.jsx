import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { variants, easings, smoothScrollTo } from '../hooks/useAdvancedAnimations';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [active, setActive] = useState('home');
    const { scrollY } = useScroll();

    // Dynamic navbar background opacity based on scroll
    const navbarOpacity = useTransform(scrollY, [0, 100], [0, 0.98]);
    const navbarBlur = useTransform(scrollY, [0, 100], [0, 25]);
    const navbarShadow = useTransform(scrollY, [0, 100], [0, 0.8]);

    // Mobile performance optimization
    const isMobile = window.innerWidth <= 768;

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const [open, setOpen] = useState(false);
    const btnRef = useRef(null);
    const drawerRef = useRef(null);

    // Lock body scroll when drawer open
    useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; }, [open]);

    // Close drawer when resizing above breakpoint
    useEffect(() => {
        const onResize = () => { if (window.innerWidth > 820 && open) setOpen(false); };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [open]);

    // Close on ESC & outside click
    useEffect(() => {
        if (!open) return;
        const onKey = e => { if (e.key === 'Escape') setOpen(false); };
        const onPointer = e => {
            if (drawerRef.current && btnRef.current && !drawerRef.current.contains(e.target) && !btnRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        window.addEventListener('keydown', onKey);
        window.addEventListener('mousedown', onPointer);
        window.addEventListener('touchstart', onPointer);
        return () => {
            window.removeEventListener('keydown', onKey);
            window.removeEventListener('mousedown', onPointer);
            window.removeEventListener('touchstart', onPointer);
        };
    }, [open]);

    // Enhanced scrollspy
    useEffect(() => {
        const sectionIds = ['home', 'portfolio', 'about', 'experience', 'contact'];
        const sections = sectionIds
            .map(id => document.getElementById(id))
            .filter(Boolean);
        if (!sections.length) return;
        const io = new IntersectionObserver((entries) => {
            const visible = entries.filter(e => e.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
            if (visible.length) {
                setActive(visible[0].target.id);
            }
        }, { threshold: [0.25, 0.4, 0.6] });
        sections.forEach(sec => io.observe(sec));
        return () => io.disconnect();
    }, []);

    const handleNavClick = (e, target) => {
        e.preventDefault();
        smoothScrollTo(target);
        if (open) setOpen(false);
    };

    const navbarVariants = {
        initial: { y: -100, opacity: 0 },
        animate: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 1.0,
                ease: easings.luxury,
                delay: 2.5
            }
        }
    };

    const linkVariants = {
        initial: { opacity: 0.7 },
        hover: {
            opacity: 1,
            scale: 1.05,
            transition: { duration: 0.2 }
        },
        active: {
            opacity: 1,
            color: "var(--color-neutral-100)"
        }
    };

    const mobileMenuVariants = {
        initial: {
            opacity: 0,
            scale: 0.9,
            y: -20
        },
        animate: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 25,
                staggerChildren: 0.05,
                delayChildren: 0.1
            }
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            y: -10,
            transition: { duration: 0.2 }
        }
    };

    const mobileItemVariants = {
        initial: { x: -20, opacity: 0 },
        animate: {
            x: 0,
            opacity: 1,
            transition: { duration: 0.3, ease: easings.elegant }
        }
    };

    return (
        <motion.nav
            className={`navbar ${scrolled ? 'scrolled' : ''}`}
            variants={navbarVariants}
            initial="initial"
            animate="animate"
            style={{
                backgroundColor: scrolled ? `rgba(8, 8, 12, ${navbarOpacity.get()})` : 'transparent',
                backdropFilter: scrolled ? `blur(${navbarBlur.get()}px) saturate(180%)` : 'blur(0px)',
                boxShadow: scrolled ? `0 8px 32px rgba(0, 0, 0, ${navbarShadow.get()})` : 'none',
                borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.08)' : 'none'
            }}
        >
            <div className="container nav-inner">
                <motion.div
                    className="brand"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                        opacity: 1,
                        x: 0,
                        transition: { delay: 2.7, duration: 0.6 }
                    }}
                    whileHover={{
                        scale: 1.05,
                        transition: { duration: 0.2 }
                    }}
                >
                    Rafique <span>Merchant</span>
                </motion.div>

                <ul className="nav-links nav-desktop">
                    {[
                        { href: '#home', label: 'Home' },
                        { href: '#portfolio', label: 'Portfolio' },
                        { href: '#about', label: 'About' },
                        { href: '#contact', label: 'Contact' }
                    ].map((link, index) => (
                        <li key={link.href}>
                            <motion.a
                                className={active === link.href.substring(1) ? 'active' : ''}
                                href={link.href}
                                onClick={(e) => handleNavClick(e, link.href)}
                                variants={linkVariants}
                                initial="initial"
                                animate={active === link.href.substring(1) ? "active" : "initial"}
                                whileHover="hover"
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    opacity: active === link.href.substring(1) ? 1 : 0.7,
                                    animationDelay: `${2.8 + index * 0.1}s`
                                }}
                            >
                                {link.label}
                                {active === link.href.substring(1) && (
                                    <motion.div
                                        className="nav-indicator"
                                        layoutId="nav-indicator"
                                        style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            height: '2px',
                                            background: 'linear-gradient(90deg, var(--color-gold), var(--color-gold-soft))',
                                            borderRadius: '2px'
                                        }}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                            </motion.a>
                        </li>
                    ))}
                </ul>

                <div className="nav-actions nav-desktop">
                    <motion.button
                        className="cta"
                        style={{ fontSize: '.75rem', padding: '.7rem 1.25rem' }}
                        variants={variants.buttonMorph}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                        animate={{
                            opacity: [0, 1],
                            transition: { delay: 3.2, duration: 0.6 }
                        }}
                    >
                        Advisory
                    </motion.button>
                </div>

                <motion.button
                    ref={btnRef}
                    aria-label="Menu"
                    aria-expanded={open}
                    aria-controls="mobile-drawer"
                    onClick={() => setOpen(o => !o)}
                    className={`menu-btn ${open ? 'active' : ''}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    animate={{
                        rotate: open ? 90 : 0,
                        transition: { duration: 0.3 }
                    }}
                >
                    <span className="bar" />
                    <span className="bar" />
                    <span className="bar" />
                </motion.button>
            </div>

            {/* Enhanced mobile overlay */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        className="mobile-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    />
                )}
            </AnimatePresence>

            {/* Enhanced mobile drawer */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        ref={drawerRef}
                        id="mobile-drawer"
                        className="mobile-drawer glass-strong"
                        variants={mobileMenuVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <ul className="mobile-nav-list">
                            {[
                                { href: '#home', label: 'Home' },
                                { href: '#portfolio', label: 'Portfolio' },
                                { href: '#about', label: 'About' },
                                { href: '#contact', label: 'Contact' }
                            ].map((link, index) => (
                                <motion.li
                                    key={link.href}
                                    variants={mobileItemVariants}
                                >
                                    <motion.a
                                        className={active === link.href.substring(1) ? 'active' : ''}
                                        onClick={(e) => handleNavClick(e, link.href)}
                                        href={link.href}
                                        whileHover={{ x: 5, scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {link.label}
                                    </motion.a>
                                </motion.li>
                            ))}
                        </ul>
                        <motion.button
                            className="cta mobile-cta"
                            onClick={() => setOpen(false)}
                            variants={mobileItemVariants}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Request Advisory
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
