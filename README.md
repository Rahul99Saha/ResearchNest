# 🌱 ResearchNest

> **A full-stack MERN application for managing research progress, profiles, and collaboration between faculty and students.**

🔗 Latest Code: [ResearchNest GitHub Repo](https://github.com/Rahul99Saha/ResearchNest)

---

## ✨ Features

- 🔐 **User Authentication** — Signup/Login with JWT
- 🎭 **Role-Based Dashboards** — Separate views for Faculty and Students
- 📊 **Progress Tracking** — Milestones, Stages, Tasks, Subtasks
- 👤 **Profile Management** — Academic & Research profiles
- 🌐 **RESTful API** — Clean separation between frontend & backend

---

## 🛠️ Tech Stack

**Backend:** `Node.js` · `Express` · `MongoDB` · `dotenv` · `CORS`
**Frontend:** `React` · `Context API` · `Tailwind/CSS`

---

## 📂 Project Structure

```
ResearchNest/
├── Backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── config/
│   │   ├── seed/
│   │   ├── tests/
│   │   ├── utils/
│   │   └── server.js
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── api.js
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   └── package.json
│
└── sql_and_nosql_solutions.md.txt
```

---

## ⚡ Setup Instructions

### 🔹 Backend

```bash
cd Backend
npm install
```

1. Create a `.env` file with variables like:

   ```env
   MONGO_URI=your_mongo_uri
   PORT=5001
   JWT_SECRET=your_secret
   JWT_EXPIRES_IN=7d
   ```

2. Start server:

   ```bash
   npm start
   ```

➡ Runs on **[http://localhost:5001](http://localhost:5001)**

---

### 🔹 Frontend

```bash
cd Frontend
npm install
npm start
```

➡ Runs on **[http://localhost:3000](http://localhost:3000)**

---

## 🚀 Usage

1. Open the frontend at `http://localhost:3000`.
2. Register or log in as a student/faculty.
3. Access **dashboards** to track/manage progress.
4. Edit and view user **profiles**.

---

## 🔑 Key Implementation Details

### 📌 Backend API Routes

- `/api/auth` — Register & Login
- `/api/profile` — Profile management
- `/api/progress` — Track & update research progress

### 📌 Frontend Components

- `Dashboard/StudentDashboard.js` · `Dashboard/FacultyDashboard.js`
- `Auth/Login.js` · `Auth/SignUp.js`
- `Profile.js`

---

## 🧩 Design Decisions

- 🧑‍🤝‍🧑 **Role-Based Access** → Faculty & Student dashboards, scalable for Admins
- 📈 **Progress Hierarchy** → `Milestones > Stages > Tasks > Subtasks`
- 🔗 **RESTful API** → JSON-based client-server communication
- 🎯 **React Context API** → Global state for authentication
- 🛠️ **Reusable Components** → Consistent UI (Card, Button, Input)
- 🔒 **Environment Variables** → Secured secrets in `.env`
- ✅ **Testing Ready** → Basic backend tests, extendable
- 🌱 **Seed Data Support** → Preload initial templates, users
- ⚡ **Error Handling** → Centralized middleware for clean API responses

---

## 📊 Solution Diagram

```
+-------------------+        +-------------------+        +-------------------+
|   React Frontend  | <----> |   Express Server  | <----> |   MongoDB         |
| (Student/Faculty) |        |     (Node.js)     |        |   (Database)      |
+-------------------+        +-------------------+        +-------------------+
        |                        |                            |
        |  REST API calls        |  Mongoose Models           |
        +----------------------->+--------------------------->+
```

👉 Flow: **User ↔ AuthContext ↔ API.js ↔ Express ↔ Mongoose ↔ MongoDB**

---

## 📌 Assumptions

- Students have one supervisor; faculty can supervise many.
- Progress is always hierarchical.
- JWT tokens stored in `localStorage`.
- MongoDB must be running & accessible via `.env` URI.
- Unique email for every user.
- CORS restricted to localhost in dev.
- No file uploads/external services yet.

---

## 🎯 Future Improvements

- ✅ Admin role for user & progress oversight
- 📁 File upload support (papers, reports)
- 🔔 Notifications & reminders
- 📊 Analytics dashboard for supervisors

---

✨ **ResearchNest: Helping students & faculty track research progress seamlessly.**
