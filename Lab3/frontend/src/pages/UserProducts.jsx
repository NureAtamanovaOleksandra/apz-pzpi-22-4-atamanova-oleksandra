import React, { useEffect, useState } from "react";
import { Paper, Typography, Button, Grid } from "@mui/material";
import axios from "axios";
import { useTranslation } from "react-i18next";

const UserProducts = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() =>
    JSON.parse(localStorage.getItem("cart") || "[]")
  );
  const { t } = useTranslation();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => setProducts(res.data));
  }, []);

  const addToCart = (product) => {
    const updatedCart = [...cart, { ...product, quantity: 1 }];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('Products')}
      </Typography>
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">{product.name}</Typography>
              <Typography>{product.description}</Typography>
              <Typography>
                {t('Price')}:{" "}
                {typeof product.price === "object" && product.price !== null
                  ? product.price.$numberDecimal
                  : product.price}
              </Typography>
              <Button variant="contained" onClick={() => addToCart(product)}>
                {t('Add to Cart')}
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default UserProducts;