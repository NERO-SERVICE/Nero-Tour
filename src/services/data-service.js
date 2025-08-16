/**
 * Data Service
 * 데이터 로딩 및 관리 서비스
 * 
 * Firebase Firestore와 연동하여 데이터를 관리합니다.
 * 오프라인 모드에서는 로컬 더미 데이터를 사용합니다.
 */

import { 
    landmarks, 
    getLandmarksByCategory, 
    getLandmarkById, 
    getNearbyLandmarks,
    categories,
    getAllCategories,
    getCategoryById,
    validateLandmark,
    validateCoordinates
} from '../data/index.js';

class DataService {
    constructor() {
        this.cache = new Map();
        this.cacheTTL = 5 * 60 * 1000; // 5분 캐시
        this.isOnline = navigator.onLine;
        this.apiBaseUrl = null; // 향후 API URL 설정
        this.db = null; // Firebase Firestore 인스턴스
        this.isFirebaseReady = false;
        
        // Firebase 초기화 대기
        this.initFirebase();
        
        // 온라인/오프라인 상태 감지
        window.addEventListener('online', () => {
            this.isOnline = true;
            console.log('📶 Online mode: Firebase/API calls available');
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            console.log('📵 Offline mode: Using cached data');
        });
    }

    /**
     * Firebase 초기화 대기
     */
    async initFirebase() {
        let attempts = 0;
        const maxAttempts = 50; // 5초 대기

        while (attempts < maxAttempts) {
            if (window.Firebase && window.Firebase.db && window.Firebase.isInitialized()) {
                this.db = window.Firebase.db;
                this.isFirebaseReady = true;
                console.log('✅ Firebase connected to DataService');
                
                // Firebase 상태 확인
                const status = window.Firebase.getStatus();
                console.log('🔥 Firebase services status:', status);
                
                return true;
            }
            
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }

        console.warn('⚠️ Firebase not available - using local data only');
        console.warn('🔍 Firebase status:', window.Firebase?.getStatus() || 'Not available');
        return false;
    }

    /**
     * 모든 랜드마크 데이터를 가져옵니다
     * @returns {Promise<Array>} 랜드마크 배열
     */
    async getAllLandmarks() {
        try {
            // 캐시 확인
            const cached = this.getCachedData('landmarks:all');
            if (cached) {
                console.log('📁 Using cached landmarks data');
                return cached;
            }

            // Firebase에서 가져오기
            if (this.isOnline && this.isFirebaseReady) {
                try {
                    console.log('🔥 Loading landmarks from Firebase');
                    const querySnapshot = await this.db.collection('landmarks').get();
                    const data = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        image: this.resolveImagePath(doc.data().image)
                    }));
                    
                    // 캐시에 저장
                    this.setCachedData('landmarks:all', data);
                    console.log(`✅ Loaded ${data.length} landmarks from Firebase`);
                    return data;
                } catch (firebaseError) {
                    console.warn('⚠️ Firebase error, falling back to local data:', firebaseError);
                }
            }

            // API 호출 (향후 확장용)
            if (this.isOnline && this.apiBaseUrl) {
                return await this.fetchFromApi('/landmarks');
            }

            // 로컬 더미 데이터 사용
            console.log('🏗️ Loading landmarks from local data');
            const data = landmarks.map(landmark => ({
                ...landmark,
                image: this.resolveImagePath(landmark.image)
            }));

            // 캐시에 저장
            this.setCachedData('landmarks:all', data);
            return data;

        } catch (error) {
            console.error('❌ Error loading landmarks:', error);
            // 에러 시 더미 데이터 fallback
            return landmarks.map(landmark => ({
                ...landmark,
                image: this.resolveImagePath(landmark.image)
            }));
        }
    }

    /**
     * 카테고리별 랜드마크를 가져옵니다
     * @param {string} categoryId - 카테고리 ID
     * @returns {Promise<Array>} 해당 카테고리의 랜드마크 배열
     */
    async getLandmarksByCategory(categoryId) {
        try {
            const cacheKey = `landmarks:category:${categoryId}`;
            const cached = this.getCachedData(cacheKey);
            if (cached) {
                return cached;
            }

            // 향후 API 호출
            if (this.isOnline && this.apiBaseUrl) {
                return await this.fetchFromApi(`/landmarks?category=${categoryId}`);
            }

            // 더미 데이터에서 필터링
            const data = getLandmarksByCategory(categoryId).map(landmark => ({
                ...landmark,
                image: this.resolveImagePath(landmark.image)
            }));

            this.setCachedData(cacheKey, data);
            return data;

        } catch (error) {
            console.error(`❌ Error loading landmarks for category ${categoryId}:`, error);
            return getLandmarksByCategory(categoryId);
        }
    }

    /**
     * ID로 특정 랜드마크를 가져옵니다
     * @param {string} landmarkId - 랜드마크 ID
     * @returns {Promise<Object|null>} 랜드마크 객체 또는 null
     */
    async getLandmarkById(landmarkId) {
        try {
            const cacheKey = `landmark:${landmarkId}`;
            const cached = this.getCachedData(cacheKey);
            if (cached) {
                return cached;
            }

            // Firebase에서 가져오기
            if (this.isOnline && this.isFirebaseReady) {
                try {
                    console.log(`🔥 Loading landmark ${landmarkId} from Firebase`);
                    const doc = await this.db.collection('landmarks').doc(landmarkId).get();
                    if (doc.exists) {
                        const data = {
                            id: doc.id,
                            ...doc.data(),
                            image: this.resolveImagePath(doc.data().image),
                            detailSections: doc.data().detailSections?.map(section => ({
                                ...section,
                                image: this.resolveImagePath(section.image)
                            }))
                        };

                        this.setCachedData(cacheKey, data);
                        console.log(`✅ Loaded landmark ${landmarkId} from Firebase`);
                        return data;
                    }
                } catch (firebaseError) {
                    console.warn(`⚠️ Firebase error for landmark ${landmarkId}, falling back to local data:`, firebaseError);
                }
            }

            // API 호출 (향후 확장용)
            if (this.isOnline && this.apiBaseUrl) {
                return await this.fetchFromApi(`/landmarks/${landmarkId}`);
            }

            // 로컬 더미 데이터에서 검색
            const landmark = getLandmarkById(landmarkId);
            if (landmark) {
                const data = {
                    ...landmark,
                    image: this.resolveImagePath(landmark.image),
                    detailSections: landmark.detailSections?.map(section => ({
                        ...section,
                        image: this.resolveImagePath(section.image)
                    }))
                };

                this.setCachedData(cacheKey, data);
                return data;
            }

            return null;

        } catch (error) {
            console.error(`❌ Error loading landmark ${landmarkId}:`, error);
            const fallbackLandmark = getLandmarkById(landmarkId);
            if (fallbackLandmark) {
                return {
                    ...fallbackLandmark,
                    image: this.resolveImagePath(fallbackLandmark.image),
                    detailSections: fallbackLandmark.detailSections?.map(section => ({
                        ...section,
                        image: this.resolveImagePath(section.image)
                    }))
                };
            }
            return null;
        }
    }

    /**
     * 현재 위치 기준으로 가까운 랜드마크를 가져옵니다
     * @param {Object} coordinates - 좌표 {lat, lng}
     * @param {number} limit - 반환할 개수 (기본값: 3)
     * @returns {Promise<Array>} 거리순으로 정렬된 랜드마크 배열
     */
    async getNearbyLandmarks(coordinates, limit = 3) {
        try {
            if (!validateCoordinates(coordinates)) {
                throw new Error('Invalid coordinates provided');
            }

            const cacheKey = `landmarks:nearby:${coordinates.lat}:${coordinates.lng}:${limit}`;
            const cached = this.getCachedData(cacheKey);
            if (cached) {
                return cached;
            }

            // 향후 API 호출
            if (this.isOnline && this.apiBaseUrl) {
                return await this.fetchFromApi(
                    `/landmarks/nearby?lat=${coordinates.lat}&lng=${coordinates.lng}&limit=${limit}`
                );
            }

            // 더미 데이터에서 계산
            const data = getNearbyLandmarks(coordinates, limit).map(landmark => ({
                ...landmark,
                image: this.resolveImagePath(landmark.image)
            }));

            this.setCachedData(cacheKey, data, 2 * 60 * 1000); // 2분 캐시 (위치는 자주 변경됨)
            return data;

        } catch (error) {
            console.error('❌ Error loading nearby landmarks:', error);
            return getNearbyLandmarks(coordinates, limit);
        }
    }

    /**
     * 모든 카테고리를 가져옵니다
     * @returns {Promise<Array>} 카테고리 배열
     */
    async getAllCategories() {
        try {
            const cached = this.getCachedData('categories:all');
            if (cached) {
                return cached;
            }

            // Firebase에서 가져오기
            if (this.isOnline && this.isFirebaseReady) {
                try {
                    console.log('🔥 Loading categories from Firebase');
                    const querySnapshot = await this.db.collection('categories').get();
                    const data = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    
                    this.setCachedData('categories:all', data);
                    console.log(`✅ Loaded ${data.length} categories from Firebase`);
                    return data;
                } catch (firebaseError) {
                    console.warn('⚠️ Firebase error for categories, falling back to local data:', firebaseError);
                }
            }

            // API 호출 (향후 확장용)
            if (this.isOnline && this.apiBaseUrl) {
                return await this.fetchFromApi('/categories');
            }

            // 로컬 더미 데이터 사용
            const data = getAllCategories();
            this.setCachedData('categories:all', data);
            return data;

        } catch (error) {
            console.error('❌ Error loading categories:', error);
            return getAllCategories();
        }
    }

    /**
     * 특정 카테고리 정보를 가져옵니다
     * @param {string} categoryId - 카테고리 ID
     * @returns {Promise<Object|null>} 카테고리 객체 또는 null
     */
    async getCategoryById(categoryId) {
        try {
            const cacheKey = `category:${categoryId}`;
            const cached = this.getCachedData(cacheKey);
            if (cached) {
                return cached;
            }

            // Firebase에서 가져오기
            if (this.isOnline && this.isFirebaseReady) {
                try {
                    console.log(`🔥 Loading category ${categoryId} from Firebase`);
                    const doc = await this.db.collection('categories').doc(categoryId).get();
                    if (doc.exists) {
                        const data = {
                            id: doc.id,
                            ...doc.data()
                        };
                        
                        this.setCachedData(cacheKey, data);
                        console.log(`✅ Loaded category ${categoryId} from Firebase`);
                        return data;
                    }
                } catch (firebaseError) {
                    console.warn(`⚠️ Firebase error for category ${categoryId}, falling back to local data:`, firebaseError);
                }
            }

            // API 호출 (향후 확장용)
            if (this.isOnline && this.apiBaseUrl) {
                return await this.fetchFromApi(`/categories/${categoryId}`);
            }

            // 로컬 더미 데이터에서 검색
            const data = getCategoryById(categoryId);
            if (data) {
                this.setCachedData(cacheKey, data);
            }
            return data;

        } catch (error) {
            console.error(`❌ Error loading category ${categoryId}:`, error);
            return getCategoryById(categoryId);
        }
    }

    /**
     * 이미지 경로를 Firebase Storage URL로 변환합니다
     * @param {string} imagePath - 상대 이미지 경로
     * @returns {string} Firebase Storage URL 또는 절대 이미지 경로
     */
    resolveImagePath(imagePath) {
        if (!imagePath) return null;
        
        // 이미 절대 경로인 경우
        if (imagePath.startsWith('http') || imagePath.startsWith('/')) {
            return imagePath;
        }

        // Firebase Storage URL 생성 (최우선)
        if (window.CONFIG?.FIREBASE_CONFIG?.storageBucket) {
            const storageBucket = window.CONFIG.FIREBASE_CONFIG.storageBucket;
            const cleanImageName = imagePath.startsWith('landmarks/') ? 
                imagePath.substring(10) : imagePath;
            const encodedPath = encodeURIComponent(`landmarks/${cleanImageName}`);
            const firebaseUrl = `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/${encodedPath}?alt=media`;
            
            console.log(`🔗 Resolved image path: ${imagePath} -> Firebase Storage`);
            return firebaseUrl;
        }

        // 로컬 fallback (개발 모드)
        console.warn(`⚠️ Using local fallback for image path: ${imagePath}`);
        return `/src/assets/images/${imagePath}`;
    }

    /**
     * API에서 데이터를 가져옵니다 (향후 구현)
     * @param {string} endpoint - API 엔드포인트
     * @returns {Promise<any>} API 응답 데이터
     */
    async fetchFromApi(endpoint) {
        if (!this.apiBaseUrl) {
            throw new Error('API base URL not configured');
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    // 향후 인증 헤더 추가 가능
                }
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();
            console.log(`📡 API response from ${endpoint}:`, data);
            return data;

        } catch (error) {
            console.error(`❌ API request failed for ${endpoint}:`, error);
            throw error;
        }
    }

    /**
     * 캐시에서 데이터를 가져옵니다
     * @param {string} key - 캐시 키
     * @returns {any|null} 캐시된 데이터 또는 null
     */
    getCachedData(key) {
        const cached = this.cache.get(key);
        if (!cached) return null;

        const now = Date.now();
        if (now - cached.timestamp > cached.ttl) {
            this.cache.delete(key);
            return null;
        }

        return cached.data;
    }

    /**
     * 캐시에 데이터를 저장합니다
     * @param {string} key - 캐시 키
     * @param {any} data - 저장할 데이터
     * @param {number} ttl - 캐시 유효 시간 (밀리초)
     */
    setCachedData(key, data, ttl = this.cacheTTL) {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl
        });
    }

    /**
     * 캐시를 초기화합니다
     */
    clearCache() {
        this.cache.clear();
        console.log('🗑️ Cache cleared');
    }

    /**
     * API 기본 URL을 설정합니다 (향후 사용)
     * @param {string} baseUrl - API 기본 URL
     */
    setApiBaseUrl(baseUrl) {
        this.apiBaseUrl = baseUrl;
        console.log(`🔗 API base URL set to: ${baseUrl}`);
    }

    /**
     * 서비스 상태를 가져옵니다
     * @returns {Object} 서비스 상태 정보
     */
    getServiceStatus() {
        return {
            isOnline: this.isOnline,
            isFirebaseReady: this.isFirebaseReady,
            hasApiUrl: !!this.apiBaseUrl,
            cacheSize: this.cache.size,
            mode: this.isFirebaseReady && this.isOnline ? 'firebase' : 
                  this.apiBaseUrl && this.isOnline ? 'api' : 'local'
        };
    }
}

// 싱글톤 인스턴스 생성
const dataService = new DataService();

export default dataService;