"use client";

import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock,
  Image as ImageIcon,
  LogOut,
  Mail,
  Pencil,
  Plus,
  Save,
  Search,
  Settings,
  Trash2,
  Upload,
  Users,
  X
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type React from "react";
import type { BookingStatus } from "@/types/booking";

type AdminView = "dashboard" | "bookings" | "menu" | "content" | "account";

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
const emptySummary: ContentSummary = {
  menuCount: 0,
  categoryCount: 0,
  galleryCount: 0,
  testimonialCount: 0
};
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
const dishCategories = ["Ethiopian Dishes", "Eritrean Dishes", "European Cuisines"] as const;
const cuisineOverviewNames = new Set(dishCategories);
const adminNav = [
  { href: "/admin", label: "Dashboard", icon: BarChart3, view: "dashboard" },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarDays, view: "bookings" },
  { href: "/admin/menu", label: "Menu Page", icon: ImageIcon, view: "menu" },
  { href: "/admin/content", label: "Content", icon: Users, view: "content" },
  { href: "/admin/account", label: "Account", icon: Settings, view: "account" }
] satisfies Array<{ href: string; label: string; icon: typeof BarChart3; view: AdminView }>;

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

function imageSourceLabel(image: string) {
  return image.startsWith("data:") ? "Uploaded image" : "Image URL";
}

async function readImageFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Unable to read image file."));
      }
    });
    reader.addEventListener("error", () => reject(new Error("Unable to read image file.")));
    reader.readAsDataURL(file);
  });
}

function AdminShell({ children, view }: { children: React.ReactNode; view: AdminView }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <section className="admin-shell">
      <aside className="admin-sidebar">
        <div>
          <p className="admin-sidebar__label">Mignote</p>
          <h2>Admin</h2>
        </div>
        <nav aria-label="Admin sections">
          {adminNav.map((item) => {
            const Icon = item.icon;

            return (
              <Link aria-current={view === item.view ? "page" : undefined} href={item.href} key={item.href}>
                <Icon aria-hidden="true" size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button className="admin-logout" onClick={logout} type="button">
          <LogOut aria-hidden="true" size={18} />
          Log Out
        </button>
      </aside>

      <div className="admin-main">
        <nav aria-label="Admin sections" className="admin-mobile-nav">
          {adminNav.map((item) => (
            <Link aria-current={view === item.view ? "page" : undefined} href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
          <button onClick={logout} type="button">
            Log Out
          </button>
        </nav>
        {children}
      </div>
    </section>
  );
}

function useBookings() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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

  return { bookings, error, isLoading, setBookings, setError };
}

function useContentSummary() {
  const [contentSummary, setContentSummary] = useState<ContentSummary>(emptySummary);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadContentSummary() {
      try {
        const response = await fetch("/api/admin/content", { cache: "no-store" });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "Unable to load content summary");
        }

        if (isMounted) {
          setContentSummary(data.summary);
          setError("");
        }
      } catch (caught) {
        if (isMounted) {
          setError(caught instanceof Error ? caught.message : "Unable to load content summary");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadContentSummary();

    return () => {
      isMounted = false;
    };
  }, []);

  return { contentSummary, error, isLoading };
}

function useMenuItems() {
  const [menuItems, setMenuItems] = useState<AdminMenuItem[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [isDatabaseConnected, setIsDatabaseConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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
          setIsDatabaseConnected(data.databaseConnected !== false);
          setError(data.databaseConnected === false ? data.error : "");
        }
      } catch (caught) {
        if (isMounted) {
          setError(caught instanceof Error ? caught.message : "Unable to load menu items");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadMenuItems();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    categories,
    error,
    isDatabaseConnected,
    isLoading,
    menuItems,
    setCategories,
    setError,
    setMenuItems
  };
}

type MenuItemFormProps = {
  form: MenuFormState;
  isDatabaseConnected: boolean;
  onCancel?: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  setError: (value: string) => void;
  setForm: React.Dispatch<React.SetStateAction<MenuFormState>>;
  submitLabel: string;
  title: string;
};

function MenuItemForm({
  form,
  isDatabaseConnected,
  onCancel,
  onSubmit,
  setError,
  setForm,
  submitLabel,
  title
}: MenuItemFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function uploadImage(file: File | undefined) {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Choose an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Choose an image under 2 MB.");
      return;
    }

    try {
      const image = await readImageFile(file);
      setForm((current) => ({ ...current, image }));
      setError("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to upload image.");
    }
  }

  function removeImage() {
    setForm((current) => ({ ...current, image: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <form className="admin-menu-form" onSubmit={onSubmit}>
      <h3>{title}</h3>
      <label>
        <span>Title</span>
        <input
          disabled={!isDatabaseConnected}
          onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
          placeholder="Doro Wot"
          required
          value={form.title}
        />
      </label>
      <label>
        <span>Dish type</span>
        <select
          disabled={!isDatabaseConnected}
          onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
          required
          value={form.category}
        >
          <option value="">Choose where to add this item</option>
          {dishCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <div className="admin-image-field">
        <label>
          <span>Image URL or uploaded picture</span>
          <input
            disabled={!isDatabaseConnected}
            onChange={(event) => setForm((current) => ({ ...current, image: event.target.value }))}
            placeholder="https://images.unsplash.com/... or upload below"
            required
            value={form.image}
          />
        </label>
        <input
          accept="image/*"
          className="admin-file-input"
          disabled={!isDatabaseConnected}
          onChange={(event) => uploadImage(event.target.files?.[0])}
          ref={fileInputRef}
          type="file"
        />
        <div className="admin-image-actions">
          <button
            className="admin-upload"
            disabled={!isDatabaseConnected}
            onClick={() => fileInputRef.current?.click()}
            type="button"
          >
            <Upload aria-hidden="true" size={16} />
            Upload Image
          </button>
          {form.image && (
            <button className="admin-cancel" onClick={removeImage} type="button">
              <X aria-hidden="true" size={16} />
              Remove Image
            </button>
          )}
        </div>
        {form.image ? (
          <div className="admin-image-preview">
            {/* eslint-disable-next-line @next/next/no-img-element -- Preview supports uploaded data URLs and arbitrary admin URLs. */}
            <img alt="Selected menu item preview" src={form.image} />
            <span>{imageSourceLabel(form.image)}</span>
          </div>
        ) : (
          <p className="admin-image-empty">No image selected yet.</p>
        )}
      </div>

      <label>
        <span>Description</span>
        <textarea
          disabled={!isDatabaseConnected}
          onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
          placeholder="Describe the menu item shown to customers."
          required
          rows={5}
          value={form.description}
        />
      </label>
      <label>
        <span>Price estimate</span>
        <input
          disabled={!isDatabaseConnected}
          min="0"
          onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
          placeholder="Optional"
          step="0.01"
          type="number"
          value={form.price}
        />
      </label>
      <div className="admin-menu-toggles">
        <label>
          <input
            checked={form.available}
            disabled={!isDatabaseConnected}
            onChange={(event) => setForm((current) => ({ ...current, available: event.target.checked }))}
            type="checkbox"
          />
          Show on menu page
        </label>
        <label>
          <input
            checked={form.featured}
            disabled={!isDatabaseConnected}
            onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))}
            type="checkbox"
          />
          Feature on landing page
        </label>
      </div>
      <div className="admin-menu-actions">
        <button className="admin-save" disabled={!isDatabaseConnected} type="submit">
          {submitLabel === "Save Changes" ? (
            <Save aria-hidden="true" size={17} />
          ) : (
            <Plus aria-hidden="true" size={17} />
          )}
          {submitLabel}
        </button>
        {onCancel && (
          <button className="admin-cancel" onClick={onCancel} type="button">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function DashboardScreen() {
  const { bookings, error: bookingsError, isLoading: bookingsLoading } = useBookings();
  const { contentSummary, error: contentError } = useContentSummary();
  const stats = useMemo(() => {
    const pending = bookings.filter((booking) => booking.status === "PENDING").length;
    const confirmed = bookings.filter((booking) => booking.status === "CONFIRMED").length;
    const totalGuests = bookings.reduce((total, booking) => total + booking.guestCount, 0);
    const revenueEstimate = confirmed * 1250;

    return { pending, confirmed, totalGuests, revenueEstimate };
  }, [bookings]);

  return (
    <div className="admin-screen-stack">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Admin Panel</p>
          <h1>Dashboard</h1>
          <p>Review booking activity and content totals before jumping into a focused screen.</p>
        </div>
      </header>

      {bookingsError && <p className="admin-alert" role="alert">{bookingsError}</p>}
      {contentError && <p className="admin-alert" role="alert">{contentError}</p>}

      <div className="admin-stat-grid" aria-label="Dashboard metrics">
        <article className="admin-stat-card">
          <CalendarDays aria-hidden="true" size={22} />
          <span>Total Bookings</span>
          <strong>{bookingsLoading ? "..." : bookings.length}</strong>
        </article>
        <article className="admin-stat-card">
          <Clock aria-hidden="true" size={22} />
          <span>Pending Requests</span>
          <strong>{bookingsLoading ? "..." : stats.pending}</strong>
        </article>
        <article className="admin-stat-card">
          <CheckCircle2 aria-hidden="true" size={22} />
          <span>Confirmed</span>
          <strong>{bookingsLoading ? "..." : stats.confirmed}</strong>
        </article>
        <article className="admin-stat-card">
          <Users aria-hidden="true" size={22} />
          <span>Total Guests</span>
          <strong>{bookingsLoading ? "..." : stats.totalGuests}</strong>
        </article>
      </div>

      <section className="admin-panel">
        <div className="admin-panel__header">
          <div>
            <h2>Quick Summary</h2>
            <p>Database-backed records used by the public catering website.</p>
          </div>
          <div className="admin-estimate">
            <span>Revenue Estimate</span>
            <strong>${stats.revenueEstimate.toLocaleString()}</strong>
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
    </div>
  );
}

function BookingsScreen() {
  const { bookings, error, isLoading, setBookings, setError } = useBookings();
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "ALL">("ALL");
  const [query, setQuery] = useState("");
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
  const confirmed = bookings.filter((booking) => booking.status === "CONFIRMED").length;

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

  return (
    <div className="admin-screen-stack">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Admin Panel</p>
          <h1>Bookings</h1>
          <p>Accept, complete, cancel, filter, and remove customer booking requests.</p>
        </div>
      </header>

      <section className="admin-panel">
        <div className="admin-panel__header">
          <div>
            <h2>Booking Management</h2>
            <p>Search by customer details and update request status without leaving this screen.</p>
          </div>
          <div className="admin-estimate">
            <span>Revenue Estimate</span>
            <strong>${(confirmed * 1250).toLocaleString()}</strong>
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
    </div>
  );
}

function MenuScreen() {
  const {
    error,
    isDatabaseConnected,
    isLoading,
    menuItems,
    setCategories,
    setError,
    setMenuItems
  } = useMenuItems();
  const [addForm, setAddForm] = useState<MenuFormState>(emptyMenuForm);
  const [editForm, setEditForm] = useState<MenuFormState>(emptyMenuForm);
  const [editingItemId, setEditingItemId] = useState("");
  const [message, setMessage] = useState("");
  const dishMenuItems = useMemo(
    () =>
      menuItems.filter(
        (item) => dishCategories.includes(item.category.title as (typeof dishCategories)[number]) &&
          !cuisineOverviewNames.has(item.title as (typeof dishCategories)[number])
      ),
    [menuItems]
  );
  const groupedMenuItems = useMemo(
    () =>
      dishCategories.map((category) => ({
        category,
        items: dishMenuItems.filter((item) => item.category.title === category)
      })),
    [dishMenuItems]
  );

  function startEditingMenuItem(item: AdminMenuItem) {
    setEditingItemId(item.id);
    setEditForm({
      id: item.id,
      title: item.title,
      category: item.category.title,
      description: item.description,
      image: item.image,
      price: item.price == null ? "" : String(item.price),
      available: item.available,
      featured: item.featured
    });
    setMessage("");
    setError("");
  }

  function resetAddForm() {
    setAddForm(emptyMenuForm);
    setMessage("");
    setError("");
  }

  function resetEditForm() {
    setEditForm(emptyMenuForm);
    setEditingItemId("");
    setMessage("");
    setError("");
  }

  async function saveMenuItem(event: React.FormEvent<HTMLFormElement>, form: MenuFormState) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!isDatabaseConnected) {
      setError("Connect PostgreSQL and run the migration/seed before editing menu items.");
      return;
    }

    const payload = {
      title: form.title,
      category: form.category,
      description: form.description,
      image: form.image,
      price: form.price,
      available: form.available,
      featured: form.featured
    };
    const isEditing = Boolean(form.id);
    const response = await fetch(isEditing ? `/api/admin/menu/${form.id}` : "/api/admin/menu", {
      method: isEditing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Unable to save menu item.");
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
    if (isEditing) {
      resetEditForm();
    } else {
      resetAddForm();
    }
    setMessage(isEditing ? "Menu item updated." : "Menu item added.");
  }

  async function deleteMenuItem(id: string) {
    if (!isDatabaseConnected) {
      setError("Connect PostgreSQL and run the migration/seed before deleting menu items.");
      return;
    }

    const previousItems = menuItems;
    setMenuItems((current) => current.filter((item) => item.id !== id));

    const response = await fetch(`/api/admin/menu/${id}`, { method: "DELETE" });

    if (!response.ok) {
      setMenuItems(previousItems);
      setError("Unable to delete menu item.");
      return;
    }

    if (editingItemId === id) {
      resetEditForm();
    }
  }

  return (
    <div className="admin-screen-stack">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Admin Panel</p>
          <h1>Menu Page</h1>
          <p>Add, edit, hide, feature, upload images, and update menu items shown publicly.</p>
        </div>
      </header>

      <section className="admin-panel">
        <div className="admin-panel__header">
          <div>
            <h2>Menu Page Control</h2>
            <p>Use either an image URL or upload a local image. Preview changes before saving.</p>
          </div>
        </div>

        <div className="admin-menu-layout">
          <div className="admin-menu-add-panel">
            <MenuItemForm
              form={addForm}
              isDatabaseConnected={isDatabaseConnected}
              onSubmit={(event) => saveMenuItem(event, addForm)}
              setError={setError}
              setForm={setAddForm}
              submitLabel="Add Item"
              title="Add menu item"
            />
            {error && !editingItemId && <p className="admin-alert" role="alert">{error}</p>}
            {message && !editingItemId && <p className="admin-success" role="status">{message}</p>}
          </div>
          <div className="admin-menu-list">
            <div className="admin-menu-list__header">
              <h3>Current menu page items</h3>
              <span>{isLoading ? "Loading..." : `${dishMenuItems.length} items`}</span>
            </div>
            {!isLoading && dishMenuItems.length === 0 && (
              <p className="admin-empty">No menu items found. Add the first item above.</p>
            )}
            <div className="admin-menu-items">
              {groupedMenuItems.map((group) => (
                <section className="admin-menu-group" key={group.category}>
                  <div className="admin-menu-group__header">
                    <h4>{group.category}</h4>
                    <span>{group.items.length} items</span>
                  </div>
                  {group.items.length === 0 ? (
                    <p className="admin-menu-group__empty">No items in this dish type yet.</p>
                  ) : (
                    group.items.map((item) => (
                      <div className="admin-menu-item-wrap" key={item.id}>
                        <article className="admin-menu-item">
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
                              <span>{imageSourceLabel(item.image)}</span>
                            </div>
                          </div>
                          <div className="admin-menu-item__actions">
                            <button onClick={() => startEditingMenuItem(item)} type="button">
                              <Pencil aria-hidden="true" size={16} />
                              Edit
                            </button>
                            <button disabled={!isDatabaseConnected} onClick={() => deleteMenuItem(item.id)} type="button">
                              <Trash2 aria-hidden="true" size={16} />
                              Delete
                            </button>
                          </div>
                        </article>
                        {editingItemId === item.id && (
                          <div className="admin-menu-inline-edit">
                            <MenuItemForm
                              form={editForm}
                              isDatabaseConnected={isDatabaseConnected}
                              onCancel={resetEditForm}
                              onSubmit={(event) => saveMenuItem(event, editForm)}
                              setError={setError}
                              setForm={setEditForm}
                              submitLabel="Save Changes"
                              title={`Edit ${item.title}`}
                            />
                            {error && <p className="admin-alert" role="alert">{error}</p>}
                            {message && <p className="admin-success" role="status">{message}</p>}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ContentScreen() {
  const { contentSummary, error, isLoading } = useContentSummary();

  return (
    <div className="admin-screen-stack">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Admin Panel</p>
          <h1>Content</h1>
          <p>Review the database-backed records that power the public website.</p>
        </div>
      </header>

      <section className="admin-panel">
        <div className="admin-panel__header">
          <div>
            <h2>Website Content</h2>
            <p>Use this screen as the content overview before editing specific content areas.</p>
          </div>
        </div>
        {error && <p className="admin-alert" role="alert">{error}</p>}
        {isLoading && <p className="admin-empty">Loading content summary...</p>}
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
    </div>
  );
}

function AccountScreen() {
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadAccount() {
      try {
        const response = await fetch("/api/admin/account", { cache: "no-store" });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "Unable to load account settings.");
        }

        if (isMounted) {
          setUsername(data.username);
          setError("");
        }
      } catch (caught) {
        if (isMounted) {
          setError(caught instanceof Error ? caught.message : "Unable to load account settings.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadAccount();

    return () => {
      isMounted = false;
    };
  }, []);

  async function saveAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (newPassword && newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    setIsSaving(true);

    const response = await fetch("/api/admin/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword,
        newPassword,
        username
      })
    });
    const data = await response.json();

    setIsSaving(false);

    if (!response.ok) {
      setError(data.error ?? "Unable to update account.");
      return;
    }

    setUsername(data.username);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage("Account settings updated.");
  }

  return (
    <div className="admin-screen-stack">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Admin Panel</p>
          <h1>Account</h1>
          <p>Change the admin username or password. The current password is required.</p>
        </div>
      </header>

      <section className="admin-panel">
        <div className="admin-panel__header">
          <div>
            <h2>Account Settings</h2>
            <p>Credentials are stored server-side as a password hash and the browser only receives an HTTP-only session cookie.</p>
          </div>
        </div>
        <form className="admin-account-form" onSubmit={saveAccount}>
          <label>
            <span>Username</span>
            <input
              disabled={isLoading || isSaving}
              minLength={3}
              onChange={(event) => setUsername(event.target.value)}
              required
              type="text"
              value={username}
            />
          </label>
          <label>
            <span>Current Password</span>
            <input
              autoComplete="current-password"
              disabled={isLoading || isSaving}
              onChange={(event) => setCurrentPassword(event.target.value)}
              required
              type="password"
              value={currentPassword}
            />
          </label>
          <label>
            <span>New Password</span>
            <input
              autoComplete="new-password"
              disabled={isLoading || isSaving}
              minLength={8}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="Leave blank to keep current password"
              type="password"
              value={newPassword}
            />
          </label>
          <label>
            <span>Confirm New Password</span>
            <input
              autoComplete="new-password"
              disabled={isLoading || isSaving}
              minLength={8}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Repeat new password"
              type="password"
              value={confirmPassword}
            />
          </label>
          {error && <p className="admin-alert" role="alert">{error}</p>}
          {message && <p className="admin-success" role="status">{message}</p>}
          <button className="admin-save" disabled={isLoading || isSaving} type="submit">
            <Save aria-hidden="true" size={17} />
            {isSaving ? "Saving..." : "Save Account"}
          </button>
        </form>
      </section>
    </div>
  );
}

export function AdminDashboard({ view = "dashboard" }: { view?: AdminView }) {
  return (
    <AdminShell view={view}>
      {view === "dashboard" && <DashboardScreen />}
      {view === "bookings" && <BookingsScreen />}
      {view === "menu" && <MenuScreen />}
      {view === "content" && <ContentScreen />}
      {view === "account" && <AccountScreen />}
    </AdminShell>
  );
}
