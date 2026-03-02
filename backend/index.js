const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let categories = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Clothing" },
];
let products = [
  { id: 1, name: "Laptop", price: 75000, categoryId: 1 },
  { id: 2, name: "T-Shirt", price: 499, categoryId: 2 },
];
let categoryIdCounter = 3;
let productIdCounter = 3;

app.get("/api/categories", (req, res) => res.json(categories));

app.post("/api/categories", (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: "Category name required" });
  const category = { id: categoryIdCounter++, name: name.trim() };
  categories.push(category);
  res.status(201).json(category);
});

app.get("/api/products", (req, res) => {
  const result = products.map((p) => ({
    ...p,
    categoryName: categories.find((c) => c.id === p.categoryId)?.name || "Unknown",
  }));
  res.json(result);
});

app.post("/api/products", (req, res) => {
  const { name, price, categoryId } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: "Product name required" });
  if (!price || Number(price) <= 0) return res.status(400).json({ error: "Valid price required" });
  const category = categories.find((c) => c.id === Number(categoryId));
  if (!category) return res.status(400).json({ error: "Category not found" });
  const product = { id: productIdCounter++, name: name.trim(), price: Number(price), categoryId: Number(categoryId) };
  products.push(product);
  res.status(201).json({ ...product, categoryName: category.name });
});

app.delete("/api/products/:id", (req, res) => {
  const index = products.findIndex((p) => p.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Product not found" });
  products.splice(index, 1);
  res.json({ message: "Deleted successfully" });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));