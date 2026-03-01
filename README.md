<div align="center">
  <img src="public/favicon.ico" alt="SkillSync Logo" width="80" height="80" />
  <h1>SkillSync</h1>
  <p><strong>AI-Powered Smart Education Platform</strong></p>
  <p>Bridge the gap between academic progress and industry requirements with real-time analytics, AI-driven dropout prediction, and personalized career roadmaps.</p>
</div>

<br/>

## 🌟 Overview

SkillSync is a comprehensive, full-stack Next.js application designed for modern educational institutions. It empowers students, faculty, and administrators with intelligent insights, moving beyond traditional grading to focus on real-world skill alignment and proactive student retention.

## ✨ Key Features

- **Predictive Analytics for Retention**: AI models identify at-risk students before dropout patterns emerge, allowing for early intervention.
- **Skill Gap Analyzer**: Compares student proficiency against live job market demands, highlighting exact skills needed for career readiness.
- **Dynamic Learning Roadmaps**: Generates personalized learning paths tailored to a student's career goals and current academic standing.
- **Role-Based Access Control**: Secure, tailor-made dashboards for Students, Faculty, and Administrators.
- **Real-Time Dashboards**: Track engagement, grades, and attendance in real-time with granular, visually stunning analytics.
- **Curriculum vs Industry Alignment**: AI-driven analysis comparing institutional curriculum with current industry trends.

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 (App Router), React 19
- **Authentication**: NextAuth.js (Credentials Provider)
- **Database & Backend**: Firebase (Cloud Firestore)
- **Styling**: Vanilla CSS, CSS Modules, Global Design Tokens
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Animation**: Framer Motion

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js (v18.17.0 or higher) installed.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/skillsync.git
   cd skillsync
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add the necessary Firebase and NextAuth credentials (see `DOCUMENTATION.md` for details).

4. **Start the Development Server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:4000](http://localhost:4000) (or the port specified in your console) in your browser.

## 📚 Documentation

For detailed information on architecture, the AI intelligence layer, database schema, and deployment instructions, please refer to the [`DOCUMENTATION.md`](DOCUMENTATION.md) file.

## 📄 License

This project is licensed under the MIT License.
