import { useEffect, useMemo, useState } from "react";
import { defaultState, loadState, saveState } from "../data/storage";
import { createId } from "../data/utils";
import type { AppState, AppTabId } from "../domain/types";

const GAME_SIZE = 4;

export function useAppState() {
  const [state, setState] = useState<AppState>(() => loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  const actions = useMemo(
    () => ({
      setTab(tab: AppTabId) {
        setState((current) => ({ ...current, lastTab: tab }));
      },
      addPlayer(name: string) {
        const trimmed = name.trim();
        if (!trimmed) {
          return;
        }
        setState((current) => ({
          ...current,
          players: [
            ...current.players,
            { id: createId("player"), name: trimmed, createdAt: new Date().toISOString() }
          ]
        }));
      },
      startGame(selectedPlayerIds: string[], title: string) {
        const uniquePlayerIds = Array.from(new Set(selectedPlayerIds));
        if (uniquePlayerIds.length !== GAME_SIZE) {
          return "必须选择 4 位玩家才能开始牌局。";
        }

        let message: string | null = null;

        setState((current) => {
          if (current.activeGameId) {
            message = "当前已有进行中的牌局，请先结束或完成当前牌局。";
            return current;
          }

          const gameId = createId("game");
          const createdAt = new Date().toISOString();
          const nextIndex = current.games.length + 1;
          return {
            ...current,
            games: [
              {
                id: gameId,
                title: title.trim() || `第 ${nextIndex} 场牌局`,
                createdAt,
                playerIds: uniquePlayerIds,
                currentScores: Array.from({ length: GAME_SIZE }, () => 0),
                totalRounds: 0,
                status: "active",
                note: ""
              },
              ...current.games
            ],
            activeGameId: gameId,
            lastTab: "current"
          };
        });

        return message;
      },
      saveRound(deltas: number[], note: string) {
        let message: string | null = null;

        setState((current) => {
          if (!current.activeGameId) {
            message = "当前没有进行中的牌局。";
            return current;
          }

          const activeGame = current.games.find((game) => game.id === current.activeGameId);
          if (!activeGame) {
            message = "未找到当前牌局。";
            return current;
          }

          if (deltas.length !== GAME_SIZE || deltas.some((delta) => !Number.isInteger(delta))) {
            message = "请为四位玩家输入合法整数。";
            return current;
          }

          const totalDelta = deltas.reduce((sum, delta) => sum + delta, 0);
          if (totalDelta !== 0) {
            message = "本轮四位玩家分数变化总和必须为 0。";
            return current;
          }

          const afterScores = activeGame.currentScores.map((score, index) => score + deltas[index]);
          const nextRoundIndex = activeGame.totalRounds + 1;

          return {
            ...current,
            games: current.games.map((game) =>
              game.id === activeGame.id
                ? {
                    ...game,
                    currentScores: afterScores,
                    totalRounds: nextRoundIndex
                  }
                : game
            ),
            records: [
              {
                id: createId("record"),
                gameId: activeGame.id,
                roundIndex: nextRoundIndex,
                deltas,
                afterScores,
                note: note.trim(),
                createdAt: new Date().toISOString()
              },
              ...current.records
            ]
          };
        });

        return message;
      },
      undoLastRound() {
        let message: string | null = null;

        setState((current) => {
          if (!current.activeGameId) {
            message = "当前没有进行中的牌局。";
            return current;
          }

          const activeGame = current.games.find((game) => game.id === current.activeGameId);
          if (!activeGame) {
            message = "未找到当前牌局。";
            return current;
          }

          const gameRecords = current.records
            .filter((record) => record.gameId === activeGame.id)
            .sort((a, b) => b.roundIndex - a.roundIndex);
          const latestRecord = gameRecords[0];

          if (!latestRecord) {
            message = "当前没有可撤销的记录。";
            return current;
          }

          const previousRecord = gameRecords[1];
          const rolledBackScores = previousRecord
            ? previousRecord.afterScores
            : Array.from({ length: activeGame.playerIds.length }, () => 0);
          const nextRounds = Math.max(activeGame.totalRounds - 1, 0);

          return {
            ...current,
            games: current.games.map((game) =>
              game.id === activeGame.id
                ? {
                    ...game,
                    currentScores: rolledBackScores,
                    totalRounds: nextRounds
                  }
                : game
            ),
            records: current.records.filter((record) => record.id !== latestRecord.id)
          };
        });

        return message;
      },
      finishActiveGame() {
        let message: string | null = null;

        setState((current) => {
          if (!current.activeGameId) {
            message = "当前没有进行中的牌局。";
            return current;
          }
          return {
            ...current,
            games: current.games.map((game) =>
              game.id === current.activeGameId
                ? { ...game, status: "finished", endedAt: new Date().toISOString() }
                : game
            ),
            activeGameId: null
          };
        });
        return message;
      },
      resetAll() {
        setState(defaultState);
      }
    }),
    []
  );

  return { state, actions };
}
