
# Invoice Factory

A monorepo for an Invoice Generator microservice with Go backend and React frontend.

## Structure
- `backend/` — Go API (Gin, gofpdf)
- `frontend/` — React client (Axios, Tailwind)

## Quick Start

### 1. Backend (Go API)

**Setup:**
```bash
cd backend
go mod tidy
go run main.go
```

**Docker:**
```bash
docker build -t invoice-backend ./backend
docker run -p 8080:8080 invoice-backend
```

### 2. Frontend (React App)

**Setup:**
```bash
cd frontend
npm install
npm start
```

**Docker:**
```bash
docker build -t invoice-frontend ./frontend
docker run -p 3000:3000 invoice-frontend
```

### 3. Docker Compose

To run both services together:
```bash
docker-compose up --build
```

This will start:
- Backend on [http://localhost:8080](http://localhost:8080)
- Frontend on [http://localhost:3000](http://localhost:3000)

### 4. API Usage

**POST /generate-invoice**
- Accepts invoice JSON or multipart form data
- Returns PDF file

### 5. Features
- Dynamic invoice form (number, date, client info, line items, logo, notes)
- PDF generation via backend
- Download PDF from frontend

### 6. Deployment
- Backend: Railway, Render, Fly.io
- Frontend: Vercel, Netlify

### 7. Optional Enhancements
| Feature            | Stack                        |
| ------------------ | ---------------------------- |
| Auth               | Firebase or Clerk.dev        |
| Stripe integration | Add Stripe links in PDF      |
| Save templates     | Use SQLite or PostgreSQL     |
| API monetization   | RapidAPI or Gumroad API Keys |

---

<img width="1704" height="956" alt="image" src="https://github.com/user-attachments/assets/d2994c35-94a6-444c-8544-2615cc5c2a89" />


For more details, see the README in each folder.

---

## API Testing Example (Postman)

**POST /generate-invoice**

**URL:**
`http://localhost:8080/generate-invoice`

**Headers:**
- Content-Type: `application/json`

**Body (raw, JSON):**
```json
{
  "invoiceNumber": "INV-001",
  "date": "2025-08-03",
  "client": {
    "name": "John Doe",
    "email": "john@example.com",
    "address": "123 Main St"
  },
  "items": [
    { "description": "Service A", "quantity": 2, "price": 100 },
    { "description": "Service B", "quantity": 1, "price": 200 }
  ],
  "notes": "Thank you for your business!"
}
```

**How to use:**
1. Open Postman and create a new POST request.
2. Set the URL to `http://localhost:8080/generate-invoice`.
3. Set the body type to `raw` and format as `JSON`.
4. Paste the example JSON above.
5. Send the request.
