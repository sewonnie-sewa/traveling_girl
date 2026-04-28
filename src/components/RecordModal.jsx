import React, { useState } from 'react';
import { db, storage } from '../firebase-config';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const RecordModal = ({ user, onClose, selectedCoords }) => {
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(''); // 날짜 상태 (연월일)
  const [memo, setMemo] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    // 필수값 체크 (ISTJ 스타일의 꼼꼼한 검증)
    if (!location || !date || !imageFile) {
      return alert("장소, 날짜, 사진은 필수 입력 항목입니다.");
    }
    if (!selectedCoords) {
      return alert("지도에서 위치를 먼저 클릭해주세요.");
    }

    setLoading(true);

    try {
      // 1. Firebase Storage에 이미지 업로드
      const storageRef = ref(storage, `travels/${user.uid}/${Date.now()}_${imageFile.name}`);
      const uploadResult = await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(uploadResult.ref);

      // 2. Firestore에 모든 데이터 저장
      await addDoc(collection(db, "travels"), {
        userId: user.uid,
        location: location,
        date: date,      // 기록한 날짜 (예: 2006-05)
        memo: memo,
        imageUrl: imageUrl,
        coords: selectedCoords, // 지도에서 클릭한 좌표 [lng, lat]
        createdAt: new Date()
      });

      alert("소중한 추억이 저장되었습니다.");
      onClose();
    } catch (e) {
      console.error("저장 중 에러 발생:", e);
      alert("저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h3 style={{ marginTop: 0 }}>📷 추억 기록하기</h3>
        
        <label style={labelStyle}>방문 장소</label>
        <input 
          type="text" 
          placeholder="예: 건국대학교" 
          style={inputStyle}
          value={location}
          onChange={(e) => setLocation(e.target.value)} 
        />

        <label style={labelStyle}>방문 날짜</label>
        <input 
          type="month" // '연-월'만 선택하도록 설정 (과거 기록에 최적화)
          style={inputStyle}
          value={date}
          onChange={(e) => setDate(e.target.value)} 
        />

        <label style={labelStyle}>메모</label>
        <textarea 
          placeholder="그때의 기분은 어땠나요?" 
          style={{ ...inputStyle, height: '80px', resize: 'none' }}
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />

        <label style={labelStyle}>사진 업로드 (폴라로이드 핀)</label>
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
            style={loading ? disabledButtonStyle : saveButtonStyle}
          >
            {loading ? "기록 중..." : "저장하기"}
          </button>
          <button onClick={onClose} style={cancelButtonStyle}>취소</button>
        </div>
      </div>
    </div>
  );
};

// --- 간단한 스타일 정의 ---
const modalOverlayStyle = {
  position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
  backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000
};

const modalContentStyle = {
  backgroundColor: 'white', padding: '24px', borderRadius: '16px', width: '90%', maxWidth: '400px', display: 'flex', flexDirection: 'column'
};

const labelStyle = { fontSize: '14px', fontWeight: 'bold', marginBottom: '6px', color: '#555' };
const inputStyle = { padding: '10px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #ddd' };
const buttonGroupStyle = { display: 'flex', gap: '10px', marginTop: '10px' };
const saveButtonStyle = { flex: 1, padding: '12px', backgroundColor: '#FF5A5F', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const disabledButtonStyle = { ...saveButtonStyle, backgroundColor: '#ccc', cursor: 'not-allowed' };
const cancelButtonStyle = { flex: 1, padding: '12px', backgroundColor: '#eee', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer' };

export default RecordModal;