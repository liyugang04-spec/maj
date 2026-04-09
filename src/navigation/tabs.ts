import type { AppTabId } from "../domain/types";

export type AppTab = {
  id: AppTabId;
  label: string;
  icon: string;
};

export const appTabs: AppTab[] = [
  { id: "home", label: "首页", icon: "⌂" },
  { id: "current", label: "当前牌局", icon: "▣" },
  { id: "history", label: "历史", icon: "◷" },
  { id: "settings", label: "设置", icon: "⋯" }
];
