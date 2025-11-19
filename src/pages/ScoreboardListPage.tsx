import { useNavigate } from 'react-router-dom';
import { useScoreboard } from '../contexts/ScoreboardContext';
import { formatTime, getElapsedTime } from '../utils/timeUtils';
import '../App.css';

const ScoreboardListPage = () => {
  const navigate = useNavigate();
  const { scoreboards } = useScoreboard();

  const handleCreateClick = () => {
    navigate('/login');
  };

  const handleScoreboardClick = (viewerId: string) => {
    navigate(`/scoreboard/${viewerId}`);
  };

  return (
    <div className="container">
      <h1 className="page-title">오픈하우스 점수판</h1>
      
      <div style={{ marginBottom: '30px' }}>
        {scoreboards.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            등록된 점수판이 없습니다.
          </div>
        ) : (
          scoreboards.map((scoreboard) => {
            const { elapsed } = getElapsedTime(scoreboard.startTime, scoreboard.duration);
            return (
              <div
                key={scoreboard.id}
                className="card"
                onClick={() => handleScoreboardClick(scoreboard.viewerId)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ marginBottom: '8px', color: '#333' }}>{scoreboard.name}</h3>
                    <div style={{ color: '#666', fontSize: '0.9rem' }}>
                      경기 시간: {formatTime(elapsed)}
                    </div>
                  </div>
                  <div style={{ color: '#2196F3', fontWeight: '500' }}>
                    Viewer
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <button className="button button-primary" onClick={handleCreateClick}>
          점수판 만들기
        </button>
      </div>
    </div>
  );
};

export default ScoreboardListPage;

