import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Pages
import Dashboard from './pages/Dashboard';
import ProductGroups from './pages/ProductGroups';
import Vendors from './pages/Vendors';
import Customers from './pages/Customers';
import Products from './pages/Products';
import PurchaseOrders from './pages/PurchaseOrders';
import SalesOrders from './pages/SalesOrders';
import StockList from './pages/StockList';
import StockAdjust from './pages/StockAdjust';
import GodownDiary from './pages/GodownDiary';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <h1 className="nav-title">📦 Stock Management</h1>
            <ul className="nav-menu">
              <li><Link to="/">Dashboard</Link></li>
              <li className="dropdown">
                <span>Master Data ▼</span>
                <ul className="dropdown-menu">
                  <li><Link to="/product-groups">Product Groups</Link></li>
                  <li><Link to="/vendors">Vendors</Link></li>
                  <li><Link to="/customers">Customers</Link></li>
                  <li><Link to="/products">Products</Link></li>
                </ul>
              </li>
              <li className="dropdown">
                <span>Transactions ▼</span>
                <ul className="dropdown-menu">
                  <li><Link to="/purchase-orders">Purchase Orders</Link></li>
                  <li><Link to="/sales-orders">Sales Orders</Link></li>
                  <li><Link to="/stock-adjust">Stock Adjustment</Link></li>
                </ul>
              </li>
              <li className="dropdown">
                <span>Reports ▼</span>
                <ul className="dropdown-menu">
                  <li><Link to="/stock-list">Stock List</Link></li>
                  <li><Link to="/godown-diary">Godown Diary</Link></li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>

        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/product-groups" element={<ProductGroups />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/products" element={<Products />} />
            <Route path="/purchase-orders" element={<PurchaseOrders />} />
            <Route path="/sales-orders" element={<SalesOrders />} />
            <Route path="/stock-list" element={<StockList />} />
            <Route path="/stock-adjust" element={<StockAdjust />} />
            <Route path="/godown-diary" element={<GodownDiary />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
