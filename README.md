# 🌟 TeenTrack - Teenage Expense & Pocket Money Tracker

A modern, secure, full-stack web application designed specifically for teenagers to track their pocket money, daily expenses, understand their spending patterns through interactive graphical charts, and receive friendly, practical financial suggestions.

Built with **React.js (Vite)**, **Node.js (Express.js)**, **bcrypt password hashing**, and **Supabase PostgreSQL**. Designed throughout in **Indian Rupees (₹ INR)**.

---

## 📸 Key Features

1. **Teen-Friendly Dashboard**:
   - Total money received this month (pocket money, gifts, part-time earnings).
   - Total monthly expenses and current remaining balance.
   - Live savings rate percentage & amount saved in goals.
   - Highest spending category badge.
   - Recent activity list with one-click actions.
   - Non-judgmental financial health insights.

2. **Income & Expense Tracking**:
   - **Expenses**: Food, Transport, Shopping, Entertainment, Education, Mobile/Internet, Health, Gifts, Other.
   - **Income / Pocket Money**: Pocket Money, Scholarship, Gift, Part-time income, Other.
   - Payment methods: Cash, UPI, Card, Bank Transfer, Other.
   - Optional notes and date picker.

3. **Transaction History & Management**:
   - Real-time search across descriptions and categories.
   - Filter by Type (Income / Expense), Category, and Date range.
   - Sort by Newest or Oldest.
   - Edit and Delete with confirmation modal dialogs.

4. **Graphical Analytics (Interactive Recharts)**:
   - **Donut Chart**: Expense distribution by category.
   - **Bar Chart**: Income vs Expenses month-by-month (last 6 months).
   - **Line Chart**: Daily spending trends over time.
   - **Bar Chart**: Net pocket savings month-by-month.

5. **Smart Spending Insights Engine**:
   - Rule-based suggestions analyzing actual spending data.
   - Flags unusually high food (>35%), entertainment (>25%), or transport expenses.
   - Suggests setting weekly budgets, using student transit passes, or applying the 24-hour waiting rule for shopping.
   - Encourages "Pay Yourself First" savings habits when savings rate is low.
   - **Strict Teen Constraint**: Never recommends loans, credit cards, or risky investments.

6. **Category Budget System**:
   - Set monthly spending limits per category (e.g., Food: ₹2,000, Entertainment: ₹1,000).
   - Dynamic progress bars with real-time percentage indicators.
   - Automated warnings at 80% usage and alerts at 100% limit breach.

7. **Wishlist & Savings Goals**:
   - Create targets like "Wireless Headphones", "College Supplies", "Birthday Gift".
   - Set target amount (₹) and target date.
   - Quick one-click deposit button (+ ₹100, + ₹500, or custom amount) to watch savings progress grow.

8. **Security & Data Privacy**:
   - Password hashing with **bcrypt** (salt rounds = 10). Plain-text passwords are never stored.
   - JWT sessions with token verification.
   - User identity derived strictly from verified tokens (`req.user.id`).
   - Centralized error handler suppressing backend stack traces.
   - Protected against API abuse with Helmet, CORS, and Express rate limiting.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router DOM, Recharts, Lucide Icons, Vanilla CSS Design System |
| **Backend** | Node.js, Express.js, JWT, bcryptjs, Helmet, CORS, express-rate-limit |
| **Database** | Supabase PostgreSQL (with automatic resilient local fallback engine for offline development) |
| **Currency** | Indian Rupee (₹ INR) |

---

## 🏗️ Architecture

```
React (Vite Frontend)
        │
        ▼ (HTTPS REST API / JWT Auth)
Express.js (Node Backend)
        │
        ▼ (PostgreSQL Queries / RLS)
Supabase Database (or local resilient store)
```

The React frontend communicates **ONLY** through the Express.js backend APIs. Sensitive database keys, passwords, and server logic are never exposed to the frontend browser.

---

## 📁 Project Structure

```
teenage-expense-tracker/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BudgetModal.jsx
│   │   │   ├── ConfirmModal.jsx
│   │   │   ├── GoalModal.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── SmartTips.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── TransactionModal.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx
│   │   ├── pages/
│   │   │   ├── Analytics.jsx
│   │   │   ├── Budgets.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── SavingsGoals.jsx
│   │   │   └── Transactions.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   └── formatters.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── public/
│   │   └── favicon.svg
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   └── .env
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── env.js
│   │   ├── controllers/
│   │   │   ├── analyticsController.js
│   │   │   ├── authController.js
│   │   │   ├── budgetController.js
│   │   │   ├── savingsGoalController.js
│   │   │   └── transactionController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── errorHandler.js
│   │   │   └── validatorMiddleware.js
│   │   ├── models/
│   │   │   ├── Budget.js
│   │   │   ├── SavingsGoal.js
│   │   │   ├── Transaction.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── analyticsRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── budgetRoutes.js
│   │   │   ├── savingsGoalRoutes.js
│   │   │   └── transactionRoutes.js
│   │   ├── services/
│   │   │   ├── suggestionEngine.js
│   │   │   └── supabaseService.js
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   └── responseHandler.js
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   ├── schema.sql
│   ├── .env.example
│   └── .env
│
├── schema.sql
├── README.md
└── .gitignore
```

---

## 🗄️ Database Schema & Supabase Setup

The complete PostgreSQL migration script is provided in [`schema.sql`](file:///c:/Users/devsh/OneDrive/Desktop/aditiv/schema.sql).

### 1. Tables:
- **`users`**: `id (UUID)`, `name`, `email (UNIQUE)`, `password_hash`, `created_at`
- **`transactions`**: `id (UUID)`, `user_id (FK)`, `type (income/expense)`, `amount`, `category`, `description`, `payment_method`, `transaction_date`, `notes`, `created_at`, `updated_at`
- **`budgets`**: `id (UUID)`, `user_id (FK)`, `category`, `amount`, `month (YYYY-MM)`, `created_at`, `updated_at`
- **`savings_goals`**: `id (UUID)`, `user_id (FK)`, `title`, `target_amount`, `current_amount`, `target_date`, `created_at`, `updated_at`

### 2. Supabase Cloud Setup Steps:
1. Log in to [Supabase](https://supabase.com) and create a new project.
2. Navigate to the **SQL Editor** tab in the Supabase Dashboard.
3. Open [`schema.sql`](file:///c:/Users/devsh/OneDrive/Desktop/aditiv/schema.sql), paste its contents, and click **Run**.
4. Go to **Project Settings** -> **API**, copy your `Project URL` and `anon public` key (or `service_role` key).
5. Paste them into `backend/.env`:
   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_KEY=your-supabase-key
   ```
> **Note**: Even if Supabase credentials are not provided during development, the backend automatically uses its built-in resilient local storage engine so the app runs out-of-the-box!

---

## ⚙️ Environment Variables

### Backend (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=super_secure_teenage_expense_tracker_secret_token_2026
JWT_EXPIRES_IN=7d
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### Frontend (`frontend/.env`):
```env
VITE_API_BASE_URL=/api
```

---

## 🚀 How to Run the Project

### Prerequisites:
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Start the Backend API Server:
```bash
cd backend
npm install
npm run dev
```
*The backend server will start on `http://localhost:5000` with live reload.*

### 2. Start the Frontend React Client:
```bash
cd frontend
npm install
npm run dev
```
*The frontend will launch at `http://localhost:5173`.*

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user (name, email, password >= 6 chars) |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token |
| `POST` | `/api/auth/logout` | Invalidate session |
| `GET` | `/api/auth/me` | Fetch currently authenticated user |

### Transactions (`/api/transactions`) - Protected
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/transactions` | Query transactions (filters: type, category, date, search, sort) |
| `POST` | `/api/transactions` | Add expense or income transaction |
| `GET` | `/api/transactions/:id`| Retrieve single transaction by ID |
| `PUT` | `/api/transactions/:id`| Update an existing transaction |
| `DELETE`| `/api/transactions/:id`| Delete transaction |

### Budgets (`/api/budgets`) - Protected
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/budgets?month=YYYY-MM` | Fetch category budgets with calculated spent and status |
| `POST` | `/api/budgets` | Set or update monthly budget for a category |
| `DELETE`| `/api/budgets/:id` | Delete budget |

### Savings Goals (`/api/savings-goals`) - Protected
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/savings-goals` | Get all goals with progress percentage |
| `POST` | `/api/savings-goals` | Create a new target savings goal |
| `PUT` | `/api/savings-goals/:id` | Update savings goal |
| `POST` | `/api/savings-goals/:id/deposit` | Add money/deposit to goal |
| `DELETE`| `/api/savings-goals/:id` | Delete savings goal |

### Analytics (`/api/analytics`) - Protected
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/analytics/summary` | Fetch dashboard stats, health summary, and smart suggestions |
| `GET` | `/api/analytics/detailed` | Fetch category breakdown, monthly trends, and daily data for charts |

---

## 🧪 Testing the Complete Application Flow

1. **User Registration & Login**:
   - Go to `http://localhost:5173/register`.
   - Sign up with Name: `Aarav Sharma`, Email: `aarav@example.com`, Password: `password123`.
   - Instant redirect to Dashboard with welcome toast.
2. **Add Pocket Money (Income)**:
   - Click **"+ Income"** on top bar or Dashboard.
   - Enter `Amount: ₹3000`, `Source: Pocket Money`, `Method: UPI`, `Description: Monthly Allowance`.
   - Balance instantly updates to `₹3,000`.
3. **Add Daily Expenses**:
   - Click **"+ Expense"**.
   - Add `Amount: ₹450`, `Category: Food`, `Description: Burger & drinks with school buddies`, `Method: UPI`.
   - Add `Amount: ₹250`, `Category: Transport`, `Description: Metro recharge`, `Method: Card`.
   - Notice Remaining Balance updates to `₹2,300`.
4. **Inspect Smart Spending Suggestions**:
   - Check the **Smart Spending Insights** cards on the Dashboard.
   - Notice personalized feedback about saving habits and categories!
5. **Set Monthly Category Budgets**:
   - Navigate to **Budgets**.
   - Click **"Set Budget"** -> Category: `Food`, Limit: `₹1,500`.
   - Progress bar shows `₹450 / ₹1,500 (30% used)` in green.
6. **Create a Wishlist / Savings Goal**:
   - Navigate to **Savings Goals**.
   - Create Goal: Title: `Wireless Headphones`, Target: `₹2,500`, Target Date: end of next month.
   - Click **"Add Money to Goal"** -> Deposit `₹500`. Progress bar shows `20% Reached`!
7. **View Graphical Analytics**:
   - Navigate to **Analytics**.
   - Inspect the interactive Donut chart, Bar chart (Income vs Expense), and Daily trend Line chart. Hover to view precise rupee tooltips.

---

## 🛡️ Security Implementation Summary

- **Bcrypt**: All user passwords are salted with 10 rounds before storing in the database.
- **JWT Authorization**: Requests must pass a valid Bearer token in the `Authorization` header. User identity is derived from the verified token payload, never trusted from client parameters.
- **Input Validation**: Centralized model validators verify positive numeric amounts, valid categories, and valid email formats on both client and server.
- **Error Shielding**: Database errors and stack traces are caught by centralized middleware and never leaked to the client.
