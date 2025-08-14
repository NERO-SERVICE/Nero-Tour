// Seoul Explorer Enhanced with Google Maps Integration
class SeoulExplorerEnhanced extends SeoulExplorer {
    constructor() {
        super();
        this.mapsManager = null;
        this.isMapMode = false;
        this.userPosition = null;
        this.locationWatchId = null;
        this.locationUpdateInterval = null;
        this.nearbyMarkers = [];
        this.searchMarkers = [];
        this.currentInfoWindow = null;
        this.geocoder = null;
        this.currentAddress = null;
    }

    // 초기화 (기존 init 확장)
    async init() {
        // 기존 SeoulExplorer 초기화
        super.init();
        
        // // mapsManager를 먼저 초기화 (안전성 확보)
        // this.mapsManager = new GoogleMapsManager();
        
        // // 간소화된 API 키 검증
        // if (validateConfig()) {
        //     this.setupMapIntegration();
        // } else {
        //     console.warn('⚠️ API 키 문제, 지도 기능 제한');
        // }
        
        // // Explore 화면 위치 표시 즉시 초기화
        // this.updateExploreLocationDisplay();
        
    }

    // API 키 경고 표시
    showAPIKeyWarning() {
        const warningHTML = `
            <div class="api-warning">
                <h2>🔑 API 키 설정 필요</h2>
                <p>Google Maps 기능을 사용하려면 config.js 파일에서 API 키를 설정해주세요.</p>
                <ol>
                    <li><a href="https://console.cloud.google.com" target="_blank">Google Cloud Console</a> 방문</li>
                    <li>Maps JavaScript API, Places API, Directions API 활성화</li>
                    <li>API 키 생성 후 config.js에 입력</li>
                </ol>
                <button onclick="location.reload()" class="refresh-btn">새로고침</button>
            </div>
        `;
        
        document.querySelector('.main-content').innerHTML = warningHTML;
    }

    // Google Maps 통합 설정
    setupMapIntegration() {
        // Geocoder 초기화 (Google Maps API가 로드된 후)
        if (window.google && window.google.maps) {
            this.geocoder = new google.maps.Geocoder();
        }
        
        // 지도 탭 활성화 시 지도 초기화
        const mapTab = document.querySelector('[data-section="map"]');
        if (mapTab) {
            mapTab.addEventListener('click', () => {
                this.initializeMapIfNeeded();
            });
        } else {
            console.warn('지도 탭을 찾을 수 없습니다');
        }
    }

    // 필요 시에만 지도 초기화 (성능 최적화)
    async initializeMapIfNeeded() {
        
        // mapsManager 안전성 체크
        if (!this.mapsManager) {
            console.error('❌ mapsManager가 초기화되지 않았습니다');
            this.showMapError('지도 관리자가 초기화되지 않았습니다.');
            return;
        }
        
        if (!this.mapsManager.isInitialized) {
            try {
                await this.mapsManager.initializeMap('googleMap');
                this.mapsManager.addLandmarkMarkers(this.getSeoulLandmarks());
                
                // 사용자 위치가 있으면 표시
                if (this.currentLocation) {
                    this.mapsManager.addUserLocationMarker(this.currentLocation);
                }
                
            } catch (error) {
                console.error('❌ 지도 초기화 실패:', error);
                this.showMapError(error.message);
            }
        } else {
        }
    }

    // 지도 오류 표시
    showMapError(errorMessage) {
        const mapContainer = document.getElementById('googleMap');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div class="map-error">
                    <h3>⚠️ 지도 로딩 실패</h3>
                    <p>${errorMessage}</p>
                    <button onclick="location.reload()" class="retry-btn">다시 시도</button>
                </div>
            `;
        }
    }

    // 위치 성공 핸들러 확장 (Google Maps 연동)
    handleLocationSuccess() {
        // 부모 클래스 호출하지 않고 직접 구현
        const locationInfo = document.getElementById('locationInfo');
        
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
        
        // Google Maps에 사용자 위치 표시
        if (this.mapsManager && this.mapsManager.isInitialized) {
            this.mapsManager.addUserLocationMarker(this.currentLocation);
        }
        
        this.userPosition = this.currentLocation;
        
        // 상세 주소 표시 (헤더 업데이트)
        if (this.geocoder || (window.google && window.google.maps)) {
            this.getDetailedAddressForMainScreen(this.currentLocation);
        } else {
            // Google Maps API가 로드되지 않은 경우 기본 표시
            const locationStatus = document.getElementById('currentLocation');
            if (locationStatus) {
                locationStatus.textContent = 'Locating...';
            }
        }
    }
    
    // 메인 화면용 상세 주소 가져오기
    async getDetailedAddressForMainScreen(position) {
        
        if (!this.geocoder) {
            // Geocoder가 없으면 초기화
            if (window.google && window.google.maps) {
                this.geocoder = new google.maps.Geocoder();
            } else {
                // Google Maps API 로드를 기다렸다가 다시 시도
                setTimeout(() => {
                    this.getDetailedAddressForMainScreen(position);
                }, 2000);
                return;
            }
        }
        
        try {
            const results = await new Promise((resolve, reject) => {
                this.geocoder.geocode({
                    location: position, 
                    language: 'en',
                    region: 'US'
                }, (results, status) => {
                    if (status === 'OK') {
                        resolve(results);
                    } else {
                        reject(new Error(`Geocoding failed: ${status}`));
                    }
                });
            });
            
            if (results && results[0]) {
                const addressComponents = results[0].address_components;
                
                const address = this.parseEnglishAddress(addressComponents);
                this.currentAddress = address;
                
                // Update main screen location status in English
                const locationStatus = document.getElementById('currentLocation');
                if (locationStatus) {
                    const streetPart = address.street && address.street !== 'undefined' ? ` ${address.street}` : '';
                    const locationDisplay = `Seoul, ${address.district}${streetPart}`;
                    locationStatus.textContent = locationDisplay;
                }
                
                // Location updated in header - no need for separate explore section
                
            }
        } catch (error) {
            console.error('❌ 메인 화면 역지오코딩 오류:', error);
            
            // Fallback to default location display
            const locationStatus = document.getElementById('currentLocation');
            if (locationStatus) {
                locationStatus.textContent = 'Seoul, South Korea';
            }
        }
    }

    // 내비게이션 핸들러 확장 (지도 탭 추가)
    handleNavigation(section) {
        
        switch(section) {
            case 'map':
                this.showMapView();
                break;
            case 'favorites':
                this.showFavorites();
                break;
            case 'guide':
                this.showGuide();
                break;
            default:
                this.showExplore();
        }
    }

    // 지도 뷰 표시 (전체 화면)
    async showMapView() {
        this.isMapMode = true;
        
        // 앱 컨테이너를 전체 화면 지도 모드로 변경
        const appContainer = document.querySelector('.app-container');
        appContainer.classList.add('fullscreen-map-mode');
        
        // 헤더 숨기기
        const header = document.querySelector('.app-header');
        header.style.display = 'none';
        
        // 메인 콘텐츠를 전체 화면 지도로 교체
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <!-- 전체 화면 지도 컨테이너 -->
            <div id="fullscreenMapContainer" class="fullscreen-map-container">
                <!-- 지도 상단 컨트롤바 -->
                <div class="map-top-controls">
                    <button id="backToExplore" class="back-btn">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    
                    <div class="map-search-container">
                        <input type="text" id="mapSearch" placeholder="장소 검색...">
                        <button id="searchBtn"><i class="fas fa-search"></i></button>
                    </div>
                    
                    <div class="map-control-buttons">
                        <button id="myLocationBtn" class="control-btn">
                            <i class="fas fa-crosshairs"></i>
                        </button>
                        <button id="filterToggle" class="control-btn">
                            <i class="fas fa-filter"></i>
                        </button>
                    </div>
                </div>
                
                <!-- 필터 패널 (접힘/펼침 가능) -->
                <div id="filterPanel" class="filter-panel collapsed">
                    <div class="filter-buttons">
                        <button class="filter-btn active" data-category="all">전체</button>
                        <button class="filter-btn" data-category="historical">역사</button>
                        <button class="filter-btn" data-category="shopping">쇼핑</button>
                        <button class="filter-btn" data-category="nightlife">야경</button>
                        <button class="filter-btn" data-category="cultural">문화</button>
                        <button class="filter-btn" data-category="modern">현대</button>
                    </div>
                </div>
                
                <!-- Google Maps 전체 화면 -->
                <div id="googleMap" class="fullscreen-google-map">
                    <div class="map-loading">
                        <i class="fas fa-spinner fa-spin"></i>
                        <p>지도를 로딩 중...</p>
                    </div>
                </div>
                
                <!-- 현재 위치 정보 표시 -->
                <div id="locationStatus" class="location-status-overlay">
                    <i class="fas fa-location-arrow"></i>
                    <span id="locationText">Locating...</span>
                </div>
                
                <!-- 마커 정보 카드 (하단에서 올라오는 형태) -->
                <div id="markerInfoCard" class="marker-info-card hidden">
                    <div class="card-handle"></div>
                    <div class="card-content">
                        <!-- 마커 클릭 시 동적으로 채워짐 -->
                    </div>
                </div>
            </div>
        `;

        // 바텀 네비게이션 숨기기
        const bottomNav = document.querySelector('.bottom-nav');
        bottomNav.style.display = 'none';
        
        // 지도 초기화 및 실시간 위치 추적 시작
        await this.initializeFullscreenMap();
        this.startRealtimeLocationTracking();
        
        // 지도 컨트롤 이벤트 리스너 설정
        this.setupFullscreenMapControls();
    }

    // 지도 컨트롤 이벤트 설정
    setupMapControls() {
        // 내 위치 버튼
        const myLocationBtn = document.getElementById('myLocationBtn');
        if (myLocationBtn) {
            myLocationBtn.addEventListener('click', () => {
                if (this.currentLocation && this.mapsManager) {
                    this.mapsManager.centerOnUser(this.currentLocation);
                } else {
                    this.getCurrentLocation();
                }
            });
        }

        // 필터 버튼들
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                const category = e.target.dataset.category;
                this.filterMapMarkers(category);
            });
        });

        // 검색 기능
        const searchBtn = document.getElementById('searchBtn');
        const searchInput = document.getElementById('mapSearch');
        
        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', () => {
                this.searchPlaces(searchInput.value);
            });
            
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchPlaces(searchInput.value);
                }
            });
        }
    }

    // 마커 필터링
    filterMapMarkers(category) {
        if (this.mapsManager) {
            this.mapsManager.filterMarkersByCategory(category);
        }
    }

    // 장소 검색 (Enhanced with Places API)
    async searchPlaces(query) {
        if (!query.trim() || !this.mapsManager || !this.mapsManager.placesService) {
            console.warn('검색 불가능: 쿼리 없음 또는 Places 서비스 없음');
            return;
        }
        
        try {
            this.showSearchLoading(true);
            
            // 기존 검색 결과 마커 제거
            this.clearSearchMarkers();
            
            // Google Places Text Search with English language
            const request = {
                query: query,
                location: this.userPosition || { lat: 37.5665, lng: 126.9780 }, // Seoul center
                radius: 10000, // 10km radius
                language: 'en',
                region: 'US'
            };
            
            const results = await new Promise((resolve, reject) => {
                this.mapsManager.placesService.textSearch(request, (results, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        resolve(results);
                    } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
                        resolve([]); // 검색 결과 없음
                    } else {
                        reject(new Error(`Places API 오류: ${status}`));
                    }
                });
            });
            
            this.showSearchLoading(false);
            
            if (results && results.length > 0) {
                this.displaySearchResults(results);
                
                // 첫 번째 결과로 지도 중심 이동
                const firstResult = results[0];
                if (firstResult.geometry && firstResult.geometry.location) {
                    this.mapsManager.map.setCenter(firstResult.geometry.location);
                    this.mapsManager.map.setZoom(15);
                }
            } else {
                this.showSearchNoResults(query);
            }
            
        } catch (error) {
            console.error('검색 오류:', error);
            this.showSearchLoading(false);
            this.showSearchError(error.message);
        }
    }
    
    // 검색 로딩 상태 표시
    showSearchLoading(show) {
        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) {
            if (show) {
                searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                searchBtn.disabled = true;
            } else {
                searchBtn.innerHTML = '<i class="fas fa-search"></i>';
                searchBtn.disabled = false;
            }
        }
    }
    
    // 검색 결과 없음 표시
    showSearchNoResults(query) {
        const locationStatus = document.getElementById('locationStatus');
        if (locationStatus) {
            locationStatus.innerHTML = `
                <div class="search-status no-results">
                    <i class="fas fa-search"></i>
                    <span>No results found for "${query}"</span>
                </div>
            `;
            locationStatus.className = 'location-status-overlay error';
            
            // 3초 후 기본 상태로 복원
            setTimeout(() => {
                this.updateLocationStatus('Current Location', 'info');
            }, 3000);
        }
    }
    
    // 검색 오류 표시
    showSearchError(errorMessage) {
        const locationStatus = document.getElementById('locationStatus');
        if (locationStatus) {
            locationStatus.innerHTML = `
                <div class="search-status error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>Search error: ${errorMessage}</span>
                </div>
            `;
            locationStatus.className = 'location-status-overlay error';
            
            // 3초 후 기본 상태로 복원
            setTimeout(() => {
                this.updateLocationStatus('Current Location', 'info');
            }, 3000);
        }
    }
    
    // 검색 결과 표시 (지도에 마커로 표시)
    displaySearchResults(results) {
        
        if (!this.mapsManager || !this.mapsManager.map) {
            console.error('❌ 지도가 초기화되지 않아 검색 결과를 표시할 수 없습니다');
            return;
        }
        
        // 기존 검색 마커 제거
        this.clearSearchMarkers();
        
        let successCount = 0;
        
        results.forEach((place, index) => {
            try {
                if (!place.geometry || !place.geometry.location) {
                    console.warn(`⚠️ 검색 결과 ${index + 1}에 위치 정보 없음:`, place);
                    return;
                }
                
                // 검색 결과 마커 생성 (구별되는 스타일)
                const marker = new google.maps.Marker({
                    position: place.geometry.location,
                    map: this.mapsManager.map,
                    title: place.name,
                    icon: this.createSearchResultIcon(),
                    animation: google.maps.Animation.DROP,
                    optimized: false
                });
                
                // 검색 결과 정보창 내용 생성
                const infoWindowContent = this.createSearchInfoWindowContent(place);
                const infoWindow = new google.maps.InfoWindow({
                    content: infoWindowContent
                });
                
                // 마커 클릭 이벤트
                marker.addListener('click', () => {
                    
                    // 다른 정보창 닫기
                    if (this.currentInfoWindow) {
                        this.currentInfoWindow.close();
                    }
                    
                    // 정보창 열기
                    infoWindow.open(this.mapsManager.map, marker);
                    this.currentInfoWindow = infoWindow;
                    
                    // 지도 중심 이동 및 확대
                    this.mapsManager.map.setCenter(place.geometry.location);
                    this.mapsManager.map.setZoom(16);
                    
                    // 위치 상태 업데이트
                    this.updateLocationStatus(`📍 ${place.name}`, 'success');
                });
                
                this.searchMarkers.push({
                    marker: marker,
                    infoWindow: infoWindow,
                    data: place
                });
                
                successCount++;
                
            } catch (error) {
                console.error(`❌ 검색 마커 ${index + 1} 생성 실패:`, error, place);
            }
        });
        
        
        // 검색 결과 요약 표시
        const locationStatus = document.getElementById('locationStatus');
        if (locationStatus && successCount > 0) {
            locationStatus.innerHTML = `
                <div class="search-status success">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${successCount}개 장소를 찾았습니다</span>
                </div>
            `;
            locationStatus.className = 'location-status-overlay success';
        }
        
        // 검색 결과 범위로 지도 조정 (결과가 여러 개인 경우)
        if (successCount > 1) {
            const bounds = new google.maps.LatLngBounds();
            this.searchMarkers.forEach(markerObj => {
                bounds.extend(markerObj.marker.getPosition());
            });
            this.mapsManager.map.fitBounds(bounds);
        }
    }
    
    // 검색 결과 마커 아이콘 생성
    createSearchResultIcon() {
        return {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#FF4444', // 빨간색으로 구별
            fillOpacity: 0.9,
            strokeColor: '#ffffff',
            strokeWeight: 3,
            scale: 14 // 기본 마커보다 조금 크게
        };
    }
    
    // 검색 결과 정보창 콘텐츠 생성
    createSearchInfoWindowContent(place) {
        const rating = place.rating ? `⭐ ${place.rating.toFixed(1)}` : '평점 없음';
        const address = place.formatted_address || place.vicinity || '주소 정보 없음';
        const priceLevel = place.price_level ? '💰'.repeat(place.price_level) : '';
        
        return `
            <div class="search-info-window">
                <h3 class="place-name">${place.name}</h3>
                <div class="place-rating">${rating}</div>
                <div class="place-address">${address}</div>
                ${priceLevel ? `<div class="price-level">가격대: ${priceLevel}</div>` : ''}
                <div class="place-actions">
                    <button onclick="seoulExplorer.showPlaceDetails('${place.place_id}')" class="info-btn">
                        상세정보
                    </button>
                    <button onclick="seoulExplorer.getDirectionsToPlace('${place.place_id}')" class="info-btn">
                        길찾기
                    </button>
                </div>
            </div>
        `;
    }
    
    // 검색 마커 제거
    clearSearchMarkers() {
        this.searchMarkers.forEach(markerObj => {
            markerObj.marker.setMap(null);
            if (markerObj.infoWindow === this.currentInfoWindow) {
                this.currentInfoWindow = null;
            }
        });
        this.searchMarkers = [];
    }
    
    // 장소 상세 정보 표시 (Places API Details)
    async showPlaceDetails(placeId) {
        if (!this.mapsManager || !this.mapsManager.placesService) {
            console.error('❌ Places 서비스가 없어 상세 정보를 가져올 수 없습니다');
            return;
        }
        
        try {
            
            const request = {
                placeId: placeId,
                fields: ['name', 'formatted_address', 'formatted_phone_number', 'opening_hours', 'website', 'rating', 'photos', 'reviews']
            };
            
            const details = await new Promise((resolve, reject) => {
                this.mapsManager.placesService.getDetails(request, (place, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        resolve(place);
                    } else {
                        reject(new Error(`Places Details API 오류: ${status}`));
                    }
                });
            });
            
            this.displayPlaceDetailsModal(details);
            
        } catch (error) {
            console.error('❌ 상세 정보 가져오기 실패:', error);
            alert('상세 정보를 가져올 수 없습니다.');
        }
    }
    
    // 장소 상세 정보 모달 표시
    displayPlaceDetailsModal(place) {
        // 기존 모달 사용 또는 새 모달 생성
        let modal = document.getElementById('placeDetailsModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'placeDetailsModal';
            modal.className = 'modal-overlay';
            document.body.appendChild(modal);
        }
        
        const photos = place.photos ? place.photos.slice(0, 3).map(photo => 
            `<img src="${photo.getUrl({maxWidth: 300, maxHeight: 200})}" alt="${place.name}" class="place-photo">`
        ).join('') : '';
        
        const reviews = place.reviews ? place.reviews.slice(0, 2).map(review => 
            `<div class="review">
                <div class="review-author">⭐ ${review.rating} - ${review.author_name}</div>
                <p class="review-text">${review.text.substring(0, 150)}...</p>
            </div>`
        ).join('') : '<p>리뷰가 없습니다.</p>';
        
        modal.innerHTML = `
            <div class="place-details-modal">
                <div class="modal-header">
                    <h2>${place.name}</h2>
                    <button class="close-modal" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-content">
                    ${photos ? `<div class="place-photos">${photos}</div>` : ''}
                    
                    <div class="place-info">
                        <div class="info-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${place.formatted_address}</span>
                        </div>
                        
                        ${place.formatted_phone_number ? `
                            <div class="info-item">
                                <i class="fas fa-phone"></i>
                                <span>${place.formatted_phone_number}</span>
                            </div>
                        ` : ''}
                        
                        ${place.website ? `
                            <div class="info-item">
                                <i class="fas fa-globe"></i>
                                <a href="${place.website}" target="_blank">웹사이트 방문</a>
                            </div>
                        ` : ''}
                        
                        ${place.rating ? `
                            <div class="info-item">
                                <i class="fas fa-star"></i>
                                <span>평점: ${place.rating}/5</span>
                            </div>
                        ` : ''}
                        
                        ${place.opening_hours ? `
                            <div class="info-item">
                                <i class="fas fa-clock"></i>
                                <span>${place.opening_hours.isOpen() ? '영업 중' : '영업 종료'}</span>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="place-reviews">
                        <h3>리뷰</h3>
                        ${reviews}
                    </div>
                </div>
            </div>
        `;
        
        modal.style.display = 'flex';
    }
    
    // 검색된 장소로 길찾기
    async getDirectionsToPlace(placeId) {
        
        if (!this.userPosition) {
            alert('Current location not available. Please enable location services.');
            return;
        }
        
        // 검색 마커에서 해당 장소 찾기
        const targetMarker = this.searchMarkers.find(markerObj => 
            markerObj.data.place_id === placeId
        );
        
        if (!targetMarker) {
            console.error('❌ 대상 장소를 찾을 수 없습니다');
            return;
        }
        
        try {
            const result = await this.mapsManager.calculateRoute(
                this.userPosition,
                targetMarker.marker.getPosition(),
                'WALKING'
            );
            
            
            // 경로 정보 표시
            const route = result.routes[0];
            const leg = route.legs[0];
            
            this.updateLocationStatus(
                `🚶 ${leg.duration.text} (${leg.distance.text})`, 
                'success'
            );
            
        } catch (error) {
            console.error('❌ 길찾기 실패:', error);
            alert('길찾기를 할 수 없습니다.');
        }
    }

    // 지도에서 마커 클릭 시 호출
    onMapMarkerClick(landmark) {
        const locationInfo = document.getElementById('locationInfo');
        if (locationInfo) {
            locationInfo.innerHTML = `
                <h3>${landmark.name}</h3>
                <p class="korean-name">${landmark.nameKorean}</p>
                <p class="description">${landmark.description}</p>
                <div class="quick-actions">
                    <button onclick="seoulExplorer.showLocationDetails('${landmark.id}')" class="quick-btn">
                        상세정보
                    </button>
                </div>
            `;
        }
    }

    // 전체 화면 지도 초기화
    async initializeFullscreenMap() {
        
        // mapsManager 안전성 체크
        if (!this.mapsManager) {
            console.error('❌ mapsManager가 없습니다');
            this.showMapError('지도 관리자가 초기화되지 않았습니다.');
            return;
        }
        
        // Google Maps API 즉시 확인 (대기 없음)
        if (!window.google || !window.google.maps) {
            console.error('❌ Google Maps API가 로드되지 않았습니다');
            this.showMapError('Google Maps API 로드 대기 중입니다. 잠시만 기다려주세요.');
            // API 로드 완료 후 자동 재시도
            window.addEventListener('google-maps-loaded', () => {
                this.initializeFullscreenMap();
            }, { once: true }); // 한 번만 실행
            return;
        }
        
        try {
            
            // 기존 지도가 있으면 재사용
            if (this.mapsManager.isInitialized && this.mapsManager.map) {
                this.setupExistingMap();
                return;
            }
            
            // 새 지도 생성
            await this.mapsManager.initializeMap('googleMap');
            
            // Geocoder 초기화
            this.geocoder = new google.maps.Geocoder();
            
            // 전체 화면 모드 설정
            this.mapsManager.map.setOptions({
                fullscreenControl: false,
                mapTypeControl: false,
                streetViewControl: false,
                zoomControl: false,
                gestureHandling: 'greedy' // 터치 반응성 개선
            });
            
            // 즉시 마커 표시 (idle 이벤트 대기 없음)
            this.displayLocationMarkers();
            
            // 사용자 위치가 있으면 표시
            if (this.currentLocation) {
                this.mapsManager.addUserLocationMarker(this.currentLocation);
                this.mapsManager.centerOnUser(this.currentLocation);
            }
            
            
        } catch (error) {
            console.error('❌ 지도 초기화 실패:', error);
            this.showMapError(error.message);
        }
    }

    // 기존 지도 설정 (재사용)
    setupExistingMap() {
        // 전체 화면 모드 설정
        this.mapsManager.map.setOptions({
            fullscreenControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            zoomControl: false,
            gestureHandling: 'greedy'
        });
        
        // 마커 즉시 표시
        this.displayLocationMarkers();
        
        // 사용자 위치 표시
        if (this.currentLocation) {
            this.mapsManager.addUserLocationMarker(this.currentLocation);
            this.mapsManager.centerOnUser(this.currentLocation);
        }
        
    }

    // 최적화된 위치 추적
    startRealtimeLocationTracking() {
        if (!navigator.geolocation) {
            this.updateLocationStatus('Location services not available', 'error');
            return;
        }
        
        // 빠른 위치 요청 (timeout 단축)
        navigator.geolocation.getCurrentPosition(
            (position) => this.handleRealtimeLocationUpdate(position),
            (error) => this.handleLocationError(error),
            { enableHighAccuracy: false, timeout: 3000, maximumAge: 60000 } // 성능 최적화
        );
        
        // 위치 추적 간격 늘림 (배터리 절약)
        this.locationWatchId = navigator.geolocation.watchPosition(
            (position) => this.handleRealtimeLocationUpdate(position),
            (error) => this.handleLocationError(error),
            {
                enableHighAccuracy: false,
                timeout: 3000,
                maximumAge: 10000 // 10초 캐시
            }
        );
        
    }

    // 실시간 위치 업데이트 핸들러
    handleRealtimeLocationUpdate(position) {
        const newPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        
        this.userPosition = newPosition;
        this.currentLocation = newPosition; // 기존 변수와 호환성
        
        // 지도에 사용자 위치 마커 업데이트
        if (this.mapsManager && this.mapsManager.isInitialized) {
            this.mapsManager.addUserLocationMarker(newPosition);
            
            // 첫 번째 위치 획득 시 지도 중심 이동
            if (!this.hasInitialLocation) {
                this.mapsManager.centerOnUser(newPosition);
                this.hasInitialLocation = true;
            }
        }
        
        // 역지오코딩으로 상세 주소 가져오기
        this.getDetailedAddress(newPosition);
        
        // 주변 장소 기반 마커 업데이트
        this.updateNearbyMarkers();
        
    }

    // 역지오코딩으로 상세 주소 가져오기
    async getDetailedAddress(position) {
        if (!this.geocoder) return;
        
        try {
            const results = await new Promise((resolve, reject) => {
                this.geocoder.geocode({ 
                    location: position,
                    language: 'en',
                    region: 'US'
                }, (results, status) => {
                    if (status === 'OK') {
                        resolve(results);
                    } else {
                        reject(new Error(`Geocoding failed: ${status}`));
                    }
                });
            });
            
            if (results && results[0]) {
                const addressComponents = results[0].address_components;
                const address = this.parseEnglishAddress(addressComponents);
                this.currentAddress = address;
                
                // Update location status with detailed address
                const streetPart = address.street && address.street !== 'undefined' ? ` ${address.street}` : '';
                const locationDisplay = `Seoul, ${address.district}${streetPart}`;
                this.updateLocationStatus(locationDisplay, 'success');
                
                // Location updated automatically
                
            }
        } catch (error) {
            console.error('역지오코딩 오류:', error);
            this.updateLocationStatus('Tracking location', 'success');
        }
    }
    
    // 한국 주소 파싱
    parseEnglishAddress(components) {
        
        const address = {
            city: 'Seoul',
            district: '',
            street: '',
            fullAddress: ''
        };
        
        // Store full address first
        const formatted = components.find(comp => comp.types.includes('route') || comp.types.includes('premise'));
        if (formatted) {
            address.fullAddress = formatted.long_name;
        }
        
        components.forEach(component => {
            const types = component.types;
            const longName = component.long_name;
            
            // District level (Jung-gu, Gangnam-gu, etc.)
            if (types.includes('sublocality_level_1') || types.includes('administrative_area_level_2')) {
                address.district = longName;
            }
            // Street or specific area
            else if (types.includes('route')) {
                address.street = longName;
            }
            // More specific locality
            else if (types.includes('sublocality_level_2') || types.includes('sublocality_level_3')) {
                if (!address.street) address.street = longName;
            }
        });
        
        // Set defaults if information is missing
        if (!address.district) address.district = 'Jung-gu';
        
        // Clean and format English address
        address.district = this.formatEnglishDistrict(address.district);
        if (address.street) {
            address.street = this.formatEnglishStreet(address.street);
        }
        
        return address;
    }
    
    // Format district names for English display
    formatEnglishDistrict(district) {
        if (!district) return '';
        
        // Convert Korean district names to English format
        const koreanToEnglish = {
            '서울특별시': 'Seoul',
            '중구': 'Jung-gu',
            '강남구': 'Gangnam-gu',
            '명동': 'Myeong-dong',
            '강남동': 'Gangnam-dong',
            '홍대입구': 'Hongdae',
            '북촌': 'Bukchon',
            '종로구': 'Jongno-gu',
            '용산구': 'Yongsan-gu',
            '서대문구': 'Seodaemun-gu',
            '마포구': 'Mapo-gu',
            '성동구': 'Seongdong-gu',
            '광진구': 'Gwangjin-gu',
            '송파구': 'Songpa-gu'
        };
        
        return koreanToEnglish[district] || district;
    }

    formatEnglishStreet(street) {
        if (!street) return '';
        
        // Keep English street names as is, translate common Korean terms
        const koreanToEnglish = {
            '로': 'ro',
            '길': 'gil',
            '대로': 'daero',
            '가': 'ga'
        };
        
        let formatted = street;
        for (const [korean, english] of Object.entries(koreanToEnglish)) {
            formatted = formatted.replace(new RegExp(korean + '$'), english);
        }
        
        return formatted;
    }

    // 위치 상태 업데이트
    updateLocationStatus(message, type = 'info') {
        const locationText = document.getElementById('locationText');
        if (locationText) {
            locationText.textContent = message;
            
            const statusOverlay = document.getElementById('locationStatus');
            statusOverlay.className = `location-status-overlay ${type}`;
        }
    }

    // DB 장소들을 마커로 표시
    displayLocationMarkers() {
        const landmarks = this.getSeoulLandmarks();
        
        if (!this.mapsManager || !this.mapsManager.isInitialized) {
            console.error('❌ 지도가 초기화되지 않아 마커를 표시할 수 없습니다');
            return;
        }

        if (!this.mapsManager.map) {
            console.error('❌ 지도 인스턴스가 없어 마커를 표시할 수 없습니다');
            return;
        }
        
        // Google Maps API 확인
        if (!window.google || !window.google.maps) {
            console.error('❌ Google Maps API가 로드되지 않아 마커를 생성할 수 없습니다');
            return;
        }
        
        // 기존 마커 제거
        this.clearNearbyMarkers();
        
        landmarks.forEach((landmark, index) => {
            
            try {
                // 좌표가 유효한지 확인
                if (!landmark.coordinates || typeof landmark.coordinates.lat !== 'number' || typeof landmark.coordinates.lng !== 'number') {
                    console.error(`❌ 잘못된 좌표 데이터:`, landmark.coordinates);
                    return;
                }
                
                const marker = new google.maps.Marker({
                    position: landmark.coordinates,
                    map: this.mapsManager.map,
                    title: landmark.name,
                    icon: this.createCustomMarkerIcon(landmark.category.toLowerCase()),
                    animation: google.maps.Animation.DROP,
                    optimized: false // 커스텀 아이콘의 경우 최적화 비활성화
                });


                // 마커 클릭 이벤트
                marker.addListener('click', () => {
                    this.showMarkerInfo(landmark);
                });

                this.nearbyMarkers.push({
                    marker: marker,
                    data: landmark
                });
                
            } catch (error) {
                console.error(`❌ 마커 ${index + 1} 생성 실패:`, error, landmark);
            }
        });
        
        
        // 마커 바운드 계산 및 지도 중심 조정
        if (this.nearbyMarkers.length > 0) {
            const bounds = new google.maps.LatLngBounds();
            
            this.nearbyMarkers.forEach((markerObj, index) => {
                const position = markerObj.marker.getPosition();
                bounds.extend(position);
            });
            
            // 사용자 위치가 없으면 모든 마커가 보이도록 지도 조정
            if (!this.currentLocation) {
                this.mapsManager.map.fitBounds(bounds);
            }
        }
    }

    // 커스텀 마커 아이콘 생성
    createCustomMarkerIcon(category) {
        const iconConfig = {
            historical: { color: '#D32F2F' },
            shopping: { color: '#FF6B6B' },
            nightlife: { color: '#9C27B0' },
            cultural: { color: '#FF9800' },
            modern: { color: '#2196F3' },
            landmark: { color: '#4CAF50' }
        };

        const config = iconConfig[category] || iconConfig['landmark'];
        
        return {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: config.color,
            fillOpacity: 0.8,
            strokeColor: '#ffffff',
            strokeWeight: 2,
            scale: 12,
            anchor: new google.maps.Point(0, 0)
        };
    }

    // 주변 마커 업데이트 (거리 기반 필터링)
    updateNearbyMarkers() {
        if (!this.userPosition) return;
        
        this.nearbyMarkers.forEach(markerObj => {
            const distance = this.calculateDistance(
                this.userPosition.lat,
                this.userPosition.lng,
                markerObj.data.coordinates.lat,
                markerObj.data.coordinates.lng
            );
            
            // 10km 이내의 마커만 표시
            if (distance <= 10) {
                markerObj.marker.setVisible(true);
                // 거리에 따라 마커 크기 조절
                const scale = Math.max(10, 20 - distance);
                markerObj.marker.setIcon({
                    ...markerObj.marker.getIcon(),
                    scale: scale
                });
            } else {
                markerObj.marker.setVisible(false);
            }
        });
    }

    // 마커 정보 표시 (하단 카드)
    showMarkerInfo(landmark) {
        const infoCard = document.getElementById('markerInfoCard');
        const cardContent = infoCard.querySelector('.card-content');
        
        // 거리 계산
        let distanceText = '';
        if (this.userPosition) {
            const distance = this.calculateDistance(
                this.userPosition.lat,
                this.userPosition.lng,
                landmark.coordinates.lat,
                landmark.coordinates.lng
            );
            distanceText = `<div class="distance-badge">${distance.toFixed(1)}km</div>`;
        }
        
        cardContent.innerHTML = `
            <div class="marker-info-header">
                <div class="info-title">
                    <h3>${landmark.name}</h3>
                    <p class="korean-name">${landmark.nameKorean}</p>
                </div>
                ${distanceText}
            </div>
            
            <div class="info-description">
                <p>${landmark.description}</p>
            </div>
            
            <div class="info-details">
                <div class="detail-item">
                    <i class="fas fa-clock"></i>
                    <span>${landmark.hours}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-won-sign"></i>
                    <span>${landmark.entrance}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-subway"></i>
                    <span>${landmark.nearbySubway}</span>
                </div>
            </div>
            
            <div class="info-tags">
                ${landmark.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            
            <div class="info-actions">
                <button onclick="seoulExplorer.showLocationDetails('${landmark.id}')" class="action-button primary">
                    <i class="fas fa-info-circle"></i> 상세정보
                </button>
                <button onclick="seoulExplorer.getDirections('${landmark.id}')" class="action-button secondary">
                    <i class="fas fa-directions"></i> 길찾기
                </button>
            </div>
        `;
        
        // 카드 표시
        infoCard.classList.remove('hidden');
        setTimeout(() => infoCard.classList.add('visible'), 100);
        
        // 지도 중심을 마커로 이동
        this.mapsManager.map.panTo(landmark.coordinates);
    }

    // 전체 화면 지도 컨트롤 설정
    setupFullscreenMapControls() {
        // 뒤로가기 버튼 - index.html로 이동
        const backBtn = document.getElementById('backToExplore');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }

        // 내 위치 버튼
        const myLocationBtn = document.getElementById('myLocationBtn');
        if (myLocationBtn) {
            myLocationBtn.addEventListener('click', () => {
                if (this.userPosition && this.mapsManager) {
                    this.mapsManager.centerOnUser(this.userPosition);
                    this.mapsManager.map.setZoom(16);
                } else {
                    this.startRealtimeLocationTracking();
                }
            });
        }

        // 필터 토글 버튼
        const filterToggle = document.getElementById('filterToggle');
        if (filterToggle) {
            filterToggle.addEventListener('click', () => {
                const filterPanel = document.getElementById('filterPanel');
                filterPanel.classList.toggle('collapsed');
            });
        }

        // 필터 버튼들
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                const category = e.target.dataset.category;
                this.filterMarkersByCategory(category);
            });
        });

        // 검색 기능
        const searchBtn = document.getElementById('searchBtn');
        const searchInput = document.getElementById('mapSearch');
        
        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', () => {
                this.searchPlaces(searchInput.value);
            });
            
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchPlaces(searchInput.value);
                }
            });
        }

        // 마커 정보 카드 닫기 (카드 외부 클릭)
        const infoCard = document.getElementById('markerInfoCard');
        if (infoCard) {
            infoCard.addEventListener('click', (e) => {
                if (e.target === infoCard) {
                    this.hideMarkerInfo();
                }
            });
        }
    }

    // 마커 카테고리 필터링
    filterMarkersByCategory(category) {
        this.nearbyMarkers.forEach(markerObj => {
            if (category === 'all' || markerObj.data.category === category) {
                markerObj.marker.setVisible(true);
            } else {
                markerObj.marker.setVisible(false);
            }
        });
    }

    // 마커 정보 카드 숨기기
    hideMarkerInfo() {
        const infoCard = document.getElementById('markerInfoCard');
        infoCard.classList.remove('visible');
        setTimeout(() => infoCard.classList.add('hidden'), 300);
    }

    // 주변 마커 제거
    clearNearbyMarkers() {
        this.nearbyMarkers.forEach(markerObj => {
            markerObj.marker.setMap(null);
        });
        this.nearbyMarkers = [];
    }

    // 전체 화면 지도 종료
    exitFullscreenMap() {
        this.isMapMode = false;
        
        // 위치 추적 중지
        if (this.locationWatchId) {
            navigator.geolocation.clearWatch(this.locationWatchId);
            this.locationWatchId = null;
        }
        
        // UI 복원
        const appContainer = document.querySelector('.app-container');
        appContainer.classList.remove('fullscreen-map-mode');
        
        const header = document.querySelector('.app-header');
        header.style.display = 'block';
        
        const bottomNav = document.querySelector('.bottom-nav');
        bottomNav.style.display = 'flex';
        
        // 마커 정리
        this.clearNearbyMarkers();
        this.clearSearchMarkers();
        
        // Explore 뷰로 복귀
        this.showExplore();
        
        // 네비게이션 상태 업데이트
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        document.querySelector('[data-section="explore"]').classList.add('active');
    }

    // Explore 뷰로 복귀 (향상된 위치 표시)
    showExplore() {
        this.isMapMode = false;
        
        // 기본 Explore 뷰 표시
        const sectionTitle = document.querySelector('.locations-section h2');
        if (sectionTitle) {
            sectionTitle.textContent = 'Popular Seoul Destinations';
        }
        this.renderLocationCards();
        this.updateDistances();
        
        // 실시간 위치 표시 개선
        this.updateExploreLocationDisplay();
    }
    
    // Explore 화면 위치 표시 업데이트
    updateExploreLocationDisplay() {
        const locationCard = document.querySelector('.current-location-card');
        if (locationCard) {
            const cardHeader = locationCard.querySelector('.card-header h2');
            const locationInfo = locationCard.querySelector('.location-info');
            
            if (this.currentAddress) {
                // 상세 주소가 있는 경우
                const locationDisplay = `${this.currentAddress.district} ${this.currentAddress.neighborhood}`;
                cardHeader.innerHTML = `📍 ${locationDisplay}`;
                
                locationInfo.innerHTML = `
                    <div class="current-location-details">
                        <div class="address-info">
                            <h3>현재 위치</h3>
                            <p class="full-address">${this.currentAddress.city} ${this.currentAddress.district} ${this.currentAddress.neighborhood}</p>
                        </div>
                        <div class="location-stats">
                            <div class="stat-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>정확도: 높음</span>
                            </div>
                            <div class="stat-item">
                                <i class="fas fa-clock"></i>
                                <span>실시간 추적</span>
                            </div>
                        </div>
                    </div>
                `;
            } else if (this.currentLocation) {
                // 좌표만 있는 경우
                cardHeader.innerHTML = `📍 현재 위치`;
                locationInfo.innerHTML = `
                    <div class="current-location-details">
                        <div class="address-info">
                            <h3>위치 정보 로딩 중...</h3>
                            <p class="coordinates">위도: ${this.currentLocation.lat.toFixed(6)}, 경도: ${this.currentLocation.lng.toFixed(6)}</p>
                        </div>
                        <div class="location-stats">
                            <div class="stat-item">
                                <i class="fas fa-spinner fa-spin"></i>
                                <span>주소 확인 중</span>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                // 위치 정보가 없는 경우
                cardHeader.innerHTML = `📍 위치 확인`;
                locationInfo.innerHTML = `
                    <div class="current-location-details">
                        <div class="address-info">
                            <h3>위치 서비스 활성화 필요</h3>
                            <p class="status-message">정확한 위치 정보를 위해 위치 서비스를 허용해주세요</p>
                        </div>
                        <div class="location-stats">
                            <div class="stat-item">
                                <i class="fas fa-exclamation-triangle"></i>
                                <span>위치 권한 필요</span>
                            </div>
                        </div>
                    </div>
                `;
            }
        }
    }
    
    // 위치 업데이트 시 Explore 화면도 함께 업데이트
    updateExploreLocationOnChange() {
        if (!this.isMapMode) {
            this.updateExploreLocationDisplay();
        }
    }
}

// Google Maps API 로드 완료 후 호출되는 전역 콜백
// filepath: /Users/hoyeon/workspace/nero_tour/enhanced-app.js
/*...*/
function initializeGoogleMaps() {

    // API 로드 완료 이벤트 발생
    window.dispatchEvent(new Event('google-maps-loaded'));

    // 기존 SeoulExplorer를 Enhanced 버전으로 교체
    if (window.seoulExplorer) {
        // 기존 위치 정보 보존
        const existingLocation = window.seoulExplorer.currentLocation;
        const existingFavorites = window.seoulExplorer.favorites;

        // 새로운 Enhanced 인스턴스 생성 (기존 데이터 보존)
        window.seoulExplorer = new SeoulExplorerEnhanced();

        // MapsManager 인스턴스 생성 및 할당
        window.seoulExplorer.mapsManager = new GoogleMapsManager(); // 이 부분을 추가
        window.mapsManager = window.seoulExplorer.mapsManager;

        // 기존 데이터 복원
        if (existingLocation) {
            window.seoulExplorer.currentLocation = existingLocation;
            window.seoulExplorer.getDetailedAddressForMainScreen(existingLocation);
        }
        if (existingFavorites) {
            window.seoulExplorer.favorites = existingFavorites;
        }

    } else {
        // 새로운 Enhanced 인스턴스 생성
        window.seoulExplorer = new SeoulExplorerEnhanced();

        // MapsManager 인스턴스 생성 및 할당
        window.seoulExplorer.mapsManager = new GoogleMapsManager(); // 이 부분을 추가
        window.mapsManager = window.seoulExplorer.mapsManager;
    }
}

// DOM 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', () => {
    // Google Maps API가 이미 로드되어 있다면
    if (window.google && window.google.maps) {
        initializeGoogleMaps();
    } else {
        // API 로드를 기다림
        window.initializeGoogleMaps = initializeGoogleMaps;
    }
});

// Enhanced 클래스를 전역에서 사용할 수 있도록
window.SeoulExplorerEnhanced = SeoulExplorerEnhanced;