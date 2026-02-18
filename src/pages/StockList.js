import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

function StockList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await apiService.getStockList();
      setData(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading stock list:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading stock data...</div>;
  }

  const totalStockValue = data.reduce((sum, item) => {
    const qty = parseFloat(item.qty || 0);
    const price = parseFloat(item.productRel?.price || 0);
    return sum + (qty * price);
  }, 0);

  return (
    <div>
      <h1 className="page-title">Stock List</h1>
      
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3>Total Stock Items: {data.length}</h3>
          </div>
          <div>
            <h3>Total Stock Value: Rp {totalStockValue.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Current Stock Status</h2>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Product Code</th>
                <th>Product Name</th>
                <th>Product Group</th>
                <th>Unit</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Stock Value</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => {
                const qty = parseFloat(item.qty || 0);
                const price = parseFloat(item.productRel?.price || 0);
                const stockValue = qty * price;
                
                return (
                  <tr key={item.id} style={{ backgroundColor: qty <= 0 ? '#fee2e2' : qty < 10 ? '#fef3c7' : 'white' }}>
                    <td>{item.productRel?.code}</td>
                    <td>{item.productRel?.name}</td>
                    <td>{item.productRel?.prodGroupRel?.name || '-'}</td>
                    <td>{item.productRel?.unit || '-'}</td>
                    <td>Rp {price.toLocaleString()}</td>
                    <td><strong>{qty.toFixed(2)}</strong></td>
                    <td>Rp {stockValue.toLocaleString()}</td>
                    <td>{new Date(item.lastUpdated).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f9fafb' }}>
        <h4>Color Legend:</h4>
        <div style={{ display: 'flex', gap: '30px', marginTop: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '30px', height: '20px', backgroundColor: '#fee2e2', border: '1px solid #ccc' }}></div>
            <span>Out of Stock</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '30px', height: '20px', backgroundColor: '#fef3c7', border: '1px solid #ccc' }}></div>
            <span>Low Stock (less than 10)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '30px', height: '20px', backgroundColor: 'white', border: '1px solid #ccc' }}></div>
            <span>Normal Stock</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockList;
