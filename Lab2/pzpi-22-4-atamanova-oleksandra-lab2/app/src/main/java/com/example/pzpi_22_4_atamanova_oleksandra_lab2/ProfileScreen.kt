package com.example.pzpi_22_4_atamanova_oleksandra_lab2

import androidx.compose.runtime.*
import androidx.compose.material3.*
import androidx.compose.foundation.layout.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.platform.LocalContext
import android.widget.Toast
import androidx.compose.foundation.clickable
import androidx.compose.ui.Alignment
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountCircle
import kotlinx.coroutines.launch
import com.auth0.android.jwt.JWT

@Composable
fun ProfileScreen() {
    val context = LocalContext.current
    var isLogin by remember { mutableStateOf(true) }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var name by remember { mutableStateOf("") }
    var token by remember { mutableStateOf(loadToken(context)) }
    var error by remember { mutableStateOf<String?>(null) }
    var loading by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        if (token == null) {
            Column(
                modifier = Modifier.align(Alignment.Center),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = if (isLogin) "Sign In" else "Sign Up",
                    style = MaterialTheme.typography.headlineSmall
                )
                Spacer(modifier = Modifier.height(16.dp))
                if (!isLogin) {
                    OutlinedTextField(
                        value = name,
                        onValueChange = { name = it },
                        label = { Text("Name") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                }
                OutlinedTextField(
                    value = email,
                    onValueChange = { email = it },
                    label = { Text("Email") },
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedTextField(
                    value = password,
                    onValueChange = { password = it },
                    label = { Text("Password") },
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(modifier = Modifier.height(8.dp))
                if (error != null) {
                    Text(error ?: "", color = MaterialTheme.colorScheme.error)
                }
                Button(
                    onClick = {
                        error = null
                        if (!isLogin && name.isBlank()) {
                            error = "Name is required"
                            return@Button
                        }
                        if (!email.contains("@")) {
                            error = "Invalid email"
                            return@Button
                        }
                        if (password.length < 6) {
                            error = "Password must be at least 6 characters"
                            return@Button
                        }
                        loading = true
                        scope.launch {
                            try {
                                if (isLogin) {
                                    val response = RetrofitClient.api.login(LoginRequest(email, password))
                                    token = response.token
                                    saveToken(context, response.token)
                                    val userId = getUserIdFromToken(response.token)
                                    saveUserId(context, userId)
                                    Toast.makeText(context, "Login successful", Toast.LENGTH_SHORT).show()
                                    clearNotifications(context)
                                    saveNotification(context, "Login successful ✅")
                                } else {
                                    RetrofitClient.api.register(RegisterRequest("user", name, email, password))
                                    isLogin = true
                                    Toast.makeText(context, "Registration successful. Please sign in.", Toast.LENGTH_SHORT).show()
                                    saveNotification(context, "Registration successful \uD83D\uDC4B")
                                }
                            } catch (e: Exception) {
                                error = if (e.message?.contains("404") == true) {
                                    "No account found with this email or password."
                                } else {
                                    e.message
                                }
                            } finally {
                                loading = false
                            }
                        }
                    },
                    enabled = !loading,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(if (isLogin) "Sign In" else "Sign Up")
                }
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = if (isLogin) "Don't have an account? Sign Up" else "Already have an account? Sign In",
                    color = MaterialTheme.colorScheme.primary,
                    modifier = Modifier
                        .clickable { isLogin = !isLogin }
                        .align(Alignment.CenterHorizontally)
                )
            }
        } else {
            Column(
                modifier = Modifier
                    .align(Alignment.Center)
                    .fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Icon(
                    imageVector = Icons.Default.AccountCircle,
                    contentDescription = "Profile",
                    modifier = Modifier.size(90.dp),
                    tint = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    "Welcome to your account!",
                    style = MaterialTheme.typography.headlineSmall,
                    modifier = Modifier.align(Alignment.CenterHorizontally)
                )
                Spacer(modifier = Modifier.height(8.dp))
                Divider()
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    "Here you can browse the catalog, view your orders, place new orders, and receive notifications about important updates.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.align(Alignment.CenterHorizontally)
                )
                Spacer(modifier = Modifier.height(24.dp))
                Button(
                    onClick = {
                        token = null
                        saveToken(context, null)
                        saveUserId(context, null)
                    },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("Logout")
                }
            }
        }
    }
}

fun getUserIdFromToken(token: String): String? {
    return try {
        val jwt = JWT(token)
        jwt.getClaim("id").asString()
    } catch (e: Exception) {
        null
    }
}