# HireForm MVP 🚀

HireForm is a premium Client-Server MERN stack recruiting application designed to allow recruiters to build custom application forms with dynamic fields and track applicant submissions in real-time.

---

## 🛠️ Tech Stack & Features

*   **Frontend**: React, React Router 6, Axios, Tailwind CSS, Google OAuth SDK, Lucide Icons.
*   **Backend**: Node.js, Express.js, MongoDB Atlas (via Mongoose), JWT authentication.
*   **Authentication**: Integrated Google OAuth Sign-in & **Developer Mock Login Bypass** (for fast local development and testing).
*   **Form Builder**: Add, edit, and preview dynamic fields (Short Answer, Long Answer, Dropdowns, and Resume uploads) live.
*   **Candidate Form**: Public candidate-facing page with slug URL generator, field validations, and elegant success state.
*   **Submission Pipeline**: Recruiter panel to view applicant answers, filter/sort submissions, download uploaded file names, and dynamically update candidate status stages (New, Reviewed, Shortlisted, Rejected).

---

## 🚀 Getting Started

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v16+) and [MongoDB](https://www.mongodb.com/) installed and running locally on your system.

### 2. Backend Setup
1.  Navigate into the `server` directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure variables in `server/.env` (defaults are pre-configured to point to a local MongoDB instance):
    ```env
    PORT=5000
    MONGO_URI=mongodb://127.0.0.1:27017/hireform
    JWT_SECRET=super_secret_jwt_key_hireform_12345
    GOOGLE_CLIENT_ID=your-google-oauth-client-id
    ```
4.  Start the Express server:
    ```bash
    npm run dev
    ```

### 3. Frontend Setup
1.  Return to the root workspace folder:
    ```bash
    cd ..
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Vite development web server:
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 💡 Developer Guest Login Bypass
If you haven't set up a Google OAuth Client ID yet, don't worry! I've implemented a **Guest Recruiter Mock Sign-in** feature:
*   On the login page, click the **"Sign in as Guest Recruiter"** button.
*   It immediately makes a secure request to the backend developer auth bypass endpoint, issues a valid JWT token, and logs you into a fully operational mock environment so you can test all features (Form creation, slug generation, candidate submissions, status transitions) locally and immediately!
