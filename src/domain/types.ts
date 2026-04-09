export type Player = {
  id: string;
  name: string;
  createdAt: string;
};

export type GameStatus = "active" | "finished";

export type Game = {
  id: string;
  title: string;
  createdAt: string;
  endedAt?: string;
  playerIds: string[];
  currentScores: number[];
  totalRounds: number;
  status: GameStatus;
  note: string;
};

export type RecordItem = {
  id: string;
  gameId: string;
  roundIndex: number;
  deltas: number[];
  afterScores: number[];
  note: string;
  createdAt: string;
};

export type AppState = {
  players: Player[];
  games: Game[];
  records: RecordItem[];
  activeGameId: string | null;
  lastTab: AppTabId;
};

export type AppTabId = "home" | "current" | "history" | "settings";
