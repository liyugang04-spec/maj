package com.majiang.offline.navigation

sealed class TopLevelDestination(
    val route: String,
    val label: String
) {
    data object Home : TopLevelDestination("home", "Home")
    data object CurrentGame : TopLevelDestination("current_game", "Current")
    data object History : TopLevelDestination("history", "History")
    data object Settings : TopLevelDestination("settings", "Settings")

    companion object {
        val items = listOf(Home, CurrentGame, History, Settings)
    }
}
