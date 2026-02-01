import React, { useState } from 'react';
import { useJournal, MOODS } from '../context/JournalContext';
import { 
  Search, Calendar, Trash2, ChevronDown, ChevronUp,
  BookOpen, ArrowRight, Filter, X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns';

export default function HistoryPage() {
  const { entries, deleteEntry } = useJournal();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedEntry, setExpandedEntry] = useState(null);
  const [filterMood, setFilterMood] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Filter entries
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = searchQuery === '' || 
      entry.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMood = !filterMood || entry.mood === filterMood;
    return matchesSearch && matchesMood;
  });

  // Group entries by time period
  const groupedEntries = filteredEntries.reduce((groups, entry) => {
    const date = new Date(entry.createdAt);
    let group;
    
    if (isToday(date)) group = 'Today';
    else if (isYesterday(date)) group = 'Yesterday';
    else if (isThisWeek(date)) group = 'This Week';
    else if (isThisMonth(date)) group = 'This Month';
    else group = format(date, 'MMMM yyyy');

    if (!groups[group]) groups[group] = [];
    groups[group].push(entry);
    return groups;
  }, {});

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) return format(date, 'h:mm a');
    if (isYesterday(date)) return 'Yesterday, ' + format(date, 'h:mm a');
    return format(date, 'MMM d, yyyy • h:mm a');
  };

  const handleDelete = (id) => {
    deleteEntry(id);
    setConfirmDelete(null);
    if (expandedEntry === id) setExpandedEntry(null);
  };

  if (entries.length === 0) {
    return (
      <div className="min-h-screen p-6 md:p-10 flex items-center justify-center">
        <div className="text-center max-w-md animate-fade-in">
          <div className="w-20 h-20 bg-sage-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-sage-400" />
          </div>
          <h2 className="font-display text-2xl font-semibold text-sage-800 mb-3">
            Your history awaits
          </h2>
          <p className="text-sage-600 mb-8">
            Start journaling and your entries will appear here, organized by time.
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
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-8 animate-fade-in">
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-sage-800">
            Journal History
          </h1>
          <p className="text-sage-600 mt-2">
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'} in your journal
          </p>
        </header>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4 animate-fade-in animate-delay-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
            <input
              type="text"
              placeholder="Search your entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/50 border border-sand-200 rounded-xl
                         text-sage-800 placeholder:text-sage-400
                         focus:outline-none focus:ring-2 focus:ring-sage-300/50 focus:border-sage-300
                         transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-sage-100 rounded-lg"
              >
                <X size={16} className="text-sage-400" />
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm text-sage-600 hover:text-sage-800 transition-colors"
          >
            <Filter size={16} />
            Filter by mood
            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {/* Mood Filters */}
          {showFilters && (
            <div className="flex flex-wrap gap-2 animate-fade-in">
              <button
                onClick={() => setFilterMood(null)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  !filterMood
                    ? 'bg-sage-500 text-white'
                    : 'bg-white/50 text-sage-600 hover:bg-white/80'
                }`}
              >
                All
              </button>
              {Object.entries(MOODS).map(([key, { emoji, label }]) => (
                <button
                  key={key}
                  onClick={() => setFilterMood(filterMood === key ? null : key)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                    filterMood === key
                      ? 'bg-sage-500 text-white'
                      : 'bg-white/50 text-sage-600 hover:bg-white/80'
                  }`}
                >
                  <span>{emoji}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results Count */}
        {(searchQuery || filterMood) && (
          <p className="text-sm text-sage-500 mb-4">
            Showing {filteredEntries.length} of {entries.length} entries
          </p>
        )}

        {/* Entries List */}
        {filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sage-500">No entries match your search.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedEntries).map(([group, groupEntries]) => (
              <div key={group} className="animate-fade-in">
                <h2 className="text-sm font-medium text-sage-500 mb-4 flex items-center gap-2">
                  <Calendar size={14} />
                  {group}
                </h2>
                <div className="space-y-3">
                  {groupEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className={`entry-card ${expandedEntry === entry.id ? 'ring-2 ring-sage-300' : ''}`}
                      onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
                    >
                      <div className="flex items-start gap-4">
                        {/* Mood Emoji */}
                        <div className="w-12 h-12 bg-sage-50 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">{MOODS[entry.mood]?.emoji || '📝'}</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-4 mb-2">
                            <span className="text-xs text-sage-500">
                              {formatDate(entry.createdAt)}
                            </span>
                            <span className="text-xs text-sage-400">
                              {MOODS[entry.mood]?.label}
                            </span>
                          </div>
                          
                          <p className={`text-sage-700 ${
                            expandedEntry === entry.id ? '' : 'line-clamp-3'
                          }`}>
                            {entry.content}
                          </p>

                          {/* Expanded Content */}
                          {expandedEntry === entry.id && (
                            <div className="mt-4 pt-4 border-t border-sand-200 animate-fade-in">
                              {/* Themes */}
                              {entry.themes?.length > 0 && (
                                <div className="mb-3">
                                  <p className="text-xs text-sage-500 mb-2">Themes detected:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {entry.themes.map(theme => (
                                      <span
                                        key={theme}
                                        className="px-3 py-1 bg-dusk-50 text-dusk-600 rounded-full text-xs"
                                      >
                                        {theme}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Sentiment */}
                              <div className="mb-4">
                                <p className="text-xs text-sage-500 mb-2">Sentiment score:</p>
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 h-2 bg-sand-100 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-gradient-to-r from-dusk-400 to-sage-400 rounded-full"
                                      style={{ width: `${Math.round((entry.sentiment || 0.5) * 100)}%` }}
                                    />
                                  </div>
                                  <span className="text-xs text-sage-600">
                                    {Math.round((entry.sentiment || 0.5) * 100)}%
                                  </span>
                                </div>
                              </div>

                              {/* Prompt if used */}
                              {entry.prompt && (
                                <div className="mb-4 p-3 bg-sage-50 rounded-xl">
                                  <p className="text-xs text-sage-500 mb-1">Prompt used:</p>
                                  <p className="text-sm text-sage-700 italic">"{entry.prompt}"</p>
                                </div>
                              )}

                              {/* Delete Button */}
                              <div className="flex justify-end">
                                {confirmDelete === entry.id ? (
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-sage-600">Delete this entry?</span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(entry.id);
                                      }}
                                      className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                      Yes, delete
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setConfirmDelete(null);
                                      }}
                                      className="px-3 py-1.5 bg-sand-100 text-sage-700 text-sm rounded-lg hover:bg-sand-200 transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setConfirmDelete(entry.id);
                                    }}
                                    className="p-2 text-sage-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Expand/Collapse Indicator */}
                        <div className="flex-shrink-0">
                          {expandedEntry === entry.id ? (
                            <ChevronUp size={20} className="text-sage-400" />
                          ) : (
                            <ChevronDown size={20} className="text-sage-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Write New CTA */}
        <div className="mt-12 text-center">
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            Write a new entry
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
