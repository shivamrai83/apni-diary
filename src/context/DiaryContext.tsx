import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

export interface DiaryEntry {
  id: string;
  user_id: string;
  date: string;
  title: string;
  mood: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface DiaryContextType {
  entries: DiaryEntry[];
  addEntry: (entry: Omit<DiaryEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateEntry: (id: string, entry: Partial<DiaryEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
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

  const loadEntries = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('diary_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading entries:', error);
        return;
      }
      
      setEntries(data || []);
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const addEntry = async (entryData: Omit<DiaryEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const newEntry = {
        user_id: user.id,
        ...entryData,
        created_at: new Date().toISOString(),
      };

      console.log('Attempting to insert entry:', newEntry);

      const { data, error } = await supabase
        .from('diary_entries')
        .insert([newEntry])
        .select('*')
        .single();

      if (error) {
        console.error('Error adding entry:', error);
        throw error;
      }

      console.log('Supabase returned data:', data);

      if (data) {
        // Ensure we have a complete entry object
        const completeEntry: DiaryEntry = {
          id: data.id,
          user_id: data.user_id,
          date: data.date,
          title: data.title,
          mood: data.mood,
          content: data.content,
          created_at: data.created_at,
          updated_at: data.updated_at,
        };
        
        console.log('Complete entry object:', completeEntry);
        console.log('Current entries before update:', entries);
        
        setEntries([completeEntry, ...entries]);
        
        console.log('Entries state updated');
      }
    } catch (error) {
      console.error('Error adding entry:', error);
      throw error;
    }
  };

  const updateEntry = async (id: string, updatedData: Partial<DiaryEntry>) => {
    try {
      const { error } = await supabase
        .from('diary_entries')
        .update(updatedData)
        .eq('id', id);

      if (error) {
        console.error('Error updating entry:', error);
        throw error;
      }

      const newEntries = entries.map(entry =>
        entry.id === id ? { ...entry, ...updatedData } : entry
      );
      setEntries(newEntries);
    } catch (error) {
      console.error('Error updating entry:', error);
      throw error;
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('diary_entries')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting entry:', error);
        throw error;
      }

      const newEntries = entries.filter(entry => entry.id !== id);
      setEntries(newEntries);
    } catch (error) {
      console.error('Error deleting entry:', error);
      throw error;
    }
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