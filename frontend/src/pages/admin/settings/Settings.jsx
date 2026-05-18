import { useEffect, useState } from "react";
import { api } from "../../../api/client";
import "../shared/AdminSection.css";
import "./Settings.css";

const settingsStats = [
  { label: "Profile", value: "100%", note: "Clinic details complete" },
  { label: "Security", value: "High", note: "2FA recommended" },
  { label: "Notifications", value: "8", note: "Active alert rules" },
  { label: "Integrations", value: "3", note: "Connected systems" },
];

const notificationRules = [
  { label: "New appointment request", enabled: true },
  { label: "Patient review submitted", enabled: true },
  { label: "Daily clinic summary", enabled: true },
  { label: "Gallery asset approved", enabled: false },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    clinicName: "Dr. Hammad Medical Practice",
    adminEmail: "admin@gmail.com",
    openingTime: "04:00 PM",
    closingTime: "08:00 PM",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await api.get("/settings");
        setSettings((prev) => ({ ...prev, ...(data.settings || {}) }));
      } catch (err) {
        setMessage(err.message || "Unable to load settings.");
      }
    };

    loadSettings();
  }, []);

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      const data = await api.put("/settings", settings);
      setSettings((prev) => ({ ...prev, ...(data.settings || {}) }));
      setMessage("Settings saved successfully.");
    } catch (err) {
      setMessage(err.message || "Unable to save settings.");
    }
  };

  return (
    <section className="admin-section admin-settings">
      <header className="admin-section__header">
        <div>
          <p className="admin-section__eyebrow">Portal Control</p>
          <h1 className="admin-section__title">Admin Settings</h1>
          <p className="admin-section__sub">
            Manage clinic profile details, booking rules, notifications, and security preferences for the admin portal.
          </p>
        </div>
        <div className="admin-section__actions">
          <button className="admin-btn admin-btn--ghost" onClick={() => setMessage("")}>Reset Changes</button>
          <button className="admin-btn admin-btn--primary" onClick={handleSave}>Save Settings</button>
        </div>
      </header>

      <div className="admin-grid admin-grid--4">
        {settingsStats.map((item) => (
          <article className="admin-card" key={item.label}>
            <p className="admin-card__label">{item.label}</p>
            <p className="admin-card__value">{item.value}</p>
            <p className="admin-card__note">{item.note}</p>
          </article>
        ))}
      </div>

      <div className="admin-grid admin-grid--2">
        <article className="admin-card admin-settings__panel">
          <h2 className="admin-panel-title">Clinic Profile</h2>
          <p className="admin-panel-sub">These details can appear on public pages and appointment confirmations.</p>
          <div className="admin-settings__form">
            <div className="admin-field">
              <label>Clinic Name</label>
              <input className="admin-input" value={settings.clinicName} onChange={(e) => handleChange("clinicName", e.target.value)} />
            </div>
            <div className="admin-field">
              <label>Admin Email</label>
              <input className="admin-input" value={settings.adminEmail} onChange={(e) => handleChange("adminEmail", e.target.value)} />
            </div>
            <div className="admin-settings__form-row">
              <div className="admin-field">
                <label>Opening Time</label>
                <input className="admin-input" value={settings.openingTime} onChange={(e) => handleChange("openingTime", e.target.value)} />
              </div>
              <div className="admin-field">
                <label>Closing Time</label>
                <input className="admin-input" value={settings.closingTime} onChange={(e) => handleChange("closingTime", e.target.value)} />
              </div>
            </div>
          </div>
        </article>

        <article className="admin-card admin-settings__panel">
          <h2 className="admin-panel-title">Appointment Rules</h2>
          <p className="admin-panel-sub">Control patient booking behavior from the public appointment page.</p>
          <div className="admin-settings__rules">
            <div className="admin-settings__rule">
              <span>Appointment duration</span>
              <strong>10 minutes</strong>
            </div>
            <div className="admin-settings__rule">
              <span>Booking days</span>
              <strong>Mon - Fri</strong>
            </div>
            <div className="admin-settings__rule">
              <span>Advance booking</span>
              <strong>30 days</strong>
            </div>
            <div className="admin-settings__rule">
              <span>Auto confirmation</span>
              <strong>Enabled</strong>
            </div>
          </div>
        </article>
      </div>

      <div className="admin-grid admin-grid--2">
        {message && <p className="admin-panel-sub">{message}</p>}
        <article className="admin-card admin-settings__panel">
          <h2 className="admin-panel-title">Notification Rules</h2>
          <p className="admin-panel-sub">Choose which admin events should send an alert.</p>
          <div className="admin-settings__toggles">
            {notificationRules.map((rule) => (
              <label className="admin-settings__toggle" key={rule.label}>
                <span>{rule.label}</span>
                <input type="checkbox" defaultChecked={rule.enabled} />
              </label>
            ))}
          </div>
        </article>

        <article className="admin-card admin-settings__panel admin-settings__security">
          <h2 className="admin-panel-title">Security</h2>
          <p className="admin-panel-sub">Keep admin-only controls protected.</p>
          <div className="admin-settings__security-box">
            <div>
              <strong>Password last changed</strong>
              <p>18 days ago</p>
            </div>
            <button className="admin-btn admin-btn--ghost">Change Password</button>
          </div>
          <div className="admin-settings__security-box">
            <div>
              <strong>Two-factor authentication</strong>
              <p>Recommended for admin accounts</p>
            </div>
            <button className="admin-btn admin-btn--primary">Enable 2FA</button>
          </div>
        </article>
      </div>
    </section>
  );
}
