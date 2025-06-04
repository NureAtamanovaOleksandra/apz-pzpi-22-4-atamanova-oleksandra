import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import axios from "axios";
import { useTranslation } from "react-i18next";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/orders/my-orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data))
      .catch(() => setOrders([]));
  }, []);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t("My Orders")}
      </Typography>
      <Grid container spacing={2}>
        {orders.map((order) => (
          <Grid item xs={12} key={order._id}>
            <Paper sx={{ p: 2 }}>
              <Typography>
                {t("Order")} #{order._id}
              </Typography>
              <Typography>
                {t("Status")}: {t(order.status)}
              </Typography>
              <Typography>
                {t("Total")}:{" "}
                {typeof order.total_price === "object" &&
                order.total_price !== null
                  ? order.total_price.$numberDecimal
                  : order.total_price}
              </Typography>
              {order.items && order.items.length > 0 && (
                <List>
                  {order.items.map((item, idx) => (
                    <ListItem key={idx}>
                      <ListItemText
                        primary={
                          item.product_name ||
                          item.product?.name ||
                          t("Products")
                        }
                        secondary={`${t("Quantity")}: ${item.quantity}`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default UserOrders;
