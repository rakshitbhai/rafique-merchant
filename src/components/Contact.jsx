import React from 'react';
import { motion } from 'motion/react';
import { variants } from '../hooks/useAdvancedAnimations';
import { useContactForm } from '../store/hooks';

const Contact = () => {
    const {
        formData,
        errors,
        isSubmitting,
        isSubmitted,
        isValid,
        canSubmit,
        updateField,
        setSubmitting,
        setSubmitted,
        resetForm,
    } = useContactForm();

    const onChange = (e) => {
        const { name, value } = e.target;
        updateField(name, value);
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (!isValid || !canSubmit) return;

        setSubmitting(true);

        // Simulate form submission
        setTimeout(() => {
            console.log('Form submitted:', formData);
            setSubmitted(true);
            setSubmitting(false);

            // Reset form after success
            setTimeout(() => {
                resetForm();
            }, 3000);
        }, 2000);
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
                        <form onSubmit={onSubmit} noValidate className={isSubmitting ? 'is-submitting' : ''}>
                            <div className={`field ${formData.name ? 'filled' : ''} ${errors.name ? 'error' : ''}`}>
                                <input name="name" id="name" value={formData.name} onChange={onChange} autoComplete="name" />
                                <label htmlFor="name">Full Name</label>
                                {errors.name && <span className="err">{errors.name}</span>}
                            </div>
                            <div className="field-row">
                                <div className={`field ${formData.email ? 'filled' : ''} ${errors.email ? 'error' : ''}`}>
                                    <input name="email" id="email" type="email" value={formData.email} onChange={onChange} autoComplete="email" />
                                    <label htmlFor="email">Email</label>
                                    {errors.email && <span className="err">{errors.email}</span>}
                                </div>
                                <div className={`field ${formData.phone ? 'filled' : ''} ${errors.phone ? 'error' : ''}`}>
                                    <input name="phone" id="phone" value={formData.phone} onChange={onChange} autoComplete="tel" />
                                    <label htmlFor="phone">Phone (Optional)</label>
                                    {errors.phone && <span className="err">{errors.phone}</span>}
                                </div>
                            </div>
                            <div className={`field select ${formData.interest ? 'filled' : ''}`}>
                                <select name="interest" id="interest" value={formData.interest} onChange={onChange}>
                                    <option value="">Interest Area</option>
                                    <option>Acquisition</option>
                                    <option>Disposition</option>
                                    <option>Valuation</option>
                                    <option>Private Portfolio</option>
                                </select>
                                <label htmlFor="interest">Interest</label>
                            </div>
                            <div className={`field ${formData.message ? 'filled' : ''} ${errors.message ? 'error' : ''}`}>
                                <textarea name="message" id="message" rows={4} value={formData.message} onChange={onChange} />
                                <label htmlFor="message">Message</label>
                                {errors.message && <span className="err">{errors.message}</span>}
                            </div>
                            <div className="form-actions">
                                <button type="submit" disabled={!canSubmit} className="cta" style={{ minWidth: '190px' }}>
                                    {isSubmitting ? 'Sending...' : isSubmitted ? 'Sent ✓' : 'Send Enquiry'}
                                </button>
                                {isSubmitted && <span className="form-status" aria-live="polite">We received your request.</span>}
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
