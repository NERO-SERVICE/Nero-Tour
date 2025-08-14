// Seoul Explorer - Mobile Tourism App for American Visitors
class SeoulExplorer {
    constructor() {
        this.currentLocation = null;
        this.selectedLocation = null;
        // Favorites functionality removed for simplified UX
        
        this.init();
    }

    init() {
        this.initializeEventListeners();
        this.renderLocationCards();
        this.getCurrentLocation();
    }

    // Seoul Landmarks Data Structure
    getSeoulLandmarks() {
        return [
            {
                id: 'naksan-park',
                name: 'Naksan Park',
                nameKorean: '낙산공원',
                category: 'historical',
                description: 'Hillside park with panoramic Seoul views and ancient fortress walls',
                longDescription: 'Located on Naksan Mountain (125m), this park offers stunning panoramic views of Seoul. Walk along the 2.1km ancient fortress wall section from Hyehwamun to Heunginjimun, connecting to the famous Ihwa Mural Village.',
                coordinates: { lat: 37.5806, lng: 127.0075 },
                icon: 'fas fa-mountain',
                image: './assets/낙산공원.png',
                tags: ['Historical', 'Views', 'Walking'],
                tips: [
                    'Best views of Seoul skyline especially at sunset',
                    'Connect your visit with Ihwa Mural Village',
                    'Wear comfortable walking shoes for fortress wall walk'
                ],
                hours: '24/7 (Exhibition hall: 09:00-17:00)',
                entrance: 'Free',
                nearbySubway: 'Hyehwa Station (Line 4), Exit 2',
                culturalTips: 'Part of Seoul City Wall - UNESCO World Heritage tentative list'
            },
            {
                id: 'namsan-tower',
                name: 'N Seoul Tower',
                nameKorean: '남산타워',
                category: 'landmark',
                description: 'Iconic communication tower offering panoramic city views',
                longDescription: 'Standing 236 meters above sea level on Namsan Mountain, N Seoul Tower is Seoul\'s most recognizable landmark. The tower offers breathtaking 360-degree views of the city and is famous for its "love locks" tradition.',
                coordinates: { lat: 37.5512, lng: 126.9882 },
                icon: 'fas fa-broadcast-tower',
                image: './assets/남산타워.png',
                tags: ['Landmark', 'Views', 'Romance'],
                tips: [
                    'Take the cable car up for scenic views',
                    'Best visited at sunset for stunning photo opportunities',
                    'Bring a padlock to add to the love locks fence'
                ],
                hours: '10:00 - 23:00 (Sun-Fri), 10:00 - 24:00 (Sat)',
                entrance: 'Cable car: 8,500 KRW, Observatory: 10,000 KRW',
                nearbySubway: 'Myeong-dong Station (Line 4) + Cable car',
                culturalTips: 'Popular date spot - couples often attach love locks here'
            },
            {
                id: 'myeongdong',
                name: 'Myeong-dong',
                nameKorean: '명동',
                category: 'shopping',
                description: 'Korea\'s premier shopping and beauty district',
                longDescription: 'Discover Seoul\'s most vibrant shopping and beauty district, where traditional Korean culture meets modern retail therapy. From world-renowned K-beauty products to authentic street food, Myeong-dong offers an immersive experience into Korean lifestyle.',
                coordinates: { lat: 37.5636, lng: 126.9824 },
                icon: 'fas fa-shopping-bag',
                image: './assets/명동.png',
                tags: ['Shopping', 'Food', 'Beauty'],
                tips: [
                    'Try Korean skincare products - many stores offer free samples',
                    'Haggling is acceptable at street vendors',
                    'Visit in the evening for the best street food experience'
                ],
                hours: 'Stores: 10:00 - 22:00, Street food: 12:00 - 02:00',
                entrance: 'Free (individual purchases vary)',
                nearbySubway: 'Myeong-dong Station (Line 4)',
                culturalTips: 'Bow when receiving free samples, tipping is not expected',
                detailSections: [
                    {
                        title: 'K-Beauty Paradise',
                        image: './assets/명동-화장품.png',
                        description: 'Myeong-dong is the epicenter of Korean beauty culture. Walk through streets lined with flagship stores of famous brands like Innisfree, Etude House, and The Face Shop. Experience the latest in Korean skincare technology with free consultations and product samples. Many stores offer English-speaking staff and tax-free shopping for tourists.'
                    },
                    {
                        title: 'Street Food Heaven',
                        image: './assets/명동-길거리음식.png',
                        description: 'As evening falls, Myeong-dong transforms into a street food paradise. Try iconic Korean snacks like hotteok (sweet pancakes), tteokbokki (spicy rice cakes), and Korean corn dogs. The street food market operates from late afternoon until early morning, offering authentic flavors at budget-friendly prices.'
                    },
                    {
                        title: 'Fashion & Shopping',
                        image: './assets/명동-쇼핑.png',
                        description: 'From high-end department stores like Lotte and Shinsegae to trendy boutiques and international brands, Myeong-dong caters to every fashion taste and budget. The area features both luxury shopping experiences and affordable fashion finds, making it a complete retail destination.'
                    },
                    {
                        title: 'Cultural Experience',
                        image: './assets/명동-문화.png',
                        description: 'Beyond shopping, Myeong-dong offers cultural experiences including traditional Korean performances, art galleries, and historic Myeong-dong Cathedral. The area seamlessly blends modern consumer culture with Korean traditions, providing visitors with a well-rounded cultural experience.'
                    }
                ]
            },
            {
                id: 'jayang-station',
                name: 'Jayang Station',
                nameKorean: '자양역',
                category: 'modern',
                description: 'Major subway interchange connecting eastern Seoul districts',
                longDescription: 'Located in Gwangjin District, Jayang Station serves as an important transit hub on Line 7. The area features modern residential complexes, local markets, and easy access to the Han River parks.',
                coordinates: { lat: 37.5342, lng: 127.0822 },
                icon: 'fas fa-subway',
                image: './assets/자양역.png',
                tags: ['Transportation', 'Local Life', 'Residential'],
                tips: [
                    'Great access point to Han River parks',
                    'Explore local Korean markets nearby',
                    'Less touristy but authentic Seoul experience'
                ],
                hours: '05:30 - 24:00 (subway operating hours)',
                entrance: 'Subway fare: 1,370 KRW',
                nearbySubway: 'Jayang Station (Line 7)',
                culturalTips: 'Experience everyday Seoul life away from tourist crowds'
            },
            {
                id: 'lotte-world-tower',
                name: 'Lotte World Tower',
                nameKorean: '롯데월드타워',
                category: 'landmark',
                description: 'Korea\'s tallest skyscraper with shopping and observation decks',
                longDescription: 'At 555 meters tall, Lotte World Tower is the 6th tallest building in the world. Features Seoul Sky observation deck, luxury shopping, restaurants, and direct connection to Lotte World theme park.',
                coordinates: { lat: 37.5120, lng: 127.1020 },
                icon: 'fas fa-building',
                image: './assets/롯데월드타워.png',
                tags: ['Modern', 'Views', 'Shopping'],
                tips: [
                    'Visit Seoul Sky observatory on floors 117-123',
                    'Book tickets online for discounted prices',
                    'Combine with Lotte World theme park visit'
                ],
                hours: '10:00 - 22:00 (observatory varies)',
                entrance: 'Seoul Sky: 27,000 KRW (adult)',
                nearbySubway: 'Jamsil Station (Line 2, 8)',
                culturalTips: 'Represents modern Seoul\'s architectural achievements'
            },
            {
                id: 'jamsil-stadium',
                name: 'Jamsil Sports Complex',
                nameKorean: '잠실주경기장',
                category: 'modern',
                description: 'Major sports complex hosting baseball, soccer, and events',
                longDescription: 'Built for the 1988 Seoul Olympics, this massive complex includes Olympic Stadium, baseball stadium, and indoor arena. Home to LG Twins baseball team and major K-pop concerts.',
                coordinates: { lat: 37.5120, lng: 127.0719 },
                icon: 'fas fa-futbol',
                image: './assets/잠실주경기장.png',
                tags: ['Sports', 'Entertainment', 'Olympics'],
                tips: [
                    'Check schedules for baseball games or concerts',
                    'Great atmosphere during LG Twins home games',
                    'Easy access to Lotte World nearby'
                ],
                hours: 'Event-dependent (usually 18:30 for baseball)',
                entrance: 'Varies by event (baseball: 8,000-50,000 KRW)',
                nearbySubway: 'Sports Complex Station (Line 2)',
                culturalTips: 'Experience Korean baseball culture - very enthusiastic fans!'
            },
            {
                id: 'bukchon-hanok',
                name: 'Bukchon Hanok Village',
                nameKorean: '북촌한옥마을',
                category: 'cultural',
                description: 'Traditional Korean architecture village between palaces',
                longDescription: 'A well-preserved traditional village with over 600 years of history, featuring beautiful hanok (traditional Korean houses). Perfect for experiencing traditional Korean architecture and culture.',
                coordinates: { lat: 37.5825, lng: 126.9833 },
                icon: 'fas fa-home',
                image: './assets/북촌한옥마을.png',
                tags: ['Traditional', 'Architecture', 'Culture'],
                tips: [
                    'Visit early morning or late afternoon for fewer crowds',
                    'Respect residents - keep noise levels down',
                    'Wear comfortable shoes for walking on uneven surfaces'
                ],
                hours: '24/7 (respect quiet hours 22:00-08:00)',
                entrance: 'Free',
                nearbySubway: 'Anguk Station (Line 3)',
                culturalTips: 'Many hanoks are private residences - observe quietly and respectfully'
            },
            {
                id: 'samsung-station',
                name: 'Samsung Station (COEX)',
                nameKorean: '삼성역',
                category: 'modern',
                description: 'Major business district with COEX Mall and convention center',
                longDescription: 'Located in the heart of Gangnam, Samsung Station connects to Asia\'s largest underground shopping mall (COEX). The area features corporate headquarters, luxury hotels, and entertainment venues.',
                coordinates: { lat: 37.5072, lng: 127.0553 },
                icon: 'fas fa-briefcase',
                image: './assets/삼성역.png',
                tags: ['Business', 'Shopping', 'Modern'],
                tips: [
                    'Explore massive COEX underground mall',
                    'Visit COEX Aquarium and Starfield Library',
                    'Great area for Korean BBQ restaurants'
                ],
                hours: 'COEX: 10:00 - 22:00, Restaurants vary',
                entrance: 'Free to area (COEX Aquarium: 23,000 KRW)',
                nearbySubway: 'Samsung Station (Line 2)',
                culturalTips: 'Heart of Korea\'s business culture - dress professionally'
            }
        ];
    }

    // Geolocation API Integration
    getCurrentLocation() {
        const locationStatus = document.getElementById('currentLocation');

        if (!navigator.geolocation) {
            this.handleLocationError('Geolocation is not supported by this browser');
            return;
        }

        locationStatus.textContent = 'Getting your location...';

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

    handleLocationSuccess() {
        const locationStatus = document.getElementById('currentLocation');
        const locationInfo = document.getElementById('locationInfo');
        
        // Get English address using reverse geocoding
        this.getEnglishAddress(this.currentLocation)
            .then(address => {
                locationStatus.textContent = address;
            })
            .catch(() => {
                locationStatus.textContent = 'Seoul, South Korea';
            });
        
        const nearbyLocations = this.findNearbyLocations();
        
        if (nearbyLocations.length > 0) {
            locationInfo.innerHTML = `
                <div class="success-state">
                    <h3>📍 Nearby Attractions</h3>
                    ${nearbyLocations.slice(0, 3).map(location => `
                        <div style="margin: 8px 0; padding: 8px; border-left: 3px solid #4caf50;">
                            <strong>${location.name}</strong><br>
                            <small>${location.distance} away • ${location.category}</small>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            locationInfo.innerHTML = `
                <div class="success-state">
                    <h3>📍 Welcome to Seoul!</h3>
                    <p>Explore popular destinations below to start your Korean adventure.</p>
                </div>
            `;
        }

        this.updateDistances();
    }

    handleLocationError(errorMessage) {
        const locationStatus = document.getElementById('currentLocation');
        const locationInfo = document.getElementById('locationInfo');
        
        locationStatus.textContent = 'Location unavailable';
        locationInfo.innerHTML = `
            <div class="error-state">
                <h3>⚠️ Location Access Needed</h3>
                <p>Enable location services to find nearby attractions and get personalized recommendations.</p>
                ${errorMessage ? `<p class="error-detail">${errorMessage}</p>` : ''}
                <button onclick="seoulExplorer.getCurrentLocation()" style="background: #667eea; color: white; border: none; padding: 8px 16px; border-radius: 20px; margin-top: 10px; cursor: pointer;">
                    Try Again
                </button>
            </div>
        `;
    }

    // Get English address from coordinates using reverse geocoding
    async getEnglishAddress(coordinates) {
        try {
            // Check if Google Maps API key is available
            if (!window.CONFIG || !CONFIG.GOOGLE_MAPS_API_KEY || CONFIG.GOOGLE_MAPS_API_KEY === 'your-api-key-here') {
                console.warn('Google Maps API key not configured, using approximate location');
                return this.getApproximateLocation(coordinates);
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
                
                // Extract relevant address parts in English
                let district = '';
                let sublocality = '';
                let route = '';
                
                components.forEach(component => {
                    const types = component.types;
                    if (types.includes('sublocality_level_1')) {
                        district = component.long_name;
                    } else if (types.includes('sublocality_level_2')) {
                        sublocality = component.long_name;
                    } else if (types.includes('route')) {
                        route = component.long_name;
                    }
                });
                
                // Format address in desired format: "Seoul, District Street"
                let formattedAddress = 'Seoul';
                if (district) {
                    // Convert Korean district names to English format
                    district = district.replace(/구$/, 'gu').replace(/동$/, 'dong').replace(/서울특별시/, 'Seoul');
                    formattedAddress += `, ${district}`;
                }
                if (route) {
                    formattedAddress += ` ${route}`;
                } else if (sublocality) {
                    formattedAddress += ` ${sublocality}`;
                }
                
                return formattedAddress;
            }
            
            throw new Error('No geocoding results found');
        } catch (error) {
            console.warn('Reverse geocoding failed:', error);
            return this.getApproximateLocation(coordinates);
        }
    }

    // Fallback method for approximate location based on coordinates
    getApproximateLocation(coordinates) {
        // Seoul district boundaries (approximate)
        const districts = [
            { name: 'Mapogu', bounds: { north: 37.58, south: 37.53, east: 126.96, west: 126.89 } },
            { name: 'Jongno-gu', bounds: { north: 37.60, south: 37.56, east: 127.02, west: 126.94 } },
            { name: 'Jung-gu', bounds: { north: 37.58, south: 37.55, east: 127.02, west: 126.96 } },
            { name: 'Yongsan-gu', bounds: { north: 37.55, south: 37.52, east: 127.01, west: 126.94 } },
            { name: 'Gangnam-gu', bounds: { north: 37.52, south: 37.48, east: 127.08, west: 127.01 } },
            { name: 'Songpa-gu', bounds: { north: 37.52, south: 37.47, east: 127.14, west: 127.06 } }
        ];

        const lat = coordinates.lat;
        const lng = coordinates.lng;

        for (const district of districts) {
            const bounds = district.bounds;
            if (lat >= bounds.south && lat <= bounds.north && 
                lng >= bounds.west && lng <= bounds.east) {
                return `Seoul, ${district.name}`;
            }
        }

        return 'Seoul, South Korea';
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

    findNearbyLocations() {
        if (!this.currentLocation) return [];
        
        return this.getSeoulLandmarks()
            .map(location => ({
                ...location,
                distance: this.calculateDistance(
                    this.currentLocation.lat,
                    this.currentLocation.lng,
                    location.coordinates.lat,
                    location.coordinates.lng
                ).toFixed(1) + ' km'
            }))
            .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    }

    updateDistances() {
        const locationCards = document.querySelectorAll('.location-card');
        locationCards.forEach(card => {
            const locationId = card.dataset.locationId;
            const location = this.getSeoulLandmarks().find(l => l.id === locationId);
            if (location && this.currentLocation) {
                const distance = this.calculateDistance(
                    this.currentLocation.lat,
                    this.currentLocation.lng,
                    location.coordinates.lat,
                    location.coordinates.lng
                ).toFixed(1);
                
                const distanceElement = card.querySelector('.distance-info');
                if (distanceElement) {
                    distanceElement.textContent = `${distance} km away`;
                }
            }
        });
    }

    // Render location cards
    renderLocationCards() {
        const locationsGrid = document.getElementById('locationsGrid');
        const landmarks = this.getSeoulLandmarks();
        
        locationsGrid.innerHTML = landmarks.map(location => `
            <button class="location-card" data-location-id="${location.id}" onclick="seoulExplorer.navigateToDetail('${location.id}')">
                <div class="location-image">
                    ${location.image ? 
                        `<img src="${location.image}" alt="${location.name}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                         <div class="icon-fallback" style="display:none;"><i class="${location.icon}"></i></div>` :
                        `<div class="icon-fallback"><i class="${location.icon}"></i></div>`
                    }
                </div>
                <div class="location-info">
                    <h3 class="location-name">${location.name}</h3>
                    <p class="location-korean">${location.nameKorean}</p>
                    <p class="location-description">${location.description}</p>
                    <div class="location-tags">
                        ${location.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="distance-info">Calculating distance...</div>
                </div>
            </button>
        `).join('');
    }

    // Navigate to detail page
    navigateToDetail(locationId) {
        // Navigate to detail.html with location parameter
        window.location.href = `detail.html?location=${locationId}`;
    }


    // Initialize event listeners
    initializeEventListeners() {

        // Start automatic location tracking (no manual refresh needed)
        this.startAutoLocationTracking();

        // Bottom navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                e.target.closest('.nav-item').classList.add('active');
                
                const section = e.target.closest('.nav-item').dataset.section;
                this.handleNavigation(section);
            });
        });
    }

    // Navigation functionality

    getDirections(locationId) {
        const location = this.getSeoulLandmarks().find(l => l.id === locationId);
        if (!location) return;

        const destination = `${location.coordinates.lat},${location.coordinates.lng}`;
        const url = `https://maps.google.com/maps?daddr=${destination}&dirflg=w`;
        
        window.open(url, '_blank');
    }

    handleNavigation(section) {
        switch(section) {
            case 'map':
                this.showMap();
                break;
            default:
                this.showExplore();
        }
    }

    // showFavorites functionality removed for simplified UX

    showMap() {
        // This method is overridden in SeoulExplorerEnhanced
        // Handled by Enhanced version
    }

    // showGuide functionality removed - integrated into Explore section

    showExplore() {
        const sectionTitle = document.querySelector('.locations-section h2');
        sectionTitle.textContent = 'Popular Seoul Destinations';
        this.renderLocationCards();
        this.updateDistances();
        this.addGuideToExplore();
    }

    // Enhanced automatic location tracking system
    startAutoLocationTracking() {
        console.log('🎯 Starting enhanced location tracking system');
        
        // Initialize tracking state
        this.locationTrackingState = {
            isActive: true,
            retryCount: 0,
            maxRetries: 5,
            lastUpdate: null,
            trackingMethod: 'initializing'
        };
        
        // Initial location request with enhanced error handling
        this.performLocationUpdate();
        
        // Set up multi-layer tracking system
        this.setupPeriodicTracking();
        this.setupWatchPositionTracking();
        
        // Setup health check to ensure tracking remains active
        this.setupLocationHealthCheck();
    }

    // Unified location update method
    async performLocationUpdate() {
        if (!this.locationTrackingState?.isActive) return;
        
        try {
            console.log('📍 Performing location update...');
            this.updateLocationStatus('Updating location...', 'info');
            
            const position = await this.getLocationWithRetry();
            const newLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: Date.now()
            };
            
            // Always update if this is first location or significant movement
            if (this.shouldUpdateLocation(newLocation)) {
                await this.processLocationUpdate(newLocation);
            }
            
            this.locationTrackingState.retryCount = 0; // Reset on success
            this.locationTrackingState.lastUpdate = Date.now();
            
        } catch (error) {
            console.error('❌ Location update failed:', error);
            this.handleLocationTrackingError(error);
        }
    }

    // Enhanced geolocation with retry logic
    getLocationWithRetry(timeoutMs = 10000) {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }

            const options = {
                enableHighAccuracy: true,
                timeout: timeoutMs,
                maximumAge: 30000 // 30 seconds cache
            };

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log('✅ Location obtained successfully');
                    resolve(position);
                },
                (error) => {
                    console.warn('⚠️ Geolocation error:', error.message);
                    reject(error);
                },
                options
            );
        });
    }

    // Process and update location with enhanced address resolution
    async processLocationUpdate(newLocation) {
        this.currentLocation = newLocation;
        
        try {
            // Get English address
            const address = await this.getEnglishAddress(newLocation);
            
            // Update UI
            const locationStatus = document.getElementById('currentLocation');
            if (locationStatus) {
                locationStatus.textContent = address;
            }
            
            // Update distances for landmarks
            this.updateDistances();
            
            // Update status
            this.updateLocationStatus('Location updated', 'success');
            console.log(`📍 Location updated: ${address}`);
            
        } catch (error) {
            console.error('Address resolution failed:', error);
            // Fallback to coordinates display
            const locationStatus = document.getElementById('currentLocation');
            if (locationStatus) {
                locationStatus.textContent = `Seoul (${newLocation.lat.toFixed(4)}, ${newLocation.lng.toFixed(4)})`;
            }
        }
    }

    // Setup periodic tracking as fallback
    setupPeriodicTracking() {
        this.periodicInterval = setInterval(() => {
            if (this.locationTrackingState?.isActive) {
                console.log('⏰ Periodic location check');
                this.performLocationUpdate();
            }
        }, 45000); // Every 45 seconds
    }

    // Setup watchPosition for real-time tracking
    setupWatchPositionTracking() {
        if (!navigator.geolocation) return;
        
        this.watchPositionId = navigator.geolocation.watchPosition(
            (position) => {
                const newLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: Date.now()
                };
                
                if (this.shouldUpdateLocation(newLocation)) {
                    console.log('👁️ WatchPosition detected location change');
                    this.processLocationUpdate(newLocation);
                }
            },
            (error) => {
                console.warn('⚠️ WatchPosition error:', error.message);
                this.locationTrackingState.trackingMethod = 'periodic_only';
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 45000
            }
        );
    }

    // Health check to ensure tracking stays active
    setupLocationHealthCheck() {
        this.healthCheckInterval = setInterval(() => {
            const now = Date.now();
            const timeSinceLastUpdate = now - (this.locationTrackingState?.lastUpdate || 0);
            
            // If no update in 2 minutes, restart tracking
            if (timeSinceLastUpdate > 120000) {
                console.log('🔄 Location health check: restarting tracking');
                this.restartLocationTracking();
            }
        }, 60000); // Check every minute
    }

    // Restart location tracking
    restartLocationTracking() {
        this.stopAutoLocationTracking();
        setTimeout(() => {
            this.startAutoLocationTracking();
        }, 2000);
    }

    // Enhanced location change detection
    shouldUpdateLocation(newLocation) {
        if (!this.currentLocation) return true;
        
        const distance = this.calculateDistance(
            this.currentLocation.lat,
            this.currentLocation.lng,
            newLocation.lat,
            newLocation.lng
        );
        
        const timeDiff = newLocation.timestamp - (this.currentLocation.timestamp || 0);
        
        // Update if moved >30m OR if >2 minutes since last update
        return distance > 0.03 || timeDiff > 120000;
    }

    // Handle tracking errors with retry logic
    handleLocationTrackingError(error) {
        console.error('Location tracking error:', error);
        this.locationTrackingState.retryCount++;
        
        if (this.locationTrackingState.retryCount >= this.locationTrackingState.maxRetries) {
            console.error('❌ Max location retries reached');
            this.updateLocationStatus('Location unavailable', 'error');
            return;
        }
        
        // Exponential backoff retry
        const retryDelay = Math.pow(2, this.locationTrackingState.retryCount) * 1000;
        console.log(`🔄 Retrying location update in ${retryDelay}ms (attempt ${this.locationTrackingState.retryCount})`);
        
        setTimeout(() => {
            this.performLocationUpdate();
        }, retryDelay);
    }

    // Update location status with visual feedback
    updateLocationStatus(message, type = 'info') {
        const locationStatus = document.getElementById('currentLocation');
        if (!locationStatus) return;
        
        if (type !== 'success') {
            locationStatus.textContent = message;
            
            // Revert to normal after delay for non-success messages
            if (type === 'info') {
                setTimeout(() => {
                    const currentText = locationStatus.textContent;
                    if (currentText === message) {
                        locationStatus.textContent = this.getLastKnownLocation();
                    }
                }, 3000);
            }
        }
    }

    // Get last known location display
    getLastKnownLocation() {
        if (this.currentLocation) {
            return `Seoul (${this.currentLocation.lat.toFixed(4)}, ${this.currentLocation.lng.toFixed(4)})`;
        }
        return 'Seoul, South Korea';
    }

    // Check if location has changed significantly 
    hasLocationChanged(newLocation) {
        if (!this.currentLocation) return true;
        
        const distance = this.calculateDistance(
            this.currentLocation.lat,
            this.currentLocation.lng,
            newLocation.lat,
            newLocation.lng
        );
        
        // Update if moved more than 50 meters
        return distance > 0.05; // 0.05 km = 50 meters
    }

    // Enhanced cleanup for location tracking
    stopAutoLocationTracking() {
        console.log('🛑 Stopping location tracking');
        
        if (this.locationTrackingState) {
            this.locationTrackingState.isActive = false;
        }
        
        // Clear all intervals and watchers
        if (this.periodicInterval) {
            clearInterval(this.periodicInterval);
            this.periodicInterval = null;
        }
        
        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval);
            this.healthCheckInterval = null;
        }
        
        if (this.locationUpdateInterval) {
            clearInterval(this.locationUpdateInterval);
            this.locationUpdateInterval = null;
        }
        
        if (this.watchPositionId && navigator.geolocation) {
            navigator.geolocation.clearWatch(this.watchPositionId);
            this.watchPositionId = null;
        }
    }

    addGuideToExplore() {
        const locationsGrid = document.getElementById('locationsGrid');
        
        // Add guide section to the bottom of locations grid
        const guideSection = document.createElement('div');
        guideSection.className = 'guide-section';
        guideSection.style.cssText = 'grid-column: 1/-1; margin-top: 40px;';
        
        guideSection.innerHTML = `
            <div class="guide-content" style="background: #f8f9fa; padding: 25px; border-radius: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.08);">
                <h3 style="color: #333; margin-bottom: 20px; display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-book" style="color: #667eea;"></i>
                    Seoul Travel Guide
                </h3>
                
                <div style="display: grid; gap: 20px; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
                    <div class="guide-item">
                        <h4 style="color: #667eea; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                            <i class="fas fa-won-sign"></i> Currency & Payments
                        </h4>
                        <p>Korean Won (KRW) • Credit cards widely accepted • T-money card for subway</p>
                    </div>
                    
                    <div class="guide-item">
                        <h4 style="color: #667eea; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                            <i class="fas fa-subway"></i> Getting Around
                        </h4>
                        <p>Subway system covers most attractions • Download "Citymapper" or "Subway Korea" apps • Buses have English announcements</p>
                    </div>
                    
                    <div class="guide-item">
                        <h4 style="color: #667eea; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                            <i class="fas fa-utensils"></i> Food Culture
                        </h4>
                        <p>Try Korean BBQ, bibimbap, and street food • Tipping is not expected • Many restaurants don't accept credit cards</p>
                    </div>
                    
                    <div class="guide-item">
                        <h4 style="color: #667eea; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                            <i class="fas fa-mobile-alt"></i> Essential Apps
                        </h4>
                        <p>Google Translate (with camera feature) • Papago (Naver translator) • KakaoMap for navigation</p>
                    </div>
                    
                    <div class="guide-item">
                        <h4 style="color: #667eea; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                            <i class="fas fa-hands"></i> Cultural Etiquette
                        </h4>
                        <p>Bow when greeting • Remove shoes when entering homes • Both hands when giving/receiving items</p>
                    </div>
                    
                    <div class="guide-item">
                        <h4 style="color: #667eea; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                            <i class="fas fa-info-circle"></i> Travel Tips
                        </h4>
                        <p>Learn basic Korean phrases • Download offline maps • Carry cash for local markets • Respect quiet hours</p>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing guide section if present
        const existingGuide = locationsGrid.querySelector('.guide-section');
        if (existingGuide) {
            existingGuide.remove();
        }
        
        locationsGrid.appendChild(guideSection);
    }
}

// Add CSS for modal content
const additionalCSS = `
.location-detail-header h2 {
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 5px;
}

.korean-name {
    font-size: 1rem;
    color: #666;
    font-weight: 500;
}

.description-section {
    margin: 20px 0;
}

.description-section h3 {
    color: #333;
    margin-bottom: 10px;
    font-size: 1.1rem;
}

.practical-info {
    margin: 25px 0;
}

.practical-info h3 {
    color: #333;
    margin-bottom: 15px;
    font-size: 1.1rem;
}

.info-grid {
    display: grid;
    gap: 15px;
}

.info-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 8px;
}

.info-item i {
    color: #667eea;
    margin-top: 2px;
    width: 20px;
}

.tips-section, .cultural-tips {
    margin: 20px 0;
}

.tips-section h3, .cultural-tips h3 {
    color: #333;
    margin-bottom: 10px;
    font-size: 1.1rem;
}

.tips-section ul {
    padding-left: 20px;
}

.tips-section li {
    margin: 8px 0;
    line-height: 1.4;
}

.cultural-tips em {
    color: #666;
    font-style: italic;
}

.action-buttons {
    display: flex;
    gap: 10px;
    margin-top: 25px;
}

.favorite-btn, .directions-btn {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 25px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.favorite-btn {
    background: #ff6b6b;
    color: white;
}

.directions-btn {
    background: #667eea;
    color: white;
}

.favorite-btn:hover, .directions-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}
`;

// Add the additional CSS to the document
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);

// Initialize the app
let seoulExplorer;
document.addEventListener('DOMContentLoaded', () => {
    seoulExplorer = new SeoulExplorer();
});