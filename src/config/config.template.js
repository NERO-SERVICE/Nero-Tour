// Seoul Explorer - Configuration File Template
// This is a template that will be replaced during build process
// The actual config.js will be generated with environment variables

const CONFIG = {
    // Google Maps API Key - Will be injected during build
    GOOGLE_MAPS_API_KEY: "%%GOOGLE_MAPS_API_KEY%%",
    
    // Firebase Configuration - Will be injected during build
    FIREBASE_CONFIG: {
        apiKey: "%%FIREBASE_API_KEY%%",
        authDomain: "%%FIREBASE_AUTH_DOMAIN%%",
        projectId: "%%FIREBASE_PROJECT_ID%%",
        storageBucket: "%%FIREBASE_STORAGE_BUCKET%%",
        messagingSenderId: "%%FIREBASE_MESSAGING_SENDER_ID%%",
        appId: "%%FIREBASE_APP_ID%%",
        measurementId: "%%FIREBASE_MEASUREMENT_ID%%"
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
                           !CONFIG.GOOGLE_MAPS_API_KEY.includes('%%');
    
    const hasValidFirebaseKey = CONFIG.FIREBASE_CONFIG.apiKey && 
                               CONFIG.FIREBASE_CONFIG.apiKey.length > 20 && 
                               !CONFIG.FIREBASE_CONFIG.apiKey.includes('%%');
    
    return hasValidMapsKey && hasValidFirebaseKey;
}

// Export for global use
window.CONFIG = CONFIG;
window.validateConfig = validateConfig;