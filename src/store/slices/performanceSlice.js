import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
    // Performance metrics
    metrics: {
        loadTime: null,
        firstContentfulPaint: null,
        largestContentfulPaint: null,
        cumulativeLayoutShift: null,
        firstInputDelay: null,
        timeToInteractive: null,
    },

    // Custom timing marks
    marks: {},

    // Image cache statistics
    imageCache: {
        totalImages: 0,
        cachedImages: 0,
        preloadedImages: 0,
        failedImages: 0,
        totalSize: 0, // in bytes
        hitRate: 0,
    },

    // Component performance
    componentTiming: {},

    // Memory usage (if available)
    memory: {
        used: null,
        total: null,
        limit: null,
    },

    // Network information
    network: {
        effectiveType: '4g',
        downlink: null,
        rtt: null,
        saveData: false,
    },

    // Performance warnings
    warnings: [],

    // Optimization suggestions
    suggestions: [],
};

export const performanceSlice = createSlice({
    name: 'performance',
    initialState,
    reducers: {
        // Core Web Vitals
        updateMetrics: (state, action) => {
            state.metrics = { ...state.metrics, ...action.payload };
        },

        setMetric: (state, action) => {
            const { name, value } = action.payload;
            state.metrics[name] = value;
        },

        // Performance marks
        markStart: (state, action) => {
            const markName = action.payload;
            state.marks[markName] = {
                startTime: performance.now(),
                endTime: null,
                duration: null,
            };
        },

        markEnd: (state, action) => {
            const markName = action.payload;
            if (state.marks[markName]) {
                const endTime = performance.now();
                state.marks[markName].endTime = endTime;
                state.marks[markName].duration = endTime - state.marks[markName].startTime;
            }
        },

        // Image cache stats
        updateImageCacheStats: (state, action) => {
            state.imageCache = { ...state.imageCache, ...action.payload };
        },

        incrementImageCount: (state, action) => {
            const { type, size = 0 } = action.payload;
            state.imageCache.totalImages++;
            state.imageCache.totalSize += size;

            if (type === 'cached') {
                state.imageCache.cachedImages++;
            } else if (type === 'preloaded') {
                state.imageCache.preloadedImages++;
            } else if (type === 'failed') {
                state.imageCache.failedImages++;
            }

            // Recalculate hit rate
            if (state.imageCache.totalImages > 0) {
                state.imageCache.hitRate =
                    (state.imageCache.cachedImages + state.imageCache.preloadedImages) /
                    state.imageCache.totalImages;
            }
        },

        // Component timing
        recordComponentTiming: (state, action) => {
            const { component, operation, duration } = action.payload;

            if (!state.componentTiming[component]) {
                state.componentTiming[component] = {};
            }

            if (!state.componentTiming[component][operation]) {
                state.componentTiming[component][operation] = {
                    count: 0,
                    totalDuration: 0,
                    avgDuration: 0,
                    maxDuration: 0,
                    minDuration: Infinity,
                };
            }

            const timing = state.componentTiming[component][operation];
            timing.count++;
            timing.totalDuration += duration;
            timing.avgDuration = timing.totalDuration / timing.count;
            timing.maxDuration = Math.max(timing.maxDuration, duration);
            timing.minDuration = Math.min(timing.minDuration, duration);
        },

        // Memory usage
        updateMemoryUsage: (state, action) => {
            state.memory = { ...state.memory, ...action.payload };
        },

        // Network information
        updateNetworkInfo: (state, action) => {
            state.network = { ...state.network, ...action.payload };
        },

        // Performance warnings
        addWarning: (state, action) => {
            const warning = {
                id: Date.now() + Math.random(),
                timestamp: Date.now(),
                ...action.payload,
            };
            state.warnings.push(warning);

            // Keep only last 50 warnings
            if (state.warnings.length > 50) {
                state.warnings = state.warnings.slice(-50);
            }
        },

        clearWarnings: (state) => {
            state.warnings = [];
        },

        // Optimization suggestions
        addSuggestion: (state, action) => {
            const suggestion = {
                id: Date.now() + Math.random(),
                timestamp: Date.now(),
                ...action.payload,
            };

            // Avoid duplicate suggestions
            const exists = state.suggestions.some(s => s.type === suggestion.type);
            if (!exists) {
                state.suggestions.push(suggestion);
            }
        },

        clearSuggestions: (state) => {
            state.suggestions = [];
        },

        dismissSuggestion: (state, action) => {
            const suggestionId = action.payload;
            state.suggestions = state.suggestions.filter(s => s.id !== suggestionId);
        },

        // Initialize performance monitoring
        initializePerformanceMonitoring: (state) => {
            // Capture initial network info
            if (typeof navigator !== 'undefined') {
                const conn = navigator.connection || navigator.webkitConnection || navigator.mozConnection;
                if (conn) {
                    state.network = {
                        effectiveType: conn.effectiveType || '4g',
                        downlink: conn.downlink || null,
                        rtt: conn.rtt || null,
                        saveData: conn.saveData || false,
                    };
                }

                // Capture memory info if available
                if (navigator.deviceMemory) {
                    state.memory.total = navigator.deviceMemory * 1024 * 1024 * 1024; // Convert GB to bytes
                }

                if (performance.memory) {
                    state.memory.used = performance.memory.usedJSHeapSize;
                    state.memory.total = performance.memory.totalJSHeapSize;
                    state.memory.limit = performance.memory.jsHeapSizeLimit;
                }
            }
        },
    },
});

// Action creators
export const {
    updateMetrics,
    setMetric,
    markStart,
    markEnd,
    updateImageCacheStats,
    incrementImageCount,
    recordComponentTiming,
    updateMemoryUsage,
    updateNetworkInfo,
    addWarning,
    clearWarnings,
    addSuggestion,
    clearSuggestions,
    dismissSuggestion,
    initializePerformanceMonitoring,
} = performanceSlice.actions;

// Selectors
export const selectMetrics = (state) => state.performance.metrics;
export const selectMarks = (state) => state.performance.marks;
export const selectImageCacheStats = (state) => state.performance.imageCache;
export const selectComponentTiming = (state) => state.performance.componentTiming;
export const selectMemoryUsage = (state) => state.performance.memory;
export const selectNetworkInfo = (state) => state.performance.network;
export const selectWarnings = (state) => state.performance.warnings;
export const selectSuggestions = (state) => state.performance.suggestions;

// Complex selectors
export const selectPerformanceScore = createSelector(
    [selectMetrics, selectImageCacheStats],
    (metrics, imageCache) => {
        let score = 100;

        // Deduct for slow LCP
        if (metrics.largestContentfulPaint > 2500) score -= 20;
        else if (metrics.largestContentfulPaint > 1200) score -= 10;

        // Deduct for high CLS
        if (metrics.cumulativeLayoutShift > 0.25) score -= 15;
        else if (metrics.cumulativeLayoutShift > 0.1) score -= 8;

        // Deduct for slow FID
        if (metrics.firstInputDelay > 300) score -= 15;
        else if (metrics.firstInputDelay > 100) score -= 8;

        // Bonus for good cache hit rate
        if (imageCache.hitRate > 0.9) score += 5;
        else if (imageCache.hitRate > 0.7) score += 3;

        return Math.max(0, Math.min(100, score));
    }
);

export const selectSlowMarks = createSelector(
    [selectMarks],
    (marks) => {
        return Object.entries(marks)
            .filter(([name, data]) => data.duration > 100) // Slower than 100ms
            .map(([name, data]) => ({ name, ...data }))
            .sort((a, b) => b.duration - a.duration);
    }
);

export const selectMemoryUsagePercentage = createSelector(
    [selectMemoryUsage],
    (memory) => {
        if (!memory.used || !memory.total) return null;
        return (memory.used / memory.total) * 100;
    }
);

export const selectCriticalWarnings = createSelector(
    [selectWarnings],
    (warnings) => warnings.filter(w => w.level === 'critical')
);

export default performanceSlice.reducer;
