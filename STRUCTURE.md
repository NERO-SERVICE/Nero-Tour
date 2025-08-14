# 📁 Seoul Explorer - 프로젝트 구조

## 🏗️ 폴더 구조

```
nero_tour/
├── index.html                    # 루트 리다이렉트 파일
├── package.json                  # 의존성 관리
├── README.md                     # 프로젝트 설명서
├── STRUCTURE.md                  # 구조 설명서 (이 파일)
│
├── src/                         # 소스 코드
│   ├── components/              # UI 컴포넌트들
│   │   ├── explorer.js          # 메인 탐험 컴포넌트 (이전 app.js)
│   │   └── detail-page.js       # 상세 페이지 컴포넌트 (이전 detail.js)
│   │
│   ├── pages/                   # HTML 페이지들
│   │   ├── index.html           # 메인 페이지
│   │   └── detail.html          # 상세 페이지
│   │
│   ├── styles/                  # CSS 스타일시트들
│   │   ├── main.css             # 메인 스타일 (이전 styles.css)
│   │   └── detail.css           # 상세 페이지 스타일 (이전 detail-styles.css)
│   │
│   ├── config/                  # 설정 파일들
│   │   ├── config.js            # 앱 설정 (Google Maps API 등)
│   │   └── firebase.js          # Firebase 설정
│   │
│   ├── services/                # 서비스 로직
│   │   └── maps-manager.js      # 지도 관리 서비스
│   │
│   └── utils/                   # 유틸리티 함수들
│       └── enhanced-app.js      # 향상된 앱 기능들 (미사용)
│
└── public/                      # 정적 자원들
    └── assets/                  # 이미지 파일들
        ├── 낙산공원.png
        ├── 남산타워.png
        ├── 명동.png
        ├── 롯데월드타워.png
        ├── 북촌한옥마을.png
        ├── 삼성역.png
        ├── 자양역.png
        └── 잠실주경기장.png
```

## 📋 기능별 분류

### 🎯 Components (컴포넌트)
- **explorer.js**: 메인 Seoul Explorer 클래스, 위치 관리, 카드 렌더링
- **detail-page.js**: DetailPage 클래스, 상세 정보 표시

### 📄 Pages (페이지)
- **index.html**: 메인 앱 페이지, 위치 탐색 인터페이스
- **detail.html**: 관광지 상세 정보 페이지

### 🎨 Styles (스타일)
- **main.css**: 메인 페이지 스타일링
- **detail.css**: 상세 페이지 전용 스타일링

### ⚙️ Config (설정)
- **config.js**: Google Maps API 키, 위치 서비스 설정
- **firebase.js**: Firebase 연동 설정

### 🔧 Services (서비스)
- **maps-manager.js**: 지도 기능 관리, Google Maps 연동

### 🛠️ Utils (유틸리티)
- **enhanced-app.js**: 추가 앱 기능들 (현재 미사용)

### 🖼️ Public Assets (공개 자원)
- **assets/**: 관광지 이미지들, PNG 형식의 한국어 파일명

## 🚀 실행 방법

1. 루트 디렉토리에서 웹 서버 실행
2. `http://localhost:PORT/` 접속하면 자동으로 `src/pages/index.html`로 리다이렉트
3. 또는 직접 `src/pages/index.html` 접속

## 🔗 의존성

- **Google Maps API**: 지도 및 위치 서비스
- **Font Awesome 6**: 아이콘 라이브러리
- **Firebase**: 백엔드 서비스 (설정됨, 미사용)

## 📱 주요 기능

1. **실시간 위치 추적**: 10초마다 현재 위치 업데이트
2. **관광지 탐색**: 서울 주요 관광지 카드 형태로 표시
3. **상세 정보**: 각 관광지의 상세 페이지 네비게이션
4. **반응형 디자인**: 모바일 우선 4:5 비율 이미지
5. **Google Maps 연동**: 길찾기 기능

## 🔧 개발 노트

- 모든 경로 참조가 새로운 폴더 구조에 맞게 업데이트됨
- 이미지 경로: `../../public/assets/`로 변경
- CSS/JS 경로: 상대 경로로 구조화
- 루트 index.html은 리다이렉트용으로 사용