# 🗺️ Seoul Explorer

A mobile-friendly web application for exploring Seoul's landmarks and attractions with integrated Google Maps functionality.

## 🚀 Setup Guide

### 1. Environment Configuration

Create a `.env` file in the project root with your API keys:

```env
# Google Maps API Key - Required
GOOGLE_MAPS_API_KEY=your_actual_google_maps_api_key_here

# Firebase Configuration - Optional
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789012
FIREBASE_APP_ID=1:123456789012:web:your-app-id
FIREBASE_MEASUREMENT_ID=G-YOUR-MEASUREMENT-ID
```

### 2. Google Cloud Console Setup

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

### 3. Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

This will:
- Build the config from your `.env` file
- Start a local server at http://localhost:8000

### 4. Netlify Deployment

1. Set environment variables in Netlify Dashboard → Environment variables:
   - `GOOGLE_MAPS_API_KEY` = your actual API key
   - (Optional) Firebase variables if using Firebase features

2. The build will automatically use `build-netlify.js` for Netlify deployment

### 5. Important Security Notes

- ✅ `.env` file is ignored by git for security
- ✅ No API keys are hardcoded in the source code
- ✅ API keys are loaded from environment variables only
- ⚠️ Make sure to set domain restrictions in Google Cloud Console

## 📁 File Structure

```
nero_tour/
├── .env                    # 🔑 Local environment variables (not in git)
├── build.js               # Local build script
├── build-netlify.js       # Netlify build script
├── package.json           # Dependencies and scripts
├── netlify.toml           # Netlify deployment configuration
├── src/
│   ├── pages/
│   │   ├── index.html     # Main page
│   │   └── detail.html    # Detail page
│   ├── config/
│   │   ├── config.js      # Generated config (not in git)
│   │   └── config.template.js
│   ├── components/        # JavaScript components
│   ├── services/          # Map and API services
│   ├── styles/           # CSS files
│   └── utils/            # Utility functions
└── public/             # Static assets
```

## ✨ Features

- **Interactive Maps**: Google Maps integration with custom markers
- **Location Services**: Current location detection and distance calculation  
- **Seoul Landmarks**: Curated tourist attractions and landmarks
- **Responsive Design**: Mobile-first responsive interface
- **Secure Configuration**: Environment-based API key management

## 🔧 Troubleshooting

- **Maps not loading**: Check your `.env` file has valid `GOOGLE_MAPS_API_KEY`
- **403 errors**: Verify domain restrictions in Google Cloud Console
- **Build fails**: Ensure `.env` file exists and contains required variables