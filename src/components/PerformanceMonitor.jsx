import React, { useEffect, useState } from 'react';
import { imageCache, performanceMonitor } from '../utils/imageCache';

/**
 * Development-only performance monitoring component
 * Shows cache statistics and performance metrics
 */
const PerformanceMonitor = ({ enabled = false }) => {
    const [stats, setStats] = useState({});
    const [metrics, setMetrics] = useState({});
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!enabled) return;

        const updateStats = () => {
            setStats(imageCache.getStats());
            setMetrics(performanceMonitor.getMetrics());
        };

        updateStats();
        const interval = setInterval(updateStats, 2000);

        // Show on Ctrl+Alt+P
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.altKey && e.key === 'p') {
                e.preventDefault();
                setIsVisible(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            clearInterval(interval);
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
                🚀 Performance Monitor
            </div>

            <div style={{ marginBottom: '6px' }}>
                <strong>Image Cache:</strong>
            </div>
            <div>Cache Size: {stats.cacheSize || 0}</div>
            <div>Loaded Images: {stats.loadedCount || 0}</div>
            <div>Cache Hit Rate: {((stats.hitRate || 0) * 100).toFixed(1)}%</div>
            <div>Preloaded: {stats.preloaded || 0}</div>

            <div style={{ marginTop: '8px', marginBottom: '6px' }}>
                <strong>Metrics:</strong>
            </div>
            {Object.entries(metrics).map(([name, duration]) => (
                <div key={name}>
                    {name}: {duration.toFixed(1)}ms
                </div>
            ))}

            <div style={{ marginTop: '8px', fontSize: '10px', opacity: 0.7 }}>
                Press Ctrl+Alt+P to toggle
            </div>
        </div>
    );
};

export default PerformanceMonitor;
