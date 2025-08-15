// Seoul Map Manager - Dedicated map functionality
class SeoulMapManager {
    constructor() {
        this.map = null;
        this.userLocationMarker = null;
        this.attractionMarkers = [];
        this.currentLocation = null;
        this.trafficLayer = null;
        this.isTrafficVisible = false;
        this.isFullscreen = false;
        
        this.init();
    }

    async init() {
        console.log('🗺️ Initializing Seoul Map Manager...');
        
        // Start getting user location immediately
        this.getCurrentLocation();
        
        // Setup control event listeners
        this.setupControlListeners();
    }

    // Seoul Landmarks Data (same as main app)
    getSeoulLandmarks() {
        return [
            {
                id: 'naksan-park',
                name: 'Naksan Park',
                nameKorean: '낙산공원',
                category: 'historical',
                description: 'Hillside park with panoramic Seoul views and ancient fortress walls',
                coordinates: { lat: 37.5806, lng: 127.0075 },
                icon: 'fas fa-mountain',
                tags: ['Historical', 'Views', 'Walking']
            },
            {
                id: 'namsan-tower',
                name: 'N Seoul Tower',
                nameKorean: '남산타워',
                category: 'landmark',
                description: 'Iconic communication tower offering panoramic city views',
                coordinates: { lat: 37.5512, lng: 126.9882 },
                icon: 'fas fa-broadcast-tower',
                tags: ['Landmark', 'Views', 'Romance']
            },
            {
                id: 'myeongdong',
                name: 'Myeong-dong',
                nameKorean: '명동',
                category: 'shopping',
                description: 'Korea\'s premier shopping and beauty district',
                coordinates: { lat: 37.5636, lng: 126.9824 },
                icon: 'fas fa-shopping-bag',
                tags: ['Shopping', 'Food', 'Beauty']
            },
            {
                id: 'jayang-station',
                name: 'Jayang Station',
                nameKorean: '자양역',
                category: 'modern',
                description: 'Major subway interchange connecting eastern Seoul districts',
                coordinates: { lat: 37.5342, lng: 127.0822 },
                icon: 'fas fa-subway',
                tags: ['Transportation', 'Local Life', 'Residential']
            },
            {
                id: 'lotte-world-tower',
                name: 'Lotte World Tower',
                nameKorean: '롯데월드타워',
                category: 'landmark',
                description: 'Korea\'s tallest skyscraper with shopping and observation decks',
                coordinates: { lat: 37.5120, lng: 127.1020 },
                icon: 'fas fa-building',
                tags: ['Modern', 'Views', 'Shopping']
            },
            {
                id: 'jamsil-stadium',
                name: 'Jamsil Sports Complex',
                nameKorean: '잠실주경기장',
                category: 'modern',
                description: 'Major sports complex hosting baseball, soccer, and events',
                coordinates: { lat: 37.5120, lng: 127.0719 },
                icon: 'fas fa-futbol',
                tags: ['Sports', 'Entertainment', 'Olympics']
            },
            {
                id: 'bukchon-hanok',
                name: 'Bukchon Hanok Village',
                nameKorean: '북촌한옥마을',
                category: 'cultural',
                description: 'Traditional Korean architecture village between palaces',
                coordinates: { lat: 37.5825, lng: 126.9833 },
                icon: 'fas fa-home',
                tags: ['Traditional', 'Architecture', 'Culture']
            },
            {
                id: 'samsung-station',
                name: 'Samsung Station (COEX)',
                nameKorean: '삼성역',
                category: 'modern',
                description: 'Major business district with COEX Mall and convention center',
                coordinates: { lat: 37.5072, lng: 127.0553 },
                icon: 'fas fa-briefcase',
                tags: ['Business', 'Shopping', 'Modern']
            }
        ];
    }

    // Get current user location
    getCurrentLocation() {
        const locationText = document.getElementById('currentLocationText');
        
        if (!navigator.geolocation) {
            this.handleLocationError('Geolocation not supported');
            return;
        }

        if (locationText) {
            locationText.textContent = 'Getting location...';
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                this.handleLocationSuccess();
            },
            (error) => {
                this.handleLocationError(error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            }
        );
    }

    async handleLocationSuccess() {
        console.log('📍 Location obtained:', this.currentLocation);
        
        try {
            // Get English address
            const address = await this.getEnglishAddress(this.currentLocation);
            const locationText = document.getElementById('currentLocationText');
            if (locationText) {
                locationText.textContent = address;
            }
        } catch (error) {
            console.warn('Address resolution failed:', error);
            const locationText = document.getElementById('currentLocationText');
            if (locationText) {
                locationText.textContent = `Seoul (${this.currentLocation.lat.toFixed(4)}, ${this.currentLocation.lng.toFixed(4)})`;
            }
        }

        // Update map if it's already initialized
        if (this.map) {
            this.updateUserLocationOnMap();
        }
    }

    handleLocationError(errorMessage) {
        console.error('Location error:', errorMessage);
        const locationText = document.getElementById('currentLocationText');
        if (locationText) {
            locationText.textContent = 'Location unavailable';
        }
        
        // Use Seoul center as fallback
        this.currentLocation = { lat: 37.5665, lng: 126.9780 };
    }

    // Get English address from coordinates
    async getEnglishAddress(coordinates) {
        try {
            if (!window.CONFIG || !CONFIG.GOOGLE_MAPS_API_KEY) {
                throw new Error('Google Maps API key not available');
            }

            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates.lat},${coordinates.lng}&language=en&region=US&key=${CONFIG.GOOGLE_MAPS_API_KEY}`
            );
            
            if (!response.ok) {
                throw new Error('Geocoding request failed');
            }
            
            const data = await response.json();
            
            if (data.status === 'OK' && data.results.length > 0) {
                const result = data.results[0];
                const components = result.address_components;
                
                let district = '';
                let sublocality = '';
                
                components.forEach(component => {
                    const types = component.types;
                    if (types.includes('sublocality_level_1')) {
                        district = component.long_name;
                    } else if (types.includes('sublocality_level_2')) {
                        sublocality = component.long_name;
                    }
                });
                
                let formattedAddress = 'Seoul';
                if (district) {
                    district = district.replace(/구$/, 'gu').replace(/동$/, 'dong');
                    formattedAddress += `, ${district}`;
                }
                
                return formattedAddress;
            }
            
            throw new Error('No geocoding results found');
        } catch (error) {
            console.warn('Reverse geocoding failed:', error);
            return 'Seoul, South Korea';
        }
    }

    // Initialize Google Maps
    initializeMap() {
        console.log('🗺️ Initializing Google Maps...');
        
        const mapContainer = document.getElementById('mapContainer');
        const mapLoading = document.getElementById('mapLoading');
        
        if (!mapContainer) {
            console.error('Map container not found');
            return;
        }

        // Default Seoul center
        const seoulCenter = { lat: 37.5665, lng: 126.9780 };
        const mapCenter = this.currentLocation || seoulCenter;

        try {
            // Create map with enhanced styling
            this.map = new google.maps.Map(mapContainer, {
                zoom: 12,
                center: mapCenter,
                mapTypeControl: true,
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                    position: google.maps.ControlPosition.TOP_CENTER,
                },
                zoomControl: true,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_CENTER
                },
                scaleControl: true,
                streetViewControl: true,
                streetViewControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_TOP
                },
                fullscreenControl: false, // We'll use custom control
                styles: [
                    {
                        featureType: 'poi',
                        elementType: 'labels',
                        stylers: [{ visibility: 'on' }]
                    },
                    {
                        featureType: 'transit.station',
                        elementType: 'labels',
                        stylers: [{ visibility: 'on' }]
                    }
                ]
            });

            // Hide loading screen
            if (mapLoading) {
                mapLoading.style.display = 'none';
            }

            // Add user location marker
            this.updateUserLocationOnMap();

            // Add attraction markers
            this.addAttractionMarkers();

            // Initialize traffic layer
            this.trafficLayer = new google.maps.TrafficLayer();

            console.log('✅ Google Maps initialized successfully');

        } catch (error) {
            console.error('❌ Map initialization failed:', error);
            this.showMapError('Failed to initialize map. Please try again.');
        }
    }

    // Update user location marker on map
    updateUserLocationOnMap() {
        if (!this.map || !this.currentLocation) return;

        // Remove existing user location marker
        if (this.userLocationMarker) {
            this.userLocationMarker.setMap(null);
        }

        // Create new user location marker
        this.userLocationMarker = new google.maps.Marker({
            position: this.currentLocation,
            map: this.map,
            title: 'Your Current Location',
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" fill="#4285F4" stroke="white" stroke-width="3"/>
                        <circle cx="12" cy="12" r="4" fill="white"/>
                        <circle cx="12" cy="12" r="1" fill="#4285F4"/>
                    </svg>
                `),
                scaledSize: new google.maps.Size(24, 24),
                anchor: new google.maps.Point(12, 12)
            },
            zIndex: 1000
        });

        // Add click listener for user location
        const userInfoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px; text-align: center;">
                    <h3 style="margin: 0 0 8px 0; color: #4285F4;">📍 Your Location</h3>
                    <p style="margin: 0; color: #666; font-size: 14px;">You are here in Seoul!</p>
                </div>
            `
        });

        this.userLocationMarker.addListener('click', () => {
            // Close all attraction info windows
            this.attractionMarkers.forEach(markerInfo => {
                if (markerInfo.infoWindow) {
                    markerInfo.infoWindow.close();
                }
            });
            userInfoWindow.open(this.map, this.userLocationMarker);
        });

        // Center map on user location
        this.map.setCenter(this.currentLocation);
    }

    // Add markers for Seoul attractions
    addAttractionMarkers() {
        if (!this.map) return;

        const landmarks = this.getSeoulLandmarks();
        
        landmarks.forEach(landmark => {
            // Create custom circular thumbnail marker
            const markerIcon = this.createCustomMarkerIcon(landmark);
            
            const marker = new google.maps.Marker({
                position: landmark.coordinates,
                map: this.map,
                title: landmark.name,
                icon: markerIcon,
                icon: {
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#EA4335"/>
                        </svg>
                    `),
                    scaledSize: new google.maps.Size(32, 32),
                    anchor: new google.maps.Point(16, 32)
                },
                zIndex: 100
            });

            // Create info window with enhanced content
            const distance = this.currentLocation ? 
                this.calculateDistance(
                    this.currentLocation.lat,
                    this.currentLocation.lng,
                    landmark.coordinates.lat,
                    landmark.coordinates.lng
                ).toFixed(1) : null;

            const infoWindow = new google.maps.InfoWindow({
                content: `
                    <div style="max-width: 280px; padding: 5px;">
                        <h3 style="margin: 0 0 8px 0; color: #333; font-size: 16px;">${landmark.name}</h3>
                        <p style="margin: 0 0 8px 0; color: #666; font-size: 14px; font-style: italic;">${landmark.nameKorean}</p>
                        <p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.4;">${landmark.description}</p>
                        <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px;">
                            ${landmark.tags.map(tag => `<span style="background: #e3f2fd; color: #1976d2; padding: 3px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;">${tag}</span>`).join('')}
                        </div>
                        ${distance ? `<p style="margin: 0 0 12px 0; color: #666; font-size: 13px;"><i class="fas fa-route"></i> ${distance} km away</p>` : ''}
                        <div style="display: flex; gap: 8px;">
                            <button onclick="getDirectionsTo('${landmark.id}')" 
                                    style="flex: 1; background: #1976d2; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500;">
                                <i class="fas fa-directions"></i> Directions
                            </button>
                            <button onclick="centerMapOn(${landmark.coordinates.lat}, ${landmark.coordinates.lng})" 
                                    style="background: #666; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 13px;">
                                <i class="fas fa-crosshairs"></i>
                            </button>
                        </div>
                    </div>
                `
            });

            // Store marker and info window reference
            this.attractionMarkers.push({
                marker: marker,
                infoWindow: infoWindow,
                landmark: landmark
            });

            // Add click listener
            marker.addListener('click', () => {
                // Close all other info windows
                this.attractionMarkers.forEach(markerInfo => {
                    if (markerInfo.infoWindow !== infoWindow) {
                        markerInfo.infoWindow.close();
                    }
                });
                infoWindow.open(this.map, marker);
            });
        });

        console.log(`✅ Added ${landmarks.length} attraction markers`);
    }

    // Create custom circular thumbnail marker with purple gradient
    createCustomMarkerIcon(landmark) {
        // Get thumbnail image path
        const imagePath = landmark.image || '../../public/assets/default-attraction.png';
        
        // Create custom SVG marker with circular thumbnail and purple gradient border
        const svgMarker = `
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="75" viewBox="0 0 60 75">
                <defs>
                    <linearGradient id="purpleGradient-${landmark.id}" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                        <stop offset="50%" style="stop-color:#764ba2;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#aa6dd8;stop-opacity:1" />
                    </linearGradient>
                    <filter id="shadow-${landmark.id}" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="rgba(0,0,0,0.3)"/>
                    </filter>
                    <clipPath id="circleClip-${landmark.id}">
                        <circle cx="30" cy="25" r="18"/>
                    </clipPath>
                </defs>
                
                <!-- Outer gradient border circle -->
                <circle cx="30" cy="25" r="22" fill="url(#purpleGradient-${landmark.id})" filter="url(#shadow-${landmark.id})" opacity="0.9"/>
                
                <!-- Inner white border -->
                <circle cx="30" cy="25" r="20" fill="white"/>
                
                <!-- Thumbnail image (placeholder - will be styled with CSS) -->
                <circle cx="30" cy="25" r="18" fill="#f0f0f0" stroke="none"/>
                <text x="30" y="30" text-anchor="middle" fill="#667eea" font-size="20" font-family="FontAwesome">${this.getCategoryIcon(landmark.category)}</text>
                
                <!-- Pointer tail -->
                <path d="M 30 47 L 24 60 L 36 60 Z" fill="url(#purpleGradient-${landmark.id})" filter="url(#shadow-${landmark.id})"/>
                <path d="M 30 47 L 26 58 L 34 58 Z" fill="white"/>
            </svg>
        `;

        return {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svgMarker),
            scaledSize: new google.maps.Size(60, 75),
            anchor: new google.maps.Point(30, 75)
        };
    }

    // Get category icon for markers
    getCategoryIcon(category) {
        const icons = {
            'historical': '🏛️',
            'landmark': '🗼', 
            'shopping': '🛍️',
            'modern': '🏢',
            'cultural': '🏘️',
            'default': '📍'
        };
        return icons[category] || icons.default;
    }

    // Calculate distance between two coordinates
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Earth's radius in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    // Setup control button listeners
    setupControlListeners() {
        // Center on user location
        const centerUserBtn = document.getElementById('centerUserBtn');
        if (centerUserBtn) {
            centerUserBtn.addEventListener('click', () => {
                if (this.currentLocation && this.map) {
                    this.map.setCenter(this.currentLocation);
                    this.map.setZoom(15);
                } else {
                    this.getCurrentLocation();
                }
            });
        }

        // Toggle traffic layer
        const toggleTrafficBtn = document.getElementById('toggleTrafficBtn');
        if (toggleTrafficBtn) {
            toggleTrafficBtn.addEventListener('click', () => {
                this.toggleTraffic();
            });
        }

        // Toggle fullscreen
        const toggleFullscreenBtn = document.getElementById('toggleFullscreenBtn');
        if (toggleFullscreenBtn) {
            toggleFullscreenBtn.addEventListener('click', () => {
                this.toggleFullscreen();
            });
        }
    }

    // Toggle traffic layer
    toggleTraffic() {
        if (!this.trafficLayer || !this.map) return;

        if (this.isTrafficVisible) {
            this.trafficLayer.setMap(null);
            this.isTrafficVisible = false;
            console.log('🚗 Traffic layer hidden');
        } else {
            this.trafficLayer.setMap(this.map);
            this.isTrafficVisible = true;
            console.log('🚗 Traffic layer shown');
        }

        // Update button appearance
        const toggleTrafficBtn = document.getElementById('toggleTrafficBtn');
        if (toggleTrafficBtn) {
            toggleTrafficBtn.style.background = this.isTrafficVisible ? '#EA4335' : 'white';
            toggleTrafficBtn.style.color = this.isTrafficVisible ? 'white' : '#333';
        }
    }

    // Toggle fullscreen
    toggleFullscreen() {
        const mapContainer = document.getElementById('mapContainer');
        if (!mapContainer) return;

        if (!this.isFullscreen) {
            if (mapContainer.requestFullscreen) {
                mapContainer.requestFullscreen();
            } else if (mapContainer.webkitRequestFullscreen) {
                mapContainer.webkitRequestFullscreen();
            } else if (mapContainer.mozRequestFullScreen) {
                mapContainer.mozRequestFullScreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            }
        }
    }

    showMapError(message) {
        const mapContainer = document.getElementById('mapContainer');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; padding: 20px; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); max-width: 400px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #ff6b6b; margin-bottom: 16px;"></i>
                    <h3 style="color: #333; margin-bottom: 12px;">Map Error</h3>
                    <p style="color: #666; margin-bottom: 16px;">${message}</p>
                    <button onclick="location.reload()" style="background: #667eea; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
                        Reload Page
                    </button>
                </div>
            `;
        }
    }
}

// Global functions for info window buttons
window.getDirectionsTo = function(locationId) {
    const landmarks = window.seoulMapManager.getSeoulLandmarks();
    const location = landmarks.find(l => l.id === locationId);
    if (!location) return;

    const destination = `${location.coordinates.lat},${location.coordinates.lng}`;
    const url = `https://maps.google.com/maps?daddr=${destination}&dirflg=w`;
    
    window.open(url, '_blank');
};

window.centerMapOn = function(lat, lng) {
    if (window.seoulMapManager && window.seoulMapManager.map) {
        window.seoulMapManager.map.setCenter({ lat: lat, lng: lng });
        window.seoulMapManager.map.setZoom(16);
    }
};

// Handle fullscreen change events
document.addEventListener('fullscreenchange', () => {
    if (window.seoulMapManager) {
        window.seoulMapManager.isFullscreen = !!document.fullscreenElement;
        const toggleFullscreenBtn = document.getElementById('toggleFullscreenBtn');
        if (toggleFullscreenBtn) {
            const icon = toggleFullscreenBtn.querySelector('i');
            if (icon) {
                icon.className = window.seoulMapManager.isFullscreen ? 'fas fa-compress' : 'fas fa-expand';
            }
        }
    }
});

// Initialize map manager
let seoulMapManager;
document.addEventListener('DOMContentLoaded', () => {
    seoulMapManager = new SeoulMapManager();
    // Make it globally accessible
    window.seoulMapManager = seoulMapManager;
});