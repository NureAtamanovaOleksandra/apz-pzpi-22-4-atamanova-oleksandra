import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import Products from './pages/Products';
import Users from './pages/Users';
import Orders from './pages/Orders';
import Statistics from './pages/Statistics';
import Login from './pages/Login';
import Settings from './pages/Settings';
import './i18n';

import UserLayout from './components/Layout/UserLayout';
import UserProducts from './pages/UserProducts';
import Cart from './pages/Cart';
import UserOrders from './pages/UserOrders';

function App() {
  const [admin, setAdmin] = useState(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('role');
    return token && email && role === 'admin' ? { email, token } : null;
  });
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('role');
    return token && email && role === 'user' ? { email, token } : null;
  });

  useEffect(() => {
    if (admin) {
      localStorage.setItem('token', admin.token);
      localStorage.setItem('email', admin.email);
      localStorage.setItem('role', 'admin');
    } else if (user) {
      localStorage.setItem('token', user.token);
      localStorage.setItem('email', user.email);
      localStorage.setItem('role', 'user');
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('role');
    }
  }, [admin, user]);

  const handleAdminLogout = () => setAdmin(null);
  const handleUserLogout = () => setUser(null);

  return (
    <Router>
      <Switch>
        <Route path="/login">
          {admin ? <Redirect to="/products" /> : user ? <Redirect to="/user/products" /> : (
            <Login
              onAdminLogin={setAdmin}
              onUserLogin={setUser}
            />
          )}
        </Route>
        <Route path={["/products", "/users", "/orders", "/statistics", "/settings"]}>
          {admin ? (
            <Layout onLogout={handleAdminLogout}>
              <Switch>
                <Route path="/products" component={Products} />
                <Route path="/users" component={Users} />
                <Route path="/orders" component={Orders} />
                <Route path="/statistics" component={Statistics} />
                <Route path="/settings" component={Settings} />
                <Redirect from="/" to="/products" />
              </Switch>
            </Layout>
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route path="/user">
          {user ? (
            <UserLayout onLogout={handleUserLogout}>
              <Switch>
                <Route path="/user/products" component={UserProducts} />
                <Route path="/user/cart" component={Cart} />
                <Route path="/user/orders" component={UserOrders} />
                <Redirect from="/user" to="/user/products" />
              </Switch>
            </UserLayout>
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Redirect from="/" to="/login" />
      </Switch>
    </Router>
  );
}

export default App;