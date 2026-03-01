# SkillSync — Technical Documentation

## 🚀 Architecture Overview

SkillSync is a modern, full-stack Next.js application designed to seamlessly bridge the gap between academic progress and industry requirements. The architecture is built for scale, real-time data synchronization, and AI-driven insights.

### Technical Stack

- **Framework**: Next.js 15 (App Router) with React 19.
- **Backend Services**: Firebase Cloud Firestore (NoSQL Document Database).
- **Authentication**: NextAuth.js with Credentials Provider (Custom Firebase integration).
- **Data Visualization**: Recharts for dynamic, responsive dashboards.
- **Styling**: Vanilla CSS utilizing CSS Custom Properties (Design Tokens) for robust Light/Dark mode theming.
- **Icons & Animation**: Lucide React, Framer Motion.

## 🗄️ Database Architecture (Firestore)

SkillSync utilizes a NoSQL document structure in Firebase Cloud Firestore. Key collections include:

- **`users`**: Centralized user registry with role-based access control.
  - Fields: `name`, `email`, `role` (STUDENT, FACULTY, ADMIN), `password` (hashed).
- **`students`**: Detailed academic and performance records.
  - Fields: `name`, `email`, `department`, `registerNumber`, `performance` (%), `attendance` (%), `risk` (Low/Medium/High), `avatar`, `avatarColor`.
- **`faculty`**: Faculty assignment and department tracking.
  - Fields: `name`, `email`, `department`, `subject`.

## 🧠 AI Intelligence Layer

The platform utilizes a structured intelligence layer to provide predictive and prescriptive insights.

1. **Dropout Prediction (Risk Assessment)**: 
   - *Implementation*: Calculates risk based on real-time academic performance, attendance metrics, and engagement logs. Students are categorized into Low, Medium, and High-risk tiers.
   - *Future State*: Integration of deep learning models processing extensive historical behavioral analytics for earlier and more accurate anomaly detection.

2. **Skill Gap Analysis & Industry Alignment**:
   - *Implementation*: Maps individual student proficiencies against static demand levels for key tech industry skills (Programming, Cloud, DevOps, AI/ML, etc.) via Radar metrics.
   - *Future State*: Connecting to live job-market APIs (LinkedIn, Indeed) to pull real-time demand weights and calculate Cosine Similarity against student skill vectors.

3. **Learning Recommendations**:
   - *Implementation*: Generates targeted, role-specific roadmaps based on identified skill gaps (e.g., suggesting specific certifications when Cloud Architecture readiness drops below industry demand).
   - *Future State*: Integration with LLMs (e.g., Google Gemini, OpenAI GPT-4) to dynamically generate hyper-personalized, day-by-day learning matrices.

## 👥 Role-Based Capabilities

### 1. **ADMIN**
- **System-wide Analytics**: View aggregate retention rates, average performance across all departments.
- **User Management**: Provision and manage official accounts for both University Students and Faculty.
- **System Monitoring**: Live tracking of API response times, active users, and system health.
- **Curriculum Alignment**: View institutional curriculum performance versus live industry demands.

### 2. **FACULTY**
- **Student Allocation**: Manage assigned students via real-time roster toggling.
- **Class-level Analytics**: Identify weak learners instantly with the "At-Risk" dashboard widget.
- **Performance Tracking**: Monitor attendance and GPA trends over academic terms.

### 3. **STUDENT**
- **Personal Dashboard**: View individual CGPA, Skill Readiness scores, and AI Rank percentiles.
- **Learning Roadmaps**: Access personalized recommendations to bridge identified skill gaps.
- **Career Boost Metrics**: Track progress towards specific industry readiness.

## 🛠️ Local Development

1. **Install Dependencies**: 
   ```bash
   npm install
   ```
2. **Setup Firebase Config**:
   Ensure `firebaseConfig.js` reflects your active Firebase project settings.
3. **Environment Setup**:
   Create `.env.local`:
   ```env
   NEXTAUTH_SECRET=your_generated_secret
   NEXTAUTH_URL=http://localhost:4000
   ```
4. **Populate Database (Optional)**:
   Run the seeding script to populate Firestore with initial data:
   ```bash
   node lib/seed_firestore.js
   ```
5. **Run Development Server**:
   ```bash
   npm run dev
   ```

## ☁️ Production Deployment

1. **Hosting**: The application is optimized for **Vercel**.
2. **Environment Variables**: Ensure all NextAuth and Firebase secrets are added to your hosting platform's environment settings.
3. **Firebase Security Rules**: Before production, ensure proper Firestore security rules are applied to prevent unauthorized data access, utilizing the verified user roles (`request.auth.token.role`).
