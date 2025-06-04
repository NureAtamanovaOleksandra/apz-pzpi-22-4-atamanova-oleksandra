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
  MenuItem,
  Alert,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import { useTranslation } from "react-i18next";

const roles = ["admin", "user"];

const isNameValid = (name) => /^[A-Za-zА-Яа-я]{2,}$/.test(name);
const isEmailValid = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isPasswordValid = (password) =>
  password === "" || /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);

const Users = () => {
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "user",
    password: "",
  });
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

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/users",
        getAuthConfig()
      );
      setUsers(res.data);
    } catch (err) {
      setError("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenDialog = (user = null) => {
    setEditingUser(user);
    setForm(
      user
        ? {
            name: user.name || "",
            email: user.email || "",
            role: user.role || "user",
            password: "",
          }
        : {
            name: "",
            email: "",
            role: "user",
            password: "",
          }
    );
    setError("");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
    setForm({
      name: "",
      email: "",
      role: "user",
      password: "",
    });
    setError("");
  };

  const handleSave = async () => {
    if (!isNameValid(form.name)) {
      setError("Only letters, at least 2 characters");
      return;
    }
    if (!isEmailValid(form.email)) {
      setError("Invalid email");
      return;
    }
    if (!editingUser && !isPasswordValid(form.password)) {
      setError("Password at least 8 characters, letters and numbers");
      return;
    }
    if (editingUser && form.password && !isPasswordValid(form.password)) {
      setError("Password at least 8 characters, letters and numbers");
      return;
    }

    const payload = {
      name: form.name,
      email: form.email,
      role: form.role,
    };
    if (form.password) payload.password = form.password;

    try {
      if (editingUser) {
        await axios.put(
          `http://localhost:5000/api/users/${editingUser._id}`,
          payload,
          getAuthConfig()
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/auth/register",
          { ...payload, password: form.password },
          getAuthConfig()
        );
      }
      fetchUsers();
      handleCloseDialog();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save user"
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/users/admin/${id}`,
        getAuthConfig()
      );
      fetchUsers();
    } catch (err) {
      setError("Failed to delete user");
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t("Users")}
      </Typography>
      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={() => handleOpenDialog()}
      >
        {t("Add User")}
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("Name")}</TableCell>
              <TableCell>{t("Email")}</TableCell>
              <TableCell>{t("Role")}</TableCell>
              <TableCell align="right">{t("Actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{t(user.role)}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(user)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(user._id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: { minWidth: 500, maxWidth: 600 },
        }}
      >
        <DialogTitle>
          {editingUser ? t("Edit User") : t("Add User")}
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <div style={{ minHeight: 48 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 1 }}>
                {t(error)}
              </Alert>
            )}
          </div>
          <TextField
            label={t("Name")}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            fullWidth
            required
            error={form.name !== "" && !isNameValid(form.name)}
            helperText={
              form.name !== "" && !isNameValid(form.name)
                ? t("Only letters, at least 2 characters")
                : ""
            }
          />
          <TextField
            label={t("Email")}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            fullWidth
            required
            type="email"
            error={form.email !== "" && !isEmailValid(form.email)}
            helperText={
              form.email !== "" && !isEmailValid(form.email)
                ? t("Invalid email")
                : ""
            }
          />
          <TextField
            select
            label={t("Role")}
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            fullWidth
            required
          >
            {roles.map((role) => (
              <MenuItem key={role} value={role}>
                {t(role)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label={t("Password")}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            fullWidth
            type="password"
            placeholder={editingUser ? t("Leave blank to keep current") : ""}
            error={
              (editingUser && form.password && !isPasswordValid(form.password)) ||
              (!editingUser && !isPasswordValid(form.password))
            }
            helperText={
              (editingUser && form.password && !isPasswordValid(form.password)) ||
              (!editingUser && !isPasswordValid(form.password))
                ? t("Password at least 8 characters, letters and numbers")
                : ""
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t("Cancel")}</Button>
          <Button onClick={handleSave} variant="contained">
            {editingUser ? t("Save") : t("Add")}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Users;