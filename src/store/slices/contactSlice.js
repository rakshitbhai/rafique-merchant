import { createSlice } from '@reduxjs/toolkit';

const initialFormState = {
    name: '',
    email: '',
    phone: '',
    interest: '',
    message: '',
};

const initialState = {
    formData: initialFormState,
    errors: {},
    isSubmitting: false,
    isSubmitted: false,
    submitAttempts: 0,
    lastSubmitTime: null,
    // Auto-save draft functionality
    draft: {
        saved: false,
        lastSaved: null,
        autoSave: true,
    },
};

export const contactSlice = createSlice({
    name: 'contact',
    initialState,
    reducers: {
        updateFormField: (state, action) => {
            const { field, value } = action.payload;
            if (state.formData.hasOwnProperty(field)) {
                state.formData[field] = value;

                // Clear error for this field when user starts typing
                if (state.errors[field]) {
                    delete state.errors[field];
                }

                // Mark draft as unsaved
                state.draft.saved = false;
            }
        },

        updateFormData: (state, action) => {
            state.formData = { ...state.formData, ...action.payload };
            state.draft.saved = false;
        },

        setErrors: (state, action) => {
            state.errors = action.payload;
        },

        clearError: (state, action) => {
            const field = action.payload;
            if (state.errors[field]) {
                delete state.errors[field];
            }
        },

        clearAllErrors: (state) => {
            state.errors = {};
        },

        setSubmitting: (state, action) => {
            state.isSubmitting = action.payload;
        },

        setSubmitted: (state, action) => {
            state.isSubmitted = action.payload;
            if (action.payload) {
                state.lastSubmitTime = Date.now();
                state.submitAttempts += 1;
            }
        },

        resetForm: (state) => {
            state.formData = initialFormState;
            state.errors = {};
            state.isSubmitting = false;
            state.isSubmitted = false;
            state.draft.saved = false;
            state.draft.lastSaved = null;
        },

        // Draft management
        saveDraft: (state) => {
            state.draft.saved = true;
            state.draft.lastSaved = Date.now();
        },

        loadDraft: (state, action) => {
            state.formData = { ...initialFormState, ...action.payload };
            state.draft.saved = true;
        },

        toggleAutoSave: (state) => {
            state.draft.autoSave = !state.draft.autoSave;
        },

        // Validation
        validateField: (state, action) => {
            const { field, value } = action.payload;
            const errors = {};

            switch (field) {
                case 'name':
                    if (!value || !value.trim()) {
                        errors.name = 'Name is required';
                    } else if (value.trim().length < 2) {
                        errors.name = 'Name must be at least 2 characters';
                    }
                    break;

                case 'email':
                    if (!value || !value.trim()) {
                        errors.email = 'Email is required';
                    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
                        errors.email = 'Please enter a valid email address';
                    }
                    break;

                case 'phone':
                    if (value && value.trim() && !/^[+()0-9\s-]{7,}$/.test(value)) {
                        errors.phone = 'Please enter a valid phone number';
                    }
                    break;

                case 'message':
                    if (!value || !value.trim()) {
                        errors.message = 'Message is required';
                    } else if (value.trim().length < 10) {
                        errors.message = 'Message must be at least 10 characters';
                    }
                    break;

                default:
                    break;
            }

            // Update or clear error for this field
            if (errors[field]) {
                state.errors[field] = errors[field];
            } else if (state.errors[field]) {
                delete state.errors[field];
            }
        },

        validateForm: (state) => {
            const errors = {};
            const { name, email, phone, message } = state.formData;

            // Name validation
            if (!name || !name.trim()) {
                errors.name = 'Name is required';
            } else if (name.trim().length < 2) {
                errors.name = 'Name must be at least 2 characters';
            }

            // Email validation
            if (!email || !email.trim()) {
                errors.email = 'Email is required';
            } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
                errors.email = 'Please enter a valid email address';
            }

            // Phone validation (optional but must be valid if provided)
            if (phone && phone.trim() && !/^[+()0-9\s-]{7,}$/.test(phone)) {
                errors.phone = 'Please enter a valid phone number';
            }

            // Message validation
            if (!message || !message.trim()) {
                errors.message = 'Message is required';
            } else if (message.trim().length < 10) {
                errors.message = 'Message must be at least 10 characters';
            }

            state.errors = errors;
            return Object.keys(errors).length === 0;
        },
    },
});

// Action creators
export const {
    updateFormField,
    updateFormData,
    setErrors,
    clearError,
    clearAllErrors,
    setSubmitting,
    setSubmitted,
    resetForm,
    saveDraft,
    loadDraft,
    toggleAutoSave,
    validateField,
    validateForm,
} = contactSlice.actions;

// Selectors
export const selectFormData = (state) => state.contact.formData;
export const selectErrors = (state) => state.contact.errors;
export const selectIsSubmitting = (state) => state.contact.isSubmitting;
export const selectIsSubmitted = (state) => state.contact.isSubmitted;
export const selectSubmitAttempts = (state) => state.contact.submitAttempts;
export const selectDraft = (state) => state.contact.draft;

// Computed selectors
export const selectIsFormValid = (state) => {
    const errors = state.contact.errors;
    const formData = state.contact.formData;

    // Check if there are any errors
    if (Object.keys(errors).length > 0) return false;

    // Check required fields
    return !!(
        formData.name && formData.name.trim() &&
        formData.email && formData.email.trim() &&
        formData.message && formData.message.trim()
    );
};

export const selectFormProgress = (state) => {
    const formData = state.contact.formData;
    const requiredFields = ['name', 'email', 'message'];
    const optionalFields = ['phone', 'interest'];

    const filledRequired = requiredFields.filter(field =>
        formData[field] && formData[field].trim()
    ).length;

    const filledOptional = optionalFields.filter(field =>
        formData[field] && formData[field].trim()
    ).length;

    const totalFields = requiredFields.length + optionalFields.length;
    const totalFilled = filledRequired + filledOptional;

    return {
        percentage: Math.round((totalFilled / totalFields) * 100),
        requiredFilled: filledRequired,
        requiredTotal: requiredFields.length,
        allRequiredFilled: filledRequired === requiredFields.length,
    };
};

export const selectCanSubmit = (state) => {
    const isValid = selectIsFormValid(state);
    const isSubmitting = selectIsSubmitting(state);
    return isValid && !isSubmitting;
};

export default contactSlice.reducer;
