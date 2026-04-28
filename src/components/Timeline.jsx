import React, { useState } from 'react';
import { db } from '../firebase-config';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';

const Timeline = ({ records, onSelect }) => {
  const [editingId, setEditingId] = useState(null);
  const [editMemo, setEditMemo] = useState('');

  const handleDelete = async (id) => {
    if (window.confirm("삭제하시겠습니까?")) {
      await deleteDoc(doc(db, "travels", id));
    }
  };

  const handleUpdate = async (id) => {
    await updateDoc(doc(db, "travels", id), { memo: editMemo });
    setEditingId(null);
  };

  // 자동 정렬: travelDateValue(202405 등) 기준 내림차순
  const sortedRecords = [...records].sort((a, b) => (b.travelDateValue || 0) - (a.travelDateValue || 0));

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>여행 타임라인</h2>
      {sortedRecords.map((record) => (
        <div key={record.id} style={cardStyle}>
          <div onClick={() => onSelect(record.coordinates)} style={{ cursor: 'pointer' }}>
            <span style={dateBadgeStyle}>{record.travelDateDisplay}</span>
            <div style={{ fontWeight: 'bold', marginTop: '5px' }}>{record.cityName}</div>
          </div>
          
          {editingId === record.id ? (
            <div style={{ marginTop: '10px' }}>
              <textarea value={editMemo} onChange={(e) => setEditMemo(e.target.value)} style={{ width: '100%', height: '50px' }} />
              <button onClick={() => handleUpdate(record.id)} style={smallBtnStyle}>완료</button>
            </div>
          ) : (
            <>
              <p style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>{record.memo}</p>
              <div style={{ marginTop: '10px' }}>
                <button onClick={() => { setEditingId(record.id); setEditMemo(record.memo); }} style={textBtnStyle}>수정</button>
                <button onClick={() => handleDelete(record.id)} style={{ ...textBtnStyle, color: 'red' }}>삭제</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

const cardStyle = { padding: '15px', border: '1px solid #eee', borderRadius: '10px', marginBottom: '15px' };
const dateBadgeStyle = { backgroundColor: '#FF5A5F', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '11px' };
const smallBtnStyle = { marginTop: '5px', padding: '5px 10px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '3px' };
const textBtnStyle = { border: 'none', backgroundColor: 'transparent', fontSize: '11px', color: '#999', cursor: 'pointer', marginRight: '10px' };

export default Timeline;