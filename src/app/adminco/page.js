export const dynamic = "force-dynamic";
"use client";
import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/adminsidebar";

export default function AdminCouponsPage() {
  const [loading, setLoading] = useState(true);
  const [coupon, setCoupon] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Edit form states
  const [editDiscountPercent, setEditDiscountPercent] = useState("");
  const [editDiscountAmount, setEditDiscountAmount] = useState("");

  // Fetch coupon from database
  useEffect(() => {
    fetchCoupon();
  }, []);

  const fetchCoupon = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://api-xmg2fjjbya-uc.a.run.app/api/admin/coupons");
      
      if (response.ok) {
        const data = await response.json();
        console.log("✅ Coupons fetched:", data);
        // Get the first coupon only
        if (data && data.length > 0) {
          setCoupon(data[0]);
          setEditDiscountPercent(data[0].discount_percent || "");
          setEditDiscountAmount(data[0].discount_amount || "");
        }
      } else {
        console.warn("Failed to fetch coupon");
        setCoupon(null);
      }
    } catch (error) {
      console.warn("Error fetching coupon:", error);
      setCoupon(null);
    } finally {
      setLoading(false);
    }
  };

  // Update coupon
  const updateCoupon = async () => {
    if (!coupon) return;

    // Validation
    if (!editDiscountPercent || !editDiscountAmount) {
      alert("Please fill in both discount percentage and amount");
      return;
    }

    if (parseFloat(editDiscountPercent) < 0 || parseFloat(editDiscountPercent) > 100) {
      alert("Discount percentage must be between 0 and 100");
      return;
    }

    if (parseFloat(editDiscountAmount) < 0) {
      alert("Discount amount must be a positive number");
      return;
    }

    try {
      const response = await fetch(
        `https://api-xmg2fjjbya-uc.a.run.app/api/admin/coupons/${coupon.coupon_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            discount_percent: parseFloat(editDiscountPercent),
            discount_amount: parseFloat(editDiscountAmount),
          }),
        }
      );

      if (response.ok) {
        console.log("✅ Coupon updated");
        alert("Coupon updated successfully!");
        setIsEditing(false);
        fetchCoupon();
      } else {
        alert("Failed to update coupon");
      }
    } catch (error) {
      console.error("Error updating coupon:", error);
      alert("Error updating coupon");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", overflow: "hidden" }}>
        <AdminSidebar />
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
          <div style={{ textAlign: "center" }}>
            <h2>Loading Coupon...</h2>
            <p>Please wait while we fetch the data</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .sidebar-container {
            position: fixed !important;
            left: ${isMobileMenuOpen ? '0' : '-300px'} !important;
            top: 0;
            height: 100vh;
            z-index: 1000;
            transition: left 0.3s ease;
          }
          .content-container {
            margin-left: 0 !important;
          }
          .mobile-header {
            display: flex !important;
          }
          .coupon-card {
            padding: 20px !important;
          }
          .coupon-details {
            grid-template-columns: 1fr !important;
          }
          .edit-form {
            grid-template-columns: 1fr !important;
          }
          .button-group {
            flex-direction: column !important;
          }
          .button-group button {
            width: 100% !important;
          }
        }

        @media (max-width: 480px) {
          .content-container {
            padding: 15px !important;
          }
          .coupon-card {
            padding: 15px !important;
          }
          h1 {
            font-size: 20px !important;
          }
        }

        .overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          z-index: 999;
        }

        @media (max-width: 768px) {
          .overlay.active {
            display: block;
          }
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 12px;
          border-bottom: 1px solid #eee;
        }

        .detail-label {
          font-weight: 600;
          color: #666;
        }

        .detail-value {
          color: #333;
          font-weight: 500;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-group label {
          font-weight: 600;
          color: #666;
          font-size: 14px;
        }

        .input-group input {
          padding: 10px 15px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 16px;
          transition: border-color 0.3s;
        }

        .input-group input:focus {
          outline: none;
          border-color: #2563eb;
        }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh", overflow: "hidden", background: "#f5f5f5" }}>
        {/* Sidebar */}
        <div className="sidebar-container">
          <AdminSidebar />
        </div>

        {/* Overlay for mobile */}
        <div 
          className={`overlay ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Main Content */}
        <div 
          className="content-container"
          style={{ 
            flex: 1, 
            padding: "30px", 
            overflowY: "auto", 
            maxHeight: "100vh",
            marginLeft: "300px",
            width: "100%"
          }}
        >
          {/* Mobile Menu Button */}
          <div 
            className="mobile-header"
            style={{ 
              display: "none",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              padding: "10px",
              background: "white",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}
          >
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                padding: "10px 12px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ☰
            </button>
            <h2 style={{ margin: 0, fontSize: "18px" }}>Coupon</h2>
          </div>

          {/* Header */}
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginBottom: "30px"
          }}>
            <h1 style={{ margin: 0, color: "#333", fontSize: "28px" }}>
              Coupon Management
            </h1>
            {/* <button
              onClick={fetchCoupon}
              style={{
                padding: "10px 20px",
                background: "#4caf50",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "14px",
              }}
              onMouseOver={(e) => (e.target.style.background = "#45a049")}
              onMouseOut={(e) => (e.target.style.background = "#4caf50")}
            >
              🔄 Refresh
            </button> */}
          </div>

          {/* Coupon Card */}
          {!coupon ? (
            <div style={{
              background: "white",
              padding: "60px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              textAlign: "center"
            }}>
              <h2 style={{ color: "#999", margin: 0 }}>No Coupon Found</h2>
              <p style={{ color: "#666", marginTop: "10px" }}>Please add a coupon from the database</p>
            </div>
          ) : (
            <div 
              className="coupon-card"
              style={{
                background: "white",
                padding: "30px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}
            >
              {/* Coupon Header */}
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                marginBottom: "30px",
                paddingBottom: "20px",
                borderBottom: "2px solid #f0f0f0"
              }}>
                <div>
                  <h2 style={{ 
                    margin: 0, 
                    fontSize: "24px", 
                    color: "#2563eb",
                    fontFamily: "monospace",
                    letterSpacing: "1px"
                  }}>
                    {coupon.code || "N/A"}
                  </h2>
                  <p style={{ margin: "8px 0 0 0", color: "#666", fontSize: "14px" }}>
                    {coupon.terms || "No terms available"}
                  </p>
                </div>
                
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    style={{
                      padding: "12px 24px",
                      background: "#2563eb",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                    onMouseOver={(e) => (e.target.style.background = "#1d4ed8")}
                    onMouseOut={(e) => (e.target.style.background = "#2563eb")}
                  >
                    ✏️ Edit Discounts
                  </button>
                )}
              </div>

              {/* Edit Mode */}
              {isEditing ? (
                <div style={{
                  background: "#f8f9fa",
                  padding: "25px",
                  borderRadius: "8px",
                  marginBottom: "20px"
                }}>
                  <h3 style={{ marginTop: 0, marginBottom: "20px", color: "#333" }}>
                    Edit Discount Values
                  </h3>
                  
                  <div 
                    className="edit-form"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "20px",
                      marginBottom: "20px"
                    }}
                  >
                    <div className="input-group">
                      <label>Discount Percentage (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={editDiscountPercent}
                        onChange={(e) => setEditDiscountPercent(e.target.value)}
                        placeholder="e.g., 20.00"
                      />
                    </div>

                    <div className="input-group">
                      <label>Discount Amount (₹)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={editDiscountAmount}
                        onChange={(e) => setEditDiscountAmount(e.target.value)}
                        placeholder="e.g., 500.00"
                      />
                    </div>
                  </div>

                  <div className="button-group" style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditDiscountPercent(coupon.discount_percent || "");
                        setEditDiscountAmount(coupon.discount_amount || "");
                      }}
                      style={{
                        padding: "10px 20px",
                        background: "#6c757d",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "500",
                      }}
                      onMouseOver={(e) => (e.target.style.background = "#5a6268")}
                      onMouseOut={(e) => (e.target.style.background = "#6c757d")}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={updateCoupon}
                      style={{
                        padding: "10px 20px",
                        background: "#4caf50",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "500",
                      }}
                      onMouseOver={(e) => (e.target.style.background = "#45a049")}
                      onMouseOut={(e) => (e.target.style.background = "#4caf50")}
                    >
                      💾 Save Changes
                    </button>
                  </div>
                </div>
              ) : null}

              {/* Coupon Details */}
              <div 
                className="coupon-details"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  marginTop: "20px"
                }}
              >
                {/* Left Column */}
                <div style={{
                  background: "#f8f9fa",
                  borderRadius: "8px",
                  overflow: "hidden"
                }}>
                  <div className="detail-row">
                    <span className="detail-label">Discount Percentage</span>
                    <span className="detail-value" style={{ color: "#4caf50", fontSize: "18px", fontWeight: "bold" }}>
                      {coupon.discount_percent || "0"}%
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Discount Amount</span>
                    <span className="detail-value" style={{ color: "#f57c00", fontSize: "18px", fontWeight: "bold" }}>
                      ₹{coupon.discount_amount ? parseFloat(coupon.discount_amount).toFixed(2) : "0.00"}
                    </span>
                  </div>
                  <div className="detail-row" style={{ borderBottom: "none" }}>
                    <span className="detail-label">Coupon ID</span>
                    <span className="detail-value">#{coupon.coupon_id}</span>
                  </div>
                </div>

                {/* Right Column */}
                <div style={{
                  background: "#f8f9fa",
                  borderRadius: "8px",
                  overflow: "hidden"
                }}>
                  <div className="detail-row">
                    <span className="detail-label">Valid From</span>
                    <span className="detail-value">{formatDate(coupon.start_date)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Valid Until</span>
                    <span className="detail-value">{formatDate(coupon.end_date)}</span>
                  </div>
                  <div className="detail-row" style={{ borderBottom: "none" }}>
                    <span className="detail-label">Status</span>
                    <span style={{
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600",
                      background: "#4caf50",
                      color: "white",
                    }}>
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}