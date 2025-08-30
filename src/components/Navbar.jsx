import { useState, useRef  } from 'react';

const Navbar = () => {
    const [activeSection] = useState("home");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
     const [scrolled] = useState(false);

    const btnRef = useRef(null);
    const drawerRef = useRef(null);

    const toggleMobileMenu = () => {
        setMobileMenuOpen((prev) => !prev);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container nav-inner">
                <a href="#home" className="brand">
                    Rafique <span>Merchant</span>
                </a>
                <ul className="nav-links nav-desktop">
                    <li><a className={activeSection === 'home' ? 'active' : ''} href="#home">Home</a></li>
                    <li><a className={activeSection === 'portfolio' ? 'active' : ''} href="#portfolio">Portfolio</a></li>
                    <li><a className={activeSection === 'about' ? 'active' : ''} href="#about">About</a></li>
                    <li><a className={activeSection === 'contact' ? 'active' : ''} href="#contact">Contact</a></li>
                </ul>
                <div className="nav-actions nav-desktop">
                    <button className="cta" style={{ fontSize: '.75rem', padding: '.7rem 1.25rem' }}>Advisory</button>
                </div>
                <button
                    ref={btnRef}
                    aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={mobileMenuOpen}
                    aria-controls="mobile-drawer"
                    onClick={toggleMobileMenu}
                    className={`menu-btn luxe ${mobileMenuOpen ? 'active' : ''}`}
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
            <div className={`mobile-overlay ${mobileMenuOpen ? 'show' : ''}`} aria-hidden={!mobileMenuOpen} />
            <div ref={drawerRef} id="mobile-drawer" className={`mobile-drawer glass-strong ${mobileMenuOpen ? 'show' : ''}`} aria-hidden={!mobileMenuOpen}>
                <ul className="mobile-nav-list">
                    <li style={{ '--i': 1 }}><a className={activeSection === 'home' ? 'active' : ''} onClick={closeMobileMenu} href="#home">Home</a></li>
                    <li style={{ '--i': 2 }}><a className={activeSection === 'portfolio' ? 'active' : ''} onClick={closeMobileMenu} href="#portfolio">Portfolio</a></li>
                    <li style={{ '--i': 3 }}><a className={activeSection === 'about' ? 'active' : ''} onClick={closeMobileMenu} href="#about">About</a></li>
                    <li style={{ '--i': 4 }}><a className={activeSection === 'contact' ? 'active' : ''} onClick={closeMobileMenu} href="#contact">Contact</a></li>
                </ul>
                <button className="cta mobile-cta" onClick={closeMobileMenu} style={{ '--i': 5 }}>Request Advisory</button>
            </div>
        </nav>
    );
};

export default Navbar;
