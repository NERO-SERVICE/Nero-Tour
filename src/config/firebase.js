// Firebase Configuration and Initialization
// Make sure config.js is loaded before this script
// This file uses Firebase v9+ modular SDK with CDN imports

// Firebase configuration loaded from CONFIG
function getFirebaseConfig() {
    if (typeof window !== 'undefined' && window.CONFIG?.FIREBASE_CONFIG) {
        return window.CONFIG.FIREBASE_CONFIG;
    }
    
    // Fallback configuration (for development/testing)
    console.warn('Firebase config not found in CONFIG, using fallback');
    return {
        apiKey: "YOUR_API_KEY_NOT_FOUND",
        authDomain: "YOUR_AUTH_DOMAIN_NOT_FOUND",
        projectId: "YOUR_PROJECT_ID_NOT_FOUND",
        storageBucket: "YOUR_STORAGE_BUCKET_NOT_FOUND",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID_NOT_FOUND",
        appId: "YOUR_APP_ID_NOT_FOUND",
        measurementId: "YOUR_MEASUREMENT_ID_NOT_FOUND"
    };
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
        
        // Check if Firebase SDK is loaded from CDN
        if (typeof firebase === 'undefined') {
            console.error('Firebase SDK not loaded. Please include Firebase CDN scripts.');
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
        
        if (firebase.analytics) {
            FirebaseAnalytics = firebase.analytics();
        }
        
        if (firebase.functions) {
            FirebaseFunctions = firebase.functions();
        }
        
        console.log('Firebase initialized successfully');
        return true;
        
    } catch (error) {
        console.error('Firebase initialization failed:', error);
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