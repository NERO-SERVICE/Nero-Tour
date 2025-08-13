// Seoul Explorer - Configuration File
// 🔑 Google Maps API 키를 여기에 입력하세요

const CONFIG = {
    // Google Maps API Key - https://console.cloud.google.com에서 발급
    GOOGLE_MAPS_API_KEY: "AIzaSyBixyCd1RldZEKkMGuMGHBGiMFVfOE-jdg",
    
    // 지도 기본 설정
    MAP_CONFIG: {
        center: { lat: 37.5665, lng: 126.9780 }, // 서울 중심
        zoom: 12,
        minZoom: 10,
        maxZoom: 18
    },
    
    // 위치 서비스 설정
    LOCATION_CONFIG: {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 30000,
        trackingInterval: 5000 // 5초마다 위치 업데이트
    },
    
    // 알림 설정
    NOTIFICATION_CONFIG: {
        geofenceRadius: 500, // 500미터
        enabled: true
    }
};

// API 키 유효성 검사 (간소화)
function validateConfig() {
    return CONFIG.GOOGLE_MAPS_API_KEY && CONFIG.GOOGLE_MAPS_API_KEY.length > 20;
}

// 전역에서 사용할 수 있도록 export
window.CONFIG = CONFIG;
window.validateConfig = validateConfig;