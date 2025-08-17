import React from 'react';
import { motion } from 'framer-motion';
import { formatPrice } from '../utils';

const PropertyModal = ({ property, onClose }) => {
  return (
    <motion.div className="modal-portal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="modal-backdrop" onClick={onClose} />
      <motion.div className="modal-panel glass-strong" role="dialog" aria-modal="true" aria-label={property.title}
        initial={{ y: 60, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }}
        exit={{ y: 40, opacity: 0, scale: 0.92, transition: { duration: 0.4 } }}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <div className="modal-media" style={{ backgroundImage: `url(${property.image}?w=1400&auto=format&fit=crop&q=70)` }} />
        <div className="modal-body">
          <h3 className="modal-title">{property.title}</h3>
          <div className="modal-price">{formatPrice(property.price)}</div>
          <div className="modal-meta">{property.beds} BD • {property.baths} BA • {property.size.toLocaleString()} SF • {property.location}</div>
          <p style={{ color: 'var(--color-neutral-300)', lineHeight: 1.5, marginTop: '1rem' }}>{property.blurb}</p>
          <div className="modal-actions">
            <button className="cta">Request Viewing</button>
            <button className="cta btn-outline" onClick={onClose}>Close</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PropertyModal;
