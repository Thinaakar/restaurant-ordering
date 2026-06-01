# Guide — Build your app from the Base Template

Use this repo as a starting point. You analyze the product, plan it, design the UI, then wire APIs and Firebase. The template only proves the stack runs.

**Already included:** Next.js, TypeScript, Tailwind, Firebase Admin helpers, `GET /api/health`, empty folder placeholders.

**You add:** product plan, screens, APIs, auth (demo + real users), and Firestore data for your app.

---

## 1. Simple workflow

Follow this order:

| Step | What you do |
|------|-------------|
| **1. Plan** | Write down what the app does, who uses it, main screens, and data you need. Keep v1 small. Decide what you will **not** build yet. |
| **2. UI design** | Sketch or mock each screen (login, list, form, detail, settings). Pick layout, navigation, and shared components. Then build pages in the template folders. |
| **3. Firebase** | Create your Firebase project, add the service account, confirm `/api/health` shows connected. |
| **4. APIs** | Add routes that read/write your data. Validate input. Protect routes with auth. |
| **5. Connect UI ↔ API** | Pages call your APIs; show loading, empty, and error states. |
| **6. Auth** | Real login (users in Firestore) and optional demo login (view without writing). |
| **7. Test end-to-end** | Register/login → create → edit → delete on real Firebase; demo path without writes. |

Do **one feature at a time** (e.g. one list + form + API) before starting the next.

---

## 2. Plan (your analysis)

Before coding features, answer on your own (notes, doc, or whiteboard — your choice):

- What problem does the app solve?
- Who logs in?
- What are the 3–5 main screens?
- What records do you store (names and relationships only)?
- What is out of scope for the first release?

Do not copy another product’s flows or fields. Your domain is yours to define.

---

## 3. UI design

### What to design first

- Login / register (if needed)
- App shell: sidebar or top nav, active route, page title
- List pages: search, filters, empty state, row actions
- Create / edit forms: required fields, validation messages
- Detail view (if needed)
- Settings (if needed)

### How to build in this template

1. Reusable controls in `components/ui/` (buttons, inputs, cards).
2. Shared pieces in `components/shell/` (headers, loaders, empty states).
3. App chrome in `layouts/` and `components/app/` (navigation).
4. Feature screens in `modules/` — one folder per feature.
5. Route files under `src/app/` stay small; import the screen from `modules/`.

Use Tailwind and `globals.css` for a consistent look. Keep UI components free of database logic.

### Hooking up data (later)

When APIs exist, pages fetch with helpers from `lib/http/client.ts` and always send cookies on requests (`credentials: 'include'`). After save or delete, refresh the list.

---

## 4. API design

### Pattern

- `GET` → read data (list or single item)
- `POST` → create
- `PATCH` → update
- `DELETE` → remove

Put Firestore **reads** in `lib/firestore/app-data.ts` and **writes** in `lib/firestore/app-writes.ts`. API route files should stay thin: check auth → validate body (Zod in `lib/validation/entities.ts`) → call helper → return JSON.

Example response shape:

```json
{ "data": { } }
{ "error": "message" }
```

### Auth on APIs

Every protected route should know who is calling. Return `401` if there is no valid session. Block writes for demo users (see §6).

---

## 5. Firebase / Firestore

### Connection flow (start here)

```text
Firebase Console
  → create project
  → Service accounts → download JSON key
  → save as src/config/ServiceAccountKey.json
  → copy .env.example to .env
  → FIREBASE_CREDENTIALS=src/config/ServiceAccountKey.json
  → npm run dev
  → open /api/health  →  "firebase": "connected"
```

That health check loads the Admin SDK and runs `ensureAppTables()` so your template metadata exists in Firestore before you write app data.

Other credential options: `FIREBASE_SERVICE_ACCOUNT_JSON`, `GOOGLE_APPLICATION_CREDENTIALS` (see `.env.example`).

### What “template” means

Two parts work together:

| Part | File | Purpose |
|------|------|---------|
| **Template definition** | `src/templates/app.ts` | Lists your app key (`app`) and tables (`users`, `products`, …) with field names/types |
| **Firestore helpers** | `src/lib/firebase/collections.ts` | Builds paths and runs `ensureAppTables()` |

**Schema docs** (what tables exist) are stored at:

```text
templates/app                          ← app metadata
templates/app/tables/users             ← table metadata (fields list)
templates/app/tables/products          ← another table
```

**Your actual rows** (customers, products, etc.) go under:

```text
templates/app/tables/products/records/{docId}
```

Always read/write rows with `appCollection(db, 'products')` — do not create a top-level `products` collection.

Rename `key: 'app'` in `templates/app.ts` when you want a different prefix (e.g. `clinic` → `templates/clinic/tables/...`).

### Example — add a `products` table and one row

**1. Register the table** in `src/templates/app.ts`:

```ts
tables: [
  { key: 'users', label: 'Users', order: 10, fields: [ /* … */ ] },
  {
    key: 'products',
    label: 'Products',
    order: 20,
    fields: [
      { key: 'name', label: 'Name', type: 'string', required: true },
      { key: 'price', label: 'Price', type: 'number', required: true },
    ],
  },
],
```

**2. Write data** in `app-writes.ts` (pattern):

```ts
import { getAdminFirestore } from '@/lib/firebase/admin';
import { appCollection, ensureAppTables } from '@/lib/firebase/collections';

export async function createProduct(input: { name: string; price: number }) {
  const db = getAdminFirestore();
  await ensureAppTables(db);
  const ref = appCollection(db, 'products').doc();
  await ref.set({
    id: ref.id,
    name: input.name,
    price: input.price,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return { id: ref.id, name: input.name, price: input.price };
}
```

**3. Expose an API** — `POST /api/products` calls `createProduct`, UI form posts JSON to that route.

**4. Confirm in Firebase Console** — Firestore → `templates` → `app` → `tables` → `products` → `records`.

Same flow for every new entity: add table in `app.ts` → read/write via `appCollection` → API → UI.

### Checklist for a new entity

1. Add table + fields in `templates/app.ts`
2. Types in `data/types.ts`, Zod in `entities.ts`
3. `list` / `get` in `app-data.ts`, `create` / `update` / `delete` in `app-writes.ts`
4. API route + screen

Never commit `.env` or `ServiceAccountKey.json`.

### Security

The browser talks to **your Next.js APIs**, not Firestore directly (Admin SDK on the server). Do not expose the service account to the client.

---

## 6. Auth — demo and real users

### Real users

- Register: hash password, save user in Firestore.
- Login: verify password, set an HTTP-only session cookie.
- Protected pages and APIs check the session before proceeding.

### Demo users

- Demo login sets a session flag (e.g. `isDemo: true`).
- **GET** APIs can return sample data from `lib/demo/` without Firestore.
- **POST / PATCH / DELETE** are blocked for demo.
- UI hides create/edit/delete when in demo mode.

Same pages can work for both; only the data source and write permissions change.

### Frontend ↔ backend

```text
Login  → POST /api/auth/login     → cookie set
List   → GET  /api/items         → cookie sent → JSON list
Create → POST /api/items         → cookie + body → JSON item
```

Use `credentials: 'include'` on all fetches. Unauthenticated users should be redirected to login from the app layout.

---

## 7. Environment and git

| File | In git? |
|------|---------|
| `.env.example` | Yes |
| `.env`, `ServiceAccountKey.json` | No |
| `node_modules`, `.next` | No |

Use a separate Firebase project per app.

---

## 8. Instructions for LLMs

Paste when using Cursor or similar:

```text
I'm building an app from the BaseTemplate (Next.js 15, TypeScript, Tailwind, Firebase Admin).

I already have my own product plan and UI design — do not invent features, entities, or business rules.

Rules:
1. Follow my plan and mockups only. Ask if something is unclear.
2. APIs: auth check → Zod validation → app-data / app-writes → JSON { data }.
3. Firestore only via appCollection(db, 'tableName').
4. UI in modules/; keep app route files thin.
5. Fetch with credentials: 'include'.
6. Support demo mode (no writes) when adding auth-aware APIs.
7. One task per session (e.g. "Items list + POST API only").
8. Never commit secrets.

Current task: [describe ONE task]
```

**One task per session** works best.

---

## 9. Done checklist

- [ ] Plan and UI match what you built
- [ ] `npm run type-check` and `npm run build` pass
- [ ] Firebase connected via `/api/health`
- [ ] Real user: login → CRUD works
- [ ] Demo login works without Firestore writes
- [ ] No secrets in git
- [ ] Lists show loading / empty / error states

---

## 10. Common mistakes

1. Coding many screens before the plan is clear.
2. Putting database logic inside UI components.
3. Firestore writes inside API route files instead of `app-writes.ts`.
4. Forgetting `credentials: 'include'` → always 401.
5. Skipping validation → bad data in Firestore.
6. Sharing one Firebase project across unrelated apps.

---

*Explore the repo and README when you need paths or commands. You own the product design; the template owns the stack.*
