## ResearchNest

A full-stack web application for managing research progress, profiles, and collaboration between faculty and students.

The latest code for this project can be found at this git repo link - https://github.com/Rahul99Saha/ResearchNest

## Features

- User authentication (login/signup)
- Role-based dashboards for faculty and students
- Progress tracking and visualization
- Profile management
- RESTful API backend

## Technologies Used

- **Backend:** Node.js, Express, MongoDB, dotenv, CORS
- **Frontend:** React, Context API, CSS

## Folder Structure

ResearchNest/
├── Backend/
│ ├── src/
│ │ ├── controllers/
│ │ ├── middleware/
│ │ ├── models/
│ │ ├── routes/
│ │ ├── config/
│ │ ├── seed/
│ │ ├── tests/
│ │ ├── utils/
│ │ └── server.js
│ └── package.json
├── Frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── contexts/
│ │ ├── pages/
│ │ ├── api.js
│ │ ├── App.js
│ │ └── index.js
│ ├── public/
│ └── package.json
└── sql_and_nosql_solutions.md.txt

## Setup Instructions

### Backend

1. Navigate to the Backend folder:

   cd Backend

2. Install dependencies:

   npm install

3. Create a `.env` file with your environment variables (e.g., MongoDB URI, PORT).
4. Start the server:

   npm start

   The backend runs on `http://localhost:5001` by default.

### Frontend

1. Navigate to the Frontend folder:

   cd Frontend

2. Install dependencies:

   npm install

3. Start the React app:

   npm start

   The frontend runs on `http://localhost:3000` by default.

## Usage

- Access the frontend at `http://localhost:3000`.
- Register or log in as a user.
- Use the dashboard to manage research progress and profiles.
- Use the profile to see the profile page of the user.

## MERN Implementation Details

ResearchNest uses the MERN stack:

- **MongoDB**: Stores user, profile, and progress data in a flexible document structure.
- **Express.js**: Handles RESTful API endpoints, authentication, and business logic.
- **React.js**: Provides interactive dashboards and profile management for students and faculty.
- **Node.js**: Runs the backend server and connects all components.

### Key Backend Endpoints

- `/api/auth` — User registration and login
- `/api/profile` — Profile management and retrieval
- `/api/progress` — Progress tracking and updates

### Key Frontend Components

- `Dashboard/StudentDashboard.js` and `Dashboard/FacultyDashboard.js` — Role-based dashboards
- `Auth/Login.js` and `Auth/SignUp.js` — Authentication UI
- `Profile.js` — Profile page with editable sections

## Design Decisions

- **Role-based Access**: Separate dashboards and permissions for students and faculty. Admin role can be added for future scalability.
- **Progress Hierarchy**: Milestones, stages, tasks, and subtasks are modeled as nested objects for flexible tracking and easy progress propagation.
- **RESTful API**: Clean separation between frontend and backend via REST endpoints. All data exchange is in JSON format.
- **Context API**: Used for global authentication state in React, enabling protected routes and user session management.
- **Reusable UI Components**: Card, Button, Input, etc. for consistent design and maintainability.
- **Environment Variables**: Sensitive data (DB URI, JWT secret) is managed via `.env` files and never hardcoded.
- **Testing**: Basic test structure provided for backend authentication. Extendable for more endpoints and frontend components.
- **Seeding**: Optional seed script for initial database population (students, faculty, templates).
- **Error Handling**: Centralized error handler for backend API responses.

## Solution Diagram

```
+-------------------+        +-------------------+        +-------------------+
|   React Frontend  | <----> |   Express Server  | <----> |   MongoDB         |
|  (Student/Faculty)|        |   (Node.js)       |        |   (Database)      |
+-------------------+        +-------------------+        +-------------------+
        |                        |                            |
        |  REST API calls        |  Mongoose Models           |
        +----------------------->+--------------------------->+

User <-> AuthContext <-> API.js <-> Express <-> Mongoose <-> MongoDB
```

## Assumptions

- All users are either students or faculty; admin role is reserved for future use.
- Each student is supervised by one faculty member; faculty can supervise multiple students.
- Progress is tracked hierarchically: milestones > stages > tasks > subtasks.
- Authentication uses JWT tokens stored in localStorage.
- MongoDB is available and accessible at the URI specified in `.env`.
- Frontend and backend run on separate ports (`3000` and `5001` respectively) during development.
- Email addresses are unique for all users.
- Initial data (users, templates) have to be seeded for demo/testing purposes.
- No file uploads or external integrations are implemented in this version.
- All API requests are assumed to be from trusted frontend clients (CORS is restricted to localhost).
