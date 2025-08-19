import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    navbar: {
        scrolled: false,
        activeSection: 'home',
        mobileMenuOpen: false,
    },
    modals: {
        propertyModal: {
            isOpen: false,
            propertyId: null,
        },
    },
    loading: {
        properties: false,
        contact: false,
        hero3D: false,
        experience3D: false,
    },
    hero: {
        splineLoaded: false,
        splineFailed: false,
        allowSpline: false,
        mountSpline: false,
        userEnabledSpline: false,
        signatureIndex: 0,
    },
    experience3D: {
        loaded: false,
        failed: false,
        shouldMount: false,
    },
    animations: {
        heroVisible: true,
        statsInView: false,
        deckInView: false,
    },
    responsive: {
        isNarrow: false,
        isMobile: false,
        viewport: {
            width: typeof window !== 'undefined' ? window.innerWidth : 1024,
            height: typeof window !== 'undefined' ? window.innerHeight : 768,
        },
    },
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        // Navbar actions
        setScrolled: (state, action) => {
            state.navbar.scrolled = action.payload;
        },
        setActiveSection: (state, action) => {
            state.navbar.activeSection = action.payload;
        },
        toggleMobileMenu: (state) => {
            state.navbar.mobileMenuOpen = !state.navbar.mobileMenuOpen;
        },
        closeMobileMenu: (state) => {
            state.navbar.mobileMenuOpen = false;
        },

        // Modal actions
        openPropertyModal: (state, action) => {
            state.modals.propertyModal = {
                isOpen: true,
                propertyId: action.payload,
            };
        },
        closePropertyModal: (state) => {
            state.modals.propertyModal = {
                isOpen: false,
                propertyId: null,
            };
        },

        // Loading states
        setLoading: (state, action) => {
            const { component, isLoading } = action.payload;
            if (state.loading.hasOwnProperty(component)) {
                state.loading[component] = isLoading;
            }
        },

        // Hero 3D states
        setSplineLoaded: (state, action) => {
            state.hero.splineLoaded = action.payload;
        },
        setSplineFailed: (state, action) => {
            state.hero.splineFailed = action.payload;
        },
        setAllowSpline: (state, action) => {
            state.hero.allowSpline = action.payload;
        },
        setMountSpline: (state, action) => {
            state.hero.mountSpline = action.payload;
        },
        setUserEnabledSpline: (state, action) => {
            state.hero.userEnabledSpline = action.payload;
        },
        setSignatureIndex: (state, action) => {
            state.hero.signatureIndex = action.payload;
        },

        // Experience 3D states
        setExperience3DLoaded: (state, action) => {
            state.experience3D.loaded = action.payload;
        },
        setExperience3DFailed: (state, action) => {
            state.experience3D.failed = action.payload;
        },
        setExperience3DShouldMount: (state, action) => {
            state.experience3D.shouldMount = action.payload;
        },

        // Animation states
        setHeroVisible: (state, action) => {
            state.animations.heroVisible = action.payload;
        },
        setStatsInView: (state, action) => {
            state.animations.statsInView = action.payload;
        },
        setDeckInView: (state, action) => {
            state.animations.deckInView = action.payload;
        },

        // Responsive states
        setIsNarrow: (state, action) => {
            state.responsive.isNarrow = action.payload;
        },
        setIsMobile: (state, action) => {
            state.responsive.isMobile = action.payload;
        },
        setViewport: (state, action) => {
            state.responsive.viewport = action.payload;
        },
        updateViewportSize: (state) => {
            if (typeof window !== 'undefined') {
                state.responsive.viewport = {
                    width: window.innerWidth,
                    height: window.innerHeight,
                };
                state.responsive.isMobile = window.innerWidth <= 768;
                state.responsive.isNarrow = window.innerWidth <= 820;
            }
        },
    },
});

// Action creators
export const {
    setScrolled,
    setActiveSection,
    toggleMobileMenu,
    closeMobileMenu,
    openPropertyModal,
    closePropertyModal,
    setLoading,
    setSplineLoaded,
    setSplineFailed,
    setAllowSpline,
    setMountSpline,
    setUserEnabledSpline,
    setSignatureIndex,
    setExperience3DLoaded,
    setExperience3DFailed,
    setExperience3DShouldMount,
    setHeroVisible,
    setStatsInView,
    setDeckInView,
    setIsNarrow,
    setIsMobile,
    setViewport,
    updateViewportSize,
} = uiSlice.actions;

// Selectors
export const selectNavbar = (state) => state.ui.navbar;
export const selectModals = (state) => state.ui.modals;
export const selectLoading = (state) => state.ui.loading;
export const selectHero = (state) => state.ui.hero;
export const selectExperience3D = (state) => state.ui.experience3D;
export const selectAnimations = (state) => state.ui.animations;
export const selectResponsive = (state) => state.ui.responsive;

export default uiSlice.reducer;
