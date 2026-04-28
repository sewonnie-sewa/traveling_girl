import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// 본인의 Mapbox 토큰을 꼭 입력하세요!
mapboxgl.accessToken = 'pk.eyJ1Ijoic2V3b25uaWUiLCJhIjoiY21vaHc0d2toMDBiMzJzbXR6N3VsY3BlbSJ9.qEAir2NIpf1EBfGg3O3wxw';

const MapView = ({ records, focusCoords }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]); // 마커를 관리하기 위한 ref

  useEffect(() => {
    if (map.current) return; // 지도가 이미 있으면 생성 안 함
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      projection: 'globe',
      center: [127.1, 37.5],
      zoom: 2 // 전세계를 보기 위해 줌을 낮춤
    });

    map.current.on('style.load', () => {
      map.current.setFog({ color: 'white', 'high-color': '#adb5bd' });
    });
  }, []);

  // 핀(마커) 꽂기 로직
  useEffect(() => {
    if (!map.current || !records) return;

    // 기존 마커 제거
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    records.forEach((record) => {
      if (!record.coordinates) return;

      const marker = new mapboxgl.Marker({ color: '#FF5A5F' })
        .setLngLat(record.coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(`<h4>${record.cityName}</h4><p>${record.memo}</p>`))
        .addTo(map.current);
      
      markers.current.push(marker);
    });
  }, [records]);

  // 클릭 시 이동
  useEffect(() => {
    if (focusCoords && map.current) {
      map.current.flyTo({ center: focusCoords, zoom: 10, essential: true });
    }
  }, [focusCoords]);

  return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
};

export default MapView;