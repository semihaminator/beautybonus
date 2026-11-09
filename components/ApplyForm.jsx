"use client";

import { useEffect, useRef, useState } from "react";
import { uploadPresigned } from "@vercel/blob/client";
import { UploadIcon } from "./Icons";
import { fmt } from "@/lib/i18n";

const MAX_MB = 10;

export default function ApplyForm({ months, t, locale }) {
  const [values, setValues] = useState({ appId: "", startMonth: "", email: "", phone: "", website: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  // Errors are stored as keys so they re-translate when the language changes.
  const [errors, setErrors] = useState({});
  const [state, setState] = useState("idle"); // idle | uploading | saving | done
  const [message, setMessage] = useState(""); // key in t.errors
  const [reference, setReference] = useState("");
  const [agree, setAgree] = useState(false);
  const fileInput = useRef(null);

  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  const errText = (key) => (key ? fmt(t.errors[key] || t.errors.generic, { mb: MAX_MB }) : null);

  const set = (k) => (e) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  function pickFile(f) {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setErrors((er) => ({ ...er, photo: "photoType" }));
      return;
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      setErrors((er) => ({ ...er, photo: "photoSize" }));
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setErrors((er) => ({ ...er, photo: undefined }));
  }

  function validate() {
    const e = {};
    if (!/^[A-Za-z0-9._-]{2,40}$/.test(values.appId.trim())) e.appId = "appId";
    if (!file) e.photo = "photo";
    if (!values.startMonth) e.startMonth = "startMonth";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) e.email = "email";
    if (!/^\+?[0-9 ()-]{7,22}$/.test(values.phone.trim())) e.phone = "phone";
    if (!agree) e.agree = "agree";
    return e;
  }

  async function onSubmit(ev) {
    ev.preventDefault();
    setMessage("");
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    try {
      setState("uploading");
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
      const safeId = values.appId.trim().replace(/[^A-Za-z0-9_-]/g, "");
      const pathname = `applications/${safeId || "id"}-${crypto.randomUUID()}.${ext || "jpg"}`;
      const send = (access) =>
        uploadPresigned(pathname, file, { access, handleUploadUrl: "/api/upload", contentType: file.type });
      // The Blob store can be public or private; try public first, then private.
      let blob;
      let photoAccess = "public";
      try {
        blob = await send("public");
      } catch (firstErr) {
        console.warn("Public upload failed, trying private store", firstErr);
        photoAccess = "private";
        blob = await send("private");
      }

      setState("saving");
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, photoUrl: blob.url, photoAccess, lang: locale }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        // Server returns field names; show our own translated text for them.
        const fieldErrs = Object.fromEntries(
          Object.keys(data.errors || {}).map((k) => [k, k === "startMonth" && values.startMonth ? "startMonthStale" : k])
        );
        setErrors(fieldErrs);
        setState("idle");
        setMessage(Object.keys(fieldErrs).length ? "check" : "generic");
        return;
      }
      setReference(data.reference || "");
      setState("done");
    } catch (err) {
      console.error(err);
      setState("idle");
      setMessage("generic");
    }
  }

  if (state === "done") {
    const month = months.find((m) => m.value === values.startMonth);
    const id = values.appId.trim();
    return (
      <div className="success">
        <div className="success-badge">✓</div>
        <h3>{t.success.title}</h3>
        <p>{month ? fmt(t.success.bodyMonth, { id, month: month.label }) : fmt(t.success.body, { id })}</p>
        {reference && <p className="muted">{fmt(t.success.ref, { ref: reference })}</p>}
        <p className="muted">{t.success.check}</p>
        <a href="/beauty-bonus/results" className="btn">{t.success.go}</a>
      </div>
    );
  }

  const busy = state !== "idle";

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="appId">{t.appId}</label>
        <input id="appId" inputMode="text" autoComplete="off" placeholder={t.appIdPh} value={values.appId} onChange={set("appId")} aria-invalid={!!errors.appId} />
        {errors.appId && <p className="error">{errText(errors.appId)}</p>}
      </div>

      <div className="field">
        <span className="label">{t.photo}</span>
        <div
          className={`dropzone${preview ? " has-file" : ""}${errors.photo ? " invalid" : ""}`}
          onClick={() => fileInput.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            pickFile(e.dataTransfer.files?.[0]);
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && fileInput.current?.click()}
        >
          {preview ? (
            <>
              <img src={preview} alt={t.previewAlt} className="dz-preview" />
              <span className="dz-change">{t.change}</span>
            </>
          ) : (
            <>
              <UploadIcon />
              <span className="dz-title">{t.dzTitle}</span>
              <span className="dz-hint">{fmt(t.dzHint, { mb: MAX_MB })}</span>
            </>
          )}
        </div>
        <input ref={fileInput} type="file" accept="image/*" hidden onChange={(e) => pickFile(e.target.files?.[0])} />
        {errors.photo && <p className="error">{errText(errors.photo)}</p>}
      </div>

      <div className="field">
        <label htmlFor="startMonth">{t.start}</label>
        <select id="startMonth" value={values.startMonth} onChange={set("startMonth")} aria-invalid={!!errors.startMonth}>
          <option value="">{t.startPh}</option>
          {months.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
        {months[0] && <p className="hint">{fmt(t.startHint, { date: months[0].label })}</p>}
        {errors.startMonth && <p className="error">{errText(errors.startMonth)}</p>}
      </div>

      <div className="row">
        <div className="field">
          <label htmlFor="email">{t.email}</label>
          <input id="email" type="email" autoComplete="email" placeholder={t.emailPh} value={values.email} onChange={set("email")} aria-invalid={!!errors.email} />
          {errors.email && <p className="error">{errText(errors.email)}</p>}
        </div>
        <div className="field">
          <label htmlFor="phone">{t.phone}</label>
          <input id="phone" type="tel" autoComplete="tel" placeholder={t.phonePh} value={values.phone} onChange={set("phone")} aria-invalid={!!errors.phone} />
          {errors.phone && <p className="error">{errText(errors.phone)}</p>}
        </div>
      </div>

      {/* Honeypot for bots — hidden from people */}
      <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={values.website} onChange={set("website")} name="website" />

      <label className="check">
        <input type="checkbox" checked={agree} onChange={(e) => { setAgree(e.target.checked); setErrors((er) => ({ ...er, agree: undefined })); }} />
        <span>
          {t.confirm.split("{rules}").map((part, i) => (
            <span key={i}>
              {i > 0 && <a href="/beauty-bonus/rules" target="_blank" rel="noopener">{t.confirmRules}</a>}
              {part}
            </span>
          ))}
        </span>
      </label>
      {errors.agree && <p className="error">{errText(errors.agree)}</p>}

      {message && <p className="form-error" role="alert">{errText(message)}</p>}

      <button className="btn wide" type="submit" disabled={busy}>
        {state === "uploading" ? t.uploading : state === "saving" ? t.saving : t.submit}
      </button>
    </form>
  );
}
