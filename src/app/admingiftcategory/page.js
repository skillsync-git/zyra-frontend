"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../components/adminsidebar";

// Styles
const thStyle = {
  background: "#eaeaea",
  color: "#222",
  padding: "10px",
  border: "1px solid #ccc",
  textAlign: "left",
  fontSize: "14px",
  fontWeight: "600",
};
const tdStyle = {
  padding: "10px",
  border: "1px solid #ccc",
  background: "#fff",
  fontSize: "14px",
};

export default function AdminGiftCategoriesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [resultsPerPage, setResultsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modal state for add/edit
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  // Responsive
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch gift categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://api-xmg2fjjbya-uc.a.run.app/api/giftcategories");
      if (res.ok) setCategories(await res.json());
      else setCategories([]);
    } catch { setCategories([]); }
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  // --- CRUD Functionality ---

  // Open modal for add or edit:
  const openModal = (category = null) => {
    setEditCategory(category);
    setForm(category
      ? {
          name: category.name || "",
          description: category.description || "",
        }
      : {
          name: "",
          description: "",
        }
    );
    setShowModal(true);
  };

  // Add or update gift category
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: form.name,
      description: form.description,
    };
    let url = "https://api-xmg2fjjbya-uc.a.run.app/api/giftcategories";
    let method = "POST";
    if (editCategory) {
      url = `https://api-xmg2fjjbya-uc.a.run.app/api/giftcategories/${editCategory.gift_category_id}`;
      method = "PUT";
    }
    await fetch(url, { 
      method, 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data) 
    });
    setShowModal(false);
    fetchCategories();
  };

// Delete a gift category
const deleteCategory = async (categoryId) => {
  if (!confirm("Are you sure you want to delete this category? This may affect gift items using this category.")) return;
  
  try {
    const response = await fetch(`https://api-xmg2fjjbya-uc.a.run.app/api/giftcategories/${categoryId}`, { 
      method: "DELETE" 
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      // Show the error message from server
      alert(data.error || "Failed to delete category");
      return;
    }
    
    // Success - refresh the list
    alert("Category deleted successfully!");
    fetchCategories();
  } catch (error) {
    console.error("Delete error:", error);
    alert("Error deleting category. Please try again.");
  }
};

  // For form fields change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // Pagination & filtering
  const filteredCategories = categories.filter(
    (cat) =>
    (cat.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cat.description || "").toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredCategories.length / resultsPerPage) || 1;
  const currentCategories = filteredCategories.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage);

  if (loading) {
    return (
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <AdminSidebar />
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <h2>Loading Gift Categories...</h2>
            <p>Please wait while we fetch the data</p>
          </div>
        </div>
      </div>
    );
  }

  // --- Render ---

  return (
    <div>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        style={{
          display: isMobile ? "block" : "none",
          position: "fixed",
          top: "15px",
          left: "15px",
          zIndex: 1000,
          padding: "10px 15px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "18px"
        }}
      >☰</button>
      {/* Sidebar */}
      {(!isMobile || isMobileMenuOpen) && (
        <div style={{
          position: "fixed",
          zIndex: 999,
          height: "100vh",
          width: isMobile ? "75vw" : undefined,
          minWidth: isMobile ? 220 : undefined,
          maxWidth: isMobile ? 330 : undefined,
        }}>
          <AdminSidebar />
        </div>
      )}
      {/* Overlay for Mobile */}
      {isMobile && isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 998
          }}
        />
      )}
      <div style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f5f7fb",
        overflow: "hidden"
      }}>
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          padding: isMobile ? "18px 5vw 0 5vw" : "30px",
          boxSizing: "border-box",
          marginLeft: isMobile ? "0" : "300px"
        }}>
          {/* Header */}
          <div style={{
            display: "flex",
            alignItems: isMobile ? "flex-start" : "center",
            justifyContent: "space-between",
            flexDirection: isMobile ? "column" : "row",
            marginBottom: 18
          }}>
            <h1 style={{ fontWeight: 700, fontSize: isMobile ? "1.4rem" : "2rem", marginLeft: 6, marginBottom: isMobile ? 10 : 0 }}>
              Gift Categories
            </h1>
            <button
              onClick={() => openModal()}
              style={{
                padding: isMobile ? "8px 14px" : "8px 20px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: 500,
                fontSize: "14px",
                alignSelf: isMobile ? "flex-end" : undefined,
                marginTop: isMobile ? 7 : 0,
                whiteSpace: "nowrap",
              }}
            >
              Add Category
            </button>
          </div>

          {/* Statistics */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
            gap: "15px",
            marginBottom: "20px",
          }}>
            <div style={{ padding: "15px", background: "#e3f2fd", borderRadius: "8px" }}>
              <h3 style={{ margin: 0, color: "#1976d2" }}>Total Categories</h3>
              <p style={{ margin: "5px 0 0 0", fontSize: "24px", fontWeight: "bold" }}>
                {filteredCategories.length}
              </p>
            </div>
            <div style={{ padding: "15px", background: "#f3e5f5", borderRadius: "8px" }}>
              <h3 style={{ margin: 0, color: "#7b1fa2" }}>Active Categories</h3>
              <p style={{ margin: "5px 0 0 0", fontSize: "24px", fontWeight: "bold" }}>
                {categories.length}
              </p>
            </div>
          </div>

          {/* Controls Row */}
          <div style={{
            display: isMobile ? "block" : "flex",
            alignItems: "center",
            marginBottom: 20,
            gap: 15
          }}>
            <label style={{ marginRight: 10, color: "#666" }}>
              Show{" "}
              <select
                value={resultsPerPage}
                onChange={e => { setResultsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                style={{
                  padding: "5px 10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  margin: "0 5px"
                }}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              results
            </label>
            <input
              type="text"
              placeholder="🔍 Search categories..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              style={{
                padding: "8px 15px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                width: isMobile ? "100%" : "250px",
                marginTop: isMobile ? 8 : 0
              }}
            />
          </div>

          {/* Table (Desktop) or Cards (Mobile) */}
          {isMobile ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {currentCategories.length === 0 ? (
                <div style={{
                  textAlign: "center",
                  padding: "32px 7px",
                  color: "#888"
                }}>
                  {searchTerm ? "No categories found matching search" : "No categories found in database"}
                </div>
              ) : (
                currentCategories.map((cat, index) => (
                  <div key={cat.gift_category_id || index}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: 8,
                      background: "#fff",
                      boxShadow: "0 1px 6px #0002",
                      padding: "11px 12px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 9
                    }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontWeight: 600, fontSize: 16 }}>{cat.name}</div>
                    </div>
                    <div style={{ fontSize: 14, color: "#666" }}>{cat.description || "No description"}</div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 5 }}>
                      <button
                        onClick={() => openModal(cat)}
                        style={{
                          background: "#2196f3",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          padding: "7px 14px",
                          fontWeight: "500",
                          fontSize: "14px",
                          cursor: "pointer"
                        }}
                      >Edit</button>
                      <button
                        onClick={() => deleteCategory(cat.gift_category_id)}
                        style={{
                          background: "#f44336",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          padding: "7px 14px",
                          fontWeight: "500",
                          fontSize: "14px",
                          cursor: "pointer"
                        }}
                      >Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div style={{
              overflowX: "auto",
              border: "1px solid #ddd",
              borderRadius: "4px"
            }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
                <thead>
                  <tr>
                    <th style={thStyle}>S.No</th>
                    {/* <th style={thStyle}>Category ID</th> */}
                    <th style={thStyle}>Category Name</th>
                    <th style={thStyle}>Description</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCategories.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ ...tdStyle, textAlign: "center", padding: "40px" }}>
                        {searchTerm ? "No categories found matching your search" : "No categories found in database"}
                      </td>
                    </tr>
                  ) : (
                    currentCategories.map((cat, index) => (
                      <tr key={cat.gift_category_id || index}
                        style={{ background: index % 2 === 0 ? "#fff" : "#f9f9f9" }}>
                        <td style={tdStyle}>{(currentPage - 1) * resultsPerPage + index + 1}</td>
                        {/* <td style={{ ...tdStyle, fontWeight: "600" }}>{cat.gift_category_id}</td> */}
                        <td style={{ ...tdStyle, fontWeight: "600" }}>{cat.name || "N/A"}</td>
                        <td style={{
                          ...tdStyle,
                          maxWidth: "300px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}>{cat.description || "No description"}</td>
                        <td style={tdStyle}>
                          <div style={{ display: "flex", gap: "8px", flexWrap: "nowrap" }}>
                            <button
                              onClick={() => openModal(cat)}
                              style={{
                                padding: "6px 12px",
                                background: "#2196f3",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "12px"
                              }}
                            >Edit</button>
                            <button
                              onClick={() => deleteCategory(cat.gift_category_id)}
                              style={{
                                padding: "6px 12px",
                                background: "#f44336",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "12px"
                              }}
                            >Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px"
          }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              style={{
                padding: "10px 20px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                background: "white",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                fontSize: "16px",
                color: currentPage === 1 ? "#ccc" : "#666",
              }}
            >&lt;</button>
            <span style={{
              padding: "10px 20px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              background: "white",
              fontWeight: "500",
              fontSize: "16px",
              minWidth: "80px",
              textAlign: "center"
            }}>{currentPage} / {totalPages || 1}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              style={{
                padding: "10px 20px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                background: "white",
                cursor: (currentPage === totalPages || totalPages === 0) ? "not-allowed" : "pointer",
                fontSize: "16px",
                color: (currentPage === totalPages || totalPages === 0) ? "#ccc" : "#666",
              }}
            >&gt;</button>
          </div>

          {/* Modal for Add/Edit category */}
          {showModal && (
            <div style={{
              position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.37)", zIndex: 1000,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <form onSubmit={handleSubmit} style={{
                background: "#fff", padding: 32, borderRadius: 8, minWidth: 320, maxWidth: 500, boxShadow: "0 0 18px #0002", position: "relative"
              }}>
                <h3>{editCategory ? "Edit Category" : "Add Category"}</h3>
                <div style={{ margin: "12px 0" }}>
                  <label>Category Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    required
                    style={{ width: "100%", padding: 7, marginTop: 2, border: "1px solid #bbb", borderRadius: 4 }}
                  />
                </div>
                <div style={{ margin: "12px 0" }}>
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleFormChange}
                    rows="4"
                    style={{ width: "100%", padding: 7, marginTop: 2, border: "1px solid #bbb", borderRadius: 4, resize: "vertical" }}
                  />
                </div>
                <div style={{ marginTop: 18 }}>
                  <button type="submit" style={{
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: 5,
                    padding: "8px 18px",
                    marginRight: 8,
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}>
                    Save
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} style={{
                    background: "#bbb", color: "#fff", border: "none", borderRadius: 5, padding: "8px 18px", cursor: "pointer"
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