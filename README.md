# 🧞✨ **PathGenie** – A Genie That Finds Your Path

An AI-powered career guidance platform that helps engineering students discover their ideal tech career path through intelligent profiling and personalized recommendations.

🔗 **Live Demo:** [pathgenie.lovable.app](https://pathgenie.lovable.app)

## ✨ Features

- 🧠 **AI Career Analysis** — 19-question adaptive quiz analyzed by Google Gemini AI
- 📊 **4 Ranked Recommendations** — Fit scores, salary data, skill gaps, and roadmaps
- 💬 **AI Chatbot** — Context-aware follow-up career Q&A
- 📈 **Interactive Charts** — Radar, bar, and pie chart visualizations
- 📄 **PDF Reports** — Branded, downloadable career analysis reports
- 📧 **Email Delivery** — Send reports directly to your inbox
- 🔗 **Shareable Results** — Unique URLs to share with friends/mentors
- ✅ **Progress Tracker** — Track your career roadmap completion
- 🌙 **Dark/Light Theme** — System-aware theme switching
- 📱 **Fully Responsive** — Optimized for mobile, tablet, and desktop

## 🛠️ Tech Stack

| Frontend | Backend | AI | Tools |
|----------|---------|----|----|
| React 18 | Supabase Edge Functions | Google Gemini 3 Flash | jsPDF |
| TypeScript 5 | PostgreSQL | Structured Tool Calling | Recharts |
| Tailwind CSS 3 | Deno Runtime | OpenAI-compatible API | Framer Motion |
| Vite 5 | Row-Level Security | | canvas-confetti |
| shadcn/ui + Radix | Resend (Email) | | Lucide Icons |

## 🏗️ Architecture

- **Frontend:** React SPA with component-based architecture
- **Backend:** 3 serverless edge functions (career analysis, chatbot, email)
- **Database:** PostgreSQL with 2 tables and RLS policies
- **AI:** Google Gemini with structured JSON tool calling for typed responses
- **Deployment:** Lovable Cloud with auto-scaling

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/pathgenie.git

# Install dependencies
npm install

# Start development server
npm run dev
