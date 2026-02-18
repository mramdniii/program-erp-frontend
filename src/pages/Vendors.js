import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

function Vendors() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: '', contact: '', address: '', phone: '', email: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const res = await apiService.getVendors();
    setData(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) await apiService.updateVendor(editId, formData);
      else await apiService.createVendor(formData);
      setShowModal(false);
      setFormData({ name: '', contact: '', address: '', phone: '', email: '' });
      setEditId(null);
      loadData();
    } catch (error) { alert('Error saving data'); }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditId(item.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      await apiService.deleteVendor(id);
      loadData();
    }
  };

  return (
    <div>
      <h1 className="page-title">Vendors</h1>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Vendor List</h2>
          <button className="btn btn-primary" onClick={() => { setShowModal(true); setEditId(null); setFormData({ name: '', contact: '', address: '', phone: '', email: '' }); }}>+ Add New</button>
        </div>
        <table>
          <thead>
            <tr><th>ID</th><th>Name</th><th>Contact</th><th>Phone</th><th>Email</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.contact}</td>
                <td>{item.phone}</td>
                <td>{item.email}</td>
                <td>
                  <button className="btn btn-small btn-secondary" onClick={() => handleEdit(item)} style={{ marginRight: '5px' }}>Edit</button>
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
              <h2 className="modal-title">{editId ? 'Edit' : 'Add'} Vendor</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input type="text" className="form-control" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Person</label>
                  <input type="text" className="form-control" value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input type="text" className="form-control" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <textarea className="form-control" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} rows="3" />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Vendors;
