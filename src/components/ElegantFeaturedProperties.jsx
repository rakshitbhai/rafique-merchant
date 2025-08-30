import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
    setFilter,
    setSelectedProperty,
    setViewMode,
    selectFilters,
    selectSelectedProperty,
    selectViewMode,
    selectFilteredProperties
} from '../store/slices/propertiesSlice';
import SimpleSwipeProperties from './SimpleSwipeProperties';

const ElegantFeaturedProperties = () => {
    const dispatch = useDispatch();

    // Redux selectors
    const filters = useSelector(selectFilters);
    const selectedProperty = useSelector(selectSelectedProperty);
    const viewMode = useSelector(selectViewMode);
    const filteredProperties = useSelector(selectFilteredProperties);

    // Local state
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('featured');

    // Check if device is mobile and set initial view mode
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth <= 768;

            // Set swipe mode as default for mobile devices
            if (mobile && viewMode === 'grid') {
                dispatch(setViewMode('swipe'));
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [dispatch, viewMode]);    // Event handlers
    const handleFilterChange = (filterType, value) => {
        dispatch(setFilter({ filterType, value }));
    };

    const handlePropertyClick = (property) => {
        dispatch(setSelectedProperty(property));
    };

    const handleCloseModal = () => {
        dispatch(setSelectedProperty(null));
    };

    const handleViewModeChange = () => {
        const newMode = viewMode === 'grid' ? 'swipe' : 'grid';
        dispatch(setViewMode(newMode));
    };

    // Filter properties based on search term
    const searchFilteredProperties = filteredProperties.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort properties
    const sortedProperties = [...searchFilteredProperties].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'location':
                return a.location.localeCompare(b.location);
            default:
                return 0;
        }
    });

    return (
        <>
            {/* Render swipe or grid mode */}
            {viewMode === 'swipe' ? (
                <SimpleSwipeProperties
                    onBackToGrid={handleViewModeChange}
                    onFilterChange={handleFilterChange}
                    onPropertyClick={handlePropertyClick}
                    filters={filters}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                />
            ) : (
                <section className="properties-section section-pad">
                    <div className="section-bg-fade"></div>
                    <div className="container">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            style={{ textAlign: 'center', marginBottom: '3rem' }}
                        >
                            <h2 className="section-heading">Featured Portfolio</h2>
                            <p className="subheading" style={{ margin: '0 auto' }}>
                                A curated selection of distinguished residences exemplifying
                                craftsmanship, location advantage and asset resilience.
                            </p>
                        </motion.div>

                        {/* Filter Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="portfolio-top-bar"
                        >
                            <div className="filters-inline">
                                <button
                                    className={`filter-pill ${!filters.type ? 'active' : ''}`}
                                    onClick={() => handleFilterChange('type', null)}
                                >
                                    ALL
                                </button>
                                <button
                                    className={`filter-pill ${filters.type === 'Penthouse' ? 'active' : ''}`}
                                    onClick={() => handleFilterChange('type', 'Penthouse')}
                                >
                                    PENTHOUSE
                                </button>
                                <button
                                    className={`filter-pill ${filters.type === 'Villa' ? 'active' : ''}`}
                                    onClick={() => handleFilterChange('type', 'Villa')}
                                >
                                    VILLA
                                </button>
                                <button
                                    className={`filter-pill ${filters.type === 'Estate' ? 'active' : ''}`}
                                    onClick={() => handleFilterChange('type', 'Estate')}
                                >
                                    ESTATE
                                </button>
                                <button
                                    className={`filter-pill ${filters.type === 'Loft' ? 'active' : ''}`}
                                    onClick={() => handleFilterChange('type', 'Loft')}
                                >
                                    LOFT
                                </button>
                            </div>

                            <div className="filter-bar refined">
                                <input
                                    type="text"
                                    placeholder="Search properties..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />

                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="featured">Featured</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="location">Location</option>
                                </select>

                                <button
                                    onClick={handleViewModeChange}
                                    className="cta"
                                    style={{ fontSize: '0.75rem', padding: '0.75rem 1.5rem' }}
                                >
                                    {viewMode === 'grid' ? 'SWIPE VIEW' : 'GRID VIEW'}
                                </button>
                            </div>
                        </motion.div>

                        {/* Properties Grid */}
                        {/*<motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="grid properties-grid mosaic responsive"
                        >
                            <AnimatePresence>
                                {sortedProperties.map((property, index) => (
                                    <motion.div
                                        key={property.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{
                                            duration: 0.5,
                                            delay: index * 0.1
                                        }}
                                        className={`card ${property.featured ? 'feature-card' : ''}`}
                                        onClick={() => handlePropertyClick(property)}
                                    >
                                        <div className="card-media" style={{ backgroundImage: `url(${property.image})` }}>
                                            <div className="card-skeleton">
                                                <div className="skel-shimmer"></div>
                                            </div>
                                        </div>

                                        <button className="quick-view-tag">
                                            VIEW
                                        </button>

                                        <div className="badge" style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 3 }}>
                                            {property.type}
                                        </div>

                                        <div className="card-content">
                                            <h3>{property.title}</h3>
                                            <div className="price">
                                                ${property.price.toLocaleString()}
                                            </div>
                                            <div className="location">
                                                {property.location}
                                            </div>
                                            <div className="card-meta-row">
                                                <span>{property.bedrooms} bed</span>
                                                <span>{property.bathrooms} bath</span>
                                                <span>{property.sqft} sqft</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div> */}
                    </div> 

                    {/* Property Modal */}
                    <AnimatePresence>
                        {selectedProperty && (
                            <div className="modal-portal">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="modal-backdrop"
                                    onClick={handleCloseModal}
                                />

                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    className="modal-panel glass-strong"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="modal-media" style={{ backgroundImage: `url(${selectedProperty.image})` }} />

                                    <div className="modal-body">
                                        <button className="modal-close" onClick={handleCloseModal}>
                                            ×
                                        </button>

                                        <h2 className="modal-title">{selectedProperty.title}</h2>
                                        <div className="modal-price">
                                            ${selectedProperty.price.toLocaleString()}
                                        </div>
                                        <div className="modal-meta">
                                            {selectedProperty.location}
                                        </div>

                                        <p style={{ marginTop: '1.5rem', lineHeight: '1.6', color: 'var(--color-neutral-300)' }}>
                                            {selectedProperty.description}
                                        </p>

                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(3, 1fr)',
                                            gap: '1rem',
                                            marginTop: '2rem',
                                            marginBottom: '1.5rem'
                                        }}>
                                            <div className="glass" style={{ padding: '1rem', textAlign: 'center', borderRadius: '12px' }}>
                                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-gold)', marginBottom: '0.5rem' }}>
                                                    {selectedProperty.bedrooms}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--color-neutral-500)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                                    Bedrooms
                                                </div>
                                            </div>
                                            <div className="glass" style={{ padding: '1rem', textAlign: 'center', borderRadius: '12px' }}>
                                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-gold)', marginBottom: '0.5rem' }}>
                                                    {selectedProperty.bathrooms}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--color-neutral-500)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                                    Bathrooms
                                                </div>
                                            </div>
                                            <div className="glass" style={{ padding: '1rem', textAlign: 'center', borderRadius: '12px' }}>
                                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-gold)', marginBottom: '0.5rem' }}>
                                                    {selectedProperty.sqft}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--color-neutral-500)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                                    Square Feet
                                                </div>
                                            </div>
                                        </div>

                                        <div className="modal-actions">
                                            <button className="cta">Contact Agent</button>
                                            <button className="btn-outline cta">Schedule Tour</button>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </section>
            )}

            {/* Property Modal - Always available for both grid and swipe modes */}
            <AnimatePresence>
                {selectedProperty && (
                    <div className="modal-portal">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="modal-backdrop"
                            onClick={handleCloseModal}
                        />

                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="modal-panel glass-strong"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-media" style={{ backgroundImage: `url(${selectedProperty.image})` }} />

                            <div className="modal-body">
                                <button className="modal-close" onClick={handleCloseModal}>
                                    ×
                                </button>

                                <h2 className="modal-title">{selectedProperty.title}</h2>
                                <div className="modal-price">
                                    ${selectedProperty.price.toLocaleString()}
                                </div>
                                <div className="modal-meta">
                                    {selectedProperty.location}
                                </div>

                                <p style={{ marginTop: '1.5rem', lineHeight: '1.6', color: 'var(--color-neutral-300)' }}>
                                    {selectedProperty.blurb}
                                </p>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gap: '1rem',
                                    marginTop: '2rem',
                                    marginBottom: '1.5rem'
                                }}>
                                    <div className="glass" style={{ padding: '1rem', textAlign: 'center', borderRadius: '12px' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-gold)', marginBottom: '0.5rem' }}>
                                            {selectedProperty.beds}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-neutral-500)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                            Bedrooms
                                        </div>
                                    </div>
                                    <div className="glass" style={{ padding: '1rem', textAlign: 'center', borderRadius: '12px' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-gold)', marginBottom: '0.5rem' }}>
                                            {selectedProperty.baths}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-neutral-500)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                            Bathrooms
                                        </div>
                                    </div>
                                    <div className="glass" style={{ padding: '1rem', textAlign: 'center', borderRadius: '12px' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-gold)', marginBottom: '0.5rem' }}>
                                            {selectedProperty.size}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-neutral-500)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                            Sq Ft
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-actions">
                                    <button className="cta">Contact Agent</button>
                                    <button className="btn-outline cta">Schedule Tour</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ElegantFeaturedProperties;
