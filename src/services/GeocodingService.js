/**
 * Mapbox Geocoding Service
 * 전 세계 도시 이름으로 좌표 및 주소 정보를 가져옵니다.
 */

// ⚠️ 본인의 Mapbox Default Public Token을 입력하세요
const MAPBOX_TOKEN = 'pk.eyJ1Ijoic2V3b25uaWUiLCJhIjoiY21vaHc0d2toMDBiMzJzbXR6N3VsY3BlbSJ9.qEAir2NIpf1EBfGg3O3wxw';

// 1. 자동 완성을 위한 검색어 추천 함수
export const fetchSuggestions = async (query) => {
  if (!query || query.length < 2) return [];

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&types=place,locality&limit=5&language=ko,en`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    
    return data.features.map(f => ({
      cityName: f.text,           // 도시 이름 (예: 서울)
      fullAddress: f.place_name,  // 전체 주소 (예: 서울, 대한민국)
      center: f.center,           // [경도, 위도]
    }));
  } catch (error) {
    console.error("추천 검색어 로드 실패:", error);
    return [];
  }
};

// 2. 단일 위치 검색 함수 (필요 시 유지)
export const fetchLocation = async (cityName) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(cityName)}.json?access_token=${MAPBOX_TOKEN}&limit=1&language=ko,en`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      return {
        cityName: feature.text,
        center: feature.center,
        fullAddress: feature.place_name
      };
    }
    return null;
  } catch (error) {
    console.error("위치 검색 실패:", error);
    return null;
  }
};