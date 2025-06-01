package com.example.pzpi_22_4_atamanova_oleksandra_lab2

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.*
import androidx.compose.material3.*
import androidx.compose.foundation.layout.*
import androidx.compose.ui.Modifier
import com.example.pzpi_22_4_atamanova_oleksandra_lab2.ui.theme.Pzpi224atamanovaoleksandralab2Theme
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.ui.graphics.vector.ImageVector

sealed class BottomNavItem(val title: String, val icon: ImageVector) {
    object Catalog : BottomNavItem("Catalog", Icons.Default.List)
    object Orders : BottomNavItem("Orders", Icons.Default.ShoppingCart)
    object Create : BottomNavItem("Create", Icons.Default.Add)
    object Alerts : BottomNavItem("Alerts", Icons.Default.Notifications)
    object Profile : BottomNavItem("Profile", Icons.Default.Person)
}

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            Pzpi224atamanovaoleksandralab2Theme {
                MainScreen()
            }
        }
    }
}

@Composable
fun MainScreen() {
    var selectedItem by remember { mutableStateOf(0) }
    val items = listOf(
        BottomNavItem.Catalog,
        BottomNavItem.Orders,
        BottomNavItem.Create,
        BottomNavItem.Alerts,
        BottomNavItem.Profile
    )

    Scaffold(
        bottomBar = {
            NavigationBar {
                items.forEachIndexed { index, item ->
                    NavigationBarItem(
                        icon = { Icon(item.icon, contentDescription = item.title) },
                        label = { Text(item.title, maxLines = 1) },
                        selected = selectedItem == index,
                        onClick = { selectedItem = index },
                        alwaysShowLabel = true
                    )
                }
            }
        }
    ) { innerPadding ->
        var cart by remember { mutableStateOf(mutableMapOf<Product, Int>()) }
        Box(modifier = Modifier.padding(innerPadding).fillMaxSize()) {
            when (selectedItem) {
                0 -> CatalogScreen(
                    onAddToCart = { product ->
                        cart[product] = (cart[product] ?: 0) + 1
                    }
                )
                1 -> OrdersScreen()
                2 -> CreateOrderScreen(cart, onCartChange = { cart = it })
                3 -> NotificationsScreen()
                4 -> ProfileScreen()
            }
        }
    }
}