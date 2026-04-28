import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2V3b25uaWUiLCJhIjoiY21vaHc0d2toMDBiMzJzbXR6N3VsY3BlbSJ9.qEAir2NIpf1EBfGg3O3wxw';

const MapView = ({ records }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [127.0, 37.5],
      zoom: 2,
      projection: 'globe'
    });

    map.current.on('style.load', () => {
      map.current.setFog({ color: 'rgb(186, 210, 235)', 'space-color': 'rgb(11, 11, 25)', 'star-intensity': 0.5 });
    });
  }, []);

  useEffect(() => {
    if (!map.current || !records) return;

    markers.current.forEach(m => m.remove());
    markers.current = [];

    records.forEach((record) => {
      if (!record.coords) return;

      // 1. 위치를 고정할 투명한 부모 컨테이너 (이건 절대 transform 하면 안 됨)
      const el = document.createElement('div');
      el.style.width = '60px';
      el.style.height = '75px';

      // 2. 실제 스타일이 적용될 내부 박스 (이걸 확대할 것임)
      const inner = document.createElement('div');
      inner.style.width = '100%';
      inner.style.height = '100%';
      inner.style.backgroundColor = 'white';
      inner.style.padding = '4px';
      inner.style.paddingBottom = '15px';
      inner.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
      inner.style.borderRadius = '2px';
      inner.style.cursor = 'pointer';
      inner.style.boxSizing = 'border-box';
      inner.style.transition = 'transform 0.2s ease-out'; // 애니메이션 효과

      // 3. 사진 이미지
      const img = document.createElement('img');
      img.src = record.imageUrl;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.style.display = 'block';

      inner.appendChild(img);
      el.appendChild(inner);
      
      // --- 호버 이벤트: 부모(el)가 아닌 자식(inner)만 확대 ---
      el.onmouseenter = () => {
        inner.style.transform = 'scale(1.8) rotate(-5deg)';
        inner.style.zIndex = '1000';
      };
      el.onmouseleave = () => {
        inner.style.transform = 'scale(1) rotate(0deg)';
        inner.style.zIndex = '1';
      };

      const marker = new mapboxgl.Marker(el)
        .setLngLat(record.coords)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<b>${record.location}</b><br>${record.date}`))
        .addTo(map.current);

      markers.current.push(marker);
    });
  }, [records]);

  return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
};

export default MapView;