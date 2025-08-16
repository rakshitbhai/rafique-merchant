import React, { useState, useEffect, useRef } from 'react';
import Spline from '@splinetool/react-spline';

// 3D Experience section embedding the provided Spline scene with graceful loading + error fallback.
const Experience3D = () => {
    const [loaded, setLoaded] = useState(false);
    const [failed, setFailed] = useState(false);
    const wrapperRef = useRef(null);
    const [shouldMount, setShouldMount] = useState(false); // lazy mount when in view

    useEffect(() => {
        const el = wrapperRef.current;
        if (!el) return;
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    setShouldMount(true);
                    io.disconnect();
                }
            });
        }, { threshold: 0.15 });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <section id="experience" className="section-pad fade-in" aria-label="3D Spatial Showcase">
            <div className="container">
                <h2 className="section-heading">Immersive Perspective</h2>
                <p className="subheading" style={{ marginBottom: '2.2rem' }}>
                    Explore a refined interior spatial study – rotate, pan and inspect architectural composition directly in your browser.
                </p>
                <div ref={wrapperRef} className={`spline-wrapper glass-strong ${loaded ? 'is-loaded' : ''}`}
                    aria-busy={!loaded && !failed}
                    aria-live="polite">
                    {!loaded && !failed && (
                        <div className="spline-loading" role="status">
                            <span className="pulse-dot" />
                            <span>Loading 3D space…</span>
                        </div>
                    )}
                    {failed && (
                        <div className="spline-fallback" role="alert">
                            <p style={{ margin: 0 }}>3D scene unavailable right now.</p>
                            <small style={{ letterSpacing: '.15em', opacity: .7 }}>Please retry later.</small>
                        </div>
                    )}
                    {shouldMount && !failed && (
                        <Spline
                            scene="https://prod.spline.design/tGjJ6QDIi3y-GRzV/scene.splinecode"
                            onLoad={() => setLoaded(true)}
                            onError={(e) => { console.error('Spline load error', e); setFailed(true); }}
                            style={{ opacity: loaded ? 1 : 0, transition: 'opacity 900ms ease 100ms' }}
                        />
                    )}
                </div>
            </div>
        </section>
    );
};

export default Experience3D;
