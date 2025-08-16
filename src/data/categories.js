/**
 * Landmark Categories Definition
 * 랜드마크 카테고리 정의
 */

export const categories = {
    historical: {
        id: 'historical',
        name: 'Historical',
        nameKorean: '역사',
        description: 'Historical sites and traditional Korean culture',
        icon: 'fas fa-landmark',
        color: '#8B4513'
    },
    landmark: {
        id: 'landmark',
        name: 'Landmark',
        nameKorean: '랜드마크',
        description: 'Iconic buildings and famous landmarks',
        icon: 'fas fa-building',
        color: '#667eea'
    },
    shopping: {
        id: 'shopping',
        name: 'Shopping',
        nameKorean: '쇼핑',
        description: 'Shopping districts and commercial areas',
        icon: 'fas fa-shopping-bag',
        color: '#ff6b6b'
    },
    modern: {
        id: 'modern',
        name: 'Modern',
        nameKorean: '현대',
        description: 'Modern Seoul - business districts and urban life',
        icon: 'fas fa-city',
        color: '#4ecdc4'
    },
    cultural: {
        id: 'cultural',
        name: 'Cultural',
        nameKorean: '문화',
        description: 'Cultural sites and traditional experiences',
        icon: 'fas fa-home',
        color: '#45b7d1'
    }
};

/**
 * 모든 카테고리를 배열로 반환
 * @returns {Array} 카테고리 배열
 */
export const getAllCategories = () => {
    return Object.values(categories);
};

/**
 * 카테고리 ID로 카테고리 정보를 가져오는 함수
 * @param {string} categoryId - 카테고리 ID
 * @returns {Object|undefined} 카테고리 객체 또는 undefined
 */
export const getCategoryById = (categoryId) => {
    return categories[categoryId];
};