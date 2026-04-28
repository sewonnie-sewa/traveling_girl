import React from 'react';
import { auth, provider } from '../firebase-config';
import { signInWithPopup, signOut } from 'firebase/auth';

const Login = ({ user }) => {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("로그인 에러:", error);
      alert("로그인 중 오류가 발생했습니다.");
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div style={containerStyle}>
      {user ? (
        <div style={profileStyle}>
          <img src={user.photoURL} alt="프로필" style={avatarStyle} />
          <div style={textStyle}>
            <div style={nameStyle}>{user.displayName}님</div>
            <button onClick={handleLogout} style={logoutBtnStyle}>로그아웃</button>
          </div>
        </div>
      ) : (
        <button onClick={handleLogin} style={loginBtnStyle}>
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="G" 
            style={{ width: '18px' }} 
          />
          <span>Google로 시작하기</span>
        </button>
      )}
    </div>
  );
};

// --- 스타일 정의 ---
const containerStyle = { padding: '20px', borderBottom: '1px solid #eee' };
const loginBtnStyle = { 
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', 
  width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', 
  backgroundColor: 'white', cursor: 'pointer', fontWeight: '600', fontSize: '14px' 
};
const profileStyle = { display: 'flex', alignItems: 'center', gap: '12px' };
const avatarStyle = { width: '40px', height: '40px', borderRadius: '50%' };
const textStyle = { display: 'flex', flexDirection: 'column', gap: '4px' };
const nameStyle = { fontWeight: 'bold', fontSize: '14px' };
const logoutBtnStyle = { 
  border: 'none', backgroundColor: 'transparent', color: '#999', 
  fontSize: '12px', cursor: 'pointer', padding: 0, textAlign: 'left', textDecoration: 'underline' 
};

export default Login;