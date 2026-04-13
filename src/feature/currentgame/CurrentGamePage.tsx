import { useMemo, useState } from "react";
import type { AppState } from "../../domain/types";

type CurrentGamePageProps = {
  state: AppState;
  onStartGame: (playerIds: string[], title: string) => string | null;
  onSaveRound: (deltas: number[], note: string) => string | null;
  onUndoLastRound: () => string | null;
  onFinishGame: () => string | null;
};

export function CurrentGamePage({
  state,
  onStartGame,
  onSaveRound,
  onUndoLastRound,
  onFinishGame
}: CurrentGamePageProps) {
  const activeGame = state.games.find((game) => game.id === state.activeGameId) ?? null;
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>(state.players.slice(0, 4).map((item) => item.id));
  const [gameTitle, setGameTitle] = useState("");
  const [roundInputs, setRoundInputs] = useState<string[]>(Array.from({ length: 4 }, () => ""));
  const [roundNote, setRoundNote] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const activeRecords = useMemo(() => {
    if (!activeGame) {
      return [];
    }
    return state.records
      .filter((item) => item.gameId === activeGame.id)
      .sort((a, b) => b.roundIndex - a.roundIndex);
  }, [activeGame, state.records]);

  const rankingEntries = useMemo(() => {
    if (!activeGame) {
      return [];
    }

    return activeGame.playerIds
      .map((playerId, index) => {
        const player = state.players.find((item) => item.id === playerId);
        return {
          playerId,
          name: player?.name ?? "未知玩家",
          score: activeGame.currentScores[index] ?? 0,
          index
        };
      })
      .sort((left, right) => right.score - left.score)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1
      }));
  }, [activeGame, state.players]);

  const rankingMap = useMemo(() => {
    return new Map(rankingEntries.map((entry) => [entry.playerId, entry.rank]));
  }, [rankingEntries]);

  function clearRoundInputs() {
    setRoundInputs(Array.from({ length: 4 }, () => ""));
    setRoundNote("");
  }

  return (
    <section className="stack">
      {!activeGame ? (
        <article className="panel">
          <h2>开始新牌局</h2>
          <p className="muted">先选择 4 位玩家并填写标题，然后进入当前牌局记账。</p>
          <label className="field">
            <span>牌局标题</span>
            <input
              value={gameTitle}
              onChange={(event) => setGameTitle(event.target.value)}
              placeholder="例如：周末晚场"
            />
          </label>
          <div className="player-pick-grid">
            {state.players.map((player) => {
              const checked = selectedPlayerIds.includes(player.id);
              return (
                <label key={player.id} className={`chip ${checked ? "is-checked" : ""}`}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      setSelectedPlayerIds((current) => {
                        if (checked) {
                          return current.filter((id) => id !== player.id);
                        }
                        if (current.length >= 4) {
                          setFeedback("当前牌局固定为 4 位玩家，请先取消一个再选择。");
                          return current;
                        }
                        setFeedback(null);
                        return [...current, player.id];
                      });
                    }}
                  />
                  <span>{player.name}</span>
                </label>
              );
            })}
          </div>
          {feedback ? <p className="error-text">{feedback}</p> : null}
          <button
            className="primary-button"
            type="button"
            onClick={() => {
              const message = onStartGame(selectedPlayerIds, gameTitle);
              setFeedback(message);
            }}
          >
            创建当前牌局
          </button>
        </article>
      ) : (
        <>
          <article className="panel">
            <div className="game-header">
              <div>
                <p className="eyebrow">当前牌局</p>
                <h2>{activeGame.title}</h2>
                <p className="muted">创建时间：{new Date(activeGame.createdAt).toLocaleString()}</p>
              </div>
              <div className="game-meta-grid">
                <article className="mini-stat">
                  <span>总手数</span>
                  <strong>{activeGame.totalRounds}</strong>
                </article>
                <article className="mini-stat">
                  <span>状态</span>
                  <strong>{activeGame.status === "active" ? "进行中" : "已结束"}</strong>
                </article>
              </div>
            </div>

            <div className="player-score-grid">
              {activeGame.playerIds.map((playerId, index) => {
                const player = state.players.find((item) => item.id === playerId);
                const score = activeGame.currentScores[index] ?? 0;
                return (
                  <article key={playerId} className="player-card">
                    <span className="player-rank">第 {rankingMap.get(playerId) ?? 4} 名</span>
                    <h3>{player?.name ?? "未知玩家"}</h3>
                    <strong className={score >= 0 ? "score-positive score-big" : "score-negative score-big"}>
                      {score > 0 ? `+${score}` : score}
                    </strong>
                  </article>
                );
              })}
            </div>
          </article>

          <article className="panel">
            <h3>本轮录入</h3>
            <div className="round-input-grid">
              {activeGame.playerIds.map((playerId, index) => {
                const player = state.players.find((item) => item.id === playerId);
                return (
                  <label key={playerId} className="field">
                    <span>{player?.name ?? "未知玩家"}</span>
                    <input
                      inputMode="numeric"
                      value={roundInputs[index] ?? ""}
                      onChange={(event) => {
                        const next = [...roundInputs];
                        next[index] = event.target.value;
                        setRoundInputs(next);
                      }}
                      placeholder="+10 / -5"
                    />
                  </label>
                );
              })}
            </div>
            <label className="field">
              <span>备注</span>
              <input
                value={roundNote}
                onChange={(event) => setRoundNote(event.target.value)}
                placeholder="例如：自摸、点炮、包牌"
              />
            </label>
            {feedback ? <p className="error-text">{feedback}</p> : null}
            <div className="action-row">
              <button
                className="primary-button"
                type="button"
                onClick={() => {
                  const parsed = roundInputs.map((value) => Number(value));
                  const hasInvalid = roundInputs.some((value) => !/^-?\d+$/.test(value.trim()));
                  if (hasInvalid) {
                    setFeedback("四个输入框都必须填写整数，例如 +10、-5、0。");
                    return;
                  }
                  const message = onSaveRound(parsed, roundNote);
                  if (message) {
                    setFeedback(message);
                    return;
                  }
                  clearRoundInputs();
                  setFeedback(null);
                }}
              >
                保存本轮
              </button>
              <button
                className="ghost-button"
                type="button"
                onClick={() => {
                  clearRoundInputs();
                  setFeedback(null);
                }}
              >
                清空输入
              </button>
              <button
                className="ghost-button"
                type="button"
                onClick={() => {
                  const message = onUndoLastRound();
                  setFeedback(message ?? "已撤销上一轮。");
                }}
              >
                撤销上一轮
              </button>
            </div>
            <button
              className="danger-button"
              type="button"
              onClick={() => {
                const message = onFinishGame();
                setFeedback(message ?? "牌局已结束。");
              }}
            >
              结束当前牌局
            </button>
          </article>

          <article className="panel">
            <h3>本局流水</h3>
            {activeRecords.length === 0 ? (
              <p className="muted">还没有记账记录。</p>
            ) : (
              <div className="list">
                {activeRecords.map((item) => {
                  return (
                    <div key={item.id} className="list-row">
                      <div>
                        <strong>第 {item.roundIndex} 手</strong>
                        <p>{item.note || "未填写备注"}</p>
                      </div>
                      <span className="round-summary">
                        {item.deltas.map((delta) => (delta > 0 ? `+${delta}` : `${delta}`)).join(" / ")}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </article>

          <article className="panel dice-rule-card">
            <div className="dice-rule-header">
              <h3>甩筛定位</h3>
              <span className="muted">速查规则</span>
            </div>
            <div className="dice-rule-list compact">
              <div className="dice-rule-row">
                <strong>1 / 5 / 9</strong>
                <span>庄家这边</span>
              </div>
              <div className="dice-rule-row">
                <strong>2 / 6 / 10</strong>
                <span>庄家的下家</span>
              </div>
              <div className="dice-rule-row">
                <strong>3 / 7 / 11</strong>
                <span>庄家的对家</span>
              </div>
              <div className="dice-rule-row">
                <strong>4 / 8 / 12</strong>
                <span>庄家的上家</span>
              </div>
            </div>
          </article>
        </>
      )}
    </section>
  );
}
