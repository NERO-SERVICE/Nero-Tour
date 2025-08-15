// Seoul Map Manager - Dedicated map functionality with Custom Markers
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
                image: '../../public/assets/낙산공원.png',
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
                image: '../../public/assets/남산타워.png',
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
                image: '../../public/assets/명동.png',
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
                image: '../../public/assets/자양역.png',
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
                image: '../../public/assets/롯데월드타워.png',
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
                image: '../../public/assets/잠실주경기장.png',
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
                image: '../../public/assets/북촌한옥마을.png',
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
                image: '../../public/assets/삼성역.png',
                tags: ['Business', 'Shopping', 'Modern']
            }
        ];
    }

    // Create custom circular thumbnail marker with purple gradient
    createCustomMarkerIcon(landmark) {        
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
                </defs>
                
                <!-- Outer gradient border circle -->
                <circle cx="30" cy="25" r="22" fill="url(#purpleGradient-${landmark.id})" filter="url(#shadow-${landmark.id})" opacity="0.9"/>
                
                <!-- Inner white border -->
                <circle cx="30" cy="25" r="20" fill="white"/>
                
                <!-- Thumbnail background -->
                <circle cx="30" cy="25" r="18" fill="#f8f9fa" stroke="none"/>
                
                <!-- Category emoji icon -->
                <text x="30" y="32" text-anchor="middle" fill="#667eea" font-size="18" font-family="system-ui">${this.getCategoryIcon(landmark.category)}</text>
                
                <!-- Pointer tail with gradient -->
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

    // Add markers for Seoul attractions with custom icons
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
                zIndex: 100
            });

            // Create info window with enhanced content
            const distance = this.currentLocation ? 
                this.calculateDistance(
                    this.currentLocation.lat,
                    this.currentLocation.lng,
                    landmark.coordinates.lat,
                    landmark.coordinates.lng
                ).toFixed(1) + ' km' : 'Distance unknown';

            const infoWindow = new google.maps.InfoWindow({
                content: `
                    <div style="padding: 12px; max-width: 280px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                            <h3 style="margin: 0; color: #333; font-size: 1.1rem; font-weight: 600;">${landmark.name}</h3>
                        </div>
                        <div style="color: #666; font-size: 0.9rem; margin-bottom: 8px;">${landmark.nameKorean}</div>
                        <p style="margin: 8px 0; color: #555; font-size: 0.9rem; line-height: 1.4;">${landmark.description}</p>
                        <div style="display: flex; flex-wrap: wrap; gap: 4px; margin: 8px 0;">
                            ${landmark.tags.map(tag => `<span style="background: #e3f2fd; color: #1976d2; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 500;">${tag}</span>`).join('')}
                        </div>
                        <div style="color: #4caf50; font-weight: 500; font-size: 0.9rem; margin-top: 8px;">📍 ${distance}</div>
                        <div style="margin-top: 12px;">
                            <button onclick="seoulMapManager.getDirections('${landmark.id}')" style="background: #667eea; color: white; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer; font-size: 0.85rem; margin-right: 8px;">
                                📍 Directions
                            </button>
                            <button onclick="window.open('detail.html?location=${landmark.id}', '_blank')" style="background: #f8f9fa; color: #333; border: 1px solid #e9ecef; padding: 8px 16px; border-radius: 20px; cursor: pointer; font-size: 0.85rem;">
                                ℹ️ Details
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

        console.log(`✅ Added ${landmarks.length} attraction markers with custom icons`);
    }

    // Rest of the methods remain the same...
    // Get current user location
    getCurrentLocation() {
        const locationText = document.getElementById('currentLocationText');
        
        if (!navigator.geolocation) {
            if (locationText) {
                locationText.textContent = 'Geolocation not supported';
            }
            console.warn('⚠️ Geolocation is not supported by this browser');
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
                
                console.log('✅ User location obtained:', this.currentLocation);
                
                if (locationText) {
                    locationText.textContent = `Seoul (${this.currentLocation.lat.toFixed(4)}, ${this.currentLocation.lng.toFixed(4)})`;
                }
                
                // Update map if already initialized
                if (this.map) {
                    this.updateUserLocationOnMap();
                }
            },
            (error) => {
                console.error('❌ Error getting location:', error.message);
                if (locationText) {
                    locationText.textContent = 'Seoul, South Korea';
                }
                
                // Use default Seoul coordinates
                this.currentLocation = { lat: 37.5665, lng: 126.9780 };
                
                if (this.map) {
                    this.updateUserLocationOnMap();
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            }
        );
    }

    // Initialize Google Maps
    async initializeMap() {
        console.log('🗺️ Initializing Google Maps...');
        
        const mapContainer = document.getElementById('mapContainer');
        if (!mapContainer) {
            console.error('❌ Map container not found');
            return;
        }

        const mapLoading = document.getElementById('mapLoading');

        try {
            // Default center (Seoul)
            const seoulCenter = this.currentLocation || { lat: 37.5665, lng: 126.9780 };

            // Initialize map
            this.map = new google.maps.Map(mapContainer, {
                zoom: 12,
                center: seoulCenter,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                styles: [
                    {
                        "featureType": "poi",
                        "elementType": "labels",
                        "stylers": [{"visibility": "off"}]
                    }
                ],
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false
            });

            console.log('✅ Map initialized successfully');

            // Hide loading screen
            if (mapLoading) {
                mapLoading.style.display = 'none';
            }

            // Add user location marker
            this.updateUserLocationOnMap();

            // Add attraction markers with custom icons
            this.addAttractionMarkers();

            // Initialize traffic layer
            this.trafficLayer = new google.maps.TrafficLayer();

        } catch (error) {
            console.error('❌ Map initialization failed:', error);
            if (mapLoading) {
                mapLoading.innerHTML = '<h3>Map loading failed</h3><p>Please refresh the page to try again.</p>';
            }
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
            zIndex: 999
        });

        // Add info window for user location
        const userInfoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 8px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                    <h4 style="margin: 0 0 4px 0; color: #4285F4;">📍 Your Location</h4>
                    <p style="margin: 0; color: #666; font-size: 0.9rem;">Seoul, South Korea</p>
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

    // Setup control event listeners
    setupControlListeners() {
        // Center on user location
        const centerUserBtn = document.getElementById('centerUserBtn');
        if (centerUserBtn) {
            centerUserBtn.addEventListener('click', () => {
                if (this.currentLocation && this.map) {
                    this.map.setCenter(this.currentLocation);
                    this.map.setZoom(15);
                    console.log('📍 Centered map on user location');
                } else {
                    console.warn('⚠️ User location not available');
                }
            });
        }

        // Toggle traffic layer
        const toggleTrafficBtn = document.getElementById('toggleTrafficBtn');
        if (toggleTrafficBtn) {
            toggleTrafficBtn.addEventListener('click', () => {
                if (this.trafficLayer && this.map) {
                    if (this.isTrafficVisible) {
                        this.trafficLayer.setMap(null);
                        this.isTrafficVisible = false;
                        console.log('🚫 Traffic layer hidden');
                    } else {
                        this.trafficLayer.setMap(this.map);
                        this.isTrafficVisible = true;
                        console.log('🚗 Traffic layer shown');
                    }
                }
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

    // Get directions to a landmark
    getDirections(landmarkId) {
        const landmark = this.getSeoulLandmarks().find(l => l.id === landmarkId);
        if (!landmark) return;

        const destination = `${landmark.coordinates.lat},${landmark.coordinates.lng}`;
        const url = `https://maps.google.com/maps?daddr=${destination}&dirflg=w`;
        
        window.open(url, '_blank');
        console.log(`🗺️ Opened directions to ${landmark.name}`);
    }

    // Toggle fullscreen mode
    toggleFullscreen() {
        const mapContainer = document.getElementById('mapContainer');
        if (!mapContainer) return;

        if (!this.isFullscreen) {
            if (mapContainer.requestFullscreen) {
                mapContainer.requestFullscreen();
            } else if (mapContainer.webkitRequestFullscreen) {
                mapContainer.webkitRequestFullscreen();
            } else if (mapContainer.msRequestFullscreen) {
                mapContainer.msRequestFullscreen();
            }
            this.isFullscreen = true;
            console.log('🖥️ Entered fullscreen mode');
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            this.isFullscreen = false;
            console.log('🖥️ Exited fullscreen mode');
        }
    }
}

// Create global instance
window.seoulMapManager = new SeoulMapManager();

// Global callback for Google Maps API
window.initializeGoogleMaps = function() {
    console.log('✅ Google Maps API loaded and ready');
    window.seoulMapManager.initializeMap();
};