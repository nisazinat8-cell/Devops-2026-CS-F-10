# MongoDB integration for CareerConnect backend

This replaces the hardcoded `jobs` array in `server.js` with a real
MongoDB collection (via Mongoose), and adds a proper `User` collection
with hashed passwords + JWT login (your current login only checks
`localStorage` in the browser — it never verifies anything on the
server).

## Files added/changed

```
server/
├── config/db.js        # Mongoose connection
├── models/Job.js        # Job schema
├── models/User.js        # User schema (bcrypt password hashing)
├── middleware/auth.js     # JWT verification middleware
├── routes/jobs.js        # GET/POST /api/jobs, GET /api/jobs/:id
├── routes/auth.js        # POST /api/auth/register, /api/auth/login
├── server.js           # rewritten to wire everything up
├── seed.js            # one-time script to load sample jobs
├── .env.example
└── package.json         # added mongoose, bcryptjs, jsonwebtoken, dotenv
```

## Setup

1. Copy these files into your `server/` folder, replacing the
   existing `server.js` and `package.json`.
2. Install the new dependencies:
   ```
   npm install
   ```
3. Get a MongoDB connection string — either:
   - Local: install MongoDB Community Server and use
     `mongodb://127.0.0.1:27017/careerconnect`, or
   - Free cloud cluster: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
     → create a cluster → "Connect" → "Drivers" → copy the URI.
4. Copy `.env.example` to `.env` and fill in `MONGO_URI` and
   `JWT_SECRET` (any random string works for the secret).
5. Seed sample jobs into the database:
   ```
   npm run seed
   ```
6. Start the server:
   ```
   npm run dev
   ```
   You should see `MongoDB connected: careerconnect` and
   `CareerConnect server running at http://localhost:5000`.

## API changes

- `GET /api/jobs` — same response shape as before
  (`{ success, count, jobs }`), now reading from MongoDB. Supports
  `?search=python` for filtering.
- `GET /api/jobs/:id` — `:id` is now a MongoDB ObjectId, not the old
  numeric `1, 2, 3...`.
- `POST /api/jobs` — new: create a job.
- `POST /api/auth/register` — new: `{ email, password }` →
  `{ token, user }`.
- `POST /api/auth/login` — new: `{ email, password }` →
  `{ token, user }`, only succeeds if the password matches the hash
  stored in MongoDB.

## Heads-up: your frontend isn't calling this API yet

Both `App.jsx`/`LoginModal.jsx` (React) and `script.js` (vanilla)
currently keep their own hardcoded `jobs` array and "log in" by just
writing to `localStorage` — they never talk to `server.js` at all.
Wiring MongoDB into the backend doesn't change what the page shows
until the frontend is updated to `fetch("/api/jobs")` and
`fetch("/api/auth/login", ...)` instead. Happy to do that next if you
want the login/job list to actually be backed by the database.
