"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setError(data.error || "Could not sign in.");
    router.refresh();
  }

  return (
    <section className="login">
      <form className="apply-card narrow form" onSubmit={onSubmit}>
        <img src="/img/logo-square.webp" alt="" className="login-logo" />
        <h1 className="card-title">Admin sign in</h1>
        <div className="field">
          <label htmlFor="pw">Password</label>
          <input id="pw" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus />
        </div>
        {error && <p className="form-error">{error}</p>}
        <button className="btn wide" disabled={busy || !password}>{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    </section>
  );
}
