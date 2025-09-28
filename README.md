# ERP Frontend

This is the frontend for the ERP system, built with **React, TypeScript, Redux Toolkit, TanStack Query, and TailwindCSS**.

---

## 🚀 Tech Stack

- **React + Vite** – frontend framework & build tool
- **TypeScript** – static typing
- **Redux Toolkit** – global state management
- **TanStack Query** – API data fetching & caching
- **Axios** – HTTP requests
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
git clone https://github.com/lfpcode/frontend
npm install
npm run dev
```

---

### 🛠 Scripts

- `npm run dev`     – start dev server  
- `npm run build`   – build for production  
- `npm run preview` – preview production build  

---

### ✅ Next Steps

- Set up Redux store and slices under `src/store` and `src/features`.  
- Configure React Query provider in `App.tsx`.  
- Build core layouts (sidebar, navbar, dashboard).  
- Create base pages (Login, Dashboard, Users, Settings).  