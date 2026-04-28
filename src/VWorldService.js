const VWORLD_KEY = "0B504970-5E7A-3734-BFBF-0A042084B3E2";

export const fetchCityBoundary = async (cityName) => {
  // 1. 도시 검색 (시군구 단위)
  const searchUrl = `https://api.vworld.kr/req/search?service=search&request=search&resType=json&query=${cityName}&type=district&category=L4&key=${VWORLD_KEY}`;
  
  try {
    const res = await fetch(searchUrl);
    const data = await res.json();
    
    if (data.response.status === 'OK') {
      const code = data.response.result.items[0].id; // 법정동 코드
      
      // 2. 해당 코드로 GeoJSON(경계선) 요청
      const geoUrl = `https://api.vworld.kr/req/data?service=data&request=GetFeature&data=LT_C_ADSIGG_INFO&key=${VWORLD_KEY}&attrFilter=sig_cd:like:${code.substring(0,5)}&crs=EPSG:4326`;
      
      const geoRes = await fetch(geoUrl);
      return await geoRes.json();
    }
  } catch (e) {
    console.error("VWorld Error:", e);
  }
};