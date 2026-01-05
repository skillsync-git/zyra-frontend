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

export default function AdminGiftsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [gifts, setGifts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [resultsPerPage, setResultsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modal state for add/edit
  const [showModal, setShowModal] = useState(false);
  const [editGift, setEditGift] = useState(null);
  const [form, setForm] = useState({
    gift_category_id: "",
    name: "",
    description: "",
    image_file: null,
    price: "",
  });

  // Responsive
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch gift items
  const fetchGifts = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://api-xmg2fjjbya-uc.a.run.app/api/giftitems");
      if (res.ok) setGifts(await res.json());
      else setGifts([]);
    } catch { setGifts([]); }
    setLoading(false);
  };

  // Fetch categories for dropdown
  const fetchCategories = async () => {
    const res = await fetch("https://api-xmg2fjjbya-uc.a.run.app/api/giftcategories");
    if (res.ok) setCategories(await res.json());
    else setCategories([]);
  };

  useEffect(() => { fetchGifts(); fetchCategories(); }, []);

  // --- CRUD Functionality ---

  // Open modal for add or edit:
  const openModal = (gift = null) => {
    setEditGift(gift);
    setForm(gift
      ? {
          gift_category_id: gift.gift_category_id || "",
          name: gift.name || "",
          description: gift.description || "",
          image_file: null,
          price: gift.price || "",
        }
      : {
          gift_category_id: "",
          name: "",
          description: "",
          image_file: null,
          price: "",
        }
    );
    setShowModal(true);
  };

  // Add or update gift item
  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("gift_category_id", form.gift_category_id);
    fd.append("name", form.name);
    fd.append("description", form.description);
    fd.append("price", form.price);
    if (form.image_file) fd.append("image", form.image_file);
    let url = "https://api-xmg2fjjbya-uc.a.run.app/api/giftitems";
    let method = "POST";
    if (editGift) {
      url = `https://api-xmg2fjjbya-uc.a.run.app/api/giftitems/${editGift.gift_item_id}`;
      method = "PUT";
    }
    await fetch(url, { method, body: fd });
    setShowModal(false);
    fetchGifts();
  };

  // Delete a gift item
  const deleteGift = async (giftItemId) => {
    if (!confirm("Are you sure you want to delete this gift item?")) return;
    await fetch(`https://api-xmg2fjjbya-uc.a.run.app/api/giftitems/${giftItemId}`, { method: "DELETE" });
    fetchGifts();
  };

  // For form fields change
  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image_file") setForm(f => ({ ...f, image_file: files[0] }));
    else setForm(f => ({ ...f, [name]: value }));
  };

  // Pagination & filtering
  const filteredGifts = gifts.filter(
    (gift) =>
    (gift.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (gift.category_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (gift.description || "").toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredGifts.length / resultsPerPage) || 1;
  const currentGifts = filteredGifts.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage);
  const categoriesStat = [...new Set(gifts.map(g => g.category_name).filter(Boolean))];

  if (loading) {
    return (
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <AdminSidebar />
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <h2>Loading Gift Items...</h2>
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
              Gift Hamper Items
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
              Add Gift Item
            </button>
          </div>

          {/* Statistics */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: "15px",
            marginBottom: "20px",
          }}>
            <div style={{ padding: "15px", background: "#e3f2fd", borderRadius: "8px" }}>
              <h3 style={{ margin: 0, color: "#1976d2" }}>Total Gift Items</h3>
              <p style={{ margin: "5px 0 0 0", fontSize: "24px", fontWeight: "bold" }}>
                {filteredGifts.length}
              </p>
            </div>
            <div style={{ padding: "15px", background: "#f3e5f5", borderRadius: "8px" }}>
              <h3 style={{ margin: 0, color: "#7b1fa2" }}>Categories</h3>
              <p style={{ margin: "5px 0 0 0", fontSize: "24px", fontWeight: "bold" }}>
                {categoriesStat.length}
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
              placeholder="🔍 Search gift items..."
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
              {currentGifts.length === 0 ? (
                <div style={{
                  textAlign: "center",
                  padding: "32px 7px",
                  color: "#888"
                }}>
                  {searchTerm ? "No gift items found matching search" : "No gift items found in database"}
                </div>
              ) : (
                currentGifts.map((gift, index) => (
                  <div key={gift.gift_item_id || index}
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
                      <div style={{ fontWeight: 600, fontSize: 16 }}>{gift.name}</div>
                      <span style={{
                        padding: "4px 11px",
                        background: "#e8f5e9",
                        color: "#388e3c",
                        borderRadius: 14,
                        fontWeight: 600,
                        fontSize: 13
                      }}>
                        {gift.category_name || "N/A"}
                      </span>
                    </div>
                    {gift.image_url && (
                      <img
                        src={`https://api-xmg2fjjbya-uc.a.run.app${gift.image_url}`}
                        alt="Gift"
                        style={{ width: 70, height: 70, objectFit: "cover", borderRadius: 4, marginBottom: 5 }}
                      />
                    )}
                    <div style={{ fontSize: 14 }}>{gift.description || "N/A"}</div>
                    <div style={{ fontWeight: 500, fontSize: 16, marginBottom: 5 }}>
                      ₹{gift.price ? Number(gift.price).toFixed(2) : "0.00"}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => openModal(gift)}
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
                        onClick={() => deleteGift(gift.gift_item_id)}
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
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1250px" }}>
                <thead>
                  <tr>
                    <th style={thStyle}>S.No</th>
                    <th style={thStyle}>Gift Name</th>
                    <th style={thStyle}>Category</th>
                    <th style={thStyle}>Image</th>
                    <th style={thStyle}>Description</th>
                    <th style={thStyle}>Price</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentGifts.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ ...tdStyle, textAlign: "center", padding: "40px" }}>
                        {searchTerm ? "No gift items found matching your search" : "No gift items found in database"}
                      </td>
                    </tr>
                  ) : (
                    currentGifts.map((gift, index) => (
                      <tr key={gift.gift_item_id || index}
                        style={{ background: index % 2 === 0 ? "#fff" : "#f9f9f9" }}>
                        <td style={tdStyle}>{(currentPage - 1) * resultsPerPage + index + 1}</td>
                        <td style={{ ...tdStyle, fontWeight: "600" }}>{gift.name || "N/A"}</td>
                        <td style={tdStyle}>{gift.category_name || "N/A"}</td>
                        <td style={tdStyle}>
                          {gift.image_url ? (
                            <img
                              src={`https://api-xmg2fjjbya-uc.a.run.app${gift.image_url}`}
                              alt="Gift"
                              style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                              onError={(e) => { e.target.style.display = 'none' }}
                            />
                          ) : (
                            <span style={{ color: "#999" }}>No image</span>
                          )}
                        </td>
                        <td style={{
                          ...tdStyle,
                          maxWidth: "200px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}>{gift.description || "N/A"}</td>
                        <td style={{ ...tdStyle, fontWeight: "600" }}>
                          ₹{gift.price ? Number(gift.price).toFixed(2) : "0.00"}
                        </td>
                        <td style={tdStyle}>
                          <div style={{ display: "flex", gap: "8px", flexWrap: "nowrap" }}>
                            <button
                              onClick={() => openModal(gift)}
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
                              onClick={() => deleteGift(gift.gift_item_id)}
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

          {/* Modal for Add/Edit gift item */}
          {showModal && (
            <div style={{
              position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.37)", zIndex: 1000,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <form onSubmit={handleSubmit} style={{
                background: "#fff", padding: 32, borderRadius: 8, minWidth: 320, boxShadow: "0 0 18px #0002", position: "relative"
              }}>
                <h3>{editGift ? "Edit Gift Item" : "Add Gift Item"}</h3>
                <div style={{ margin: "12px 0" }}>
                  <label>Category</label>
                  <select
                    name="gift_category_id"
                    value={form.gift_category_id}
                    onChange={handleFormChange}
                    required
                    style={{ width: "100%", padding: 7, marginTop: 2, border: "1px solid #bbb", borderRadius: 4 }}
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.gift_category_id} value={cat.gift_category_id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div style={{ margin: "12px 0" }}>
                  <label>Gift Name</label>
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
                  <input
                    type="text"
                    name="description"
                    value={form.description}
                    onChange={handleFormChange}
                    style={{ width: "100%", padding: 7, marginTop: 2, border: "1px solid #bbb", borderRadius: 4 }}
                  />
                </div>
                <div style={{ margin: "12px 0" }}>
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    min="0"
                    onChange={handleFormChange}
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
                  />
                  {editGift && editGift.image_url && (
                    <div>
                      <img
                        src={`https://api-xmg2fjjbya-uc.a.run.app${editGift.image_url}`}
                        alt=""
                        style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 4, marginTop: 6 }}
                      />
                    </div>
                  )}
                </div>
                <div style={{ marginTop: 18 }}>
                  <button type="submit" style={{
                    background: "#2563eb",
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
