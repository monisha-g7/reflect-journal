# Reflect - Intelligent Journaling Companion

<div align="center">
  <img src="./docs/logo.png" alt="Reflect Logo" width="120" />
  
  **Transform daily reflection into meaningful self-discovery**
  
  [Live Demo](#demo) • [Features](#features) • [Installation](#installation) • [Tech Stack](#tech-stack)
</div>

---

## 🎯 Problem Statement

While the mental health benefits of journaling are well-documented, many people struggle to maintain a consistent practice. They face:

- **"Blank page" anxiety** - Not knowing what to write about
- **Lack of guidance** - No prompts or structure to facilitate reflection
- **No pattern recognition** - Difficulty identifying meaningful trends in thoughts and emotions
- **Low engagement** - Journals become event logs rather than tools for growth

## 💡 Solution

**Reflect** is a private, empathetic, and intelligent journaling companion that makes self-reflection a seamless and insightful daily habit.

### Key Differentiators

1. **Context-Aware AI Prompts** - Not generic questions, but thoughtful prompts based on your mood, time of day, and recent entries
2. **Privacy-First Design** - All data stored locally on device; nothing leaves your browser
3. **Sentiment & Theme Analysis** - Automatic detection of emotional patterns and recurring topics
4. **Beautiful Visualizations** - Mood calendars, sentiment trends, and theme clouds
5. **Gentle AI Insights** - Weekly summaries that help connect the dots in your life

---

## ✨ Features

### 📝 Intelligent Journal Entry
- **Mood Check-in** - Start each entry by selecting how you feel (5 mood options)
- **Dynamic Prompts** - AI-generated questions that adapt to:
  - Current mood (supportive prompts for low moods)
  - Time of day (morning intentions vs evening reflection)
  - Recent themes from past entries
- **Distraction-free Writing** - Clean, minimal interface for focused reflection

### 📊 Analytics Dashboard
- **Mood Trends** - Visualize emotional patterns over time
- **Activity Calendar** - See your journaling consistency at a glance
- **Sentiment Score** - Track overall positivity in your writing
- **Streak Counter** - Gamification to encourage daily practice

### 🧠 AI-Powered Insights
- **Weekly Summaries** - "You wrote 5 entries this week. Work stress was a recurring theme, but your mood improved on days you mentioned exercise."
- **Pattern Detection** - Automatically identifies recurring themes (work, family, health, creativity, etc.)
- **Personalized Observations** - Thoughtful insights based on your unique patterns

### 📚 Journal History
- **Search** - Find past entries by keyword
- **Filter by Mood** - View all entries where you felt a certain way
- **Expandable Cards** - Quick preview with full detail on click
- **Theme Tags** - See detected themes for each entry

### ⚙️ Settings & Privacy
- **Claude API Integration** - Optional: Add your API key for enhanced AI features
- **Dark Mode** - Easy on the eyes for evening journaling
- **Demo Data** - Load sample entries to explore features
- **Data Management** - Clear all data with one click

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18 with Hooks |
| **Routing** | React Router v6 |
| **Styling** | Tailwind CSS + Custom CSS |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Date Handling** | date-fns |
| **Build Tool** | Vite |
| **AI Integration** | Claude API (Anthropic) |
| **Storage** | localStorage (privacy-first) |

---

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/reflect-journal.git

# Navigate to project directory
cd reflect-journal

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
# http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🔐 Privacy & Security

Reflect is designed with privacy as a core principle:

- **100% Local Storage** - All journal entries are stored in your browser's localStorage
- **No Server** - No backend, no database, no data transmission
- **No Tracking** - Zero analytics or tracking scripts
- **Optional AI** - Claude API integration is opt-in; without it, all features work offline
- **Minimal AI Context** - When using AI features, only mood and themes are sent, never full entries

---

## 🎨 Design Philosophy

### Visual Design
- **Soft, Organic Palette** - Sage greens, warm sand tones, calming dusk purples
- **Glass Morphism** - Subtle transparency and blur for depth
- **Generous Whitespace** - Breathing room for a calm experience
- **Thoughtful Typography** - Cormorant Garamond for headings, Source Sans for body

### UX Principles
- **Reduce Friction** - Mood selection → Prompt → Write → Save (4 steps)
- **Encourage Consistency** - Streaks, gentle prompts, daily check-ins
- **Celebrate Progress** - Visual feedback, achievement moments
- **Non-Judgmental Tone** - Supportive language throughout

---

## 📁 Project Structure

```
reflect-journal/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── Settings.jsx      # Settings modal
│   ├── context/
│   │   └── JournalContext.jsx # Global state management
│   ├── pages/
│   │   ├── HomePage.jsx      # Landing page
│   │   ├── JournalPage.jsx   # Main writing interface
│   │   ├── DashboardPage.jsx # Analytics & visualizations
│   │   ├── InsightsPage.jsx  # AI insights & summaries
│   │   └── HistoryPage.jsx   # Past entries browser
│   ├── utils/
│   │   ├── aiService.js      # Claude API integration
│   │   └── demoData.js       # Sample data generator
│   ├── App.jsx               # Main app with routing
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 🚀 Future Enhancements

- [ ] **Export to PDF** - Download journal entries as formatted PDF
- [ ] **Voice Journaling** - Speech-to-text entry option
- [ ] **Guided Meditations** - Breathing exercises before writing
- [ ] **Goal Tracking** - Set and track personal growth goals
- [ ] **Mobile App** - React Native version for iOS/Android
- [ ] **End-to-End Encryption** - Optional cloud sync with E2E encryption
- [ ] **Therapist Sharing** - Secure sharing with mental health professionals

---

## 👨‍💻 Author

**Gottam Monisha**
- Built with ❤️ for mental wellness


---

<div align="center">
  <p>
    <strong>Reflect</strong> - Because understanding yourself shouldn't be complicated.
  </p>
  <p>
    🔒 Private • 🧠 Intelligent • 💚 Supportive
  </p>
</div>

## 🎬 Demo Video

Watch the full project demo here:

[![Watch the demo](https://img.youtube.com/vi/xLl5l83_bQs/0.jpg)](https://youtu.be/xLl5l83_bQs)

Link: https://youtu.be/xLl5l83_bQs