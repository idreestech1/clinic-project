import { useEffect, useMemo, useState } from "react";
import { api } from "../../../api/client";
import "./Patients.css";

const fallbackPatients = [
  {
    name: "Elena Rodriguez",
    email: "elena.rod@email.com",
    id: "#PT-44291",
    lastVisit: "Oct 12, 2023",
    visitTime: "2:30 PM (Dr. Hammad)",
    status: "Active",
    statusClass: "status-active",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "James Chen",
    email: "j.chen88@email.com",
    id: "#PT-44288",
    lastVisit: "Oct 11, 2023",
    visitTime: "09:15 AM (Dr. Hammad)",
    status: "Pending",
    statusClass: "status-pending",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Sarah Mitchell",
    email: "s.mitchell@email.com",
    id: "#PT-44285",
    lastVisit: "Oct 05, 2023",
    visitTime: "11:00 AM (Dr. Hammad)",
    status: "Inactive",
    statusClass: "status-inactive",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    name: "Arthur Vance",
    email: "vance.a@email.com",
    id: "#PT-44282",
    lastVisit: "Sep 28, 2023",
    visitTime: "04:45 PM (Dr. Hammad)",
    status: "Active",
    statusClass: "status-active",
    avatar: "https://randomuser.me/api/portraits/men/76.jpg",
  },
];

const appointments = [
  {
    time: "10:30",
    period: "AM",
    name: "Michael Thompson",
    type: "Annual Physical Check-up",
    status: "Confirmed",
    statusClass: "appt-confirmed",
  },
  {
    time: "11:15",
    period: "AM",
    name: "Linda Garcia",
    type: "Follow-up: Post-Surgery",
    status: "Rescheduled",
    statusClass: "appt-rescheduled",
  },
];

const segments = [
  { label: "Adults (18-64)", percent: 64, color: "#16a34a" },
  { label: "Seniors (65+)", percent: 28, color: "#16a34a" },
  { label: "Pediatrics (<18)", percent: 8, color: "#d97706" },
];

const getStatusClass = (status) => {
  if (status === "Pending") return "status-pending";
  if (status === "Inactive") return "status-inactive";
  return "status-active";
};

export default function PatientManagement() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoading(true);
        const data = await api.get("/patients");
        setPatients(data.patients || []);
        setError("");
      } catch (err) {
        setPatients(fallbackPatients);
        setError(err.message || "Unable to load patients.");
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return patients;
    return patients.filter((patient) =>
      [patient.name, patient.email, patient.id].some((value) =>
        String(value || "").toLowerCase().includes(term)
      )
    );
  }, [patients, search]);

  const totalPatients = patients.length;
  const newThisMonth = patients.filter((patient) => {
    if (!patient.createdAt) return false;
    const created = new Date(patient.createdAt);
    const now = new Date();
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="pm-root">
      {/* ── Navbar ── */}
      <nav className="pm-nav">
        <div className="pm-nav-left">
          <span className="pm-logo">Clinical Serenity</span>
          <div className="pm-search-wrap">
            <svg className="pm-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input className="pm-search-input" placeholder="Search records..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="pm-nav-right">
          <button className="pm-nav-icon-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
          <button className="pm-nav-icon-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>
          <button className="pm-nav-icon-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
          <div className="pm-nav-divider" />
          <div className="pm-user">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Dr. Hammad" className="pm-user-avatar" />
            <div>
              <p className="pm-user-name">Dr. Hammad</p>
              <p className="pm-user-role">Admin Access</p>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Page Body ── */}
      <main className="pm-body">
        {/* Page Header */}
        <div className="pm-page-header">
          <div>
            <h1 className="pm-page-title">Patient Management</h1>
            <p className="pm-page-sub">Maintain and organize your patient ecosystem with precision.</p>
          </div>
          <button className="pm-add-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
            </svg>
            Add New Patient
          </button>
        </div>

        {/* Stat Cards */}
        <div className="pm-stats">
          <div className="pm-stat-card">
            <div>
              <p className="pm-stat-label">TOTAL PATIENTS</p>
              <p className="pm-stat-value">{totalPatients}</p>
              <p className="pm-stat-note green">{loading ? "Loading..." : "Live from database"}</p>
            </div>
            <div className="pm-stat-icon blue-bg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </div>
          <div className="pm-stat-card">
            <div>
              <p className="pm-stat-label">NEW THIS MONTH</p>
              <p className="pm-stat-value">{newThisMonth}</p>
              <p className="pm-stat-note gray">Registered this month</p>
            </div>
            <div className="pm-stat-icon green-bg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
              </svg>
            </div>
          </div>
          <div className="pm-stat-card">
            <div>
              <p className="pm-stat-label">RECENT ACTIVITY</p>
              <p className="pm-stat-value">{filteredPatients.length}</p>
              <p className="pm-stat-note gray">Matching current search</p>
            </div>
            <div className="pm-stat-icon orange-bg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
                <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
            </div>
          </div>
        </div>

        {/* Patient Table Card */}
        <div className="pm-table-card">
          {/* Table toolbar */}
          <div className="pm-toolbar">
            {error && <span className="pm-pagination-info">{error}</span>}
            <div className="pm-table-search">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input placeholder="Search by name, ID or email..." className="pm-table-search-input" />
            </div>
            <div className="pm-toolbar-right">
              <button className="pm-filter-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                Filters
              </button>
              <div className="pm-view-toggle">
                <span className="pm-view-label">View:</span>
                <button className="pm-view-btn active">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                </button>
                <button className="pm-view-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <table className="pm-table">
            <thead>
              <tr>
                <th>PATIENT NAME</th>
                <th>PATIENT ID</th>
                <th>LAST VISIT</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((p, i) => (
                <tr key={p.id || p.email || i}>
                  <td>
                    <div className="pm-patient-cell">
                      <img src={p.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=1a6fd4&color=fff`} alt={p.name} className="pm-patient-avatar" />
                      <div>
                        <p className="pm-patient-name">{p.name}</p>
                        <p className="pm-patient-email">{p.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="pm-id-cell">{p.id}</td>
                  <td>
                    <p className="pm-visit-date">{p.lastVisit}</p>
                    <p className="pm-visit-time">{p.visitTime}</p>
                  </td>
                  <td>
                    <span className={`pm-status ${p.statusClass || getStatusClass(p.status)}`}>
                      <span className="pm-status-dot" />
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <div className="pm-actions">
                      <button className="pm-action-view" title="View">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                      <button className="pm-action-edit" title="Edit">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button className="pm-action-delete" title="Delete">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6" /><path d="M14 11v6" />
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pm-pagination">
            <span className="pm-pagination-info">Showing {filteredPatients.length} of {totalPatients} patients</span>
            <div className="pm-pagination-controls">
              <button className="pm-page-btn" disabled>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              {[1, 2, 3].map(n => (
                <button
                  key={n}
                  className={`pm-page-num ${currentPage === n ? "active" : ""}`}
                  onClick={() => setCurrentPage(n)}
                >{n}</button>
              ))}
              <span className="pm-page-ellipsis">...</span>
              <button className="pm-page-num" onClick={() => setCurrentPage(32)}>32</button>
              <button className="pm-page-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="pm-bottom-row">
          {/* Today's Appointments */}
          <div className="pm-appt-card">
            <div className="pm-appt-header">
              <h2 className="pm-section-title">Today's Appointments</h2>
              <button className="pm-link-btn">View All Schedule</button>
            </div>
            <div className="pm-appt-list">
              {appointments.map((a, i) => (
                <div className="pm-appt-row" key={i}>
                  <div className="pm-appt-time">
                    <span className="pm-appt-hour">{a.time}</span>
                    <span className="pm-appt-period">{a.period}</span>
                  </div>
                  <div className="pm-appt-divider" />
                  <div className="pm-appt-info">
                    <p className="pm-appt-name">{a.name}</p>
                    <p className="pm-appt-type">{a.type}</p>
                  </div>
                  <span className={`pm-appt-status ${a.statusClass}`}>{a.status}</span>
                  <button className="pm-appt-arrow">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Patient Segments */}
          <div className="pm-seg-card">
            <h2 className="pm-section-title">Patient Segments</h2>
            <div className="pm-seg-list">
              {segments.map((s, i) => (
                <div className="pm-seg-item" key={i}>
                  <div className="pm-seg-row">
                    <span className="pm-seg-label">{s.label}</span>
                    <span className="pm-seg-pct">{s.percent}%</span>
                  </div>
                  <div className="pm-seg-bar-bg">
                    <div
                      className="pm-seg-bar-fill"
                      style={{ width: `${s.percent}%`, background: s.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="pm-seg-insight">
              <p>"Seniors segment has increased by 4.2% since last quarter, suggesting a need for specialized geriatric care modules."</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
