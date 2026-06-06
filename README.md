# Alchemist Makeover Artistry - Fullstack Web Application

A fullstack makeover artistry web application clone of `alchemistmakeover.in`, featuring a local SQLite database, Express backend APIs, custom image/video file uploading, and separate portal dashboards for clients and administrators.

## Tech Stack

*   **Frontend**: React (Vite), custom styling system (CSS)
*   **Backend**: Node.js/Express
*   **Database**: SQLite (`sqlite3`)
*   **Authentication**: JSON Web Tokens (JWT) & bcryptjs
*   **File Uploads**: Multer local storage

## Features

1.  **Client Dashboard**: View personal makeover booking requests, academy course registration statuses, and profile information.
2.  **Admin Panel**:
    *   Manage bookings (Pending, Confirmed, Cancelled).
    *   Manage Academy admissions (Pending, Contacted, Enrolled, Cancelled).
    *   Upload, view, and delete photos and videos from the dynamic lookbook gallery.
3.  **Dynamic Gallery**: Beautiful lookbook filterable by photos and videos, integrated with a navigation lightbox.
4.  **Automatic Seeding**: Seeds test accounts on startup.
    *   **Admin**: `admin` / `alchemist2026`
    *   **Client**: `client` / `password123`

## Quick Start

### 1. Installation
In the root directory, install server dependencies:
```bash
npm install
```

In the `client` directory, install frontend dependencies:
```bash
cd client
npm install
cd ..
```

### 2. Development Mode
Runs both the Vite development server (port 3000) and Express server (port 5000) concurrently:
```bash
npm run dev
```

### 3. Production Build & Start
Compile the React frontend and start the integrated Express server (serves React assets from `client/dist` on port 5000):
```bash
npm run build
npm start
```
