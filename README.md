# AgentWeb Framework 🕵️‍♂️🔍

An advanced full-stack AI-driven web research and multi-agent workspace designed to automate complex, multi-step browser explorations and data aggregation. The system dynamically generates plans, simulates precise browser execution steps (via a modeled Playwright interface), evaluates results with a critic loop, and synthesizes structured opportunities with direct application portals.

---

## 🚀 Core Features

### 1. Multi-Agent Collaborative Architecture
- **Planner Agent**: Analyzes your search directives, configures navigation parameters, and builds robust sequential operational strategies.
- **Browser Executor (Playwright Simulation)**: Drives simulated Chromium viewport sessions, executing scroll-events, cookie injectors, form submissions, and data parsers.
- **Evaluator Critic**: Audits collected data telemetry, validates coordinates, and requests iterative optimizations if regional filters or thresholds are unmet.

### 2. High-Fidelity Data Extraction & Direct Portals
- **Extracted Opportunities Cards**: Clean, high-contrast listings indicating role, source channel (e.g., LinkedIn, Indeed, Career Portals), and custom descriptive badges.
- **Direct Apply Action Links**: Every matching job or internship integrates verified direct-redirect application links (e.g., pointing directly to Microsoft Careers, Google Careers, Workday systems) so applicants can instantly submit profiles.
- **Markdown Dossier Synthesizer**: Generates a visually structured, copyable engineering report containing tabular comparisons, analytical logs, and strategic action items.

### 3. Precision Telemetry Terminal
- Watch real-time terminal output logs logging state transitions, viewport alterations, user-agent details, network requests, and anti-detection telemetry.

---

## 🛠 Tech Stack

### Frontend (Client SPA)
- **Framework**: React 18 with TypeScript 
- **Bundler & Tooling**: Vite
- **Styling**: Tailwind CSS (Sophisticated Dark/Atmospheric Mode)
- **Icons**: Lucide React
- **Animations**: Framer Motion / Motion API
- **Dynamic Elements**: Responsive terminal panels, state badges, and device-emulation switches (Desktop/Mobile mode).

### Backend (Server API)
- **Server Engine**: Node.js & Express
- **Integration**: `@google/genai` (Server-side Gemini orchestration)
- **Environment Handling**: Safe proxying of secure environment credentials (no public API key leakage).

---

## 💻 Getting Started

Follow these steps to run the complete workspace locally in your development environment:

### Prerequisite
Ensure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).

### 1. Clone the Project
```bash
# Navigate to your workspace directory
cd agentweb-framework
