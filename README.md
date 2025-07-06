# KPI & Letters API – Internal Reporting and Email Export Service

**KPI & Letters API** is a full-stack internal tool designed to expose reporting data and client email correspondence to internal services (such as Celery workers or internal dashboards). The application streams query results from MS SQL Server, including large volumes of email data, using paginated or newline-delimited (JSONL) output formats. It supports data export workflows like `.eml`-formatted zips of historical client correspondence.

---

## Tech Stack

### Backend
- **Node.js** with **Express.js**
- **MSSQL** via `msnodesqlv8`
- **RESTful API** with modular controllers and routing
- **Async error handling** with custom wrapper (`catchAsync`)
- **API key authentication middleware**
- **Streaming JSONL** for large query responses
- **Morgan** for access logging
- **UUID** for temporary file naming
- **Docker-compatible** for local or containerized deployments

---

## Features

### KPI Data Reporting
- Retrieve transactional and performance data for employees, desks, and clients
- Filtered access to key business data for analytics and operations
- Paginated endpoints for efficient UI loading

### Letters and Email Archive Export
- Search and filter historical client email records by date, keywords, or recipient
- **Stream-based export** of email records as `.jsonl` for worker consumption
- Designed to power automated pipelines that:
  - Convert JSON to `.eml` format
  - Package `.eml` into `.zip` archives
  - Serve back to internal requestors

### Secure API Access
- Enforced via custom middleware that checks an `x-api-key` header
- Unauthorized users are returned a 403 error

### Logging
- All API requests logged via `morgan` to `/logs/access.log`
- Helpful for audit trails, debugging, and usage monitoring

---

## Endpoints Overview

### Secured via API Key

#### KPI Routes

- GET /api/employees?FirstName=Bob
- GET /api/desks
- GET /api/trans
- POST /api/pfp
- GET /api/ci_boa_postdates
- GET /api/mab_tum_postdates
- GET /api/detailed_posted
- GET /api/detailed_employees

#### Letters Routes

- GET /api/letters
- GET /api/letters_zip

- `/letters` returns **paginated JSON**
- `/letters_zip` streams **newline-delimited JSON (JSONL)** ideal for worker ingestion

---

## Notable Code Architecture

### Error Handling
- Uses a centralized `AppError` class for consistent error messages
- All controller logic wrapped in `catchAsync()` for DRY promise error management

### Modular Components
- `models/` – DB access logic with parameterized queries
- `controllers/` – Route logic, validation, formatting
- `routes/` – HTTP interface definitions
- `utils/` – Reusable middleware and wrappers
- `config/` – DB connection setup using `.env` secrets

### Streaming JSONL API
- `/letters_zip` streams output one line at a time
- Built to support efficient downstream processing (e.g. Celery-based file builders)
- Can handle thousands of records without memory overload

---

## Environment Setup

### `.env` Example

# Security
- API_KEY=your_secret_key

# KPI DB
- KPI_DSN=YourDSN
- KPI_PRO=ProDatabase
- KPI_MAB=MABDatabase
- KPI_USER=your_db_user
- KPI_PASS=your_db_password

# Letters DB
- LET_HOST=your.sql.host
- LET_BASE=LettersDatabase
- LET_USER=your_db_user
- LET_PASS=your_db_password

---

### Setup and Usage

# Install dependencies
npm install

# Run the server locally
node app.js

API will be available at:
http://localhost:3000

---

### Deployment Notes
Ensure environment variables are correctly set

Protect .env from being committed to version control

Consider pm2 or containerization for production use

API expects a configured ODBC Data Source Name (DSN) for SQL Server access

---

### Example Use Case (Celery Worker)
Python Celery task sends a GET /api/letters_zip request

JSONL stream is parsed into .eml messages

Messages are zipped and returned to internal tools or uploaded

This decouples the Node service from heavy email formatting or storage responsibilities.
