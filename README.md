# Review and Rating MERN App

This project implements the company review and rating assignment using a MERN stack.

The application includes:

- Company listing with company-name search, city filter, sorting, and responsive UI
- Add company form with logo upload
- Company profile page with average rating and review listing
- Add review form with rating
- Review sorting by relevance, date, and rating
- Review like and share actions
- MongoDB-backed APIs
- ImageKit CDN integration for company logos

## Project Structure

```txt
backend/
  src/
    config/          Database and ImageKit configuration
    controllers/     API business logic
    middleware/      Multer logo upload middleware and error handlers
    models/          Mongoose schemas for Company and Review
    routes/          Express route definitions
    services/        ImageKit upload service
    server.js        Express app entry point
  .env.example       Backend environment variable example
  package.json       Backend dependencies and scripts

frontend/
  src/
    components/      Reusable React UI components
    pages/           Route-level screens
    services/        Axios API client
    App.jsx          Frontend route definitions
    main.jsx         React entry point
    styles.css       Global responsive styling
  .env.example       Frontend environment variable example
  package.json       Frontend dependencies and scripts
  vite.config.js     Vite React configuration
```

## Backend

The backend is built with:

- Node.js
- Express
- MongoDB
- Mongoose
- Multer
- ImageKit Node SDK
- CORS
- Morgan
- Dotenv

### Backend Setup

Go to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside `backend/`.

Required backend environment variables:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/zoronal_reviews
CLIENT_URL=http://localhost:5173
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=
```

Backend `.env` secrets will be provided separately over mail.

Start the backend:

```bash
npm run dev
```

Backend health check:

```txt
http://localhost:5000/api/health
```

## Frontend

The frontend is built with:

- React
- Vite
- React Router
- Axios
- Lucide React icons
- CSS

### Frontend Setup

Open a second terminal and go to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside `frontend/`.

Required frontend environment variable:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend URL:

```txt
http://localhost:5173
```

## Running The Full Project

Use two terminals.

Terminal 1:

```bash
cd backend
npm run dev
```

Terminal 2:

```bash
cd frontend
npm run dev
```

MongoDB must be running before creating or listing companies.

## API Routes

### Company Routes

```txt
GET    /api/companies
POST   /api/companies
GET    /api/companies/cities
GET    /api/companies/:id
```

`GET /api/companies` supports query params:

```txt
search   company name search
city     city filter
sort     name | latest | oldest | rating | founded
```

Example:

```txt
/api/companies?search=tech&city=indore&sort=name
```

Company sort behavior:

```txt
rating    highest average rating to lowest
founded   latest founded date to oldest
```

`POST /api/companies` accepts regular JSON or multipart form data.

For logo upload, send multipart form data with:

```txt
name
location
city
foundedOn
description
logo
```

The file field name must be:

```txt
logo
```

### Review Routes

```txt
GET    /api/companies/:companyId/reviews
POST   /api/companies/:companyId/reviews
PATCH  /api/reviews/:reviewId/like
```

`GET /api/companies/:companyId/reviews` supports:

```txt
sort=relevance
sort=date
sort=rating
```

Review listing also returns:

```txt
averageRating
reviewCount
reviews
```

### Upload Route

```txt
POST /api/uploads/logo
```

This route is available for standalone logo uploads. The Add Company flow currently uploads the logo through `POST /api/companies`.

## ImageKit Usage

ImageKit is used to store company logo images on a CDN.

Flow:

```txt
User selects logo in Add Company form
Frontend sends multipart/form-data to backend
Backend receives file using Multer
Backend uploads image to ImageKit
ImageKit returns CDN URL
Backend saves CDN URL in Company.logo
Frontend displays Company.logo
```

Only the backend uses ImageKit credentials. The frontend never receives the private key.

## Main Functional Flow

1. Add a company with name, location, founded date, city, and optional logo.
2. Company appears in the listing page.
3. Search companies by company name.
4. Filter companies by city.
5. Open a company profile.
6. Add a review with full name, subject, review text, and rating.
7. Reviews appear on the company profile.
8. Average rating is calculated and displayed above the review list.
9. Reviews can be sorted by relevance, date, or rating.
10. Reviews can be liked or shared.

## Build Commands

Frontend production build:

```bash
cd frontend
npm run build
```

Backend production start:

```bash
cd backend
npm start
```
