package com.example.pzpi_22_4_atamanova_oleksandra_lab2

import androidx.compose.runtime.*
import androidx.compose.material3.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.platform.LocalContext
import kotlinx.coroutines.launch

@Composable
fun OrdersScreen() {
    val context = LocalContext.current
    val token = loadToken(context)
    var orders by remember { mutableStateOf<List<Order>>(emptyList()) }
    var orderItems by remember { mutableStateOf<List<OrderItem>>(emptyList()) }
    var products by remember { mutableStateOf<List<Product>>(emptyList()) }
    var error by remember { mutableStateOf<String?>(null) }
    var loading by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()

    LaunchedEffect(token) {
        if (token != null) {
            loading = true
            scope.launch {
                try {
                    orders = RetrofitClient.api.getMyOrders("Bearer $token")
                    orderItems = RetrofitClient.api.getOrderItems("Bearer $token")
                    products = RetrofitClient.api.getProducts()
                    error = null
                } catch (e: Exception) {
                    error = e.message
                } finally {
                    loading = false
                }
            }
        }
    }

    Column(modifier = Modifier.padding(16.dp)) {
        Text("My Orders \uD83D\uDCC3", style = MaterialTheme.typography.headlineSmall)
        Spacer(modifier = Modifier.height(16.dp))
        when {
            token == null -> {
                Text("Please sign in to view your orders.", color = MaterialTheme.colorScheme.error)
            }
            loading -> {
                CircularProgressIndicator()
            }
            error != null -> {
                if (error?.contains("404") == true) {
                    Text("You have no orders yet.", color = MaterialTheme.colorScheme.onSurfaceVariant)
                } else {
                    Text(error ?: "Unknown error", color = MaterialTheme.colorScheme.error)
                }
            }
            orders.isEmpty() -> {
                Text("No orders found.")
            }
            else -> {
                LazyColumn {
                    items(orders) { order ->
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp),
                            elevation = CardDefaults.cardElevation(2.dp)
                        ) {
                            Column(modifier = Modifier.padding(12.dp)) {
                                Text("Order ID: ${order._id}", style = MaterialTheme.typography.titleMedium)
                                Text("Status: ${order.status}", style = MaterialTheme.typography.bodyMedium)
                                val itemsForOrder = orderItems.filter { it.order_id._id == order._id }
                                if (itemsForOrder.isNotEmpty()) {
                                    Text("Products:")
                                    itemsForOrder.forEach { item ->
                                        val productName = products.find { it._id == item.product_id._id }?.name ?: "Unknown"
                                        Text("- $productName (x${item.quantity})")
                                    }
                                } else {
                                    Text("No products in this order")
                                }
                                val price = order.total_price.numberDecimal.toDouble()
                                val priceFormatted = String.format("%.2f", price)
                                Text("Total: $priceFormatted UAH", style = MaterialTheme.typography.bodyLarge)
                                order.createdAt?.let {
                                    val formatted = it.replace("T", " ").replace("Z", "")
                                    Text("Created: $formatted")
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}