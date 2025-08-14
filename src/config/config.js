// Seoul Explorer - Configuration File
// 🔑 API keys are now loaded from config-local.js (not committed to git)

const CONFIG = {
    // Google Maps API Key - Loaded from config-local.js
    get GOOGLE_MAPS_API_KEY() {
        return window.LOCAL_CONFIG?.GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_NOT_FOUND';
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

// API key validation (simplified)
function validateConfig() {
    return CONFIG.GOOGLE_MAPS_API_KEY && CONFIG.GOOGLE_MAPS_API_KEY.length > 20;
}

// Export for global use
window.CONFIG = CONFIG;
window.validateConfig = validateConfig;