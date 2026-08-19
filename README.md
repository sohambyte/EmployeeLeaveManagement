# Employee Leave Management System

A simple, full-stack Employee Leave Management web application built for an intern assessment.

## 🚀 Tech Stack

- **Frontend**: React.js, Vite, React Router DOM v6, Axios, Bootstrap 5
- **Backend**: Java 17, Spring Boot 3, Spring Web, Spring Data JPA, Spring Security, BCrypt, JWT Authentication
- **Database**: MySQL 8.0+

--
## 📁 Project Structure

```
EmployeeLeaveManagement/
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/leavemanagement/
│       ├── controller/       # AuthController, LeaveController, AdminLeaveController
│       ├── service/          # AuthService, LeaveService
│       ├── repository/       # UserRepository, LeaveRequestRepository
│       ├── entity/           # User, LeaveRequest
│       ├── security/         # SecurityConfig, JwtUtil, JwtFilter, UserDetailsServiceImpl
│       ├── dto/              # LoginRequest, RegisterRequest, AuthResponse, LeaveRequestDto, etc.
│       └── exception/        # GlobalExceptionHandler, Custom Exceptions
├── frontend/
│   ├── src/
│   │   ├── api/              # axios.js (Axios instance + Bearer Token Interceptor)
│   │   ├── components/       # Navbar.jsx, ProtectedRoute.jsx
│   │   └── pages/            # Login.jsx, Register.jsx, Dashboard.jsx, ApplyLeave.jsx, MyLeaves.jsx, AdminLeaves.jsx
│   └── package.json
└── sql/
    ├── schema.sql            # Table DDL & Indexes
    └── queries.sql           # Assessment SQL Queries
```

---

## 🛢️ 1. Database Setup (MySQL)

1. Open your MySQL client (MySQL Workbench or Command Line).
2. Execute `sql/schema.sql` to create database `leave_management_db` and tables `users` and `leave_requests`.

```bash
mysql -u root -p < sql/schema.sql
```

---

## ⚙️ 2. Backend Setup (Spring Boot)

1. Navigate to the `backend` directory.
2. Ensure MySQL is running on port `3306`. You can configure database credentials in `backend/src/main/resources/application.properties` or pass environment variables:

```properties
spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/leave_management_db?createDatabaseIfNotExist=true}
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:root}
```

3. Build and run the Spring Boot application:

```bash
mvn clean install
mvn spring-boot:run
```

Backend will run on **`http://localhost:8080`**.

---

## 💻 3. Frontend Setup (React + Vite)

1. Navigate to the `frontend` directory.
2. Install node dependencies:

```bash
npm install
```

3. Start the Vite development server:

```bash
npm run dev
```

Frontend will run on **`http://localhost:3000`** (or `http://localhost:5173`).

---

## 🔐 4. Authentication & Security Rules

- Passwords are securely hashed with **BCrypt**.
- Authentication uses stateless **JWT tokens** stored in `localStorage`.
- All requests sent by **Axios** attach `Authorization: Bearer <token>` automatically via the request interceptor in `src/api/axios.js`.
- Employees can only view, update, and delete their **own** leave requests (enforced at service level using authenticated user identity).
- Only **PENDING** leave requests can be updated or deleted by employees.
- Admins have access to the Admin Portal (`/admin-leaves`) to view all requests and Approve/Reject them.

---

## 📡 5. Backend REST API Endpoints

| Method | Endpoint | Description | Role Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Login user and obtain JWT token | Public |
| `GET` | `/api/leaves` | Get all leave requests for current employee | EMPLOYEE / ADMIN |
| `POST` | `/api/leaves` | Apply for a new leave request | EMPLOYEE / ADMIN |
| `PUT` | `/api/leaves/{id}` | Update a pending leave request | EMPLOYEE (Owner only) |
| `DELETE` | `/api/leaves/{id}` | Delete/cancel a pending leave request | EMPLOYEE (Owner only) |
| `GET` | `/api/admin/leaves` | List all employee leave requests | ADMIN |
| `PUT` | `/api/admin/leaves/{id}/status` | Approve or Reject a leave request | ADMIN |

---

## 📊 6. SQL Assessment Queries

All assessment SQL queries are provided in `sql/queries.sql`:
1. Display all users.
2. Display leave requests for a specific user.
3. Count requests by status.
4. Find pending requests.
5. Find approved requests ordered by date.
6. Join users with leave requests.
7. Update request status.
8. Delete a pending request.
