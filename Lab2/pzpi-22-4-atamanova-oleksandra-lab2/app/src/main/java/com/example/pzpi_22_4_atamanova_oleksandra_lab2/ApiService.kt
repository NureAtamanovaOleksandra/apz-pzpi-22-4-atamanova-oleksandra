package com.example.pzpi_22_4_atamanova_oleksandra_lab2

import retrofit2.http.*

interface ApiService {
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): LoginResponse

    @POST("auth/register")
    suspend fun register(@Body request: RegisterRequest): User

    @GET("products")
    suspend fun getProducts(): List<Product>

    @GET("products/{id}")
    suspend fun getProduct(@Path("id") id: String): Product

    @GET("orders/my-orders")
    suspend fun getMyOrders(@Header("Authorization") token: String): List<Order>

    @POST("orders")
    suspend fun createOrder(
        @Header("Authorization") token: String,
        @Body order: Order
    ): Order

    @GET("iot/status")
    suspend fun getOrderStatus(): StatusResponse

    @POST("orders")
    suspend fun createOrder(
        @Header("Authorization") token: String,
        @Body order: OrderRequest
    ): OrderResponse

    @POST("orderitems")
    suspend fun createOrderItem(
        @Header("Authorization") token: String,
        @Body orderItem: OrderItemRequest
    )

    @GET("orderitems/my-order-items")
    suspend fun getOrderItems(
        @Header("Authorization") token: String
    ): List<OrderItem>

    @GET("users/me")
    suspend fun getMyProfile(@Header("Authorization") token: String): User

}