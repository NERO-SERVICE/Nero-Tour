/**
 * Data Module Entry Point
 * 데이터 모듈 진입점
 * 
 * 모든 데이터 관련 exports를 중앙에서 관리
 */

// Landmarks data
export {
    landmarks,
    getLandmarksByCategory,
    getLandmarkById,
    getNearbyLandmarks
} from './landmarks.js';

// Categories data
export {
    categories,
    getAllCategories,
    getCategoryById
} from './categories.js';

// Data validation utilities
export const validateLandmark = (landmark) => {
    const requiredFields = ['id', 'name', 'nameKorean', 'category', 'description', 'coordinates'];
    return requiredFields.every(field => landmark && landmark[field]);
};

export const validateCoordinates = (coordinates) => {
    return coordinates && 
           typeof coordinates.lat === 'number' && 
           typeof coordinates.lng === 'number' &&
           coordinates.lat >= -90 && coordinates.lat <= 90 &&
           coordinates.lng >= -180 && coordinates.lng <= 180;
};