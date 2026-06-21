"use client";

import { LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: String(formData.get("username") ?? ""),
        password: String(formData.get("password") ?? "")
      })
    });
    const data = await response.json();

    setIsSubmitting(false);

    if (!response.ok) {
      setError(data.error ?? "Unable to sign in.");
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="admin-login">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <div className="admin-login-card__icon">
          <LockKeyhole aria-hidden="true" size={24} />
        </div>
        <p className="eyebrow">Admin Access</p>
        <h1>Sign in to Mignote</h1>
        <p>Use the server-side admin account. Credentials are never stored in browser storage.</p>
        <label>
          <span>Username</span>
          <input autoComplete="username" name="username" required type="text" />
        </label>
        <label>
          <span>Password</span>
          <input autoComplete="current-password" name="password" required type="password" />
        </label>
        {error && <p className="admin-alert" role="alert">{error}</p>}
        <button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </main>
  );
}
