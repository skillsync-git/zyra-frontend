"use client";
import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/adminsidebar";
import { Mail, MailOpen, CheckCircle, Trash2, Search, X } from 'lucide-react';

export default function AdminMessagesPage() {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({ total: 0, unread: 0, read: 0, responded: 0 });
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchMessages();
    fetchStats();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://api-xmg2fjjbya-uc.a.run.app/api/contact-messages");
      if (res.ok) setMessages(await res.json());
      else setMessages([]);
    } catch { setMessages([]); }
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("https://api-xmg2fjjbya-uc.a.run.app/api/contact-messages/stats");
      if (res.ok) setStats(await res.json());
    } catch {}
  };

  const updateStatus = async (messageId, newStatus) => {
    try {
      const res = await fetch(`https://api-xmg2fjjbya-uc.a.run.app/api/contact-messages/${messageId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        await fetchMessages();
        await fetchStats();
        if (selectedMessage?.message_id === messageId) {
          setSelectedMessage({ ...selectedMessage, status: newStatus });
        }
      }
    } catch {}
  };

  const deleteMessage = async (messageId) => {
    if (!confirm('Delete this message?')) return;
    try {
      const res = await fetch(`https://api-xmg2fjjbya-uc.a.run.app/api/contact-messages/${messageId}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchMessages();
        await fetchStats();
        if (selectedMessage?.message_id === messageId) setSelectedMessage(null);
        alert('Message deleted');
      }
    } catch {}
  };

  const viewMessage = async (message) => {
    setSelectedMessage(message);
    if (message.status === 'unread') await updateStatus(message.message_id, 'read');
  };

  const getStatusColor = (status) => {
    const colors = {
      unread: { bg: '#fff3cd', text: '#856404', border: '#ffc107' },
      read: { bg: '#cfe2ff', text: '#084298', border: '#0d6efd' },
      responded: { bg: '#d1e7dd', text: '#0f5132', border: '#198754' }
    };
    return colors[status] || { bg: '#e2e3e5', text: '#41464b', border: '#6c757d' };
  };

  const getStatusIcon = (status) => {
    const icons = {
      unread: <Mail className="w-4 h-4" />,
      read: <MailOpen className="w-4 h-4" />,
      responded: <CheckCircle className="w-4 h-4" />
    };
    return icons[status] || <Mail className="w-4 h-4" />;
  };

  const filteredMessages = messages.filter(msg => {
    const matchesStatus = filterStatus === 'all' || msg.status === filterStatus;
    const matchesSearch = !searchTerm || 
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredMessages.length / resultsPerPage) || 1;
  const currentMessages = filteredMessages.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage);

  if (loading) return <div style={{ display: "flex", height: "100vh", justifyContent: "center", alignItems: "center" }}><h2>Loading...</h2></div>;

  return (
    <div>
      <button onClick={() => setIsMobileMenuOpen(true)} style={{
        display: isMobile ? "block" : "none", position: "fixed", top: "15px", left: "15px", zIndex: 1000,
        padding: "10px 15px", background: "#2563eb", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "18px"
      }}>☰</button>
      {(!isMobile || isMobileMenuOpen) && <div style={{ position: "fixed", zIndex: 999 }}><AdminSidebar /></div>}
      {isMobile && isMobileMenuOpen && <div onClick={() => setIsMobileMenuOpen(false)} style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 998
      }} />}
      
      <div style={{ display: "flex", minHeight: "100vh", background: "#f5f7fb" }}>
        <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "18px 5vw" : "30px", marginLeft: isMobile ? "0" : "300px" }}>
          <h1 style={{ fontWeight: 700, fontSize: isMobile ? "1.4rem" : "2rem", marginBottom: 18 }}>Contact Messages</h1>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)", gap: "15px", marginBottom: "20px" }}>
            {[
              { label: 'Total', value: stats.total, bg: '#e3f2fd', color: '#1976d2' },
              { label: 'Unread', value: stats.unread, bg: '#fff3cd', color: '#856404' },
              { label: 'Read', value: stats.read, bg: '#cfe2ff', color: '#084298' },
              { label: 'Responded', value: stats.responded, bg: '#d1e7dd', color: '#0f5132' }
            ].map((stat, i) => (
              <div key={i} style={{ padding: "15px", background: stat.bg, borderRadius: "8px" }}>
                <h3 style={{ margin: 0, color: stat.color, fontSize: "14px" }}>{stat.label}</h3>
                <p style={{ margin: "5px 0 0 0", fontSize: "24px", fontWeight: "bold" }}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: 15, marginBottom: 20, flexWrap: "wrap" }}>
            <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}
              style={{ padding: "8px 12px", border: "1px solid #ddd", borderRadius: "4px", background: "white" }}>
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="responded">Responded</option>
            </select>
            <select value={resultsPerPage} onChange={e => { setResultsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              style={{ padding: "8px 12px", border: "1px solid #ddd", borderRadius: "4px" }}>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <input type="text" placeholder="🔍 Search..." value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              style={{ padding: "8px 15px", border: "1px solid #ddd", borderRadius: "4px", flex: 1, minWidth: "200px" }}
            />
          </div>

          {/* Messages List */}
          <div style={{ background: "white", borderRadius: "8px", overflow: "hidden", border: "1px solid #ddd" }}>
            {currentMessages.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#888" }}>No messages found</div>
            ) : (
              currentMessages.map((msg, i) => {
                const statusColor = getStatusColor(msg.status);
                return (
                  <div key={msg.message_id} style={{
                    padding: "15px 20px", borderBottom: i < currentMessages.length - 1 ? "1px solid #e5e7eb" : "none",
                    display: "flex", justifyContent: "space-between", alignItems: "center", gap: 15, flexWrap: isMobile ? "wrap" : "nowrap"
                  }}>
                    <div style={{ flex: 1, minWidth: isMobile ? "100%" : "auto" }}>
                      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{msg.name}</div>
                      <div style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>{msg.email}</div>
                      <div style={{ fontSize: 14, marginBottom: 4 }}>{msg.subject}</div>
                      <div style={{ fontSize: 12, color: "#888" }}>{new Date(msg.created_at).toLocaleString()}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <span style={{
                        padding: "4px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "600",
                        background: statusColor.bg, color: statusColor.text, border: `1px solid ${statusColor.border}`,
                        display: "inline-flex", alignItems: "center", gap: "4px"
                      }}>
                        {getStatusIcon(msg.status)} {msg.status}
                      </span>
                      <button onClick={() => viewMessage(msg)} style={{
                        padding: "6px 12px", background: "#2196f3", color: "white", border: "none",
                        borderRadius: "4px", cursor: "pointer", fontSize: "12px"
                      }}>View</button>
                      <button onClick={() => deleteMessage(msg.message_id)} style={{
                        padding: "6px 12px", background: "#f44336", color: "white", border: "none",
                        borderRadius: "4px", cursor: "pointer", fontSize: "12px"
                      }}><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "10px" }}>
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
              style={{ padding: "10px 20px", border: "1px solid #ddd", borderRadius: "4px", background: "white", cursor: currentPage === 1 ? "not-allowed" : "pointer" }}>
              &lt;
            </button>
            <span style={{ padding: "10px 20px", border: "1px solid #ddd", borderRadius: "4px", background: "white" }}>
              {currentPage} / {totalPages}
            </span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
              style={{ padding: "10px 20px", border: "1px solid #ddd", borderRadius: "4px", background: "white", cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}>
              &gt;
            </button>
          </div>

          {/* Message Modal */}
          {selectedMessage && (
            <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
              <div style={{ background: "#fff", borderRadius: 8, maxWidth: 600, width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
                <div style={{ padding: "20px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between" }}>
                  <h2 style={{ margin: 0, fontSize: "20px" }}>Message Details</h2>
                  <button onClick={() => setSelectedMessage(null)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div style={{ padding: "20px" }}>
                  <div style={{ marginBottom: 15 }}>
                    <strong>From:</strong> {selectedMessage.name}<br />
                    <strong>Email:</strong> {selectedMessage.email}<br />
                    {selectedMessage.phone && <><strong>Phone:</strong> {selectedMessage.phone}<br /></>}
                    <strong>Date:</strong> {new Date(selectedMessage.created_at).toLocaleString()}
                  </div>
                  <div style={{ marginBottom: 15 }}>
                    <strong>Subject:</strong><br />
                    {selectedMessage.subject}
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <strong>Message:</strong><br />
                    <div style={{ whiteSpace: "pre-wrap", background: "#f9f9f9", padding: "12px", borderRadius: "4px", marginTop: 8 }}>
                      {selectedMessage.message}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button onClick={() => updateStatus(selectedMessage.message_id, 'responded')}
                      style={{ padding: "8px 16px", background: "#198754", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                      Mark as Responded
                    </button>
                    <button onClick={() => updateStatus(selectedMessage.message_id, 'unread')}
                      style={{ padding: "8px 16px", background: "#ffc107", color: "#000", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                      Mark as Unread
                    </button>
                    <button onClick={() => { deleteMessage(selectedMessage.message_id); setSelectedMessage(null); }}
                      style={{ padding: "8px 16px", background: "#f44336", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}