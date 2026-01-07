
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../components/adminsidebar";
import { BoxSeam, Basket3, People, CashStack } from "react-bootstrap-icons";

function statusColor(status) {
  switch ((status || "").toLowerCase()) {
    case "delivered":
      return "#37c989";
    case "pending":
      return "#e2e5ec";
    case "shipped":
      return "#338cf3";
    default:
      return "#e2e5ec";
  }
}

function statusTextColor(status) {
  switch ((status || "").toLowerCase()) {
    case "pending":
      return "#444";
    default:
      return "#fff";
  }
}

function getNextStatus(status) {
  const s = (status || "").toLowerCase();
  if (s === "pending") return "shipped";
  if (s === "shipped") return "delivered";
  return "delivered";
}

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    ordersToday: 0,
    customers: 0,
    revenue: 0,
  });

  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 768);
      }
    };

    checkMobile();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/check", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.push("/adminlogin");
        }
      } catch (err) {
        setIsAuthenticated(false);
        router.push("/adminlogin");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

useEffect(() => {
  (async () => {
    try {
      const [ordersRes, statsRes] = await Promise.all([
        fetch("https://api-xmg2fjjbya-uc.a.run.app/api/orders/full"),
        fetch("https://api-xmg2fjjbya-uc.a.run.app/api/dashboard-stats"),
      ]);

      // orders - KEEP ONLY THIS BLOCK
      if (ordersRes.ok) {
        const rawOrders = await ordersRes.json();
        if (Array.isArray(rawOrders)) {
          const normalized = rawOrders.map((o) => {
            const status = (o.status || "").toLowerCase();

            const first_name = o.customername || "—";
            const phone = o.customermobile || "—";

            let fullAddress = "—";
            if (o.address) {
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

            const quantity =
              Array.isArray(o.items) && o.items.length > 0
                ? o.items.reduce(
                    (sum, it) => sum + (Number(it.quantity) || 0),
                    0
                  )
                : "—";

            const price = o.totalamount ?? "—";

            let product = "Multiple items";
            if (Array.isArray(o.items) && o.items.length === 1) {
              product = o.items[0].productname || "—";
            } else if (!Array.isArray(o.items) || o.items.length === 0) {
              product = "—";
            }

            let image = null;
            if (Array.isArray(o.items) && o.items.length > 0) {
              const imgPath = o.items[0].image;
              if (imgPath) {
                image = imgPath.startsWith("http")
                  ? imgPath
                  : `https://api-xmg2fjjbya-uc.a.run.app${imgPath}`;
              }
            }

            return {
              order_id: o.orderid,
              first_name,
              phone,
              address: fullAddress,
              product,
              image,
              quantity,
              price,
              gift_items: "—",
              status,
              order_date: o.orderdate,
            };
          });
          setOrders(normalized);
        } else {
          console.warn("orders/full did not return an array:", rawOrders);
          setOrders([]);
        }
      } else {
        console.error(
          "Failed to fetch orders/full",
          ordersRes.status,
          ordersRes.statusText
        );
        setOrders([]);
      }

      // stats
      if (statsRes.ok) {
        const s = await statsRes.json();
        setStats(s);
      } else {
        console.error(
          "Failed to fetch dashboard-stats",
          statsRes.statusText
        );
      }
    } catch (err) {
      console.error("Fetch error", err);
      setOrders([]);
    }
  })();
}, []);

  const handleStatusClick = async (idx) => {
    const order = orders[idx];
    if (!order) return;
    const newStatus = getNextStatus(order.status);

    const prev = [...orders];
    const updated = [...orders];
    updated[idx] = { ...order, status: newStatus };
    setOrders(updated);

    try {
      const resp = await fetch(
        `https://api-xmg2fjjbya-uc.a.run.app/api/orders/${order.order_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (!resp.ok) {
        setOrders(prev);
        console.error("Failed to update status", await resp.text());
      }
    } catch (err) {
      setOrders(prev);
      console.error("Error updating status", err);
    }
  };

  const recentOrders = orders.filter(
    (order) => (order.status || "").toLowerCase() !== "delivered"
  );

  const orderColumns = [
    "Order ID",
    "Customer Name",
    "Phone",
    "Address",
    "Product",
    "Product Image",
    "Quantity",
    "Price",
    "Gifts",
    "Status",
    "Order Date",
    "Change Status",
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/logout", { method: "POST" });
      if (response.ok) {
        setIsAuthenticated(false);
        router.push("/adminlogin");
      }
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          background: "#f0f2f5",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2 style={{ fontSize: "clamp(1.25rem, 4vw, 1.75rem)" }}>Loading...</h2>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const fmtDate = (d) => {
    if (!d) return "—";
    const dt = new Date(d);
    if (isNaN(dt)) return d;
    return dt.toLocaleString();
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f5f7fb",
        overflow: "hidden",
      }}
    >
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
          fontSize: "18px",
        }}
      >
        ☰
      </button>

      {/* Sidebar */}
      {(!isMobile || isMobileMenuOpen) && (
        <div
          style={{
            position: "fixed",
            zIndex: 999,
            display: isMobile && !isMobileMenuOpen ? "none" : "block",
          }}
        >
          <AdminSidebar onLogout={handleLogout} />
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
            zIndex: 998,
          }}
        />
      )}

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          padding: isMobile ? "70px 15px 20px 15px" : "36px 52px 0 52px",
          boxSizing: "border-box",
          marginLeft: isMobile ? "0" : "280px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "stretch" : "center",
            gap: isMobile ? "15px" : "0",
          }}
        >
          <h2
            style={{
              fontWeight: 700,
              fontSize: "clamp(1.5rem, 5vw, 2rem)",
              marginBottom: 18,
              marginLeft: 6,
            }}
          >
            Dashboard
          </h2>
          <button
            onClick={handleLogout}
            style={{
              padding: "10px 24px",
              background: "#ff6b6b",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "clamp(0.875rem, 2.5vw, 1rem)",
              marginBottom: "16px",
              marginRight: isMobile ? "0" : "6px",
              width: isMobile ? "100%" : "auto",
            }}
          >
            Logout
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : typeof window !== "undefined" && window.innerWidth < 1024
              ? "repeat(2, 1fr)"
              : "repeat(4, 1fr)",
            gap: "20px",
            marginBottom: 30,
          }}
        >
          <StatCard
            label="Total Products"
            value={stats.totalProducts}
            icon={
              <BoxSeam
                size={isMobile ? 28 : 32}
                className="text-primary"
              />
            }
            color="#f8fafc"
            isMobile={isMobile}
          />
          <StatCard
            label="Orders Today"
            value={stats.ordersToday}
            icon={
              <Basket3
                size={isMobile ? 28 : 32}
                className="text-success"
              />
            }
            color="#f0fdfa"
            isMobile={isMobile}
          />
          <StatCard
            label="Customers"
            value={stats.customers}
            icon={
              <People
                size={isMobile ? 28 : 32}
                className="text-info"
              />
            }
            color="#f3f5fd"
            isMobile={isMobile}
          />
          <StatCard
            label="Revenue"
            value={`₹${stats.revenue}`}
            icon={
              <CashStack
                size={isMobile ? 28 : 32}
                className="text-warning"
              />
            }
            color="#f6f5f0"
            isMobile={isMobile}
          />
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 10,
            boxShadow: "0 2px 8px rgba(44,62,80,0.06)",
            padding: isMobile ? "20px 15px" : 32,
            width: "100%",
            overflowX: "auto",
          }}
        >
          <h3
            style={{
              fontWeight: 600,
              marginBottom: 22,
              fontSize: "clamp(1.1rem, 4vw, 1.3rem)",
            }}
          >
            Recent Orders
          </h3>

          {isMobile ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
              }}
            >
              {recentOrders.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px 20px",
                    background: "#f9f9f9",
                    borderRadius: "8px",
                    color: "#666",
                  }}
                >
                  No recent orders
                </div>
              ) : (
                recentOrders.map((order, idx) => (
                  <div
                    key={order.order_id + "_" + idx}
                    style={{
                      padding: "15px",
                      background: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                        marginBottom: "12px",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "#999",
                            marginBottom: "4px",
                          }}
                        >
                          Order ID
                        </div>
                        <h4
                          style={{
                            margin: 0,
                            fontSize: "1rem",
                            fontWeight: "600",
                          }}
                        >
                          #{order.order_id}
                        </h4>
                      </div>
                      <button
                        onClick={() => handleStatusClick(idx)}
                        style={{
                          background: statusColor(order.status),
                          color: statusTextColor(order.status),
                          border: "none",
                          borderRadius: 8,
                          fontWeight: 500,
                          fontSize: "0.813rem",
                          padding: "4px 12px",
                          cursor:
                            (order.status || "").toLowerCase() === "delivered"
                              ? "default"
                              : "pointer",
                        }}
                        disabled={
                          (order.status || "").toLowerCase() === "delivered"
                        }
                      >
                        {(order.status || "—").charAt(0).toUpperCase() +
                          (order.status || "").slice(1)}
                      </button>
                    </div>

                    {order.image && (
                      <div style={{ marginBottom: "12px" }}>
                        <img
                          src={order.image}
                          alt={order.product}
                          style={{
                            width: "100%",
                            height: "150px",
                            objectFit: "cover",
                            borderRadius: 8,
                          }}
                        />
                      </div>
                    )}

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "10px",
                        marginBottom: "12px",
                        fontSize: "0.875rem",
                      }}
                    >
                      <div>
                        <strong>Customer:</strong>
                        <br />
                        {order.first_name}
                      </div>
                      <div>
                        <strong>Phone:</strong>
                        <br />
                        {order.phone}
                      </div>
                      <div>
                        <strong>Product:</strong>
                        <br />
                        {order.product}
                      </div>
                      <div>
                        <strong>Quantity:</strong>
                        <br />
                        {order.quantity}
                      </div>
                      <div>
                        <strong>Price:</strong>
                        <br />₹{order.price}
                      </div>
                      <div>
                        <strong>Gifts:</strong>
                        <br />
                        {order.gift_items}
                      </div>
                    </div>

                    <div
                      style={{
                        padding: "8px",
                        background: "#f5f5f5",
                        borderRadius: "4px",
                        marginBottom: "10px",
                        fontSize: "0.813rem",
                        color: "#666",
                      }}
                    >
                      <strong>Address:</strong> {order.address}
                    </div>

                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#999",
                        marginBottom: "10px",
                      }}
                    >
                      {fmtDate(order.order_date)}
                    </div>

                    {(order.status || "").toLowerCase() !== "delivered" && (
                      <button
                        onClick={() => handleStatusClick(idx)}
                        style={{
                          width: "100%",
                          background: "#338cf3",
                          color: "#fff",
                          border: "none",
                          borderRadius: 8,
                          fontWeight: 500,
                          fontSize: "0.875rem",
                          padding: "10px",
                          cursor: "pointer",
                        }}
                      >
                        {(order.status || "").toLowerCase() === "pending"
                          ? "Mark as Shipped"
                          : "Mark as Delivered"}
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : (
            <table
              style={{
                minWidth: 1100,
                borderCollapse: "collapse",
                width: "100%",
                marginBottom: 0,
              }}
            >
              <thead>
                <tr>
                  {orderColumns.map((col) => (
                    <th
                      key={col}
                      style={{
                        border: "1px solid #e5e7eb",
                        padding: "10px",
                        background: "#f7f7f7",
                        textAlign: "left",
                        fontSize: "0.875rem",
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 && (
                  <tr>
                    <td
                      colSpan={orderColumns.length}
                      style={{
                        padding: 20,
                        textAlign: "center",
                        color: "#666",
                      }}
                    >
                      No recent orders
                    </td>
                  </tr>
                )}
                {recentOrders.map((order, idx) => (
                  <tr key={order.order_id + "_" + idx}>
                    <td
                      style={{
                        border: "1px solid #f8f9f9ff",
                        padding: "10px",
                        fontSize: "0.875rem",
                      }}
                    >
                      {order.order_id}
                    </td>
                    <td
                      style={{
                        border: "1px solid #e5e7eb",
                        padding: "10px",
                        fontSize: "0.875rem",
                      }}
                    >
                      {order.first_name}
                    </td>
                    <td
                      style={{
                        border: "1px solid #e5e7eb",
                        padding: "10px",
                        fontSize: "0.875rem",
                      }}
                    >
                      {order.phone}
                    </td>
                    <td
                      style={{
                        border: "1px solid #e5e7eb",
                        padding: "10px",
                        fontSize: "0.875rem",
                      }}
                    >
                      {order.address}
                    </td>
                    <td
                      style={{
                        border: "1px solid #e5e7eb",
                        padding: "10px",
                        fontSize: "0.875rem",
                      }}
                    >
                      {order.product}
                    </td>
                    <td
                      style={{
                        border: "1px solid #e5e7eb",
                        padding: "10px",
                      }}
                    >
                      {order.image ? (
                        <img
                          src={order.image}
                          alt={order.product}
                          style={{
                            width: 60,
                            height: 40,
                            objectFit: "cover",
                            borderRadius: 4,
                          }}
                        />
                      ) : (
                        "—"
                      )}
                    </td>
                    <td
                      style={{
                        border: "1px solid #e5e7eb",
                        padding: "10px",
                        fontSize: "0.875rem",
                      }}
                    >
                      {order.quantity}
                    </td>
                    <td
                      style={{
                        border: "1px solid #e5e7eb",
                        padding: "10px",
                        fontSize: "0.875rem",
                      }}
                    >
                      {order.price}
                    </td>
                    <td
                      style={{
                        border: "1px solid #e5e7eb",
                        padding: "10px",
                        fontSize: "0.875rem",
                      }}
                    >
                      {order.gift_items || "—"}
                    </td>
                    <td
                      style={{
                        border: "1px solid #e5e7eb",
                        padding: "10px",
                      }}
                    >
                      <button
                        onClick={() => handleStatusClick(idx)}
                        style={{
                          minWidth: 100,
                          background: statusColor(order.status),
                          color: statusTextColor(order.status),
                          border: "none",
                          borderRadius: 8,
                          fontWeight: 500,
                          fontSize: "0.875rem",
                          padding: "4px 12px",
                          cursor:
                            (order.status || "").toLowerCase() === "delivered"
                              ? "default"
                              : "pointer",
                        }}
                        disabled={
                          (order.status || "").toLowerCase() === "delivered"
                        }
                      >
                        {(order.status || "—").charAt(0).toUpperCase() +
                          (order.status || "").slice(1)}
                      </button>
                    </td>
                    <td
                      style={{
                        border: "1px solid #e5e7eb",
                        padding: "10px",
                        fontSize: "0.875rem",
                      }}
                    >
                      {fmtDate(order.order_date)}
                    </td>
                    <td
                      style={{
                        border: "1px solid #e5e7eb",
                        padding: "10px",
                      }}
                    >
                      {(order.status || "").toLowerCase() !== "delivered" && (
                        <button
                          onClick={() => handleStatusClick(idx)}
                          style={{
                            background: "#338cf3",
                            color: "#fff",
                            border: "none",
                            borderRadius: 8,
                            fontWeight: 500,
                            fontSize: "0.813rem",
                            padding: "6px 12px",
                            cursor: "pointer",
                          }}
                        >
                          {(order.status || "").toLowerCase() === "pending"
                            ? "Ship"
                            : "Deliver"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color, isMobile }) {
  return (
    <div
      style={{
        background: color,
        borderRadius: 10,
        boxShadow: "0 2px 8px rgba(44,62,80,0.08)",
        padding: isMobile ? "18px" : 22,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span
        style={{
          fontSize: isMobile ? "1.8rem" : "2.1rem",
          marginRight: 16,
        }}
      >
        {icon}
      </span>
      <div style={{ textAlign: "right" }}>
        <div
          style={{
            fontSize: isMobile ? "0.875rem" : "1.05rem",
            color: "#557",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontWeight: 600,
            fontSize: isMobile ? "1.1rem" : "1.3rem",
            marginTop: 6,
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}
