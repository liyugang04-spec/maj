import type { ReactNode } from "react";
import { appTabs } from "../navigation/tabs";
import type { AppTabId } from "../domain/types";

type AppShellProps = {
  activeTab: AppTabId;
  onChangeTab: (tab: AppTabId) => void;
  children: ReactNode;
};

export function AppShell({ activeTab, onChangeTab, children }: AppShellProps) {
  const mascotSrc = `${import.meta.env.BASE_URL}icons/mascot-1102.jpg`;

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-content">
          <div>
            <p className="eyebrow">Personal Offline PWA</p>
            <h1>1102麻将大赛</h1>
          </div>
          <img className="topbar-mascot" src={mascotSrc} alt="1102吉祥物" />
        </div>
      </header>
      <main className="page-container">{children}</main>
      <nav className="tabbar" aria-label="主导航">
        {appTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`tab-button ${activeTab === tab.id ? "is-active" : ""}`}
            onClick={() => onChangeTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
