import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useScoreboard } from '../contexts/ScoreboardContext';
import '../App.css';

const AdminHomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { scoreboards } = useScoreboard();
  const [showAdminIdModal, setShowAdminIdModal] = useState(false);
  const [adminIdInput, setAdminIdInput] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleCreateClick = () => {
    navigate('/admin/settings/new');
  };

  const handleManageClick = (adminId: string) => {
    navigate(`/admin/score/${adminId}`);
  };

  const handleAdminIdManage = () => {
    if (adminIdInput.trim()) {
      const scoreboard = scoreboards.find((sb) => sb.adminId === adminIdInput.trim());
      if (scoreboard) {
        navigate(`/admin/score/${adminIdInput.trim()}`);
        setShowAdminIdModal(false);
        setAdminIdInput('');
      } else {
        alert('해당 관리 ID를 가진 점수판을 찾을 수 없습니다.');
      }
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>관리자 화면</h1>
        <button className="button button-secondary" onClick={logout} style={{ padding: '8px 16px' }}>
          로그아웃
        </button>
      </div>

      <div style={{ marginBottom: '30px' }}>
        {scoreboards.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            등록된 점수판이 없습니다.
          </div>
        ) : (
          scoreboards.map((scoreboard) => (
            <div key={scoreboard.id} className="card" style={{ cursor: 'default' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ marginBottom: '8px', color: '#333' }}>{scoreboard.name}</h3>
                  <div style={{ color: '#666', fontSize: '0.9rem' }}>
                    관리 ID: {scoreboard.adminId}
                  </div>
                </div>
                <button
                  className="button button-secondary"
                  onClick={() => handleManageClick(scoreboard.adminId)}
                  style={{ padding: '8px 16px' }}
                >
                  관리
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="button button-secondary" onClick={() => setShowAdminIdModal(true)}>
          공유ID로 관리
        </button>
        <button className="button button-primary" onClick={handleCreateClick}>
          점수판 생성
        </button>
      </div>

      {showAdminIdModal && (
        <div className="modal" onClick={() => setShowAdminIdModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">공유ID로 관리</h2>
            <div className="form-group">
              <label className="form-label">관리 ID 입력</label>
              <input
                type="text"
                className="input"
                value={adminIdInput}
                onChange={(e) => setAdminIdInput(e.target.value)}
                placeholder="관리 ID를 입력하세요"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAdminIdManage();
                  }
                }}
              />
            </div>
            <div className="button-group">
              <button className="button button-primary" onClick={handleAdminIdManage}>
                이동
              </button>
              <button
                className="button button-secondary"
                onClick={() => {
                  setShowAdminIdModal(false);
                  setAdminIdInput('');
                }}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHomePage;

