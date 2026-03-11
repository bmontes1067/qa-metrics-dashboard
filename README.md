# 📊 QA Metrics Dashboard

![CI](https://github.com/bmontes1067/qa-metrics-dashboard/actions/workflows/ci.yml/badge.svg)
![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-4.x-FF6384?logo=chart.js&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-1.x-6E9F18?logo=vitest&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow)

> 🔗 **[Live Demo →](https://bmontes1067-qa-metrics-dashboard.vercel.app)**

A quality metrics dashboard for QA teams built with **Vue 3**, **TypeScript** and **Chart.js**. Visualizes test pass rates, bug distribution by module, coverage by test type, and response time trends across sprints.

---

## 📸 Preview

The dashboard includes:
- **4 KPI cards** — pass rate, automation count, open bugs, avg response time
- **Pass rate trend** — line chart across 8 sprints showing improvement
- **Coverage radar** — by test type (E2E, API, Unit, Mobile, Performance)
- **Bugs by module** — stacked bar chart with severity breakdown
- **Response time trend** — API performance over time
- **Sprint history table** — full data with health bar per sprint

---

## 🛠 Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| [Vue 3](https://vuejs.org/) | 3.4.x | Frontend framework (Composition API) |
| [TypeScript](https://typescriptlang.org) | 5.x | Type safety |
| [Chart.js](https://chartjs.org) | 4.x | Data visualization |
| [Vite](https://vitejs.dev) | 5.x | Build tool & dev server |
| [Vitest](https://vitest.dev) | 1.x | Unit testing |

---

## 📁 Project Structure

```
qa-metrics-dashboard/
├── .github/
│   └── workflows/
│       └── ci.yml              # CI — test + build on every push
├── src/
│   ├── data/
│   │   └── metrics.ts          # Mock QA data (8 sprints, 6 modules)
│   ├── tests/
│   │   └── metrics.test.ts     # Unit tests for data integrity
│   ├── App.vue                 # Main dashboard component
│   └── main.ts
├── index.html
├── vite.config.ts
├── tsconfig.json
├── vercel.json                 # One-click Vercel deploy
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm 9+

### Installation

```bash
git clone https://github.com/bmontes1067/qa-metrics-dashboard.git
cd qa-metrics-dashboard
npm install
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:5173`

### Build

```bash
npm run build
npm run preview   # preview the production build locally
```

### Unit tests

```bash
npm run test:unit
```

---

## 🌐 Deploy to Vercel

The easiest way to get it live (required for the portfolio impact):

1. Push the repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import `qa-metrics-dashboard`
4. Click **Deploy** — done ✅

The `vercel.json` is already configured, no setup needed.

---

## 🧠 Design Decisions

**Why mock data instead of a real backend?**
The goal is to demonstrate QA metrics concepts and frontend skills, not backend infrastructure. The data layer (`src/data/metrics.ts`) is cleanly separated so it could be swapped for a real API with minimal changes.

**Why Chart.js directly instead of vue-chartjs?**
Direct Chart.js gives more control over chart configuration, especially for custom animations and responsive behavior. The canvas refs + onMounted pattern keeps it straightforward without extra abstraction.

**Why unit tests on data?**
Even mock data has invariants worth testing — pass+fail+skip must sum to 100, trends must be directionally correct, all fields must exist. It demonstrates that a QA mindset applies even to frontend data layers.

---

## 📚 What I Learned

- Building dashboards with the Vue 3 Composition API and TypeScript
- Working directly with Chart.js canvas API for fine-grained control
- Separating data, presentation and logic cleanly in a Vue app
- Writing meaningful unit tests for data integrity
- CI/CD for a Vue app with Vite + GitHub Actions

---

## 📄 License

MIT © [Belén Montes](https://github.com/bmontes1067)
