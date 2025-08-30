import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { selectFilteredProperties } from '../store/slices/propertiesSlice';

// Memoized property card component for better performance
const PropertyCard = React.memo(({
    property,
    isActive = false,
    scale = 1,
    opacity = 1,
    zIndex = 0,
    x,
    rotate,
    onDragEnd,
    onPropertyClick,
    yOffset = 0
}) => {
    const cardStyle = useMemo(() => ({
        backgroundImage: `url(${property.image})`,
        scale: isActive ? 1 : scale,
        opacity: opacity,
        zIndex: zIndex,
        y: yOffset,
        // Hardware acceleration
        willChange: isActive ? 'transform' : 'auto',
        ...(isActive && x && rotate ? { x, rotate } : {})
    }), [property.image, isActive, scale, opacity, zIndex, yOffset, x, rotate]);

    const cardProps = useMemo(() => {
        const base = {
            className: `swipe-card ${isActive ? 'top' : ''}`,
            style: cardStyle,
            initial: { scale: 0.85, opacity: 0 },
            animate: {
                scale: isActive ? 1 : scale,
                opacity: opacity
            },
            transition: {
                duration: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smoothness
                type: "tween"
            }
        };

        if (isActive && onDragEnd) {
            return {
                ...base,
                drag: "x",
                dragConstraints: { left: 0, right: 0 },
                dragElastic: 0.05, // Reduced for snappier feel
                dragTransition: { bounceStiffness: 300, bounceDamping: 20 },
                onDragEnd,
                whileDrag: {
                    scale: 1.015,
                    cursor: 'grabbing',
                    transition: { duration: 0.1 }
                }
            };
        }

        return base;
    }, [isActive, cardStyle, scale, opacity, onDragEnd]);

    return (
        <motion.div {...cardProps}>
            {/* Enhanced dark overlay for better text visibility */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.3) 40%, rgba(0, 0, 0, 0.8) 100%)',
                pointerEvents: 'none',
                zIndex: 1
            }} />

            {/* VIEW Button */}
            {onPropertyClick && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onPropertyClick(property);
                    }}
                    style={{
                        position: 'absolute',
                        top: '1.5rem',
                        left: '1.5rem',
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(8px)',
                        border: 'none',
                        borderRadius: '20px',
                        padding: '0.5rem 1rem',
                        color: 'black',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        letterSpacing: '0.1em',
                        cursor: 'pointer',
                        zIndex: 10,
                        transition: 'all 0.2s ease',
                        textTransform: 'uppercase'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 1)';
                        e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                        e.target.style.transform = 'scale(1)';
                    }}
                >
                    View
                </button>
            )}

            <div className="swipe-card-overlay swipe-card-overlay-enhanced" style={{
                position: 'relative',
                zIndex: 2,
                padding: 0, // Override default padding
                background: 'none', // Override default background
                display: 'block' // Override default flex
            }}>
                {/* Property type badge with better contrast */}
                <div className="badge" style={{
                    position: 'absolute',
                    top: '1.5rem',
                    right: '1.5rem',
                    fontSize: '0.7rem',
                    padding: '0.4rem 0.8rem',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: '600',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                }}>
                    {property.type}
                </div>

                {/* Content container with enhanced background */}
                <div style={{
                    background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 20%, rgba(0, 0, 0, 0.85) 100%)',
                    padding: '2rem 1.5rem 1.5rem',
                    borderRadius: '0 0 34px 34px',
                    backdropFilter: 'blur(8px)',
                    position: 'relative'
                }}>
                    <h3 style={{
                        margin: '0 0 0.5rem',
                        color: 'white',
                        fontSize: '1.4rem',
                        fontWeight: '600',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.7)',
                        lineHeight: '1.3'
                    }}>{property.title}</h3>

                    <p className="loc" style={{
                        margin: '0 0 0.8rem',
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '0.8rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.7)'
                    }}>{property.location}</p>

                    <p className="price-line" style={{
                        margin: '0 0 0.8rem',
                        color: 'var(--color-gold)',
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)'
                    }}>${property.price.toLocaleString()}</p>

                    <p className="mini-meta" style={{
                        margin: '0 0 0.8rem',
                        color: 'rgba(255, 255, 255, 0.85)',
                        fontSize: '0.75rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.7)'
                    }}>
                        {property.beds} bed • {property.baths} bath • {property.size} sqft
                    </p>

                    <p style={{
                        fontSize: '0.8rem',
                        color: 'rgba(255, 255, 255, 0.8)',
                        lineHeight: '1.4',
                        margin: 0,
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.7)'
                    }}>
                        {property.blurb}
                    </p>
                </div>
            </div>
        </motion.div>
    );
});

PropertyCard.displayName = 'PropertyCard';

const SimpleSwipeProperties = React.memo(({ onBackToGrid, onFilterChange, onPropertyClick, filters }) => {
    // Use memoized selector to prevent unnecessary re-renders
    const filteredProperties = useSelector(selectFilteredProperties);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Motion values - must be at top level
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-300, 300], [-12, 12]);
    const cardOpacity = useTransform(x, [-300, -100, 0, 100, 300], [0.85, 1, 1, 1, 0.85]);

    // Check if device is mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Loading state effect - memoized with image preloading
    useEffect(() => {
        if (filteredProperties.length > 0) {
            // Preload next few images for smoother transitions
            const imagesToPreload = filteredProperties.slice(0, Math.min(4, filteredProperties.length));
            imagesToPreload.forEach(property => {
                const img = new Image();
                img.src = property.image;
            });

            const timer = setTimeout(() => setIsLoading(false), 100);
            return () => clearTimeout(timer);
        }
    }, [filteredProperties]);

    // Optimized property getters using useMemo
    const { currentProperty, nextProperty, thirdProperty } = useMemo(() => {
        if (!filteredProperties.length) return {};

        return {
            currentProperty: filteredProperties[currentIndex % filteredProperties.length],
            nextProperty: filteredProperties[(currentIndex + 1) % filteredProperties.length],
            thirdProperty: filteredProperties[(currentIndex + 2) % filteredProperties.length]
        };
    }, [filteredProperties, currentIndex]);

    // Optimized drag handler with useCallback
    const handleDragEnd = useCallback((event, info) => {
        const threshold = 60; // Lower threshold for better responsiveness
        const velocity = Math.abs(info.velocity.x);
        const offset = Math.abs(info.offset.x);

        const shouldSwipe = offset > threshold || velocity > 500;

        if (shouldSwipe) {
            // Immediate index update for snappier feel
            setCurrentIndex(prev => (prev + 1) % filteredProperties.length);

            // Reset position smoothly
            setTimeout(() => {
                x.set(0);
            }, 40);
        } else {
            // Smooth snap back
            x.set(0);
        }
    }, [filteredProperties.length, x]);

    // Loading state
    if (isLoading) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                        color: 'var(--color-neutral-400)',
                        fontSize: '1rem',
                        letterSpacing: '0.1em'
                    }}
                >
                    Loading properties...
                </motion.div>
            </div>
        );
    }

    // Empty state
    if (!filteredProperties.length || !currentProperty) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
                <h2 className="section-heading">No Properties Available</h2>
                <p className="subheading">Please adjust filters or check back later</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ textAlign: 'center' }}>
            {/* Navigation Header with Back Button and Filters */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isMobile ? 'center' : 'space-between',
                    marginBottom: '1.5rem',
                    padding: '0 1rem',
                    gap: '1rem'
                }}
            >
                {/* Back to Grid Button - Hidden on Mobile */}
                {!isMobile && (
                    <button
                        onClick={onBackToGrid}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '24px',
                            padding: '0.6rem 1.2rem',
                            color: 'white',
                            fontSize: '0.85rem',
                            fontWeight: '500',
                            backdropFilter: 'blur(8px)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(255,255,255,0.15)';
                            e.target.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(255,255,255,0.1)';
                            e.target.style.transform = 'translateY(0)';
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Grid View
                    </button>
                )}

                {/* Filter Toggle - Always visible */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: showFilters ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '24px',
                        padding: '0.6rem 1.2rem',
                        color: 'white',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        backdropFilter: 'blur(8px)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(255,255,255,0.15)';
                        e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = showFilters ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)';
                        e.target.style.transform = 'translateY(0)';
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6H21L19 8H5L3 6ZM7 12H17L15 14H9L7 12ZM10 18H14V16H10V18Z" fill="currentColor" />
                    </svg>
                    Filter
                </button>
            </motion.div>

            {/* Filter Panel */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{
                            background: 'rgba(0,0,0,0.8)',
                            backdropFilter: 'blur(12px)',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            marginBottom: '2rem',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}
                    >
                        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <button
                                onClick={() => onFilterChange('type', '')}
                                style={{
                                    background: !filters.type ? 'var(--color-gold)' : 'rgba(255,255,255,0.1)',
                                    color: !filters.type ? 'black' : 'white',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '20px',
                                    padding: '0.5rem 1rem',
                                    fontSize: '0.8rem',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                ALL
                            </button>
                            {['Penthouse', 'Villa', 'Estate', 'Loft', 'Residence'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => onFilterChange('type', type)}
                                    style={{
                                        background: filters.type === type ? 'var(--color-gold)' : 'rgba(255,255,255,0.1)',
                                        color: filters.type === type ? 'black' : 'white',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: '20px',
                                        padding: '0.5rem 1rem',
                                        fontSize: '0.8rem',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {type.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ marginBottom: '2rem' }}
            >
                <h2 className="section-heading">Browse Properties</h2>
                <p className="subheading">Swipe to explore our exclusive listings</p>
            </motion.div>

            {/* Property counter with elegant styling */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                    color: 'var(--color-gold)',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    marginBottom: '2rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase'
                }}
            >
                {((currentIndex % filteredProperties.length) + 1)} of {filteredProperties.length}
            </motion.div>

            {/* Swipe deck container with optimized cards */}
            <div className="swipe-deck" style={{ contain: 'layout' }}>
                <AnimatePresence mode="popLayout">
                    {/* Third card (deepest background) */}
                    {thirdProperty && (
                        <PropertyCard
                            key={`third-${currentIndex + 2}`}
                            property={thirdProperty}
                            scale={0.88}
                            opacity={0.4}
                            zIndex={0}
                            yOffset={8}
                            onPropertyClick={onPropertyClick}
                        />
                    )}

                    {/* Second card (background) */}
                    {nextProperty && (
                        <PropertyCard
                            key={`next-${currentIndex + 1}`}
                            property={nextProperty}
                            scale={0.95}
                            opacity={0.7}
                            zIndex={1}
                            yOffset={4}
                            onPropertyClick={onPropertyClick}
                        />
                    )}

                    {/* Current card (draggable foreground) */}
                    <PropertyCard
                        key={`current-${currentIndex}`}
                        property={currentProperty}
                        isActive={true}
                        scale={1}
                        opacity={cardOpacity}
                        zIndex={10}
                        x={x}
                        rotate={rotate}
                        onDragEnd={handleDragEnd}
                        onPropertyClick={onPropertyClick}
                    />
                </AnimatePresence>
            </div>

            {/* Enhanced instructions */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                style={{
                    marginTop: '2rem',
                    color: 'var(--color-neutral-500)',
                    fontSize: '0.8rem',
                    letterSpacing: '0.1em',
                    textAlign: 'center'
                }}
            >
                Swipe to browse through properties
            </motion.div>
        </div>
    );
});

SimpleSwipeProperties.displayName = 'SimpleSwipeProperties';
export default SimpleSwipeProperties;
