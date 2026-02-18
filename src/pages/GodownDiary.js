import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

function GodownDiary() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    try {
      const res = await apiService.getGodownDiary(filter);
      setData(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading godown diary:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading godown diary...</div>;
  }

  return (
    <div>
      <h1 className="page-title">Godown Diary</h1>
      
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Godown Transaction History</h2>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Filter by godown..." 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              style={{ width: '250px' }}
            />
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Reference</th>
                <th>Product</th>
                <th>Godown</th>
                <th>Qty IN</th>
                <th>Qty OUT</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item.id}>
                  <td>{item.transDate}</td>
                  <td><strong>{item.transType}</strong></td>
                  <td>{item.transRef}</td>
                  <td>{item.productRel?.code} - {item.productRel?.name}</td>
                  <td>{item.godown}</td>
                  <td style={{ color: 'green', fontWeight: 'bold' }}>{parseFloat(item.qtyIn || 0).toFixed(2)}</td>
                  <td style={{ color: 'red', fontWeight: 'bold' }}>{parseFloat(item.qtyOut || 0).toFixed(2)}</td>
                  <td>{item.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {data.length === 0 && (
        <div className="card text-center" style={{ padding: '40px' }}>
          <p style={{ fontSize: '18px', color: '#666' }}>No transactions found</p>
        </div>
      )}
    </div>
  );
}

export default GodownDiary;
