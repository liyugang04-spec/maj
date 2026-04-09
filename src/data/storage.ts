import type { AppState, Game, Player, RecordItem } from "../domain/types";

const STORAGE_KEY = "majiang-offline-app-state-v1";

const now = () => new Date().toISOString();

const starterPlayers: Player[] = [
  { id: "p1", name: "我", createdAt: now() },
  { id: "p2", name: "朋友A", createdAt: now() },
  { id: "p3", name: "朋友B", createdAt: now() },
  { id: "p4", name: "朋友C", createdAt: now() }
];

export const defaultState: AppState = {
  players: starterPlayers,
  games: [],
  records: [],
  activeGameId: null,
  lastTab: "home"
};

function isValidPlayer(value: unknown): value is Player {
  const player = value as Player;
  return !!player?.id && !!player?.name && !!player?.createdAt;
}

function normalizeGame(value: unknown, index: number): Game | null {
  const raw = value as Partial<Game> & {
    startedAt?: string;
  };

  if (!raw?.id || !Array.isArray(raw.playerIds) || !raw.status) {
    return null;
  }

  const playerCount = raw.playerIds.length;
  const currentScores =
    Array.isArray(raw.currentScores) && raw.currentScores.length === playerCount
      ? raw.currentScores.map((score) => (typeof score === "number" ? score : 0))
      : Array.from({ length: playerCount }, () => 0);

  return {
    id: raw.id,
    title:
      typeof raw.title === "string" && raw.title.trim()
        ? raw.title.trim()
        : `牌局 ${index + 1}`,
    createdAt:
      typeof raw.createdAt === "string"
        ? raw.createdAt
        : typeof raw.startedAt === "string"
          ? raw.startedAt
          : now(),
    endedAt: typeof raw.endedAt === "string" ? raw.endedAt : undefined,
    playerIds: raw.playerIds.filter((item): item is string => typeof item === "string"),
    currentScores,
    totalRounds: typeof raw.totalRounds === "number" ? raw.totalRounds : 0,
    status: raw.status,
    note: typeof raw.note === "string" ? raw.note : ""
  };
}

function normalizeRecord(value: unknown): RecordItem | null {
  const item = value as Partial<RecordItem>;

  if (!item?.id || !item.gameId || !Array.isArray(item.deltas) || !Array.isArray(item.afterScores)) {
    return null;
  }

  return {
    id: item.id,
    gameId: item.gameId,
    roundIndex: typeof item.roundIndex === "number" ? item.roundIndex : 0,
    deltas: item.deltas.map((delta) => (typeof delta === "number" ? delta : 0)),
    afterScores: item.afterScores.map((score) => (typeof score === "number" ? score : 0)),
    note: typeof item.note === "string" ? item.note : "",
    createdAt: typeof item.createdAt === "string" ? item.createdAt : now()
  };
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultState;
    }

    const parsed = JSON.parse(raw) as Partial<AppState>;
    const games = Array.isArray(parsed.games)
      ? parsed.games
          .map((game, index) => normalizeGame(game, index))
          .filter((game): game is Game => game !== null)
      : [];
    const records = Array.isArray(parsed.records)
      ? parsed.records
          .map((record) => normalizeRecord(record))
          .filter((record): record is RecordItem => record !== null)
      : [];
    const activeGameId =
      typeof parsed.activeGameId === "string" && games.some((game) => game.id === parsed.activeGameId)
        ? parsed.activeGameId
        : null;

    return {
      players: Array.isArray(parsed.players) ? parsed.players.filter(isValidPlayer) : defaultState.players,
      games,
      records,
      activeGameId,
      lastTab: parsed.lastTab ?? "home"
    };
  } catch {
    return defaultState;
  }
}

export function saveState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
