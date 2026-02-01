import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Key, Database, Trash2, X, Check, Moon, Sun } from 'lucide-react';
import { getApiKey, setApiKey, removeApiKey, isApiConfigured } from '../utils/aiService';
import { seedDemoData, clearAllData } from '../utils/demoData';

export default function Settings({ isOpen, onClose }) {
  const [apiKey, setApiKeyState] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const key = getApiKey();
    if (key) {
      setApiKeyState(key);
      setIsConfigured(true);
    }
    setDarkMode(document.documentElement.classList.contains('dark'));
  }, [isOpen]);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      setApiKey(apiKey.trim());
      setIsConfigured(true);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleRemoveKey = () => {
    removeApiKey();
    setApiKeyState('');
    setIsConfigured(false);
  };

  const handleLoadDemo = () => {
    if (window.confirm('This will add 14 demo journal entries. Continue?')) {
      seedDemoData();
    }
  };

  const handleClearData = () => {
    if (window.confirm('This will delete ALL your journal entries. This cannot be undone. Continue?')) {
      clearAllData();
    }
  };

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setDarkMode(!darkMode);
    localStorage.setItem('reflect-dark-mode', !darkMode);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 9999 }}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-md max-h-[85vh] overflow-y-auto rounded-3xl shadow-2xl"
        style={{ backgroundColor: 'white' }}
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-100 bg-white rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#e3e7e3' }}>
              <SettingsIcon className="w-5 h-5" style={{ color: '#617461' }} />
            </div>
            <h2 className="text-xl font-semibold" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#353f35' }}>
              Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* AI Configuration */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Key size={18} style={{ color: '#867396' }} />
              <h3 className="font-medium" style={{ color: '#353f35' }}>AI Integration</h3>
              {isConfigured && (
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#dcfce7', color: '#166534' }}>Active</span>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-3">
              Add your Claude API key for AI-powered prompts. 
              Get one at{' '}
              <a 
                href="https://console.anthropic.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="underline"
                style={{ color: '#617461' }}
              >
                console.anthropic.com
              </a>
            </p>
            <div className="flex gap-2">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKeyState(e.target.value)}
                placeholder="sk-ant-api..."
                className="flex-1 px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: '#f9fafb', 
                  borderColor: '#e5e7eb',
                }}
              />
              <button
                onClick={handleSaveKey}
                className="px-4 py-2.5 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                style={{ backgroundColor: '#617461' }}
              >
                {saved ? <Check size={16} /> : 'Save'}
              </button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <button
                onClick={() => setShowKey(!showKey)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                {showKey ? 'Hide' : 'Show'} key
              </button>
              {isConfigured && (
                <button
                  onClick={handleRemoveKey}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Remove key
                </button>
              )}
            </div>
          </div>

          {/* Appearance */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              {darkMode ? <Moon size={18} style={{ color: '#867396' }} /> : <Sun size={18} style={{ color: '#eab308' }} />}
              <h3 className="font-medium" style={{ color: '#353f35' }}>Appearance</h3>
            </div>
            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors"
              style={{ backgroundColor: '#f9fafb' }}
            >
              <span className="text-sm text-gray-700">Dark Mode</span>
              <div 
                className="w-11 h-6 rounded-full transition-colors"
                style={{ backgroundColor: darkMode ? '#617461' : '#d1d5db' }}
              >
                <div 
                  className="w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform mt-0.5"
                  style={{ 
                    transform: darkMode ? 'translateX(22px)' : 'translateX(2px)'
                  }}
                />
              </div>
            </button>
          </div>

          {/* Data Management */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Database size={18} style={{ color: '#617461' }} />
              <h3 className="font-medium" style={{ color: '#353f35' }}>Data</h3>
            </div>
            <div className="space-y-2">
              <button
                onClick={handleLoadDemo}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors text-sm"
                style={{ backgroundColor: '#f0eef4', color: '#5b4b6e' }}
              >
                <span>Load Demo Data</span>
                <span className="text-xs opacity-70">14 sample entries</span>
              </button>
              <button
                onClick={handleClearData}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors text-sm"
                style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}
              >
                <span className="flex items-center gap-2">
                  <Trash2 size={16} />
                  Clear All Data
                </span>
                <span className="text-xs opacity-70">Cannot be undone</span>
              </button>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">
              🔒 All journal entries are stored locally on your device.
              {isConfigured && ' AI features send only minimal context to Claude API.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
