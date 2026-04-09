package com.majiang.offline

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import com.majiang.offline.ui.MajiangApp
import com.majiang.offline.ui.theme.MajiangTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MajiangTheme {
                MajiangApp()
            }
        }
    }
}
