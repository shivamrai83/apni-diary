import React, { useState } from 'react';
import { LogOut, Plus, Calendar, BookOpen, Sparkles, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDiary } from '../context/DiaryContext';
import DiaryForm from '../components/DiaryForm';
import EntryList from '../components/EntryList';
import UserProfile from '../components/UserProfile';

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const { entries, getTodayEntry } = useDiary();
  const [activeTab, setActiveTab] = useState<'today' | 'entries' | 'profile'>('today');
  
  const todayEntry = getTodayEntry();
  const hasWrittenToday = !!todayEntry;

  const stats = {
    totalEntries: entries.length,
    currentStreak: calculateStreak(entries),
    thisMonth: entries.filter(entry => {
      const entryDate = new Date(entry.date);
      const now = new Date();
      return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear();
    }).length,
  };

  function calculateStreak(entries: any[]): number {
    if (entries.length === 0) return 0;
    
    const sortedDates = entries
      .map(entry => new Date(entry.date))
      .sort((a, b) => b.getTime() - a.getTime());
    
    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (sortedDates[0].getTime() !== today.getTime()) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      if (sortedDates[0].getTime() !== yesterday.getTime()) {
        return 0;
      }
    }
    
    for (let i = 1; i < sortedDates.length; i++) {
      const current = sortedDates[i];
      const previous = sortedDates[i - 1];
      const diffDays = Math.floor((previous.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  const navigation = [
    { id: 'today' as const, label: 'Today', icon: Plus, badge: hasWrittenToday ? null : '!' },
    { id: 'entries' as const, label: 'Entries', icon: BookOpen, badge: entries.length > 0 ? entries.length : null },
    { id: 'profile' as const, label: 'Profile', icon: Settings, badge: null },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass border-b border-purple-500/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-space font-bold gradient-text">Apni Diary</h1>
                <p className="text-sm text-purple-400">Welcome back, {user?.name}</p>
              </div>
            </div>

            <button
              onClick={signOut}
              className="flex items-center space-x-2 px-4 py-2 glass rounded-lg border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Stats Cards */}
            <div className="space-y-4 mb-8">
              <div className="glass rounded-xl p-4 border border-purple-500/20">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-8 h-8 text-purple-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.currentStreak}</p>
                    <p className="text-sm text-purple-400">Day Streak</p>
                  </div>
                </div>
              </div>
              
              <div className="glass rounded-xl p-4 border border-purple-500/20">
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-8 h-8 text-purple-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.totalEntries}</p>
                    <p className="text-sm text-purple-400">Total Entries</p>
                  </div>
                </div>
              </div>
              
              <div className="glass rounded-xl p-4 border border-purple-500/20">
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-8 h-8 text-purple-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.thisMonth}</p>
                    <p className="text-sm text-purple-400">This Month</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'glass border border-purple-500/20 hover:border-purple-400/50 text-purple-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      activeTab === item.id
                        ? 'bg-white/20 text-white'
                        : 'bg-purple-500/20 text-purple-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'today' && (
              <div className="space-y-6">
                <div className="glass rounded-xl p-6 border border-purple-500/20">
                  <h2 className="text-2xl font-space font-bold gradient-text mb-4">
                    {hasWrittenToday ? "Today's Entry" : "Write Today's Entry"}
                  </h2>
                  <DiaryForm existingEntry={todayEntry} />
                </div>
              </div>
            )}

            {activeTab === 'entries' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-space font-bold gradient-text">Your Entries</h2>
                  <div className="text-sm text-purple-400">
                    {entries.length} {entries.length === 1 ? 'entry' : 'entries'} total
                  </div>
                </div>
                <EntryList />
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-space font-bold gradient-text mb-6">Profile Settings</h2>
                <UserProfile />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;