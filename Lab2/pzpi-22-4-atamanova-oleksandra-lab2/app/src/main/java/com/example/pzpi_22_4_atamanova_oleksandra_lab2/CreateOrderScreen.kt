package com.example.pzpi_22_4_atamanova_oleksandra_lab2

import androidx.compose.runtime.*
import androidx.compose.material3.*
import androidx.compose.foundation.layout.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.platform.LocalContext
import kotlinx.coroutines.launch
import androidx.compose.ui.Alignment
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete

@Composable
fun CreateOrderScreen(
    cart: Map<Product, Int>,
    onCartChange: (MutableMap<Product, Int>) -> Unit
) {
    val context = LocalContext.current
    val token = loadToken(context)
    val userId = loadUserId(context)
    val scope = rememberCoroutineScope()
    var error by remember { mutableStateOf<String?>(null) }
    var loading by remember { mutableStateOf(false) }
    var success by remember { mutableStateOf<String?>(null) }

    Column(modifier = Modifier.padding(16.dp)) {
        Text("Cart \uD83D\uDED2", style = MaterialTheme.typography.headlineSmall)
        Spacer(modifier = Modifier.height(16.dp))
        when {
            token == null || userId.isNullOrBlank() -> {
                Text("Please sign in to create an order.", color = MaterialTheme.colorScheme.error)
            }
            cart.isEmpty() -> {
                Text("No products in cart.")
            }
            else -> {
                cart.forEach { (product, qty) ->
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 2.dp)
                    ) {
                        Text(product.name, modifier = Modifier.weight(1f))
                        OutlinedTextField(
                            value = if (qty == 0) "" else qty.toString(),
                            onValueChange = { newQty ->
                                val newCart = cart.toMutableMap()
                                if (newQty.isBlank()) {
                                    newCart[product] = 0
                                } else {
                                    val intQty = newQty.toIntOrNull() ?: 0
                                    if (intQty > 0) newCart[product] = intQty else newCart.remove(product)
                                }
                                onCartChange(newCart)
                            },
                            label = { Text("Qty") },
                            modifier = Modifier.width(80.dp),
                            singleLine = true
                        )
                        IconButton(
                            onClick = {
                                val newCart = cart.toMutableMap()
                                newCart.remove(product)
                                onCartChange(newCart)
                            }
                        ) {
                            Icon(Icons.Default.Delete, contentDescription = "Remove")
                        }
                    }
                }
                Spacer(modifier = Modifier.height(16.dp))
                val total = cart.entries.sumOf { (product, qty) ->
                    product.price.numberDecimal.toDouble() * qty
                }
                val totalFormatted = String.format("%.2f", total)
                Text("Total: $totalFormatted UAH", style = MaterialTheme.typography.bodyLarge)
                Spacer(modifier = Modifier.height(16.dp))
                Button(
                    onClick = {
                        error = null
                        success = null
                        loading = true
                        scope.launch {
                            try {
                                val orderRequest = OrderRequest(
                                    user_id = userId!!,
                                    total_price = total,
                                    status = "processing"
                                )
                                val createdOrder = RetrofitClient.api.createOrder("Bearer $token", orderRequest)

                                cart.forEach { (product, qty) ->
                                    val orderItemRequest = OrderItemRequest(
                                        order_id = createdOrder._id,
                                        product_id = product._id,
                                        user_id = userId,
                                        quantity = qty,
                                        price_per_item = product.price.numberDecimal.toDouble()
                                    )
                                    RetrofitClient.api.createOrderItem("Bearer $token", orderItemRequest)
                                }

                                success = "Order created successfully!"
                                saveNotification(context, "Order placed \uD83D\uDED2")
                                onCartChange(mutableMapOf())
                            } catch (e: Exception) {
                                error = e.message
                            } finally {
                                loading = false
                            }
                        }
                    },
                    enabled = !loading && cart.isNotEmpty(),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("Create Order")
                }
                if (success != null) {
                    Text(success ?: "", color = MaterialTheme.colorScheme.primary)
                }
                if (error != null) {
                    Text(error ?: "", color = MaterialTheme.colorScheme.error)
                }
            }
        }
    }
}