import { createSlice, createSelector } from '@reduxjs/toolkit';

// Mock properties data - centralized here for consistency
const mockProperties = [
    { id: 1, title: 'Skyline Penthouse', location: 'Downtown Core', price: 5400000, type: 'Penthouse', beds: 4, baths: 5, size: 6200, image: 'https://images.unsplash.com/photo-1502005097973-6a7082348e28', blurb: 'Glass-framed panoramic city vistas with private roof deck and spa.' },
    { id: 2, title: 'Coastal Glass Villa', location: 'Azure Coast', price: 8700000, type: 'Villa', beds: 6, baths: 7, size: 9800, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c', blurb: 'Seamless indoor-outdoor flow, infinity edge pool and ocean horizon.' },
    { id: 3, title: 'Modern Heritage Estate', location: 'Old Ridge', price: 12500000, type: 'Estate', beds: 8, baths: 9, size: 15200, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750', blurb: 'Restored classical detailing integrated with advanced sustainability systems.' },
    { id: 4, title: 'Lakeview Retreat', location: 'Emerald Lake', price: 4600000, type: 'Villa', beds: 5, baths: 5, size: 7200, image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c', blurb: 'Timber-accented serenity with private dock and cantilevered terrace.' },
    { id: 5, title: 'Urban Luxe Loft', location: 'Arts District', price: 2100000, type: 'Loft', beds: 2, baths: 2, size: 2800, image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb', blurb: 'Double-height volume, industrial beams, curated gallery illumination.' },
    { id: 6, title: 'Desert Horizon Residence', location: 'Sunspire Dunes', price: 6900000, type: 'Residence', beds: 5, baths: 6, size: 8400, image: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8', blurb: 'Thermal-mass architecture oriented for passive cooling and sunrise framing.' }
];

const initialState = {
    properties: mockProperties,
    filters: {
        query: '',
        type: '',
        sort: '',
        priceRange: [0, 15000000],
        minBeds: 0,
        minBaths: 0,
    },
    viewMode: 'grid', // 'grid' | 'swipe' | 'masonry'
    selectedProperty: null, // for modal
    swipeIndex: 0, // for swipe deck
    preloadedImages: [], // Changed from Set to Array for serialization
    featuredPropertyIds: [1, 2], // Maintain featured properties
    searchHistory: [],
    savedSearches: [],
    comparisonList: [], // For property comparison
    sortHistory: [],
    viewportSize: { width: 1200, height: 800 },
    pagination: {
        currentPage: 1,
        itemsPerPage: 12,
        totalItems: 0,
    },
    loading: {
        properties: false,
        images: false,
        filters: false,
    },
    cache: {
        filteredResults: {},
        lastFiltersKey: '',
    },
};

export const propertiesSlice = createSlice({
    name: 'properties',
    initialState,
    reducers: {
        setFilter: (state, action) => {
            const { filterType, value } = action.payload;
            state.filters[filterType] = value;
            // Add to search history if it's a query
            if (filterType === 'query' && value && !state.searchHistory.includes(value)) {
                state.searchHistory.unshift(value);
                state.searchHistory = state.searchHistory.slice(0, 10); // Keep last 10 searches
            }
        },
        setAdvancedFilter: (state, action) => {
            const { priceRange, minBeds, minBaths } = action.payload;
            if (priceRange) state.filters.priceRange = priceRange;
            if (minBeds !== undefined) state.filters.minBeds = minBeds;
            if (minBaths !== undefined) state.filters.minBaths = minBaths;
        },
        clearFilters: (state) => {
            state.filters = {
                query: '',
                type: '',
                sort: '',
                priceRange: [0, 15000000],
                minBeds: 0,
                minBaths: 0,
            };
            state.cache = { filteredResults: {}, lastFiltersKey: '' };
        },
        setViewMode: (state, action) => {
            state.viewMode = action.payload;
        },
        setSelectedProperty: (state, action) => {
            state.selectedProperty = action.payload;
        },
        clearSelectedProperty: (state) => {
            state.selectedProperty = null;
        },
        setSwipeIndex: (state, action) => {
            state.swipeIndex = action.payload;
        },
        incrementSwipeIndex: (state) => {
            const filteredLength = state.cache.filteredResults[state.cache.lastFiltersKey]?.length || state.properties.length;
            state.swipeIndex = (state.swipeIndex + 1) % filteredLength;
        },
        addPreloadedImage: (state, action) => {
            const imageUrl = action.payload;
            if (!state.preloadedImages.includes(imageUrl)) {
                state.preloadedImages.push(imageUrl);
            }
        },
        setFeaturedProperties: (state, action) => {
            state.featuredPropertyIds = action.payload;
        },
        addToComparison: (state, action) => {
            const propertyId = action.payload;
            if (!state.comparisonList.includes(propertyId) && state.comparisonList.length < 4) {
                state.comparisonList.push(propertyId);
            }
        },
        removeFromComparison: (state, action) => {
            state.comparisonList = state.comparisonList.filter(id => id !== action.payload);
        },
        clearComparison: (state) => {
            state.comparisonList = [];
        },
        saveSearch: (state, action) => {
            const searchConfig = action.payload;
            const exists = state.savedSearches.find(s => s.name === searchConfig.name);
            if (!exists) {
                state.savedSearches.push({
                    ...searchConfig,
                    id: Date.now(),
                    createdAt: new Date().toISOString(),
                });
            }
        },
        removeSearch: (state, action) => {
            state.savedSearches = state.savedSearches.filter(s => s.id !== action.payload);
        },
        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        setLoading: (state, action) => {
            const { type, value } = action.payload;
            state.loading[type] = value;
        },
        setViewportSize: (state, action) => {
            state.viewportSize = action.payload;
        },
        cacheFilteredResults: (state, action) => {
            const { key, results } = action.payload;
            state.cache.filteredResults[key] = results;
            state.cache.lastFiltersKey = key;
        },
    },
});

// Action creators
export const {
    setFilter,
    setAdvancedFilter,
    clearFilters,
    setViewMode,
    setSelectedProperty,
    clearSelectedProperty,
    setSwipeIndex,
    incrementSwipeIndex,
    addPreloadedImage,
    setFeaturedProperties,
    addToComparison,
    removeFromComparison,
    clearComparison,
    saveSearch,
    removeSearch,
    setPagination,
    setLoading,
    setViewportSize,
    cacheFilteredResults,
} = propertiesSlice.actions;

// Basic selectors
export const selectProperties = (state) => state.properties.properties;
export const selectFilters = (state) => state.properties.filters;
export const selectViewMode = (state) => state.properties.viewMode;
export const selectSelectedProperty = (state) => state.properties.selectedProperty;
export const selectSwipeIndex = (state) => state.properties.swipeIndex;
export const selectFeaturedPropertyIds = (state) => state.properties.featuredPropertyIds;
export const selectComparisonList = (state) => state.properties.comparisonList;
export const selectSearchHistory = (state) => state.properties.searchHistory;
export const selectSavedSearches = (state) => state.properties.savedSearches;
export const selectPagination = (state) => state.properties.pagination;
export const selectLoading = (state) => state.properties.loading;
export const selectViewportSize = (state) => state.properties.viewportSize;

// Complex selectors with memoization
export const selectFilteredProperties = createSelector(
    [selectProperties, selectFilters],
    (properties, filters) => {
        let filtered = properties;

        // Filter by search query
        if (filters.query.trim()) {
            const query = filters.query.toLowerCase();
            filtered = filtered.filter(
                p => p.title.toLowerCase().includes(query) ||
                    p.location.toLowerCase().includes(query) ||
                    p.type.toLowerCase().includes(query)
            );
        }

        // Filter by type
        if (filters.type) {
            filtered = filtered.filter(p => p.type === filters.type);
        }

        // Filter by price range
        if (filters.priceRange && filters.priceRange.length === 2) {
            const [minPrice, maxPrice] = filters.priceRange;
            filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);
        }

        // Filter by minimum bedrooms
        if (filters.minBeds > 0) {
            filtered = filtered.filter(p => p.beds >= filters.minBeds);
        }

        // Filter by minimum bathrooms
        if (filters.minBaths > 0) {
            filtered = filtered.filter(p => p.baths >= filters.minBaths);
        }

        // Sort properties
        if (filters.sort) {
            filtered = [...filtered].sort((a, b) => {
                switch (filters.sort) {
                    case 'price-asc':
                        return a.price - b.price;
                    case 'price-desc':
                        return b.price - a.price;
                    case 'size-asc':
                        return a.size - b.size;
                    case 'size-desc':
                        return b.size - a.size;
                    case 'beds-asc':
                        return a.beds - b.beds;
                    case 'beds-desc':
                        return b.beds - a.beds;
                    case 'title-asc':
                        return a.title.localeCompare(b.title);
                    case 'title-desc':
                        return b.title.localeCompare(a.title);
                    case 'location-asc':
                        return a.location.localeCompare(b.location);
                    case 'location-desc':
                        return b.location.localeCompare(a.location);
                    default:
                        return 0;
                }
            });
        }

        return filtered;
    }
);

export const selectFeaturedProperties = createSelector(
    [selectProperties, selectFeaturedPropertyIds],
    (properties, featuredIds) => {
        return properties.filter(p => featuredIds.includes(p.id));
    }
);

export const selectRegularProperties = createSelector(
    [selectFilteredProperties, selectFeaturedPropertyIds],
    (filteredProperties, featuredIds) => {
        return filteredProperties.filter(p => !featuredIds.includes(p.id));
    }
);

export const selectPropertiesForComparison = createSelector(
    [selectProperties, selectComparisonList],
    (properties, comparisonIds) => {
        return properties.filter(p => comparisonIds.includes(p.id));
    }
);

export const selectPaginatedProperties = createSelector(
    [selectFilteredProperties, selectPagination],
    (properties, pagination) => {
        const { currentPage, itemsPerPage } = pagination;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return properties.slice(startIndex, endIndex);
    }
);

export const selectPropertyStatistics = createSelector(
    [selectFilteredProperties],
    (properties) => ({
        totalCount: properties.length,
        totalValue: properties.reduce((sum, property) => sum + property.price, 0),
        averagePrice: properties.length > 0 ? properties.reduce((sum, property) => sum + property.price, 0) / properties.length : 0,
        averageSize: properties.length > 0 ? properties.reduce((sum, property) => sum + property.size, 0) / properties.length : 0,
        priceRange: {
            min: properties.length > 0 ? Math.min(...properties.map(p => p.price)) : 0,
            max: properties.length > 0 ? Math.max(...properties.map(p => p.price)) : 0,
        },
        typeDistribution: properties.reduce((acc, property) => {
            acc[property.type] = (acc[property.type] || 0) + 1;
            return acc;
        }, {}),
    })
);

export const selectTotalValue = createSelector(
    [selectFilteredProperties],
    (properties) => properties.reduce((sum, property) => sum + property.price, 0)
);

export const selectPropertyTypes = createSelector(
    [selectProperties],
    (properties) => [...new Set(properties.map(p => p.type))].sort()
);

export const selectCurrentSwipeProperty = createSelector(
    [selectFilteredProperties, selectSwipeIndex],
    (properties, index) => {
        if (properties.length === 0) return null;
        return properties[index % properties.length];
    }
);

export const selectPropertyById = createSelector(
    [selectProperties, (state, id) => id],
    (properties, id) => properties.find(p => p.id === id) || null
);

// Advanced search suggestions selector
export const selectSearchSuggestions = createSelector(
    [selectProperties, selectFilters],
    (properties, filters) => {
        if (!filters.query || filters.query.length < 2) return [];

        const query = filters.query.toLowerCase();
        const suggestions = []; // Use array instead of Set
        const seen = new Set(); // Use Set only for deduplication logic, not storage

        properties.forEach(property => {
            // Add matching titles
            if (property.title.toLowerCase().includes(query) && !seen.has(property.title)) {
                suggestions.push(property.title);
                seen.add(property.title);
            }
            // Add matching locations
            if (property.location.toLowerCase().includes(query) && !seen.has(property.location)) {
                suggestions.push(property.location);
                seen.add(property.location);
            }
            // Add matching types
            if (property.type.toLowerCase().includes(query) && !seen.has(property.type)) {
                suggestions.push(property.type);
                seen.add(property.type);
            }
        });

        return suggestions.slice(0, 8); // Return array directly, limited to 8 suggestions
    }
);

export default propertiesSlice.reducer;
