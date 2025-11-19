export interface Scoreboard {
  id: string;
  name: string;
  adminId: string;
  viewerId: string;
  notice: string;
  duration: number; // 경기 시간 (초)
  startTime: number | null; // 시작 시간 (타임스탬프)
  isRunning: boolean;
  participants: Participant[];
  customUrl?: string;
  createdAt: number;
}

export interface Participant {
  id: string;
  name: string;
  score: number;
  history: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: number;
}

