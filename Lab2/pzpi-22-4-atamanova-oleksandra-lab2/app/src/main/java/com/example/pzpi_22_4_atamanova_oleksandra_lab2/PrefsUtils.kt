package com.example.pzpi_22_4_atamanova_oleksandra_lab2

import android.content.Context

const val PREFS_NAME = "auth_prefs"
const val TOKEN_KEY = "jwt_token"
const val USER_ID_KEY = "user_id"
private const val NOTIFICATIONS_KEY = "local_notifications"

fun saveToken(context: Context, token: String?) {
    val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    prefs.edit().putString(TOKEN_KEY, token).apply()
}

fun loadToken(context: Context): String? {
    val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    return prefs.getString(TOKEN_KEY, null)
}

fun saveUserId(context: Context, userId: String?) {
    val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    prefs.edit().putString(USER_ID_KEY, userId).apply()
}

fun loadUserId(context: Context): String? {
    val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    return prefs.getString(USER_ID_KEY, null)
}

fun saveNotification(context: Context, message: String) {
    val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    val old = prefs.getStringSet(NOTIFICATIONS_KEY, mutableSetOf()) ?: mutableSetOf()
    val updated = old.toMutableSet()
    updated.add("${System.currentTimeMillis()}|$message")
    prefs.edit().putStringSet(NOTIFICATIONS_KEY, updated).apply()
}

fun loadNotifications(context: Context): List<Pair<Long, String>> {
    val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    return prefs.getStringSet(NOTIFICATIONS_KEY, setOf())!!
        .mapNotNull {
            val parts = it.split("|", limit = 2)
            if (parts.size == 2) parts[0].toLongOrNull()?.let { t -> t to parts[1] } else null
        }
        .sortedByDescending { it.first }
}

fun clearNotifications(context: Context) {
    val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    prefs.edit().remove(NOTIFICATIONS_KEY).apply()
}