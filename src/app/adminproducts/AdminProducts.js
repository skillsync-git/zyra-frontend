"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../components/adminsidebar";
import { uploadMultipleImages } from "@/utils/fbupload";

const thStyle = {
  background: "#eaeaea",
  color: "#222",
  padding: "10px",
  border: "1px solid #ccc",
  textAlign: "left",
};
const tdStyle = {
  padding: "10px",
  border: "1px solid #ccc",
  background: "#fff",
};

const initialFormState = {
  name: "",
  category_id: "",
  price: "",
  stock_quantity: "",
  description: "",
  key_features: "",
  offer_id: "",
  // limited_sale_id: "",
};

export default function AdminProductsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);
  // const [limitedSales, setLimitedSales] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchOffers();
    // fetchLimitedSales();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://zyra-website.onrender.com/api/products");
      const arr = await res.json();
      setData(
        arr.map((item) => ({
          ...item,
          images: item.images
            ? Array.isArray(item.images)
              ? item.images
              : item.images.split(",")
            : [],
        }))
      );
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("https://zyra-website.onrender.com/api/categories");
      setCategories(await res.json());
    } catch {
      setCategories([]);
    }
  };

  const fetchOffers = async () => {
    try {
      const res = await fetch("https://zyra-website.onrender.com/api/offers");
      setOffers(await res.json());
    } catch {
      setOffers([]);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/check");
        setIsAuthenticated(response.status === 200);
        if (response.status !== 200) router.push("/adminlogin");
      } catch {
        setIsAuthenticated(false);
        router.push("/adminlogin");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleInput = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleImageChange = (e) => setImages(Array.from(e.target.files).slice(0, 4));

const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    let imageUrls = [];
    
    // Upload new images to Firebase if any
    if (images.length > 0) {
      console.log(`Uploading ${images.length} images to Firebase...`);
      imageUrls = await uploadMultipleImages(images, "products");
      console.log(`✅ Uploaded ${imageUrls.length} images:`, imageUrls);
    }
    
    // For updates: keep existing images if no new images uploaded
    if (editingId && images.length === 0 && existingImages.length > 0) {
      imageUrls = existingImages;
      console.log(`Using existing images:`, imageUrls);
    }
    
    // Prepare payload with image URLs
    const payload = {
      name: form.name,
      category_id: form.category_id,
      price: form.price,
      stock_quantity: form.stock_quantity,
      description: form.description,
      key_features: form.key_features || null,
      offer_id: form.offer_id || null,
      image_urls: imageUrls // Send array of Firebase URLs
    };
    
    // Remove empty/null values
    Object.keys(payload).forEach(key => {
      if (payload[key] === '' || payload[key] === null) {
        delete payload[key];
      }
    });
    
    console.log("=== Payload to API ===");
    console.log(JSON.stringify(payload, null, 2));
    console.log("======================");
    
    // Send JSON payload to API
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `https://zyra-website.onrender.com/api/products/${editingId}`
      : "https://zyra-website.onrender.com/api/products";
    
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log("✅ Success:", result);
      
      await fetchProducts();
      setForm(initialFormState);
      setShowForm(false);
      setImages([]);
      setExistingImages([]);
      setEditingId(null);
      
      alert(`Product ${editingId ? "updated" : "added"} successfully!`);
    } else {
      const contentType = response.headers.get("content-type");
      let errorMessage = "Failed to save product";
      
      try {
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          console.error("❌ Error response:", errorData);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } else {
          const errorText = await response.text();
          console.error("❌ Error response (HTML):", errorText);
          errorMessage = "Internal Server Error - Check backend logs";
        }
      } catch (e) {
        console.error("Error parsing response:", e);
      }
      
      alert(errorMessage);
    }
  } catch (error) {
    console.error("❌ Network error:", error);
    alert(`Error saving product: ${error.message}`);
  }
};


  const handleEdit = (item) => {
    setEditingId(item.product_id);
    setForm({
      name: item.name,
      category_id: item.category_id,
      price: item.price,
      stock_quantity: item.stock_quantity,
      description: item.description,
      key_features: item.key_features || "",
      offer_id: item.offer_id || "",
      // limited_sale_id: item.limited_sale_id || "",
    });
    setExistingImages(item.images || []);
    setImages([]);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`https://zyra-website.onrender.com/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Product deleted successfully!");
        await fetchProducts();
      } else {
        alert("Failed to delete product.");
      }
    } catch {
      alert("Error deleting product.");
    }
  };

  const getStockStatus = (count) => {
    const stockCount = parseInt(count) || 0;
    if (stockCount === 0) return { text: "Out of Stock", color: "#dc3545", bgColor: "#ffe5e8" };
    if (stockCount <= 5) return { text: "Low Stock", color: "#ffc107", bgColor: "#fff8e1" };
    return { text: "In Stock", color: "#28a745", bgColor: "#e8f5e9" };
  };

  const filteredData = data.filter(product =>
    searchTerm.trim() === "" ||
    (product.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (categories.find(c => c.category_id == product.category_id)?.category_name || "")
      .toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalProducts = filteredData.length;
  const inStock = filteredData.filter(p => (parseInt(p.stock_quantity) || 0) > 5).length;
  const lowStock = filteredData.filter(p => (parseInt(p.stock_quantity) || 0) > 0 && (parseInt(p.stock_quantity) || 0) <= 5).length;
  const outOfStock = filteredData.filter(p => (parseInt(p.stock_quantity) || 0) === 0).length;
  const pageCount = Math.ceil(filteredData.length / perPage) || 1;
  const paginatedData = filteredData.slice(page * perPage, (page + 1) * perPage);

  if (loading) {
    return (
      <div style={{
        display: "flex",
        minHeight: "100vh",
        overflow: 'hidden',
        background: "#f0f2f5",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <h2>Loading...</h2>
      </div>
    );
  }
  if (!isAuthenticated) return null;

  return (
    <div>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        style={{
          display: isMobile ? "block" : "none",
          position: "fixed",
          top: "15px", left: "15px", zIndex: 1000,
          padding: "10px 15px", background: "#2563eb", color: "white",
          border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "18px"
        }}
      >☰</button>
      {/* Sidebar Overlay */}
      {(!isMobile || isMobileMenuOpen) && (
        <div style={{
          position: "fixed", zIndex: 999,
        }}>
          <AdminSidebar />
        </div>
      )}
      {/* Overlay for Mobile */}
      {isMobile && isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.5)", zIndex: 998
          }}
        />
      )}
      <div style={{
        display: "flex", minHeight: "100vh", background: "#f5f7fb", overflow: "hidden",
        padding: "clamp(15px, 3vw, 20px)"
      }}>
        {/* Main Content */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column", overflowY: "auto",
          padding: isMobile ? "20px 5vw 0 5vw" : "36px 52px 0 52px",
          boxSizing: "border-box", marginLeft: isMobile ? "0" : "280px"
        }}>
          {/* Header */}
          <div style={{
            display: "flex", alignItems: isMobile ? "flex-start" : "center",
            justifyContent: "space-between", marginBottom: 18, marginTop: 30,
            flexDirection: isMobile ? "column" : "row"
          }}>
            <h1 style={{ fontWeight: 700, fontSize: isMobile ? "1.4rem" : "2rem", marginLeft: 6, marginBottom: isMobile ? 10 : 0 }}>
              Products Management
            </h1>
            <button
              style={{
                backgroundColor: "#0d6efd", color: "white", border: "none", padding: isMobile ? "9px 14px" : "8px 18px",
                borderRadius: "4px", fontWeight: 500, fontSize: isMobile ? "1rem" : "1rem", cursor: "pointer",
                marginLeft: isMobile ? 0 : 12, alignSelf: isMobile ? "flex-end" : "center", marginTop: isMobile ? 7 : 0,
                whiteSpace: "nowrap", minWidth: 0
              }}
              onClick={() => {
                setShowForm(true);
                setEditingId(null);
                setForm(initialFormState);
                setImages([]);
                setExistingImages([]);
              }}
            >
              ADD NEW PRODUCT
            </button>
          </div>
          {/* Statistics Row */}
          <div style={{
            display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)",
            gap: "15px", marginBottom: "20px",
          }}>
            <div style={{ padding: "15px", background: "#e3f2fd", borderRadius: "8px" }}>
              <h3 style={{ margin: 0, color: "#1976d2" }}>Total</h3>
              <p style={{ margin: "5px 0 0 0", fontSize: "24px", fontWeight: "bold" }}>{totalProducts}</p>
            </div>
            <div style={{ padding: "15px", background: "#e8f5e9", borderRadius: "8px" }}>
              <h3 style={{ margin: 0, color: "#388e3c" }}>In Stock</h3>
              <p style={{ margin: "5px 0 0 0", fontSize: "24px", fontWeight: "bold" }}>{inStock}</p>
            </div>
            <div style={{ padding: "15px", background: "#fff3e0", borderRadius: "8px" }}>
              <h3 style={{ margin: 0, color: "#ffc107" }}>Low Stock</h3>
              <p style={{ margin: "5px 0 0 0", fontSize: "24px", fontWeight: "bold" }}>{lowStock}</p>
            </div>
            <div style={{ padding: "15px", background: "#ffebee", borderRadius: "8px" }}>
              <h3 style={{ margin: 0, color: "#dc3545" }}>Out of Stock</h3>
              <p style={{ margin: "5px 0 0 0", fontSize: "24px", fontWeight: "bold" }}>{outOfStock}</p>
            </div>
          </div>
          {/* Controls */}
          <div style={{
            display: isMobile ? "block" : "flex", alignItems: "center", marginBottom: 14, gap: 10,
          }}>
            <label style={{ marginRight: 10, fontWeight: 500 }}>Show</label>
            <select
              value={perPage}
              onChange={e => { setPerPage(Number(e.target.value)); setPage(0); }}
              style={{ width: 70, borderRadius: 6, border: "1px solid #bbb", padding: "4px 7px", marginRight: 10 }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
            <span style={{ fontWeight: 500, marginRight: 16 }}>results</span>
            <input
              type="text"
              placeholder="🔍 Search products..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setPage(0); }}
              style={{
                padding: "8px 14px", border: "1px solid #ddd",
                borderRadius: "4px", width: isMobile ? "100%" : "350px",
                marginLeft: isMobile ? 0 : "auto", marginTop: isMobile ? 12 : 0
              }}
            />
          </div>
          {/* Products Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{
              width: "100%", borderCollapse: "collapse", background: "white", minWidth: 1100,
            }}>
              <thead>
                <tr>
                  <th style={thStyle}>S.No</th>
                  <th style={thStyle}>Product Name</th>
                  <th style={thStyle}>Category</th>
                  <th style={thStyle}>Price</th>
                  <th style={thStyle}>Stock</th>
                  <th style={thStyle}>Stock Status</th>
                  <th style={thStyle}>Images</th>
                  <th style={thStyle}>Description</th>
                  <th style={thStyle}>Key Features</th>
                  <th style={thStyle}>Offer</th>
                  {/* <th style={thStyle}>Limited Sale</th> */}
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((item, idx) => {
                    const stockStatus = getStockStatus(item.stock_quantity);
                    const cat = categories.find(c => c.category_id == item.category_id);
                    const offer = offers.find(o => o.offer_id == item.offer_id);
                    // const limitedSale = getLimitedSaleInfo(item.limited_sale_id);
                    return (
                      <tr key={item.product_id || idx}>
                        <td style={tdStyle}>{page * perPage + idx + 1}</td>
                        <td style={tdStyle}>{item.name}</td>
                        <td style={tdStyle}>{cat ? cat.category_name : "—"}</td>
                        <td style={tdStyle}>₹{item.price}</td>
                        <td style={{ ...tdStyle, textAlign: "center", fontWeight: 600 }}>{item.stock_quantity || 0}</td>
                        <td style={tdStyle}>
                          <span style={{
                            padding: "4px 12px", borderRadius: 12, fontSize: 12, fontWeight: 600,
                            color: stockStatus.color, backgroundColor: stockStatus.bgColor, display: "inline-block",
                          }}>{stockStatus.text}</span>
                        </td>

                        <td style={tdStyle}>
                          {Array.isArray(item.images) && item.images.map((url, i) => (
                          <img 
                            key={i} 
                            src={url} 
                            alt="img" 
                            width={40} 
                            height={40}
                            style={{ marginRight: 4, borderRadius: 4, objectFit: "cover" }} 
                          />
                          ))}
                        </td>
                        
                        <td style={tdStyle}>{item.description}</td>
                        <td style={tdStyle}>{item.key_features}</td>
                        <td style={tdStyle}>{offer ? offer.offer_name : "—"}</td>
                        {/* <td style={tdStyle}>
                          {limitedSale ? (
                            <span style={{
                              padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600,
                              color: "#d32f2f", backgroundColor: "#ffebee", display: "inline-block",
                            }}>
                              {limitedSale.promotional_text} ({limitedSale.discount_percent}% OFF)
                            </span>
                          ) : "—"}
                        </td> */}
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={() => handleEdit(item)} style={{
                              background: "#ffc107", border: "none", padding: "6px 12px",
                              cursor: "pointer", borderRadius: 4, color: "#000", fontWeight: 500,
                            }}>Edit</button>
                            <button onClick={() => handleDelete(item.product_id)} style={{
                              background: "#dc3545", border: "none", padding: "6px 12px", color: "white",
                              cursor: "pointer", borderRadius: 4, fontWeight: 500,
                            }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="12" style={{ ...tdStyle, textAlign: "center", padding: "20px" }}>
                      No products found. Click ADD NEW PRODUCT to add your first product.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div style={{
            display: "flex", justifyContent: "center", alignItems: "center", margin: "12px 0 36px 0", gap: 20
          }}>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setPage(p => Math.max(p - 1, 0))}
              disabled={page === 0}
              style={{ minWidth: 40 }}
            >{"<"}</button>
            <span style={{ minWidth: 40, textAlign: "center" }}>{page + 1} / {pageCount}</span>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setPage(p => Math.min(p + 1, pageCount - 1))}
              disabled={page === pageCount - 1}
              style={{ minWidth: 40 }}
            >{">"}</button>
          </div>

          {/* Add/Edit Modal */}
          {showForm && (
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.13)",
              zIndex: 999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "auto",
              maxHeight: "100vh"
            }}>
              <form
                onSubmit={handleSubmit}
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  padding: "32px 32px 24px 32px",
                  minWidth: 320,
                  width: "100%",
                  maxWidth: 420,
                  maxHeight: "95vh",
                  overflowY: "auto",
                  boxShadow: "0 4px 32px rgba(0,0,0,0.11)",
                  position: "relative",
                  fontFamily: "inherit"
                }}
                encType="multipart/form-data"
              >
                <h2 style={{
                  marginTop: 28,
                  marginBottom: 28,
                  fontWeight: 700,
                  fontSize: 25,
                  textAlign: "center",
                  letterSpacing: ".01em"
                }}>
                  {editingId ? "Edit Product" : "Add New Product"}
                </h2>

                <div style={{ marginBottom: 17 }}>
                  <label style={{ fontWeight: 500, marginBottom: 3, display: "block" }}>Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    required
                    autoFocus
                    onChange={handleInput}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      border: "1px solid #d4d4d4",
                      borderRadius: 5,
                      fontSize: 16,
                      background: "#fafbfc"
                    }}
                  />
                </div>
                <div style={{ marginBottom: 17 }}>
                  <label style={{ fontWeight: 500, marginBottom: 3, display: "block" }}>Category</label>
                  <select
                    name="category_id"
                    value={form.category_id}
                    required
                    onChange={handleInput}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      border: "1px solid #d4d4d4",
                      borderRadius: 5,
                      fontSize: 16,
                      background: "#fafbfc"
                    }}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: "flex", gap: 14, marginBottom: 17 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontWeight: 500, marginBottom: 3, display: "block" }}>Price (₹)</label>
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      required
                      min="0"
                      step="0.01"
                      onChange={handleInput}
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        border: "1px solid #d4d4d4",
                        borderRadius: 5,
                        fontSize: 16,
                        background: "#fafbfc"
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontWeight: 500, marginBottom: 3, display: "block" }}>Stock</label>
                    <input
                      type="number"
                      name="stock_quantity"
                      value={form.stock_quantity}
                      required
                      min="0"
                      onChange={handleInput}
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        border: "1px solid #d4d4d4",
                        borderRadius: 5,
                        fontSize: 16,
                        background: "#fafbfc"
                      }}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: 17 }}>
                  <label style={{ fontWeight: 500, marginBottom: 3, display: "block" }}>Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    required
                    rows={3}
                    onChange={handleInput}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      border: "1px solid #d4d4d4",
                      borderRadius: 5,
                      fontSize: 16,
                      background: "#fafbfc",
                      resize: "vertical"
                    }}
                  />
                </div>
                <div style={{ marginBottom: 17 }}>
                  <label style={{ fontWeight: 500, marginBottom: 3, display: "block" }}>Key Features</label>
                  <input
                    type="text"
                    name="key_features"
                    value={form.key_features}
                    onChange={handleInput}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      border: "1px solid #d4d4d4",
                      borderRadius: 5,
                      fontSize: 16,
                      background: "#fafbfc"
                    }}
                  />
                </div>
                <div style={{ marginBottom: 17 }}>
                  <label style={{ fontWeight: 500, marginBottom: 3, display: "block" }}>Offer (optional)</label>
                  <select
                    name="offer_id"
                    value={form.offer_id}
                    onChange={handleInput}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      border: "1px solid #d4d4d4",
                      borderRadius: 5,
                      fontSize: 16,
                      background: "#fafbfc"
                    }}
                  >
                    <option value="">—</option>
                    {offers.map((offer) => (
                      <option key={offer.offer_id} value={offer.offer_id}>
                        {offer.offer_name}
                      </option>
                    ))}
                  </select>
                </div>
               
                <div style={{ marginBottom: 23 }}>
                  <label style={{ fontWeight: 500, marginBottom: 3, display: "block" }}>Images (Up to 4)</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    name="images"
                    onChange={handleImageChange}
                    style={{ marginTop: 7, width: "100%" }}
                    disabled={images.length >= 4}
                  />
                  <div style={{ marginTop: 7, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {images.length > 0
                      ? images.map((img, i) => (
                          <span key={i} style={{
                            fontSize: 13, background: '#f7f7f7', padding: '4px 8px', borderRadius: 3, boxShadow: '0 1px 3px #0002'
                          }}>{img.name}</span>
                        ))
                      : existingImages && existingImages.map &&
                        existingImages.map((url, i) => (
                          <img
                            key={i}
                            src={`https://zyra-website.onrender.com${url}`}
                            alt="img"
                            width={34}
                            height={34}
                            style={{ objectFit: "cover", borderRadius: 6, border: "1px solid #eee", background: "#fafafa" }}
                          />
                        ))
                    }
                  </div>
                </div>
                <div style={{
                  marginTop: 20, display: "flex", gap: 10, justifyContent: "center"
                }}>
                  <button type="submit" style={{
                    padding: "11px 28px", borderRadius: 6, fontWeight: 600,
                    color: "#fff", background: "#1677ff", border: "none", fontSize: 17,
                    boxShadow: "0 1px 3px #0001", letterSpacing: ".01em", cursor: "pointer"
                  }}>
                    {editingId ? "Update" : "Add"}
                  </button>
                  <button
                    type="button"
                    style={{
                      padding: "11px 22px", borderRadius: 6, fontWeight: 600,
                      color: "#666", background: "#f2f2f6", border: "none", fontSize: 17,
                      boxShadow: "0 1px 3px #00000010", letterSpacing: ".01em", cursor: "pointer"
                    }}
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setForm(initialFormState);
                      setImages([]);
                      setExistingImages([]);
                    }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
