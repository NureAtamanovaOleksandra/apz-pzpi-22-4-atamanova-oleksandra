import React, { useState } from "react";
import { Paper, Typography, Button, Grid, IconButton } from "@mui/material";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";

const Cart = () => {
  const [cart, setCart] = useState(() =>
    JSON.parse(localStorage.getItem("cart") || "[]")
  );
  const [message, setMessage] = useState("");
  const { t } = useTranslation();

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const handleQuantityChange = (idx, delta) => {
    const newCart = [...cart];
    newCart[idx].quantity = Math.max(1, newCart[idx].quantity + delta);
    updateCart(newCart);
  };

  const handleRemove = (idx) => {
    const newCart = cart.filter((_, i) => i !== idx);
    updateCart(newCart);
  };

  const handleOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      const userRes = await axios.get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user_id = userRes.data.id;

      const total_price = cart.reduce((sum, item) => {
        const price =
          typeof item.price === "object" && item.price !== null
            ? parseFloat(item.price.$numberDecimal)
            : parseFloat(item.price);
        return sum + price * item.quantity;
      }, 0);

      const orderRes = await axios.post(
        "http://localhost:5000/api/orders",
        {
          user_id,
          total_price,
          status: "processing",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const order_id = orderRes.data._id;

      for (const item of cart) {
        const orderItemPayload = {
          order_id,
          product_id: item._id,
          user_id,
          quantity: item.quantity,
          price_per_item:
            typeof item.price === "object" && item.price !== null
              ? parseFloat(item.price.$numberDecimal)
              : parseFloat(item.price),
        };

        await axios.post(
          "http://localhost:5000/api/orderitems",
          orderItemPayload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setCart([]);
      localStorage.removeItem("cart");
      setMessage("Order placed!");
    } catch (e) {
      setMessage("Failed to place order");
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('Cart')}
      </Typography>
      {cart.length === 0 ? (
        <Typography>{t('Your cart is empty.')}</Typography>
      ) : (
        <>
          <Grid container spacing={2}>
            {cart.map((item, idx) => (
              <Grid item xs={12} key={idx}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <Typography>{item.name}</Typography>
                    <Typography>
                      {t('Price')}:{" "}
                      {typeof item.price === "object" && item.price !== null
                        ? item.price.$numberDecimal
                        : item.price}
                    </Typography>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <IconButton
                      onClick={() => handleQuantityChange(idx, -1)}
                      disabled={item.quantity <= 1}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                    <IconButton onClick={() => handleQuantityChange(idx, 1)}>
                      <AddIcon />
                    </IconButton>
                    <IconButton onClick={() => handleRemove(idx)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleOrder}>
            {t('Place Order')}
          </Button>
        </>
      )}
      {message && <Typography sx={{ mt: 2 }}>{t(message)}</Typography>}
    </Paper>
  );
};

export default Cart;