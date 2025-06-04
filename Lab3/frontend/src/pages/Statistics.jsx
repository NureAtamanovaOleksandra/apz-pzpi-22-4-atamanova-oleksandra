import React, { useEffect, useState } from "react";
import { Paper, Typography, Grid, Alert, CircularProgress, TextField, Button } from "@mui/material";
import axios from "axios";
import { useTranslation } from "react-i18next";

const Statistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2025-12-31");
  const { t } = useTranslation();

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchStatistics = async (customStart, customEnd) => {
    setLoading(true);
    setError("");
    try {
      const [usersRes, ordersRes, productsRes, paymentsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/users", getAuthConfig()),
        axios.get("http://localhost:5000/api/orders", getAuthConfig()),
        axios.get("http://localhost:5000/api/products", getAuthConfig()),
        axios.get("http://localhost:5000/api/payments", getAuthConfig()),
      ]);

      const filteredOrders = ordersRes.data.filter((o) => {
        const date = new Date(o.createdAt);
        return (
          date >= new Date(customStart) &&
          date <= new Date(customEnd)
        );
      });

      let popularProduct = t("No data");
      let popularProductQty = 0;
      try {
        const popularRes = await axios.get(
          `http://localhost:5000/api/orderitems/popular/${customStart}/${customEnd}`,
          getAuthConfig()
        );
        if (popularRes.data && popularRes.data.length > 0) {
          popularProduct = popularRes.data[0]._id?.name || t("Unknown");
          popularProductQty = popularRes.data[0].totalQuantity || 0;
        }
      } catch {
      }

      const totalOrderSum = filteredOrders.reduce((sum, o) => {
        const price =
          typeof o.total_price === "object" && o.total_price !== null
            ? parseFloat(o.total_price.$numberDecimal)
            : parseFloat(o.total_price);
        return sum + (isNaN(price) ? 0 : price);
      }, 0);

      setStatistics({
        users: usersRes.data.length,
        orders: filteredOrders.length,
        products: productsRes.data.length,
        payments: paymentsRes.data.length,
        totalOrderSum: totalOrderSum.toFixed(2),
        popularProduct,
        popularProductQty,
      });
    } catch (err) {
      setError("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics(startDate, endDate);
  }, []);

  const handleShow = () => {
    fetchStatistics(startDate, endDate);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t("Statistics")}
      </Typography>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item>
          <TextField
            label={t("Start Date")}
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
        </Grid>
        <Grid item>
          <TextField
            label={t("End Date")}
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={handleShow}>
            {t("Show")}
          </Button>
        </Grid>
      </Grid>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{t(error)}</Alert>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, minHeight: 120, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h6">{t("Users")}</Typography>
              <Typography variant="h5">{statistics.users}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, minHeight: 120, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h6">{t("Orders (in period)")}</Typography>
              <Typography variant="h5">{statistics.orders}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, minHeight: 120, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h6">{t("Products")}</Typography>
              <Typography variant="h5">{statistics.products}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, minHeight: 120, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h6">{t("Payments")}</Typography>
              <Typography variant="h5">{statistics.payments}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, minHeight: 120, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h6">{t("Total Orders Sum (in period)")}</Typography>
              <Typography variant="h5">{statistics.totalOrderSum}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, minHeight: 120, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h6">{t("Most Popular Product (in period)")}</Typography>
              <Typography variant="h5">{statistics.popularProduct}</Typography>
              <Typography variant="body2">
                {t("Sold")}: {statistics.popularProductQty}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Paper>
  );
};

export default Statistics;