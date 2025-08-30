import React from 'react';
import { motion } from 'motion/react';
import { variants } from '../hooks/useAdvancedAnimations';

const Footer = () => {
    return (
        <footer className="footer" id="contact">
            <motion.div className="container footer-grid" variants={variants.cascadeParent} initial="initial" whileInView="animate" viewport={{ once: true }}>
                <motion.div className="footer-column" variants={variants.cascadeItem}>
                    <h3 className="footer-brand">Rafique <span>Merchant</span></h3>
                    <p style={{ fontSize: '.8rem', lineHeight: 1.5, color: 'var(--color-neutral-500)' }}>
                        Discreet advisory and acquisition strategy for premier residential and investment grade real estate assets.
                    </p>
                </motion.div>
                <motion.div className="footer-column" variants={variants.cascadeItem}>
                    <h4>Explore</h4>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#portfolio">Portfolio</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </motion.div>
                <motion.div className="footer-column" variants={variants.cascadeItem}>
                    <h4>Advisory</h4>
                    <ul>
                        <li><a href="/private-sales" aria-label="Private Sales">Private Sales</a></li>
                        <li><a href="/valuation" aria-label="Asset Valuation">Asset Valuation</a></li>
                        <li><a href="/market-intelligence" aria-label="Market Intelligence">Market Intelligence</a></li>
                        <li><a href="/portfolio-structuring" aria-label="Portfolio Structuring">Portfolio Structuring</a></li>
                    </ul>
                </motion.div>
                <motion.div className="footer-column" variants={variants.cascadeItem}>
                    <h4>Connect</h4>
                    <ul>
                        <li><a href="mailto:advisory@rafiquemerchant.com">Email</a></li>
                        <li><a href="https://linkedin.com" target="_blank" rel="noreferrer noopener">LinkedIn</a></li>
                        <li><a href="https://instagram.com" target="_blank" rel="noreferrer noopener">Instagram</a></li>
                    </ul>
                </motion.div>
            </motion.div>
            <div className="container">
                <p className="copyright">© {new Date().getFullYear()} Rafique Merchant Advisory. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
