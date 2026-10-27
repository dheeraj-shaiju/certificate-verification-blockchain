# CertVerify – Certificate Verification System Using Blockchain

Phase I **frontend prototype**, version 0.9 (standard design, connected to the IPFS backend) (CSD415, Project Group 6, GEC Thrissur).

A common platform for any college. Each college’s admin issues degree
certificates (details + PDF) in that college’s name, and students view them,
download the PDF and share them with a QR code. The demo includes two colleges
(GEC Thrissur and GEC Kozhikode) to show that each admin sees only their own
college’s certificates.

> **What is not implemented yet:** the ERC-721 smart contract, IPFS (Pinata),
> the Node.js backend, MongoDB and secure authentication. In this prototype all
> data is stored in the browser (localStorage + IndexedDB) and the login is a
> browser-only demo. The app says this clearly on screen.

## Demo login

| Role | Username | Password |
| --- | --- | --- |
| Admin, GEC Thrissur | `gect.admin` | `admin123` |
| Admin, GEC Kozhikode | `geck.admin` | `admin123` |
| Student | any student ID that has a certificate, e.g. `TCR22CS008` or `KKE22CS017` | `student123` |

- An **admin** issues certificates in their own college’s name and sees only
  their college’s certificates and students.
- A **student** sees only their own certificates and cannot open the admin pages.
- Signed-out visitors see the start page and the About page only.

To add a demo college, add it to `INSTITUTIONS` in `src/utils/constants.js`
and give it an admin in `DEMO_ADMINS` in `src/services/auth.js`.

This is **not real security**: passwords are checked in the browser. In Phase II,
replace `checkDemoLogin()` in `src/services/auth.js` with a call to the backend
(e.g. `POST /api/auth/login` returning a JWT). The login page, protected routes
and logout stay the same.

---

## 1. Requirements

- **Node.js 20.19+ or 22.12+** (check with `node -v`). Download the LTS version from https://nodejs.org
- A modern browser (Chrome, Edge or Firefox)

## 2. Run the project

```bash
cd cert-verify-frontend
npm install        # installs everything listed in package.json (first time only)
npm run dev        # starts the app at http://localhost:5173
```

Open http://localhost:5173 in your browser. Stop the server with `Ctrl + C`.

Other commands:

```bash
npm run build      # creates an optimised version in the dist/ folder
npm run preview    # serves that dist/ folder locally to test it
```

If you ever create a fresh Vite project yourself, these are the extra packages it needs:

```bash
npm install react-router-dom qrcode.react idb-keyval jspdf lucide-react
```

## Connecting to the backend (IPFS)

When **Issue certificate** is clicked, the PDF is sent to the backend in
`../backend` (`POST http://localhost:5000/api/certificates/issue`, file field
`certificatePDF`, plus `studentRegNo`). The backend hashes it, stores it on IPFS
through Pinata and returns `{ sha256Fingerprint, ipfsCID }`. The certificate then
shows its CID with an **Open on IPFS** link.

- Start the backend first: `cd ../backend`, then `npm start` (needs `backend/.env`).
- The Issue page shows **Backend connected** or **Backend offline**.
- If the backend is off, certificates are still issued and kept in the browser.
- To use a different backend address, create `frontend/.env` with
  `VITE_API_URL=http://your-server:5000` and restart `npm run dev`.

The code for this is in `src/services/api.js`.

## 3. Dependencies

| Package | Why it is used |
| --- | --- |
| `react`, `react-dom` | The UI library |
| `vite`, `@vitejs/plugin-react` | Development server and build tool |
| `react-router-dom` | Navigation between Home, Admin and Student pages |
| `qrcode.react` | Draws the QR code for each certificate |
| `idb-keyval` | Simple way to save PDF files in the browser’s IndexedDB |
| `jspdf` | Generates realistic sample certificate PDFs for the demo |
| `lucide-react` | Icons |

## 4. Folder structure

```
cert-verify-frontend/
├── index.html                 Page shell; loads fonts and src/main.jsx
├── package.json               Dependencies and npm scripts
├── vite.config.js             Vite settings
├── vercel.json                Lets page links work when deployed on Vercel
├── public/favicon.svg
└── src/
    ├── main.jsx               Starts React
    ├── App.jsx                All routes (see the comment at the top)
    ├── index.css              All styles, split into numbered sections
    ├── layouts/
    │   ├── PublicLayout.jsx         Top bar + page + footer (landing, about)
    │   └── AppLayout.jsx            Sidebar + page (dashboards, login required)
    ├── pages/
    │   ├── LandingPage.jsx          Project title, illustration and login box (/ and /login)
    │   ├── AboutPage.jsx            How it works + prototype status (/about)
    │   ├── AdminDashboard.jsx       Admin overview and certificate table (/admin)
    │   ├── IssueCertificatePage.jsx Issue form (/admin/issue)
    │   ├── StudentDashboard.jsx     Student's own certificates (/student)
    │   └── NotFound.jsx
    ├── components/
    │   ├── Sidebar.jsx, Footer.jsx, Logo.jsx, PageHeader.jsx
    │   ├── LoginCard.jsx            Admin / Student login form
    │   ├── ProtectedRoute.jsx       Lets only allowed roles open a page
    │   ├── CertificateForm.jsx      Issue form + validation
    │   ├── FormField.jsx            Label + input/select + error text
    │   ├── FileDropzone.jsx         PDF picker with drag and drop
    │   ├── CertificateTable.jsx     Search + table of records
    │   ├── CertificateSlip.jsx      Paper-style card with the QR code
    │   ├── CertificateDetails.jsx   Full list of a record’s fields
    │   ├── CertificateViewer.jsx    "View" pop-up: PDF + details + QR
    │   ├── PdfPreview.jsx           Shows/opens/downloads the PDF
    │   ├── QRCodeBlock.jsx          QR code + "Download QR"
    │   ├── LandingIllustration.jsx  Drawing on the start page
    │   ├── HeroIllustration.jsx     Flow drawing on the About page
    │   ├── Modal.jsx, StatCard.jsx, EmptyState.jsx, Spinner.jsx, CopyButton.jsx
    ├── context/
    │   ├── CertificateContext.jsx   Shared certificate data
    │   ├── AuthContext.jsx          Who is logged in (admin or student)
    │   └── ToastContext.jsx         Success / error pop-up messages
    ├── hooks/usePdfUrl.js           Loads a stored PDF for display
    ├── services/
    │   ├── storage.js               localStorage + IndexedDB (replace with API calls later)
    │   ├── api.js                   Calls the backend (IPFS upload)
    │   ├── auth.js                  Demo login check (replace with the login API later)
    │   ├── certificatePdf.js        Builds sample certificate PDFs
    │   └── sampleData.js            The demo students
    └── utils/
        ├── validation.js            Every form rule in one place
        ├── certificateId.js         Unique IDs like CERT-2026-K7QM-4XPA
        ├── fileHelpers.js           SHA-256 hash, PDF check, downloads
        ├── qrPayload.js             What text goes inside the QR code
        ├── formatters.js            Dates, file sizes, initials
        └── constants.js             Colleges, courses, limits
```

**How data flows:** `CertificateContext` holds the list of certificates. The Admin
page adds to it; the Student page reads from it. Every change is saved through
`services/storage.js`, so data survives a refresh. In Phase II, only
`storage.js` (and `addCertificate` in the context) need to change to call the
Express API instead.

## 5. Features

**Admin portal (`/admin` and `/admin/issue`)**
- Form: student name, student ID, course, graduation year, PDF upload
- Validation: required fields, name/ID format, year range, duplicate certificate,
  same ID with a different name, PDF type, 5 MB limit, and a check that the file
  really is a PDF (not just renamed)
- Unique certificate ID generated on issue
- SHA-256 fingerprint of the PDF (the value that will go on-chain later)
- “Generate a sample certificate” button, so the demo never needs a real PDF
- Searchable table with View, QR, Student view and Delete
- “Reset demo data” restores the sample records

**Student dashboard (`/student`)**
- A logged-in student sees only their own certificates
- An admin can look up any student ID (sample student buttons provided)
- Student details, every certificate, PDF view and download, QR view and download
- Remembers the last student; links like `/student?id=TCR22CS008` open a student directly

## 6. Suggested demo for the review (about 3 minutes)

1. **Start page:** show the portal and the login box. Open **About the project**
   to show the five-step workflow and which steps are working, simulated or planned.
2. **Log in as the GEC Thrissur admin** (`gect.admin` / `admin123`). Show the Overview, then open
   *Issue certificate* and click *Issue certificate* with an empty form to show validation.
   Try uploading a non-PDF file to show the file check.
3. Type a new student (e.g. *Meera Joseph*, `TCR22CS041`, B.Tech CSE, 2026), click
   *Generate a sample certificate*, then *Issue certificate*. Point out the new
   certificate ID, the QR code and the SHA-256 fingerprint.
4. Go to **Overview** and click **View** in the table to open the PDF with its details.
5. Click **Student view**: the same certificate appears as the student would see it.
6. **Log out, then log in as that student** (their ID / `student123`). Show they
   only see their own certificates, then open `/admin` to show it is blocked.
   Download the PDF and the QR.
7. **Log in as the GEC Kozhikode admin** (`geck.admin` / `admin123`) to show that a
   different college sees only its own certificates.
8. Refresh the page to show the data and login are still there.
9. Scan the QR with a phone camera: it shows the certificate details as text.

**Before the review:** run the app once on the presentation laptop. Fonts load
from Google Fonts; without internet the app still works with system fonts.
Data lives in the browser you use, so practise in the same browser you will
present from (not an incognito window).

## 7. Known limits of this prototype

- Data is per browser: another device or browser will not see it.
- Some phone browsers cannot show a PDF inside the page; *Open in new tab* and
  *Download PDF* still work.
- The QR code holds readable text. In Phase II it will hold a verification link
  that the employer page checks against the smart contract.
