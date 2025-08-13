// Seoul Explorer - Mobile Tourism App for American Visitors
class SeoulExplorer {
    constructor() {
        this.currentLocation = null;
        this.selectedLocation = null;
        this.favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        
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
                id: 'gyeongbokgung',
                name: 'Gyeongbokgung Palace',
                nameKorean: '경복궁',
                category: 'Historical',
                description: 'The largest of the Five Grand Palaces built during the Joseon Dynasty',
                longDescription: 'Built in 1395, Gyeongbokgung Palace is a stunning example of Korean architecture and the main royal palace of the Joseon dynasty. Famous for the colorful Changing of the Guard ceremony.',
                coordinates: { lat: 37.5796, lng: 126.9770 },
                icon: 'fas fa-torii-gate',
                tags: ['Historical', 'Culture', 'Must-Visit'],
                tips: [
                    'Visit during the Changing of the Guard ceremony (10:00, 14:00, 15:30)',
                    'Wear comfortable walking shoes',
                    'Allow 2-3 hours for full exploration'
                ],
                hours: '09:00 - 18:00 (Mar-Oct), 09:00 - 17:00 (Nov-Feb)',
                entrance: '3,000 KRW (~$2.50)',
                nearbySubway: 'Gyeongbokgung Station (Line 3)',
                culturalTips: 'Bow slightly when entering palace grounds as a sign of respect'
            },
            {
                id: 'namsan-tower',
                name: 'N Seoul Tower',
                nameKorean: 'N서울타워',
                category: 'Landmark',
                description: 'Iconic communication tower offering panoramic city views',
                longDescription: 'Standing 236 meters above sea level, N Seoul Tower is Seouls most recognizable landmark. The tower offers breathtaking 360-degree views of the city and is famous for its "love locks" tradition.',
                coordinates: { lat: 37.5512, lng: 126.9882 },
                icon: 'fas fa-broadcast-tower',
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
                name: 'Myeong-dong Shopping District',
                nameKorean: '명동',
                category: 'Shopping',
                description: 'Koreas premier shopping and beauty district',
                longDescription: 'A bustling shopping paradise famous for K-beauty products, street food, and fashion. Home to major department stores, cosmetic shops, and the vibrant Myeong-dong street food market.',
                coordinates: { lat: 37.5636, lng: 126.9824 },
                icon: 'fas fa-shopping-bag',
                tags: ['Shopping', 'Food', 'Beauty'],
                tips: [
                    'Try Korean skincare products - many stores offer free samples',
                    'Haggling is acceptable at street vendors',
                    'Visit in the evening for the best street food experience'
                ],
                hours: 'Stores: 10:00 - 22:00, Street food: 12:00 - 02:00',
                entrance: 'Free (individual purchases vary)',
                nearbySubway: 'Myeong-dong Station (Line 4)',
                culturalTips: 'Bow when receiving free samples, tipping is not expected'
            },
            {
                id: 'hongdae',
                name: 'Hongdae Nightlife District',
                nameKorean: '홍대',
                category: 'Nightlife',
                description: 'Vibrant university area known for nightlife and indie culture',
                longDescription: 'The heart of Seouls youth culture, famous for its clubs, bars, live music venues, and street performances. The area comes alive after dark with endless entertainment options.',
                coordinates: { lat: 37.5565, lng: 126.9240 },
                icon: 'fas fa-music',
                tags: ['Nightlife', 'Music', 'Youth Culture'],
                tips: [
                    'Start your night after 10 PM when things get busy',
                    'Try Korean fried chicken and beer (chimaek)',
                    'Many venues offer free live performances'
                ],
                hours: 'Bars/Clubs: 18:00 - 06:00, Restaurants: 11:00 - 02:00',
                entrance: 'Free entry to district, club covers vary (5,000-20,000 KRW)',
                nearbySubway: 'Hongik University Station (Line 2)',
                culturalTips: 'Drinking culture is social - expect to share drinks and toast frequently'
            },
            {
                id: 'bukchon-hanok',
                name: 'Bukchon Hanok Village',
                nameKorean: '북촌한옥마을',
                category: 'Cultural',
                description: 'Traditional Korean architecture village between palaces',
                longDescription: 'A well-preserved traditional village with over 600 years of history, featuring beautiful hanok (traditional Korean houses). Perfect for experiencing traditional Korean architecture and culture.',
                coordinates: { lat: 37.5825, lng: 126.9833 },
                icon: 'fas fa-home',
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
                id: 'gangnam',
                name: 'Gangnam District',
                nameKorean: '강남구',
                category: 'Modern',
                description: 'Upscale district famous for luxury shopping and K-pop culture',
                longDescription: 'Made globally famous by PSYs "Gangnam Style," this affluent district represents modern Seoul with luxury brands, high-end restaurants, and the COEX shopping mall.',
                coordinates: { lat: 37.5173, lng: 127.0473 },
                icon: 'fas fa-city',
                tags: ['Modern', 'Luxury', 'K-pop'],
                tips: [
                    'Visit COEX Mall for shopping and dining',
                    'Experience Korean BBQ at a high-end restaurant',
                    'Take photos at the Gangnam Style statue'
                ],
                hours: 'Malls: 10:00 - 22:00, Restaurants: varies',
                entrance: 'Free to district, individual venue costs vary',
                nearbySubway: 'Gangnam Station (Line 2)',
                culturalTips: 'Dress well - this is Seouls fashion district where appearance matters'
            }
        ];
    }

    // Geolocation API Integration
    getCurrentLocation() {
        const locationStatus = document.getElementById('currentLocation');
        const locationInfo = document.getElementById('locationInfo');

        if (!navigator.geolocation) {
            this.handleLocationError('Geolocation is not supported by this browser');
            return;
        }

        locationStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting your location...';

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
        
        locationStatus.innerHTML = '<i class="fas fa-location-arrow"></i> Seoul, South Korea';
        
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

    handleLocationError(error) {
        const locationStatus = document.getElementById('currentLocation');
        const locationInfo = document.getElementById('locationInfo');
        
        locationStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Location unavailable';
        locationInfo.innerHTML = `
            <div class="error-state">
                <h3>⚠️ Location Access Needed</h3>
                <p>Enable location services to find nearby attractions and get personalized recommendations.</p>
                <button onclick="seoulExplorer.getCurrentLocation()" style="background: #667eea; color: white; border: none; padding: 8px 16px; border-radius: 20px; margin-top: 10px; cursor: pointer;">
                    Try Again
                </button>
            </div>
        `;
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
            <button class="location-card" data-location-id="${location.id}" onclick="seoulExplorer.showLocationDetails('${location.id}')">
                <div class="location-image">
                    <i class="${location.icon}"></i>
                </div>
                <div class="location-info">
                    <h3 class="location-name">${location.name}</h3>
                    <p class="location-description">${location.description}</p>
                    <div class="location-tags">
                        ${location.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="distance-info">Calculating distance...</div>
                </div>
            </button>
        `).join('');
    }

    // Show location details modal
    showLocationDetails(locationId) {
        const location = this.getSeoulLandmarks().find(l => l.id === locationId);
        if (!location) return;

        const modal = document.getElementById('modalOverlay');
        const modalContent = document.getElementById('modalContent');
        
        const isFavorite = this.favorites.includes(locationId);
        const favoriteIcon = isFavorite ? 'fas fa-heart' : 'far fa-heart';
        const favoriteText = isFavorite ? 'Remove from Favorites' : 'Add to Favorites';

        modalContent.innerHTML = `
            <div class="location-detail-header">
                <h2>${location.name}</h2>
                <p class="korean-name">${location.nameKorean}</p>
                <div class="location-tags" style="margin: 15px 0;">
                    ${location.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
            
            <div class="location-detail-content">
                <div class="description-section">
                    <h3>About This Place</h3>
                    <p>${location.longDescription}</p>
                </div>

                <div class="practical-info">
                    <h3>Practical Information</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <i class="fas fa-clock"></i>
                            <div>
                                <strong>Hours:</strong><br>
                                ${location.hours}
                            </div>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-won-sign"></i>
                            <div>
                                <strong>Entrance:</strong><br>
                                ${location.entrance}
                            </div>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-subway"></i>
                            <div>
                                <strong>Nearest Subway:</strong><br>
                                ${location.nearbySubway}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="tips-section">
                    <h3>💡 Insider Tips</h3>
                    <ul>
                        ${location.tips.map(tip => `<li>${tip}</li>`).join('')}
                    </ul>
                </div>

                <div class="cultural-tips">
                    <h3>🇰🇷 Cultural Insight</h3>
                    <p><em>${location.culturalTips}</em></p>
                </div>

                <div class="action-buttons">
                    <button class="favorite-btn" onclick="seoulExplorer.toggleFavorite('${locationId}')">
                        <i class="${favoriteIcon}"></i> ${favoriteText}
                    </button>
                    <button class="directions-btn" onclick="seoulExplorer.getDirections('${locationId}')">
                        <i class="fas fa-directions"></i> Get Directions
                    </button>
                </div>
            </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Close modal
        document.getElementById('closeModal').addEventListener('click', this.closeModal);
        document.getElementById('modalOverlay').addEventListener('click', (e) => {
            if (e.target === document.getElementById('modalOverlay')) {
                this.closeModal();
            }
        });

        // Refresh location
        document.getElementById('refreshLocation').addEventListener('click', () => {
            this.getCurrentLocation();
        });

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

    closeModal() {
        document.getElementById('modalOverlay').classList.remove('active');
        document.body.style.overflow = '';
    }

    toggleFavorite(locationId) {
        if (this.favorites.includes(locationId)) {
            this.favorites = this.favorites.filter(id => id !== locationId);
        } else {
            this.favorites.push(locationId);
        }
        
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
        this.showLocationDetails(locationId); // Refresh modal
    }

    getDirections(locationId) {
        const location = this.getSeoulLandmarks().find(l => l.id === locationId);
        if (!location) return;

        const destination = `${location.coordinates.lat},${location.coordinates.lng}`;
        const url = `https://maps.google.com/maps?daddr=${destination}&dirflg=w`;
        
        window.open(url, '_blank');
    }

    handleNavigation(section) {
        switch(section) {
            case 'favorites':
                this.showFavorites();
                break;
            case 'map':
                this.showMap();
                break;
            case 'guide':
                this.showGuide();
                break;
            default:
                this.showExplore();
        }
    }

    showFavorites() {
        const favoriteLocations = this.getSeoulLandmarks().filter(l => this.favorites.includes(l.id));
        const locationsGrid = document.getElementById('locationsGrid');
        const sectionTitle = document.querySelector('.locations-section h2');
        
        sectionTitle.textContent = '❤️ Your Favorite Places';
        
        if (favoriteLocations.length === 0) {
            locationsGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;">
                    <i class="far fa-heart" style="font-size: 3rem; margin-bottom: 20px; display: block;"></i>
                    <h3>No favorites yet</h3>
                    <p>Add locations to favorites to see them here</p>
                </div>
            `;
        } else {
            locationsGrid.innerHTML = favoriteLocations.map(location => `
                <button class="location-card" data-location-id="${location.id}" onclick="seoulExplorer.showLocationDetails('${location.id}')">
                    <div class="location-image">
                        <i class="${location.icon}"></i>
                    </div>
                    <div class="location-info">
                        <h3 class="location-name">${location.name}</h3>
                        <p class="location-description">${location.description}</p>
                        <div class="location-tags">
                            ${location.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                </button>
            `).join('');
        }
    }

    showMap() {
        // 이 메서드는 SeoulExplorerEnhanced에서 오버라이드됩니다
        console.log('기본 showMap 호출됨 - Enhanced 버전에서 처리됨');
    }

    showGuide() {
        const locationsGrid = document.getElementById('locationsGrid');
        const sectionTitle = document.querySelector('.locations-section h2');
        
        sectionTitle.textContent = '📖 Seoul Travel Guide';
        
        locationsGrid.innerHTML = `
            <div style="grid-column: 1/-1;">
                <div class="guide-content" style="background: white; padding: 25px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                    <h3>🇰🇷 Welcome to Seoul, Korea!</h3>
                    
                    <div style="margin: 20px 0;">
                        <h4>💰 Currency & Payments</h4>
                        <p>Korean Won (KRW) • Credit cards widely accepted • T-money card for subway</p>
                    </div>
                    
                    <div style="margin: 20px 0;">
                        <h4>🚇 Getting Around</h4>
                        <p>Subway system covers most attractions • Download "Citymapper" or "Subway Korea" apps • Buses have English announcements</p>
                    </div>
                    
                    <div style="margin: 20px 0;">
                        <h4>🍜 Food Culture</h4>
                        <p>Try Korean BBQ, bibimbap, and street food • Tipping is not expected • Many restaurants don't accept credit cards</p>
                    </div>
                    
                    <div style="margin: 20px 0;">
                        <h4>📱 Essential Apps</h4>
                        <p>Google Translate (with camera feature) • Papago (Naver translator) • KakaoMap for navigation</p>
                    </div>
                    
                    <div style="margin: 20px 0;">
                        <h4>🤝 Cultural Etiquette</h4>
                        <p>Bow when greeting • Remove shoes when entering homes • Both hands when giving/receiving items</p>
                    </div>
                </div>
            </div>
        `;
    }

    showExplore() {
        const sectionTitle = document.querySelector('.locations-section h2');
        sectionTitle.textContent = 'Popular Seoul Destinations';
        this.renderLocationCards();
        this.updateDistances();
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