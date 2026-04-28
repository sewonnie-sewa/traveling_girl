import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase-config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import MapView from './components/MapView';
import Timeline from './components/Timeline';
import Login from './components/Login';
import RecordModal from './components/RecordModal';

const App = () => {
  const [user, setUser] = useState(null);
  const [records, setRecords] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  // 1. 모바일 여부 감지 상태
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2. Firebase 로그인 상태 구독
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  // 3. Firestore 실시간 데이터 구독
  useEffect(() => {
    if (user) {
      const q = query(collection(db, "travels"), where("userId", "==", user.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setRecords(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      return () => unsubscribe();
    } else {
      setRecords([]);
    }
  }, [user]);

  // --- 레이아웃 스타일 정의 ---

  const appContainerStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    position: 'relative',
    fontFamily: "'Pretendard', -apple-system, sans-serif"
  };

  const mapSectionStyle = {
    flex: 1,
    height: isMobile ? '100%' : '100%',
    width: '100%',
    position: 'relative',
    zIndex: 1
  };

  // 모바일일 때는 하단에 고정된 바텀 시트, PC일 때는 왼쪽 사이드바
  const drawerStyle = isMobile ? {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '45vh', // 화면 높이의 45% 차지
    backgroundColor: '#fff',
    borderTopLeftRadius: '24px',
    borderTopRightRadius: '24px',
    boxShadow: '0 -4px 16px rgba(0,0,0,0.1)',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  } : {
    width: '360px',
    height: '100%',
    backgroundColor: '#fff',
    borderRight: '1px solid #eee',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 10
  };

  const scrollAreaStyle = {
    flex: 1,
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch' // 모바일 부드러운 스크롤
  };

  const handleBarStyle = {
    width: '40px',
    height: '4px',
    backgroundColor: '#ddd',
    borderRadius: '2px',
    margin: '12px auto',
    flexShrink: 0
  };

  const fabStyle = {
    position: 'absolute',
    bottom: isMobile ? 'calc(45vh + 20px)' : '30px', // 바텀 시트 바로 위에 뜨도록 계산
    right: '20px',
    width: '56px',
    height: '56px',
    borderRadius: '28px',
    backgroundColor: '#FF5A5F',
    color: '#fff',
    fontSize: '32px',
    border: 'none',
    boxShadow: '0 4px 12px rgba(255, 90, 95, 0.3)',
    cursor: 'pointer',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
  };

  return (
    <div style={appContainerStyle}>
      {/* 지도: 배경 전체 차지 */}
      <main style={mapSectionStyle}>
        <MapView records={records} focusCoords={selectedLocation} />
        
        {/* 등록 버튼 (FAB) */}
        <button 
          onClick={() => setIsModalOpen(true)} 
          style={fabStyle}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          +
        </button>
      </main>

      {/* 바텀 시트(모바일) / 사이드바(PC) */}
      <aside style={drawerStyle}>
        {isMobile && <div style={handleBarStyle} />}
        <div style={scrollAreaStyle}>
          <Login user={user} />
          <Timeline 
            records={records} 
            onSelect={(coords) => {
              setSelectedLocation(coords);
              // 모바일에서 리스트 클릭 시 지도를 더 잘 볼 수 있게 스크롤을 살짝 내림
              if (isMobile) {
                // 부드럽게 지도가 있는 상단으로 포커스
              }
            }} 
          />
        </div>
      </aside>

      {/* 입력 모달 */}
      {isModalOpen && (
        <RecordModal user={user} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default App;