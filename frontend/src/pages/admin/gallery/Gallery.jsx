import { useEffect, useMemo, useState } from "react";
import { api } from "../../../api/client";
import "../shared/AdminSection.css";
import "./Gallery.css";

const galleryItems = [
  { title: "Consultation Room", tag: "Clinic Interior", status: "Active", image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80" },
  { title: "Reception Desk", tag: "Front Office", status: "Active", image: "https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=600&q=80" },
  { title: "Diagnostic Suite", tag: "Equipment", status: "Pending", image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80" },
  { title: "Care Team", tag: "Staff", status: "Draft", image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=600&q=80" },
  { title: "Waiting Area", tag: "Patient Experience", status: "Active", image: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=600&q=80" },
  { title: "Health Camp", tag: "Community", status: "Pending", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80" },
];

export default function AdminGallery() {
  const [items, setItems] = useState(galleryItems);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const data = await api.get("/gallery");
        setItems(data.gallery || []);
        setError("");
      } catch (err) {
        setError(err.message || "Unable to load gallery.");
      }
    };

    loadGallery();
  }, []);

  const liveStats = useMemo(() => [
    { label: "Total Assets", value: items.length, note: "Images and clinic media" },
    { label: "Website Visible", value: items.filter((item) => item.status === "Active").length, note: "Published publicly" },
    { label: "Storage Used", value: "Live", note: "Remote image library" },
    { label: "Pending Review", value: items.filter((item) => item.status === "Pending").length, note: "Need approval" },
  ], [items]);

  return (
    <section className="admin-section admin-gallery">
      <header className="admin-section__header">
        <div>
          <p className="admin-section__eyebrow">Media Library</p>
          <h1 className="admin-section__title">Gallery Management</h1>
          <p className="admin-section__sub">
            Curate the images used across the website, approve new clinic photos, and keep public visuals trustworthy and professional.
          </p>
        </div>
        <div className="admin-section__actions">
          <button className="admin-btn admin-btn--ghost">Organize</button>
          <button className="admin-btn admin-btn--primary">Upload Media</button>
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

      <article className="admin-card admin-gallery__upload">
        <div>
          <h2 className="admin-panel-title">Upload Queue</h2>
          <p className="admin-panel-sub">Drop clinic photos here, then choose where they should appear.</p>
        </div>
        <div className="admin-gallery__dropzone">
          <div className="admin-gallery__drop-icon">+</div>
          <div>
            <strong>Add clinic images</strong>
            <p>Recommended size: 1600 x 1000px. Use clear, bright, real clinic photos.</p>
          </div>
          <button className="admin-btn admin-btn--ghost">Browse Files</button>
        </div>
      </article>

      <div className="admin-gallery__grid">
        {error && <p className="admin-panel-sub">{error}</p>}
        {items.map((item) => (
          <article className="admin-gallery__item" key={item.title}>
            <img src={item.image} alt={item.title} />
            <div className="admin-gallery__item-body">
              <div>
                <h3>{item.title}</h3>
                <p>{item.tag}</p>
              </div>
              <span className={`admin-status admin-status--${item.status.toLowerCase()}`}>{item.status}</span>
            </div>
            <div className="admin-gallery__item-actions">
              <button>Preview</button>
              <button>Edit</button>
              <button>Publish</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
