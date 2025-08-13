// Seoul Explorer - Configuration File
// 🔑 Enter your Google Maps API key here

const CONFIG = {
    // Google Maps API Key - Get from https://console.cloud.google.com
    GOOGLE_MAPS_API_KEY: "AIzaSyBixyCd1RldZEKkMGuMGHBGiMFVfOE-jdg",
    
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