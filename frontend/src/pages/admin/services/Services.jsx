import { useEffect, useMemo, useState } from "react";
import { api } from "../../../api/client";
import "../shared/AdminSection.css";
import "./Services.css";

const services = [
  { name: "General Consultation", category: "Primary Care", duration: "10 min", price: "$60", status: "Live" },
  { name: "Diabetes Follow-up", category: "Chronic Care", duration: "20 min", price: "$85", status: "Live" },
  { name: "Cardiac Screening", category: "Diagnostics", duration: "30 min", price: "$140", status: "Live" },
  { name: "Preventive Health Plan", category: "Wellness", duration: "45 min", price: "$180", status: "Draft" },
];

const featured = [
  "Priority evening appointments",
  "Digital reports and follow-up",
  "Family health packages",
];

export default function AdminServices() {
  const [serviceList, setServiceList] = useState(services);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await api.get("/services");
        setServiceList(data.services || []);
        setError("");
      } catch (err) {
        setError(err.message || "Unable to load services.");
      }
    };

    loadServices();
  }, []);

  const liveStats = useMemo(() => [
    { label: "Active Services", value: serviceList.filter((service) => service.status === "Live").length, note: "Visible on website" },
    { label: "Monthly Requests", value: "Live", note: "Connected to database" },
    { label: "Avg. Fee", value: serviceList[0]?.price || "$0", note: "From service catalog" },
    { label: "Featured", value: serviceList.filter((service) => service.featured).length, note: "Shown on home page" },
  ], [serviceList]);

  return (
    <section className="admin-section admin-services">
      <header className="admin-section__header">
        <div>
          <p className="admin-section__eyebrow">Service Catalog</p>
          <h1 className="admin-section__title">Manage Clinic Services</h1>
          <p className="admin-section__sub">
            Control which medical services appear on the public website, update pricing, and keep appointment durations aligned with clinic capacity.
          </p>
        </div>
        <div className="admin-section__actions">
          <button className="admin-btn admin-btn--ghost">Export List</button>
          <button className="admin-btn admin-btn--primary">Add Service</button>
        </div>
      </header>

      <div className="admin-grid admin-grid--4">
        {liveStats.map((item) => (
          <article className="admin-card" key={item.label}>
            <p className="admin-card__label">{item.label}</p>
            <p className="admin-card__value">{item.value}</p>
            <p className="admin-card__note">{item.note}</p>
          </article>
        ))}
      </div>

      <div className="admin-grid admin-grid--2">
        <article className="admin-card admin-services__editor">
          <div>
            <h2 className="admin-panel-title">Create or Edit Service</h2>
            <p className="admin-panel-sub">Use this panel for public service details and internal scheduling rules.</p>
          </div>
          <div className="admin-services__form">
            <div className="admin-field">
              <label>Service Name</label>
              <input className="admin-input" defaultValue="General Consultation" />
            </div>
            <div className="admin-services__form-row">
              <div className="admin-field">
                <label>Category</label>
                <select className="admin-select" defaultValue="Primary Care">
                  <option>Primary Care</option>
                  <option>Diagnostics</option>
                  <option>Wellness</option>
                  <option>Chronic Care</option>
                </select>
              </div>
              <div className="admin-field">
                <label>Duration</label>
                <select className="admin-select" defaultValue="10 min">
                  <option>10 min</option>
                  <option>20 min</option>
                  <option>30 min</option>
                  <option>45 min</option>
                </select>
              </div>
            </div>
            <div className="admin-field">
              <label>Description</label>
              <textarea className="admin-textarea" defaultValue="A focused consultation for diagnosis, treatment guidance, prescriptions, and follow-up planning." />
            </div>
            <button className="admin-btn admin-btn--primary">Save Service</button>
          </div>
        </article>

        <article className="admin-card admin-services__feature">
          <h2 className="admin-panel-title">Featured Website Highlights</h2>
          <p className="admin-panel-sub">These appear as service benefits on the patient-facing pages.</p>
          <div className="admin-services__feature-list">
            {featured.map((item, index) => (
              <div className="admin-services__feature-item" key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </article>
      </div>

      <article className="admin-card">
        <h2 className="admin-panel-title">Service Directory</h2>
        {error && <p className="admin-panel-sub">{error}</p>}
        <p className="admin-panel-sub">Review active, draft, and hidden services before publishing website updates.</p>
        <div className="admin-table-wrap admin-services__table">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Category</th>
                <th>Duration</th>
                <th>Fee</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {serviceList.map((service) => (
                <tr key={service.name}>
                  <td><strong>{service.name}</strong></td>
                  <td>{service.category}</td>
                  <td>{service.duration}</td>
                  <td>{service.price}</td>
                  <td><span className={`admin-status admin-status--${service.status.toLowerCase()}`}>{service.status}</span></td>
                  <td>
                    <div className="admin-inline-actions">
                      <button className="admin-icon-btn" title="Edit">Edit</button>
                      <button className="admin-icon-btn" title="Hide">Hide</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
