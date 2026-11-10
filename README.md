# Salsa — creators site

One site with:

| Page | What it is |
|---|---|
| `/` | Home: links to every section, "Start streaming" and support buttons |
| `/guide` | Streamer guide (EN/RU/UA) |
| `/agency` | Agency guide + agency application form (EN/RU/UA) |
| `/beauty-bonus` | Beauty Bonus application, `/beauty-bonus/rules`, `/beauty-bonus/results` |
| `/admin` | One admin panel: Beauty Bonus, Agency applications, Site settings |

Old links `/rules` and `/results` redirect to their new addresses.

## Admin panel
- **Stats** — visitors per day, pages opened and buttons clicked (Start streaming, support, contests, HOT! buttons, socials, home cards), plus how many applications came in. Choose Today / 7 days / 30 days / All time. Stored in the site's own database; no cookies with personal data.
- **Beauty Bonus** — applications, statuses, public result lists, CSV (as before).
- **Agency applications** — every form sent from `/agency`: contacts, address, streamer IDs (a ×2 badge marks a streamer ID that appears in more than one application), status (New / Contacted / Approved / Rejected), internal notes, CSV export.
- **Contests** — links to contest pages hosted elsewhere. Each gets a card on the home page (and in the streamer or agency guide) and a short link `salsa.team/c/<name>` that forwards to the contest and counts clicks. Set “show until” and it disappears by itself after that date.
- **Site settings** — button links (start streaming, support, agency panel, Cafe app, Telegram, Instagram), an announcement banner in each language, and switches to show or hide each section. Changes are live immediately.

## Connect your domain
Vercel → your project → **Settings → Domains → Add** → type `salsa.team` (and add `www.salsa.team` too, set to redirect to `salsa.team`). Vercel shows the DNS records to add (usually an `A` record for the bare domain and a `CNAME` for `www`). Add them where you bought the domain; it goes live once DNS updates (minutes to a few hours). The `.vercel.app` address keeps working too.

## Where the texts live
- Streamer guide: `lib/content/streamerGuide.js`
- Agency guide + form texts: `lib/content/agencyGuide.js` (commission and bonus tables at the top)
- Home page, menu, footer: `lib/site.js`
- Beauty Bonus: `lib/i18n.js`, rules in `lib/rules.js`

---

## Deploy (about 10 minutes)

### 1. Put the code on GitHub
1. Create a new **private** repository on github.com (e.g. `salsa-beauty-bonus`).
2. Upload this folder's contents (drag-and-drop on GitHub works), or from a terminal inside this folder:
   ```bash
   git init && git add . && git commit -m "Beauty Bonus site"
   git branch -M main
   git remote add origin https://github.com/<you>/salsa-beauty-bonus.git
   git push -u origin main
   ```

### 2. Import it into Vercel
1. vercel.com → **Add New… → Project** → pick the repo → **Deploy** (defaults are fine).
   The first deploy works but the form can't save until steps 3–4 are done.

### 3. Add storage (in the Vercel project)
1. **Storage → Create → Blob** → create a store and connect it to this project. This adds `BLOB_READ_WRITE_TOKEN`.
2. **Storage → Create → Upstash (Marketplace) → Redis** → free plan → connect it to this project. This adds `KV_REST_API_URL` and `KV_REST_API_TOKEN`.

### 4. Set the admin password
**Settings → Environment Variables** → add `ADMIN_PASSWORD` with a long password of your choice (all environments).

### 5. Redeploy
**Deployments → ⋯ on the latest → Redeploy.** Done. Open `/admin` and sign in.

Optional: **Settings → Domains** to add your own domain.

---

## Using the admin panel
- **Applications tab** — every submission, newest first. Click a photo to enlarge it. Change the status dropdown to Accepted / Conditional / Rejected: the in-app ID immediately appears on the public Results page. Set it back to Pending to remove it.
- **Result lists tab** — paste any number of in-app IDs (commas, spaces or new lines), pick a list, Save. Use this for IDs that didn't apply through the form. Click × on an ID to remove it. An ID can only be in one list; saving it again moves it.
- **Export CSV** — downloads all applications for Excel/Sheets.

## Languages (English, Russian, Ukrainian)
The application and results pages are in **English, Russian and Ukrainian**. The admin panel stays in English.
- Visitors get their browser's language automatically, and can switch with **EN · RU · UA** in the header (remembered for a year).
- Shareable links open the site in one language: `https://your-site/?lang=ru`, `https://your-site/?lang=uk` (or `?lang=ua`), `https://your-site/results?lang=ru`.
- Each application records the language it was submitted in. You can see it in the admin "Lang" column and in the CSV.
- All texts live in `lib/i18n.js`. Edit any wording there. The Russian and Ukrainian texts use the informal "ты/ти".

## Start-date rules (application window 1st–5th)
Each bonus period runs from the 13th to the 13th. Applications sent on the **1st–5th** can start on the 13th of the same month; applications sent on the **6th or later** can start on the 13th of the next month at the earliest. The form only offers allowed dates, and the server enforces the same rule. Dates are counted in Istanbul/Moscow time (UTC+3). Settings live at the top of `lib/months.js` (`APPLY_FROM_DAY`, `APPLY_TO_DAY`, `BONUS_DAY`, `APP_TIMEZONE`).

## Rules page
`/rules` shows the Beauty Bonus rules in EN/RU/UA. All wording is in `lib/rules.js`.

## Notes
- Photos are stored in Vercel Blob with unguessable random file names; anyone with the exact link can view a photo, but links are only shown in the admin panel.
- The public Results page shows only in-app IDs — never emails, phones or photos.
- Social links live in `lib/links.js`; images in `public/img/`.

## Run locally
```bash
npm install
cp .env.example .env.local   # fill in values from Vercel (Settings → Environment Variables)
npm run dev
```
