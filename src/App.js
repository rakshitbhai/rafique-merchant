import React, { useEffect, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { variants } from './hooks/useAdvancedAnimations';
import './styles/theme.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PerfToggle from './components/PerfToggle';
import Footer from './components/Footer';
import Contact from './components/Contact';
// Code-split heavier sections (declare after all static imports per eslint import/first rule)
const Properties = lazy(() => import(/* webpackChunkName: 'properties-chunk' */ './components/Properties'));

// Simple intersection observer for reveal animations
const useReveal = () => {
    useEffect(() => {
        document.documentElement.classList.add('reveal-ready');
        const els = [...document.querySelectorAll('.reveal-up, .fade-in')];
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    observer.unobserve(e.target);
                }
            });
        }, { threshold: 0.2 });
        els.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);
};

function App() {
    useReveal();
    return (
        <>
            <Navbar />
            <motion.main
                initial="initial"
                animate="animate"
                variants={variants.pageLoad}
                style={{ position: 'relative' }}
            >
                <Hero />
                <Suspense fallback={<div style={{ minHeight: '40vh', display: 'grid', placeItems: 'center', fontSize: '.75rem', letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--color-neutral-500)' }}>Loading portfolio…</div>}>
                    <Properties />
                </Suspense>
                {/* About Section with professional motion */}
                <section id="about" className="section-pad">
                    <div className="container">
                        <motion.div variants={variants.sectionReveal} initial="initial" whileInView="animate" viewport={{ once: true }}>
                            <h2 className="section-heading">Advisory Ethos</h2>
                            <p className="subheading" style={{ marginBottom: '2.2rem' }}>
                                Our philosophy centers on long-term asset performance, safeguarding capital while enhancing lifestyle utility. We navigate complexity with discretion, insight and a calibrated negotiation posture.
                            </p>
                        </motion.div>
                        <motion.div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '2.2rem' }} variants={variants.cascadeParent} initial="initial" whileInView="animate" viewport={{ once: true }}>
                            {[
                                {
                                    title: 'Strategic Acquisition',
                                    copy: 'We vet architectural integrity, micro‑market indicators and liquidity vectors to underwrite resilient acquisitions.'
                                },
                                {
                                    title: 'Portfolio Curation',
                                    copy: 'Balancing primary residences, pied-à-terre holdings and yield assets for optimized exposure across cycles.'
                                },
                                {
                                    title: 'Confidential Disposition',
                                    copy: 'When divesting, we orchestrate controlled visibility campaigns preserving privacy and price integrity.'
                                }
                            ].map(block => (
                                <motion.div key={block.title} className="glass value" variants={variants.cascadeItem}>
                                    <h3>{block.title}</h3>
                                    <p>{block.copy}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>
                <Contact />
            </motion.main>
            <Footer />
            <PerfToggle />
        </>
    );
}

export default App;
