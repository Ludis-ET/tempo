# ERP Frontend

This is the frontend for the ERP system, built with **React, TypeScript, Redux Toolkit, TanStack Query, and TailwindCSS**.

---

## 🚀 Tech Stack

- **React + Vite** – frontend framework & build tool
- **TypeScript** – static typing
- **Redux Toolkit** – global state management
- **TanStack Query** – API data fetching & caching
- **TailwindCSS** – styling
- **React Router** – routing

---

## 📂 Folder Structure

```text
src/
├── assets/       # Static assets
├── components/   # Shared UI components
├── features/     # Feature-based modules (auth, users, dashboard, etc.)
├── hooks/        # Custom hooks
├── layouts/      # Layout components
├── pages/        # Application pages
├── services/     # API layer
├── store/        # Redux store setup
├── styles/       # Global styles
├── types/        # TypeScript types
├── utils/        # Utility functions
├── App.tsx       # Main app
└── main.tsx      # Entry point
```

---

## ⚡️ Installation

```bash
pnpm install
pnpm run dev
```

Set the API base URL in a `.env` file (see `.env.example`):

```bash
VITE_API_BASE_URL=http://localhost:8000
```

---

### 🛠 Scripts

- `pnpm run dev` – start dev server
- `pnpm run build` – build for production
- `pnpm run preview` – preview production build

---

## ✨ Feature Highlights

- **Refined dark theme** with balanced contrast for better readability across navigation and data-heavy views.
- **Customers ▸ Accounts** page with server-backed filtering (search, country, status, account manager, payment method), ordering, and pagination.

---

## 📘 Next Steps

- Wire additional Core resources (suppliers, payment methods) into the navigation.
- Expand tables with inline actions (edit, archive) and export capabilities.
- Add dedicated query option loaders for account managers and payment methods once supporting endpoints are available.
