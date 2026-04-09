import { useState } from "react";
import type { AppState } from "../../domain/types";

type SettingsPageProps = {
  state: AppState;
  onAddPlayer: (name: string) => void;
  onResetAll: () => void;
};

export function SettingsPage({ state, onAddPlayer, onResetAll }: SettingsPageProps) {
  const [playerName, setPlayerName] = useState("");

  return (
    <section className="stack">
      <article className="panel">
        <h2>玩家管理</h2>
        <div className="form-grid compact">
          <label className="field">
            <span>新增玩家</span>
            <input
              value={playerName}
              onChange={(event) => setPlayerName(event.target.value)}
              placeholder="输入玩家名称"
            />
          </label>
          <button
            className="primary-button"
            type="button"
            onClick={() => {
              onAddPlayer(playerName);
              setPlayerName("");
            }}
          >
            添加
          </button>
        </div>
        <div className="list">
          {state.players.map((player) => (
            <div key={player.id} className="list-row">
              <div>
                <strong>{player.name}</strong>
                <p>{new Date(player.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className="panel warning-panel">
        <h2>本地数据</h2>
        <p className="muted">当前版本使用 localStorage，刷新页面后数据会保留在本机浏览器中。</p>
        <button className="danger-button" type="button" onClick={onResetAll}>
          清空所有本地数据
        </button>
      </article>
    </section>
  );
}
