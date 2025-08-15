// Seoul Explorer - Configuration File
// 🚀 Auto-generated during build - DO NOT EDIT MANUALLY
// Environment variables injected by Netlify build process

const CONFIG = {
    // Google Maps API Key - Injected from environment
    GOOGLE_MAPS_API_KEY: "AIzaSyBixyCd1RldZEKkMGuMGHBGiMFVfOE-jdg",
    
    // Firebase Configuration - Injected from environment
    FIREBASE_CONFIG: {
        apiKey: "undefined",
        authDomain: "undefined",
        projectId: "undefined",
        storageBucket: "undefined",
        messagingSenderId: "undefined",
        appId: "undefined",
        measurementId: "undefined"
    },
    
    // Map default settings
    MAP_CONFIG: {
        center: { lat: 37.5665, lng: 126.9780 }, // Seoul center
        zoom: 12,
        minZoom: 10,
        maxZoom: 18,
        language: 'en',
        region: 'US'
    },
    
    // Location service settings
    LOCATION_CONFIG: {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 30000,
        trackingInterval: 5000, // Update location every 5 seconds
        language: 'en',
        region: 'US'
    },
    
    // Notification settings
    NOTIFICATION_CONFIG: {
        geofenceRadius: 500, // 500 meters
        enabled: true
    }
};

// API key validation
function validateConfig() {
    const hasValidMapsKey = CONFIG.GOOGLE_MAPS_API_KEY && 
                           CONFIG.GOOGLE_MAPS_API_KEY.length > 20 && 
                           !CONFIG.GOOGLE_MAPS_API_KEY.includes('NOT_SET');
    
    const hasValidFirebaseKey = CONFIG.FIREBASE_CONFIG.apiKey && 
                               CONFIG.FIREBASE_CONFIG.apiKey.length > 20 && 
                               !CONFIG.FIREBASE_CONFIG.apiKey.includes('NOT_SET');
    
    return hasValidMapsKey && hasValidFirebaseKey;
}

// Export for global use
window.CONFIG = CONFIG;
window.validateConfig = validateConfig;

// Build info
window.BUILD_INFO = {
    timestamp: "2025-08-15T06:39:27.678Z",
    environment: "netlify",
    version: "1.0.0",
    source: "netlify environment variables"
};
