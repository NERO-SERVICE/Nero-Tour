# 🗺️ Seoul Explorer with Google Maps

Google Maps API가 통합된 서울 관광 가이드 앱입니다.

## 🚀 빠른 시작 가이드

### 1. API 키 설정

1. **Google Cloud Console** 접속: https://console.cloud.google.com
2. **새 프로젝트 생성** 또는 기존 프로젝트 선택
3. **API 및 서비스** → **라이브러리**에서 다음 API들을 활성화:
   - Maps JavaScript API
   - Places API  
   - Directions API
   - Geocoding API
   - Geolocation API

4. **사용자 인증 정보** → **사용자 인증 정보 만들기** → **API 키** 생성

5. **API 키 제한** 설정 (보안):
   - 애플리케이션 제한사항: HTTP 리퍼러 (your-domain.com/*)
   - API 제한사항: 위 5개 API만 선택

### 2. 설정 파일 수정

`config.js` 파일을 열고 발급받은 API 키를 입력하세요:

```javascript
const CONFIG = {
    GOOGLE_MAPS_API_KEY: "여기에_발급받은_API_키_입력",
    // ... 나머지 설정
};
```

### 3. 실행

웹 서버에서 `index.html` 파일을 실행하면 됩니다.

```bash
# 간단한 로컬 서버 실행 (Python 3)
python -m http.server 8000

# 또는 Node.js
npx http-server

# 브라우저에서 http://localhost:8000 접속
```

## 📁 파일 구조

```
nero_tour/
├── index.html          # 메인 HTML 파일
├── styles.css          # CSS 스타일 (지도 스타일 포함)
├── app.js              # 기본 Seoul Explorer 클래스
├── config.js           # 🔑 API 키 설정 파일
├── maps-manager.js     # Google Maps 관리 클래스  
├── enhanced-app.js     # Maps 통합 Enhanced 앱
└── README.md           # 이 파일
```

## 🗺️ 주요 기능

### ✅ 기존 기능
- 6개 서울 주요 관광지 정보
- 현재 위치 기반 거리 계산
- 상세 정보 모달
- 즐겨찾기 기능
- 반응형 모바일 디자인

### 🆕 새로 추가된 Google Maps 기능
- **대화형 지도**: 실시간 지도 인터페이스
- **커스텀 마커**: 카테고리별 색상 구분 마커
- **정보창**: 마커 클릭 시 정보 표시
- **검색 기능**: 장소 검색 (구현 예정)
- **필터링**: 카테고리별 마커 필터
- **내 위치**: 현재 위치로 지도 중심 이동
- **길찾기**: Google Maps로 경로 안내

## 🎯 사용법

1. **Explore 탭**: 기존 카드 형태의 관광지 목록
2. **Map 탭**: 새로운 Google Maps 인터페이스
3. **Favorites 탭**: 즐겨찾기한 장소들
4. **Guide 탭**: 서울 여행 가이드 정보

### Map 탭 사용법
- 🔍 **검색**: 상단 검색창에서 장소 검색
- 🏷️ **필터**: 카테고리별 마커 필터링
- 📍 **내 위치**: 현재 위치로 지도 이동
- 🗺️ **마커 클릭**: 상세 정보 및 길찾기 버튼

## ⚠️ 주의사항

1. **API 키 보안**: 
   - 프로덕션에서는 환경변수 사용 권장
   - 리퍼러 제한 설정 필수

2. **HTTPS 필요**: 
   - 위치 서비스는 HTTPS에서만 작동
   - 로컬 개발: `localhost` 사용 가능

3. **비용 관리**: 
   - Google Maps API는 유료 서비스
   - 예상 월 비용: $24-49 (중간 사용량 기준)

## 🐞 문제 해결

### API 키 오류
```
⚠️ Google Maps API 키를 config.js 파일에 설정해주세요!
```
→ `config.js`에서 API 키를 올바르게 설정했는지 확인

### 지도 로딩 실패
```
⚠️ 지도 로딩 실패
```
→ API 키 유효성 및 인터넷 연결 확인

### 위치 접근 권한
```
⚠️ Location Access Needed
```
→ 브라우저에서 위치 권한을 허용해주세요

## 🔧 커스터마이징

### 지도 스타일 변경
`maps-manager.js`의 `getMapStyles()` 메서드에서 지도 스타일 커스터마이징 가능

### 새로운 관광지 추가
`app.js`의 `getSeoulLandmarks()` 메서드에 새로운 장소 데이터 추가

### API 설정 변경
`config.js`에서 지도 기본 설정, 위치 서비스 옵션 등 조정 가능

## 📞 지원

문제가 발생하면 콘솔(F12)을 확인하여 오류 메시지를 참고하세요.

---
**Seoul Explorer Enhanced** - Google Maps로 더욱 생생한 서울 탐험! 🇰🇷