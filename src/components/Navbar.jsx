import React, { useEffect, useRef } from 'react';
import { useNavbar, useResponsive } from '../store/hooks';

const Navbar = () => {
    const { navbar, setScrolled, setActiveSection, toggleMobileMenu, closeMobileMenu } = useNavbar();
    const { updateViewport } = useResponsive();

    const btnRef = useRef(null);
    const drawerRef = useRef(null);

    useEffect(() => {
        let ticking = false;
        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                setScrolled(window.scrollY > 10);
                ticking = false;
            });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [setScrolled]);

    // Lock body scroll when drawer open
    useEffect(() => {
        document.body.style.overflow = navbar.mobileMenuOpen ? 'hidden' : '';
    }, [navbar.mobileMenuOpen]);

    // Close drawer when resizing above breakpoint
    useEffect(() => {
        const onResize = () => {
            updateViewport();
            if (window.innerWidth > 820 && navbar.mobileMenuOpen) {
                closeMobileMenu();
            }
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [navbar.mobileMenuOpen, closeMobileMenu, updateViewport]);

    // Close on ESC & outside click
    useEffect(() => {
        if (!navbar.mobileMenuOpen) return;
        const onKey = e => { if (e.key === 'Escape') closeMobileMenu(); };
        const onPointer = e => {
            if (drawerRef.current && btnRef.current && !drawerRef.current.contains(e.target) && !btnRef.current.contains(e.target)) {
                closeMobileMenu();
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
    }, [navbar.mobileMenuOpen, closeMobileMenu]);
    // Scrollspy (IntersectionObserver)
    useEffect(() => {
        const sectionIds = ['home', 'portfolio', 'about', 'experience', 'contact'];
        const sections = sectionIds
            .map(id => document.getElementById(id))
            .filter(Boolean);
        if (!sections.length) return;
        const io = new IntersectionObserver((entries) => {
            // Pick the entry with highest intersection ratio currently intersecting
            const visible = entries.filter(e => e.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
            if (visible.length) {
                setActiveSection(visible[0].target.id);
            }
        }, { threshold: [0.25, 0.4, 0.6] });
        sections.forEach(sec => io.observe(sec));
        return () => io.disconnect();
    }, [setActiveSection]);

    return (
        <nav className={`navbar ${navbar.scrolled ? 'scrolled' : ''}`}>
            <div className="container nav-inner">
                <a href="#home" className="brand" onClick={closeMobileMenu}>
                    Rafique <span>Merchant</span>
                </a>
                <ul className="nav-links nav-desktop">
                    <li><a className={navbar.activeSection === 'home' ? 'active' : ''} href="#home">Home</a></li>
                    <li><a className={navbar.activeSection === 'portfolio' ? 'active' : ''} href="#portfolio">Portfolio</a></li>
                    <li><a className={navbar.activeSection === 'about' ? 'active' : ''} href="#about">About</a></li>
                    <li><a className={navbar.activeSection === 'contact' ? 'active' : ''} href="#contact">Contact</a></li>
                </ul>
                <div className="nav-actions nav-desktop">
                    <button className="cta" style={{ fontSize: '.75rem', padding: '.7rem 1.25rem' }}>Advisory</button>
                </div>
                <button
                    ref={btnRef}
                    aria-label={navbar.mobileMenuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={navbar.mobileMenuOpen}
                    aria-controls="mobile-drawer"
                    onClick={toggleMobileMenu}
                    className={`menu-btn luxe ${navbar.mobileMenuOpen ? 'active' : ''}`}
                >
                    <span className="menu-shape" aria-hidden="true">
                        <span className="dot d1" />
                        <span className="dot d2" />
                        <span className="dot d3" />
                        <span className="dot d4" />
                        <span className="cross-line l1" />
                        <span className="cross-line l2" />
                    </span>
                </button>
            </div>
            <div className={`mobile-overlay ${navbar.mobileMenuOpen ? 'show' : ''}`} aria-hidden={!navbar.mobileMenuOpen} />
            <div ref={drawerRef} id="mobile-drawer" className={`mobile-drawer glass-strong ${navbar.mobileMenuOpen ? 'show' : ''}`} aria-hidden={!navbar.mobileMenuOpen}>
                <ul className="mobile-nav-list">
                    <li style={{ '--i': 1 }}><a className={navbar.activeSection === 'home' ? 'active' : ''} onClick={closeMobileMenu} href="#home">Home</a></li>
                    <li style={{ '--i': 2 }}><a className={navbar.activeSection === 'portfolio' ? 'active' : ''} onClick={closeMobileMenu} href="#portfolio">Portfolio</a></li>
                    <li style={{ '--i': 3 }}><a className={navbar.activeSection === 'about' ? 'active' : ''} onClick={closeMobileMenu} href="#about">About</a></li>
                    <li style={{ '--i': 4 }}><a className={navbar.activeSection === 'contact' ? 'active' : ''} onClick={closeMobileMenu} href="#contact">Contact</a></li>
                </ul>
                <button className="cta mobile-cta" onClick={closeMobileMenu} style={{ '--i': 5 }}>Request Advisory</button>
            </div>
        </nav>
    );
};

export default Navbar;
