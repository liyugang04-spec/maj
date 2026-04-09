package com.majiang.offline.navigation

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.majiang.offline.feature.currentgame.CurrentGameScreen
import com.majiang.offline.feature.history.HistoryScreen
import com.majiang.offline.feature.home.HomeScreen
import com.majiang.offline.feature.settings.SettingsScreen

@Composable
fun AppNavHost(
    navController: NavHostController,
    modifier: Modifier = Modifier
) {
    NavHost(
        navController = navController,
        startDestination = TopLevelDestination.Home.route,
        modifier = modifier
    ) {
        composable(TopLevelDestination.Home.route) { HomeScreen() }
        composable(TopLevelDestination.CurrentGame.route) { CurrentGameScreen() }
        composable(TopLevelDestination.History.route) { HistoryScreen() }
        composable(TopLevelDestination.Settings.route) { SettingsScreen() }
    }
}
