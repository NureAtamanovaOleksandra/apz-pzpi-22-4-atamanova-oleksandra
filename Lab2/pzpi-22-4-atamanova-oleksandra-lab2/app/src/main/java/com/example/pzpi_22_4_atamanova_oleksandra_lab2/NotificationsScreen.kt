package com.example.pzpi_22_4_atamanova_oleksandra_lab2

import androidx.compose.runtime.*
import androidx.compose.material3.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.platform.LocalContext

@Composable
fun NotificationsScreen() {
    val context = LocalContext.current
    val token = loadToken(context)
    var notifications by remember { mutableStateOf(loadNotifications(context)) }

    LaunchedEffect(token) {
        notifications = loadNotifications(context)
    }

    Column(modifier = Modifier.padding(16.dp)) {
        Text("Notifications \uD83D\uDD14", style = MaterialTheme.typography.headlineSmall)
        Spacer(modifier = Modifier.height(16.dp))
        if (token == null) {
        } else if (notifications.isEmpty()) {
            Text("No notifications yet.")
        } else {
            LazyColumn {
                items(notifications) { (timestamp, message) ->
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp),
                        elevation = CardDefaults.cardElevation(2.dp)
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Text(message)
                            Text(
                                java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss", java.util.Locale.getDefault()).format(java.util.Date(timestamp)),
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
            }
        }
    }
}