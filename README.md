# 🔥 Roast&Rich — Roast First. Rich Later.

> **India's Gen Z Financial Co-Pilot** — Brutally honest AI that roasts your bad spends, builds your budget, tracks your goals, and shows you exactly how to get to ₹1 Crore. No boring finance lecture, ever.

---

## 🏆 Hackathon Submission

| Field | Details |
|---|---|
| **Event** | Protex: Hack-2-Win — IGDTUW |
| **Track** | Track 3: Personal Finance & Wealth |
| **Team** | Vaishnavi Shukla · Rishija Kumari · Aashima |
| **College** | Indira Gandhi Delhi Technical University for Women (IGDTUW) |

---

## 🚀 Live Demo

🌐 **[Deployed Link →]()**

---

## 📸 Screenshots

> 
---

## 💡 The Problem We're Solving

India has a **massive financial literacy gap** for young people:

- Schools teach Pythagoras theorem — but **zero personal finance**
- UPI makes money feel invisible → people spend 20–30% more digitally
- Social media creates unrealistic wealth illusions → FOMO spending
- Existing finance apps are built for 40-year-old finance bros, not 19-year-olds in hostels

**Roast&Rich** is the app we wish existed at 18 — honest, smart, and built for Gen Z.

---

## ✨ Features

### 🔥 Money Roast
Enter your monthly spending by category. Get a **brutal, personalised AI roast** of your habits — then a real fix plan. Specific to your highest spend, not generic advice.

### 🚦 FOMO Filter
About to make an impulse buy? Enter the item + amount — get a **math-backed verdict** (Go For It / Wait / Bad Idea) before you tap Pay. Accounts for your actual budget, remaining balance, and goal impact.

### 📈 Wealth Builder
Live **compounding chart** showing your money growing from today to retirement. Every slider — SIP amount, return rate, years — updates the projection in real time.

### 📊 Smart Budget
AI generates a **personalised monthly budget** for your city and life situation. Includes a donut chart breakdown and practical tips per category.

### 🎯 Goal Tracker
Set goals (Car, House, Trip, Gadget, Emergency Fund) with target amounts and timelines. Get the **monthly savings target** and feasibility check for each goal. AI generates a unique strategy per goal type.

### 📅 Daily Expense Tracker
Log every expense as it happens with categories and notes. **Streak tracking**, monthly totals, and recent history — all in one place.

### 🧠 Mood Tracker
Daily 2-minute check-in: how do you feel about your money today? Did you regret a purchase? Did you save? Over time, **emotional spending patterns** emerge.

### 🏆 Rewards & Badges
Gamified badges (Money Moves, Anti-FOMO Legend, Budget God...) and a **Financial Personality Score** — calculated from savings rate, streaks, mood logs, and spending discipline.

### 💬 AI Chat
Chat with an AI that already knows your full profile — income, goals, city, savings. Ask anything about budgeting, investing, or goal planning. Context-aware every time.

### 📝 Financial Blog
6 in-depth articles covering SIP basics, FIRE movement, mutual funds, Gen Z money psychology, 20 key financial terms — all written in plain, Gen Z-friendly English.

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| **Frontend** | HTML5, CSS3 (custom design system), Vanilla JavaScript |
| **AI** | Anthropic Claude API (`claude-haiku`) / OpenAI GPT-3.5 (user-provided key) |
| **Charts** | Chart.js 4.4.1 |
| **Auth & Sync** | Firebase (Email/Password + Google OAuth) with localStorage fallback |
| **Fonts** | Plus Jakarta Sans (display) + Instrument Sans (body) |
| **Deployment** | Netlify (static hosting) |
| **Design** | Custom CSS design system — dark/light theme, CSS variables, responsive |

---

## 📁 Project Structure

```
roast-and-rich/
│
├── index.html              # Landing page
├── onboarding.html         # 3-step profile setup
├── dashboard.html          # Main dashboard
│
├── roast.html              # Money Roast tool
├── fomo.html               # FOMO Filter tool
├── wealth.html             # Wealth Builder + chart
├── budget.html             # Smart Budget generator
├── goals.html              # Goal Tracker
├── tracker.html            # Daily Expense Tracker
├── mood.html               # Mood Tracker
├── rewards.html            # Badges + Personality Score
├── chat.html               # AI Chat
│
├── blog.html               # Blog listing
├── blog-1.html             # What is Roast&Rich?
├── blog-2.html             # SIP Explained
├── blog-3.html             # Your FIRE Number
├── blog-4.html             # Why Gen Z Struggles
├── blog-5.html             # Mutual Funds Explained
├── blog-6.html             # 20 Finance Terms
│
├── vision.html             # Vision page
├── mission.html            # Mission + Team
├── settings.html           # Settings + API key
├── auth.html               # Login / Signup
│
├── app.js                  # Core logic — AI, state, engines, helpers
├── firebase-config.js      # Firebase config + DB abstraction layer
├── style.css               # Full design system (dark/light, responsive)
└── _navbar.html            # Universal navbar snippet
```

---

## ⚙️ Setup & Running Locally

### Option 1 — Just open in browser (no server needed)

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
# Open index.html in any browser
```

> The app works fully offline with smart mock AI responses. No server, no install, no dependencies.

### Option 2 — With live AI (optional)

1. Get a free API key from [platform.openai.com](https://platform.openai.com) or [console.anthropic.com](https://console.anthropic.com)
2. Open the app → go to **Settings** → paste your API key
3. All AI tools (Roast, Chat, Budget, Goal Strategy) now use the real model

### Option 3 — With Firebase sync (optional)

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Email/Password + Google** authentication
3. Create a **Firestore Database** (test mode)
4. Copy your Firebase config into `firebase-config.js`
5. Data now syncs across devices automatically

---

## 🧠 How the AI Works

The app has **two AI modes**:

**Without API key (Demo Mode):**
- Smart mock responses built into `app.js`
- Context-aware based on the user's actual profile (income, city, goals)
- FOMO Filter, Roast Engine, and Goal Strategies work fully offline
- Sufficient for demo and judging

**With API key (Live Mode):**
- Calls Claude Haiku or GPT-3.5 with the user's full financial profile as context
- Personalised responses to any financial question
- Budget generator and goal strategies powered by real AI

---

## 👥 Team

| Name | Role |
|---|---|
| **Vaishnavi Shukla** | Full-Stack Developer · AI Integration · Core App Logic · Feature Ideation |
| **Rishija Kumari** | Feature Ideation · PPT Design · Content Strategy |
| **Aashima** | Feature Ideation · Presentation · UX Feedback |

---

## 📊 Evaluation Criteria — How We Address Each

| Criteria | How Roast&Rich delivers |
|---|---|
| **Innovation & Creativity (25%)** | FOMO Filter is unique — no other personal finance app gives a real-time, math-backed spend verdict before purchase. The "Roast" concept itself is novel. |
| **Technical Execution (25%)** | 25+ page app with a custom design system, Firebase auth, Chart.js integration, AI API abstraction, localStorage fallback, full mobile responsiveness |
| **Problem–Solution Fit (20%)** | Directly addresses the Gen Z financial literacy gap — language, tone, and features designed specifically for 13–28 year olds in India |
| **Impact & Scalability (20%)** | Works offline, deploys for free, Firebase enables cross-device sync. Roadmap includes mobile app, UPI statement import, and Hindi UI. |
| **Presentation & Demo (10%)** | App is fully functional and demoable live — all 6 core tools, blog, vision, and onboarding flow work end-to-end |

---

## 🗺️ Roadmap

- [x] Core 6 tools (Roast, FOMO, Wealth, Budget, Goals, Tracker)
- [x] AI Chat with full profile context
- [x] Mood Tracker + Rewards/Badges system
- [x] Financial Blog (6 articles)
- [x] Firebase auth (Email + Google)
- [x] Dark / Light theme
- [x] Full mobile responsiveness
- [ ] UPI statement import (auto-categorise real spending)
- [ ] Push notifications for streak reminders
- [ ] Hindi UI
- [ ] Android + iOS app
- [ ] School/college curriculum integration

---

## 📄 License

MIT License — open source, built for impact.

---

*Built with ❤️ at IGDTUW for Protex Hackathon 2026*