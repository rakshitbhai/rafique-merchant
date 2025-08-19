import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

// Import slices
import propertiesReducer from './slices/propertiesSlice';
import uiReducer from './slices/uiSlice';
import userPreferencesReducer from './slices/userPreferencesSlice';
import contactReducer from './slices/contactSlice';
import performanceReducer from './slices/performanceSlice';

// Combine all reducers
const rootReducer = combineReducers({
    properties: propertiesReducer,
    ui: uiReducer,
    userPreferences: userPreferencesReducer,
    contact: contactReducer,
    performance: performanceReducer,
});

// NOTE: Previous migration logic & aggressive localStorage clearing removed for production stability.

// Persist configuration - SIMPLIFIED
const persistConfig = {
    key: 'rm-app',
    storage,
    whitelist: ['userPreferences'],
    version: 1,
    timeout: 4000,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Performance monitoring middleware
const performanceMiddleware = (storeAPI) => (next) => (action) => {
    if (process.env.NODE_ENV === 'development') {
        const startTime = performance.now();
        const result = next(action);
        const endTime = performance.now();

        // Log slow actions (> 5ms)
        if (endTime - startTime > 12) {
            console.warn(`Slow Redux action: ${action.type} ${(endTime - startTime).toFixed(1)}ms`);
        }

        return result;
    }
    return next(action);
};

// Configure store with optimizations
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                // Ignore performance entries which may not be serializable
                ignoredPaths: [
                    'performance.imageCache',
                    'performance.metrics',
                ],
            },
            // Enable immutability and serializable checks only in development
            immutableCheck: process.env.NODE_ENV === 'development',
        }).concat(performanceMiddleware),
    devTools: process.env.NODE_ENV === 'development' && {
        name: 'Rafiq Merchant Portfolio',
        trace: true,
        traceLimit: 25,
    },
});

// Create persistor with error handling
export const persistor = persistStore(store);

// Development-only diagnostics trimmed for production.
