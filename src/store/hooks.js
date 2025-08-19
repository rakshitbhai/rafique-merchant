import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMemo, useCallback } from 'react';
import {
    selectFilteredProperties,
    selectFeaturedProperties,
    selectRegularProperties,
    selectPropertyStatistics,
    selectSearchSuggestions,
    selectPropertiesForComparison,
    setFilter,
    setAdvancedFilter,
    clearFilters,
    setViewMode,
    addToComparison,
    removeFromComparison,
    clearComparison,
    saveSearch,
} from './slices/propertiesSlice';

// Custom hooks for optimized Redux usage

// Enhanced Properties hooks with advanced features
export const useProperties = () => {
    const dispatch = useDispatch();
    const properties = useSelector(state => state.properties.properties);
    const filteredProperties = useSelector(selectFilteredProperties);
    const featuredProperties = useSelector(selectFeaturedProperties);
    const regularProperties = useSelector(selectRegularProperties);
    const statistics = useSelector(selectPropertyStatistics);
    const filters = useSelector(state => state.properties.filters);
    const viewMode = useSelector(state => state.properties.viewMode);
    const selectedProperty = useSelector(state => state.properties.selectedProperty);
    const searchSuggestions = useSelector(selectSearchSuggestions);
    const comparisonList = useSelector(selectPropertiesForComparison);
    const pagination = useSelector(state => state.properties.pagination);
    const loading = useSelector(state => state.properties.loading);

    const actions = useMemo(() => ({
        setFilter: (filterType, value) => dispatch(setFilter({ filterType, value })),
        setAdvancedFilter: (filters) => dispatch(setAdvancedFilter(filters)),
        clearFilters: () => dispatch(clearFilters()),
        setViewMode: (mode) => dispatch(setViewMode(mode)),
        addToComparison: (propertyId) => dispatch(addToComparison(propertyId)),
        removeFromComparison: (propertyId) => dispatch(removeFromComparison(propertyId)),
        clearComparison: () => dispatch(clearComparison()),
        saveSearch: (searchConfig) => dispatch(saveSearch(searchConfig)),
    }), [dispatch]);

    return {
        properties,
        filteredProperties,
        featuredProperties,
        regularProperties,
        statistics,
        filters,
        viewMode,
        selectedProperty,
        searchSuggestions,
        comparisonList,
        pagination,
        loading,
        actions,
    };
};

export const useFilteredProperties = () => {
    return useSelector(selectFilteredProperties);
};

export const usePropertyStats = () => {
    return useSelector(selectPropertyStatistics);
};

// Enhanced search hook with debouncing
export const useEnhancedSearch = (delay = 300) => {
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedTerm, setDebouncedTerm] = useState('');
    const searchSuggestions = useSelector(selectSearchSuggestions);
    const searchHistory = useSelector(state => state.properties.searchHistory);

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, delay);

        return () => clearTimeout(timer);
    }, [searchTerm, delay]);

    // Update Redux filter when debounced term changes
    useEffect(() => {
        dispatch(setFilter({ filterType: 'query', value: debouncedTerm }));
    }, [debouncedTerm, dispatch]);

    const handleSearch = useCallback((term) => {
        setSearchTerm(term);
    }, []);

    return {
        searchTerm,
        debouncedTerm,
        searchSuggestions,
        searchHistory,
        handleSearch,
    };
};

// Virtual scrolling hook for large datasets
export const useVirtualProperties = (itemHeight = 400, containerHeight = 800) => {
    const [scrollTop, setScrollTop] = useState(0);
    const filteredProperties = useSelector(selectFilteredProperties);

    const visibleRange = useMemo(() => {
        const startIndex = Math.floor(scrollTop / itemHeight);
        const endIndex = Math.min(
            startIndex + Math.ceil(containerHeight / itemHeight) + 1,
            filteredProperties.length
        );
        return { startIndex, endIndex };
    }, [scrollTop, itemHeight, containerHeight, filteredProperties.length]);

    const visibleProperties = useMemo(() => {
        return filteredProperties.slice(visibleRange.startIndex, visibleRange.endIndex);
    }, [filteredProperties, visibleRange]);

    const totalHeight = filteredProperties.length * itemHeight;
    const offsetY = visibleRange.startIndex * itemHeight;

    return {
        visibleProperties,
        totalHeight,
        offsetY,
        onScroll: setScrollTop,
        visibleRange,
    };
};



// UI hooks
export const useNavbar = () => {
    const navbar = useSelector(state => state.ui.navbar);
    const dispatch = useDispatch();

    const actions = useMemo(() => ({
        setScrolled: (scrolled) => dispatch({ type: 'ui/setScrolled', payload: scrolled }),
        setActiveSection: (section) => dispatch({ type: 'ui/setActiveSection', payload: section }),
        toggleMobileMenu: () => dispatch({ type: 'ui/toggleMobileMenu' }),
        closeMobileMenu: () => dispatch({ type: 'ui/closeMobileMenu' }),
    }), [dispatch]);

    return { navbar, ...actions };
};

export const useModals = () => {
    const modals = useSelector(state => state.ui.modals);
    const dispatch = useDispatch();

    const actions = useMemo(() => ({
        openPropertyModal: (propertyId) =>
            dispatch({ type: 'ui/openPropertyModal', payload: propertyId }),
        closePropertyModal: () =>
            dispatch({ type: 'ui/closePropertyModal' }),
    }), [dispatch]);

    return { modals, ...actions };
};

export const useLoading = () => {
    const loading = useSelector(state => state.ui.loading);
    const dispatch = useDispatch();

    const setLoading = useCallback((component, isLoading) => {
        dispatch({
            type: 'ui/setLoading',
            payload: { component, isLoading }
        });
    }, [dispatch]);

    return { loading, setLoading };
};

// Contact form hooks
export const useContactForm = () => {
    const formData = useSelector(state => state.contact.formData);
    const errors = useSelector(state => state.contact.errors);
    const isSubmitting = useSelector(state => state.contact.isSubmitting);
    const isSubmitted = useSelector(state => state.contact.isSubmitted);
    const dispatch = useDispatch();

    const actions = useMemo(() => ({
        updateField: (field, value) =>
            dispatch({ type: 'contact/updateFormField', payload: { field, value } }),

        setErrors: (errors) =>
            dispatch({ type: 'contact/setErrors', payload: errors }),

        validateForm: () =>
            dispatch({ type: 'contact/validateForm' }),

        setSubmitting: (submitting) =>
            dispatch({ type: 'contact/setSubmitting', payload: submitting }),

        setSubmitted: (submitted) =>
            dispatch({ type: 'contact/setSubmitted', payload: submitted }),

        resetForm: () =>
            dispatch({ type: 'contact/resetForm' }),
    }), [dispatch]);

    const isValid = useMemo(() => {
        const hasErrors = Object.keys(errors).length > 0;
        const hasRequiredFields = !!(
            formData.name?.trim() &&
            formData.email?.trim() &&
            formData.message?.trim()
        );
        return !hasErrors && hasRequiredFields;
    }, [errors, formData]);

    return {
        formData,
        errors,
        isSubmitting,
        isSubmitted,
        isValid,
        canSubmit: isValid && !isSubmitting,
        ...actions,
    };
};

// User preferences hooks
export const useUserPreferences = () => {
    const preferences = useSelector(state => state.userPreferences);
    const dispatch = useDispatch();

    const actions = useMemo(() => ({
        setPerformancePreference: (key, value) =>
            dispatch({ type: 'userPreferences/setPerformancePreference', payload: { key, value } }),

        setVisualPreference: (key, value) =>
            dispatch({ type: 'userPreferences/setVisualPreference', payload: { key, value } }),

        detectDeviceCapabilities: () =>
            dispatch({ type: 'userPreferences/detectDeviceCapabilities' }),

        optimizeForDevice: () =>
            dispatch({ type: 'userPreferences/optimizeForDevice' }),
    }), [dispatch]);

    return { preferences, ...actions };
};

export const useDeviceCapabilities = () => {
    return useSelector(state => {
        const { device, performance } = state.userPreferences;

        return {
            ...device,
            canAutoloadSpline: performance.autoloadSpline && !device.isLowEndDevice && device.hasHighBandwidth,
            shouldPreloadImages: performance.preloadImages && device.hasHighBandwidth && !device.saveData,
            optimalImageFormat: device.supportsAVIF ? 'avif' : device.supportsWebP ? 'webp' : 'jpg',
        };
    });
};

// Performance monitoring hooks
export const usePerformanceMonitoring = () => {
    const performance = useSelector(state => state.performance);
    const dispatch = useDispatch();

    const actions = useMemo(() => ({
        markStart: (name) => dispatch({ type: 'performance/markStart', payload: name }),
        markEnd: (name) => dispatch({ type: 'performance/markEnd', payload: name }),

        recordTiming: (component, operation, duration) =>
            dispatch({
                type: 'performance/recordComponentTiming',
                payload: { component, operation, duration }
            }),

        addWarning: (warning) => dispatch({ type: 'performance/addWarning', payload: warning }),

        updateImageStats: (stats) =>
            dispatch({ type: 'performance/updateImageCacheStats', payload: stats }),
    }), [dispatch]);

    return { performance, ...actions };
};

// Optimized selector hook for specific property by ID
export const usePropertyById = (id) => {
    return useSelector(state =>
        state.properties.properties.find(p => p.id === id) || null
    );
};

// Hero 3D state hook
export const useHero3D = () => {
    const hero = useSelector(state => state.ui.hero);
    const canAutoload = useSelector(state => {
        const { performance, device } = state.userPreferences;
        return performance.autoloadSpline && !device.isLowEndDevice && device.hasHighBandwidth;
    });
    const dispatch = useDispatch();

    const actions = useMemo(() => ({
        setSplineLoaded: (loaded) =>
            dispatch({ type: 'ui/setSplineLoaded', payload: loaded }),
        setSplineFailed: (failed) =>
            dispatch({ type: 'ui/setSplineFailed', payload: failed }),
        setAllowSpline: (allow) =>
            dispatch({ type: 'ui/setAllowSpline', payload: allow }),
        setMountSpline: (mount) =>
            dispatch({ type: 'ui/setMountSpline', payload: mount }),
        setUserEnabledSpline: (enabled) =>
            dispatch({ type: 'ui/setUserEnabledSpline', payload: enabled }),
    }), [dispatch]);

    return { ...hero, canAutoload, ...actions };
};

// Responsive design hook
export const useResponsive = () => {
    const responsive = useSelector(state => state.ui.responsive);
    const dispatch = useDispatch();

    const updateViewport = useCallback(() => {
        if (typeof window !== 'undefined') {
            dispatch({ type: 'ui/updateViewportSize' });
        }
    }, [dispatch]);

    return { ...responsive, updateViewport };
};
