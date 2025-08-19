import React from 'react';
import { motion } from 'framer-motion';

/**
 * Performance-optimized motion component that preserves beautiful animations
 * while using GPU-friendly optimizations and smart performance hints.
 */
const OptimizedMotion = React.memo(({
    x = 0,
    y = 0,
    scale = 1,
    opacity = 1,
    blur = 0,
    transition = {
        type: "spring",
        stiffness: 200,
        damping: 20
    },
    className = "",
    children,
    initial,
    animate,
    exit,
    variants,
    whileInView,
    viewport,
    useWillChange = false, // opt-in to will-change to avoid memory bloat
    ...restProps
}) => {
    // Create optimized initial state
    const initialState = initial || {
        x,
        y,
        scale,
        opacity,
        ...(blur > 0 && { filter: `blur(${blur}px)` })
    };

    // Create optimized animate state  
    const animateState = animate || {
        x,
        y,
        scale,
        opacity,
        ...(blur > 0 ? { filter: `blur(0px)` } : {})
    };

    return (
        <motion.div
            className={className}
            initial={initialState}
            animate={animateState}
            exit={exit}
            variants={variants}
            whileInView={whileInView}
            viewport={viewport}
            transition={transition}
            style={{
                backfaceVisibility: "hidden",
                perspective: 1000,
                transform: "translate3d(0,0,0)", // Force GPU layer
                ...(useWillChange ? { willChange: `transform${blur > 0 ? ', filter' : ''}` } : {})
            }}
            {...restProps}
        >
            {children}
        </motion.div>
    );
});

// Set display name for better debugging experience
OptimizedMotion.displayName = 'OptimizedMotion';

export default OptimizedMotion;
