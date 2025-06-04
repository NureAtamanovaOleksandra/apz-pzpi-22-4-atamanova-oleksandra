import React from 'react';
import { Drawer, List, ListItemIcon, ListItemText, Toolbar, ListItemButton, Box, Button, Typography } from '@mui/material';
import { Inventory, ShoppingCart, People, BarChart, Logout, Settings } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const menuItems = [
  { text: 'Products', icon: <Inventory />, path: '/products' },
  { text: 'Orders', icon: <ShoppingCart />, path: '/orders' },
  { text: 'Users', icon: <People />, path: '/users' },
  { text: 'Statistics', icon: <BarChart />, path: '/statistics' },
  { text: 'Settings', icon: <Settings />, path: '/settings' }
];

const Sidebar = ({ onLogout }) => {
  const { t } = useTranslation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 220,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 220,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#fff',
          borderRight: '1px solid #eee',
        },
      }}
    >
      <Box>
        <Toolbar>
          <Typography
            variant="h6"
            align="center"
            sx={{ width: '100%', color: '#000', fontWeight: 700, mt: 1 }}
          >
            {t("Admin Panel")}
          </Typography>
        </Toolbar>
        <List>
          {menuItems.map((item) => (
            <ListItemButton key={item.text} component={Link} to={item.path}>
              <ListItemIcon sx={{ color: '#000' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={t(item.text)} sx={{ color: '#000' }} />
            </ListItemButton>
          ))}
        </List>
      </Box>
      <Box sx={{ p: 2 }}>
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          startIcon={<Logout />}
          onClick={onLogout}
        >
          {t("Logout")}
        </Button>
      </Box>
    </Drawer>
  );
};

export default Sidebar;