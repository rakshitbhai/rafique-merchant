import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializePerformanceMonitoring } from '../store/slices/performanceSlice';
import { detectDeviceCapabilities } from '../store/slices/userPreferencesSlice';

/**
 * Redux Performance Initializer
 * Sets up performance monitoring and device detection when the app starts
 */
const ReduxPerformanceInitializer = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        // Initialize performance monitoring
        dispatch(initializePerformanceMonitoring());

        // Detect device capabilities
        dispatch(detectDeviceCapabilities());

        // Listen for Web Vitals
        if ('web-vitals' in window) {
            // If web-vitals library is loaded, connect it to Redux
            import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
                getCLS((metric) => {
                    dispatch({
                        type: 'performance/setMetric',
                        payload: { name: 'cumulativeLayoutShift', value: metric.value }
                    });
                });

                getFID((metric) => {
                    dispatch({
                        type: 'performance/setMetric',
                        payload: { name: 'firstInputDelay', value: metric.value }
                    });
                });

                getFCP((metric) => {
                    dispatch({
                        type: 'performance/setMetric',
                        payload: { name: 'firstContentfulPaint', value: metric.value }
                    });
                });

                getLCP((metric) => {
                    dispatch({
                        type: 'performance/setMetric',
                        payload: { name: 'largestContentfulPaint', value: metric.value }
                    });
                });

                getTTFB((metric) => {
                    dispatch({
                        type: 'performance/setMetric',
                        payload: { name: 'timeToFirstByte', value: metric.value }
                    });
                });
            }).catch(console.warn);
        }

        // Monitor memory usage periodically (if available)
        if (performance.memory) {
            const updateMemory = () => {
                dispatch({
                    type: 'performance/updateMemoryUsage',
                    payload: {
                        used: performance.memory.usedJSHeapSize,
                        total: performance.memory.totalJSHeapSize,
                        limit: performance.memory.jsHeapSizeLimit,
                    }
                });
            };

            // Update immediately and then every 10 seconds
            updateMemory();
            const interval = setInterval(updateMemory, 10000);

            return () => clearInterval(interval);
        }
    }, [dispatch]);

    // This component doesn't render anything
    return null;
};

export default ReduxPerformanceInitializer;
