import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const API = "/api";

export default function App() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [catName, setCatName] = useState("");
  const [product, setProduct] = useState({ name: "", price: "", categoryId: "" });

  useEffect(() => { fetchCategories(); fetchProducts(); }, []);

  const fetchCategories = async () => {
    const { data } = await axios.get(`${API}/categories`);
    setCategories(data);
  };

  const fetchProducts = async () => {
    const { data } = await axios.get(`${API}/products`);
    setProducts(data);
  };

  const addCategory = async (e) => {
    e.preventDefault();
    if (!catName.trim()) return toast.error("Enter a category name");
    try {
      await axios.post(`${API}/categories`, { name: catName });
      toast.success("Category added!");
      setCatName("");
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.error || "Error");
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    if (!product.name.trim()) return toast.error("Enter product name");
    if (!product.price || product.price <= 0) return toast.error("Enter valid price");
    if (!product.categoryId) return toast.error("Select a category");
    try {
      await axios.post(`${API}/products`, product);
      toast.success("Product added!");
      setProduct({ name: "", price: "", categoryId: "" });
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.error || "Error");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await axios.delete(`${API}/products/${id}`);
    toast.success("Deleted!");
    fetchProducts();
  };

  return (
    <div className="app">
      <ToastContainer position="top-right" autoClose={2500} />
      <header className="header">
        <span className="logo">📦</span>
        <h1>Product Manager</h1>
        <p>Manage your inventory with ease</p>
      </header>
      <main className="main">
        <div className="forms-row">
          <div className="card">
            <div className="card-header"><span>🏷️</span><h2>Add Category</h2></div>
            <form onSubmit={addCategory} className="form">
              <div className="form-group">
                <label>Category Name</label>
                <input type="text" placeholder="e.g. Electronics" value={catName} onChange={(e) => setCatName(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary">+ Add Category</button>
            </form>
            <div className="category-pills">
              {categories.map((c) => <span key={c.id} className="pill">{c.name}</span>)}
            </div>
          </div>

          <div className="card">
            <div className="card-header"><span>🛍️</span><h2>Add Product</h2></div>
            <form onSubmit={addProduct} className="form">
              <div className="form-group">
                <label>Product Name</label>
                <input type="text" placeholder="e.g. iPhone 15" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input type="number" placeholder="e.g. 49999" value={product.price} onChange={(e) => setProduct({ ...product, price: e.target.value })} min="0" />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={product.categoryId} onChange={(e) => setProduct({ ...product, categoryId: e.target.value })}>
                  <option value="">-- Select Category --</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <button type="submit" className="btn btn-success">+ Add Product</button>
            </form>
          </div>
        </div>

        <div className="card table-card">
          <div className="card-header">
            <span>📋</span><h2>All Products</h2>
            <span className="badge">{products.length}</span>
          </div>
          {products.length === 0 ? (
            <div className="empty-state"><span>🛒</span><p>No products yet!</p></div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>#</th><th>Product Name</th><th>Price</th><th>Category</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {products.map((p, i) => (
                    <tr key={p.id}>
                      <td className="num">{i + 1}</td>
                      <td className="product-name">{p.name}</td>
                      <td className="price">₹{p.price.toLocaleString("en-IN")}</td>
                      <td><span className="category-tag">{p.categoryName}</span></td>
                      <td><button className="btn btn-danger btn-sm" onClick={() => deleteProduct(p.id)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}