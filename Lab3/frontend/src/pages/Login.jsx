import React, { useState } from 'react';
import axios from 'axios';
import { Paper, Typography, TextField, Button, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Login = ({ onAdminLogin, onUserLogin }) => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token } = res.data;

      const userRes = await axios.get(
        'http://localhost:5000/api/users/me',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const role = userRes.data.role;

      if (role === "admin") {
        onAdminLogin && onAdminLogin({ email, token });
      } else if (role === "user") {
        onUserLogin && onUserLogin({ email, token });
      } else {
        setError("Unknown role");
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Paper elevation={3} style={{ maxWidth: 400, margin: '80px auto', padding: 32 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button onClick={() => i18n.changeLanguage('ua')}>UA</Button>
        <Button onClick={() => i18n.changeLanguage('en')}>EN</Button>
      </Box>
      <Typography variant="h5" align="center" gutterBottom>
        {t("Login")}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label={t("Email")}
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <TextField
          label={t("Password")}
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <Typography color="error" align="center">{t(error)}</Typography>}
        <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: 16 }}>
          {t("Login")}
        </Button>
      </form>
    </Paper>
  );
};

export default Login;