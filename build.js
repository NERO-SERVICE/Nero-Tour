#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting build process...');

// Read environment variables
const envVars = {
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_NOT_SET',
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY || 'YOUR_FIREBASE_API_KEY_NOT_SET',
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN || 'your-project.firebaseapp.com',
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || 'your-project-id',
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET || 'your-project.appspot.com',
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID || '123456789012',
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID || '1:123456789012:web:your-app-id',
    FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID || 'G-YOUR-MEASUREMENT-ID'
};

console.log('📝 Environment variables loaded:');
Object.keys(envVars).forEach(key => {
    const value = envVars[key];
    const maskedValue = value.length > 10 ? value.substring(0, 10) + '...' : value;
    console.log(`   ${key}: ${maskedValue}`);
});

// Create the config file content
const configContent = `// Seoul Explorer - Configuration File
// 🚀 Auto-generated during build - DO NOT EDIT MANUALLY
// Environment variables injected by Netlify build process

const CONFIG = {
    // Google Maps API Key - Injected from environment
    GOOGLE_MAPS_API_KEY: "${envVars.GOOGLE_MAPS_API_KEY}",
    
    // Firebase Configuration - Injected from environment
    FIREBASE_CONFIG: {
        apiKey: "${envVars.FIREBASE_API_KEY}",
        authDomain: "${envVars.FIREBASE_AUTH_DOMAIN}",
        projectId: "${envVars.FIREBASE_PROJECT_ID}",
        storageBucket: "${envVars.FIREBASE_STORAGE_BUCKET}",
        messagingSenderId: "${envVars.FIREBASE_MESSAGING_SENDER_ID}",
        appId: "${envVars.FIREBASE_APP_ID}",
        measurementId: "${envVars.FIREBASE_MEASUREMENT_ID}"
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
    timestamp: "${new Date().toISOString()}",
    environment: "${process.env.NODE_ENV || 'production'}",
    version: "1.0.0"
};
`;

// Write the config file
const configPath = path.join(__dirname, 'src', 'config', 'config.js');
fs.writeFileSync(configPath, configContent);

console.log('✅ Config file generated:', configPath);

// Validate that all required environment variables are set
const missingVars = [];
Object.keys(envVars).forEach(key => {
    if (envVars[key].includes('NOT_SET')) {
        missingVars.push(key);
    }
});

if (missingVars.length > 0) {
    console.warn('⚠️  Warning: Missing environment variables:');
    missingVars.forEach(key => console.warn(`   - ${key}`));
    console.warn('   Please set these in your Netlify dashboard or .env file');
}

console.log('🎉 Build completed successfully!');