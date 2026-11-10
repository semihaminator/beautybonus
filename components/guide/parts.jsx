// Building blocks shared by the streamer and agency guides.
const P = {
  phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
  laptop: '<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 19h20"/>',
  sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
  cake: '<path d="M4 21h16M5 21v-7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7"/><path d="M5 16c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0"/><path d="M12 12V8"/><path d="M12 5.5c.8-.8.8-1.7 0-2.5-.8.8-.8 1.7 0 2.5z"/>',
  camera: '<path d="M3 8a2 2 0 0 1 2-2h2.5L9 4h6l1.5 2H19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.5"/>',
  wifi: '<path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.5" r="1"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
  idcard: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2.2"/><path d="M5.8 16c.6-1.6 1.8-2.4 3.2-2.4s2.6.8 3.2 2.4M14.5 10h4M14.5 13.5h3"/>',
  shuffle: '<path d="M3 7h3.5c2 0 3.2.9 4.3 2.6l2.4 4.8c1.1 1.7 2.3 2.6 4.3 2.6H21M3 17h3.5c1.4 0 2.4-.4 3.2-1.2M14.3 8.2c.8-.8 1.8-1.2 3.2-1.2H21"/><path d="m18 4 3 3-3 3M18 14l3 3-3 3"/>',
  video: '<rect x="2.5" y="6" width="13" height="12" rx="2"/><path d="m15.5 10.5 6-3.5v10l-6-3.5"/>',
  live: '<circle cx="12" cy="12" r="2"/><path d="M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7M5.5 5.5a9.5 9.5 0 0 0 0 13M18.5 5.5a9.5 9.5 0 0 1 0 13"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>',
  coin: '<ellipse cx="12" cy="7" rx="7" ry="3"/><path d="M5 7v5c0 1.7 3.1 3 7 3s7-1.3 7-3V7M5 12v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5"/>',
  up: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  wallet: '<path d="M4 7a2 2 0 0 1 2-2h11v4"/><path d="M4 7v10a2 2 0 0 0 2 2h14V9H6a2 2 0 0 1-2-2z"/><circle cx="16.5" cy="14" r="1.2"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.2-4 4.2-6 8-6s6.8 2 8 6"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.9-3.4 3.4-5 6.5-5s5.6 1.6 6.5 5"/><path d="M15.5 4.7a3.5 3.5 0 0 1 0 6.6M18 15.3c1.7.7 2.9 2.2 3.5 4.7"/>',
  trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H4.5c0 3 1.5 4.5 3.7 4.8M16 6h3.5c0 3-1.5 4.5-3.7 4.8M12 13v4M9.5 17h5v4h-5z"/>',
  crown: '<path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z"/>',
  bars: '<path d="M5 20V11M12 20V5M19 20v-6"/>',
  gift: '<rect x="3.5" y="8.5" width="17" height="4" rx="1"/><path d="M5 12.5V20h14v-7.5M12 8.5V20"/><path d="M12 8.5C10.5 5 7 4.5 7 6.8 7 8.5 12 8.5 12 8.5zM12 8.5c1.5-3.5 5-4 5-1.7 0 1.7-5 1.7-5 1.7z"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
  wheel: '<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7L11.5 6.8"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.5-1.5"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  alert: '<path d="M12 3 2 20h20z"/><path d="M12 10v4.5M12 17.5v.5"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
  rocket: '<path d="M12 15l-3-3c1.5-4.5 4.5-8 10-9-1 5.5-4.5 8.5-9 10z"/><path d="M9 12H5l2.5-3.5H11M12 15v4l3.5-2.5V13"/><path d="M6 18c-1 .5-1.5 2-1.5 2s1.5-.5 2-1.5"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>',
  building: '<path d="M4 21V5l8-3v19M12 9h8v12M2 21h20"/><path d="M7 8h2M7 12h2M7 16h2M15 13h2M15 17h2"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  panel: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/>',
  percent: '<path d="M19 5 5 19"/><circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/>',
  send: '<path d="M21 3 10 14"/><path d="m21 3-7 18-4-7-7-4z"/>',
  form: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  android: '<rect x="5" y="9" width="14" height="10" rx="2"/><path d="M8 9a4 4 0 0 1 8 0M8.5 5.5 7.5 4M15.5 5.5l1-1.5M9.5 13h.01M14.5 13h.01"/>',
  support: '<path d="M4 13v-1a8 8 0 0 1 16 0v1"/><rect x="3" y="13" width="4" height="6" rx="1.5"/><rect x="17" y="13" width="4" height="6" rx="1.5"/><path d="M19 19c0 1.5-1.8 2.5-5 2.5"/>',
};

export function GIcon({ name, size = 24 }) {
  return <svg className="g-i" viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" dangerouslySetInnerHTML={{ __html: P[name] || "" }} />;
}

export function Ico({ name }) {
  return <span className="g-ico"><GIcon name={name} /></span>;
}

// «Text» inside guide copy is shown as an app button label.
export function Rich({ text }) {
  const parts = String(text || "").split(/«([^»]+)»/);
  return parts.map((p, i) => (i % 2 ? <span key={i} className="g-ui">{p}</span> : p));
}

export function SecHead({ n, kicker, title, lead }) {
  return (
    <header className="g-sec-head">
      <span className="g-sec-num" aria-hidden="true">{String(n).padStart(2, "0")}</span>
      <span className="g-kicker">{kicker}</span>
      <h2>{title}</h2>
      {lead && <p className="g-lead"><Rich text={lead} /></p>}
    </header>
  );
}

export function Feat({ icon, title, text, children }) {
  return (
    <div className="g-card">
      <div className="g-card-row">
        <Ico name={icon} />
        <div>
          <h3>{title}</h3>
          {text && <p><Rich text={text} /></p>}
        </div>
      </div>
      {children}
    </div>
  );
}

export function Steps({ items, compact = false }) {
  return (
    <ol className={compact ? "g-steps compact" : "g-steps"}>
      {items.map((it, i) => (
        <li key={i}>
          <div className="g-step-body">
            {it.title && <h3><Rich text={it.title} /></h3>}
            {it.text && <p><Rich text={it.text} /></p>}
            {it.pills?.length > 0 && (
              <ul className="g-pills">{it.pills.map((p) => <li key={p}>{p}</li>)}</ul>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Callout({ icon, title, text, tone, children }) {
  return (
    <div className={tone ? `g-callout ${tone}` : "g-callout"}>
      <Ico name={icon} />
      <div>
        {title && <h3>{title}</h3>}
        {text && <p><Rich text={text} /></p>}
        {children}
      </div>
    </div>
  );
}

export function Bullets({ items }) {
  return <ul className="g-bullets">{items.map((x, i) => <li key={i}><Rich text={x} /></li>)}</ul>;
}

export function GuideHero({ eyebrow, title, lead, badgeTop, badgeSub, img, imgW = 400, imgH = 400, chips }) {
  return (
    <section className="g-hero" id="top">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1 dangerouslySetInnerHTML={{ __html: title }} />
        <p>{lead}</p>
        <div className="g-chips">
          {chips.map((c) => (
            <a key={c.id} className="g-chip" href={`#${c.id}`}><GIcon name={c.icon} size={18} />{c.label}</a>
          ))}
        </div>
      </div>
      <div className="g-hero-art float">
        <img src={img} alt="" width={imgW} height={imgH} />
        {badgeTop && <div className="g-badge"><strong>{badgeTop}</strong><span>{badgeSub}</span></div>}
      </div>
    </section>
  );
}

export function LinkButton({ href, children, ghost = false, icon, track }) {
  if (!href) return null;
  const external = /^https?:/.test(href);
  return (
    <a href={href} data-track={track} className={ghost ? "btn ghost" : "btn"} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {icon && <GIcon name={icon} size={18} />}
      {children}
    </a>
  );
}
