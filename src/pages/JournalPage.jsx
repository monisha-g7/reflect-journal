import React, { useState, useEffect } from 'react';
import { useJournal, MOODS } from '../context/JournalContext';
import { Sparkles, RefreshCw, Send, Calendar, CheckCircle, Zap } from 'lucide-react';
import { format } from 'date-fns';

export default function JournalPage() {
  const { addEntry, currentPrompt, generatePrompt, entries } = useJournal();
  const [selectedMood, setSelectedMood] = useState(null);
  const [content, setContent] = useState('');
  const [showPrompt, setShowPrompt] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [localPrompt, setLocalPrompt] = useState(currentPrompt);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isAIPrompt, setIsAIPrompt] = useState(false);

  const today = format(new Date(), 'EEEE, MMMM d, yyyy');
  const greeting = getGreeting();

  // Check if already journaled today
  const todayEntry = entries.find(e => 
    format(new Date(e.createdAt), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

  useEffect(() => {
    setLocalPrompt(currentPrompt);
  }, [currentPrompt]);

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  function getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  }

  // Generate AI prompt using Claude API
  const generateAIPrompt = async (mood) => {
    setIsLoadingAI(true);
    setIsAIPrompt(false);
    
    const timeOfDay = getTimeOfDay();
    const recentThemes = entries.slice(0, 3).flatMap(e => e.themes || []);
    const uniqueThemes = [...new Set(recentThemes)].slice(0, 3);

    const systemPrompt = `You are a compassionate journaling companion. Generate a single thoughtful, empathetic journaling prompt.

Guidelines:
- Be warm and non-judgmental
- Ask open-ended questions that invite deep reflection
- If mood is low or struggling, be extra gentle and supportive
- If mood is good or amazing, help explore what's working
- Keep it to 1-2 sentences max
- Make it feel personal, not generic
- Don't start with "How" every time - vary your question starters

Return ONLY the prompt text, nothing else.`;

    const userMessage = `Current mood: ${mood} (${MOODS[mood]?.label})
Time of day: ${timeOfDay}
${uniqueThemes.length > 0 ? `Recent themes from their journal: ${uniqueThemes.join(', ')}` : 'This is a new user.'}

Generate a journaling prompt for this person.`;

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
          max_tokens: 150,
          messages: [{ role: 'user', content: userMessage }],
          system: systemPrompt,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiPrompt = data.content[0].text.trim();
        setLocalPrompt(aiPrompt);
        setIsAIPrompt(true);
      } else {
        // Fallback to local prompt
        const fallbackPrompt = generatePrompt(mood);
        setLocalPrompt(fallbackPrompt);
      }
    } catch (error) {
      console.log('AI prompt failed, using local prompt');
      const fallbackPrompt = generatePrompt(mood);
      setLocalPrompt(fallbackPrompt);
    }
    
    setIsLoadingAI(false);
  };

  const handleMoodSelect = async (moodKey) => {
    setSelectedMood(moodKey);
    // Try AI prompt first, fallback to local
    await generateAIPrompt(moodKey);
  };

  const handleRefreshPrompt = async () => {
    if (selectedMood) {
      await generateAIPrompt(selectedMood);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() || !selectedMood) return;

    setIsSaving(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));

    addEntry({
      content: content.trim(),
      mood: selectedMood,
      prompt: showPrompt ? localPrompt : null,
    });

    setIsSaving(false);
    setShowSuccess(true);
    
    setTimeout(() => {
      setContent('');
      setSelectedMood(null);
      setShowSuccess(false);
      setIsAIPrompt(false);
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#e3e7e3' }}>
            <CheckCircle className="w-10 h-10" style={{ color: '#617461' }} />
          </div>
          <h2 className="text-3xl font-semibold mb-3" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#353f35' }}>
            Entry Saved
          </h2>
          <p style={{ color: '#617461' }}>
            Thank you for taking time to reflect today.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="mb-10 animate-fade-in">
          <div className="flex items-center gap-2 text-sm mb-2" style={{ color: '#7d917d' }}>
            <Calendar size={16} />
            <span>{today}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#353f35' }}>
            {greeting}
          </h1>
          <p className="mt-2" style={{ color: '#617461' }}>
            {todayEntry 
              ? "You've already journaled today. Feel free to add another entry!"
              : "Take a moment to check in with yourself."
            }
          </p>
        </header>

        {/* Mood Selection */}
        <section className="mb-8 animate-fade-in">
          <h2 className="text-sm font-medium mb-4" style={{ color: '#3f4b3f' }}>How are you feeling?</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(MOODS).map(([key, { emoji, label }]) => (
              <button
                key={key}
                onClick={() => handleMoodSelect(key)}
                disabled={isLoadingAI}
                className={`mood-btn ${selectedMood === key ? 'selected' : ''}`}
                title={label}
              >
                <span className="text-2xl">{emoji}</span>
              </button>
            ))}
          </div>
          {selectedMood && !isLoadingAI && (
            <p className="text-sm mt-3 animate-fade-in" style={{ color: '#7d917d' }}>
              Feeling {MOODS[selectedMood].label.toLowerCase()} — that's okay. Let's explore that.
            </p>
          )}
        </section>

        {/* AI Prompt */}
        {selectedMood && showPrompt && (
          <section className="mb-6 animate-slide-up">
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f0eef4' }}>
                    {isLoadingAI ? (
                      <RefreshCw size={16} className="animate-spin" style={{ color: '#867396' }} />
                    ) : (
                      <Sparkles size={16} style={{ color: '#867396' }} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs" style={{ color: '#7d917d' }}>
                        {isLoadingAI ? 'Generating prompt...' : 'Reflection prompt'}
                      </p>
                      {isAIPrompt && !isLoadingAI && (
                        <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1" style={{ backgroundColor: '#f0eef4', color: '#867396' }}>
                          <Zap size={10} />
                          AI
                        </span>
                      )}
                    </div>
                    {isLoadingAI ? (
                      <div className="flex gap-1 py-2">
                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#a3b2a3' }} />
                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#a3b2a3', animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#a3b2a3', animationDelay: '0.2s' }} />
                      </div>
                    ) : (
                      <p className="font-medium leading-relaxed" style={{ color: '#353f35' }}>
                        {localPrompt}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleRefreshPrompt}
                  disabled={isLoadingAI}
                  className="p-2 rounded-xl transition-colors flex-shrink-0 hover:bg-gray-100 disabled:opacity-50"
                  title="Get a different prompt"
                >
                  <RefreshCw size={18} className={isLoadingAI ? 'animate-spin' : ''} style={{ color: '#7d917d' }} />
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowPrompt(false)}
              className="text-xs mt-2 transition-colors hover:opacity-70"
              style={{ color: '#7d917d' }}
            >
              Write freely without a prompt
            </button>
          </section>
        )}

        {!showPrompt && selectedMood && (
          <button
            onClick={() => setShowPrompt(true)}
            className="text-sm mb-4 inline-flex items-center gap-2 transition-colors hover:opacity-70"
            style={{ color: '#7d917d' }}
          >
            <Sparkles size={14} />
            Show me a prompt
          </button>
        )}

        {/* Writing Area */}
        <section className="animate-fade-in">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={selectedMood 
              ? "Start writing... Let your thoughts flow freely."
              : "Select a mood above to get started..."
            }
            disabled={!selectedMood}
            className="textarea-field min-h-[300px] text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          />

          <div className="flex items-center justify-between mt-4">
            <span className="text-sm" style={{ color: '#7d917d' }}>
              {content.length > 0 ? `${content.split(/\s+/).filter(Boolean).length} words` : ''}
            </span>
            
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || !selectedMood || isSaving}
              className="btn-primary inline-flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Save Entry
                </>
              )}
            </button>
          </div>
        </section>

        {/* Privacy note */}
        <p className="text-xs text-center mt-10" style={{ color: '#7d917d' }}>
          🔒 Your entries are stored locally on this device and never sent anywhere.
        </p>
      </div>
    </div>
  );
}
