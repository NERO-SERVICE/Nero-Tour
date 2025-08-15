// Firebase Configuration and Initialization
// Make sure config.js is loaded before this script
// This file uses Firebase v9+ modular SDK with CDN imports

// Firebase configuration loaded from CONFIG
function getFirebaseConfig() {
    if (typeof window !== 'undefined' && window.CONFIG?.FIREBASE_CONFIG) {
        return window.CONFIG.FIREBASE_CONFIG;
    }
    
    return null; // No Firebase config available
}

// Check if Firebase config is valid
function isFirebaseConfigValid(config) {
    return config && 
           config.apiKey && 
           config.projectId && 
           config.apiKey.length > 10 && 
           !config.apiKey.includes('NOT_FOUND') &&
           !config.apiKey.includes('undefined');
}

// Initialize Firebase when the page loads
let FirebaseApp = null;
let FirebaseDB = null;
let FirebaseAuth = null;
let FirebaseAnalytics = null;
let FirebaseFunctions = null;

function initializeFirebase() {
    try {
        const firebaseConfig = getFirebaseConfig();
        
        // Check if Firebase config is valid
        if (!isFirebaseConfigValid(firebaseConfig)) {
            console.log('ℹ️ Firebase configuration not available or invalid - Firebase features will be disabled');
            return false;
        }
        
        // Check if Firebase SDK is loaded from CDN
        if (typeof firebase === 'undefined') {
            console.warn('Firebase SDK not loaded. Firebase features will be disabled.');
            return false;
        }

        // Initialize Firebase App
        FirebaseApp = firebase.initializeApp(firebaseConfig);
        
        // Initialize services
        if (firebase.firestore) {
            FirebaseDB = firebase.firestore();
        }
        
        if (firebase.auth) {
            FirebaseAuth = firebase.auth();
        }
        
        if (firebase.analytics && firebaseConfig.measurementId) {
            FirebaseAnalytics = firebase.analytics();
        }
        
        if (firebase.functions) {
            FirebaseFunctions = firebase.functions();
        }
        
        console.log('✅ Firebase initialized successfully');
        return true;
        
    } catch (error) {
        console.warn('⚠️ Firebase initialization failed (continuing without Firebase):', error);
        return false;
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFirebase);
} else {
    initializeFirebase();
}

// Export for global access
window.Firebase = {
    app: FirebaseApp,
    db: FirebaseDB,
    auth: FirebaseAuth,
    analytics: FirebaseAnalytics,
    functions: FirebaseFunctions,
    initialize: initializeFirebase
};