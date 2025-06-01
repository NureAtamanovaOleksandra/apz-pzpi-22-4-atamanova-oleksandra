package com.example.pzpi_22_4_atamanova_oleksandra_lab2

import androidx.compose.runtime.*
import androidx.compose.material3.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import android.widget.Toast
import androidx.compose.ui.platform.LocalContext
import kotlinx.coroutines.launch
import androidx.compose.ui.Alignment
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add

@Composable
fun CatalogScreen(onAddToCart: (Product) -> Unit) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    var products by remember { mutableStateOf<List<Product>>(emptyList()) }
    var error by remember { mutableStateOf<String?>(null) }
    var loading by remember { mutableStateOf(true) }

    LaunchedEffect(Unit) {
        scope.launch {
            try {
                loading = true
                products = RetrofitClient.api.getProducts()
                error = null
            } catch (e: Exception) {
                error = "Error: ${e.message}"
            } finally {
                loading = false
            }
        }
    }

    Column(modifier = Modifier.padding(16.dp)) {
        Text("Product Catalog \uD83D\uDCCB", style = MaterialTheme.typography.headlineSmall)
        Spacer(modifier = Modifier.height(16.dp))
        when {
            loading -> CircularProgressIndicator()
            error != null -> Text(error ?: "Unknown error", color = MaterialTheme.colorScheme.error)
            products.isEmpty() -> Text("No products")
            else -> {
                LazyColumn {
                    items(products) { product ->
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp),
                            elevation = CardDefaults.cardElevation(2.dp)
                        ) {
                            Box(modifier = Modifier.fillMaxWidth()) {
                                Column(modifier = Modifier.padding(12.dp)) {
                                    Text("Name: ${product.name}", style = MaterialTheme.typography.titleMedium)
                                    Text("Price: ${product.price.numberDecimal} UAH")
                                    Text("Description: ${product.description}")
                                    Text("Brand: ${product.brand}")
                                    Text("Size: ${product.size}")
                                    Text("Type: ${product.type}")
                                    Text("Quantity: ${product.quantity}")
                                }
                                IconButton(
                                    onClick = {
                                        onAddToCart(product)
                                        Toast.makeText(
                                            context,
                                            "${product.name} added to cart",
                                            Toast.LENGTH_SHORT
                                        ).show()
                                    },
                                    modifier = Modifier.align(Alignment.BottomEnd)
                                ) {
                                    Icon(Icons.Default.Add, contentDescription = "Add to cart")
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}