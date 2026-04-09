import type { AppState } from "../../domain/types";

type HomePageProps = {
  state: AppState;
};

export function HomePage({ state }: HomePageProps) {
  const activeGame = state.games.find((game) => game.id === state.activeGameId) ?? null;
  const finishedGames = state.games.filter((game) => game.status === "finished").length;

  return (
    <section className="stack">
      <div className="hero-card">
        <p className="eyebrow">完全本地</p>
        <h2>1102麻将大赛</h2>
        <p>
          1102麻将
        </p>
      </div>

      <div className="stats-grid">
        <article className="stat-card">
          <span>玩家</span>
          <strong>{state.players.length}</strong>
        </article>
        <article className="stat-card">
          <span>总牌局</span>
          <strong>{state.games.length}</strong>
        </article>
        <article className="stat-card">
          <span>已完成</span>
          <strong>{finishedGames}</strong>
        </article>
        <article className="stat-card">
          <span>记账条目</span>
          <strong>{state.records.length}</strong>
        </article>
      </div>

      <article className="panel">
        <h3>当前状态</h3>
        {activeGame ? (
          <p>
            {activeGame.title} 正在进行中，已记录 {activeGame.totalRounds} 手，当前总分：
            {activeGame.currentScores.join(" / ")}
          </p>
        ) : (
          <p>当前没有进行中的牌局，可以在“当前牌局”页面开始新的一局。</p>
        )}
      </article>
    </section>
  );
}
