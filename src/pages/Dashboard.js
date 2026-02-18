import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    totalVendors: 0,
    totalCustomers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [products, stockList, vendors, customers] = await Promise.all([
        apiService.getProducts(),
        apiService.getStockList(),
        apiService.getVendors(),
        apiService.getCustomers(),
      ]);

      const totalStock = stockList.data.reduce((sum, item) => sum + parseFloat(item.qty || 0), 0);

      setStats({
        totalProducts: products.data.length,
        totalStock: totalStock.toFixed(2),
        totalVendors: vendors.data.length,
        totalCustomers: customers.data.length,
      });
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-label">Total Products</div>
          <div className="stat-value">{stats.totalProducts}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Total Stock Quantity</div>
          <div className="stat-value">{stats.totalStock}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Total Vendors</div>
          <div className="stat-value">{stats.totalVendors}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Total Customers</div>
          <div className="stat-value">{stats.totalCustomers}</div>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Welcome to Stock Management System</h2>
        <p style={{ lineHeight: '1.6', color: '#666' }}>
          Manage your inventory efficiently with real-time stock tracking, automated purchase and sales orders,
          and comprehensive reporting features. Navigate using the menu above to get started.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
