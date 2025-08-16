import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { variants } from '../hooks/useAdvancedAnimations';

const initialState = { name: '', email: '', phone: '', interest: '', message: '' };

const Contact = () => {
    const [data, setData] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [sent, setSent] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const validate = () => {
        const e = {};
        if (!data.name.trim()) e.name = 'Name required';
        if (!data.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) e.email = 'Valid email required';
        if (data.phone && !data.phone.match(/^[+()0-9\s-]{7,}$/)) e.phone = 'Invalid phone';
        if (!data.message.trim()) e.message = 'Message required';
        return e;
    };

    const onChange = e => {
        const { name, value } = e.target;
        setData(d => ({ ...d, [name]: value }));
        if (errors[name]) setErrors(er => { const clone = { ...er }; delete clone[name]; return clone; });
    };

    const onSubmit = e => {
        e.preventDefault();
        const eMap = validate();
        setErrors(eMap);
        if (Object.keys(eMap).length) return;
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            setSent(true);
            setTimeout(() => { setSent(false); setData(initialState); }, 4000);
        }, 900);
    };

    return (
        <section id="contact" className="section-pad contact-section">
            <div className="container">
                <motion.div className="section-intro" variants={variants.sectionReveal} initial="initial" whileInView="animate" viewport={{ once: true }}>
                    <h2 className="section-heading">Confidential Enquiry</h2>
                    <p className="subheading" style={{ marginBottom: '2.2rem' }}>
                        Initiate a discreet conversation regarding acquisition strategy, portfolio calibration or exclusive representation.
                    </p>
                </motion.div>
                <div className="contact-grid">
                    <motion.div className="contact-panel glass-strong" variants={variants.fadeInBlur} initial="initial" whileInView="animate" viewport={{ once: true }}>
                        <h3 className="contact-title">Request Advisory</h3>
                        <form onSubmit={onSubmit} noValidate className={submitting ? 'is-submitting' : ''}>
                            <div className={`field ${data.name ? 'filled' : ''} ${errors.name ? 'error' : ''}`}>
                                <input name="name" id="name" value={data.name} onChange={onChange} autoComplete="name" />
                                <label htmlFor="name">Full Name</label>
                                {errors.name && <span className="err">{errors.name}</span>}
                            </div>
                            <div className="field-row">
                                <div className={`field ${data.email ? 'filled' : ''} ${errors.email ? 'error' : ''}`}>
                                    <input name="email" id="email" type="email" value={data.email} onChange={onChange} autoComplete="email" />
                                    <label htmlFor="email">Email</label>
                                    {errors.email && <span className="err">{errors.email}</span>}
                                </div>
                                <div className={`field ${data.phone ? 'filled' : ''} ${errors.phone ? 'error' : ''}`}>
                                    <input name="phone" id="phone" value={data.phone} onChange={onChange} autoComplete="tel" />
                                    <label htmlFor="phone">Phone (Optional)</label>
                                    {errors.phone && <span className="err">{errors.phone}</span>}
                                </div>
                            </div>
                            <div className={`field select ${data.interest ? 'filled' : ''}`}>
                                <select name="interest" id="interest" value={data.interest} onChange={onChange}>
                                    <option value="">Interest Area</option>
                                    <option>Acquisition</option>
                                    <option>Disposition</option>
                                    <option>Valuation</option>
                                    <option>Private Portfolio</option>
                                </select>
                                <label htmlFor="interest">Interest</label>
                            </div>
                            <div className={`field ${data.message ? 'filled' : ''} ${errors.message ? 'error' : ''}`}>
                                <textarea name="message" id="message" rows={4} value={data.message} onChange={onChange} />
                                <label htmlFor="message">Message</label>
                                {errors.message && <span className="err">{errors.message}</span>}
                            </div>
                            <div className="form-actions">
                                <button type="submit" disabled={submitting} className="cta" style={{ minWidth: '190px' }}>
                                    {submitting ? 'Sending...' : sent ? 'Sent ✓' : 'Send Enquiry'}
                                </button>
                                {sent && <span className="form-status" aria-live="polite">We received your request.</span>}
                            </div>
                        </form>
                        <p className="privacy-note">Your information is encrypted in transit and never shared without consent.</p>
                    </motion.div>
                    <motion.div className="contact-aside" variants={variants.cascadeParent} initial="initial" whileInView="animate" viewport={{ once: true }}>
                        <motion.div className="aside-block glass" variants={variants.cascadeItem}>
                            <h4>Direct</h4>
                            <ul className="contact-list">
                                <li><span>Email</span><a href="mailto:advisory@rafiquemerchant.com">advisory@rafiquemerchant.com</a></li>
                                <li><span>Office</span><a href="tel:+11234567890">+1 123 456 7890</a></li>
                            </ul>
                        </motion.div>
                        <motion.div className="aside-block glass" variants={variants.cascadeItem}>
                            <h4>Offices</h4>
                            <ul className="contact-list small">
                                <li>Dubai • London • Singapore</li>
                                <li>Zurich • New York (Rep.)</li>
                            </ul>
                        </motion.div>
                        <motion.div className="aside-block glass" variants={variants.cascadeItem}>
                            <h4>Confidentiality</h4>
                            <p style={{ fontSize: '.75rem', lineHeight: 1.5, color: 'var(--color-neutral-500)' }}>
                                We adhere to strict NDAs when handling off‑market intelligence and client mandates.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
