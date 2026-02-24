import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

function SalesOrders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    orderDate: new Date().toISOString().split('T')[0], customers: '', notes: '', godown: 'Main Warehouse', details: []
  });

  useEffect(() => {
    loadOrders();
    loadCustomers();
    loadProducts();
  }, []);

  const loadOrders = async () => {
    const res = await apiService.getSalesOrders();
    setOrders(res.data);
  };

  const loadCustomers = async () => {
    const res = await apiService.getCustomers();
    setCustomers(res.data);
  };

  const loadProducts = async () => {
    const res = await apiService.getProducts();
    setProducts(res.data);
  };

  const addDetailRow = () => {
    setFormData({
      ...formData,
      details: [...formData.details, { products: '', qty: 0, price: 0 }]
    });
  };

  const updateDetail = (index, field, value) => {
    const newDetails = [...formData.details];
    newDetails[index][field] = value;
    setFormData({ ...formData, details: newDetails });
  };

  const removeDetail = (index) => {
    const newDetails = formData.details.filter((_, i) => i !== index);
    setFormData({ ...formData, details: newDetails });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        customers: parseInt(formData.customers),
        details: formData.details.map(d => ({
          products: parseInt(d.products),
          qty: parseFloat(d.qty),
          price: parseFloat(d.price)
        }))
      };
      await apiService.createSalesOrder(submitData);
      setShowModal(false);
      setFormData({ orderDate: new Date().toISOString().split('T')[0], customers: '', notes: '', godown: 'Main Warehouse', details: [] });
      loadOrders();
      alert('Sales Order created successfully!');
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? This will reverse the stock.')) {
      try {
        await apiService.deleteSalesOrder(id);
        loadOrders();
      } catch (error) {
        alert('Error deleting order');
      }
    }
  };

  const getTotalAmount = () => {
    return formData.details.reduce((sum, d) => sum + (d.qty * d.price), 0);
  };

  return (
    <div>
      <h1 className="page-title">Sales Orders</h1>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Sales Order List</h2>
          <button className="btn btn-primary" onClick={() => { setShowModal(true); setFormData({ orderDate: new Date().toISOString().split('T')[0], customers: '', notes: '', godown: 'Main Warehouse', details: [] }); }}>
            + Create Sales Order
          </button>
        </div>
        <table>
          <thead>
            <tr><th>Order No</th><th>Date</th><th>Customer</th><th>Total Amount</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.orderNo}</td>
                <td>{order.orderDate}</td>
                <td>{order.customerRel?.name || '-'}</td>
                <td>Rp {parseFloat(order.totalAmount).toLocaleString()}</td>
                <td>
                  <button className="btn btn-small btn-danger" onClick={() => handleDelete(order.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ maxWidth: '900px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Create Sales Order</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Sales No</label>
                  <input
                    type="text"
                    className="form-control"
                    value="Auto Generated"
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Order Date *</label>
                  <input type="date" className="form-control" value={formData.orderDate} onChange={(e) => setFormData({...formData, orderDate: e.target.value})} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Customer *</label>
                  <select className="form-control" value={formData.customers} onChange={(e) => setFormData({...formData, customers: e.target.value})} required>
                    <option value="">-- Select Customer --</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Godown</label>
                  <input type="text" className="form-control" value={formData.godown} onChange={(e) => setFormData({...formData, godown: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea className="form-control" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows="2" />
              </div>

              <div className="card" style={{ marginTop: '20px', padding: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <h3>Items</h3>
                  <button type="button" className="btn btn-small btn-success" onClick={addDetailRow}>+ Add Item</button>
                </div>
                {formData.details.map((detail, index) => (
                  <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 50px', gap: '10px', marginBottom: '10px', alignItems: 'end' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Product</label>
                      <select className="form-control" value={detail.products} onChange={(e) => updateDetail(index, 'products', e.target.value)} required>
                        <option value="">-- Select --</option>
                        {products.map(p => <option key={p.id} value={p.id}>{p.code} - {p.name}</option>)}
                      </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Qty</label>
                      <input type="number" step="0.01" className="form-control" value={detail.qty} onChange={(e) => updateDetail(index, 'qty', e.target.value)} required />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Price</label>
                      <input type="number" step="0.01" className="form-control" value={detail.price} onChange={(e) => updateDetail(index, 'price', e.target.value)} required />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Amount</label>
                      <input type="text" className="form-control" value={(detail.qty * detail.price).toFixed(2)} readOnly />
                    </div>
                    <button type="button" className="btn btn-small btn-danger" onClick={() => removeDetail(index)} style={{ height: '38px' }}>×</button>
                  </div>
                ))}
                <div style={{ textAlign: 'right', marginTop: '15px', fontSize: '18px', fontWeight: 'bold' }}>
                  Total: Rp {getTotalAmount().toLocaleString()}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SalesOrders;
