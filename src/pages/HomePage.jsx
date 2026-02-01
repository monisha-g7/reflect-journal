import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Feather, Shield, Brain, TrendingUp, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'Empathetic AI Prompts',
      description: 'Thoughtful, context-aware questions that adapt to your mood and recent entries.',
    },
    {
      icon: TrendingUp,
      title: 'Pattern Discovery',
      description: 'Visualize your emotional trends and identify themes in your thoughts.',
    },
    {
      icon: Shield,
      title: '100% Private',
      description: 'All data stays on your device. No servers, no tracking, just you.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Floating decoration */}
          <div className="relative inline-block mb-8">
            <div className="absolute -inset-4 bg-sage-200/30 rounded-full blur-2xl animate-pulse-soft" />
            <div className="relative bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-soft border border-white/50">
              <Feather className="w-16 h-16 text-sage-500 mx-auto animate-float" />
            </div>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-semibold text-sage-800 mb-6 animate-fade-in">
            Reflect
          </h1>
          
          <p className="text-xl md:text-2xl text-sage-600 mb-4 font-light animate-fade-in animate-delay-100">
            Your intelligent journaling companion
          </p>
          
          <p className="text-lg text-sage-500 max-w-2xl mx-auto mb-12 animate-fade-in animate-delay-200">
            Transform daily reflection into meaningful self-discovery. 
            AI-powered prompts, sentiment analysis, and beautiful insights—all completely private.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animate-delay-300">
            <button
              onClick={() => navigate('/')}
              className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-8 py-4"
            >
              Start Journaling
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-secondary inline-flex items-center justify-center gap-2 text-lg px-8 py-4"
            >
              View Demo Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-sage-800 text-center mb-16">
            Journaling, reimagined
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="glass-card rounded-3xl p-8 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 bg-sage-100 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-sage-600" />
                </div>
                <h3 className="font-display text-xl font-semibold text-sage-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-sage-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-sage-800 text-center mb-16">
            Simple. Powerful. Private.
          </h2>

          <div className="space-y-8">
            {[
              { step: '01', title: 'Check in with your mood', desc: 'Start each entry by selecting how you feel. This helps personalize your prompts.' },
              { step: '02', title: 'Write freely or use a prompt', desc: 'Our AI suggests thoughtful questions based on your mood, time of day, and recent entries.' },
              { step: '03', title: 'Discover patterns', desc: 'Watch your emotional trends unfold over time with beautiful visualizations.' },
              { step: '04', title: 'Gain insights', desc: 'Receive gentle weekly summaries that help connect the dots in your life.' },
            ].map((item, index) => (
              <div
                key={item.step}
                className="flex gap-6 items-start animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex-shrink-0 w-12 h-12 bg-sage-500 text-white rounded-2xl flex items-center justify-center font-display font-semibold">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-sage-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sage-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-sand-200/50">
        <div className="max-w-6xl mx-auto text-center text-sage-500 text-sm">
          <p>Built with care for your mental wellness. All data stays on your device.</p>
        </div>
      </footer>
    </div>
  );
}
