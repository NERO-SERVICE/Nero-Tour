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

    // Show bottom sheet with landmark information and image gallery
    showLandmarkBottomSheet(landmark) {
        // Remove existing bottom sheet if any
        const existingBottomSheet = document.getElementById('landmarkBottomSheet');
        if (existingBottomSheet) {
            existingBottomSheet.remove();
        }

        // Create bottom sheet HTML
        const bottomSheetHTML = `
            <div id="landmarkBottomSheet" class="landmark-bottom-sheet">
                <div class="bottom-sheet-backdrop" onclick="this.parentElement.remove()"></div>
                <div class="bottom-sheet-content">
                    <!-- Header with drag handle -->
                    <div class="bottom-sheet-header">
                        <div class="drag-handle"></div>
                        <button class="close-button" onclick="this.closest('.landmark-bottom-sheet').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <!-- Image Gallery -->
                    <div class="image-gallery-container">
                        <div class="image-gallery" id="imageGallery-${landmark.id}">
                            ${landmark.image ? 
                                `<div class="gallery-item active">
                                     <img src="${landmark.image}" alt="${landmark.name}" 
                                          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                     <div class="image-fallback" style="display: none;">
                                         <span class="fallback-icon">${this.getCategoryIcon(landmark.category)}</span>
                                     </div>
                                 </div>` :
                                `<div class="gallery-item active">
                                     <div class="image-fallback">
                                         <span class="fallback-icon">${this.getCategoryIcon(landmark.category)}</span>
                                     </div>
                                 </div>`
                            }
                        </div>
                        <div class="gallery-indicators" id="galleryIndicators-${landmark.id}">
                            <span class="indicator active"></span>
                        </div>
                    </div>
                    
                    <!-- Information Section -->
                    <div class="landmark-info">
                        <div class="landmark-header">
                            <h2 class="landmark-name">${landmark.name}</h2>
                            <p class="landmark-name-korean">${landmark.nameKorean}</p>
                        </div>
                        
                        <p class="landmark-description">${landmark.description}</p>
                        
                        <!-- Tags -->
                        <div class="landmark-tags">
                            ${landmark.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                        
                        <!-- Distance and Actions -->
                        <div class="landmark-actions">
                            <div class="distance-info">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${this.currentLocation ? 
                                    this.calculateDistance(
                                        this.currentLocation.lat,
                                        this.currentLocation.lng,
                                        landmark.coordinates.lat,
                                        landmark.coordinates.lng
                                    ).toFixed(1) + ' km away' : 'Distance unknown'
                                }</span>
                            </div>
                            
                            <div class="action-buttons">
                                <button class="action-btn primary" onclick="seoulMapManager.getDirections('${landmark.id}')">
                                    <i class="fas fa-directions"></i>
                                    Get Directions
                                </button>
                                <button class="action-btn secondary" onclick="window.open('detail.html?location=${landmark.id}', '_blank')">
                                    <i class="fas fa-info-circle"></i>
                                    More Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add CSS styles
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            .landmark-bottom-sheet {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 10000;
                display: flex;
                align-items: flex-end;
                justify-content: center;
                max-width: 414px;
                margin: 0 auto;
            }
            
            .bottom-sheet-backdrop {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(4px);
            }
            
            .bottom-sheet-content {
                position: relative;
                width: 100%;
                max-height: 80vh;
                background: white;
                border-radius: 20px 20px 0 0;
                box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.2);
                animation: slideUp 0.3s ease-out;
                overflow: hidden;
            }
            
            @keyframes slideUp {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
            }
            
            .bottom-sheet-header {
                position: relative;
                padding: 12px 20px 8px;
                text-align: center;
            }
            
            .drag-handle {
                width: 40px;
                height: 4px;
                background: #ddd;
                border-radius: 2px;
                margin: 0 auto;
            }
            
            .close-button {
                position: absolute;
                top: 8px;
                right: 16px;
                background: none;
                border: none;
                font-size: 20px;
                color: #666;
                cursor: pointer;
                padding: 8px;
                border-radius: 50%;
                transition: all 0.2s ease;
            }
            
            .close-button:hover {
                background: #f0f0f0;
                color: #333;
            }
            
            .image-gallery-container {
                position: relative;
                width: 100%;
                height: 200px;
                overflow: hidden;
                background: #f8f9fa;
            }
            
            .image-gallery {
                display: flex;
                width: 100%;
                height: 100%;
                overflow-x: auto;
                scroll-snap-type: x mandatory;
                scrollbar-width: none;
                -ms-overflow-style: none;
            }
            
            .image-gallery::-webkit-scrollbar {
                display: none;
            }
            
            .gallery-item {
                flex: 0 0 100%;
                scroll-snap-align: start;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .gallery-item img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            .image-fallback {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            
            .fallback-icon {
                font-size: 48px;
                color: white;
                filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));
            }
            
            .gallery-indicators {
                position: absolute;
                bottom: 12px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: 6px;
            }
            
            .indicator {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                transition: all 0.2s ease;
            }
            
            .indicator.active {
                background: white;
                transform: scale(1.2);
            }
            
            .landmark-info {
                padding: 20px;
                max-height: calc(60vh - 200px);
                overflow-y: auto;
            }
            
            .landmark-header {
                margin-bottom: 16px;
            }
            
            .landmark-name {
                font-size: 1.5rem;
                font-weight: 700;
                color: #333;
                margin: 0 0 4px 0;
            }
            
            .landmark-name-korean {
                font-size: 1rem;
                color: #666;
                margin: 0 0 16px 0;
            }
            
            .landmark-description {
                font-size: 1rem;
                line-height: 1.6;
                color: #555;
                margin-bottom: 16px;
            }
            
            .landmark-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-bottom: 20px;
            }
            
            .tag {
                background: #f0f7ff;
                color: #1976d2;
                padding: 6px 12px;
                border-radius: 16px;
                font-size: 0.85rem;
                font-weight: 500;
                border: 1px solid #e3f2fd;
            }
            
            .landmark-actions {
                border-top: 1px solid #eee;
                padding-top: 16px;
            }
            
            .distance-info {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 16px;
                color: #4caf50;
                font-weight: 600;
            }
            
            .action-buttons {
                display: flex;
                gap: 12px;
            }
            
            .action-btn {
                flex: 1;
                padding: 12px 16px;
                border: none;
                border-radius: 12px;
                font-size: 0.9rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                min-height: 44px;
            }
            
            .action-btn.primary {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
            }
            
            .action-btn.primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
            }
            
            .action-btn.secondary {
                background: white;
                color: #667eea;
                border: 2px solid #667eea;
            }
            
            .action-btn.secondary:hover {
                background: #667eea;
                color: white;
            }
        `;

        // Add styles and bottom sheet to page
        document.head.appendChild(styleSheet);
        document.body.appendChild(document.createElement('div'));
        document.body.lastElementChild.innerHTML = bottomSheetHTML;
        
        // Add touch gesture support for closing bottom sheet
        this.addBottomSheetGestures();
        
        // Initialize image gallery interactions
        this.initializeImageGallery(landmark.id);
    }

    // Add touch gesture support for bottom sheet
    addBottomSheetGestures() {
        const bottomSheet = document.getElementById('landmarkBottomSheet');
        const content = bottomSheet?.querySelector('.bottom-sheet-content');
        const dragHandle = bottomSheet?.querySelector('.drag-handle');
        
        if (!bottomSheet || !content || !dragHandle) return;

        let startY = 0;
        let currentY = 0;
        let isDragging = false;
        let initialHeight = 0;

        // Touch start
        const handleTouchStart = (e) => {
            startY = e.touches[0].clientY;
            initialHeight = content.offsetHeight;
            isDragging = true;
            content.style.transition = 'none';
        };

        // Touch move
        const handleTouchMove = (e) => {
            if (!isDragging) return;
            
            currentY = e.touches[0].clientY;
            const deltaY = currentY - startY;
            
            if (deltaY > 0) { // Only allow downward dragging
                const newHeight = Math.max(initialHeight - deltaY, 200);
                content.style.height = `${newHeight}px`;
            }
        };

        // Touch end
        const handleTouchEnd = (e) => {
            if (!isDragging) return;
            
            isDragging = false;
            content.style.transition = 'all 0.3s ease-out';
            
            const deltaY = currentY - startY;
            
            // If dragged down more than 100px, close the bottom sheet
            if (deltaY > 100) {
                bottomSheet.remove();
            } else {
                // Snap back to original position
                content.style.height = 'auto';
            }
        };

        // Add event listeners
        dragHandle.addEventListener('touchstart', handleTouchStart);
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);

        // Cleanup function
        const cleanup = () => {
            dragHandle.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };

        // Store cleanup function for later use
        bottomSheet.addEventListener('remove', cleanup);
    }

    // Add image gallery interactions (for future multiple images)
    initializeImageGallery(landmarkId) {
        const gallery = document.getElementById(`imageGallery-${landmarkId}`);
        const indicators = document.getElementById(`galleryIndicators-${landmarkId}`);
        
        if (!gallery || !indicators) return;

        let currentIndex = 0;
        const items = gallery.querySelectorAll('.gallery-item');
        const indicatorDots = indicators.querySelectorAll('.indicator');

        // Update indicators
        const updateIndicators = (index) => {
            indicatorDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        };

        // Handle scroll
        gallery.addEventListener('scroll', () => {
            const scrollLeft = gallery.scrollLeft;
            const itemWidth = gallery.offsetWidth;
            const newIndex = Math.round(scrollLeft / itemWidth);
            
            if (newIndex !== currentIndex) {
                currentIndex = newIndex;
                updateIndicators(currentIndex);
            }
        });

        // Handle indicator clicks
        indicatorDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                gallery.scrollTo({
                    left: index * gallery.offsetWidth,
                    behavior: 'smooth'
                });
            });
        });
    }

    // Create simple icon-based marker with purple gradient
    createCustomMarkerIcon(landmark) {        
        const categoryIcon = this.getCategoryIcon(landmark.category);
        
        // Simple icon-based pin with category representation
        const svgMarker = `
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="65" viewBox="0 0 50 65">
                <defs>
                    <linearGradient id="purpleGradient-${landmark.id}" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                        <stop offset="50%" style="stop-color:#764ba2;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#aa6dd8;stop-opacity:1" />
                    </linearGradient>
                    <filter id="shadow-${landmark.id}" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="rgba(0,0,0,0.3)"/>
                    </filter>
                </defs>
                
                <!-- Outer gradient circle -->
                <circle cx="25" cy="20" r="18" fill="url(#purpleGradient-${landmark.id})" filter="url(#shadow-${landmark.id})" opacity="0.95"/>
                
                <!-- Inner white border -->
                <circle cx="25" cy="20" r="15" fill="white"/>
                
                <!-- Background circle -->
                <circle cx="25" cy="20" r="13" fill="url(#purpleGradient-${landmark.id})" opacity="0.1"/>
                
                <!-- Category icon -->
                <text x="25" y="26" text-anchor="middle" fill="#667eea" font-size="14" font-family="system-ui" font-weight="600">${categoryIcon}</text>
                
                <!-- Pointer tail -->
                <path d="M 25 38 L 20 50 L 30 50 Z" fill="url(#purpleGradient-${landmark.id})" filter="url(#shadow-${landmark.id})"/>
                <path d="M 25 38 L 22 48 L 28 48 Z" fill="white"/>
            </svg>
        `;

        return {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svgMarker),
            scaledSize: new google.maps.Size(50, 65),
            anchor: new google.maps.Point(25, 65)
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
            // Create simple icon-based marker
            const markerIcon = this.createCustomMarkerIcon(landmark);
            
            const marker = new google.maps.Marker({
                position: landmark.coordinates,
                map: this.map,
                title: landmark.name,
                icon: markerIcon,
                zIndex: 100
            });

            // Store marker reference with landmark data
            this.attractionMarkers.push({
                marker: marker,
                landmark: landmark
            });

            // Add click listener to show bottom sheet instead of info window
            marker.addListener('click', () => {
                this.showLandmarkBottomSheet(landmark);
            });
        });

        console.log(`✅ Added ${landmarks.length} attraction markers with icon-based pins`);
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

            // Add attraction markers with simple icon-based pins
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