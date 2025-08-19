import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    // Performance preferences
    performance: {
        autoloadSpline: true,
        enableAnimations: true,
        highQualityImages: true,
        preloadImages: true,
        enablePerformanceMonitoring: process.env.NODE_ENV === 'development',
    },

    // Visual preferences
    visual: {
        prefersReducedMotion: false,
        defaultViewMode: 'grid', // 'grid' | 'swipe'
        enableGlassEffects: true,
        enableParallax: true,
    },

    // Device capabilities (auto-detected)
    device: {
        hasHighBandwidth: true,
        isLowEndDevice: false,
        supportsWebP: true,
        supportsAVIF: false,
        hardwareCores: 4,
        deviceMemory: 8,
        effectiveConnectionType: '4g',
        saveData: false,
    },

    // User settings
    settings: {
        autoExpandStats: false,
        rememberFilters: true,
        enableKeyboardNavigation: true,
        contactFormAutofill: true,
    },
};

export const userPreferencesSlice = createSlice({
    name: 'userPreferences',
    initialState,
    reducers: {
        // Performance preferences
        setPerformancePreference: (state, action) => {
            const { key, value } = action.payload;
            if (state.performance.hasOwnProperty(key)) {
                state.performance[key] = value;
            }
        },

        // Visual preferences
        setVisualPreference: (state, action) => {
            const { key, value } = action.payload;
            if (state.visual.hasOwnProperty(key)) {
                state.visual[key] = value;
            }
        },

        // Device capabilities detection
        updateDeviceCapabilities: (state, action) => {
            state.device = { ...state.device, ...action.payload };
        },

        // Auto-detect device capabilities
        detectDeviceCapabilities: (state) => {
            if (typeof navigator !== 'undefined') {
                // Network information
                const conn = navigator.connection || navigator.webkitConnection || navigator.mozConnection;
                if (conn) {
                    state.device.effectiveConnectionType = conn.effectiveType || '4g';
                    state.device.saveData = conn.saveData || false;
                    state.device.hasHighBandwidth = ['4g', 'wifi'].includes(conn.effectiveType);
                }

                // Hardware capabilities
                state.device.hardwareCores = navigator.hardwareConcurrency || 4;
                state.device.deviceMemory = navigator.deviceMemory || 8;

                // Determine if low-end device
                state.device.isLowEndDevice = (
                    state.device.hardwareCores < 4 ||
                    state.device.deviceMemory < 4 ||
                    ['2g', '3g'].includes(state.device.effectiveConnectionType) ||
                    state.device.saveData
                );

                // Image format support
                const canvas = document.createElement('canvas');
                canvas.width = 1;
                canvas.height = 1;
                // const ctx = canvas.getContext('2d'); // For future WebP detection implementation

                // WebP support
                state.device.supportsWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;

                // AVIF support (simplified check)
                state.device.supportsAVIF = false; // More complex check needed for production
            }
        },

        // User settings
        setSetting: (state, action) => {
            const { key, value } = action.payload;
            if (state.settings.hasOwnProperty(key)) {
                state.settings[key] = value;
            }
        },

        // Batch update preferences
        updatePreferences: (state, action) => {
            const { performance, visual, settings } = action.payload;
            if (performance) state.performance = { ...state.performance, ...performance };
            if (visual) state.visual = { ...state.visual, ...visual };
            if (settings) state.settings = { ...state.settings, ...settings };
        },

        // Reset to defaults
        resetPreferences: (state) => {
            state.performance = initialState.performance;
            state.visual = initialState.visual;
            state.settings = initialState.settings;
            // Keep device capabilities as they're auto-detected
        },

        // Optimize preferences for current device
        optimizeForDevice: (state) => {
            if (state.device.isLowEndDevice) {
                state.performance.autoloadSpline = false;
                state.performance.highQualityImages = false;
                state.performance.preloadImages = false;
                state.visual.enableGlassEffects = false;
                state.visual.enableParallax = false;
            }

            if (!state.device.hasHighBandwidth) {
                state.performance.preloadImages = false;
                state.performance.highQualityImages = false;
            }

            if (state.device.saveData) {
                state.performance.autoloadSpline = false;
                state.performance.highQualityImages = false;
                state.performance.preloadImages = false;
                state.performance.enableAnimations = false;
            }
        },
    },
});

// Action creators
export const {
    setPerformancePreference,
    setVisualPreference,
    updateDeviceCapabilities,
    detectDeviceCapabilities,
    setSetting,
    updatePreferences,
    resetPreferences,
    optimizeForDevice,
} = userPreferencesSlice.actions;

// Selectors
export const selectPerformancePreferences = (state) => state.userPreferences.performance;
export const selectVisualPreferences = (state) => state.userPreferences.visual;
export const selectDeviceCapabilities = (state) => state.userPreferences.device;
export const selectUserSettings = (state) => state.userPreferences.settings;

// Computed selectors
export const selectCanAutoloadSpline = (state) => {
    const { performance, device } = state.userPreferences;
    return performance.autoloadSpline && !device.isLowEndDevice && device.hasHighBandwidth;
};

export const selectOptimalImageFormat = (state) => {
    const { device, performance } = state.userPreferences;
    if (!performance.highQualityImages) return 'jpg';
    if (device.supportsAVIF) return 'avif';
    if (device.supportsWebP) return 'webp';
    return 'jpg';
};

export const selectShouldPreloadImages = (state) => {
    const { performance, device } = state.userPreferences;
    return performance.preloadImages && device.hasHighBandwidth && !device.saveData;
};

export default userPreferencesSlice.reducer;
