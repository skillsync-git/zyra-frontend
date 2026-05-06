"use client";
import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/adminsidebar";
import { uploadMultipleImages } from "@/utils/fbupload";

const API_BASE_URL = 'https://zyra-website.onrender.com';

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

export default function AdminOffersPage() {
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState([]);
  const [resultsPerPage, setResultsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Form states
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    offer_name: "",
    discount_percent: "",
    flat_discount: "",
    start_date: "",
    end_date: "",
    is_flash_sale: false,
    promotional_text: ""
  });
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    fetchOffers();
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/offers`);
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched offers:", data);
        setOffers(data);
      } else {
        alert("Failed to load offers");
      }
    } catch (error) {
      // console.error("Error:", error);
      alert("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ 
      ...form, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleAddOffer = () => {
    setEditingId(null);
    setForm({
      offer_name: "",
      discount_percent: "",
      flat_discount: "",
      start_date: "",
      end_date: "",
      is_flash_sale: false,
      promotional_text: ""
    });
    setImage(null);
    setExistingImage(null);
    setShowModal(true);
  };

  const handleEdit = (offer) => {
    setEditingId(offer.offer_id);
    setForm({
      offer_name: offer.offer_name,
      discount_percent: offer.discount_percent || "",
      flat_discount: offer.flat_discount || "",
      start_date: offer.start_date ? offer.start_date.slice(0, 10) : "",
      end_date: offer.end_date ? offer.end_date.slice(0, 10) : "",
      is_flash_sale: offer.is_flash_sale === 1 || offer.is_flash_sale === true,
      promotional_text: offer.promotional_text || ""
    });
    setExistingImage(offer.offer_image || null);
    setImage(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let offerImageUrl = null;
      
      // Upload new image to Firebase if selected
      if (image) {
        console.log(`Uploading image to Firebase...`);
        const uploadedUrls = await uploadMultipleImages([image], "offers");
        offerImageUrl = uploadedUrls[0];
        console.log(`✅ Uploaded image:`, offerImageUrl);
      }
      
      // For updates: keep existing image if no new image uploaded
      if (editingId && !image && existingImage) {
        offerImageUrl = existingImage;
        console.log(`Using existing image:`, offerImageUrl);
      }
      
      // Prepare payload
      const payload = {
        offer_name: form.offer_name,
        discount_percent: form.discount_percent || null,
        flat_discount: form.flat_discount || null,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        is_flash_sale: form.is_flash_sale ? 1 : 0,
        promotional_text: form.promotional_text || null,
        offer_image: offerImageUrl
      };
      
      // Remove empty values except offer_image
      Object.keys(payload).forEach(key => {
        if (key !== 'offer_image' && (payload[key] === '' || payload[key] === undefined)) {
          delete payload[key];
        }
      });
      
      console.log("=== Payload to API ===");
      console.log(JSON.stringify(payload, null, 2));
      
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${API_BASE_URL}/api/offers/${editingId}`
        : `${API_BASE_URL}/api/offers`;
      
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
        
        await fetchOffers();
        setShowModal(false);
        setForm({
          offer_name: "",
          discount_percent: "",
          flat_discount: "",
          start_date: "",
          end_date: "",
          is_flash_sale: false,
          promotional_text: ""
        });
        setImage(null);
        setExistingImage(null);
        setEditingId(null);
        
        alert(`Offer ${editingId ? "updated" : "added"} successfully!`);
      } else {
        const contentType = response.headers.get("content-type");
        let errorMessage = "Failed to save offer";
        
        try {
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            console.error("❌ Error response:", errorData);
            errorMessage = errorData.message || errorData.error || errorMessage;
          } else {
            const errorText = await response.text();
            console.error("❌ Error response:", errorText);
            errorMessage = "Internal Server Error";
          }
        } catch (e) {
          console.error("Error parsing response:", e);
        }
        
        alert(errorMessage);
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      alert(`Error saving offer: ${error.message}`);
    }
  };

const deleteOffer = async (offerId) => {
  if (!confirm("Are you sure you want to delete this offer?")) return;
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/offers/${offerId}`, { 
      method: "DELETE" 
    });
    
    if (response.ok) {
      await fetchOffers();
      alert("Offer deleted successfully!");
    } else {
      // Get the actual error message from the server
      const contentType = response.headers.get("content-type");
      let errorMessage = "Failed to delete offer";
      
      try {
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          // console.error("Delete error:", errorData);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } else {
          const errorText = await response.text();
          console.error("Delete error (text):", errorText);
          errorMessage = errorText || errorMessage;
        }
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
      }
      
      alert(`Error: ${errorMessage}`);
    }
  } catch (error) {
    console.error("Network error:", error);
    alert(`Network error: ${error.message}`);
  }
};

  const isOfferActive = (offer) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    const start = offer.start_date ? new Date(offer.start_date) : null;
    if (start) start.setHours(0, 0, 0, 0);
    
    const end = offer.end_date ? new Date(offer.end_date) : null;
    if (end) end.setHours(23, 59, 59, 999);
    
    return (!start || start <= now) && (!end || end >= now);
  };

  // Search & pagination
  const filteredOffers = offers.filter(offer =>
    searchTerm.trim() === "" ||
    (offer.offer_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (offer.promotional_text || "").toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const activeOffersCount = filteredOffers.filter(isOfferActive).length;
  const flashSalesCount = filteredOffers.filter(o => o.is_flash_sale === 1 || o.is_flash_sale === true).length;
  
  const totalPages = Math.ceil(filteredOffers.length / resultsPerPage) || 1;
  const currentOffers = filteredOffers.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  if (loading) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", overflow: "hidden", justifyContent: "center", alignItems: "center" }}>
        <h2>Loading Offers...</h2>
      </div>
    );
  }

  return (
    <div style={{ 
      display: "flex", 
      minHeight: "100vh", 
      background: "#f5f5f5",
      flexDirection: isMobile ? "column" : "row"
    }}>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
      >
        ☰
      </button>

      {/* Sidebar */}
      {(!isMobile || isMobileMenuOpen) && (
        <div style={{
          position: "fixed",
          zIndex: 999,
        }}>
          <AdminSidebar />
        </div>
      )}

      {/* Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 998
          }}
        />
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1001,
          padding: "20px",
          overflowY: "auto"
        }}>
          <div style={{
            background: "white",
            borderRadius: "8px",
            padding: "30px",
            maxWidth: "600px",
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <h2 style={{ marginTop: 0, marginBottom: "20px" }}>
              {editingId ? "Edit Offer" : "Add New Offer"}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                  Offer Name *
                </label>
                <input
                  type="text"
                  name="offer_name"
                  value={form.offer_name}
                  onChange={handleInput}
                  required
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "14px"
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                    Discount %
                  </label>
                  <input
                    type="number"
                    name="discount_percent"
                    value={form.discount_percent}
                    onChange={handleInput}
                    min="0"
                    max="100"
                    step="0.01"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      fontSize: "14px"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                    Flat Discount (₹)
                  </label>
                  <input
                    type="number"
                    name="flat_discount"
                    value={form.flat_discount}
                    onChange={handleInput}
                    min="0"
                    step="0.01"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      fontSize: "14px"
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    value={form.start_date}
                    onChange={handleInput}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      fontSize: "14px"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                    End Date
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    value={form.end_date}
                    onChange={handleInput}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      fontSize: "14px"
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                  Promotional Text
                </label>
                <textarea
                  name="promotional_text"
                  value={form.promotional_text}
                  onChange={handleInput}
                  rows="3"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "14px",
                    resize: "vertical"
                  }}
                />
              </div>

              {/* Offer Image Upload */}
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                  Offer Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "14px"
                  }}
                />
                <div style={{ marginTop: "10px" }}>
                  {image ? (
                    <span style={{ fontSize: "13px", color: "#666" }}>
                      Selected: {image.name}
                    </span>
                  ) : existingImage ? (
                    <img 
                      src={existingImage} 
                      alt="offer" 
                      style={{
                        width: "100%",
                        maxWidth: "300px",
                        height: "auto",
                        borderRadius: "8px",
                        border: "1px solid #ddd"
                      }}
                    />
                  ) : null}
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    name="is_flash_sale"
                    checked={form.is_flash_sale}
                    onChange={handleInput}
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                  <span style={{ fontWeight: "500" }}>This is a Flash Sale</span>
                </label>
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: "10px 20px",
                    background: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "10px 20px",
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  {editingId ? "Update Offer" : "Create Offer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ 
        flex: 1, 
        padding: "clamp(15px, 3vw, 30px)", 
        overflowY: "auto",
        width: "100%",
        marginLeft: !isMobile ? "280px" : "0",
        marginTop: isMobile ? "60px" : "0"
      }}>
        <div style={{ 
          background: "white", 
          padding: "clamp(15px, 3vw, 20px)", 
          borderRadius: "8px", 
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)" 
        }}>
          {/* Header */}
          <div style={{ 
            display: "flex", 
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between", 
            alignItems: isMobile ? "stretch" : "center",
            gap: "15px",
            marginBottom: "20px" 
          }}>
            <h1 style={{ 
              fontWeight: 700, 
              fontSize: "clamp(1.5rem, 5vw, 2rem)", 
              margin: 0 
            }}>
              Offers
            </h1>
            <button
              onClick={handleAddOffer}
              style={{
                padding: "10px 20px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "clamp(0.75rem, 2.5vw, 0.875rem)",
                whiteSpace: "nowrap"
              }}
            >
              Add Offer
            </button>
          </div>

          {/* Controls */}
          <div style={{ 
            display: "flex", 
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "stretch" : "center",
            gap: "15px", 
            marginBottom: "18px"
          }}>
            <label style={{ 
              color: "#666",
              fontSize: "clamp(0.75rem, 2.5vw, 0.875rem)",
              display: "flex",
              alignItems: "center",
              gap: "5px"
            }}>
              Show{" "}
              <select
                value={resultsPerPage}
                onChange={e => { setResultsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                style={{
                  padding: "5px 10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "clamp(0.75rem, 2.5vw, 0.875rem)"
                }}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              {" "}results
            </label>
            <input
              type="text"
              placeholder="🔍 Search offers..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              style={{
                padding: "8px 15px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                width: "100%",
                maxWidth: !isMobile ? "350px" : "100%",
                fontSize: "clamp(0.75rem, 2.5vw, 0.875rem)",
                marginLeft: !isMobile ? "auto" : "0"
              }}
            />
          </div>

          {/* Statistics */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: "15px",
            marginBottom: "20px",
          }}>
            <div style={{ padding: "15px", background: "#e3f2fd", borderRadius: "8px" }}>
              <h3 style={{ margin: 0, color: "#1976d2", fontSize: "clamp(0.875rem, 3vw, 1rem)" }}>
                Total Offers
              </h3>
              <p style={{ margin: "5px 0 0 0", fontSize: "clamp(1.25rem, 5vw, 1.5rem)", fontWeight: "bold" }}>
                {filteredOffers.length}
              </p>
            </div>
            <div style={{ padding: "15px", background: "#f3e5f5", borderRadius: "8px" }}>
              <h3 style={{ margin: 0, color: "#7b1fa2", fontSize: "clamp(0.875rem, 3vw, 1rem)" }}>
                Active Now
              </h3>
              <p style={{ margin: "5px 0 0 0", fontSize: "clamp(1.25rem, 5vw, 1.5rem)", fontWeight: "bold" }}>
                {activeOffersCount}
              </p>
            </div>
            <div style={{ padding: "15px", background: "#fff3e0", borderRadius: "8px" }}>
              <h3 style={{ margin: 0, color: "#f57c00", fontSize: "clamp(0.875rem, 3vw, 1rem)" }}>
                Flash Sales
              </h3>
              <p style={{ margin: "5px 0 0 0", fontSize: "clamp(1.25rem, 5vw, 1.5rem)", fontWeight: "bold" }}>
                {flashSalesCount}
              </p>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1000px" }}>
              <thead>
                <tr>
                  <th style={thStyle}>S.No</th>
                  <th style={thStyle}>Image</th>
                  <th style={thStyle}>Offer Name</th>
                  <th style={thStyle}>Discount %</th>
                  <th style={thStyle}>Flat Discount</th>
                  <th style={thStyle}>Start Date</th>
                  <th style={thStyle}>End Date</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Promo Text</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOffers.length === 0 ? (
                  <tr>
                    <td colSpan="10" style={{ ...tdStyle, textAlign: "center", padding: "40px" }}>
                      {searchTerm ? "No offers found matching your search" : "No offers found"}
                    </td>
                  </tr>
                ) : (
                  currentOffers.map((offer, index) => {
                    const isActive = isOfferActive(offer);
                    return (
                      <tr key={offer.offer_id || index}>
                        <td style={tdStyle}>{(currentPage - 1) * resultsPerPage + index + 1}</td>
                        <td style={tdStyle}>
                          {offer.offer_image ? (
                            <img 
                              src={offer.offer_image}
                              alt={offer.offer_name}
                              style={{
                                width: "80px",
                                height: "50px",
                                objectFit: "cover",
                                borderRadius: "4px",
                                border: "1px solid #ddd"
                              }}
                            />
                          ) : (
                            <span style={{ color: "#999", fontSize: "12px" }}>No image</span>
                          )}
                        </td>
                        <td style={tdStyle}>{offer.offer_name || "N/A"}</td>
                        <td style={tdStyle}>{offer.discount_percent != null ? offer.discount_percent + "%" : "—"}</td>
                        <td style={tdStyle}>{offer.flat_discount != null ? "₹" + offer.flat_discount : "—"}</td>
                        <td style={tdStyle}>{offer.start_date ? offer.start_date.slice(0, 10) : "—"}</td>
                        <td style={tdStyle}>{offer.end_date ? offer.end_date.slice(0, 10) : "—"}</td>
                        <td style={tdStyle}>
                          <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                            {isActive && (
                              <span style={{ 
                                color: "#fff", 
                                background: "#7b1fa2", 
                                padding: "3px 10px", 
                                borderRadius: "8px",
                                fontSize: "0.75rem"
                              }}>
                                ACTIVE
                              </span>
                            )}
                            {(offer.is_flash_sale === 1 || offer.is_flash_sale === true) && (
                              <span style={{ 
                                color: "#fff", 
                                background: "#e53935", 
                                padding: "3px 10px", 
                                borderRadius: "8px",
                                fontSize: "0.75rem"
                              }}>
                                FLASH
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={tdStyle}>
                          <div style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {offer.promotional_text || "—"}
                          </div>
                        </td>
                        <td style={tdStyle}>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              onClick={() => handleEdit(offer)}
                              style={{
                                padding: "6px 12px",
                                background: "#2196f3",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "12px",
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteOffer(offer.offer_id)}
                              style={{
                                padding: "6px 12px",
                                background: "#f44336",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "12px",
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "20px 0", gap: 20 }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              style={{ 
                minWidth: 40,
                padding: "6px 12px",
                background: currentPage === 1 ? "#e0e0e0" : "#2563eb",
                color: currentPage === 1 ? "#999" : "white",
                border: "none",
                borderRadius: "4px",
                cursor: currentPage === 1 ? "not-allowed" : "pointer"
              }}
            >{"<"}</button>
            <span style={{ minWidth: 40, textAlign: "center" }}>{currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{ 
                minWidth: 40,
                padding: "6px 12px",
                background: currentPage === totalPages ? "#e0e0e0" : "#2563eb",
                color: currentPage === totalPages ? "#999" : "white",
                border: "none",
                borderRadius: "4px",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer"
              }}
            >{">"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
