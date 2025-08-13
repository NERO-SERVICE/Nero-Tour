# 🔑 Google Maps API 설정 가이드

## ✅ 필수 단계

### 1. Google Cloud Console 프로젝트 생성
1. [Google Cloud Console](https://console.cloud.google.com) 방문
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. 결제 정보 등록 (필수) - 무료 크레딧으로 시작 가능

### 2. 필수 API 활성화
다음 3개 API를 **반드시** 활성화해야 합니다:

#### ✅ Maps JavaScript API
- **목적**: 지도 표시, 마커 생성
- **필수도**: ⭐⭐⭐ (필수)
- **활성화**: APIs & Services > Library > "Maps JavaScript API" 검색 > 사용 설정

#### ✅ Places API  
- **목적**: 장소 검색, 주변 장소 찾기
- **필수도**: ⭐⭐⭐ (필수)
- **활성화**: APIs & Services > Library > "Places API" 검색 > 사용 설정

#### ✅ Geocoding API
- **목적**: 좌표 → 주소 변환 (상세 주소 표시)
- **필수도**: ⭐⭐ (권장)
- **활성화**: APIs & Services > Library > "Geocoding API" 검색 > 사용 설정

### 3. API 키 생성
1. APIs & Services > Credentials
2. "+ CREATE CREDENTIALS" > API key
3. 생성된 키를 복사
4. `config.js` 파일의 `GOOGLE_MAPS_API_KEY`에 입력

```javascript
const CONFIG = {
    GOOGLE_MAPS_API_KEY: "여기에_발급받은_키_입력", // 30자 이상
    // ...
};
```

## 🔒 보안 설정 (권장)

### API 키 제한 설정
1. Credentials에서 생성한 API 키 클릭
2. **Application restrictions**:
   - HTTP referrers (web sites)
   - 허용할 도메인 추가:
     - `localhost:8000/*` (개발용)
     - `yourdomain.com/*` (배포용)

3. **API restrictions**:
   - "Restrict key" 선택
   - 다음 API만 선택:
     - Maps JavaScript API
     - Places API
     - Geocoding API

## 💰 요금 정보

### 무료 할당량 (월별)
- **Maps JavaScript API**: 28,000회 로드
- **Places API**: $200 크레딧 (약 40,000회 요청)
- **Geocoding API**: $200 크레딧 (약 40,000회 요청)

### 예상 사용량
일반적인 관광 앱 사용시:
- 지도 로드: 사용자당 1-5회/세션
- 장소 검색: 사용자당 5-10회/세션  
- 주소 변환: 사용자당 2-5회/세션

**→ 월 1,000명 사용자 기준으로도 무료 할당량 내 사용 가능**

## 🚨 일반적인 오류와 해결책

### 1. "This API project is not authorized"
**원인**: API가 활성화되지 않음  
**해결**: Maps JavaScript API, Places API, Geocoding API 모두 활성화

### 2. "The provided API key is invalid"  
**원인**: 잘못된 키 또는 제한 설정 문제
**해결**: 
- 키 복사/붙여넣기 재확인
- 도메인 제한 설정 확인

### 3. "You have exceeded your request quota"
**원인**: 일일/월별 할당량 초과
**해결**: 
- Google Cloud Console에서 할당량 확인
- 필요시 결제 계정에 크레딧 추가

### 4. "RefererNotAllowedMapError"
**원인**: 도메인 제한 설정 문제
**해결**:
- API 키 설정에서 현재 도메인 추가
- 개발시 `localhost:8000/*` 추가

## 🧪 테스트 방법

1. 브라우저 개발자 도구 > Console 탭 확인
2. 오류 메시지가 없으면 성공
3. 성능 테스트: `http://localhost:8000/performance-test.html`

## ⚡ 최종 체크리스트

- [ ] Google Cloud 프로젝트 생성
- [ ] 결제 정보 등록
- [ ] Maps JavaScript API 활성화
- [ ] Places API 활성화  
- [ ] Geocoding API 활성화
- [ ] API 키 생성
- [ ] config.js에 키 입력
- [ ] 도메인 제한 설정 (선택)
- [ ] 브라우저에서 테스트