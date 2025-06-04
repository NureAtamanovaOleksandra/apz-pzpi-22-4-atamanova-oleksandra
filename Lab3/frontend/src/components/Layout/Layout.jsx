import React from 'react';
import Sidebar from './Sidebar';
import { Button, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Layout = ({ children, onLogout }) => {
  const { i18n } = useTranslation();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar onLogout={onLogout} />
      <main style={{ flex: 1, padding: '32px', background: '#f5f7fa' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button onClick={() => i18n.changeLanguage('ua')}>UA</Button>
          <Button onClick={() => i18n.changeLanguage('en')}>EN</Button>
        </Box>
        {children}
      </main>
    </div>
  );
};

export default Layout;