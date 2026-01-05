"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../components/adminsidebar";

export default function CategoriesAdminTable() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Add/Edit modal state
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null); // null for add, object for edit
  const [form, setForm] = useState({
    category_name: "",
    description: "",
    image_file: null,
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchCategories = () => {
    fetch("https://api-xmg2fjjbya-uc.a.run.app/api/categories")
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/check', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.push('/adminlogin');
        }
      } catch (err) {
        setIsAuthenticated(false);
        router.push('/adminlogin');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: "#f0f2f5", alignItems: 'center', justifyContent: 'center' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const filteredCategories = categories.filter(cat =>
    searchTerm.trim() === "" ||
    (cat.category_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cat.description || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageCount = Math.ceil(filteredCategories.length / perPage) || 1;
  const paginatedCategories = filteredCategories.slice(page * perPage, (page + 1) * perPage);
  const totalCategories = filteredCategories.length;

  const handleEdit = (cat) => {
    setEditCategory(cat);
    setForm({
      category_name: cat.category_name,
      description: cat.description,
      image_file: null
    });
    setShowModal(true);
  };

  const handleDelete = async (cat) => {
    if (confirm(`Are you sure you want to delete ${cat.category_name}?`)) {
      await fetch(`https://api-xmg2fjjbya-uc.a.run.app/api/categories/${cat.category_id}`, {
        method: "DELETE"
      });
      setCategories(categories.filter(x => x.category_id !== cat.category_id));
    }
  };

  // Show "add" modal with empty form
  const showAddModal = () => {
    setEditCategory(null);
    setForm({
      category_name: "",
      description: "",
      image_file: null
    });
    setShowModal(true);
  };

  const handleFormChange = e => {
    const { name, value, files } = e.target;
    if (name === "image_file") {
      setForm(f => ({ ...f, image_file: files[0] }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleAddOrEdit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("category_name", form.category_name);
    formData.append("description", form.description);
    if (form.image_file) formData.append("image", form.image_file);

    let url, method;
    if (editCategory) {
      url = `https://api-xmg2fjjbya-uc.a.run.app/api/categories/${editCategory.category_id}`;
      method = "PUT";
    } else {
      url = "https://api-xmg2fjjbya-uc.a.run.app/api/categories";
      method = "POST";
    }

    await fetch(url, {
      method,
      body: formData,
    });

    setShowModal(false);
    fetchCategories();
  };

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
          padding: isMobile ? "20px 5vw 0 5vw" : "36px 52px 0 52px",
          boxSizing: "border-box",
          marginLeft: isMobile ? "0" : "280px"
        }}>
          {/* Header */}
          <div style={{
            display: "flex",
            alignItems: isMobile ? "flex-start" : "center",
            justifyContent: "space-between",
            flexDirection: isMobile ? "column" : "row",
            marginBottom: 18,
          }}>
            <h2 style={{ fontWeight: 700, fontSize: isMobile ? "1.4rem" : "2rem", marginLeft: 6, marginBottom: isMobile ? 10 : 0 }}>
              Categories
            </h2>
            <button
              style={{
                backgroundColor: "#0d6efd",
                color: "white",
                border: "none",
                padding: isMobile ? "8px 16px" : "10px 24px",
                borderRadius: "4px",
                fontWeight: 500,
                fontSize: isMobile ? "1rem" : "1rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
                marginLeft: isMobile ? 0 : 10,
                alignSelf: isMobile ? "flex-end" : undefined,
                marginTop: isMobile ? 7 : 0
              }}
              onClick={showAddModal}
            >
              ADD NEW CATEGORY
            </button>
          </div>

          {/* Statistics */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
            gap: "15px",
            marginBottom: "20px"
          }}>
            <div style={{ padding: "15px", background: "#e3f2fd", borderRadius: "8px" }}>
              <h3 style={{ margin: 0, color: "#1976d2" }}>Total Categories</h3>
              <p style={{ margin: "5px 0 0 0", fontSize: "24px", fontWeight: "bold" }}>{totalCategories}</p>
            </div>
          </div>

          {/* Controls */}
          <div style={{
            display: isMobile ? "block" : "flex",
            alignItems: "center",
            marginBottom: 14,
            gap: 16
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
            <span style={{ fontWeight: 500 }}>results</span>
            <input
              type="text"
              placeholder="🔍 Search categories..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setPage(0); }}
              style={{
                padding: "8px 14px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                width: isMobile ? "100%" : "340px",
                marginLeft: isMobile ? 0 : "auto",
                marginTop: isMobile ? 12 : 0
              }}
            />
          </div>

          {/* Main Content */}
          {isMobile ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: 8 }}>
              {paginatedCategories.length === 0 ? (
                <div style={{
                  textAlign: "center",
                  padding: "28px 12px",
                  color: "#888"
                }}>
                  {searchTerm ? "No categories found matching search" : "No categories found."}
                </div>
              ) : (
                paginatedCategories.map((cat, idx) => (
                  <div key={cat.category_id + "_" + idx}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: 8,
                      background: "#fff",
                      boxShadow: "0 1px 6px #0002",
                      padding: "15px 12px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8
                    }}>
                    <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 4 }}>{cat.category_name}</div>
                    {cat.image_url && (
                      <img
                        src={`https://api-xmg2fjjbya-uc.a.run.app${cat.image_url}`}
                        alt={cat.category_name}
                        style={{ width: 75, height: 48, objectFit: "cover", borderRadius: 4, marginBottom: 6 }}
                      />
                    )}
                    <div style={{ fontSize: "1em", marginBottom: 4 }}>{cat.description}</div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button
                        onClick={() => handleEdit(cat)}
                        style={{
                          background: "#ffc107",
                          border: "none",
                          padding: "6px 13px",
                          fontSize: "15px",
                          cursor: "pointer",
                          borderRadius: 4,
                          color: "#000",
                          fontWeight: 500,
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        style={{
                          background: "#dc3545",
                          border: "none",
                          padding: "6px 13px",
                          fontSize: "15px",
                          color: "white",
                          cursor: "pointer",
                          borderRadius: 4,
                          fontWeight: 500,
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div style={{
              width: '100%',
              maxWidth: "100%",
              background: "#fff",
              borderRadius: 11,
              boxShadow: "0 2px 12px rgba(44,62,80,0.08)",
              border: "1px solid #eee",
              overflowX: "auto"
            }}>
              <table className="table" style={{
                marginBottom: 0,
                minWidth: 1000,
                borderCollapse: "collapse",
                width: "100%"
              }}>
                <thead>
                  <tr>
                    <th style={{
                      border: "1px solid #ddd",
                      padding: "10px",
                      background: "#f7f7f7"
                    }}>S.No</th>
                    <th style={{
                      border: "1px solid #ddd",
                      padding: "10px",
                      background: "#f7f7f7"
                    }}>Category Name</th>
                    <th style={{
                      border: "1px solid #ddd",
                      padding: "10px",
                      background: "#f7f7f7"
                    }}>Description</th>
                    <th style={{
                      border: "1px solid #ddd",
                      padding: "10px",
                      background: "#f7f7f7"
                    }}>Image</th>
                    <th style={{
                      border: "1px solid #ddd",
                      padding: "10px",
                      background: "#f7f7f7"
                    }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCategories.length > 0 ? (
                    paginatedCategories.map((cat, idx) => (
                      <tr key={cat.category_id + "_" + idx}>
                        <td style={{ border: "1px solid #ddd", padding: "10px" }}>{page * perPage + idx + 1}</td>
                        <td style={{ border: "1px solid #ddd", padding: "10px" }}>{cat.category_name}</td>
                        <td style={{ border: "1px solid #ddd", padding: "10px" }}>{cat.description}</td>
                        <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                          {cat.image_url && (
                            <img
                              src={`https://api-xmg2fjjbya-uc.a.run.app${cat.image_url}`}
                              alt={cat.category_name}
                              style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 4 }}
                            />
                          )}
                        </td>
                        <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button
                              onClick={() => handleEdit(cat)}
                              style={{
                                background: "#ffc107",
                                border: "none",
                                padding: "6px 12px",
                                cursor: "pointer",
                                borderRadius: 4,
                                color: "#000",
                                fontWeight: 500,
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(cat)}
                              style={{
                                background: "#dc3545",
                                border: "none",
                                padding: "6px 12px",
                                color: "white",
                                cursor: "pointer",
                                borderRadius: 4,
                                fontWeight: 500,
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ border: "1px solid #ddd", padding: "24px", textAlign: "center", color: "#888" }}>
                        No categories found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Row */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "12px 0 36px 0", gap: 20 }}>
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
          {showModal && (
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.37)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <form onSubmit={handleAddOrEdit} style={{
                background: "#fff",
                padding: 32,
                borderRadius: 8,
                minWidth: 340,
                boxShadow: "0 0 18px #0002",
                position: "relative"
              }}>
                <h3>{editCategory ? "Edit Category" : "Add Category"}</h3>
                <div style={{ margin: "12px 0" }}>
                  <label>Name</label>
                  <input
                    type="text"
                    name="category_name"
                    value={form.category_name}
                    onChange={handleFormChange}
                    required
                    style={{ width: "100%", padding: 7, marginTop: 2, border: "1px solid #bbb", borderRadius: 4 }}
                  />
                </div>
                <div style={{ margin: "12px 0" }}>
                  <label>Description</label>
                  <input
                    type="text"
                    name="description"
                    value={form.description}
                    onChange={handleFormChange}
                    required
                    style={{ width: "100%", padding: 7, marginTop: 2, border: "1px solid #bbb", borderRadius: 4 }}
                  />
                </div>
                <div style={{ margin: "12px 0" }}>
                  <label>Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    name="image_file"
                    onChange={handleFormChange}
                    style={{ display: "block", marginTop: 2 }}
                  />
                  {editCategory && editCategory.image_url && (
                    <div>
                      <img
                        src={`https://api-xmg2fjjbya-uc.a.run.app${editCategory.image_url}`}
                        alt=""
                        style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 4, marginTop: 6 }}
                      />
                    </div>
                  )}
                </div>
                <div style={{ marginTop: 18 }}>
                  <button type="submit" style={{
                    background: "#098241",
                    color: "white",
                    border: "none",
                    borderRadius: 5,
                    padding: "8px 18px",
                    marginRight: 8,
                    fontWeight: "bold"
                  }}>
                    Save
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} style={{
                    background: "#bbb", color: "#fff", border: "none", borderRadius: 5, padding: "8px 18px"
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
