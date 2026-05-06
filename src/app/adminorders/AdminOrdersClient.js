"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../components/adminsidebar";

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

const statusMap = {
  delivered: { bg: "#4caf50", color: "#fff" },
  processing: { bg: "#2196f3", color: "#fff" },
  pending: { bg: "#ff9800", color: "#fff" },
  shipped: { bg: "#00bcd4", color: "#fff" },
  cancelled: { bg: "#f44336", color: "#fff" },
};

function getStatusStyle(status) {
  const s = (status || "").toLowerCase();
  return statusMap[s] || { bg: "#9e9e9e", color: "#fff" };
}

export default function AdminOrdersTable() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [resultsPerPage, setResultsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const [screenSize, setScreenSize] = useState("desktop");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 480) {
        setScreenSize("mobile-small");
      } else if (width < 768) {
        setScreenSize("mobile");
      } else if (width < 1024) {
        setScreenSize("tablet");
      } else {
        setScreenSize("desktop");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = screenSize === "mobile" || screenSize === "mobile-small";
  const isTablet = screenSize === "tablet";
  const isSmallMobile = screenSize === "mobile-small";

  useEffect(() => {
    fetchOrders();
  }, []);

// COMPLETE fetchOrders function - Replace your entire fetchOrders function with this

const fetchOrders = async () => {
  try {
    setLoading(true);

    const response = await fetch("https://zyra-website.onrender.com/api/orders/full");
    if (!response.ok) {
      const txt = await response.text();
      console.error("Error fetching /api/orders/full:", txt);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Backend response:", data); // Debug log
    
    if (!Array.isArray(data)) {
      console.error("orders/full did not return an array:", data);
      setOrders([]);
      return;
    }

    const normalized = data.map((o) => {
      console.log("Processing order:", o); // Debug log
      
      // Build full address string from address object
      let fullAddress = "N/A";
      if (o.address && typeof o.address === "object") {
        const a = o.address;
        fullAddress = [
          a.name,
          a.housenumber,
          a.address,
          a.locality,
          a.landmark,
          a.city,
          a.state,
          a.pincode,
        ]
          .filter(Boolean)
          .join(", ");
      }

      // Get first item details
      let firstItem = null;
      let image = null;
      let totalQuantity = 0;
      let giftItemsList = "N/A";
      
      if (o.items && Array.isArray(o.items) && o.items.length > 0) {
        firstItem = o.items[0];
        
        // Get image
        if (firstItem.image) {
          image = firstItem.image.startsWith("http")
            ? firstItem.image
            : `https://zyra-website.onrender.com${firstItem.image}`;
        }
        
        // Calculate total quantity
        totalQuantity = o.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
        
        // Create gift items list
        giftItemsList = o.items.map(item => item.productname).join(", ");
      }

      return {
        order_id: o.orderid,
        first_name: o.customername || "N/A",
        phone: o.customermobile || "N/A",
        address: fullAddress,
        product: firstItem ? (firstItem.productname || "N/A") : "N/A",
        image: image,
        quantity: totalQuantity,
        price: o.totalamount || 0,
        gift_items: giftItemsList,
        status: o.status || "Pending",
        order_date: o.orderdate || o.created_at,
      };
    });

    console.log("Normalized orders:", normalized); // Debug log
    setOrders(normalized);
  } catch (error) {
    console.error("Error fetching orders:", error);
    alert(
      `Error fetching orders. Make sure backend is running and /api/orders/full exists.\n\n${error.message}`
    );
    setOrders([]);
  } finally {
    setLoading(false);
  }
};

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `https://zyra-website.onrender.com/api/orders/${orderId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.order_id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Error updating order status. Please try again.");
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      searchTerm.trim() === "" ||
      order.order_id?.toString().includes(searchTerm) ||
      (order.first_name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (order.product || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (order.status || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / resultsPerPage)
  );
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const formatDate = (d) => {
    if (!d) return "—";
    const date = new Date(d);
    return !isNaN(date.getTime()) ? date.toLocaleString("en-IN") : d;
  };

  if (loading) {
    return (
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        {!isMobile && <AdminSidebar />}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "50px",
                height: "50px",
                border: "5px solid #f3f3f3",
                borderTop: "5px solid #2563eb",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 20px",
              }}
            ></div>
            <style jsx>{`
              @keyframes spin {
                0% {
                  transform: rotate(0deg);
                }
                100% {
                  transform: rotate(360deg);
                }
              }
            `}</style>
            <h2 style={{ fontSize: isMobile ? "1.3rem" : "1.8rem" }}>
              Loading Orders...
            </h2>
            <p style={{ fontSize: isMobile ? "0.9rem" : "1rem" }}>
              Please wait while we fetch the data
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "#f5f5f5",
      }}
    >
      {(isMobile || isTablet) && (
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          style={{
            position: "fixed",
            top: isSmallMobile ? "10px" : "15px",
            left: isSmallMobile ? "10px" : "15px",
            zIndex: 1000,
            padding: isSmallMobile ? "8px 12px" : "10px 15px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: isSmallMobile ? "16px" : "18px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          ☰
        </button>
      )}

      {!isMobile && !isTablet && (
        <div style={{ position: "fixed", zIndex: 999, height: "100vh" }}>
          <AdminSidebar />
        </div>
      )}

      {(isMobile || isTablet) && isMobileMenuOpen && (
        <>
          <div
            style={{
              position: "fixed",
              zIndex: 999,
              height: "100vh",
              width: isSmallMobile ? "85vw" : "75vw",
              maxWidth: isSmallMobile ? "280px" : "320px",
              left: 0,
              top: 0,
            }}
          >
            <AdminSidebar />
          </div>
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 998,
            }}
          />
        </>
      )}

      <div
        style={{
          flex: 1,
          padding: isSmallMobile
            ? "12px 3vw 0 3vw"
            : isMobile
            ? "15px 4vw 0 4vw"
            : isTablet
            ? "20px 5vw 0 5vw"
            : "30px",
          overflowY: "auto",
          maxHeight: "100vh",
          marginLeft: isMobile || isTablet ? "0" : "300px",
          paddingTop: isMobile || isTablet ? "60px" : "30px",
        }}
      >
        <div
          style={{
            background: "white",
            padding: isSmallMobile
              ? "12px"
              : isMobile
              ? "14px"
              : isTablet
              ? "18px"
              : "24px",
            borderRadius: isSmallMobile ? "6px" : "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: isMobile || isTablet ? "column" : "row",
              justifyContent: "space-between",
              alignItems: isMobile || isTablet ? "flex-start" : "center",
              gap: isMobile || isTablet ? "12px" : "0",
              marginBottom: isSmallMobile
                ? "12px"
                : isMobile
                ? "15px"
                : "20px",
            }}
          >
            <h1
              style={{
                fontWeight: 700,
                fontSize: isSmallMobile
                  ? "1.25rem"
                  : isMobile
                  ? "1.4rem"
                  : isTablet
                  ? "1.7rem"
                  : "2rem",
                margin: 0,
                marginBottom: isMobile || isTablet ? "5px" : 0,
              }}
            >
              Orders Management
            </h1>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: isMobile || isTablet ? "column" : "row",
              justifyContent: "space-between",
              alignItems: isMobile || isTablet ? "stretch" : "center",
              marginBottom: isSmallMobile ? "12px" : "14px",
              gap: isSmallMobile ? "10px" : "12px",
            }}
          >
            <div>
              <label
                style={{
                  marginRight: 10,
                  color: "#666",
                  fontSize: isSmallMobile ? "0.875rem" : "1rem",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <span>Show</span>
                <select
                  value={resultsPerPage}
                  onChange={(e) => {
                    setResultsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  style={{
                    padding: isSmallMobile ? "6px 8px" : "6px 10px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: isSmallMobile ? "0.875rem" : "1rem",
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span>results</span>
              </label>
            </div>
            <input
              type="text"
              placeholder="🔍 Search orders..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                padding: isSmallMobile ? "8px 12px" : "8px 15px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                width: "100%",
                maxWidth: isMobile || isTablet ? "100%" : "350px",
                fontSize: isSmallMobile ? "0.875rem" : "1rem",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isSmallMobile
                ? "1fr"
                : isMobile
                ? "1fr"
                : "repeat(3, 1fr)",
              gap: isSmallMobile ? "10px" : "15px",
              marginBottom: isSmallMobile ? "12px" : "18px",
            }}
          >
            <div
              style={{
                padding: isSmallMobile ? "12px" : "15px",
                background: "#e3f2fd",
                borderRadius: isSmallMobile ? "6px" : "8px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: "#1976d2",
                  fontSize: isSmallMobile ? "0.875rem" : "1.08rem",
                }}
              >
                Total Orders
              </h3>
              <p
                style={{
                  margin: "5px 0 0 0",
                  fontSize: isSmallMobile ? "18px" : "24px",
                  fontWeight: "bold",
                }}
              >
                {filteredOrders.length}
              </p>
            </div>
            <div
              style={{
                padding: isSmallMobile ? "12px" : "15px",
                background: "#e8f5e9",
                borderRadius: isSmallMobile ? "6px" : "8px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: "#388e3c",
                  fontSize: isSmallMobile ? "0.875rem" : "1.08rem",
                }}
              >
                Delivered
              </h3>
              <p
                style={{
                  margin: "5px 0 0 0",
                  fontSize: isSmallMobile ? "18px" : "24px",
                  fontWeight: "bold",
                }}
              >
                {
                  filteredOrders.filter(
                    (o) => (o.status || "").toLowerCase() === "delivered"
                  ).length
                }
              </p>
            </div>
            <div
              style={{
                padding: isSmallMobile ? "12px" : "15px",
                background: "#fff3e0",
                borderRadius: isSmallMobile ? "6px" : "8px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: "#f57c00",
                  fontSize: isSmallMobile ? "0.875rem" : "1.08rem",
                }}
              >
                Processing
              </h3>
              <p
                style={{
                  margin: "5px 0 0 0",
                  fontSize: isSmallMobile ? "18px" : "24px",
                  fontWeight: "bold",
                }}
              >
                {
                  filteredOrders.filter(
                    (o) => (o.status || "").toLowerCase() === "processing"
                  ).length
                }
              </p>
            </div>
          </div>

          {(isMobile || isTablet) ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: isSmallMobile ? "12px" : "14px",
                marginTop: isSmallMobile ? "6px" : "8px",
              }}
            >
              {currentOrders.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: isSmallMobile ? "30px 12px" : "40px 16px",
                    color: "#888",
                    fontSize: isSmallMobile ? "0.9rem" : "1rem",
                  }}
                >
                  {searchTerm
                    ? "No orders found matching search"
                    : "No orders found in database"}
                </div>
              ) : (
                currentOrders.map((order) => {
                  const stat = getStatusStyle(order.status);
                  return (
                    <div
                      key={order.order_id}
                      style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: isSmallMobile ? "6px" : "8px",
                        boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
                        background: "#fff",
                        padding: isSmallMobile ? "12px 10px" : "14px 12px",
                        display: "flex",
                        flexDirection: "column",
                        gap: isSmallMobile ? "8px" : "9px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 600,
                            color: "#1976d2",
                            fontSize: isSmallMobile ? "0.95rem" : "1rem",
                          }}
                        >
                          #{order.order_id}
                        </div>
                        <span
                          style={{
                            background: stat.bg,
                            color: stat.color,
                            padding: isSmallMobile ? "4px 12px" : "5px 14px",
                            borderRadius: 16,
                            fontWeight: 600,
                            fontSize: isSmallMobile ? "0.75rem" : "0.8125rem",
                          }}
                        >
                          {order.status}
                        </span>
                      </div>
                      {order.image && (
                        <img
                          src={order.image}
                          alt="Product"
                          style={{
                            width: "100%",
                            maxWidth: isSmallMobile ? 100 : 120,
                            borderRadius: isSmallMobile ? "6px" : "7px",
                            objectFit: "cover",
                            margin: "0 auto",
                          }}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      )}
                      <div
                        style={{
                          fontSize: isSmallMobile ? "0.875rem" : "0.96em",
                        }}
                      >
                        <b>Name: </b>
                        {order.first_name || "N/A"}
                      </div>
                      <div
                        style={{
                          fontSize: isSmallMobile ? "0.875rem" : "0.96em",
                        }}
                      >
                        <b>Phone: </b>
                        {order.phone || "N/A"}
                      </div>
                      <div
                        style={{
                          fontSize: isSmallMobile ? "0.875rem" : "0.96em",
                        }}
                      >
                        <b>Product: </b>
                        {order.product || "N/A"}
                      </div>
                      <div
                        style={{
                          fontSize: isSmallMobile ? "0.875rem" : "0.96em",
                        }}
                      >
                        <b>Quantity: </b>
                        {order.quantity || "0"}
                      </div>
                      <div
                        style={{
                          fontSize: isSmallMobile ? "0.875rem" : "0.96em",
                        }}
                      >
                        <b>Price: </b>₹
                        {order.price ? Number(order.price).toFixed(2) : "0.00"}
                      </div>
                      <div
                        style={{
                          fontSize: isSmallMobile ? "0.875rem" : "0.96em",
                        }}
                      >
                        <b>Gifts: </b>
                        {order.gift_items || "N/A"}
                      </div>
                      <div
                        style={{
                          fontSize: isSmallMobile ? "0.875rem" : "0.96em",
                        }}
                      >
                        <b>Address: </b>
                        {order.address || "N/A"}
                      </div>
                      <div
                        style={{
                          fontSize: isSmallMobile ? "0.875rem" : "0.96em",
                        }}
                      >
                        <b>Order Date: </b>
                        {formatDate(order.order_date)}
                      </div>
                      <div>
                        <select
                          value={
                            order.status
                              ? order.status.charAt(0).toUpperCase() +
                                order.status.slice(1).toLowerCase()
                              : "Pending"
                          }
                          onChange={(e) =>
                            updateOrderStatus(order.order_id, e.target.value)
                          }
                          style={{
                            padding: isSmallMobile ? "7px 8px" : "8px 10px",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                            fontSize: isSmallMobile ? "0.875rem" : "0.9375rem",
                            width: "100%",
                            marginTop: isSmallMobile ? "5px" : "7px",
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <div
              style={{
                overflowX: "auto",
                border: "1px solid #ddd",
                borderRadius: "4px",
                WebkitOverflowScrolling: "touch",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "1400px",
                }}
              >
                <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
                  <tr>
                    <th style={thStyle}>S.No</th>
                    <th style={thStyle}>Order ID</th>
                    <th style={thStyle}>Customer Name</th>
                    <th style={thStyle}>Phone</th>
                    <th style={thStyle}>Address</th>
                    <th style={thStyle}>Product</th>
                    <th style={thStyle}>Product Image</th>
                    <th style={thStyle}>Quantity</th>
                    <th style={thStyle}>Price</th>
                    <th style={thStyle}>Gifts</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Order Date</th>
                    <th style={thStyle}>Change Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan="13"
                        style={{
                          ...tdStyle,
                          textAlign: "center",
                          padding: "40px",
                        }}
                      >
                        {searchTerm
                          ? "No orders found matching your search"
                          : "No orders found in database"}
                      </td>
                    </tr>
                  ) : (
                    currentOrders.map((order, index) => (
                      <tr
                        key={order.order_id ?? index} 
                        style={{
                          background: index % 2 === 0 ? "#fff" : "#f9f9f9",
                        }}
                      >
                        <td style={tdStyle}>
                          {(currentPage - 1) * resultsPerPage + index + 1}
                        </td>
                        <td
                          style={{
                            ...tdStyle,
                            fontWeight: "600",
                            color: "#1976d2",
                          }}
                        >
                          {order.order_id}
                        </td>
                        <td style={tdStyle}>{order.first_name || "N/A"}</td>
                        <td style={tdStyle}>{order.phone || "N/A"}</td>
                        <td
                          style={{
                            ...tdStyle,
                            maxWidth: "200px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {order.address || "N/A"}
                        </td>
                        <td style={tdStyle}>{order.product || "N/A"}</td>
                        <td style={tdStyle}>
                          {order.image ? (
                            <img
                              src={order.image}
                              alt="Product"
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                                borderRadius: "4px",
                              }}
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <span style={{ color: "#999" }}>No image</span>
                          )}
                        </td>
                        <td style={tdStyle}>{order.quantity || 0}</td>
                        <td style={{ ...tdStyle, fontWeight: "600" }}>
                          ₹
                          {order.price
                            ? Number(order.price).toFixed(2)
                            : "0.00"}
                        </td>
                        <td style={tdStyle}>{order.gift_items || "N/A"}</td>
                        <td style={tdStyle}>
                          <span
                            style={{
                              background: getStatusStyle(order.status).bg,
                              color: getStatusStyle(order.status).color,
                              padding: "5px 12px",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: "600",
                              display: "inline-block",
                            }}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          {formatDate(order.order_date)}
                        </td>
                        <td style={tdStyle}>
                          <select
                            value={
                              order.status
                                ? order.status.charAt(0).toUpperCase() +
                                  order.status.slice(1).toLowerCase()
                                : "Pending"
                            }
                            onChange={(e) =>
                              updateOrderStatus(order.order_id, e.target.value)
                            }
                            style={{
                              padding: "6px 10px",
                              borderRadius: "4px",
                              border: "1px solid #ddd",
                              cursor: "pointer",
                              fontSize: "13px",
                            }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: isSmallMobile ? "15px 0 8px 0" : "18px 0 8px 0",
              gap: isSmallMobile ? 12 : 20,
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              style={{
                minWidth: isSmallMobile ? 35 : 40,
                padding: isSmallMobile ? "6px 10px" : "8px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                background: currentPage === 1 ? "#f5f5f5" : "#fff",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                fontSize: isSmallMobile ? "0.875rem" : "1rem",
              }}
            >
              {"<"}
            </button>
            <span
              style={{
                minWidth: isSmallMobile ? 60 : 70,
                textAlign: "center",
                fontSize: isSmallMobile ? "0.875rem" : "1rem",
              }}
            >
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              style={{
                minWidth: isSmallMobile ? 35 : 40,
                padding: isSmallMobile ? "6px 10px" : "8px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                background:
                  currentPage === totalPages ? "#f5f5f5" : "#fff",
                cursor:
                  currentPage === totalPages ? "not-allowed" : "pointer",
                fontSize: isSmallMobile ? "0.875rem" : "1rem",
              }}
            >
              {">"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
