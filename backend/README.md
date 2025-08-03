# Invoice Factory Backend

Go REST API for generating invoice PDFs.

## Tech Stack
- Go
- Gin
- gofpdf

## Setup

```bash
cd backend
# Initialize Go module (if not done)
go mod tidy
# Run the server
go run main.go
```

## API

### POST /generate-invoice
Accepts invoice JSON or multipart form data, returns PDF.

## Docker

Build and run with Docker:
```bash
docker build -t invoice-backend .
docker run -p 8080:8080 invoice-backend
```
