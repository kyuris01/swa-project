import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useScoreboard } from '../contexts/ScoreboardContext';
import { formatTime, getElapsedTime } from '../utils/timeUtils';
import '../App.css';

const ScoreboardDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getScoreboard } = useScoreboard();
  const [scoreboard, setScoreboard] = useState(getScoreboard(id || ''));
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
      const updated = getScoreboard(id || '');
      if (updated) {
        setScoreboard(updated);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [id, getScoreboard]);

  if (!scoreboard) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          점수판을 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  const { elapsed, remaining } = getElapsedTime(scoreboard.startTime, scoreboard.duration);
  const sortedParticipants = [...scoreboard.participants].sort((a, b) => b.score - a.score);

  return (
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 className="page-title" style={{ marginBottom: '20px' }}>{scoreboard.name}</h1>
        
        {scoreboard.notice && (
          <div
            style={{
              background: '#fff3cd',
              border: '1px solid #ffc107',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '20px',
              color: '#856404',
            }}
          >
            <strong>운영자 공지:</strong> {scoreboard.notice}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '30px', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>진행 시간</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2196F3' }}>
              {formatTime(elapsed)}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>남은 시간</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: remaining < 300 ? '#f44336' : '#4CAF50' }}>
              {formatTime(remaining)}
            </div>
          </div>
        </div>
      </div>

      <div>
        {sortedParticipants.map((participant, index) => (
          <div
            key={participant.id}
            className="card"
            style={{
              cursor: 'default',
              background: index === 0 ? '#fff9e6' : 'white',
              border: index === 0 ? '2px solid #ffc107' : undefined,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: index === 0 ? '#ffc107' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : '#666',
                    minWidth: '40px',
                    textAlign: 'center',
                  }}
                >
                  {index + 1}등
                </div>
                <div>
                  <h3 style={{ marginBottom: '5px', color: '#333' }}>{participant.name}</h3>
                </div>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2196F3' }}>
                {participant.score}점
              </div>
            </div>
          </div>
        ))}
      </div>

      {scoreboard.customUrl && (
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <a
            href={scoreboard.customUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#2196F3',
              textDecoration: 'none',
              fontSize: '0.9rem',
            }}
          >
            커스텀 점수판 보기 →
          </a>
        </div>
      )}
    </div>
  );
};

export default ScoreboardDetailPage;

