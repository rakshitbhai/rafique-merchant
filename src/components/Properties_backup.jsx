import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { easings, useScrollAnimation } from '../hooks/useAdvancedAnimations';

const mockProperties = [
    {
        id: 1,
        title: 'Skyline Penthouse',
        location: 'Downtown Core',
        price: 5400000,
        type: 'Penthouse',
        bedrooms: 4,
        bathrooms: 5,
        area: '4,200',
        image: 'https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=1200&q=80'
    },
    {
        id: 2,
        title: 'Coastal Glass Villa',
        location: 'Azure Coast',
        price: 8700000,
        type: 'Villa',
        bedrooms: 6,
        bathrooms: 7,
        area: '8,500',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    },
    {
        id: 3,
        title: 'Modern Heritage Estate',
        location: 'Old Ridge',
        price: 12500000,
        type: 'Estate',
        bedrooms: 8,
        bathrooms: 10,
        area: '12,400',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    },
    {
        id: 4,
        title: 'Lakeview Retreat',
        location: 'Emerald Lake',
        price: 4600000,
        type: 'Villa',
        bedrooms: 5,
        bathrooms: 6,
        area: '6,800',
        image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80'
    },
    {
        id: 5,
        title: 'Urban Luxe Loft',
        location: 'Arts District',
        price: 2100000,
        type: 'Loft',
        bedrooms: 2,
        bathrooms: 3,
        area: '2,800',
        image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80'
    },
    {
        id: 6,
        title: 'Desert Horizon Residence',
        location: 'Sunspire Dunes',
        price: 6900000,
        type: 'Residence',
        bedrooms: 5,
        bathrooms: 7,
        area: '7,200',
        image: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=1200&q=80'
    }
];

const formatPrice = (n) => '$' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const Properties = () => {
    const [selectedType, setSelectedType] = useState('All');
    const [sortBy, setSortBy] = useState('featured');
    const { ref, controls } = useScrollAnimation(0.15);
    const sectionRef = useRef(null);

    const propertyTypes = ['All', 'Penthouse', 'Villa', 'Estate', 'Loft', 'Residence']; const filteredProperties = useMemo(() => {
        let filtered = selectedType === 'All'
            ? mockProperties
            : mockProperties.filter(property => property.type === selectedType);

        if (sortBy === 'price-low') {
            filtered = [...filtered].sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
            filtered = [...filtered].sort((a, b) => b.price - a.price);
        }

        return filtered;
    }, [selectedType, sortBy]);

    const containerVariants = {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.2,
                duration: 0.6,
                ease: [0.25, 0.4, 0.25, 1]
            }
        }
    };

    const titleVariants = {
        initial: { opacity: 0, y: 20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.4, 0.25, 1]
            }
        }
    };

    const filterVariants = {
        initial: { opacity: 0, y: 15 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.4, 0.25, 1],
                delay: 0.3
            }
        }
    };

    return (
        <section id="portfolio" className="featured-portfolio" ref={sectionRef}>
            <motion.div
                className="container"
                ref={ref}
                initial="initial"
                animate={controls}
                variants={containerVariants}
            >
                {/* Section Header */}
                <motion.div className="section-header" variants={titleVariants}>
                    <h2 className="section-title">Featured Portfolio</h2>
                    <p className="section-subtitle">
                        Exclusive collection of premium properties showcasing architectural excellence
                        and unparalleled luxury living experiences.
                    </p>
                </motion.div>

                {/* Filter Controls */}
                <motion.div className="filter-controls" variants={filterVariants}>
                    <div className="property-types">
                        {propertyTypes.map((type) => (
                            <motion.button
                                key={type}
                                className={`type-filter ${selectedType === type ? 'active' : ''}`}
                                onClick={() => setSelectedType(type)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ duration: 0.2 }}
                            >
                                {type}
                            </motion.button>
                        ))}
                    </div>

                    <div className="sort-dropdown">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="sort-select"
                        >
                            <option value="featured">Featured</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="price-low">Price: Low to High</option>
                        </select>
                    </div>
                </motion.div>

                {/* Properties Grid */}
                <motion.div className="properties-grid" layout>
                    <AnimatePresence mode="popLayout">
                        {filteredProperties.map((property, index) => (
                            <PropertyCard
                                key={property.id}
                                property={property}
                                index={index}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </section>
    );
};

const PropertyCard = ({ property, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef(null);

    // Check if device supports hover (desktop) for performance optimization
    const supportsHover = window.matchMedia('(hover: hover)').matches;

    // Subtle parallax only for desktop - professional look
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "end start"]
    });

    const imageY = useTransform(scrollYProgress, [0, 1], supportsHover ? [10, -10] : [0, 0]);

    const cardVariants = {
        initial: {
            opacity: 0,
            y: 30,
            scale: 0.98
        },
        animate: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.4, 0.25, 1],
                delay: index * 0.05
            }
        }
    };

    return (
        <motion.div
            ref={cardRef}
            className="property-card"
            variants={cardVariants}
            initial="initial"
            animate="animate"
            layout
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{
                y: -2,
                transition: { duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }
            }}
        >
            {/* Property Image */}
            <div className="card-image-container">
                <motion.img
                    src={property.image}
                    alt={property.title}
                    className="card-image"
                    style={{
                        y: imageY
                    }}
                    animate={{
                        scale: isHovered ? 1.01 : 1,
                        filter: isHovered ? 'brightness(1.02) saturate(1.02)' : 'brightness(1) saturate(1)'
                    }}
                    transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
                />

                <motion.div
                    className="card-overlay"
                    animate={{
                        opacity: isHovered ? 0.7 : 0.5
                    }}
                    transition={{ duration: 0.3 }}
                />

                <div className="property-badge">
                    <span>{property.type}</span>
                </div>
            </div>

            {/* Property Details */}
            <motion.div
                className="card-content"
                animate={{
                    y: isHovered ? -2 : 0
                }}
                transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
            >
                <div className="property-info">
                    <h3 className="property-title">{property.title}</h3>
                    <p className="property-location">{property.location}</p>
                </div>

                <div className="property-price">
                    {formatPrice(property.price)}
                </div>

                <div className="property-specs">
                    <span className="spec-item">{property.bedrooms} BD</span>
                    <span className="spec-divider">•</span>
                    <span className="spec-item">{property.bathrooms} BA</span>
                    <span className="spec-divider">•</span>
                    <span className="spec-item">{property.area} SF</span>
                </div>

                <motion.button
                    className="view-details-btn"
                    animate={{
                        opacity: isHovered ? 1 : 0,
                        y: isHovered ? 0 : 10
                    }}
                    transition={{ duration: 0.3, ease: easings.refined }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    View Details
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

export default Properties;
