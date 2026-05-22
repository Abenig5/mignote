"use client";

import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock,
  Image as ImageIcon,
  Mail,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
  Users
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { BookingStatus } from "@/types/booking";

type AdminBooking = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  eventDate: string;
  guestCount: number;
  message: string | null;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
};

type ContentSummary = {
  menuCount: number;
  categoryCount: number;
  galleryCount: number;
  testimonialCount: number;
};

type AdminCategory = {
  id: string;
  title: string;
  slug: string;
};

type AdminMenuItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number | null;
  available: boolean;
  featured: boolean;
  category: AdminCategory;
};

type MenuFormState = {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  price: string;
  available: boolean;
  featured: boolean;
};

const statuses: BookingStatus[] = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
const emptyMenuForm: MenuFormState = {
  id: "",
  title: "",
  category: "",
  description: "",
  image: "",
  price: "",
  available: true,
  featured: false
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

function statusLabel(status: BookingStatus) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export function AdminDashboard() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [menuItems, setMenuItems] = useState<AdminMenuItem[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [menuForm, setMenuForm] = useState<MenuFormState>(emptyMenuForm);
  const [isMenuDatabaseConnected, setIsMenuDatabaseConnected] = useState(true);
  const [contentSummary, setContentSummary] = useState<ContentSummary>({
    menuCount: 0,
    categoryCount: 0,
    galleryCount: 0,
    testimonialCount: 0
  });
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "ALL">("ALL");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuLoading, setIsMenuLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuError, setMenuError] = useState("");
  const [menuMessage, setMenuMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadBookings() {
      try {
        const response = await fetch("/api/admin/bookings", { cache: "no-store" });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "Unable to load bookings");
        }

        if (isMounted) {
          setBookings(data.bookings);
          setError("");
        }
      } catch (caught) {
        if (isMounted) {
          setError(caught instanceof Error ? caught.message : "Unable to load bookings");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadBookings();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadMenuItems() {
      try {
        const response = await fetch("/api/admin/menu", { cache: "no-store" });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "Unable to load menu items");
        }

        if (isMounted) {
          setMenuItems(data.items);
          setCategories(data.categories);
          setIsMenuDatabaseConnected(data.databaseConnected !== false);
          setMenuError("");
          if (data.databaseConnected === false) {
            setMenuError(data.error);
          }
        }
      } catch (caught) {
        if (isMounted) {
          setMenuError(caught instanceof Error ? caught.message : "Unable to load menu items");
        }
      } finally {
        if (isMounted) {
          setIsMenuLoading(false);
        }
      }
    }

    loadMenuItems();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadContentSummary() {
      try {
        const response = await fetch("/api/admin/content", { cache: "no-store" });
        const data = await response.json();

        if (response.ok && isMounted) {
          setContentSummary(data.summary);
        }
      } catch {
        // The booking table remains usable even if content summary is unavailable.
      }
    }

    loadContentSummary();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredBookings = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesStatus = statusFilter === "ALL" || booking.status === statusFilter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        booking.name.toLowerCase().includes(normalizedQuery) ||
        booking.email.toLowerCase().includes(normalizedQuery) ||
        (booking.phone ?? "").toLowerCase().includes(normalizedQuery);

      return matchesStatus && matchesQuery;
    });
  }, [bookings, query, statusFilter]);

  const stats = useMemo(() => {
    const pending = bookings.filter((booking) => booking.status === "PENDING").length;
    const confirmed = bookings.filter((booking) => booking.status === "CONFIRMED").length;
    const totalGuests = bookings.reduce((total, booking) => total + booking.guestCount, 0);
    const revenueEstimate = confirmed * 1250;

    return { pending, confirmed, totalGuests, revenueEstimate };
  }, [bookings]);

  async function updateStatus(id: string, status: BookingStatus) {
    const previousBookings = bookings;
    setBookings((current) =>
      current.map((booking) => (booking.id === id ? { ...booking, status } : booking))
    );

    const response = await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      setBookings(previousBookings);
      setError("Unable to update booking status.");
    }
  }

  async function deleteBooking(id: string) {
    const previousBookings = bookings;
    setBookings((current) => current.filter((booking) => booking.id !== id));

    const response = await fetch(`/api/admin/bookings/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      setBookings(previousBookings);
      setError("Unable to delete booking.");
    }
  }

  function startEditingMenuItem(item: AdminMenuItem) {
    setMenuForm({
      id: item.id,
      title: item.title,
      category: item.category.title,
      description: item.description,
      image: item.image,
      price: item.price == null ? "" : String(item.price),
      available: item.available,
      featured: item.featured
    });
    setMenuMessage("");
    setMenuError("");
  }

  function resetMenuForm() {
    setMenuForm(emptyMenuForm);
    setMenuMessage("");
  }

  async function saveMenuItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMenuError("");
    setMenuMessage("");

    if (!isMenuDatabaseConnected) {
      setMenuError("Connect PostgreSQL and run the migration/seed before editing menu items.");
      return;
    }

    const payload = {
      title: menuForm.title,
      category: menuForm.category,
      description: menuForm.description,
      image: menuForm.image,
      price: menuForm.price,
      available: menuForm.available,
      featured: menuForm.featured
    };
    const isEditing = Boolean(menuForm.id);
    const response = await fetch(isEditing ? `/api/admin/menu/${menuForm.id}` : "/api/admin/menu", {
      method: isEditing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();

    if (!response.ok) {
      setMenuError(data.error ?? "Unable to save menu item.");
      return;
    }

    setMenuItems((current) =>
      isEditing
        ? current.map((item) => (item.id === data.item.id ? data.item : item))
        : [...current, data.item]
    );
    setCategories((current) => {
      const exists = current.some((category) => category.id === data.item.category.id);

      return exists ? current : [...current, data.item.category];
    });
    setContentSummary((current) => ({
      ...current,
      menuCount: isEditing ? current.menuCount : current.menuCount + 1
    }));
    setMenuForm(emptyMenuForm);
    setMenuMessage(isEditing ? "Menu item updated." : "Menu item added.");
  }

  async function deleteMenuItem(id: string) {
    if (!isMenuDatabaseConnected) {
      setMenuError("Connect PostgreSQL and run the migration/seed before deleting menu items.");
      return;
    }

    const previousItems = menuItems;
    setMenuItems((current) => current.filter((item) => item.id !== id));

    const response = await fetch(`/api/admin/menu/${id}`, { method: "DELETE" });

    if (!response.ok) {
      setMenuItems(previousItems);
      setMenuError("Unable to delete menu item.");
      return;
    }

    setContentSummary((current) => ({
      ...current,
      menuCount: Math.max(0, current.menuCount - 1)
    }));
  }

  return (
    <section className="admin-shell">
      <aside className="admin-sidebar">
        <div>
          <p className="admin-sidebar__label">Mignote</p>
          <h2>Admin</h2>
        </div>
        <nav aria-label="Admin sections">
          <a aria-current="page" href="#dashboard">
            <BarChart3 aria-hidden="true" size={18} />
            Dashboard
          </a>
          <a href="#bookings">
            <CalendarDays aria-hidden="true" size={18} />
            Bookings
          </a>
          <a href="#menu-control">
            <ImageIcon aria-hidden="true" size={18} />
            Menu Page
          </a>
          <a href="#analytics">
            <Users aria-hidden="true" size={18} />
            Analytics
          </a>
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-header" id="dashboard">
          <div>
            <p className="eyebrow">Admin Panel</p>
            <h1>Booking Dashboard</h1>
            <p>Track customer inquiries, manage booking statuses, and monitor activity.</p>
          </div>
        </header>

        <div className="admin-stat-grid" aria-label="Dashboard metrics">
          <article className="admin-stat-card">
            <CalendarDays aria-hidden="true" size={22} />
            <span>Total Bookings</span>
            <strong>{bookings.length}</strong>
          </article>
          <article className="admin-stat-card">
            <Clock aria-hidden="true" size={22} />
            <span>Pending Requests</span>
            <strong>{stats.pending}</strong>
          </article>
          <article className="admin-stat-card">
            <CheckCircle2 aria-hidden="true" size={22} />
            <span>Confirmed</span>
            <strong>{stats.confirmed}</strong>
          </article>
          <article className="admin-stat-card">
            <Users aria-hidden="true" size={22} />
            <span>Total Guests</span>
            <strong>{stats.totalGuests}</strong>
          </article>
        </div>

        <section className="admin-panel" id="bookings">
          <div className="admin-panel__header">
            <div>
              <h2>Booking Management</h2>
              <p>Accept, complete, cancel, filter, and remove booking requests.</p>
            </div>
            <div className="admin-estimate">
              <span>Revenue Estimate</span>
              <strong>${stats.revenueEstimate.toLocaleString()}</strong>
            </div>
          </div>

          <div className="admin-toolbar">
            <label className="admin-search">
              <Search aria-hidden="true" size={18} />
              <input
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search customer, email, phone"
                type="search"
                value={query}
              />
            </label>
            <select
              aria-label="Filter bookings by status"
              onChange={(event) => setStatusFilter(event.target.value as BookingStatus | "ALL")}
              value={statusFilter}
            >
              <option value="ALL">All statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {statusLabel(status)}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="admin-alert" role="alert">{error}</p>}
          {isLoading && <p className="admin-empty">Loading bookings...</p>}
          {!isLoading && filteredBookings.length === 0 && (
            <p className="admin-empty">No bookings match the current filters.</p>
          )}

          {filteredBookings.length > 0 && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Event Date</th>
                    <th>Guests</th>
                    <th>Status</th>
                    <th>Contact</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>
                        <strong>{booking.name}</strong>
                        <span>{booking.message || "No additional notes"}</span>
                      </td>
                      <td>{formatDate(booking.eventDate)}</td>
                      <td>{booking.guestCount}</td>
                      <td>
                        <select
                          className={`admin-status admin-status--${booking.status.toLowerCase()}`}
                          onChange={(event) =>
                            updateStatus(booking.id, event.target.value as BookingStatus)
                          }
                          value={booking.status}
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {statusLabel(status)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <a className="admin-contact" href={`mailto:${booking.email}`}>
                          <Mail aria-hidden="true" size={16} />
                          {booking.email}
                        </a>
                        {booking.phone && <span>{booking.phone}</span>}
                      </td>
                      <td>
                        <button
                          aria-label={`Delete booking for ${booking.name}`}
                          className="admin-delete"
                          onClick={() => deleteBooking(booking.id)}
                          type="button"
                        >
                          <Trash2 aria-hidden="true" size={17} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="admin-panel admin-content-panel">
          <div className="admin-panel__header">
            <div>
              <h2>Website Content</h2>
              <p>Database-backed records used by the public catering website.</p>
            </div>
          </div>
          <div className="admin-content-grid">
            <article>
              <span>Menu Items</span>
              <strong>{contentSummary.menuCount}</strong>
            </article>
            <article>
              <span>Categories</span>
              <strong>{contentSummary.categoryCount}</strong>
            </article>
            <article>
              <span>Gallery Images</span>
              <strong>{contentSummary.galleryCount}</strong>
            </article>
            <article>
              <span>Testimonials</span>
              <strong>{contentSummary.testimonialCount}</strong>
            </article>
          </div>
        </section>

        <section className="admin-panel admin-menu-panel" id="menu-control">
          <div className="admin-panel__header">
            <div>
              <h2>Menu Page Control</h2>
              <p>Add, edit, hide, feature, and update photos/descriptions shown on the menu page.</p>
            </div>
          </div>

          <div className="admin-menu-layout">
            <form className="admin-menu-form" onSubmit={saveMenuItem}>
              <h3>{menuForm.id ? "Edit menu item" : "Add menu item"}</h3>
              <label>
                <span>Title</span>
                <input
                  disabled={!isMenuDatabaseConnected}
                  onChange={(event) => setMenuForm((current) => ({ ...current, title: event.target.value }))}
                  placeholder="Signature Buffet"
                  required
                  value={menuForm.title}
                />
              </label>
              <label>
                <span>Category</span>
                <input
                  disabled={!isMenuDatabaseConnected}
                  list="admin-menu-categories"
                  onChange={(event) => setMenuForm((current) => ({ ...current, category: event.target.value }))}
                  placeholder="Buffet"
                  required
                  value={menuForm.category}
                />
                <datalist id="admin-menu-categories">
                  {categories.map((category) => (
                    <option key={category.id} value={category.title} />
                  ))}
                </datalist>
              </label>
              <label>
                <span>Photo URL</span>
                <input
                  disabled={!isMenuDatabaseConnected}
                  onChange={(event) => setMenuForm((current) => ({ ...current, image: event.target.value }))}
                  placeholder="https://images.unsplash.com/..."
                  required
                  type="url"
                  value={menuForm.image}
                />
              </label>
              <label>
                <span>Description</span>
                <textarea
                  disabled={!isMenuDatabaseConnected}
                  onChange={(event) =>
                    setMenuForm((current) => ({ ...current, description: event.target.value }))
                  }
                  placeholder="Describe the menu item shown to customers."
                  required
                  rows={5}
                  value={menuForm.description}
                />
              </label>
              <label>
                <span>Price estimate</span>
                <input
                  disabled={!isMenuDatabaseConnected}
                  min="0"
                  onChange={(event) => setMenuForm((current) => ({ ...current, price: event.target.value }))}
                  placeholder="Optional"
                  step="0.01"
                  type="number"
                  value={menuForm.price}
                />
              </label>
              <div className="admin-menu-toggles">
                <label>
                  <input
                    checked={menuForm.available}
                    disabled={!isMenuDatabaseConnected}
                    onChange={(event) =>
                      setMenuForm((current) => ({ ...current, available: event.target.checked }))
                    }
                    type="checkbox"
                  />
                  Show on menu page
                </label>
                <label>
                  <input
                    checked={menuForm.featured}
                    disabled={!isMenuDatabaseConnected}
                    onChange={(event) =>
                      setMenuForm((current) => ({ ...current, featured: event.target.checked }))
                    }
                    type="checkbox"
                  />
                  Feature on landing page
                </label>
              </div>
              <div className="admin-menu-actions">
                <button className="admin-save" disabled={!isMenuDatabaseConnected} type="submit">
                  {menuForm.id ? <Save aria-hidden="true" size={17} /> : <Plus aria-hidden="true" size={17} />}
                  {menuForm.id ? "Save Changes" : "Add Item"}
                </button>
                {menuForm.id && (
                  <button className="admin-cancel" onClick={resetMenuForm} type="button">
                    Cancel
                  </button>
                )}
              </div>
              {menuError && <p className="admin-alert" role="alert">{menuError}</p>}
              {menuMessage && <p className="admin-success" role="status">{menuMessage}</p>}
            </form>

            <div className="admin-menu-list">
              <div className="admin-menu-list__header">
                <h3>Current menu page items</h3>
                <span>{isMenuLoading ? "Loading..." : `${menuItems.length} items`}</span>
              </div>
              {!isMenuLoading && menuItems.length === 0 && (
                <p className="admin-empty">No menu items found. Add the first item above.</p>
              )}
              <div className="admin-menu-items">
                {menuItems.map((item) => (
                  <article className="admin-menu-item" key={item.id}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- Admin-entered image URLs can come from arbitrary hosts. */}
                    <img alt="" src={item.image} />
                    <div>
                      <div className="admin-menu-item__heading">
                        <h4>{item.title}</h4>
                        <span>{item.category.title}</span>
                      </div>
                      <p>{item.description}</p>
                      <div className="admin-menu-item__meta">
                        <span>{item.available ? "Visible" : "Hidden"}</span>
                        {item.featured && <span>Featured</span>}
                        {item.price != null && <span>${item.price.toLocaleString()}</span>}
                      </div>
                    </div>
                    <div className="admin-menu-item__actions">
                      <button onClick={() => startEditingMenuItem(item)} type="button">
                        <Pencil aria-hidden="true" size={16} />
                        Edit
                      </button>
                      <button disabled={!isMenuDatabaseConnected} onClick={() => deleteMenuItem(item.id)} type="button">
                        <Trash2 aria-hidden="true" size={16} />
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
