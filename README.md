# Course Selling Platform (Udemy-like Backend)

A modular Node.js + Express + MongoDB backend with JWT auth, RBAC, course management, enrollments, reviews, wishlist, Stripe-style payments, dashboards, caching, notifications, logging, and Swagger docs.

## Folder Structure

```bash
src/
  app.js
  config/
  controllers/
  docs/
  middleware/
  models/
  routes/
  services/
  utils/
  validators/
```

## Setup

1. Copy envs:

```bash
cp .env.example .env
```

2. Install and run:

```bash
npm install
npm run dev
```

3. Swagger docs:

- `http://localhost:3005/api-docs`

## Key Features Implemented

- **Authentication & Authorization**
  - JWT login/signup (`/api/v1/auth/signup`, `/api/v1/auth/login`)
  - RBAC roles: `student`, `instructor`, `admin`
  - Protected middleware for admin/instructor-only course management

- **Course Management**
  - Create/update/delete/list/preview courses
  - Categories, tags, difficulty level
  - Thumbnail/preview upload support via Cloudinary + Multer
  - Search + filters (category, difficulty, price, rating)

- **User Features**
  - Student enrollment + progress tracking
  - Wishlist
  - Reviews + ratings with aggregate rating updates
  - Student/Instructor dashboards

- **Payments**
  - Stripe PaymentIntent integration (with mock fallback if no key)
  - Coupons (`SAVE10`, `SAVE20`), confirm, refund endpoint

- **Advanced / Best Practices**
  - Pagination + response caching (`node-cache`)
  - Email notifications (`Nodemailer`) on enrollment
  - Logging (`Winston`) + request logs (`Morgan`)
  - Validation (`express-validator`) + global error handlers
  - Swagger/OpenAPI docs configured

## Sample API Routes

### Auth
- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`

### Courses
- `POST /api/v1/courses` (admin/instructor)
- `PUT /api/v1/courses/:id` (admin/instructor)
- `DELETE /api/v1/courses/:id` (admin/instructor)
- `GET /api/v1/courses?page=1&limit=10&category=Web&minPrice=0&maxPrice=100&rating=4`
- `GET /api/v1/courses/:id/preview`

### Enrollment
- `POST /api/v1/enrollments/:courseId` (student)
- `PATCH /api/v1/enrollments/:courseId/progress` (student)

### Payments
- `POST /api/v1/payments/course/:courseId` (student)
- `PATCH /api/v1/payments/:paymentId/confirm`
- `POST /api/v1/payments/:paymentId/refund` (admin)

## Frontend Integration Suggestions (React/Next.js)

- Use Axios interceptors to inject `Authorization: Bearer <token>`.
- Store auth token in `httpOnly` cookies via a BFF layer for better security.
- Build pages:
  - Marketplace with server-side filtered search (`/courses` query params)
  - Course details with preview + ratings
  - Checkout page calling payment endpoints and Stripe.js
  - Student dashboard + instructor analytics dashboard
- Add optimistic UI for wishlist and progress updates.
- In Next.js, use API routes or server actions to proxy sensitive calls.

## Frontend (Udemy-inspired)

A responsive, recruiter-friendly UI is included in `public/` with modular folders:

```bash
public/
  components/
  css/
  js/
  assets/
  index.html
  dashboard.html
```

### Landing page (`/index.html`)
- Sticky top navigation with logo, categories, search bar, and login/signup actions.
- Built-in auth test form (signup/login) that posts to backend auth APIs and stores JWT for dashboard API tests.
- Hero section with bold headline, supporting copy, and CTA button.
- Sidebar filters for category, ratings, and max price.
- Dynamic course card grid with thumbnail, title, instructor, rating stars, and price.
- Smooth hover transitions and subtle glowing focus borders for interactive elements.

### Dashboard (`/dashboard.html`)
- Enrolled courses view with progress bars and **Continue Learning** actions.
- CRUD testing panel with Create/Read/Update/Delete buttons wired to `/api/v1/courses` and success/error status messaging.
- Responsive card layout that stacks on mobile.

### Design system
- Professional white/gray base palette with purple accents.
- Consistent modern typography and spacing.
- Mobile responsiveness with collapsible navigation menu and stacked layouts.


## Vercel deployment notes

- Serverless handlers are provided in `api/index.js` and `api/[...all].js` to route `/api/*` requests into the Express app.
- `vercel.json` uses function settings only (no pinned runtime string), avoiding runtime-version validation errors.
- Database initialization is cached and no longer re-connects per invocation.
- Use `/healthz` to verify function health after deployment.
- Ensure `MONGO_URI` and `JWT_SECRET` are set in Vercel project environment variables.


### Database connection
- Default local fallback URI is `mongodb://127.0.0.1:27017/course_selling` when `MONGO_URI` is not set.
- For production/Vercel, set `MONGO_URI` to a MongoDB Atlas connection string in Project Settings → Environment Variables.
- Health check endpoint: `GET /healthz` now returns DB connectivity status.
