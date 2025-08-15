// Seoul Explorer - Configuration File
// 🚀 Auto-generated during build - DO NOT EDIT MANUALLY
// Environment variables injected by Netlify build process

const CONFIG = {
    // Google Maps API Key - Injected from environment
    GOOGLE_MAPS_API_KEY: "AIzaSyBixyCd1RldZEKkMGuMGHBGiMFVfOE-jdg",
    
    // Firebase Configuration - Injected from environment
    FIREBASE_CONFIG: {
        apiKey: "",
        authDomain: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: "",
        measurementId: ""
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

// API key validation - Firebase is optional, Maps is required
function validateConfig() {
    const hasValidMapsKey = CONFIG.GOOGLE_MAPS_API_KEY && 
                           CONFIG.GOOGLE_MAPS_API_KEY.length > 20 && 
                           !CONFIG.GOOGLE_MAPS_API_KEY.includes('NOT_SET') &&
                           CONFIG.GOOGLE_MAPS_API_KEY.startsWith('AIza');
    
    if (!hasValidMapsKey) {
        console.error('Invalid Google Maps API key:', {
            exists: !!CONFIG.GOOGLE_MAPS_API_KEY,
            length: CONFIG.GOOGLE_MAPS_API_KEY?.length,
            startsWithAIza: CONFIG.GOOGLE_MAPS_API_KEY?.startsWith('AIza')
        });
    }
    
    return hasValidMapsKey;
}

// Additional validation specifically for Maps
function validateMapsConfig() {
    return CONFIG.GOOGLE_MAPS_API_KEY && 
           CONFIG.GOOGLE_MAPS_API_KEY.length > 30 && 
           CONFIG.GOOGLE_MAPS_API_KEY.startsWith('AIza') &&
           !CONFIG.GOOGLE_MAPS_API_KEY.includes('NOT_SET');
}

// Export for global use
window.CONFIG = CONFIG;
window.validateConfig = validateConfig;

// Build info
window.BUILD_INFO = {
    timestamp: "2025-08-15T06:45:38.770Z",
    environment: "netlify",
    version: "1.0.0",
    source: "netlify environment variables"
};
