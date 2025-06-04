import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import { useTranslation } from "react-i18next";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    brand: "",
    size: "",
    type: "",
    price: "",
    quantity: ""
  });
  const { t } = useTranslation();

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:5000/api/products", getAuthConfig());
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenDialog = (product = null) => {
    setEditingProduct(product);
    setForm(
      product
        ? {
            name: product.name || "",
            description: product.description || "",
            brand: product.brand || "",
            size: product.size || "",
            type: product.type || "",
            price:
              typeof product.price === "object" && product.price.$numberDecimal
                ? product.price.$numberDecimal
                : product.price || "",
            quantity: product.quantity || ""
          }
        : {
            name: "",
            description: "",
            brand: "",
            size: "",
            type: "",
            price: "",
            quantity: ""
          }
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setForm({
      name: "",
      description: "",
      brand: "",
      size: "",
      type: "",
      price: "",
      quantity: ""
    });
  };

  const handleSave = async () => {
    const payload = {
      ...form,
      price: Number(form.price),
      quantity: Number(form.quantity)
    };
    if (editingProduct) {
      await axios.put(
        `http://localhost:5000/api/products/${editingProduct._id}`,
        payload,
        getAuthConfig()
      );
    } else {
      await axios.post(
        "http://localhost:5000/api/products",
        payload,
        getAuthConfig()
      );
    }
    fetchProducts();
    handleCloseDialog();
  };

  const handleDelete = async (id) => {
    await axios.delete(
      `http://localhost:5000/api/products/${id}`,
      getAuthConfig()
    );
    fetchProducts();
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t("Products")}
      </Typography>
      <Button
        variant="contained"
        startIcon={<Add />}
        sx={{ mb: 2 }}
        onClick={() => handleOpenDialog()}
      >
        {t("Add Product")}
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("Name")}</TableCell>
              <TableCell>{t("Description")}</TableCell>
              <TableCell>{t("Brand")}</TableCell>
              <TableCell>{t("Size")}</TableCell>
              <TableCell>{t("Type")}</TableCell>
              <TableCell>{t("Price")}</TableCell>
              <TableCell>{t("Quantity")}</TableCell>
              <TableCell align="right">{t("Actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell>{product.size}</TableCell>
                <TableCell>{product.type}</TableCell>
                <TableCell>
                  {typeof product.price === "object" &&
                  product.price.$numberDecimal
                    ? product.price.$numberDecimal
                    : product.price}
                </TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(product)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(product._id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {editingProduct ? t("Edit Product") : t("Add Product")}
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label={t("Name")}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            fullWidth
            required
          />
          <TextField
            label={t("Description")}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            fullWidth
            required
          />
          <TextField
            label={t("Brand")}
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
            fullWidth
            required
          />
          <TextField
            label={t("Size")}
            value={form.size}
            onChange={(e) => setForm({ ...form, size: e.target.value })}
            fullWidth
            required
          />
          <TextField
            label={t("Type")}
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            fullWidth
            required
          />
          <TextField
            label={t("Price")}
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            fullWidth
            required
          />
          <TextField
            label={t("Quantity")}
            type="number"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            fullWidth
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t("Cancel")}</Button>
          <Button onClick={handleSave} variant="contained">
            {editingProduct ? t("Save") : t("Add")}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Products;