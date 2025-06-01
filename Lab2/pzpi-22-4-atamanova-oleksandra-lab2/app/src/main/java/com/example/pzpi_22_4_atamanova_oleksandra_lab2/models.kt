package com.example.pzpi_22_4_atamanova_oleksandra_lab2

import com.google.gson.annotations.SerializedName

data class User(
    val _id: String? = null,
    val role: String,
    val name: String,
    val email: String,
    val password: String? = null
)

data class Product(
    val _id: String,
    val name: String,
    val description: String,
    val brand: String,
    val size: String,
    val type: String,
    val price: Price,
    val quantity: Int,
    val createdAt: String?,
    val updatedAt: String?
)

data class Price(
    @com.google.gson.annotations.SerializedName("\$numberDecimal")
    val numberDecimal: String
)

data class UserShort(
    val _id: String,
    val name: String? = null
)

data class Order(
    val _id: String? = null,
    val user_id: UserShort,
    val total_price: PriceDecimal,
    val status: String,
    val createdAt: String? = null,
    val updatedAt: String? = null
)

data class OrderShort(
    val _id: String,
    val user_id: String,
    val total_price: PriceDecimal,
    val status: String,
    val createdAt: String? = null,
    val updatedAt: String? = null
)

data class ProductShort(
    val _id: String,
    val name: String? = null
)

data class PriceDecimal(
    @SerializedName("\$numberDecimal")
    val numberDecimal: String
)

data class OrderItem(
    val _id: String? = null,
    val order_id: OrderShort,
    val product_id: ProductShort,
    val user_id: UserShort,
    val quantity: Int,
    val price_per_item: PriceDecimal
)

data class LoginRequest(val email: String, val password: String)
data class LoginResponse(val token: String)
data class RegisterRequest(val role: String, val name: String, val email: String, val password: String)
data class StatusResponse(val status: String)

data class OrderRequest(
    val user_id: String,
    val total_price: Double,
    val status: String = "pending"
)

data class OrderResponse(
    val _id: String,
    val user_id: String,
    val total_price: PriceDecimal,
    val status: String
)

data class OrderItemRequest(
    val order_id: String,
    val product_id: String,
    val user_id: String,
    val quantity: Int,
    val price_per_item: Double
)