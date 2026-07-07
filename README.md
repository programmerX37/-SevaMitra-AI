# SevaMitra AI — Aapka Digital Sarkar Guide

SevaMitra AI is a production-ready, fault-tolerant Generative AI civic assistance platform engineered for **DEVENGERS PromptWars 2026**. The platform bridges complex public policy frameworks with citizen-facing portals by utilizing deterministic AI models to simplify welfare schemes, analyze mandatory identity requirements, and draft formal municipal grievances—fully optimized for digital inclusion and high-scale accessibility.

**Live Codebase:** [GitHub - programmerX37/-SevaMitra-AI](https://github.com/programmerX37/-SevaMitra-AI)

---

## 🏛️ System Architecture Layout

The application utilizes a secure, high-performance serverless monorepo design structured as follows:

```text
├── api/
│   └── index.js        # Serverless Backend Proxy & Multi-Key Rotation Engine
├── src/
│   ├── main.jsx        # App mounting layer
│   └── App.jsx         # Twin-Pane Command Grid UI (Localization & Accessibility)
├── tests/
│   └── api.test.js     # Vitest + Supertest Integration Test Suite
├── scripts/
│   └── audit.mjs       # Pre-Flight Deployment Security Audit Script
├── vercel.json         # Global Reverse-Proxy Routing Matrix
└── package.json        # Monorepo Workspace Dependency Manifest
```

### ⚙️ Core Engineering Frameworks

* **Twin-Pane Command Grid Console:** A responsive split-screen desktop portal (`45fr` input management, `55fr` output stream monitor) that eliminates mobile real-estate constraints. Collapses into a clean single vertical stack on viewports below `768px`.
* **Sequential Multi-Key Fallback Engine:** Built into the backend proxy layer to intercept rate limits (`HTTP 429`) or quota exhaustion. It dynamically cycles through three distinct `GEMINI_API_KEY_X` slots inside a secure, error-catching loop, ensuring zero client-side service denial.
* **Accessibility (A11y) Foundations:** Fully compliant with automated screen-readers through strict HTML5 structural markup (`<header role="banner">`, `<nav role="navigation">`, `<main role="main">`), rigid `htmlFor` ↔ `id` form bindings, and live streaming broadcast containers (`aria-live="polite"`).
* **Bi-Directional Localization Matrix:** Provides full contextual interface translations between English and Hindi (हिन्दी) across interactive inputs, discovery suggestion chips, and dynamic generative AI responses.
* **Workspace Action Macro Tools:** Instant, single-click client macros allowing users to either clone console outputs directly to clipboard buffers or trigger automated text/markdown downloads (`.md`).

---

## 🛠️ Verification & Execution Blueprint

### 1. Ingest Dependency Matrix

Initialize all project framework and workspace dependencies:

```bash
npm install
```

### 2. Local Environment Configuration

Construct a secure `.env` file in the root workspace folder to store your developer credentials. Legacy single-key configurations degrade gracefully if multi-key variables are omitted:

```env
GEMINI_API_KEY_1=your_primary_gemini_key
GEMINI_API_KEY_2=your_secondary_fallback_key
GEMINI_API_KEY_3=your_tertiary_fallback_key
```

### 3. Run the Local Interface

Mount the local development environment using the Vite pipeline:

```bash
npm run dev
```

*The client-side interface hosts at `http://localhost:5173/` and proxies backend paths via `/api/**`

### 4. Run the Integration Test Suite

Execute the native ESM integration tests to confirm routing behaviors and validation gate parameters:

```bash
npm run test
```

### 5. Execute Pre-Flight Compliance Audit

Execute the automated repository validator to check for hardcoded endpoints, credential safety, and routing manifest syntax parameters prior to deployment:

```bash
npm run audit
```

---

## 📊 Operational Command Manifest

| Scripts Matrix | Command String | Operational Utility Check |
| --- | --- | --- |
| `npm run dev` | `vite` | Spins up the local client application and proxy loops. |
| `npm run build` | `vite build` | Compiles production-optimized frontend client bundles. |
| `npm run test` | `vitest run` | Executes 5/5 Supertest validation and health checks. |
| `npm run audit` | `node scripts/audit.mjs` | Audits files for hardcoded local addresses and key leak risks. |

---

## 🔒 Security Architecture Highlights

* **Isolated Proxy Routing:** Frontend elements never interface with raw Google API endpoints directly. All queries route through `/api/generate`, hiding processing components behind an encrypted serverless ecosystem.
* **Input Sanitization Gate:** Strict structural verification checks block empty or malformed strings at the API layer, dropping invalid queries immediately with an explicit `400 Bad Request` code before calling model runtimes.
* **Key Masking & Exposure Avoidance:** The static environment auditor actively blocks local development paths (`localhost`, `127.0.0.1`) and checks configuration integrity while keeping raw credential values masked in compile logs.