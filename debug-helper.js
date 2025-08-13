// 디버깅 헬퍼 - 자세한 오류 진단
class DebugHelper {
    static checkGoogleMapsSetup() {
        console.log('🔍 Google Maps 설정 진단 시작');
        
        const results = {
            config: false,
            apiKey: false,
            apiLoaded: false,
            mapsManager: false,
            domElements: false
        };
        
        // 1. CONFIG 객체 확인
        if (window.CONFIG) {
            results.config = true;
            console.log('✅ CONFIG 객체 존재');
            
            // API 키 확인
            if (CONFIG.GOOGLE_MAPS_API_KEY && CONFIG.GOOGLE_MAPS_API_KEY !== "YOUR_GOOGLE_MAPS_API_KEY_HERE") {
                results.apiKey = true;
                console.log('✅ API 키 설정됨:', CONFIG.GOOGLE_MAPS_API_KEY.substring(0, 10) + '...');
            } else {
                console.error('❌ API 키가 설정되지 않았습니다');
            }
        } else {
            console.error('❌ CONFIG 객체를 찾을 수 없습니다');
        }
        
        // 2. Google Maps API 로드 확인
        if (window.google && window.google.maps) {
            results.apiLoaded = true;
            console.log('✅ Google Maps API 로드됨');
        } else {
            console.error('❌ Google Maps API가 로드되지 않았습니다');
        }
        
        // 3. SeoulExplorer 인스턴스 확인
        if (window.seoulExplorer) {
            console.log('✅ SeoulExplorer 인스턴스 존재');
            
            if (window.seoulExplorer.mapsManager) {
                results.mapsManager = true;
                console.log('✅ MapsManager 초기화됨');
                
                if (window.seoulExplorer.mapsManager.isInitialized) {
                    console.log('✅ MapsManager가 완전히 초기화됨');
                } else {
                    console.log('⚠️ MapsManager가 아직 완전히 초기화되지 않음');
                }
            } else {
                console.error('❌ MapsManager가 null입니다');
            }
        } else {
            console.error('❌ SeoulExplorer 인스턴스를 찾을 수 없습니다');
        }
        
        // 4. DOM 요소 확인
        const mapContainer = document.getElementById('googleMap');
        if (mapContainer) {
            results.domElements = true;
            console.log('✅ 지도 컨테이너 존재');
        } else {
            console.error('❌ 지도 컨테이너(#googleMap)를 찾을 수 없습니다');
        }
        
        // 5. 종합 진단
        const passedTests = Object.values(results).filter(Boolean).length;
        const totalTests = Object.keys(results).length;
        
        console.log(`\n📊 진단 결과: ${passedTests}/${totalTests} 통과`);
        
        if (passedTests === totalTests) {
            console.log('🎉 모든 설정이 정상입니다!');
        } else {
            console.log('⚠️ 일부 설정에 문제가 있습니다. 위의 오류를 확인해주세요.');
        }
        
        return results;
    }
    
    static testMapInitialization() {
        console.log('🧪 지도 초기화 테스트 시작');
        
        const results = this.checkGoogleMapsSetup();
        
        if (!results.apiLoaded) {
            console.error('❌ Google Maps API가 로드되지 않아 테스트할 수 없습니다');
            return false;
        }
        
        try {
            // 임시 테스트 맵 생성
            const testContainer = document.createElement('div');
            testContainer.id = 'testMapContainer';
            testContainer.style.width = '100px';
            testContainer.style.height = '100px';
            testContainer.style.position = 'absolute';
            testContainer.style.top = '-1000px';
            document.body.appendChild(testContainer);
            
            const testMap = new google.maps.Map(testContainer, {
                center: { lat: 37.5665, lng: 126.9780 },
                zoom: 12
            });
            
            console.log('✅ 테스트 지도 생성 성공');
            
            // 테스트 마커 생성
            const testMarker = new google.maps.Marker({
                position: { lat: 37.5796, lng: 126.9770 },
                map: testMap,
                title: '테스트 마커'
            });
            
            console.log('✅ 테스트 마커 생성 성공');
            
            // 정리
            document.body.removeChild(testContainer);
            
            return true;
        } catch (error) {
            console.error('❌ 지도 초기화 테스트 실패:', error);
            return false;
        }
    }
    
    static getDetailedErrorInfo(error) {
        const errorInfo = {
            message: error.message,
            stack: error.stack,
            type: error.constructor.name
        };
        
        // Google Maps 특정 오류 분석
        if (error.message.includes('Google Maps API')) {
            errorInfo.suggestion = 'Google Maps API 키와 설정을 확인하세요';
        } else if (error.message.includes('mapsManager')) {
            errorInfo.suggestion = 'MapsManager 초기화 순서를 확인하세요';
        } else if (error.message.includes('null') && error.message.includes('isInitialized')) {
            errorInfo.suggestion = 'mapsManager가 null입니다. 초기화 과정을 확인하세요';
        }
        
        return errorInfo;
    }
}

// 전역에서 사용 가능하도록
window.DebugHelper = DebugHelper;

// 자동 진단 (개발 모드에서)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            console.log('🔍 자동 진단 시작...');
            DebugHelper.checkGoogleMapsSetup();
        }, 3000); // 3초 후 자동 진단
    });
}