import React from 'react';
import { useJournal, MOODS } from '../context/JournalContext';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { 
  TrendingUp, Calendar, Flame, BookOpen, 
  ArrowRight, Sparkles, Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, subDays, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';

export default function DashboardPage() {
  const { entries, insights } = useJournal();

  // Generate calendar data for last 4 weeks
  const generateCalendarData = () => {
    const today = new Date();
    const fourWeeksAgo = subDays(today, 27);
    const days = eachDayOfInterval({ start: fourWeeksAgo, end: today });
    
    return days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const dayEntries = entries.filter(e => 
        format(new Date(e.createdAt), 'yyyy-MM-dd') === dateStr
      );
      
      return {
        date: day,
        dateStr,
        hasEntry: dayEntries.length > 0,
        mood: dayEntries[0]?.mood || null,
        count: dayEntries.length,
      };
    });
  };

  const calendarData = generateCalendarData();

  // Mood distribution for pie chart
  const moodData = insights?.moodDistribution 
    ? Object.entries(insights.moodDistribution).map(([mood, count]) => ({
        name: MOODS[mood]?.label || mood,
        value: count,
        color: getMoodColor(mood),
      }))
    : [];

  function getMoodColor(mood) {
    const colors = {
      amazing: '#fbbf24',
      good: '#22c55e',
      okay: '#3b82f6',
      low: '#a855f7',
      struggling: '#f87171',
    };
    return colors[mood] || '#94a3b8';
  }

  const getMoodBgColor = (mood) => {
    const colors = {
      amazing: 'bg-yellow-200',
      good: 'bg-green-200',
      okay: 'bg-blue-200',
      low: 'bg-purple-200',
      struggling: 'bg-red-200',
    };
    return colors[mood] || 'bg-sage-100';
  };

  if (entries.length === 0) {
    return (
      <div className="min-h-screen p-6 md:p-10 flex items-center justify-center">
        <div className="text-center max-w-md animate-fade-in">
          <div className="w-20 h-20 bg-sage-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-sage-400" />
          </div>
          <h2 className="font-display text-2xl font-semibold text-sage-800 mb-3">
            Your dashboard awaits
          </h2>
          <p className="text-sage-600 mb-8">
            Start journaling to see your mood trends, themes, and insights come to life here.
          </p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            Write your first entry
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-10 animate-fade-in">
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-sage-800">
            Your Dashboard
          </h1>
          <p className="text-sage-600 mt-2">
            Track your emotional journey and discover patterns in your reflections.
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="stat-card animate-fade-in">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-sage-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-sage-600" />
              </div>
            </div>
            <p className="text-3xl font-display font-semibold text-sage-800">
              {insights?.totalEntries || entries.length}
            </p>
            <p className="text-sm text-sage-500">Total Entries</p>
          </div>

          <div className="stat-card animate-fade-in animate-delay-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
            </div>
            <p className="text-3xl font-display font-semibold text-sage-800">
              {insights?.streak || 0}
            </p>
            <p className="text-sm text-sage-500">Day Streak</p>
          </div>

          <div className="stat-card animate-fade-in animate-delay-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-dusk-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-dusk-600" />
              </div>
            </div>
            <p className="text-3xl font-display font-semibold text-sage-800">
              {insights?.avgSentiment || 0}%
            </p>
            <p className="text-sm text-sage-500">Positivity Score</p>
          </div>

          <div className="stat-card animate-fade-in animate-delay-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-clay-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-clay-600" />
              </div>
            </div>
            <p className="text-3xl font-display font-semibold text-sage-800">
              {insights?.entriesThisWeek || 0}
            </p>
            <p className="text-sm text-sage-500">This Week</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Sentiment Trend Chart */}
          {insights?.sentimentTrend?.length > 1 && (
            <div className="stat-card animate-fade-in">
              <h3 className="font-display text-lg font-semibold text-sage-800 mb-6">
                Sentiment Trend
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={insights.sentimentTrend}>
                    <defs>
                      <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7d917d" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#7d917d" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="date" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#7d917d', fontSize: 12 }}
                    />
                    <YAxis 
                      domain={[0, 100]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#7d917d', fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{
                        background: 'rgba(255,255,255,0.9)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      }}
                      formatter={(value) => [`${value}%`, 'Positivity']}
                    />
                    <Area
                      type="monotone"
                      dataKey="sentiment"
                      stroke="#7d917d"
                      strokeWidth={3}
                      fill="url(#sentimentGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Mood Distribution */}
          {moodData.length > 0 && (
            <div className="stat-card animate-fade-in animate-delay-100">
              <h3 className="font-display text-lg font-semibold text-sage-800 mb-6">
                Mood Distribution
              </h3>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={moodData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {moodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        background: 'rgba(255,255,255,0.9)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                {moodData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2 text-sm">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sage-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mood Calendar */}
        <div className="stat-card animate-fade-in mb-10">
          <h3 className="font-display text-lg font-semibold text-sage-800 mb-6">
            Activity Calendar
          </h3>
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs text-sage-400 py-2">
                {day}
              </div>
            ))}
            {/* Add empty cells for alignment */}
            {Array.from({ length: calendarData[0]?.date.getDay() || 0 }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {calendarData.map((day) => (
              <div
                key={day.dateStr}
                className={`aspect-square rounded-lg flex items-center justify-center text-xs transition-all ${
                  day.hasEntry 
                    ? `${getMoodBgColor(day.mood)} hover:scale-110 cursor-pointer` 
                    : 'bg-sand-100'
                }`}
                title={day.hasEntry 
                  ? `${format(day.date, 'MMM d')}: ${MOODS[day.mood]?.label || 'Entry'}` 
                  : format(day.date, 'MMM d')
                }
              >
                {day.hasEntry && MOODS[day.mood]?.emoji}
              </div>
            ))}
          </div>
        </div>

        {/* Top Themes */}
        {insights?.topThemes?.length > 0 && (
          <div className="stat-card animate-fade-in">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-dusk-500" />
              <h3 className="font-display text-lg font-semibold text-sage-800">
                Recurring Themes
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {insights.topThemes.map(({ theme, count }) => (
                <div
                  key={theme}
                  className="px-4 py-2 bg-dusk-50 text-dusk-700 rounded-full text-sm font-medium"
                >
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  <span className="ml-2 text-dusk-400">×{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-10 text-center">
          <Link 
            to="/" 
            className="btn-primary inline-flex items-center gap-2"
          >
            <Heart size={18} />
            Write Today's Entry
          </Link>
        </div>
      </div>
    </div>
  );
}
