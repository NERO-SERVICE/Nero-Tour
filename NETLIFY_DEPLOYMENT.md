# Netlify 배포 가이드

## 🚀 Netlify 배포 설정

### 1. GitHub Repository 연결

1. [Netlify 대시보드](https://app.netlify.com)에 로그인
2. "New site from Git" 클릭
3. GitHub 선택 후 이 저장소 선택
4. 배포 설정:
   - **Build command**: `node build.js`
   - **Publish directory**: `.` (루트 디렉토리)

### 2. 환경 변수 설정

Netlify 대시보드에서 다음 환경 변수들을 설정하세요:

#### 필수 환경 변수

**Site settings > Environment variables > Add variable**에서 아래 변수들을 추가:

```
GOOGLE_MAPS_API_KEY=여기에_실제_구글맵_API_키_입력

FIREBASE_API_KEY=여기에_실제_파이어베이스_API_키_입력
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789012
FIREBASE_APP_ID=1:123456789012:web:your-app-id
FIREBASE_MEASUREMENT_ID=G-YOUR-MEASUREMENT-ID
```

### 3. 환경 변수 설정 방법

#### 옵션 1: Netlify UI에서 설정
1. Site dashboard > Site settings
2. Environment variables 섹션
3. "Add a variable" 버튼 클릭
4. Key와 Value 입력
5. "Save" 클릭

#### 옵션 2: Netlify CLI 사용
```bash
# Netlify CLI 설치
npm install -g netlify-cli

# 로그인
netlify login

# 환경 변수 설정
netlify env:set GOOGLE_MAPS_API_KEY "your-actual-api-key"
netlify env:set FIREBASE_API_KEY "your-firebase-api-key"
# ... 다른 변수들도 동일하게 설정
```

### 4. API 키 획득 방법

#### Google Maps API 키
1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 프로젝트 생성 또는 선택
3. "APIs & Services" > "Credentials" 이동
4. "Create Credentials" > "API Key" 선택
5. 다음 API 활성화:
   - Maps JavaScript API
   - Places API
   - Geocoding API

#### Firebase 설정
1. [Firebase Console](https://console.firebase.google.com) 접속
2. 프로젝트 생성 또는 선택
3. "Project Settings" > "General" > "Your apps"
4. "Add app" > Web app 선택
5. 설정 객체에서 각 값을 복사

### 5. 배포 확인

1. 환경 변수 설정 후 "Deploy" 트리거
2. Build logs 확인:
   ```
   🚀 Starting build process...
   📝 Environment variables loaded:
      GOOGLE_MAPS_API_KEY: AIzaSyB...
      FIREBASE_API_KEY: AIzaSyC...
   ✅ Config file generated
   🎉 Build completed successfully!
   ```
3. 사이트 접속하여 지도가 정상 로드되는지 확인

### 6. 도메인 설정 (선택사항)

1. Site settings > Domain management
2. "Add custom domain" 클릭
3. 도메인 입력 및 DNS 설정
4. SSL 인증서 자동 발급 확인

### 7. 트러블슈팅

#### 빌드 실패 시
- Build logs에서 오류 메시지 확인
- 환경 변수가 올바르게 설정되었는지 확인
- Node.js 버전 확인 (netlify.toml에서 18로 설정됨)

#### API 키 오류 시
- 브라우저 Developer Tools Console 확인
- API 키의 권한 및 제한 설정 확인
- Firebase 프로젝트 설정 확인

#### 404 오류 시
- netlify.toml의 redirects 설정이 올바른지 확인
- Publish directory가 "."로 설정되었는지 확인

### 8. 보안 고려사항

✅ **안전한 것들**:
- 환경 변수는 빌드 시에만 사용되고 최종 파일에 포함됨
- .env 파일은 git에 커밋되지 않음
- Netlify 환경 변수는 암호화되어 저장됨

⚠️ **주의사항**:
- 클라이언트 사이드에서 API 키가 노출됨 (이는 정상적인 동작)
- API 키에 적절한 제한을 설정하세요 (도메인 제한, API 제한 등)
- 정기적으로 API 키를 로테이션하세요

### 9. 자동 배포 설정

GitHub 연동 시 자동으로 설정됩니다:
- `main` 브랜치에 push 시 자동 배포
- Pull Request 생성 시 Preview 배포
- Deploy previews에서 변경사항 미리 확인 가능

## 🔄 업데이트 프로세스

1. 코드 변경 후 GitHub에 push
2. Netlify가 자동으로 빌드 시작
3. 환경 변수가 코드에 주입됨
4. 새 버전이 자동 배포됨

환경 변수 변경이 필요한 경우에만 Netlify 대시보드에서 수정하면 됩니다.