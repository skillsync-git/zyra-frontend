"use client";
import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/adminsidebar";

const API_BASE_URL = 'https://api-xmg2fjjbya-uc.a.run.app';

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
  
  // Add/Edit Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [formData, setFormData] = useState({
    offer_name: "",
    discount_percent: "",
    flat_discount: "",
    start_date: "",
    end_date: "",
    is_flash_sale: false,
    promotional_text: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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
      console.error("Error:", error);
      alert("Error connecting to server. Make sure backend is running on port 5000");
    } finally {
      setLoading(false);
    }
  };

  const handleAddOffer = () => {
    setEditingOffer(null);
    setFormData({
      offer_name: "",
      discount_percent: "",
      flat_discount: "",
      start_date: "",
      end_date: "",
      is_flash_sale: false,
      promotional_text: ""
    });
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const handleEditOffer = (offer) => {
    setEditingOffer(offer);
    setFormData({
      offer_name: offer.offer_name || "",
      discount_percent: offer.discount_percent || "",
      flat_discount: offer.flat_discount || "",
      start_date: offer.start_date ? offer.start_date.slice(0, 10) : "",
      end_date: offer.end_date ? offer.end_date.slice(0, 10) : "",
      is_flash_sale: offer.is_flash_sale === 1 || offer.is_flash_sale === true,
      promotional_text: offer.promotional_text || ""
    });
    setImageFile(null);
    setImagePreview(offer.offer_image ? `${API_BASE_URL}${offer.offer_image}` : null);
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingOffer 
        ? `${API_BASE_URL}/api/offers/${editingOffer.offer_id}`
        : `${API_BASE_URL}/api/offers`;
      
      const method = editingOffer ? "PUT" : "POST";
      
      // Use FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('offer_name', formData.offer_name);
      formDataToSend.append('discount_percent', formData.discount_percent === "" ? "" : formData.discount_percent);
      formDataToSend.append('flat_discount', formData.flat_discount === "" ? "" : formData.flat_discount);
      formDataToSend.append('start_date', formData.start_date || "");
      formDataToSend.append('end_date', formData.end_date || "");
      formDataToSend.append('is_flash_sale', formData.is_flash_sale);
      formDataToSend.append('promotional_text', formData.promotional_text || "");
      
      // Append image if selected
      if (imageFile) {
        formDataToSend.append('offer_image', imageFile);
      }

      const response = await fetch(url, {
        method: method,
        body: formDataToSend
      });

      if (response.ok) {
        alert(editingOffer ? "Offer updated successfully!" : "Offer created successfully!");
        setShowModal(false);
        fetchOffers();
      } else {
        const error = await response.json();
        alert("Failed to save offer: " + (error.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error saving offer");
    }
  };

  const deleteOffer = async (offerId) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/offers/${offerId}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        fetchOffers();
        alert("Offer deleted successfully!");
      } else {
        alert("Failed to delete offer");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error deleting offer");
    }
  };

  // Helper function to check if an offer is currently active
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
      <div style={{ display: "flex", minHeight: "100vh", overflow: "hidden" }}>
        <AdminSidebar />
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
          <div style={{ textAlign: "center" }}>
            <h2 style={{ fontSize: "clamp(1.25rem, 4vw, 1.75rem)" }}>Loading Offers...</h2>
            <p style={{ fontSize: "clamp(0.875rem, 3vw, 1rem)" }}>Please wait while we fetch the data</p>
          </div>
        </div>
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
          display: isMobile && !isMobileMenuOpen ? "none" : "block"
        }}>
          <AdminSidebar />
        </div>
      )}

      {/* Overlay for mobile menu */}
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
              {editingOffer ? "Edit Offer" : "Add New Offer"}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                  Offer Name *
                </label>
                <input
                  type="text"
                  name="offer_name"
                  value={formData.offer_name}
                  onChange={handleFormChange}
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
                    value={formData.discount_percent}
                    onChange={handleFormChange}
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
                    value={formData.flat_discount}
                    onChange={handleFormChange}
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
                    value={formData.start_date}
                    onChange={handleFormChange}
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
                    value={formData.end_date}
                    onChange={handleFormChange}
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
                  value={formData.promotional_text}
                  onChange={handleFormChange}
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
                {imagePreview && (
                  <div style={{ marginTop: "10px" }}>
                    <img 
                      src={imagePreview} 
                      alt="Offer preview"
                      style={{
                        width: "100%",
                        maxWidth: "300px",
                        height: "auto",
                        borderRadius: "8px",
                        border: "1px solid #ddd"
                      }}
                    />
                  </div>
                )}
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    name="is_flash_sale"
                    checked={formData.is_flash_sale}
                    onChange={handleFormChange}
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
                  {editingOffer ? "Update Offer" : "Create Offer"}
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
        marginLeft: !isMobile ? "300px" : "0",
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
            gridTemplateColumns: isMobile 
              ? "1fr" 
              : window.innerWidth < 1024 
                ? "repeat(2, 1fr)" 
                : "repeat(3, 1fr)",
            gap: "15px",
            marginBottom: "20px",
          }}>
            <div style={{ padding: "15px", background: "#e3f2fd", borderRadius: "8px" }}>
              <h3 style={{ 
                margin: 0, 
                color: "#1976d2",
                fontSize: "clamp(0.875rem, 3vw, 1rem)"
              }}>
                Total Offers
              </h3>
              <p style={{ 
                margin: "5px 0 0 0", 
                fontSize: "clamp(1.25rem, 5vw, 1.5rem)", 
                fontWeight: "bold" 
              }}>
                {filteredOffers.length}
              </p>
            </div>
            <div style={{ padding: "15px", background: "#f3e5f5", borderRadius: "8px" }}>
              <h3 style={{ 
                margin: 0, 
                color: "#7b1fa2",
                fontSize: "clamp(0.875rem, 3vw, 1rem)"
              }}>
                Active Now
              </h3>
              <p style={{ 
                margin: "5px 0 0 0", 
                fontSize: "clamp(1.25rem, 5vw, 1.5rem)", 
                fontWeight: "bold" 
              }}>
                {activeOffersCount}
              </p>
            </div>
            <div style={{ 
              padding: "15px", 
              background: "#fff3e0", 
              borderRadius: "8px",
              gridColumn: !isMobile && window.innerWidth < 1024 ? "span 2" : "auto"
            }}>
              <h3 style={{ 
                margin: 0, 
                color: "#f57c00",
                fontSize: "clamp(0.875rem, 3vw, 1rem)"
              }}>
                Flash Sales
              </h3>
              <p style={{ 
                margin: "5px 0 0 0", 
                fontSize: "clamp(1.25rem, 5vw, 1.5rem)", 
                fontWeight: "bold" 
              }}>
                {flashSalesCount}
              </p>
            </div>
          </div>

          {/* Mobile Card View */}
          {isMobile ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {currentOffers.length === 0 ? (
                <div style={{ 
                  textAlign: "center", 
                  padding: "40px 20px",
                  background: "#f9f9f9",
                  borderRadius: "8px"
                }}>
                  {searchTerm ? "No offers found matching your search" : "No offers found in database"}
                </div>
              ) : (
                currentOffers.map((offer, index) => {
                  const isActive = isOfferActive(offer);
                  return (
                    <div 
                      key={offer.offer_id || offer.id || index}
                      style={{
                        padding: "15px",
                        background: "#fff",
                        border: isActive ? "2px solid #7b1fa2" : "1px solid #ddd",
                        borderRadius: "8px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                      }}
                    >
                      {offer.offer_image && (
                        <img 
                          src={`${API_BASE_URL}${offer.offer_image}`}
                          alt={offer.offer_name}
                          style={{
                            width: "100%",
                            height: "120px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            marginBottom: "10px"
                          }}
                        />
                      )}
                      
                      <div style={{ 
                        display: "flex", 
                        justifyContent: "space-between",
                        alignItems: "start",
                        marginBottom: "10px"
                      }}>
                        <h3 style={{ 
                          margin: 0, 
                          fontSize: "1.1rem",
                          fontWeight: "600",
                          flex: 1
                        }}>
                          {offer.offer_name || "N/A"}
                        </h3>
                        <div style={{ display: "flex", gap: "5px", marginLeft: "10px" }}>
                          {isActive && (
                            <span style={{ 
                              color: "#fff", 
                              background: "#7b1fa2", 
                              padding: "3px 10px", 
                              borderRadius: "8px",
                              fontSize: "0.75rem",
                              whiteSpace: "nowrap"
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
                              fontSize: "0.75rem",
                              whiteSpace: "nowrap"
                            }}>
                              FLASH
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div style={{ 
                        display: "grid", 
                        gridTemplateColumns: "1fr 1fr",
                        gap: "10px",
                        marginBottom: "10px",
                        fontSize: "0.875rem"
                      }}>
                        <div>
                          <strong>Discount:</strong> {offer.discount_percent != null ? offer.discount_percent + "%" : "—"}
                        </div>
                        <div>
                          <strong>Flat:</strong> {offer.flat_discount != null ? "₹" + offer.flat_discount : "—"}
                        </div>
                        <div>
                          <strong>Start:</strong> {offer.start_date ? offer.start_date.slice(0, 10) : "—"}
                        </div>
                        <div>
                          <strong>End:</strong> {offer.end_date ? offer.end_date.slice(0, 10) : "—"}
                        </div>
                      </div>
                      
                      {offer.promotional_text && (
                        <div style={{ 
                          padding: "8px",
                          background: "#f5f5f5",
                          borderRadius: "4px",
                          marginBottom: "10px",
                          fontSize: "0.813rem",
                          color: "#666"
                        }}>
                          {offer.promotional_text}
                        </div>
                      )}
                      
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => handleEditOffer(offer)}
                          style={{
                            flex: 1,
                            padding: "8px 12px",
                            background: "#2196f3",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteOffer(offer.offer_id || offer.id)}
                          style={{
                            flex: 1,
                            padding: "8px 12px",
                            background: "#f44336",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            /* Desktop Table View */
            <div style={{
              overflowX: "auto",
              overflowY: "auto",
              maxHeight: "500px",
              border: "1px solid #ddd",
              borderRadius: "4px"
            }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1100px" }}>
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
                        {searchTerm ? "No offers found matching your search" : "No offers found in database"}
                      </td>
                    </tr>
                  ) : (
                    currentOffers.map((offer, index) => {
                      const isActive = isOfferActive(offer);
                      return (
                        <tr key={offer.offer_id || offer.id || index} style={{
                          background: index % 2 === 0 ? "#fff" : "#f9f9f9"
                        }}>
                          <td style={tdStyle}>{(currentPage - 1) * resultsPerPage + index + 1}</td>
                          <td style={tdStyle}>
                            {offer.offer_image ? (
                              <img 
                                src={`${API_BASE_URL}${offer.offer_image}`}
                                alt={offer.offer_name}
                                style={{
                                  width: "80px",
                                  height: "50px",
                                  objectFit: "cover",
                                  borderRadius: "4px",
                                  border: "1px solid #ddd"
                                }}
                                onError={(e) => {
                                  e.target.src = '/images/placeholder-offer.jpg';
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
                                  fontSize: "0.75rem",
                                  whiteSpace: "nowrap"
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
                                  fontSize: "0.75rem",
                                  whiteSpace: "nowrap"
                                }}>
                                  FLASH
                                </span>
                              )}
                              {!isActive && !(offer.is_flash_sale === 1 || offer.is_flash_sale === true) && (
                                <span style={{ color: "#888" }}>Inactive</span>
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
                                onClick={() => handleEditOffer(offer)}
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
                                onClick={() => deleteOffer(offer.offer_id || offer.id)}
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
          )}

          {/* Pagination Row */}
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