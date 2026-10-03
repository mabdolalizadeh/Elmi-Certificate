# 🎓 Smart Student Report Card Generator & Analyzer (Landscape A4/A5)
### سامانه هوشمند صدور و تحلیل کارنامه دانش‌آموزی در قالب افقی

A high-aesthetic, production-ready web application designed for importing student academic and behavioral records from an Excel spreadsheet, performing automated analytical growth trends, previewing report cards interactively with fluid motion transitions, and compiling multi-page landscape PDFs using a headless Chromium (Puppeteer) engine.

---

## 🌟 Key Features

* **📐 Standard Landscape Layout (A4/A5):**
  * Clean three-column structure optimized for horizontal presentation and printing.
  * **Right Column (Academic Performance):** Comparative visual progress meters for Previous vs. Current Total Score and Math Score, with trend badges.
  * **Center Column (Behavioral & Attendance):** Metric cards for absences and tardies, color-mapped discipline evaluation status, and homework delivery completion percentage.
  * **Left Column (Advisor Guidance):** Highlighted quote-style advisor notes and formal counselor signature/stamp placeholders.

* **📊 Automated Analytical Intelligence:**
  * **Homework Delivery Rate:** Automatically computed as `(Submitted / Total) * 100` and rendered with a color-coded progress meter (Emerald for $\ge 80\%$, Amber for $\ge 60\%$, Rose for $< 60\%$).
  * **Trend Detection:** Automatically calculates `Current % - Previous %`:
    * **Improvement (پیشرفت):** $\Delta > +2\%$ &rarr; Emerald badge with `TrendingUp` icon.
    * **Stable (ثابت):** $-2\% \le \Delta \le +2\%$ &rarr; Slate badge with `Minus` icon.
    * **Decline (پسرفت):** $\Delta < -2\%$ &rarr; Rose badge with `TrendingDown` icon.

* **📥 Dynamic Excel Engine (SheetJS):**
  * One-click dynamic **"Download Excel Template" (`.xlsx`)** button populated with Iranian high school sample records.
  * Drag-and-drop file import dropzone with validation for `.xlsx` and `.xls` files.
  * Instant demo data loader for rapid testing and evaluation.

* **🎠 Interactive Live Previewer (Framer Motion):**
  * Smooth direction-aware horizontal slide animations between student cards.
  * Complete navigation controls: Next / Previous buttons, student pagination badge, quick student chip selectors, and keyboard arrow key navigation (`←` / `→`).

* **🎛️ Floating Control Bar & Visibility Toggles:**
  * Real-time student search by full name.
  * Filter chips by Class (e.g., `دهم ریاضی ۱`, `دهم تجربی ۲`, etc.).
  * Filter chips by Analytical Trend (`پیشرفت در ریاضی`, `افت در ریاضی`, `پیشرفت کل`, `افت کل`).
  * Select All / Deselect All with live selection counter for batch export.
  * Collapsible section visibility switches: toggle Academic Analysis, Attendance, Discipline, Homework, or Advisor Notes across all cards before exporting.

* **🖨️ Headless Chromium PDF Compilation Engine (Node.js & Puppeteer):**
  * Dedicated backend service rendering standalone A4 landscape documents.
  * Strict `@page { size: A4 landscape; margin: 0; }` and page-break isolation (`page-break-after: always; break-after: page;`) ensuring each report card occupies exactly one page without blank pages or margin spillage.
  * Embedded Persian typography (**Vazirmatn**) ensuring crisp vector fidelity.

---

## 🏗️ Monorepo Architecture

The repository is structured as a decoupled monorepo with independent frontend and backend workspaces:

```text
root/
├── client/                     # React Frontend (Vite)
│   ├── src/
│   │   ├── components/         # UI Components
│   │   │   ├── ControlBar.jsx          # Search, filters, visibility switches, export trigger
│   │   │   ├── ExportModal.jsx         # Loading progress dialog for PDF compilation
│   │   │   ├── FileImportCard.jsx      # Drag-and-drop Excel uploader & template generator
│   │   │   ├── Header.jsx              # System banner & branding
│   │   │   ├── ReportCard.jsx          # 3-column landscape card layout
│   │   │   └── ReportCardPreviewer.jsx # Framer Motion slide carousel
│   │   ├── theme/              # MUI RTL configuration & custom palette
│   │   │   ├── rtlCache.js             # Emotion RTL cache with stylis-plugin-rtl
│   │   │   └── theme.js                # Typography (Vazirmatn), shape, colors
│   │   ├── utils/
│   │   │   └── excelService.js         # SheetJS parsing, template export & analytics
│   │   ├── App.jsx             # Main application orchestrator
│   │   ├── index.css           # Global typography & print overrides
│   │   └── main.jsx            # React root with RTL CacheProvider & ThemeProvider
│   ├── public/templates/      # Sample Excel templates
│   ├── package.json
│   └── vite.config.js          # Vite config with API reverse proxy
│
├── server/                     # Node.js Backend (Express & Puppeteer)
│   ├── src/
│   │   ├── controllers/        # PDF generation controller
│   │   │   └── pdfController.js
│   │   ├── routes/             # Express API routes
│   │   │   └── pdfRoutes.js
│   │   ├── services/           # Business logic & rendering
│   │   │   ├── pdfService.js           # Puppeteer browser management & PDF compiler
│   │   │   └── templateService.js      # Self-contained HTML/CSS generator
│   │   └── server.js           # Server entry point (Port 5001)
│   └── package.json
│
├── sample-data/                # Sample Excel sheets for testing
│   └── قالب_کارنامه_دانش‌آموزی.xlsx
├── package.json                # Root convenience scripts
├── .gitignore
└── README.md
```

---

## 📋 Excel Schema Reference

The Excel parser and template generator use the following canonical Persian headers:

| Header in Excel | Translation / Description | Data Type | Example Value |
| :--- | :--- | :--- | :--- |
| `نام و نام خانوادگی` | Student Full Name | String | `علیرضا حسینی` |
| `کلاس` | Class / Grade | String | `دهم ریاضی ۱` |
| `تعداد غیبت` | Absences count | Integer | `1` |
| `تعداد تاخیر` | Tardies count | Integer | `2` |
| `وضعیت انضباط` | Discipline Status | String | `عالی` / `خوب` / `نیاز به توجه` / `ضعیف` |
| `تکالیف تحویل شده` | Homework Submitted | Integer | `28` |
| `کل تکالیف` | Total Assigned Homework | Integer | `30` |
| `درصد کل (قبلی)` | Previous Overall Score % | Number (0–100) | `82` |
| `درصد کل (فعلی)` | Current Overall Score % | Number (0–100) | `91` |
| `درصد ریاضی (قبلی)` | Previous Math Score % | Number (0–100) | `78` |
| `درصد ریاضی (فعلی)` | Current Math Score % | Number (0–100) | `94` |
| `نکته مشاورهای` | Advisor / Counselor Note | String | `پیشرفت چشمگیر در درس ریاضی و استمرار عالی...` |

---

## 🚀 Quickstart Guide

### Prerequisites
* **Node.js:** v18.0.0 or higher
* **npm:** v9.0.0 or higher
* **Google Chrome / Chromium:** Installed on host system for Puppeteer PDF rendering.

### 1. Installation

Install dependencies for both workspaces:

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 2. Running in Development Mode

You can start both client and server independently:

**Start Backend Server (Port 5001):**
```bash
cd server
npm run dev
```

**Start Frontend Client (Port 5173):**
```bash
cd client
npm run dev
```

The frontend Vite server is configured to proxy all `/api/*` calls to the backend on `http://localhost:5001`. Open your browser at:
`http://localhost:5173`

---

## 🔌 API Reference

### 1. Health Check
* **Endpoint:** `GET /api/health`
* **Response:**
  ```json
  {
    "status": "ok",
    "service": "report-card-pdf-engine",
    "timestamp": "2026-10-03T14:20:00.000Z"
  }
  ```

### 2. Batch PDF Generation
* **Endpoint:** `POST /api/generate-pdf`
* **Content-Type:** `application/json`
* **Payload:**
  ```json
  {
    "students": [
      {
        "id": "student-1",
        "name": "علیرضا حسینی",
        "className": "دهم ریاضی ۱",
        "absences": 1,
        "tardies": 2,
        "discipline": "عالی",
        "homeworkSubmitted": 28,
        "homeworkTotal": 30,
        "homeworkRate": 93,
        "prevTotal": 82,
        "currTotal": 91,
        "overallTrend": { "status": "improvement", "label": "پیشرفت", "diff": 9, "color": "#10B981", "bgColor": "#ECFDF5" },
        "prevMath": 78,
        "currMath": 94,
        "mathTrend": { "status": "improvement", "label": "پیشرفت", "diff": 16, "color": "#10B981", "bgColor": "#ECFDF5" },
        "advisorNote": "پیشرفت چشمگیر در درس ریاضی..."
      }
    ],
    "visibility": {
      "academic": true,
      "attendance": true,
      "discipline": true,
      "homework": true,
      "advisor": true
    }
  }
  ```
* **Response:** `200 OK` with binary `application/pdf` stream and header `Content-Disposition: attachment; filename="..."`.

---

## 📜 Git Commit History

The project development was executed systematically through conventional commit milestones:

1. `chore: project initialization & decoupled monorepo setup (client & server boilerplate)`
2. `feat(client): configure MUI RTL theme, Persian typography, and base layout`
3. `feat(client): implement Excel parser and dynamic sample template download via SheetJS`
4. `feat(client): build landscape report card UI with 3-column layout and trend analytics`
5. `feat(client): add live interactive card previewer with Framer Motion slide carousel`
6. `feat(client): implement floating control bar with student filters and section visibility toggles`
7. `feat(server): set up Express server and Puppeteer landscape multi-page PDF compilation engine`
8. `feat: connect client PDF export trigger to server endpoint with loading states`
9. `docs: add comprehensive README.md and sample assets`

---

## 📄 License
MIT License. Built for Iranian educational institutions and counseling departments.
