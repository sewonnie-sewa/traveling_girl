import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, addDoc } from 'firebase/firestore';
import { fetchSuggestions } from '../services/GeocodingService';

const RecordModal = ({ user, onClose }) => {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [memo, setMemo] = useState('');
  
  // 연/월 상태 (기본값 현재 날짜)
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (city.length >= 2 && !selectedLocation) {
        const results = await fetchSuggestions(city);
        setSuggestions(results);
      } else {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [city, selectedLocation]);

  const handleSave = async () => {
    if (!selectedLocation) return alert("도시를 선택해주세요!");
    
    try {
      const dateValue = parseInt(`${year}${String(month).padStart(2, '0')}`);
      
      await addDoc(collection(db, "travels"), {
        userId: user.uid,
        cityName: selectedLocation.cityName,
        memo: memo,
        travelDateValue: dateValue, // 정렬용 (202405)
        travelDateDisplay: `${year}년 ${month}월`, // 표시용
        createdAt: new Date(),
        coordinates: selectedLocation.center,
      });
      onClose();
    } catch (e) { alert("저장 실패"); }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h3 style={{ margin: '0 0 15px 0' }}>📍 여행 기록</h3>
        
        {/* 날짜 선택 (연/월) */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
  <select value={year} onChange={(e) => setYear(e.target.value)} style={selectStyle}>
    {/* 2026년부터 2006년까지 역순으로 생성 */}
    {Array.from({ length: 2026 - 2006 + 1 }, (_, i) => 2026 - i).map(y => (
      <option key={y} value={y}>{y}년</option>
    ))}
  </select>
  
  <select value={month} onChange={(e) => setMonth(e.target.value)} style={selectStyle}>
    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
      <option key={m} value={m}>{m}월</option>
    ))}
  </select>
</div>

        <input 
          placeholder="도시 검색" 
          style={inputStyle} 
          value={city} 
          onChange={(e) => { setCity(e.target.value); setSelectedLocation(null); }} 
        />
        {suggestions.length > 0 && (
          <ul style={suggestionListStyle}>
            {suggestions.map((s, i) => <li key={i} onClick={() => { setCity(s.fullAddress); setSelectedLocation(s); setSuggestions([]); }} style={suggestionItemStyle}>{s.fullAddress}</li>)}
          </ul>
        )}
        
        <textarea placeholder="메모" style={textareaStyle} value={memo} onChange={(e) => setMemo(e.target.value)} />
        <button onClick={handleSave} style={saveButtonStyle}>저장</button>
      </div>
    </div>
  );
};

const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 };
const modalContentStyle = { backgroundColor: 'white', padding: '25px', borderRadius: '15px', width: '320px', display: 'flex', flexDirection: 'column' };
const selectStyle = { flex: 1, padding: '8px', borderRadius: '5px', border: '1px solid #ddd' };
const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #ddd', marginBottom: '10px' };
const suggestionListStyle = { position: 'absolute', top: '135px', left: '25px', right: '25px', backgroundColor: 'white', border: '1px solid #ddd', zIndex: 100, listStyle: 'none', padding: 0 };
const suggestionItemStyle = { padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee', fontSize: '12px' };
const textareaStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #ddd', height: '80px', marginBottom: '10px' };
const saveButtonStyle = { padding: '12px', backgroundColor: '#FF5A5F', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };

export default RecordModal;