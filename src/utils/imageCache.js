/**
 * Advanced Image Caching and URL Management System
 * Prevents duplicate network requests and optimizes image loading performance
 */
import React from 'react';

class ImageCacheManager {
    constructor() {
        this.urlCache = new Map();
        this.loadedImages = new Set();
        this.preloadQueue = new Set();
        this.loadingPromises = new Map();

        // Performance tracking
        this.stats = {
            cacheHits: 0,
            cacheMisses: 0,
            preloaded: 0
        };
    }

    /**
     * Generate optimized image URLs with caching
     */
    getImageUrls(baseUrl, options = {}) {
        const cacheKey = `${baseUrl}-${JSON.stringify(options)}`;

        if (this.urlCache.has(cacheKey)) {
            this.stats.cacheHits++;
            return this.urlCache.get(cacheKey);
        }

        const {
            widths = [480, 720, 900, 1400],
            formats = ['avif', 'webp', 'jpg'],
            quality = 70,
            baseParams = 'auto=format&fit=crop'
        } = options;

        const urls = {
            base: `${baseUrl}?w=${widths[2]}&${baseParams}&q=${quality}&fm=jpg`,
            lowQuality: `${baseUrl}?w=80&blur=80&auto=format&q=20`,
            srcSets: {},
            sizes: {
                feature: '(min-width: 1100px) 560px, (min-width:640px) 50vw, 100vw',
                card: '(min-width:900px) 320px, (min-width:640px) 33vw, 100vw',
                modal: '(min-width: 1200px) 1200px, 100vw'
            }
        };

        // Generate srcSets for each format
        formats.forEach(format => {
            urls.srcSets[format] = widths
                .map(w => `${baseUrl}?w=${w}&${baseParams}&q=${quality}&fm=${format} ${w}w`)
                .join(', ');
        });

        this.urlCache.set(cacheKey, urls);
        this.stats.cacheMisses++;
        return urls;
    }

    /**
     * Preload critical images to prevent loading delays
     */
    async preloadImage(url, priority = 'low') {
        if (this.loadedImages.has(url) || this.preloadQueue.has(url)) {
            return Promise.resolve();
        }

        if (this.loadingPromises.has(url)) {
            return this.loadingPromises.get(url);
        }

        this.preloadQueue.add(url);

        const loadPromise = new Promise((resolve, reject) => {
            const img = new Image();

            // Set loading priority for modern browsers
            if ('loading' in img) {
                img.loading = 'lazy';
            }
            if ('fetchPriority' in img) {
                img.fetchPriority = priority;
            }

            img.onload = () => {
                this.loadedImages.add(url);
                this.preloadQueue.delete(url);
                this.loadingPromises.delete(url);
                this.stats.preloaded++;
                resolve(img);
            };

            img.onerror = (error) => {
                this.preloadQueue.delete(url);
                this.loadingPromises.delete(url);
                reject(error);
            };

            img.src = url;
        });

        this.loadingPromises.set(url, loadPromise);
        return loadPromise;
    }

    /**
     * Preload next images in sequence for smooth UX
     */
    preloadSequence(urls, startIndex = 0, count = 3) {
        const toPreload = urls.slice(startIndex, startIndex + count);
        return Promise.allSettled(
            toPreload.map(url => this.preloadImage(url, 'high'))
        );
    }

    /**
     * Check if image is already loaded
     */
    isLoaded(url) {
        return this.loadedImages.has(url);
    }

    /**
     * Clear cache (useful for memory management)
     */
    clearCache() {
        this.urlCache.clear();
        this.loadedImages.clear();
        this.preloadQueue.clear();
        this.loadingPromises.clear();
        this.stats = { cacheHits: 0, cacheMisses: 0, preloaded: 0 };
    }

    /**
     * Get cache statistics
     */
    getStats() {
        return {
            ...this.stats,
            cacheSize: this.urlCache.size,
            loadedCount: this.loadedImages.size,
            hitRate: this.stats.cacheHits / (this.stats.cacheHits + this.stats.cacheMisses) || 0
        };
    }
}

// Singleton instance
export const imageCache = new ImageCacheManager();

/**
 * React hook for optimized image loading
 */
export const useOptimizedImage = (baseUrl, options = {}) => {
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [error, setError] = React.useState(null);

    const optionsString = JSON.stringify(options);
    const urls = React.useMemo(() =>
        imageCache.getImageUrls(baseUrl, options),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [baseUrl, optionsString]
    );

    React.useEffect(() => {
        imageCache.preloadImage(urls.base)
            .then(() => setIsLoaded(true))
            .catch(setError);
    }, [urls.base]);

    return { urls, isLoaded, error };
};

/**
 * Performance monitoring utilities
 */
export const performanceMonitor = {
    markStart: (name) => {
        if (typeof performance !== 'undefined') {
            performance.mark(`${name}-start`);
        }
    },

    markEnd: (name) => {
        if (typeof performance !== 'undefined') {
            performance.mark(`${name}-end`);
            try {
                performance.measure(name, `${name}-start`, `${name}-end`);
            } catch (e) {
                // Ignore if marks don't exist
            }
        }
    },

    getMetrics: () => {
        if (typeof performance === 'undefined') return {};

        const entries = performance.getEntriesByType('measure');
        return entries.reduce((acc, entry) => {
            acc[entry.name] = entry.duration;
            return acc;
        }, {});
    }
};

export default imageCache;
