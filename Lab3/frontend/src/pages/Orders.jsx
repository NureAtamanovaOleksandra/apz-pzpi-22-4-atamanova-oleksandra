import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  MenuItem,
  Select,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import axios from "axios";
import { useTranslation } from "react-i18next";

const statusOptions = ["processing", "rejected", "accepted"];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const { t } = useTranslation();

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/orders",
        getAuthConfig()
      );
      setOrders(res.data);
    } catch (err) {
      setError("Failed to load orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/orders/${id}`,
        getAuthConfig()
      );
      fetchOrders();
    } catch (err) {
      setError("Failed to delete order");
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}`,
        { status: newStatus },
        getAuthConfig()
      );
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      setError("Failed to update order status");
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t("Orders")}
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {t(error)}
        </Alert>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("Order ID")}</TableCell>
              <TableCell>{t("User")}</TableCell>
              <TableCell>{t("Total Price")}</TableCell>
              <TableCell>{t("Status")}</TableCell>
              <TableCell>{t("Created At")}</TableCell>
              <TableCell align="right">{t("Actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order._id}</TableCell>
                <TableCell>
                  {order.user_id?.name || order.user_id?.email || order.user_id}
                </TableCell>
                <TableCell>
                  {typeof order.total_price === "object" &&
                  order.total_price !== null
                    ? order.total_price.$numberDecimal
                    : order.total_price}
                </TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    size="small"
                  >
                    {statusOptions.map((status) => (
                      <MenuItem key={status} value={status}>
                        {t(status)}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString()
                    : ""}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(order._id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default Orders;