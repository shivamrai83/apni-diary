import React, { useState, useEffect } from 'react';
import { Save, Heart, Smile, Meh, Frown, Sun } from 'lucide-react';
import { useDiary, DiaryEntry } from '../context/DiaryContext';

interface DiaryFormProps {
  existingEntry?: DiaryEntry;
}

const DiaryForm: React.FC<DiaryFormProps> = ({ existingEntry }) => {
  const { addEntry, updateEntry } = useDiary();
  const [title, setTitle] = useState('');
  const [mood, setMood] = useState('😊');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const moods = [
    { emoji: '😊', label: 'Happy', icon: Smile, color: 'text-green-400' },
    { emoji: '😢', label: 'Sad', icon: Frown, color: 'text-blue-400' },
    { emoji: '😐', label: 'Neutral', icon: Meh, color: 'text-gray-400' },
    { emoji: '❤️', label: 'Loved', icon: Heart, color: 'text-red-400' },
    { emoji: '☀️', label: 'Energetic', icon: Sun, color: 'text-yellow-400' },
  ];

  useEffect(() => {
    if (existingEntry) {
      setTitle(existingEntry.title);
      setMood(existingEntry.mood);
      setContent(existingEntry.content);
    }
  }, [existingEntry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);

    const today = new Date().toISOString().split('T')[0];

    try {
      if (existingEntry) {
        updateEntry(existingEntry.id, { title, mood, content });
      } else {
        addEntry({
          date: today,
          title: title.trim(),
          mood,
          content: content.trim(),
        });
      }

      if (!existingEntry) {
        setTitle('');
        setMood('😊');
        setContent('');
      }
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Input */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-purple-300 mb-2">
          Entry Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your day a title..."
          className="w-full px-4 py-3 glass rounded-xl border border-purple-500/30 focus:border-purple-400 focus:outline-none transition-colors text-white placeholder-purple-400"
          required
        />
      </div>

      {/* Mood Selection */}
      <div>
        <label className="block text-sm font-medium text-purple-300 mb-3">
          How are you feeling?
        </label>
        <div className="flex flex-wrap gap-3">
          {moods.map((moodOption) => (
            <button
              key={moodOption.emoji}
              type="button"
              onClick={() => setMood(moodOption.emoji)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                mood === moodOption.emoji
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white transform scale-105'
                  : 'glass border border-purple-500/30 hover:border-purple-400/50 text-purple-300 hover:transform hover:scale-105'
              }`}
            >
              <span className="text-lg">{moodOption.emoji}</span>
              <span className="text-sm font-medium">{moodOption.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Textarea */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-purple-300 mb-2">
          Your thoughts among the stars...
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write about your day, your dreams, your adventures in this cosmic journey we call life..."
          rows={8}
          className="w-full px-4 py-3 glass rounded-xl border border-purple-500/30 focus:border-purple-400 focus:outline-none transition-colors text-white placeholder-purple-400 resize-none"
          required
        />
      </div>

      {/* Character Count */}
      <div className="text-right">
        <span className="text-sm text-purple-400">
          {content.length} characters
        </span>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || !title.trim() || !content.trim()}
        className="w-full cosmic-btn py-3 px-6 rounded-xl font-semibold text-white flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Save className="w-5 h-5" />
        <span>
          {isSubmitting 
            ? 'Saving to the cosmos...' 
            : existingEntry 
              ? 'Update Entry' 
              : 'Save Entry'
          }
        </span>
      </button>

      {existingEntry && (
        <p className="text-sm text-purple-400 text-center">
          Last updated: {new Date(existingEntry.timestamp).toLocaleDateString()}
        </p>
      )}
    </form>
  );
};

export default DiaryForm;