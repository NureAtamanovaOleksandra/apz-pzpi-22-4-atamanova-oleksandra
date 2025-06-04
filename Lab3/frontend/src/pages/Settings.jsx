import React, { useRef, useState } from "react";
import {
  Paper,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  TextField
} from "@mui/material";
import { useTranslation } from "react-i18next";
import axios from "axios";

const Settings = () => {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [restorePath, setRestorePath] = useState("");
  const fileInputRef = useRef();

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const handleBackup = async () => {
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const res = await axios.get("http://localhost:5000/api/admin/backup", getAuthConfig());
      setMessage(t("Backup created successfully") + ": " + res.data.path);
    } catch (err) {
      setError(t("Failed to create backup"));
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const res = await axios.get("http://localhost:5000/api/admin/export", {
        ...getAuthConfig(),
        responseType: "blob"
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "export.json");
      document.body.appendChild(link);
      link.click();
      link.remove();
      setMessage(t("Export completed. File downloaded."));
    } catch (err) {
      setError(t("Failed to export data"));
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (e) => {
    setLoading(true);
    setMessage("");
    setError("");
    const file = e.target.files[0];
    if (!file) return setLoading(false);
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      await axios.post("http://localhost:5000/api/admin/import", data, getAuthConfig());
      setMessage(t("Import completed successfully"));
    } catch (err) {
      setError(t("Failed to import data"));
    } finally {
      setLoading(false);
      fileInputRef.current.value = "";
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    setMessage("");
    setError("");
    try {
      await axios.post(
        "http://localhost:5000/api/admin/restore",
        { backupPath: restorePath },
        getAuthConfig()
      );
      setMessage(t("Backup restored successfully"));
    } catch (err) {
      setError(t("Failed to restore backup"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        {t("System Settings")}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        {t("Backup, export, import and restore system data and settings")}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
        <Button variant="contained" onClick={handleBackup} disabled={loading}>
          {t("Create Backup")}
        </Button>
        <Button variant="contained" onClick={handleExport} disabled={loading}>
          {t("Export Data")}
        </Button>
        <Button
          variant="contained"
          component="label"
          disabled={loading}
        >
          {t("Import Data")}
          <input
            type="file"
            accept=".json"
            hidden
            ref={fileInputRef}
            onChange={handleImport}
          />
        </Button>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <TextField
            label={t("Backup file path")}
            value={restorePath}
            onChange={e => setRestorePath(e.target.value)}
            size="small"
            sx={{ mr: 2, width: "70%" }}
          />
          <Button
            variant="contained"
            onClick={handleRestore}
            disabled={loading || !restorePath}
          >
            {t("Restore Backup")}
          </Button>
        </Box>
        {loading && <CircularProgress sx={{ mx: "auto" }} />}
        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
      </Box>
    </Paper>
  );
};

export default Settings;