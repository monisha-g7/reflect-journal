import React, { createContext, useContext, useState, useEffect } from 'react';

const JournalContext = createContext();

// Mood configurations
export const MOODS = {
  amazing: { emoji: '✨', label: 'Amazing', color: 'text-yellow-500', value: 5 },
  good: { emoji: '😊', label: 'Good', color: 'text-green-500', value: 4 },
  okay: { emoji: '😐', label: 'Okay', color: 'text-blue-500', value: 3 },
  low: { emoji: '😔', label: 'Low', color: 'text-purple-500', value: 2 },
  struggling: { emoji: '😢', label: 'Struggling', color: 'text-red-400', value: 1 },
};

// AI Prompts based on context
const PROMPTS = {
  morning: [
    "What's one thing you're looking forward to today?",
    "How did you sleep, and how is your body feeling this morning?",
    "What intention would you like to set for today?",
    "If today had a color, what would it be and why?",
  ],
  evening: [
    "What moment from today are you most grateful for?",
    "What challenged you today, and how did you handle it?",
    "What did you learn about yourself today?",
    "If you could relive one moment from today, which would it be?",
  ],
  lowMood: [
    "What's weighing on your mind right now? Let it all out.",
    "What's one small act of kindness you could show yourself today?",
    "When did you last feel at peace? Describe that moment.",
    "What would you tell a friend who was feeling this way?",
  ],
  general: [
    "What's been taking up most of your mental space lately?",
    "Describe a recent moment that made you smile.",
    "What's something you've been avoiding that deserves attention?",
    "How have your relationships been feeling lately?",
    "What does your ideal tomorrow look like?",
  ],
  followUp: [
    "You mentioned {theme} recently. How has that been evolving?",
    "Last time you wrote about feeling {mood}. How are things now?",
    "I noticed {theme} comes up often. Would you like to explore that more?",
  ],
};

// Simple sentiment analysis
const analyzeSentiment = (text) => {
  const positiveWords = ['happy', 'grateful', 'excited', 'love', 'amazing', 'wonderful', 'great', 'joy', 'peaceful', 'calm', 'blessed', 'thankful', 'proud', 'accomplished', 'hopeful', 'inspired'];
  const negativeWords = ['sad', 'angry', 'frustrated', 'anxious', 'worried', 'stressed', 'tired', 'exhausted', 'overwhelmed', 'lonely', 'scared', 'disappointed', 'hurt', 'confused', 'lost'];
  
  const words = text.toLowerCase().split(/\s+/);
  let positiveCount = 0;
  let negativeCount = 0;
  
  words.forEach(word => {
    if (positiveWords.some(pw => word.includes(pw))) positiveCount++;
    if (negativeWords.some(nw => word.includes(nw))) negativeCount++;
  });
  
  const total = positiveCount + negativeCount;
  if (total === 0) return 0.5;
  return positiveCount / total;
};

// Extract themes from text
const extractThemes = (text) => {
  const themePatterns = {
    work: /\b(work|job|office|meeting|project|deadline|boss|colleague|career)\b/gi,
    family: /\b(family|mom|dad|parent|sibling|brother|sister|child|kid)\b/gi,
    health: /\b(health|exercise|workout|sleep|tired|energy|sick|doctor)\b/gi,
    relationships: /\b(friend|relationship|partner|dating|love|connection)\b/gi,
    growth: /\b(learn|grow|improve|goal|achieve|progress|develop)\b/gi,
    stress: /\b(stress|anxiety|worry|pressure|overwhelm|busy)\b/gi,
    creativity: /\b(create|creative|art|write|music|idea|inspire)\b/gi,
    nature: /\b(nature|outside|walk|park|sun|weather|fresh air)\b/gi,
  };
  
  const themes = [];
  Object.entries(themePatterns).forEach(([theme, pattern]) => {
    if (pattern.test(text)) {
      themes.push(theme);
    }
  });
  
  return themes;
};

export function JournalProvider({ children }) {
  const [entries, setEntries] = useState([]);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load entries from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('reflect-entries');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
    setIsLoading(false);
    generatePrompt();
  }, []);

  // Save entries to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('reflect-entries', JSON.stringify(entries));
      generateInsights();
    }
  }, [entries, isLoading]);

  // Generate contextual prompt
  const generatePrompt = (recentMood = null) => {
    const hour = new Date().getHours();
    let promptPool;

    if (recentMood && ['low', 'struggling'].includes(recentMood)) {
      promptPool = PROMPTS.lowMood;
    } else if (hour < 12) {
      promptPool = PROMPTS.morning;
    } else if (hour >= 18) {
      promptPool = PROMPTS.evening;
    } else {
      promptPool = PROMPTS.general;
    }

    const randomPrompt = promptPool[Math.floor(Math.random() * promptPool.length)];
    setCurrentPrompt(randomPrompt);
    return randomPrompt;
  };

  // Add new entry
  const addEntry = (entry) => {
    const sentiment = analyzeSentiment(entry.content);
    const themes = extractThemes(entry.content);
    
    const newEntry = {
      id: Date.now().toString(),
      ...entry,
      sentiment,
      themes,
      createdAt: new Date().toISOString(),
    };

    setEntries(prev => [newEntry, ...prev]);
    return newEntry;
  };

  // Delete entry
  const deleteEntry = (id) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  // Generate insights from entries
  const generateInsights = () => {
    if (entries.length < 2) {
      setInsights(null);
      return;
    }

    // Calculate mood trends
    const last7Days = entries.filter(e => {
      const entryDate = new Date(e.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo;
    });

    const last30Days = entries.filter(e => {
      const entryDate = new Date(e.createdAt);
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      return entryDate >= monthAgo;
    });

    // Average mood
    const avgMood = last7Days.length > 0
      ? last7Days.reduce((sum, e) => sum + (MOODS[e.mood]?.value || 3), 0) / last7Days.length
      : 0;

    // Average sentiment
    const avgSentiment = last7Days.length > 0
      ? last7Days.reduce((sum, e) => sum + (e.sentiment || 0.5), 0) / last7Days.length
      : 0.5;

    // Theme frequency
    const themeCount = {};
    last30Days.forEach(entry => {
      (entry.themes || []).forEach(theme => {
        themeCount[theme] = (themeCount[theme] || 0) + 1;
      });
    });

    const topThemes = Object.entries(themeCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([theme, count]) => ({ theme, count }));

    // Mood distribution
    const moodDistribution = {};
    last30Days.forEach(entry => {
      moodDistribution[entry.mood] = (moodDistribution[entry.mood] || 0) + 1;
    });

    // Writing streak
    const sortedDates = [...new Set(entries.map(e => 
      new Date(e.createdAt).toDateString()
    ))].sort((a, b) => new Date(b) - new Date(a));

    let streak = 0;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    if (sortedDates[0] === today || sortedDates[0] === yesterday) {
      streak = 1;
      for (let i = 1; i < sortedDates.length; i++) {
        const diff = new Date(sortedDates[i-1]) - new Date(sortedDates[i]);
        if (diff <= 86400000 * 1.5) {
          streak++;
        } else {
          break;
        }
      }
    }

    // Sentiment over time for chart
    const sentimentTrend = last30Days
      .slice(0, 14)
      .reverse()
      .map(entry => ({
        date: new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sentiment: Math.round(entry.sentiment * 100),
        mood: MOODS[entry.mood]?.value || 3,
      }));

    setInsights({
      totalEntries: entries.length,
      entriesThisWeek: last7Days.length,
      entriesThisMonth: last30Days.length,
      avgMood: avgMood.toFixed(1),
      avgSentiment: Math.round(avgSentiment * 100),
      topThemes,
      moodDistribution,
      streak,
      sentimentTrend,
    });
  };

  // Generate weekly summary
  const getWeeklySummary = () => {
    const last7Days = entries.filter(e => {
      const entryDate = new Date(e.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo;
    });

    if (last7Days.length === 0) {
      return "Start journaling to see your weekly insights here!";
    }

    const themes = {};
    let totalSentiment = 0;
    const moods = [];

    last7Days.forEach(entry => {
      (entry.themes || []).forEach(theme => {
        themes[theme] = (themes[theme] || 0) + 1;
      });
      totalSentiment += entry.sentiment || 0.5;
      moods.push(entry.mood);
    });

    const avgSentiment = totalSentiment / last7Days.length;
    const topTheme = Object.entries(themes).sort((a, b) => b[1] - a[1])[0];
    const dominantMood = moods.sort((a, b) =>
      moods.filter(m => m === a).length - moods.filter(m => m === b).length
    ).pop();

    let summary = `This week, you wrote ${last7Days.length} ${last7Days.length === 1 ? 'entry' : 'entries'}. `;
    
    if (topTheme) {
      summary += `"${topTheme[0].charAt(0).toUpperCase() + topTheme[0].slice(1)}" was a recurring theme in your reflections. `;
    }

    if (avgSentiment > 0.6) {
      summary += "Your writing carried a notably positive tone—it seems like things are going well! ";
    } else if (avgSentiment < 0.4) {
      summary += "Your entries suggest you've been processing some challenges. Remember, it's okay to not be okay. ";
    }

    if (dominantMood) {
      summary += `You most often felt "${MOODS[dominantMood]?.label || dominantMood}" this week.`;
    }

    return summary;
  };

  const value = {
    entries,
    currentPrompt,
    insights,
    isLoading,
    addEntry,
    deleteEntry,
    generatePrompt,
    getWeeklySummary,
    MOODS,
  };

  return (
    <JournalContext.Provider value={value}>
      {children}
    </JournalContext.Provider>
  );
}

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
};
