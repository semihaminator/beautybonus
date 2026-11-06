# Salsa Beauty Bonus — application site

Next.js site with three parts:

| Page | What it does |
|---|---|
| `/` | Hero, the "bonus starts on the 13th" notice, the application form (in-app ID, picture, start month, email, phone) and Telegram/Instagram links |
| `/results` | Public lists of **Accepted**, **Conditionally accepted** and **Rejected** in-app IDs, with a search box |
| `/admin` | Password-protected panel: all submissions with photos, filters, status changes, delete, CSV export, and bulk entry of IDs into the public result lists |

Data is stored in **Upstash Redis** (applications + statuses) and photos in **Vercel Blob**. Both are free-tier friendly and are added from inside Vercel.

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

## Start-month rules
The bonus starts on the 13th of every month. The form offers the next 6 start dates; once the 13th of the current month has arrived, that month is no longer offered. Change this in `lib/months.js` (`BONUS_DAY`, and `count` in `app/page.jsx`).

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
