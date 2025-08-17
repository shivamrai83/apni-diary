import React, { useState } from 'react';
import { Calendar, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useDiary, DiaryEntry } from '../context/DiaryContext';

const EntryList: React.FC = () => {
  const { entries, deleteEntry } = useDiary();
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);

  const toggleExpanded = (entryId: string) => {
    setExpandedEntry(expandedEntry === entryId ? null : entryId);
  };

  const handleDelete = (entryId: string) => {
    deleteEntry(entryId);
    setEntryToDelete(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getRelativeTime = (createdAt: string) => {
    const now = new Date().getTime();
    const diff = now - new Date(createdAt).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
          <Calendar className="w-10 h-10 text-purple-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No entries yet</h3>
        <p className="text-purple-400">Start your cosmic journey by writing your first entry!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="glass rounded-xl border border-purple-500/20 overflow-hidden transition-all duration-300 hover:border-purple-400/30"
        >
          {/* Entry Header */}
          <div
            className="p-6 cursor-pointer"
            onClick={() => toggleExpanded(entry.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">{entry.mood}</span>
                  <h3 className="text-lg font-semibold text-white">{entry.title}</h3>
                </div>
                <div className="flex items-center space-x-4 text-sm text-purple-400">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(entry.date)}</span>
                  </span>
                  <span>{getRelativeTime(entry.created_at)}</span>
                </div>
                {expandedEntry !== entry.id && (
                  <p className="text-purple-300 mt-2 line-clamp-2">
                    {entry.content.substring(0, 120)}
                    {entry.content.length > 120 && '...'}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEntryToDelete(entry.id);
                  }}
                  className="p-2 glass rounded-lg border border-red-500/30 text-red-400 hover:border-red-400/50 hover:text-red-300 transition-all duration-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {expandedEntry === entry.id ? (
                  <ChevronUp className="w-5 h-5 text-purple-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-purple-400" />
                )}
              </div>
            </div>
          </div>

          {/* Expanded Content */}
          {expandedEntry === entry.id && (
            <div className="px-6 pb-6 border-t border-purple-500/20">
              <div className="mt-4">
                <p className="text-purple-200 leading-relaxed whitespace-pre-wrap">
                  {entry.content}
                </p>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Delete Confirmation Modal */}
      {entryToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="glass rounded-xl p-6 max-w-md w-full border border-red-500/30">
            <h3 className="text-xl font-semibold text-white mb-4">Delete Entry?</h3>
            <p className="text-purple-300 mb-6">
              Are you sure you want to delete this diary entry? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setEntryToDelete(null)}
                className="flex-1 py-2 px-4 glass rounded-lg border border-purple-500/30 text-purple-300 hover:border-purple-400/50 hover:text-white transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(entryToDelete)}
                className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntryList;