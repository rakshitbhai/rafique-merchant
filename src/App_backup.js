import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import './styles/theme.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Properties from './components/Properties';
import Footer from './components/Footer';
import Contact from './components/Contact';
import { variants, easings, useScrollAnimation } from './hooks/useAdvancedAnimations';

// Enhanced reveal animations with performance optimization
const useReveal = () => {
  useEffect(() => {
    // Add reveal-ready class with delay to prevent flash
    setTimeout(() => {
      document.documentElement.classList.add('reveal-ready');
    }, 100);

    const els = [...document.querySelectorAll('.reveal-up, .fade-in')];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '-50px 0px -50px 0px'
    });

    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
};

function App() {
  useReveal();
  const { ref: aboutRef, controls: aboutControls, isInView: aboutInView } = useScrollAnimation(0.3);

  const aboutVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2
      }
    }
  };

  const valueCardVariants = {
    initial: {
      opacity: 0,
      y: 50,
      scale: 0.95,
      rotateX: 10
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: easings.luxury
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1 }}
    >
      <Navbar />
      <main>
        <Hero />
        <Properties />

        {/* Enhanced About Section */}
        <motion.section
          id="about"
          className="section-pad"
          ref={aboutRef}
          initial="initial"
          animate={aboutControls}
          variants={aboutVariants}
        >
          <div className="container">
            <motion.h2
              className="section-heading"
              variants={variants.revealLuxury}
            >
              Advisory Ethos
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
              Our philosophy centers on long-term asset performance, safeguarding capital while enhancing lifestyle utility.
              We navigate complexity with discretion, insight and a calibrated negotiation posture.
            </motion.p>

            <motion.div
              className="grid"
              style={{
                gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
                gap: 'clamp(1.5rem, 4vw, 2.2rem)'
              }}
              variants={aboutVariants}
            >
              {[
                {
                  title: "Strategic Acquisition",
                  description: "We vet architectural integrity, micro‑market indicators and liquidity vectors to underwrite resilient acquisitions."
                },
                {
                  title: "Portfolio Curation",
                  description: "Balancing primary residences, pied-à-terre holdings and yield assets for optimized exposure across cycles."
                },
                {
                  title: "Confidential Disposition",
                  description: "When divesting, we orchestrate controlled visibility campaigns preserving privacy and price integrity."
                }
              ].map((value, index) => (
                <motion.div
                  key={value.title}
                  className="glass value"
                  variants={valueCardVariants}
                  whileHover={{
                    scale: 1.05,
                    y: -8,
                    rotateY: 2,
                    boxShadow: "0 20px 40px -15px rgba(0, 0, 0, .8), 0 0 0 1px rgba(212, 175, 55, 0.2)",
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }
                  }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    cursor: 'pointer',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <motion.h3
                    initial={{ opacity: 0, x: -20 }}
                    animate={aboutInView ? {
                      opacity: 1,
                      x: 0,
                      transition: { delay: 0.5 + index * 0.1, duration: 0.6 }
                    } : {}}
                  >
                    {value.title}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={aboutInView ? {
                      opacity: 1,
                      y: 0,
                      transition: { delay: 0.7 + index * 0.1, duration: 0.6 }
                    } : {}}
                  >
                    {value.description}
                  </motion.p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        <Contact />
      </main>
      <Footer />
    </motion.div>
  );
}

export default App;
