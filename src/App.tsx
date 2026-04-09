import { AppShell } from "./components/AppShell";
import { CurrentGamePage } from "./feature/currentgame/CurrentGamePage";
import { HistoryPage } from "./feature/history/HistoryPage";
import { HomePage } from "./feature/home/HomePage";
import { SettingsPage } from "./feature/settings/SettingsPage";
import { useAppState } from "./hooks/useAppState";

export default function App() {
  const { state, actions } = useAppState();

  let page = <HomePage state={state} />;

  if (state.lastTab === "current") {
    page = (
      <CurrentGamePage
        state={state}
        onStartGame={actions.startGame}
        onSaveRound={actions.saveRound}
        onUndoLastRound={actions.undoLastRound}
        onFinishGame={actions.finishActiveGame}
      />
    );
  } else if (state.lastTab === "history") {
    page = <HistoryPage state={state} />;
  } else if (state.lastTab === "settings") {
    page = <SettingsPage state={state} onAddPlayer={actions.addPlayer} onResetAll={actions.resetAll} />;
  }

  return (
    <AppShell activeTab={state.lastTab} onChangeTab={actions.setTab}>
      {page}
    </AppShell>
  );
}
