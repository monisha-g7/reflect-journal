// AI Service for Claude API Integration
// This handles all AI-powered features

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

// Store API key in localStorage (user provides it)
export const getApiKey = () => localStorage.getItem('reflect-api-key');
export const setApiKey = (key) => localStorage.setItem('reflect-api-key', key);
export const removeApiKey = () => localStorage.removeItem('reflect-api-key');

// Check if API is configured
export const isApiConfigured = () => true; // Always enabled for demo

// Generate empathetic prompt based on context
export async function generateSmartPrompt(context) {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    return null; // Fall back to local prompts
  }

  const { mood, recentEntries, timeOfDay } = context;

  const systemPrompt = `You are a compassionate journaling companion. Generate a single thoughtful, 
empathetic journaling prompt based on the user's current mood and context. 

Guidelines:
- Be warm and non-judgmental
- Ask open-ended questions that invite reflection
- If mood is low, be gentle and supportive
- If mood is good, help them explore what's working
- Keep it to 1-2 sentences max
- Don't be generic - make it feel personal

Return ONLY the prompt text, nothing else.`;

  const userMessage = `
Current mood: ${mood}
Time of day: ${timeOfDay}
${recentEntries?.length > 0 ? `Recent themes from their journal: ${recentEntries.slice(0, 3).map(e => e.themes?.join(', ')).join('; ')}` : ''}

Generate a journaling prompt for this person.`;

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 150,
        messages: [
          { role: 'user', content: userMessage }
        ],
        system: systemPrompt,
      }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.content[0].text.trim();
  } catch (error) {
    console.error('AI prompt generation failed:', error);
    return null;
  }
}

// Generate weekly insight summary
export async function generateWeeklyInsight(entries) {
  const apiKey = getApiKey();
  
  if (!apiKey || entries.length < 3) {
    return null;
  }

  const systemPrompt = `You are a compassionate journaling companion analyzing someone's journal entries.
Generate a brief, insightful weekly summary that:
- Highlights patterns you notice (emotions, themes, progress)
- Is warm, supportive, and non-judgmental  
- Offers one gentle observation or question for reflection
- Is 3-4 sentences max

Don't be generic - reference specific things from their entries.`;

  const entrySummaries = entries.slice(0, 7).map(e => 
    `[${e.mood}] ${e.content.substring(0, 200)}...`
  ).join('\n\n');

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        messages: [
          { role: 'user', content: `Here are my recent journal entries:\n\n${entrySummaries}\n\nPlease give me a weekly reflection summary.` }
        ],
        system: systemPrompt,
      }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.content[0].text.trim();
  } catch (error) {
    console.error('Weekly insight generation failed:', error);
    return null;
  }
}

// Generate personalized insight based on patterns
export async function generatePersonalizedInsight(entries, insights) {
  const apiKey = getApiKey();
  
  if (!apiKey || entries.length < 3) {
    return null;
  }

  const systemPrompt = `You are a thoughtful journaling companion. Based on the user's journal patterns,
provide ONE meaningful insight that could help them on their self-discovery journey.

Be:
- Specific to their patterns (not generic advice)
- Warm and encouraging
- Thought-provoking without being preachy
- 2-3 sentences max`;

  const contextInfo = `
Top themes: ${insights?.topThemes?.map(t => t.theme).join(', ') || 'various'}
Average mood: ${insights?.avgMood || 'moderate'}/5
Sentiment trend: ${insights?.avgSentiment || 50}% positive
Streak: ${insights?.streak || 0} days
Recent entry moods: ${entries.slice(0, 5).map(e => e.mood).join(', ')}
`;

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 200,
        messages: [
          { role: 'user', content: `My journaling patterns:\n${contextInfo}\n\nWhat insight do you have for me?` }
        ],
        system: systemPrompt,
      }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.content[0].text.trim();
  } catch (error) {
    console.error('Personalized insight generation failed:', error);
    return null;
  }
}
