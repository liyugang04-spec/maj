import type { AppState } from "../../domain/types";

type HistoryPageProps = {
  state: AppState;
};

export function HistoryPage({ state }: HistoryPageProps) {
  return (
    <section className="stack">
      <article className="panel">
        <h2>历史牌局</h2>
        {state.games.length === 0 ? (
          <p className="muted">还没有历史牌局。</p>
        ) : (
          <div className="list">
            {state.games.map((game) => {
              const gameRecords = state.records.filter((item) => item.gameId === game.id);
              const players = game.playerIds
                .map((playerId) => state.players.find((player) => player.id === playerId)?.name ?? "未知玩家")
                .join(" / ");
              return (
                <div key={game.id} className="list-row">
                  <div>
                    <strong>{game.title}</strong>
                    <p>{players}</p>
                    <p>
                      {game.status === "active" ? "进行中" : "已结束"} · {new Date(game.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span>{game.totalRounds || gameRecords.length} 手</span>
                </div>
              );
            })}
          </div>
        )}
      </article>
    </section>
  );
}
