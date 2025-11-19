import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useScoreboard } from '../contexts/ScoreboardContext';
import '../App.css';

const ScoreManagementPage = () => {
  const { adminId } = useParams<{ adminId: string }>();
  const navigate = useNavigate();
  const { scoreboards, updateParticipantScore, getScoreboard } = useScoreboard();
  const [scoreboard, setScoreboard] = useState(
    scoreboards.find((sb) => sb.adminId === adminId)
  );
  const [historyInputs, setHistoryInputs] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const sb = scoreboards.find((sb) => sb.adminId === adminId);
    setScoreboard(sb);
  }, [scoreboards, adminId]);

  if (!scoreboard) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          점수판을 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  const handleScoreChange = (participantId: string, delta: number) => {
    updateParticipantScore(scoreboard.id, participantId, delta);
  };

  const handleHistorySubmit = (participantId: string) => {
    const history = historyInputs[participantId]?.trim();
    if (history) {
      updateParticipantScore(scoreboard.id, participantId, 0, history);
      setHistoryInputs({ ...historyInputs, [participantId]: '' });
    }
  };

  const copyAdminId = () => {
    navigator.clipboard.writeText(scoreboard.adminId);
    alert('관리 ID가 클립보드에 복사되었습니다.');
  };

  const sortedParticipants = [...scoreboard.participants].sort((a, b) => b.score - a.score);

  return (
    <div className="container">
      <h1 className="page-title">{scoreboard.name} - 점수 관리</h1>

      <div style={{ marginBottom: '30px' }}>
        {sortedParticipants.map((participant) => (
          <div key={participant.id} className="card" style={{ cursor: 'default' }}>
            <div style={{ marginBottom: '15px' }}>
              <h3 style={{ marginBottom: '10px', color: '#333' }}>{participant.name}</h3>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2196F3', marginBottom: '10px' }}>
                점수: {participant.score}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
              <button
                className="button button-primary"
                onClick={() => handleScoreChange(participant.id, 1)}
                style={{ padding: '8px 16px' }}
              >
                +1
              </button>
              <button
                className="button button-primary"
                onClick={() => handleScoreChange(participant.id, 5)}
                style={{ padding: '8px 16px' }}
              >
                +5
              </button>
              <button
                className="button button-primary"
                onClick={() => handleScoreChange(participant.id, 10)}
                style={{ padding: '8px 16px' }}
              >
                +10
              </button>
              <button
                className="button button-danger"
                onClick={() => handleScoreChange(participant.id, -1)}
                style={{ padding: '8px 16px' }}
              >
                -1
              </button>
              <button
                className="button button-danger"
                onClick={() => handleScoreChange(participant.id, -5)}
                style={{ padding: '8px 16px' }}
              >
                -5
              </button>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <input
                type="text"
                className="input"
                placeholder="점수 히스토리 입력"
                value={historyInputs[participant.id] || ''}
                onChange={(e) =>
                  setHistoryInputs({ ...historyInputs, [participant.id]: e.target.value })
                }
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleHistorySubmit(participant.id);
                  }
                }}
                style={{ marginBottom: '8px' }}
              />
              <button
                className="button button-secondary"
                onClick={() => handleHistorySubmit(participant.id)}
                style={{ padding: '6px 12px', fontSize: '0.9rem' }}
              >
                히스토리 추가
              </button>
            </div>

            {participant.history.length > 0 && (
              <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
                <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '8px' }}>히스토리:</div>
                <div style={{ fontSize: '0.85rem', color: '#888' }}>
                  {participant.history.slice(-5).map((h, idx) => (
                    <div key={idx} style={{ marginBottom: '4px' }}>{h}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="button button-secondary" onClick={copyAdminId}>
          관리ID 공유
        </button>
        <button
          className="button button-primary"
          onClick={() => navigate(`/admin/settings/${scoreboard.id}`)}
        >
          설정 탭 이동
        </button>
      </div>
    </div>
  );
};

export default ScoreManagementPage;

