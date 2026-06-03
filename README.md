# Simple Weather Web App

## Sample Demo
Link: http://simple-weather-web-app-lb-963668554.us-east-1.elb.amazonaws.com/

## Description

This is a full-stack weather application that consumes data from the National Weather Service API.

<img width="1001" height="809" alt="585006617-2ba6d20d-da3d-4f81-ab29-4d6ec5b74b15" src="https://github.com/user-attachments/assets/90f01c65-e0eb-49fa-afd2-672bbd9d2708" />

## Features

- Displays current weather for 5–10 US cities from the NWS API
- Full CRUD: add, edit, delete cities (min 5, max 10 enforced)
- Input validation (zod on the backend, matching client-side validation)
- XSS-safe name field (restricted character set)
- US-coverage bounds check on lat/lon
- Graceful upstream error handling (NWS 404s don't break the page)
- Security middleware: helmet + express-rate-limit + request size cap
- Persistent JSON storage via a Docker volume
- Nginx reverse proxy (`/api/*` → backend)
- Backend built with Node.js (Express 5)
- Frontend built with React 19 + Vite
- Unit tests with Jest + Supertest

## API

| Method | Path              | Purpose                               |
| -----: | ----------------- | ------------------------------------- |
|    GET | `/api/weather`    | Current weather for all stored cities |
|    GET | `/api/cities`     | List stored cities                    |
|   POST | `/api/cities`     | Add a city (blocked at max of 10)     |
|    PUT | `/api/cities/:id` | Edit a city                           |
| DELETE | `/api/cities/:id` | Remove a city (blocked at min of 5)   |
|    GET | `/health`         | Health check for ALB                  |

## Architecture

Frontend (React) → Backend (Express) → External API (weather.gov)

## API Used

https://api.weather.gov/

## Testing

Run backend tests:

```
cd backend
npm test
```

## ▶ Run Project

### Backend

```
cd backend
node server.js
```

### Frontend

```
cd frontend
npm run dev
```
