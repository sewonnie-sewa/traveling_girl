import React, { useState } from 'react';
import { db, storage } from '../firebase-config';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Mapbox 토큰 (본인의 토큰으로 교체하세요)
const MapboxToken = 'pk.eyJ1Ijoic2V3b25uaWUiLCJhIjoiY21vaHc0d2toMDBiMzJzbXR6N3VsY3BlbSJ9.qEAir2NIpf1EBfGg3O3wxw'; 

const RecordModal = ({ user, onClose }) => {
  // --- 1. 상태 선언 (에러가 났던 변수들을 여기서 모두 정의합니다) ---
  const [locationName, setLocationName] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [date, setDate] = useState('');
  const [memo, setMemo] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- 2. 장소 검색 함수 (한국어 설정 포함) ---
  const handleSearch = async (query) => {
    setLocationName(query);
    if (query.length > 1) {
      try {
        const resp = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${MapboxToken}&autocomplete=true&limit=5&language=ko`
        );
        const data = await resp.json();
        setSearchResults(data.features || []);
      } catch (err) {
        console.error("검색 에러:", err);
      }
    } else {
      setSearchResults([]);
    }
  };

  // --- 3. 저장 함수 ---
  const handleSave = async () => {
    if (!selectedCoords || !imageFile || !date) {
      return alert("장소 선택(검색), 날짜, 사진은 필수입니다!");
    }
    setLoading(true);
    
    try {
      // 사진 업로드
      const storageRef = ref(storage, `travels/${user.uid}/${Date.now()}_${imageFile.name}`);
      const uploadResult = await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(uploadResult.ref);

      // Firestore 저장
      await addDoc(collection(db, "travels"), {
        userId: user.uid,
        location: locationName,
        date: date,
        memo: memo,
        imageUrl: imageUrl,
        coords: selectedCoords, 
        createdAt: new Date()
      });

      alert("추억이 성공적으로 저장되었습니다!");
      onClose(); // 모달 닫기
    } catch (e) {
      console.error("저장 에러:", e);
      alert("저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // --- 4. UI 렌더링 ---
  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h3 style={{ marginTop: 0 }}>📷 추억 기록하기</h3>
        
        <label style={labelStyle}>장소 검색 (한글 가능)</label>
        <input 
          type="text" 
          value={locationName}
          placeholder="어디에 다녀오셨나요?" 
          style={inputStyle}
          onChange={(e) => handleSearch(e.target.value)} 
        />

        {/* 검색 결과 리스트 */}
        {searchResults.length > 0 && (
          <ul style={searchListStyle}>
            {searchResults.map((result) => (
              <li 
                key={result.id} 
                style={searchItemStyle}
                onClick={() => {
                  setLocationName(result.place_name);
                  setSelectedCoords(result.center);
                  setSearchResults([]);
                }}
              >
                {result.place_name}
              </li>
            ))}
          </ul>
        )}

        <label style={labelStyle}>방문 날짜</label>
        <input 
          type="month" 
          style={inputStyle} 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
        />

        <label style={labelStyle}>사진 선택 (폴라로이드용)</label>
        <input 
          type="file" 
          accept="image/*" 
          style={{ marginBottom: '20px' }} 
          onChange={(e) => setImageFile(e.target.files[0])} 
        />

        <div style={buttonGroupStyle}>
          <button 
            onClick={handleSave} 
            disabled={loading} 
            style={loading ? { ...saveButtonStyle, backgroundColor: '#ccc' } : saveButtonStyle}
          >
            {loading ? "기록 중..." : "저장하기"}
          </button>
          <button onClick={onClose} style={cancelButtonStyle}>취소</button>
        </div>
      </div>
    </div>
  );
};

// --- 스타일 정의 (변경 없음) ---
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 };
const modalContentStyle = { backgroundColor: 'white', padding: '24px', borderRadius: '16px', width: '90%', maxWidth: '400px' };
const labelStyle = { fontSize: '14px', fontWeight: 'bold', color: '#555', marginBottom: '5px', display: 'block' };
const inputStyle = { padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd', width: '100%', boxSizing: 'border-box' };
const searchListStyle = { listStyle: 'none', padding: 0, margin: '-10px 0 15px 0', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#f9f9f9', maxHeight: '150px', overflowY: 'auto' };
const searchItemStyle = { padding: '10px', cursor: 'pointer', fontSize: '13px', borderBottom: '1px solid #f0f0f0' };
const buttonGroupStyle = { display: 'flex', gap: '10px' };
const saveButtonStyle = { flex: 1, padding: '14px', backgroundColor: '#FF5A5F', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };
const cancelButtonStyle = { flex: 1, padding: '14px', backgroundColor: '#eee', border: 'none', borderRadius: '8px', cursor: 'pointer' };

export default RecordModal;