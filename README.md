# Pulse — Fitness App Frontend

A React frontend for a Fitness App Startup, built to consume the Week 4 Node.js/Express/MongoDB REST API. Includes authentication, protected routes, full CRUD interfaces for workouts, exercises, and fitness plans, personal workout progress tracking, and an admin dashboard — all wrapped in a distinct, modern fitness-brand visual identity ("Pulse").

## Features

- JWT authentication (register/login/logout), session persisted across refresh
- Global auth state via React Context (`AuthContext`)
- Protected routes (`ProtectedRoute`), including an admin-only route guard
- Dashboard with quick stats, a signature circular progress ring, recent activity, and quick links
- Workouts: browse, search, filter by difficulty/category, view details, mark as completed, admin CRUD
- Exercises: browse, search, filter by muscle group, view details, admin CRUD
- Fitness Plans: browse, view details, create/edit/delete (owner or admin)
- Progress: log workouts, view history in a table, edit/delete records, summary stats
- Profile: view and update account info, delete account
- Admin dashboard: view all users, delete users
- Centralized Axios instance that auto-attaches the JWT and normalizes errors
- Client-side form validation with inline error messages
- Loading, empty, and error states on every data-driven page
- Fully responsive: collapsible sidebar on mobile/tablet

## Technologies

- React 18 + Hooks (`useState`, `useEffect`, `useContext`, `useNavigate`, `useParams`)
- React Router DOM v6
- Axios
- Vite
- Plain CSS (custom design system, no UI framework)

## Project Structure

```text
fitness-app-frontend/
│
├── public/
│
├── src/
│   ├── api/
│   │   ├── axios.js
│   │   ├── authApi.js
│   │   ├── userApi.js
│   │   ├── workoutApi.js
│   │   ├── exerciseApi.js
│   │   ├── fitnessPlanApi.js
│   │   └── progressApi.js
│   │
│   ├── components/
│   │   ├── AppLayout.jsx
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── WorkoutCard.jsx
│   │   ├── ExerciseCard.jsx
│   │   ├── FitnessPlanCard.jsx
│   │   ├── StatRing.jsx
│   │   ├── Modal.jsx
│   │   ├── Loading.jsx
│   │   ├── ErrorMessage.jsx
│   │   └── EmptyState.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Profile.jsx
│   │   ├── Workouts.jsx
│   │   ├── WorkoutDetails.jsx
│   │   ├── Exercises.jsx
│   │   ├── FitnessPlans.jsx
│   │   ├── Progress.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── NotFound.jsx
│   │
│   ├── utils/
│   │   └── validation.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── index.html
├── .env.example
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

## Installation

```bash
npm install
```

Copy the environment template:

```bash
cp .env.example .env
```

## Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
```

Point this at wherever the Week 4 backend is running. All API calls go through `src/api/axios.js`, which reads this value — nothing else in the app hardcodes the API URL.

## Backend Setup

This frontend expects the Week 4 API to be running and reachable at `VITE_API_URL`. Start the backend first (see its own README), then start this frontend. If the backend isn't reachable, pages will show a "Network error" message rather than a blank screen.

## Running the Frontend

```bash
npm run dev
```

Vite will start the dev server at `http://localhost:5173`.

Build for production:

```bash
npm run build
npm run preview
```

## Available Routes

| Route              | Access        | Description                       |
|---------------------|--------------|-------------------------------------|
| `/login`            | Public        | Log in                             |
| `/register`         | Public        | Create an account                  |
| `/dashboard`        | Private       | Overview, stats, recent activity   |
| `/profile`          | Private       | View/update profile, delete account|
| `/workouts`         | Private       | Browse/search/filter workouts      |
| `/workouts/:id`     | Private       | Workout detail + mark completed    |
| `/exercises`        | Private       | Browse/search/filter exercises     |
| `/fitness-plans`    | Private       | Browse and manage fitness plans    |
| `/progress`         | Private       | Log and review workout history     |
| `/admin`            | Private/Admin | Manage all users                   |

Unauthenticated visitors are redirected to `/login`. Non-admins are redirected away from `/admin`.

## Authentication

On login/register, the backend returns a JWT and a user object. Both are stored in `localStorage` and loaded back into `AuthContext` on app start, so a page refresh keeps you logged in. Every outgoing request through the shared Axios instance automatically attaches:

```text
Authorization: Bearer <token>
```

On logout, the token and user are cleared from `localStorage` and app state, and you're redirected to `/login`. If the API ever returns 401 (expired/invalid token), the Axios interceptor clears the stored session so the next protected request/route correctly bounces you back to login.

To test admin-only features, register a normal user, then manually set that user's `role` to `"admin"` in MongoDB (the backend intentionally doesn't expose a self-promote-to-admin endpoint).

## API Integration

All backend calls live in `src/api/`, one file per resource, all built on top of the single `axios.js` instance. If the actual Week 4 response shape differs slightly from what's assumed here (`{ success, data, message }`), you only need to adjust the `.then((r) => r.data)` handling in `axios.js`/the resource files — the rest of the app consumes the service functions, not raw endpoints.

## Future Improvements

- Pagination and server-side filtering for large workout/exercise libraries
- Optimistic UI updates for CRUD actions
- Toast notifications instead of inline success/error banners
- Dark mode
- Unit tests (Vitest + React Testing Library)
- Refresh-token flow for longer sessions without re-login
