import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

function PurchaseOrders() {
  const [orders, setOrders] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    orderNo: '', orderDate: new Date().toISOString().split('T')[0], vendors: '', notes: '', godown: 'Main Warehouse', details: []
  });

  useEffect(() => {
    loadOrders();
    loadVendors();
    loadProducts();
  }, []);

  const loadOrders = async () => {
    const res = await apiService.getPurchaseOrders();
    setOrders(res.data);
  };

  const loadVendors = async () => {
    const res = await apiService.getVendors();
    setVendors(res.data);
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
        vendors: parseInt(formData.vendors),
        details: formData.details.map(d => ({
          products: parseInt(d.products),
          qty: parseFloat(d.qty),
          price: parseFloat(d.price)
        }))
      };
      await apiService.createPurchaseOrder(submitData);
      setShowModal(false);
      setFormData({ orderNo: '', orderDate: new Date().toISOString().split('T')[0], vendors: '', notes: '', godown: 'Main Warehouse', details: [] });
      loadOrders();
      alert('Purchase Order created successfully!');
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? This will reverse the stock.')) {
      try {
        await apiService.deletePurchaseOrder(id);
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
      <h1 className="page-title">Purchase Orders</h1>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Purchase Order List</h2>
          <button className="btn btn-primary" onClick={() => { setShowModal(true); setFormData({ orderNo: '', orderDate: new Date().toISOString().split('T')[0], vendors: '', notes: '', godown: 'Main Warehouse', details: [] }); }}>
            + Create Purchase Order
          </button>
        </div>
        <table>
          <thead>
            <tr><th>Order No</th><th>Date</th><th>Vendor</th><th>Total Amount</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.orderNo}</td>
                <td>{order.orderDate}</td>
                <td>{order.vendorRel?.name || '-'}</td>
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
              <h2 className="modal-title">Create Purchase Order</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Order No *</label>
                  <input type="text" className="form-control" value={formData.orderNo} onChange={(e) => setFormData({...formData, orderNo: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Order Date *</label>
                  <input type="date" className="form-control" value={formData.orderDate} onChange={(e) => setFormData({...formData, orderDate: e.target.value})} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Vendor *</label>
                  <select className="form-control" value={formData.vendors} onChange={(e) => setFormData({...formData, vendors: e.target.value})} required>
                    <option value="">-- Select Vendor --</option>
                    {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
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

export default PurchaseOrders;
