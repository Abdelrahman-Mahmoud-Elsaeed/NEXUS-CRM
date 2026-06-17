
# Onboarding Guide: Architecture, Layers & Module Creation Blueprint

Welcome to the team! This onboarding guide outlines the global architecture of our codebase. Use this document as your step-by-step checklist whenever you are tasked with creating a **new feature module** from scratch on either the Backend or Frontend.

---

## Part 1: Backend Architecture (Node.js/TypeScript)

Our backend follows a modular, decoupled architecture where each directory contains specific layer responsibilities based on standard HTTP request-response lifecycles.

### Directory Layer Map & Responsibilities


```

[Incoming Request] ──> Routes ──> Validators ──> Controller ──> Service ──> Utils/DB

```

* **`auth.routes.ts` (Routing Layer)**
    * **The Role:** The exterior entry point for network traffic.
    * **Responsibilities:** Binds HTTP endpoints (`GET`, `POST`, etc.) and middleware (authentication, rate-limiting) directly to specific controller methods.
* **`auth.validators.ts` (Validation Layer)**
    * **The Role:** The structural gatekeeper.
    * **Responsibilities:** Validates incoming request headers, query parameters, and body payloads (typically using schemas like Zod or Joi) before hitting any controller logic to reject malformed requests instantly.
* **`auth.dto.ts` (Data Transfer Object)**
    * **The Role:** Type contract definition.
    * **Responsibilities:** Enforces rigid TypeScript types and runtime contracts for request payloads and network API response bodies.
* **`auth.controller.ts` (Controller Layer)**
    * **The Role:** The traffic cop.
    * **Responsibilities:** Unpacks incoming request variables, triggers the appropriate Service layer workflow, handles HTTP status codes (`200 OK`, `422 Unprocessable`, etc.), and returns JSON responses.
* **`auth.service.ts` (Business Logic Layer)**
    * **The Role:** The brain of the backend.
    * **Responsibilities:** Contains core computations, database queries, transactions, security assessments, and downstream integrations. **Completely decoupled from HTTP protocols.**
* **`auth.util.ts` (Utility Layer)**
    * **The Role:** Stateless helpers.
    * **Responsibilities:** Houses pure helper functions used throughout the module (e.g., token signing, cryptographic functions, string sanitization).

---

### Step-by-Step Checklist to Build a New Backend Module

If you are asked to build a new backend module (e.g., a `contacts` module), create your files in this exact order:

1.  **`contacts.dto.ts`**: Declare your strict TypeScript type interfaces for incoming payloads and expected response shapes.
2.  **`contacts.validators.ts`**: Create runtime schema validation rules to reject malformed requests immediately.
3.  **`contacts.service.ts`**: Implement the domain business operations, data persistence, sanitization (e.g., transforming fields to uniform lowercase), and return raw processing structures.
4.  **`contacts.controller.ts`**: Write the endpoint orchestration methods to accept the request, delegate it to the service, and serialize the data output.
5.  **`contacts.routes.ts`**: Register your URL router configurations, map your validation middleware, and attach controller targets. Finally, import and register this top-level router inside your global application routing config.

---

## Part 2: Frontend Architecture (React/TypeScript)

Our frontend is organized using functional separation of concerns, moving from global infrastructure down to localized presentation atoms.

### Directory Layer Map & Responsibilities


```

Page Component (State & UI Shell)
└── Store / Hooks (State Management & Fetching)
└── Feature/Atom Components (Pure Layout & Presentation)

```

* **📁 `services/` (Network API Client Layer)**
    * **The Role:** Manages explicit backend HTTP communication routines.
    * **Responsibilities:** Configure your basic client endpoints here (e.g., standard Axios instances or fetch abstractions). It does not hold state; it only returns functional network promises.
* **📁 `types/` (Data Model Contract Layer)**
    * **The Role:** Mirror of the backend's data transfer contracts.
    * **Responsibilities:** House your static frontend data models here. Never mix presentation UI states with network response declarations.
* **📁 `store/` & `hooks/` (State & Data Fetching Layer)**
    * **The Role:** Application data management, polling, mutations, and structural caching (e.g., Zustand, Redux, or React Query hooks).
    * **Responsibilities:** Run network-level data-trapping normalization workflows here. Ensure fields default gracefully (e.g., `apiData.channels || []`) before values ever flow down to visual interface containers.
* **📁 `validations/` (Form Schema Validation Layer)**
    * **The Role:** Client-side form entry validations.
    * **Responsibilities:** Define structural field validation constraints matching frontend entry inputs before making outbound data payload network requests.
* **📁 `guard/` (Route & Middleware Security Layer)**
    * **The Role:** Contextual routing gates.
    * **Responsibilities:** Validates component accessibility rights (e.g., checking active access tokens to protect structural private routes or redirecting to authentication pages).
* **📁 `pages/` (Page Layout & State Coordinator Layer)**
    * **The Role:** Route URL state management.
    * **Responsibilities:** Page-level wrapper nodes are strictly stateful "managers". They read navigation query strings, trigger hook actions, track filters, and slice down raw arrays to downstream child rendering structures. Keep inline CSS layout styles here to an absolute minimum.
* **📁 `components/` (Presentation & Functional Asset Layer)**
    * **The Role:** UI display elements categorized from complex blocks down to stateless display atoms.
    * **Responsibilities:** Components must remain mostly "dumb" and data-agnostic, relying entirely on incoming props.
        * Ensure alignment controls are explicitly synchronized (e.g., table column headings matching body alignment configurations with utilities like `text-center`).
        * Implement local visual fallbacks directly inside the presentation layer (e.g., rendering a `-` placeholder for missing textual properties) to keep layout components flexible.

---

## Part 3: Architecture Rule Checklist for New Implementations

Whenever a new module is introduced across our ecosystem, ensure you adhere to these strict integration patterns:

* **Preserve Decoupling Boundaries:** Controllers only handle HTTP details (`req`, `res`); services only handle logic. Never pass raw HTTP request headers or response contexts deep into a backend service layer.
* **Enforce Structural Fail-Safes Early:** Always convert raw backend payload properties into sanitized, predictable states on the client using nullish operators (`||` or `??`).
* **No Empty Spaces:** Tabular layout grids must define explicit fallback symbols (e.g., `-`) inside presentations rather than leaving layout elements blank, which can distort cell alignments.
* **Prevent Content Layout Shifts (CLS):** Card grids or layouts that handle dynamically optional metadata arrays must use structural heights (`min-h-[*]`) or display checks to maintain spacing integrity when rows transition from loaded states to empty views.
