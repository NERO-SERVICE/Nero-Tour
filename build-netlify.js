#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Netlify build process...');

// Read environment variables from Netlify environment
console.log('☁️ Loading from Netlify environment variables...');

const envVars = {
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID
};

console.log('📝 Environment variables loaded:');
Object.keys(envVars).forEach(key => {
    const value = envVars[key];
    const maskedValue = value && value.length > 10 ? value.substring(0, 10) + '...' : value || 'NOT_SET';
    console.log(`   ${key}: ${maskedValue}`);
});

// Create the config file content
const configContent = `// Seoul Explorer - Configuration File
// 🚀 Auto-generated during Netlify build - DO NOT EDIT MANUALLY
// Environment variables injected from Netlify environment

const CONFIG = {
    // Google Maps API Key - Injected from Netlify environment
    GOOGLE_MAPS_API_KEY: "${envVars.GOOGLE_MAPS_API_KEY || ''}",
    
    // Firebase Configuration - Injected from Netlify environment
    FIREBASE_CONFIG: {
        apiKey: "${envVars.FIREBASE_API_KEY || ''}",
        authDomain: "${envVars.FIREBASE_AUTH_DOMAIN || ''}",
        projectId: "${envVars.FIREBASE_PROJECT_ID || ''}",
        storageBucket: "${envVars.FIREBASE_STORAGE_BUCKET || ''}",
        messagingSenderId: "${envVars.FIREBASE_MESSAGING_SENDER_ID || ''}",
        appId: "${envVars.FIREBASE_APP_ID || ''}",
        measurementId: "${envVars.FIREBASE_MEASUREMENT_ID || ''}"
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

// Export for global use
window.CONFIG = CONFIG;
window.validateConfig = validateConfig;

// Build info
window.BUILD_INFO = {
    timestamp: "${new Date().toISOString()}",
    environment: "netlify",
    version: "1.0.0",
    source: "netlify environment variables"
};
`;

// Write the config file
const configPath = path.join(__dirname, 'src', 'config', 'config.js');
fs.writeFileSync(configPath, configContent);

console.log('✅ Config file generated:', configPath);

// Validate that all required environment variables are set
const missingVars = [];

Object.keys(envVars).forEach(key => {
    if (!envVars[key] || envVars[key].trim() === '') {
        missingVars.push(key);
    }
});

if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(key => console.error(`   - ${key}`));
    console.error('   Please set these in your Netlify dashboard Environment variables');
    
    // Check if Google Maps API key is missing (critical)
    if (missingVars.includes('GOOGLE_MAPS_API_KEY')) {
        console.error('🗺️  Google Maps API key is required for the app to work!');
        process.exit(1);
    }
}

console.log('🎉 Netlify build completed successfully!');