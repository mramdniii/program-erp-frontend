import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

function StockAdjust() {
  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    adjustNo: '', adjustDate: new Date().toISOString().split('T')[0], products: '', qty: 0, type: 'IN', notes: '', godown: 'Main Warehouse'
  });

  useEffect(() => {
    loadData();
    loadProducts();
  }, []);

  const loadData = async () => {
    const res = await apiService.getStockAdjusts();
    setData(res.data);
  };

  const loadProducts = async () => {
    const res = await apiService.getProducts();
    setProducts(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        products: parseInt(formData.products),
        qty: parseFloat(formData.qty)
      };
      await apiService.createStockAdjust(submitData);
      setShowModal(false);
      setFormData({ adjustNo: '', adjustDate: new Date().toISOString().split('T')[0], products: '', qty: 0, type: 'IN', notes: '', godown: 'Main Warehouse' });
      loadData();
      alert('Stock adjusted successfully!');
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? This will reverse the adjustment.')) {
      try {
        await apiService.deleteStockAdjust(id);
        loadData();
      } catch (error) {
        alert('Error deleting adjustment');
      }
    }
  };

  return (
    <div>
      <h1 className="page-title">Stock Adjustment</h1>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Stock Adjustment History</h2>
          <button className="btn btn-primary" onClick={() => { setShowModal(true); setFormData({ adjustNo: '', adjustDate: new Date().toISOString().split('T')[0], products: '', qty: 0, type: 'IN', notes: '', godown: 'Main Warehouse' }); }}>
            + Create Adjustment
          </button>
        </div>
        <table>
          <thead>
            <tr><th>Adjust No</th><th>Date</th><th>Product</th><th>Type</th><th>Quantity</th><th>Godown</th><th>Notes</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id}>
                <td>{item.adjustNo}</td>
                <td>{item.adjustDate}</td>
                <td>{item.productRel?.name}</td>
                <td><span style={{ color: item.type === 'IN' ? 'green' : 'red', fontWeight: 'bold' }}>{item.type}</span></td>
                <td>{parseFloat(item.qty).toFixed(2)}</td>
                <td>{item.godown || '-'}</td>
                <td>{item.notes}</td>
                <td>
                  <button className="btn btn-small btn-danger" onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Create Stock Adjustment</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Adjustment No *</label>
                  <input type="text" className="form-control" value={formData.adjustNo} onChange={(e) => setFormData({...formData, adjustNo: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Date *</label>
                  <input type="date" className="form-control" value={formData.adjustDate} onChange={(e) => setFormData({...formData, adjustDate: e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Product *</label>
                <select className="form-control" value={formData.products} onChange={(e) => setFormData({...formData, products: e.target.value})} required>
                  <option value="">-- Select Product --</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.code} - {p.name}</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Type *</label>
                  <select className="form-control" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} required>
                    <option value="IN">IN (Add Stock)</option>
                    <option value="OUT">OUT (Reduce Stock)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Quantity *</label>
                  <input type="number" step="0.01" className="form-control" value={formData.qty} onChange={(e) => setFormData({...formData, qty: e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Godown</label>
                <input type="text" className="form-control" value={formData.godown} onChange={(e) => setFormData({...formData, godown: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea className="form-control" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows="3" />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Adjustment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StockAdjust;
