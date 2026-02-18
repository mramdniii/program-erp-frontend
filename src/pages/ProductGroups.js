import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

function ProductGroups() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const res = await apiService.getProdGroups();
      setData(res.data);
    } catch (error) {
      alert('Error loading data');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await apiService.updateProdGroup(editId, formData);
      } else {
        await apiService.createProdGroup(formData);
      }
      setShowModal(false);
      setFormData({ name: '', description: '' });
      setEditId(null);
      loadData();
    } catch (error) {
      alert('Error saving data');
    }
  };

  const handleEdit = (item) => {
    setFormData({ name: item.name, description: item.description || '' });
    setEditId(item.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await apiService.deleteProdGroup(id);
        loadData();
      } catch (error) {
        alert('Error deleting data');
      }
    }
  };

  return (
    <div>
      <h1 className="page-title">Product Groups</h1>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Product Group List</h2>
          <button className="btn btn-primary" onClick={() => { setShowModal(true); setEditId(null); setFormData({ name: '', description: '' }); }}>
            + Add New
          </button>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>
                    <button className="btn btn-small btn-secondary" onClick={() => handleEdit(item)} style={{ marginRight: '5px' }}>Edit</button>
                    <button className="btn btn-small btn-danger" onClick={() => handleDelete(item.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editId ? 'Edit' : 'Add'} Product Group</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input type="text" className="form-control" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-control" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="3" />
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

export default ProductGroups;
