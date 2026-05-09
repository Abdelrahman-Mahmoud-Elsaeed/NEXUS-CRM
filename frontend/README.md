frontend/
│
├── public/                  # Static files (favicon, index.html, images that never change)
│
├── src/
│   │
│   ├── app/                # GLOBAL app setup (NOT business logic)
│   │   ├── providers/      # App wrappers (AuthProvider, ThemeProvider, React Query, Toast)
│   │   ├── router/         # All routing (public/protected routes, guards)
│   │   ├── store/          # Global state only (auth user, theme, permissions)
│   │   └── layouts/        # Page wrappers (DashboardLayout, AuthLayout)
│   │
│   ├── modules/            # FEATURE-BASED BUSINESS LOGIC (CRM core)
│   │   ├── auth/           # Login, register, forgot password, auth API, auth hooks
│   │   ├── dashboard/      # Main dashboard KPIs, charts, overview
│   │   ├── customers/      # Customer CRUD, profiles, tables, API
│   │   ├── contacts/       # Contact persons linked to customers
│   │   ├── leads/          # Lead management, status tracking, scoring
│   │   ├── pipelines/      # Sales pipeline stages + drag & drop flow
│   │   ├── tasks/          # Task manager, assignments, deadlines
│   │   ├── messages/       # Chat / messaging / communication center
│   │   ├── analytics/      # Reports, charts, performance metrics
│   │   ├── settings/       # User settings, profile, preferences
│   │   └── integrations/   # External services (n8n, email, WhatsApp, APIs)
│   │
│   ├── shared/             # REUSABLE CODE ACROSS ALL MODULES
│   │   ├── components/     # Generic reusable components (Table, Modal, Form)
│   │   ├── ui/             # UI system (buttons, inputs, cards - design system)
│   │   ├── hooks/          # Custom hooks (useAuth, useDebounce, useFetch)
│   │   ├── utils/          # Pure helper functions (formatters, parsers)
│   │   ├── services/       # API layer (Axios instance + API calls)
│   │   ├── constants/      # Static values (roles, enums, configs)
│   │   ├── types/          # Global TypeScript types/interfaces
│   │   ├── validations/    # Zod / Yup schemas
│   │   └── guards/         # Route guards (auth protection, role checks)
│   │
│   ├── assets/             # Images, icons, logos, fonts
│   │
│   ├── styles/             # Global styles (tailwind base, variables, css reset)
│   │
│   ├── config/             # Environment config, feature flags, app config
│   │
│   ├── lib/                # External library setup (axios config, dayjs, etc.)
│   │
│   ├── main.tsx            # App entry point (React root render)
│   └── vite-env.d.ts       # Vite + TypeScript environment types
│
├── tests/                  # Unit + integration tests
│
├── .env                    # Environment variables (API URLs, keys)
│
└── vite.config.ts         # Build tool configuration