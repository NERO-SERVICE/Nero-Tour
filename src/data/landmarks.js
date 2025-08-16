/**
 * Seoul Landmarks Data
 * 서울 랜드마크 더미 데이터
 * 
 * 향후 백엔드 API 연동 시 이 파일의 데이터 구조를 참고하여
 * API 응답 형식을 맞춰주세요.
 */

export const landmarks = [
    {
        id: 'naksan-park',
        name: 'Naksan Park',
        nameKorean: '낙산공원',
        category: 'historical',
        description: 'Hillside park with panoramic Seoul views and ancient fortress walls',
        longDescription: 'Located on Naksan Mountain (125m), this park offers stunning panoramic views of Seoul. Walk along the 2.1km ancient fortress wall section from Hyehwamun to Heunginjimun, connecting to the famous Ihwa Mural Village.',
        coordinates: { lat: 37.5806, lng: 127.0075 },
        icon: 'fas fa-mountain',
        image: 'landmarks/낙산공원.png',
        tags: ['Historical', 'Views', 'Walking'],
        tips: [
            'Best views of Seoul skyline especially at sunset',
            'Connect your visit with Ihwa Mural Village',
            'Wear comfortable walking shoes for fortress wall walk'
        ],
        hours: '24/7 (Exhibition hall: 09:00-17:00)',
        entrance: 'Free',
        nearbySubway: 'Hyehwa Station (Line 4), Exit 2',
        culturalTips: 'Part of Seoul City Wall - UNESCO World Heritage tentative list'
    },
    {
        id: 'namsan-tower',
        name: 'N Seoul Tower',
        nameKorean: '남산타워',
        category: 'landmark',
        description: 'Iconic communication tower offering panoramic city views',
        longDescription: 'Standing 236 meters above sea level on Namsan Mountain, N Seoul Tower is Seoul\'s most recognizable landmark. The tower offers breathtaking 360-degree views of the city and is famous for its "love locks" tradition.',
        coordinates: { lat: 37.5512, lng: 126.9882 },
        icon: 'fas fa-broadcast-tower',
        image: 'landmarks/남산타워.png',
        tags: ['Landmark', 'Views', 'Romance'],
        tips: [
            'Take the cable car up for scenic views',
            'Best visited at sunset for stunning photo opportunities',
            'Bring a padlock to add to the love locks fence'
        ],
        hours: '10:00 - 23:00 (Sun-Fri), 10:00 - 24:00 (Sat)',
        entrance: 'Cable car: 8,500 KRW, Observatory: 10,000 KRW',
        nearbySubway: 'Myeong-dong Station (Line 4) + Cable car',
        culturalTips: 'Popular date spot - couples often attach love locks here'
    },
    {
        id: 'myeongdong',
        name: 'Myeong-dong',
        nameKorean: '명동',
        category: 'shopping',
        description: 'Korea\'s premier shopping and beauty district',
        longDescription: 'Discover Seoul\'s most vibrant shopping and beauty district, where traditional Korean culture meets modern retail therapy. From world-renowned K-beauty products to authentic street food, Myeong-dong offers an immersive experience into Korean lifestyle.',
        coordinates: { lat: 37.5636, lng: 126.9824 },
        icon: 'fas fa-shopping-bag',
        image: 'landmarks/명동.png',
        tags: ['Shopping', 'Food', 'Beauty'],
        tips: [
            'Try Korean skincare products - many stores offer free samples',
            'Haggling is acceptable at street vendors',
            'Visit in the evening for the best street food experience'
        ],
        hours: 'Stores: 10:00 - 22:00, Street food: 12:00 - 02:00',
        entrance: 'Free (individual purchases vary)',
        nearbySubway: 'Myeong-dong Station (Line 4)',
        culturalTips: 'Bow when receiving free samples, tipping is not expected',
        detailSections: [
            {
                title: 'K-Beauty Paradise',
                image: 'landmarks/명동-화장품.png',
                description: 'Myeong-dong is the epicenter of Korean beauty culture. Walk through streets lined with flagship stores of famous brands like Innisfree, Etude House, and The Face Shop. Experience the latest in Korean skincare technology with free consultations and product samples. Many stores offer English-speaking staff and tax-free shopping for tourists.'
            },
            {
                title: 'Street Food Heaven',
                image: 'landmarks/명동-길거리음식.png',
                description: 'As evening falls, Myeong-dong transforms into a street food paradise. Try iconic Korean snacks like hotteok (sweet pancakes), tteokbokki (spicy rice cakes), and Korean corn dogs. The street food market operates from late afternoon until early morning, offering authentic flavors at budget-friendly prices.'
            },
            {
                title: 'Fashion & Shopping',
                image: 'landmarks/명동-쇼핑.png',
                description: 'From high-end department stores like Lotte and Shinsegae to trendy boutiques and international brands, Myeong-dong caters to every fashion taste and budget. The area features both luxury shopping experiences and affordable fashion finds, making it a complete retail destination.'
            },
            {
                title: 'Cultural Experience',
                image: 'landmarks/명동-문화.png',
                description: 'Beyond shopping, Myeong-dong offers cultural experiences including traditional Korean performances, art galleries, and historic Myeong-dong Cathedral. The area seamlessly blends modern consumer culture with Korean traditions, providing visitors with a well-rounded cultural experience.'
            }
        ]
    },
    {
        id: 'jayang-station',
        name: 'Jayang Station',
        nameKorean: '자양역',
        category: 'modern',
        description: 'Major subway interchange connecting eastern Seoul districts',
        longDescription: 'Located in Gwangjin District, Jayang Station serves as an important transit hub on Line 7. The area features modern residential complexes, local markets, and easy access to the Han River parks.',
        coordinates: { lat: 37.5342, lng: 127.0822 },
        icon: 'fas fa-subway',
        image: 'landmarks/자양역.png',
        tags: ['Transportation', 'Local Life', 'Residential'],
        tips: [
            'Great access point to Han River parks',
            'Explore local Korean markets nearby',
            'Less touristy but authentic Seoul experience'
        ],
        hours: '05:30 - 24:00 (subway operating hours)',
        entrance: 'Subway fare: 1,370 KRW',
        nearbySubway: 'Jayang Station (Line 7)',
        culturalTips: 'Experience everyday Seoul life away from tourist crowds'
    },
    {
        id: 'lotte-world-tower',
        name: 'Lotte World Tower',
        nameKorean: '롯데월드타워',
        category: 'landmark',
        description: 'Korea\'s tallest skyscraper with shopping and observation decks',
        longDescription: 'At 555 meters tall, Lotte World Tower is the 6th tallest building in the world. Features Seoul Sky observation deck, luxury shopping, restaurants, and direct connection to Lotte World theme park.',
        coordinates: { lat: 37.5120, lng: 127.1020 },
        icon: 'fas fa-building',
        image: 'landmarks/롯데월드타워.png',
        tags: ['Modern', 'Views', 'Shopping'],
        tips: [
            'Visit Seoul Sky observatory on floors 117-123',
            'Book tickets online for discounted prices',
            'Combine with Lotte World theme park visit'
        ],
        hours: '10:00 - 22:00 (observatory varies)',
        entrance: 'Seoul Sky: 27,000 KRW (adult)',
        nearbySubway: 'Jamsil Station (Line 2, 8)',
        culturalTips: 'Represents modern Seoul\'s architectural achievements'
    },
    {
        id: 'jamsil-stadium',
        name: 'Jamsil Sports Complex',
        nameKorean: '잠실주경기장',
        category: 'modern',
        description: 'Major sports complex hosting baseball, soccer, and events',
        longDescription: 'Built for the 1988 Seoul Olympics, this massive complex includes Olympic Stadium, baseball stadium, and indoor arena. Home to LG Twins baseball team and major K-pop concerts.',
        coordinates: { lat: 37.5120, lng: 127.0719 },
        icon: 'fas fa-futbol',
        image: 'landmarks/잠실주경기장.png',
        tags: ['Sports', 'Entertainment', 'Olympics'],
        tips: [
            'Check schedules for baseball games or concerts',
            'Great atmosphere during LG Twins home games',
            'Easy access to Lotte World nearby'
        ],
        hours: 'Event-dependent (usually 18:30 for baseball)',
        entrance: 'Varies by event (baseball: 8,000-50,000 KRW)',
        nearbySubway: 'Sports Complex Station (Line 2)',
        culturalTips: 'Experience Korean baseball culture - very enthusiastic fans!'
    },
    {
        id: 'bukchon-hanok',
        name: 'Bukchon Hanok Village',
        nameKorean: '북촌한옥마을',
        category: 'cultural',
        description: 'Traditional Korean architecture village between palaces',
        longDescription: 'A well-preserved traditional village with over 600 years of history, featuring beautiful hanok (traditional Korean houses). Perfect for experiencing traditional Korean architecture and culture.',
        coordinates: { lat: 37.5825, lng: 126.9833 },
        icon: 'fas fa-home',
        image: 'landmarks/북촌한옥마을.png',
        tags: ['Traditional', 'Architecture', 'Culture'],
        tips: [
            'Visit early morning or late afternoon for fewer crowds',
            'Respect residents - keep noise levels down',
            'Wear comfortable shoes for walking on uneven surfaces'
        ],
        hours: '24/7 (respect quiet hours 22:00-08:00)',
        entrance: 'Free',
        nearbySubway: 'Anguk Station (Line 3)',
        culturalTips: 'Many hanoks are private residences - observe quietly and respectfully'
    },
    {
        id: 'samsung-station',
        name: 'Samsung Station (COEX)',
        nameKorean: '삼성역',
        category: 'modern',
        description: 'Major business district with COEX Mall and convention center',
        longDescription: 'Located in the heart of Gangnam, Samsung Station connects to Asia\'s largest underground shopping mall (COEX). The area features corporate headquarters, luxury hotels, and entertainment venues.',
        coordinates: { lat: 37.5072, lng: 127.0553 },
        icon: 'fas fa-briefcase',
        image: 'landmarks/삼성역.png',
        tags: ['Business', 'Shopping', 'Modern'],
        tips: [
            'Explore massive COEX underground mall',
            'Visit COEX Aquarium and Starfield Library',
            'Great area for Korean BBQ restaurants'
        ],
        hours: 'COEX: 10:00 - 22:00, Restaurants vary',
        entrance: 'Free to area (COEX Aquarium: 23,000 KRW)',
        nearbySubway: 'Samsung Station (Line 2)',
        culturalTips: 'Heart of Korea\'s business culture - dress professionally'
    }
];

/**
 * 카테고리별로 랜드마크를 필터링하는 헬퍼 함수
 * @param {string} category - 필터링할 카테고리
 * @returns {Array} 해당 카테고리의 랜드마크 배열
 */
export const getLandmarksByCategory = (category) => {
    return landmarks.filter(landmark => landmark.category === category);
};

/**
 * ID로 특정 랜드마크를 찾는 헬퍼 함수
 * @param {string} id - 찾을 랜드마크의 ID
 * @returns {Object|undefined} 해당 랜드마크 객체 또는 undefined
 */
export const getLandmarkById = (id) => {
    return landmarks.find(landmark => landmark.id === id);
};

/**
 * 좌표 기준으로 가까운 랜드마크를 찾는 헬퍼 함수
 * @param {Object} coordinates - 기준 좌표 {lat, lng}
 * @param {number} limit - 반환할 랜드마크 수 (기본값: 3)
 * @returns {Array} 거리순으로 정렬된 랜드마크 배열
 */
export const getNearbyLandmarks = (coordinates, limit = 3) => {
    const calculateDistance = (lat1, lng1, lat2, lng2) => {
        const R = 6371; // Earth's radius in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    };

    return landmarks
        .map(landmark => ({
            ...landmark,
            distance: calculateDistance(
                coordinates.lat,
                coordinates.lng,
                landmark.coordinates.lat,
                landmark.coordinates.lng
            )
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, limit);
};