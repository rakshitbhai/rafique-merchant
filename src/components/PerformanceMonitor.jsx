import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    selectMetrics,
    selectImageCacheStats,
    selectPerformanceScore,
    selectSlowMarks,
    selectCriticalWarnings
} from '../store/slices/performanceSlice';

/**
 * Development-only performance monitoring component
 * Shows cache statistics and performance metrics from Redux store
 */
const PerformanceMonitor = ({ enabled = false }) => {
    const [isVisible, setIsVisible] = useState(false);

    // Get performance data from Redux store
    const metrics = useSelector(selectMetrics);
    const imageCache = useSelector(selectImageCacheStats);
    const performanceScore = useSelector(selectPerformanceScore);
    const slowMarks = useSelector(selectSlowMarks);
    const criticalWarnings = useSelector(selectCriticalWarnings);

    useEffect(() => {
        if (!enabled) return;

        // Show on Ctrl+Alt+P
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.altKey && e.key === 'p') {
                e.preventDefault();
                setIsVisible(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [enabled]);

    if (!enabled || !isVisible) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 10,
                right: 10,
                background: 'rgba(0, 0, 0, 0.9)',
                color: 'white',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '11px',
                fontFamily: 'monospace',
                zIndex: 10000,
                maxWidth: '300px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
        >
            <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>
                🚀 Performance Monitor (Score: {performanceScore}/100)
            </div>

            <div style={{ marginBottom: '6px' }}>
                <strong>Image Cache:</strong>
            </div>
            <div>Total Images: {imageCache.totalImages}</div>
            <div>Cached: {imageCache.cachedImages}</div>
            <div>Cache Hit Rate: {(imageCache.hitRate * 100).toFixed(1)}%</div>
            <div>Preloaded: {imageCache.preloadedImages}</div>

            <div style={{ marginTop: '8px', marginBottom: '6px' }}>
                <strong>Core Web Vitals:</strong>
            </div>
            <div>LCP: {metrics.largestContentfulPaint ? `${metrics.largestContentfulPaint.toFixed(0)}ms` : 'N/A'}</div>
            <div>FID: {metrics.firstInputDelay ? `${metrics.firstInputDelay.toFixed(0)}ms` : 'N/A'}</div>
            <div>CLS: {metrics.cumulativeLayoutShift ? metrics.cumulativeLayoutShift.toFixed(3) : 'N/A'}</div>

            {slowMarks.length > 0 && (
                <>
                    <div style={{ marginTop: '8px', marginBottom: '6px' }}>
                        <strong>Slow Operations:</strong>
                    </div>
                    {slowMarks.slice(0, 3).map(mark => (
                        <div key={mark.name}>{mark.name}: {mark.duration?.toFixed(1)}ms</div>
                    ))}
                </>
            )}

            {criticalWarnings.length > 0 && (
                <>
                    <div style={{ marginTop: '8px', marginBottom: '6px', color: '#ff6b6b' }}>
                        <strong>⚠️ Critical Issues:</strong>
                    </div>
                    {criticalWarnings.slice(0, 2).map(warning => (
                        <div key={warning.id} style={{ color: '#ff6b6b' }}>
                            {warning.message}
                        </div>
                    ))}
                </>
            )}

            <div style={{ marginTop: '8px', fontSize: '10px', opacity: 0.7 }}>
                Press Ctrl+Alt+P to toggle • Redux-powered
            </div>
        </div>
    );
};

export default PerformanceMonitor;
