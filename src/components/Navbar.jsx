import React, { useEffect, useRef, useState } from 'react';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [active, setActive] = useState('home');

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
                setActive(visible[0].target.id);
            }
        }, { threshold: [0.25, 0.4, 0.6] });
        sections.forEach(sec => io.observe(sec));
        return () => io.disconnect();
    }, []);

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container nav-inner">
                <a href="#home" className="brand" onClick={() => setOpen(false)}>
                    Rafique <span>Merchant</span>
                </a>
                <ul className="nav-links nav-desktop">
                    <li><a className={active === 'home' ? 'active' : ''} href="#home">Home</a></li>
                    <li><a className={active === 'portfolio' ? 'active' : ''} href="#portfolio">Portfolio</a></li>
                    <li><a className={active === 'about' ? 'active' : ''} href="#about">About</a></li>
                    <li><a className={active === 'contact' ? 'active' : ''} href="#contact">Contact</a></li>
                </ul>
                <div className="nav-actions nav-desktop">
                    <button className="cta" style={{ fontSize: '.75rem', padding: '.7rem 1.25rem' }}>Advisory</button>
                </div>
                <button
                    ref={btnRef}
                    aria-label={open ? 'Close menu' : 'Open menu'}
                    aria-expanded={open}
                    aria-controls="mobile-drawer"
                    onClick={() => setOpen(o => !o)}
                    className={`menu-btn luxe ${open ? 'active' : ''}`}
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
            <div className={`mobile-overlay ${open ? 'show' : ''}`} aria-hidden={!open} />
            <div ref={drawerRef} id="mobile-drawer" className={`mobile-drawer glass-strong ${open ? 'show' : ''}`} aria-hidden={!open}>
                <ul className="mobile-nav-list">
                    <li style={{ '--i': 1 }}><a className={active === 'home' ? 'active' : ''} onClick={() => setOpen(false)} href="#home">Home</a></li>
                    <li style={{ '--i': 2 }}><a className={active === 'portfolio' ? 'active' : ''} onClick={() => setOpen(false)} href="#portfolio">Portfolio</a></li>
                    <li style={{ '--i': 3 }}><a className={active === 'about' ? 'active' : ''} onClick={() => setOpen(false)} href="#about">About</a></li>
                    <li style={{ '--i': 4 }}><a className={active === 'contact' ? 'active' : ''} onClick={() => setOpen(false)} href="#contact">Contact</a></li>
                </ul>
                <button className="cta mobile-cta" onClick={() => setOpen(false)} style={{ '--i': 5 }}>Request Advisory</button>
            </div>
        </nav>
    );
};

export default Navbar;
