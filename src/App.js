import React, { useEffect, Suspense, lazy } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { motion } from 'motion/react';
import { store, persistor } from './store';
import { variants } from './hooks/useAdvancedAnimations';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import PerformanceMonitor from './components/PerformanceMonitor';
import ReduxPerformanceInitializer from './components/ReduxPerformanceInitializer';
import OptimizedMotion from './components/OptimizedMotion';
import './styles/performance.css';
const Contact = lazy(() => import('./components/Contact'));
// Code-split heavier sections (declare after all static imports per eslint import/first rule)
const Properties = lazy(() => import(/* webpackChunkName: 'properties-chunk' */ './components/Properties'));

// Simple intersection observer for reveal animations
// const useReveal = () => {
//     useEffect(() => {
//         document.documentElement.classList.add('reveal-ready');
//         const els = [...document.querySelectorAll('.reveal-up, .fade-in')];
//         const observer = new IntersectionObserver((entries) => {
//             entries.forEach(e => {
//                 if (e.isIntersecting) {
//                     e.target.classList.add('visible');
//                     observer.unobserve(e.target);
//                 }
//             });
//         }, { threshold: 0.2 });
//         els.forEach(el => observer.observe(el));
//         return () => observer.disconnect();
//     }, []);
// };

// Main App component wrapped with Redux
const AppContent = () => {
    // useReveal();
    return (
        <>
            {/* <ReduxPerformanceInitializer />
            <PerformanceMonitor enabled={process.env.NODE_ENV === 'development'} /> */}
            <Navbar />
        
            <main
                initial="initial"
                animate="animate"
                variants={variants.pageLoad}
                style={{
                    position: 'relative',
                    willChange: "opacity, transform"
                }}
            >
                <Hero />
                    <Properties />

                <section id="about" className="section-pad">
                    <div className="container">
                        <OptimizedMotion
                            initial={{ opacity: 0, y: 50, scale: 0.98, blur: 6 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1, blur: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 150,
                                damping: 20,
                                duration: 0.8
                            }}
                            viewport={{ once: true, amount: 0.3 }}
                        >
                            <h2 className="section-heading">Advisory Ethos</h2>
                            <p className="subheading" style={{ marginBottom: '2.2rem' }}>
                                Our philosophy centers on long-term asset performance, safeguarding capital while enhancing lifestyle utility. We navigate complexity with discretion, insight and a calibrated negotiation posture.
                            </p>
                        </OptimizedMotion>
                        <OptimizedMotion
                            className="grid"
                            style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '2.2rem' }}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{
                                delay: 0.3,
                                staggerChildren: 0.15,
                                delayChildren: 0.2
                            }}
                            viewport={{ once: true, amount: 0.2 }}
                        >
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
                            ].map((block, index) => (
                                <OptimizedMotion
                                    key={block.title}
                                    className="glass value"
                                    initial={{ opacity: 0, y: 40, scale: 0.95, blur: 8 }}
                                    whileInView={{ opacity: 1, y: 0, scale: 1, blur: 0 }}
                                    whileHover={{
                                        scale: 1.02,
                                        y: -3,
                                        boxShadow: "0 20px 40px -15px rgba(0,0,0,0.15)",
                                        transition: { type: 'spring', stiffness: 300, damping: 30 }
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 160,
                                        damping: 22,
                                        delay: index * 0.15
                                    }}
                                    viewport={{ once: true }}
                                >
                                    <h3>{block.title}</h3>
                                    <p>{block.copy}</p>
                                </OptimizedMotion>
                            ))}
                        </OptimizedMotion>
                    </div>
                </section>
                <Suspense fallback={<div style={{ minHeight: '30vh', display: 'grid', placeItems: 'center', fontSize: '.7rem', letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--color-neutral-500)' }}>Loading contact…</div>}>
                    <Contact />
                </Suspense>
            </main>
            <Footer /> 
        </>
    );
};

function App() {
    return (
        <Provider store={store}>
            <PersistGate
                loading={
                    <div style={{
                        minHeight: '100vh',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '.75rem',
                        letterSpacing: '.25em',
                        textTransform: 'uppercase',
                        color: 'var(--color-neutral-500)',
                        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div>Initializing Redux…</div>
                            <div style={{
                                marginTop: '1rem',
                                fontSize: '.6rem',
                                opacity: 0.7
                            }}>
                                State management ready
                            </div>
                        </div>
                    </div>
                }
                persistor={persistor}
            >
                <AppContent />
                
        
            </PersistGate>
        </Provider>
    );
}

export default App;
