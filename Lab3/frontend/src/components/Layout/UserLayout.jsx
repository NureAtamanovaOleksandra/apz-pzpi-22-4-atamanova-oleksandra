import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const UserLayout = ({ children, onLogout }) => {
  const { t, i18n } = useTranslation();

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/user/products">{t('Products')}</Button>
          <Button color="inherit" component={Link} to="/user/cart">{t('Cart')}</Button>
          <Button color="inherit" component={Link} to="/user/orders">{t('Orders')}</Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button color="inherit" onClick={() => i18n.changeLanguage('uk')}>UA</Button>
          <Button color="inherit" onClick={() => i18n.changeLanguage('en')}>EN</Button>
          <Button color="inherit" onClick={onLogout}>{t('Logout')}</Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3 }}>
        {children}
      </Box>
    </Box>
  );
};

export default UserLayout;