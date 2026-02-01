// Demo data generator for Reflect Journal
// Run this in browser console or import it to seed data

const DEMO_ENTRIES = [
  {
    id: '1',
    content: "Had an amazing morning walk today. The sun was just rising and there was this peaceful quiet everywhere. I've noticed that when I start my day with movement, everything else just flows better. Work felt less stressful, and I was more patient in my meetings. I want to make this a regular habit.",
    mood: 'amazing',
    prompt: "What's one thing you're looking forward to today?",
    sentiment: 0.85,
    themes: ['nature', 'health', 'work'],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: '2', 
    content: "Feeling a bit overwhelmed with the project deadline approaching. There's so much to do and I'm not sure I can get it all done. Talked to my manager though, and she was understanding. Sometimes I forget that it's okay to ask for help. Need to work on that.",
    mood: 'low',
    prompt: "What's been taking up most of your mental space lately?",
    sentiment: 0.35,
    themes: ['work', 'stress', 'growth'],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: '3',
    content: "Great dinner with the family tonight. Mom made her famous pasta and we just sat around talking for hours. These moments remind me what really matters. Work stress fades away when you're surrounded by people who love you.",
    mood: 'good',
    prompt: "What moment from today are you most grateful for?",
    sentiment: 0.92,
    themes: ['family', 'relationships'],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
  {
    id: '4',
    content: "Just an okay day. Nothing special happened. Went through the motions at work, had lunch alone, came home and watched some TV. I feel like I'm in a bit of a rut. Maybe I need to shake things up somehow.",
    mood: 'okay',
    prompt: "How are you feeling right now, in this moment?",
    sentiment: 0.45,
    themes: ['work'],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
  },
  {
    id: '5',
    content: "Started learning guitar today! My fingers hurt but it feels so good to be learning something new. I've always wanted to play music and I finally just went for it. The instructor said I have a good ear. Small win but I'll take it!",
    mood: 'amazing',
    prompt: "What's something new you tried recently?",
    sentiment: 0.88,
    themes: ['creativity', 'growth'],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
  {
    id: '6',
    content: "Couldn't sleep last night. My mind kept racing about everything - work, relationships, future plans. I need to find better ways to wind down. Maybe I should try that meditation app Sarah recommended.",
    mood: 'low',
    prompt: "What's weighing on your mind right now?",
    sentiment: 0.3,
    themes: ['health', 'stress'],
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
  },
  {
    id: '7',
    content: "Productive day at work. Finally finished that presentation I've been dreading. My colleague gave me really positive feedback which felt great. Celebrated with a nice coffee and some reading time in the park.",
    mood: 'good',
    prompt: "What did you accomplish today that you're proud of?",
    sentiment: 0.82,
    themes: ['work', 'growth'],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
  },
  {
    id: '8',
    content: "Feeling grateful today. Had a video call with my best friend who moved abroad. Even though we're far apart, it feels like nothing has changed between us. True friendships really do stand the test of time and distance.",
    mood: 'good',
    prompt: "Who are you grateful for in your life?",
    sentiment: 0.9,
    themes: ['relationships'],
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
  },
  {
    id: '9',
    content: "Struggling today. Had a disagreement with a coworker and it's been bothering me all day. I know I should let it go but I keep replaying the conversation. Why do I do this to myself? Tomorrow is a new day.",
    mood: 'struggling',
    prompt: "What challenged you today?",
    sentiment: 0.25,
    themes: ['work', 'stress', 'relationships'],
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), // 9 days ago
  },
  {
    id: '10',
    content: "Went for a long run this morning and hit a new personal best! 5 miles without stopping. A few months ago I could barely do one. This is proof that consistency really does pay off. Feeling strong and capable.",
    mood: 'amazing',
    prompt: "What progress have you noticed in yourself lately?",
    sentiment: 0.95,
    themes: ['health', 'growth'],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
  },
  {
    id: '11',
    content: "Quiet Sunday. Made pancakes, did some cleaning, read a book by the window. Sometimes the simple days are the best ones. No pressure, no rushing, just being present.",
    mood: 'good',
    prompt: "What does peace look like for you today?",
    sentiment: 0.78,
    themes: ['nature'],
    createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(), // 11 days ago
  },
  {
    id: '12',
    content: "Got some difficult feedback at work today. It stung at first but after sitting with it, I can see they have a point. Growth isn't always comfortable. I'm going to use this as motivation to improve rather than letting it bring me down.",
    mood: 'okay',
    prompt: "How did you handle a difficult situation recently?",
    sentiment: 0.55,
    themes: ['work', 'growth'],
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
  },
  {
    id: '13',
    content: "Creative energy is flowing today! Spent hours working on a side project and completely lost track of time. This is the state I want to be in more often - fully engaged, curious, making things. Need to protect time for this.",
    mood: 'amazing',
    prompt: "When did you last feel fully in the zone?",
    sentiment: 0.91,
    themes: ['creativity', 'growth'],
    createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(), // 13 days ago
  },
  {
    id: '14',
    content: "Missing home today. Saw a photo that reminded me of childhood summers at grandma's house. Those carefree days feel so far away now. Called mom and it helped. Connection is medicine.",
    mood: 'low',
    prompt: "What memory came up for you today?",
    sentiment: 0.4,
    themes: ['family', 'relationships'],
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
  },
];

// Function to seed demo data
export function seedDemoData() {
  localStorage.setItem('reflect-entries', JSON.stringify(DEMO_ENTRIES));
  console.log('✅ Demo data seeded! Refresh the page to see it.');
  window.location.reload();
}

// Function to clear all data
export function clearAllData() {
  localStorage.removeItem('reflect-entries');
  console.log('🗑️ All data cleared! Refresh the page.');
  window.location.reload();
}

export default DEMO_ENTRIES;