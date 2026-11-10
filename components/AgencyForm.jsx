"use client";

import { useState } from "react";
import { fmt } from "@/lib/i18n";

const ID_RE = /^[A-Za-z0-9._-]{2,40}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9 ()-]{7,22}$/;
const START_FIELDS = 3; // streamer IDs are optional
const MAX = 30;

export default function AgencyForm({ t, locale, whatsapp }) {
  const [v, setV] = useState({ name: "", agentId: "", email: "", phone: "", country: "", city: "", address: "", comment: "", website: "" });
  const [ids, setIds] = useState(Array(START_FIELDS).fill(""));
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState("idle");
  const [message, setMessage] = useState("");
  const [ref, setRef] = useState("");

  const set = (k) => (e) => {
    setV((x) => ({ ...x, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };
  const setId = (i) => (e) => {
    const next = [...ids];
    next[i] = e.target.value;
    setIds(next);
    setErrors((er) => ({ ...er, streamers: undefined }));
  };

  const filled = ids.map((s) => s.trim()).filter(Boolean);
  const lower = ids.map((s) => s.trim().toLowerCase());
  const isDup = (i) => lower[i] && lower.indexOf(lower[i]) !== i;

  function validate() {
    const e = {};
    if (!ID_RE.test(v.agentId.trim())) e.agentId = 1;
    if (!EMAIL_RE.test(v.email.trim())) e.email = 1;
    if (!PHONE_RE.test(v.phone.trim()) || v.phone.replace(/\D/g, "").length < 7) e.phone = 1;
    if (v.country.trim().length < 2) e.country = 1;
    if (v.city.trim().length < 2) e.city = 1;
    if (v.address.trim().length < 3) e.address = 1;
    const unique = new Set(filled.map((s) => s.toLowerCase()));
    if (unique.size !== filled.length || !filled.every((s) => ID_RE.test(s))) e.streamers = 1;
    if (!agree) e.agree = 1;
    return e;
  }

  async function onSubmit(ev) {
    ev.preventDefault();
    setMessage("");
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      setMessage(t.errors.check);
      return;
    }
    setState("saving");
    try {
      const res = await fetch("/api/agency-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v, streamerIds: filled, lang: locale }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrors(data.errors || {});
        setMessage(data.errors ? t.errors.check : t.errors.generic);
        setState("idle");
        return;
      }
      setRef(data.reference || "");
      setState("done");
    } catch {
      setMessage(t.errors.generic);
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <div className="success">
        <div className="success-badge">✓</div>
        <h3>{t.successTitle}</h3>
        <p>{t.successText}</p>
        {ref && <p className="muted">{fmt(t.successRef, { ref })}</p>}
      </div>
    );
  }

  const field = (k, label, props = {}, optional = false) => (
    <div className="field">
      <label htmlFor={`ag-${k}`}>
        {label}
        {optional && <span className="opt"> · {t.optional}</span>}
      </label>
      <input id={`ag-${k}`} value={v[k]} onChange={set(k)} aria-invalid={!!errors[k]} {...props} />
      {errors[k] && t.errors[k] && <p className="error">{t.errors[k]}</p>}
    </div>
  );

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      {field("name", t.name, { placeholder: t.namePh, autoComplete: "organization" }, true)}
      <div className="field">
        <label htmlFor="ag-agentId">{t.agentId}</label>
        <input id="ag-agentId" value={v.agentId} onChange={set("agentId")} placeholder={t.agentIdPh} autoComplete="off" aria-invalid={!!errors.agentId} />
        <p className="hint">{t.idHint}</p>
        {errors.agentId && <p className="error">{t.errors.agentId}</p>}
      </div>
      <div className="row">
        {field("email", t.email, { type: "email", autoComplete: "email", placeholder: "you@example.com" })}
        {field("phone", t.phone, { type: "tel", autoComplete: "tel", placeholder: t.phonePh })}
      </div>
      <div className="row">
        {field("country", t.country, { autoComplete: "country-name" })}
        {field("city", t.city, { autoComplete: "address-level2" })}
      </div>
      {field("address", t.address, { autoComplete: "street-address" })}

      <fieldset className="field ids-field">
        <legend className="label">{t.streamers}<span className="opt"> · {t.optional}</span></legend>
        <p className="hint">{t.streamersHint}</p>
        <div className="ids-grid">
          {ids.map((val, i) => (
            <div key={i} className="id-cell">
              <input
                id={`ag-streamer-${i}`}
                value={val}
                onChange={setId(i)}
                placeholder={fmt(t.streamerPh, { n: i + 1 })}
                aria-label={fmt(t.streamerPh, { n: i + 1 })}
                autoComplete="off"
                aria-invalid={!!errors.streamers && !!val.trim() && (!!isDup(i) || !/^[A-Za-z0-9._-]{2,40}$/.test(val.trim()))}
              />
              {ids.length > 1 && (
                <button type="button" className="id-remove" onClick={() => setIds(ids.filter((_, j) => j !== i))} aria-label={t.remove}>×</button>
              )}
              {isDup(i) && <p className="error">{t.errors.streamerDup}</p>}
            </div>
          ))}
        </div>
        {ids.length < MAX && (
          <button type="button" className="add-id" onClick={() => setIds([...ids, ""])}>{t.addMore}</button>
        )}
        {errors.streamers && <p className="error">{t.errors.streamers}</p>}
      </fieldset>

      <div className="field">
        <label htmlFor="ag-comment">{t.comment}<span className="opt"> · {t.optional}</span></label>
        <textarea id="ag-comment" rows={3} value={v.comment} onChange={set("comment")} placeholder={t.commentPh} maxLength={1000} />
      </div>

      <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={v.website} onChange={set("website")} name="website" />

      <label className="check">
        <input type="checkbox" checked={agree} onChange={(e) => { setAgree(e.target.checked); setErrors((er) => ({ ...er, agree: undefined })); }} />
        <span>{t.confirm}</span>
      </label>
      {errors.agree && <p className="error">{t.errors.agree}</p>}

      {message && <p className="form-error" role="alert">{message}</p>}

      <button className="btn wide" type="submit" disabled={state === "saving"}>
        {state === "saving" ? t.sending : t.submit}
      </button>

      {whatsapp && (
        <p className="alt-contact">
          {t.whatsappTitle} {t.whatsapp}{" "}
          <a href={whatsapp} target="_blank" rel="noopener noreferrer">{t.whatsappCta} →</a>
        </p>
      )}
    </form>
  );
}
