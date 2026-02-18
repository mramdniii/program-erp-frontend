import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

function Products() {
  const [data, setData] = useState([]);
  const [prodGroups, setProdGroups] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    code: '', name: '', description: '', prodGroup: '', vendors: '', unit: '', price: 0
  });

  useEffect(() => {
    loadData();
    loadProdGroups();
    loadVendors();
  }, []);

  const loadData = async () => {
    const res = await apiService.getProducts();
    setData(res.data);
  };

  const loadProdGroups = async () => {
    const res = await apiService.getProdGroups();
    setProdGroups(res.data);
  };

  const loadVendors = async () => {
    const res = await apiService.getVendors();
    setVendors(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        prodGroup: formData.prodGroup ? parseInt(formData.prodGroup) : null,
        vendors: formData.vendors ? parseInt(formData.vendors) : null,
        price: parseFloat(formData.price) || 0,
      };
      
      if (editId) await apiService.updateProduct(editId, submitData);
      else await apiService.createProduct(submitData);
      
      setShowModal(false);
      setFormData({ code: '', name: '', description: '', prodGroup: '', vendors: '', unit: '', price: 0 });
      setEditId(null);
      loadData();
    } catch (error) {
      alert('Error saving product: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (item) => {
    setFormData({
      code: item.code,
      name: item.name,
      description: item.description || '',
      prodGroup: item.prodGroup || '',
      vendors: item.vendors || '',
      unit: item.unit || '',
      price: item.price || 0,
    });
    setEditId(item.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await apiService.deleteProduct(id);
        loadData();
      } catch (error) {
        alert('Error deleting product');
      }
    }
  };

  return (
    <div>
      <h1 className="page-title">Products</h1>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Product List</h2>
          <button className="btn btn-primary" onClick={() => {
            setShowModal(true);
            setEditId(null);
            setFormData({ code: '', name: '', description: '', prodGroup: '', vendors: '', unit: '', price: 0 });
          }}>
            + Add New Product
          </button>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Product Group</th>
                <th>Vendor</th>
                <th>Unit</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item.id}>
                  <td>{item.code}</td>
                  <td>{item.name}</td>
                  <td>{item.prodGroupRel?.name || '-'}</td>
                  <td>{item.vendorRel?.name || '-'}</td>
                  <td>{item.unit || '-'}</td>
                  <td>Rp {parseFloat(item.price || 0).toLocaleString()}</td>
                  <td>{item.stockList?.qty || 0}</td>
                  <td>
                    <button className="btn btn-small btn-secondary" onClick={() => handleEdit(item)} style={{ marginRight: '5px' }}>
                      Edit
                    </button>
                    <button className="btn btn-small btn-danger" onClick={() => handleDelete(item.id)}>
                      Delete
                    </button>
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
              <h2 className="modal-title">{editId ? 'Edit' : 'Add'} Product</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Product Code *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={formData.code} 
                    onChange={(e) => setFormData({...formData, code: e.target.value})} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    required 
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-control" 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  rows="3" 
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Product Group</label>
                  <select 
                    className="form-control" 
                    value={formData.prodGroup} 
                    onChange={(e) => setFormData({...formData, prodGroup: e.target.value})}
                  >
                    <option value="">-- Select Product Group --</option>
                    {prodGroups.map(pg => (
                      <option key={pg.id} value={pg.id}>{pg.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Vendor</label>
                  <select 
                    className="form-control" 
                    value={formData.vendors} 
                    onChange={(e) => setFormData({...formData, vendors: e.target.value})}
                  >
                    <option value="">-- Select Vendor --</option>
                    {vendors.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Unit</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={formData.unit} 
                    onChange={(e) => setFormData({...formData, unit: e.target.value})} 
                    placeholder="pcs, kg, box, etc."
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Price</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="form-control" 
                    value={formData.price} 
                    onChange={(e) => setFormData({...formData, price: e.target.value})} 
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
