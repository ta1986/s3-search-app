# S3 Search App

Upload files to AWS S3 and search them. Monorepo with a **React** frontend (USWDS) and **NestJS** backend.

## Prerequisites

- Node.js 18+
- AWS account with S3 access (uses IAM role / default credential chain — no access keys needed)

## Quick Start

```bash
# Install all dependencies
npm run install:all

# Configure AWS
cp backend/.env.example backend/.env
# Edit backend/.env with your S3 bucket name and region

# Run both frontend and backend
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Project Structure

```
s3-search-app/
├── frontend/          # React + Vite + USWDS
│   └── src/
│       ├── components/  # Header, Footer
│       ├── pages/       # HomePage (search), AdminPage (file management)
│       └── api.ts       # Backend API client
├── backend/           # NestJS
│   └── src/
│       └── s3/          # S3 module (controller + service)
└── package.json       # Root scripts
```

## Pages

| Page  | Path     | Description                     |
| ----- | -------- | ------------------------------- |
| Home  | `/`      | Search files by name            |
| Admin | `/admin` | Upload, list, download, delete  |

## API Endpoints

| Method | Endpoint                     | Description       |
| ------ | ---------------------------- | ----------------- |
| GET    | `/api/files`                 | List all files    |
| POST   | `/api/files`                 | Upload a file     |
| GET    | `/api/search?q=<query>`      | Search files      |
| GET    | `/api/files/download/:key`   | Download a file   |
| DELETE | `/api/files/:key`            | Delete a file     |

## AWS Configuration

The backend uses the **AWS SDK default credential chain**, which supports:
- IAM roles (EC2, ECS, Lambda)
- AWS SSO / Identity Center
- Environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`)
- Shared credentials file (`~/.aws/credentials`)

For enterprise accounts, ensure your IAM role has `s3:PutObject`, `s3:GetObject`, `s3:ListBucket`, and `s3:DeleteObject` permissions on your bucket.
