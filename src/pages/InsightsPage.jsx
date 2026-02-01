import React, { useState, useEffect } from 'react';
import { useJournal, MOODS } from '../context/JournalContext';
import { 
  Sparkles, Brain, TrendingUp, Heart, Sun, Moon,
  Lightbulb, ArrowRight, RefreshCw, Calendar, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, subDays } from 'date-fns';

export default function InsightsPage() {
  const { entries, insights, getWeeklySummary } = useJournal();
  const [activeTab, setActiveTab] = useState('weekly');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiInsight, setAiInsight] = useState('');
  const [aiWeeklySummary, setAiWeeklySummary] = useState('');
  const [isLoadingWeekly, setIsLoadingWeekly] = useState(false);

  const localWeeklySummary = getWeeklySummary();

  // Generate AI weekly summary
  const generateAIWeeklySummary = async () => {
    if (entries.length < 2) return;
    
    setIsLoadingWeekly(true);
    
    const recentEntries = entries.slice(0, 7);
    const entrySummaries = recentEntries.map(e => 
      `[Mood: ${MOODS[e.mood]?.label}] ${e.content.substring(0, 150)}...`
    ).join('\n\n');

    const systemPrompt = `You are a compassionate journaling companion analyzing someone's journal entries.
Generate a brief, warm weekly summary that:
- Highlights 1-2 patterns you notice
- Is supportive and non-judgmental
- Offers one gentle observation
- Is 3-4 sentences max
- References specific things from their entries

Be warm and personal, like a supportive friend.`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 250,
          messages: [{ 
            role: 'user', 
            content: `Here are my recent journal entries:\n\n${entrySummaries}\n\nPlease give me a weekly reflection summary.` 
          }],
          system: systemPrompt,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiWeeklySummary(data.content[0].text.trim());
      }
    } catch (error) {
      console.log('AI weekly summary failed');
    }
    
    setIsLoadingWeekly(false);
  };

  // Generate AI personalized insight
  const generateAIInsight = async () => {
    if (entries.length < 2) return;
    
    setIsGenerating(true);
    
    const topThemes = insights?.topThemes?.map(t => t.theme).join(', ') || 'various topics';
    const avgMood = insights?.avgMood || 3;
    const streak = insights?.streak || 0;
    const recentMoods = entries.slice(0, 5).map(e => MOODS[e.mood]?.label).join(', ');

    const systemPrompt = `You are a thoughtful journaling companion. Based on the user's journal patterns, provide ONE meaningful personalized insight.

Be:
- Specific to THEIR patterns (not generic advice)
- Warm and encouraging
- Thought-provoking but not preachy
- 2-3 sentences max

This should feel like advice from a wise, caring friend.`;

    const userMessage = `My journaling patterns:
- Top themes: ${topThemes}
- Average mood: ${avgMood}/5
- Current streak: ${streak} days
- Recent moods: ${recentMoods}
- Total entries: ${entries.length}

What insight do you have for me?`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 200,
          messages: [{ role: 'user', content: userMessage }],
          system: systemPrompt,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiInsight(data.content[0].text.trim());
      } else {
        setAiInsight(getLocalInsight());
      }
    } catch (error) {
      console.log('AI insight failed, using local');
      setAiInsight(getLocalInsight());
    }
    
    setIsGenerating(false);
  };

  const getLocalInsight = () => {
    const templates = [
      "Each entry you write is a step toward deeper self-understanding. Look for patterns in when you feel most at peace.",
      "Your journal captures your evolving relationship with yourself. What themes have surprised you?",
      "Consistency in reflection builds self-awareness. Notice how your writing practice is affecting your daily mindset."
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  };

  // Auto-generate on first load
  useEffect(() => {
    if (entries.length >= 2 && !aiWeeklySummary) {
      generateAIWeeklySummary();
    }
    if (entries.length >= 2 && !aiInsight) {
      generateAIInsight();
    }
  }, [entries.length]);

  // Get time-of-day pattern
  const getTimePattern = () => {
    const timeCounts = { morning: 0, afternoon: 0, evening: 0, night: 0 };
    
    entries.forEach(entry => {
      const hour = new Date(entry.createdAt).getHours();
      if (hour >= 5 && hour < 12) timeCounts.morning++;
      else if (hour >= 12 && hour < 17) timeCounts.afternoon++;
      else if (hour >= 17 && hour < 21) timeCounts.evening++;
      else timeCounts.night++;
    });

    const maxTime = Object.entries(timeCounts).sort((a, b) => b[1] - a[1])[0];
    return maxTime[1] > 0 ? maxTime[0] : null;
  };

  const timePattern = getTimePattern();

  if (entries.length < 2) {
    return (
      <div className="min-h-screen p-6 md:p-10 flex items-center justify-center">
        <div className="text-center max-w-md animate-fade-in">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#f0eef4' }}>
            <Brain className="w-10 h-10" style={{ color: '#867396' }} />
          </div>
          <h2 className="text-2xl font-semibold mb-3" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#353f35' }}>
            Insights are brewing
          </h2>
          <p className="mb-8" style={{ color: '#617461' }}>
            Write a few more entries, and I'll start finding meaningful patterns in your reflections.
          </p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            Continue journaling
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-10 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-6 h-6" style={{ color: '#867396' }} />
            <span className="text-sm font-medium" style={{ color: '#867396' }}>AI-Powered</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#353f35' }}>
            Your Insights
          </h1>
          <p className="mt-2" style={{ color: '#617461' }}>
            Discover patterns and gain perspective on your journey.
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 animate-fade-in">
          {[
            { id: 'weekly', label: 'Weekly Summary' },
            { id: 'patterns', label: 'Patterns' },
            { id: 'ai', label: 'AI Insight' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ 
                backgroundColor: activeTab === tab.id ? '#617461' : 'rgba(255,255,255,0.5)',
                color: activeTab === tab.id ? 'white' : '#617461'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Weekly Summary Tab */}
        {activeTab === 'weekly' && (
          <div className="space-y-6 animate-fade-in">
            <div className="glass-card rounded-3xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#e3e7e3' }}>
                  <Calendar className="w-6 h-6" style={{ color: '#617461' }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-semibold" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#353f35' }}>
                      This Week at a Glance
                    </h2>
                    {aiWeeklySummary && (
                      <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1" style={{ backgroundColor: '#f0eef4', color: '#867396' }}>
                        <Zap size={10} />
                        AI
                      </span>
                    )}
                  </div>
                  <p className="text-sm" style={{ color: '#7d917d' }}>
                    {format(subDays(new Date(), 7), 'MMM d')} — {format(new Date(), 'MMM d, yyyy')}
                  </p>
                </div>
                <button
                  onClick={generateAIWeeklySummary}
                  disabled={isLoadingWeekly}
                  className="p-2 rounded-xl transition-colors hover:bg-gray-100"
                >
                  <RefreshCw size={18} className={isLoadingWeekly ? 'animate-spin' : ''} style={{ color: '#7d917d' }} />
                </button>
              </div>
              
              {isLoadingWeekly ? (
                <div className="flex items-center gap-3 py-4">
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#a3b2a3' }} />
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#a3b2a3', animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#a3b2a3', animationDelay: '0.2s' }} />
                  <span className="text-sm" style={{ color: '#7d917d' }}>Analyzing your entries...</span>
                </div>
              ) : (
                <p className="text-lg leading-relaxed" style={{ color: '#3f4b3f' }}>
                  {aiWeeklySummary || localWeeklySummary}
                </p>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="glass-card rounded-2xl p-5 text-center">
                <p className="text-3xl font-semibold" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#353f35' }}>
                  {insights?.entriesThisWeek || 0}
                </p>
                <p className="text-sm" style={{ color: '#7d917d' }}>entries</p>
              </div>
              <div className="glass-card rounded-2xl p-5 text-center">
                <p className="text-3xl font-semibold" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#353f35' }}>
                  {insights?.avgMood || '—'}
                </p>
                <p className="text-sm" style={{ color: '#7d917d' }}>avg mood</p>
              </div>
              <div className="glass-card rounded-2xl p-5 text-center">
                <p className="text-3xl font-semibold" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#353f35' }}>
                  {insights?.streak || 0}
                </p>
                <p className="text-sm" style={{ color: '#7d917d' }}>day streak</p>
              </div>
            </div>
          </div>
        )}

        {/* Patterns Tab */}
        {activeTab === 'patterns' && (
          <div className="space-y-6 animate-fade-in">
            {/* Time Pattern */}
            {timePattern && (
              <div className="glass-card rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  {timePattern === 'morning' || timePattern === 'afternoon' ? (
                    <Sun className="w-6 h-6" style={{ color: '#eab308' }} />
                  ) : (
                    <Moon className="w-6 h-6" style={{ color: '#867396' }} />
                  )}
                  <h3 className="text-lg font-semibold" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#353f35' }}>
                    Writing Time Pattern
                  </h3>
                </div>
                <p style={{ color: '#617461' }}>
                  You tend to journal most often in the <strong style={{ color: '#353f35' }}>{timePattern}</strong>. 
                  {timePattern === 'morning' && " Morning journaling can set a positive tone for your day."}
                  {timePattern === 'evening' && " Evening reflection helps process the day's experiences."}
                  {timePattern === 'afternoon' && " Midday check-ins can help manage stress and reset focus."}
                  {timePattern === 'night' && " Late-night writing often leads to deeper introspection."}
                </p>
              </div>
            )}

            {/* Mood Patterns */}
            {insights?.moodDistribution && (
              <div className="glass-card rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="w-6 h-6" style={{ color: '#f87171' }} />
                  <h3 className="text-lg font-semibold" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#353f35' }}>
                    Emotional Landscape
                  </h3>
                </div>
                <div className="space-y-3">
                  {Object.entries(insights.moodDistribution)
                    .sort((a, b) => b[1] - a[1])
                    .map(([mood, count]) => {
                      const percentage = Math.round((count / entries.length) * 100);
                      return (
                        <div key={mood} className="flex items-center gap-3">
                          <span className="text-2xl w-10">{MOODS[mood]?.emoji}</span>
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm" style={{ color: '#3f4b3f' }}>{MOODS[mood]?.label}</span>
                              <span className="text-sm" style={{ color: '#7d917d' }}>{percentage}%</span>
                            </div>
                            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#f3e4cc' }}>
                              <div 
                                className="h-full rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%`, backgroundColor: '#7d917d' }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Theme Cloud */}
            {insights?.topThemes?.length > 0 && (
              <div className="glass-card rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-6 h-6" style={{ color: '#617461' }} />
                  <h3 className="text-lg font-semibold" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#353f35' }}>
                    What's on Your Mind
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {insights.topThemes.map(({ theme, count }, index) => (
                    <div
                      key={theme}
                      className="px-4 py-2 rounded-full text-sm font-medium"
                      style={{ 
                        backgroundColor: index === 0 ? '#617461' : '#e3e7e3',
                        color: index === 0 ? 'white' : '#3f4b3f'
                      }}
                    >
                      {theme.charAt(0).toUpperCase() + theme.slice(1)}
                      <span style={{ marginLeft: '0.5rem', opacity: 0.7 }}>{count}×</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* AI Insight Tab */}
        {activeTab === 'ai' && (
          <div className="animate-fade-in">
            <div className="glass-card rounded-3xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #867396, #617461)' }}>
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-semibold" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#353f35' }}>
                      Personalized Insight
                    </h2>
                    <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1" style={{ backgroundColor: '#f0eef4', color: '#867396' }}>
                      <Zap size={10} />
                      AI
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: '#7d917d' }}>
                    Based on your entries and patterns
                  </p>
                </div>
                <button
                  onClick={generateAIInsight}
                  disabled={isGenerating}
                  className="p-2 rounded-xl transition-colors hover:bg-gray-100"
                  title="Generate new insight"
                >
                  <RefreshCw size={20} className={isGenerating ? 'animate-spin' : ''} style={{ color: '#7d917d' }} />
                </button>
              </div>
              
              {isGenerating ? (
                <div className="flex items-center gap-3 py-8 justify-center">
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#a3b2a3' }} />
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#a3b2a3', animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#a3b2a3', animationDelay: '0.2s' }} />
                </div>
              ) : (
                <p className="text-lg leading-relaxed" style={{ color: '#3f4b3f' }}>
                  {aiInsight || "Click the refresh button to generate a personalized insight."}
                </p>
              )}
            </div>

            {/* Reflection prompts */}
            <div className="mt-6 glass-card rounded-3xl p-6">
              <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#353f35' }}>
                Questions to Consider
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span style={{ color: '#7d917d' }}>•</span>
                  <span style={{ color: '#617461' }}>What patterns have you noticed that surprise you?</span>
                </li>
                <li className="flex items-start gap-3">
                  <span style={{ color: '#7d917d' }}>•</span>
                  <span style={{ color: '#617461' }}>When did you feel most like yourself this week?</span>
                </li>
                <li className="flex items-start gap-3">
                  <span style={{ color: '#7d917d' }}>•</span>
                  <span style={{ color: '#617461' }}>What would you tell a friend experiencing what you've been through?</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link to="/" className="btn-secondary inline-flex items-center gap-2">
            Continue journaling
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
