import React from 'react';

const Timeline = ({ records, onDelete }) => {
  // 날짜 역순(최신순)으로 정렬 (ISTJ의 깔끔한 데이터 정리)
  const sortedRecords = [...records].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>여행 타임라인</h2>
      
      {sortedRecords.length === 0 ? (
        <div style={emptyMessageStyle}>등록된 여행 기록이 없습니다.</div>
      ) : (
        <div style={listStyle}>
          {sortedRecords.map((record) => (
            <div key={record.id} style={cardStyle}>
              {/* 왼쪽: 타임라인 선과 점 */}
              <div style={timelineDecorStyle}>
                <div style={dotStyle}></div>
                <div style={lineStyle}></div>
              </div>

              {/* 중간: 여행 정보 컨텐츠 */}
              <div style={contentStyle}>
                <div style={headerStyle}>
                  <span style={locationTextStyle}>{record.location}</span>
                  <span style={dateTextStyle}>{record.date}</span>
                </div>
                
                {record.memo && (
                  <p style={memoTextStyle}>{record.memo}</p>
                )}

                {/* 모바일 배포 시 사진 확인용 (선택사항) */}
                {record.imageUrl && (
                  <img 
                    src={record.imageUrl} 
                    alt={record.location} 
                    style={thumbnailStyle} 
                  />
                )}
              </div>

              {/* 오른쪽: 삭제 버튼 */}
              <div style={actionStyle}>
                <button 
                  onClick={() => {
                    if(window.confirm("이 기록을 삭제할까요?")) onDelete(record.id);
                  }} 
                  style={deleteButtonStyle}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- 가독성 높은 인라인 스타일 정의 ---

const containerStyle = {
  padding: '20px',
  backgroundColor: '#fff',
  maxWidth: '600px',
  margin: '0 auto'
};

const titleStyle = {
  fontSize: '22px',
  fontWeight: 'bold',
  marginBottom: '20px',
  color: '#333'
};

const listStyle = {
  display: 'flex',
  flexDirection: 'column'
};

const cardStyle = {
  display: 'flex',
  position: 'relative',
  marginBottom: '0', // 선 연결을 위해 0으로 설정
  paddingBottom: '25px'
};

const timelineDecorStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginRight: '15px'
};

const dotStyle = {
  width: '12px',
  height: '12px',
  backgroundColor: '#FF5A5F',
  borderRadius: '50%',
  zIndex: 2
};

const lineStyle = {
  width: '2px',
  flex: 1,
  backgroundColor: '#eee',
  marginTop: '5px'
};

const contentStyle = {
  flex: 1,
  backgroundColor: '#f9f9f9',
  padding: '15px',
  borderRadius: '12px',
  marginTop: '-5px' // 점과 수평 맞추기
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  marginBottom: '8px'
};

const locationTextStyle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#333'
};

const dateTextStyle = {
  fontSize: '13px',
  color: '#888'
};

const memoTextStyle = {
  fontSize: '14px',
  color: '#666',
  margin: '8px 0',
  lineHeight: '1.4'
};

const thumbnailStyle = {
  width: '100%',
  maxHeight: '150px',
  objectFit: 'cover',
  borderRadius: '8px',
  marginTop: '10px'
};

const actionStyle = {
  paddingLeft: '10px',
  display: 'flex',
  alignItems: 'flex-start'
};

const deleteButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#FF5A5F',
  fontSize: '13px',
  cursor: 'pointer',
  padding: '5px'
};

const emptyMessageStyle = {
  textAlign: 'center',
  padding: '40px 0',
  color: '#999'
};

export default Timeline;