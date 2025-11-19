import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Scoreboard, Participant } from '../types';

interface ScoreboardContextType {
  scoreboards: Scoreboard[];
  addScoreboard: (scoreboard: Omit<Scoreboard, 'id' | 'createdAt' | 'viewerId'>) => string;
  updateScoreboard: (id: string, updates: Partial<Scoreboard>) => void;
  getScoreboard: (id: string) => Scoreboard | undefined;
  deleteScoreboard: (id: string) => void;
  updateParticipantScore: (scoreboardId: string, participantId: string, score: number, history?: string) => void;
  startScoreboard: (id: string) => void;
  stopScoreboard: (id: string) => void;
  restartScoreboard: (id: string) => void;
}

const ScoreboardContext = createContext<ScoreboardContextType | undefined>(undefined);

export const useScoreboard = () => {
  const context = useContext(ScoreboardContext);
  if (!context) {
    throw new Error('useScoreboard must be used within ScoreboardProvider');
  }
  return context;
};

export const ScoreboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [scoreboards, setScoreboards] = useState<Scoreboard[]>(() => {
    const saved = localStorage.getItem('scoreboards');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('scoreboards', JSON.stringify(scoreboards));
  }, [scoreboards]);

  const generateId = () => Math.random().toString(36).substring(2, 15);

  const addScoreboard = (scoreboardData: Omit<Scoreboard, 'id' | 'createdAt' | 'viewerId'>): string => {
    const id = generateId();
    const viewerId = generateId();
    const newScoreboard: Scoreboard = {
      ...scoreboardData,
      id,
      viewerId,
      createdAt: Date.now(),
    };
    setScoreboards((prev) => [...prev, newScoreboard]);
    return id;
  };

  const updateScoreboard = (id: string, updates: Partial<Scoreboard>) => {
    setScoreboards((prev) =>
      prev.map((sb) => (sb.id === id ? { ...sb, ...updates } : sb))
    );
  };

  const getScoreboard = (id: string): Scoreboard | undefined => {
    return scoreboards.find((sb) => sb.id === id || sb.viewerId === id);
  };

  const deleteScoreboard = (id: string) => {
    setScoreboards((prev) => prev.filter((sb) => sb.id !== id));
  };

  const updateParticipantScore = (scoreboardId: string, participantId: string, score: number, history?: string) => {
    setScoreboards((prev) =>
      prev.map((sb) => {
        if (sb.id === scoreboardId) {
          const updatedParticipants = sb.participants.map((p) => {
            if (p.id === participantId) {
              const newScore = p.score + score;
              const newHistory = history
                ? [...p.history, `${new Date().toLocaleTimeString()}: ${history}`]
                : p.history;
              return { ...p, score: newScore, history: newHistory };
            }
            return p;
          });
          return { ...sb, participants: updatedParticipants };
        }
        return sb;
      })
    );
  };

  const startScoreboard = (id: string) => {
    setScoreboards((prev) =>
      prev.map((sb) =>
        sb.id === id ? { ...sb, isRunning: true, startTime: Date.now() } : sb
      )
    );
  };

  const stopScoreboard = (id: string) => {
    setScoreboards((prev) =>
      prev.map((sb) => (sb.id === id ? { ...sb, isRunning: false } : sb))
    );
  };

  const restartScoreboard = (id: string) => {
    setScoreboards((prev) =>
      prev.map((sb) =>
        sb.id === id ? { ...sb, isRunning: false, startTime: null, participants: sb.participants.map((p) => ({ ...p, score: 0, history: [] })) } : sb
      )
    );
  };

  return (
    <ScoreboardContext.Provider
      value={{
        scoreboards,
        addScoreboard,
        updateScoreboard,
        getScoreboard,
        deleteScoreboard,
        updateParticipantScore,
        startScoreboard,
        stopScoreboard,
        restartScoreboard,
      }}
    >
      {children}
    </ScoreboardContext.Provider>
  );
};

