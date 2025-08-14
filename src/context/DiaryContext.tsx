import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface DiaryEntry {
  id: string;
  date: string;
  title: string;
  mood: string;
  content: string;
  timestamp: number;
}

interface DiaryContextType {
  entries: DiaryEntry[];
  addEntry: (entry: Omit<DiaryEntry, 'id' | 'timestamp'>) => void;
  updateEntry: (id: string, entry: Partial<DiaryEntry>) => void;
  deleteEntry: (id: string) => void;
  getTodayEntry: () => DiaryEntry | undefined;
  loading: boolean;
}

const DiaryContext = createContext<DiaryContextType | undefined>(undefined);

export const useDiary = () => {
  const context = useContext(DiaryContext);
  if (context === undefined) {
    throw new Error('useDiary must be used within a DiaryProvider');
  }
  return context;
};

interface DiaryProviderProps {
  children: ReactNode;
}

export const DiaryProvider: React.FC<DiaryProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadEntries();
    } else {
      setEntries([]);
    }
  }, [user]);

  const loadEntries = () => {
    if (!user) return;
    
    setLoading(true);
    const savedEntries = localStorage.getItem(`diary_${user.id}`);
    if (savedEntries) {
      const parsedEntries = JSON.parse(savedEntries);
      setEntries(parsedEntries.sort((a: DiaryEntry, b: DiaryEntry) => b.timestamp - a.timestamp));
    }
    setLoading(false);
  };

  const saveEntries = (newEntries: DiaryEntry[]) => {
    if (!user) return;
    localStorage.setItem(`diary_${user.id}`, JSON.stringify(newEntries));
  };

  const addEntry = (entryData: Omit<DiaryEntry, 'id' | 'timestamp'>) => {
    const newEntry: DiaryEntry = {
      ...entryData,
      id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    const newEntries = [newEntry, ...entries];
    setEntries(newEntries);
    saveEntries(newEntries);
  };

  const updateEntry = (id: string, updatedData: Partial<DiaryEntry>) => {
    const newEntries = entries.map(entry =>
      entry.id === id ? { ...entry, ...updatedData } : entry
    );
    setEntries(newEntries);
    saveEntries(newEntries);
  };

  const deleteEntry = (id: string) => {
    const newEntries = entries.filter(entry => entry.id !== id);
    setEntries(newEntries);
    saveEntries(newEntries);
  };

  const getTodayEntry = (): DiaryEntry | undefined => {
    const today = new Date().toISOString().split('T')[0];
    return entries.find(entry => entry.date === today);
  };

  return (
    <DiaryContext.Provider value={{
      entries,
      addEntry,
      updateEntry,
      deleteEntry,
      getTodayEntry,
      loading
    }}>
      {children}
    </DiaryContext.Provider>
  );
};