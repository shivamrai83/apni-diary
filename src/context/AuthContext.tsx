import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  sheet_id?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing Supabase session
    const getSession = async () => {
      console.log('AuthContext: Starting session check...');
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('AuthContext: Session check result:', session);
        if (session?.user) {
          console.log('AuthContext: User found in session, loading profile...');
          await loadUserProfile(session.user.id);
        } else {
          console.log('AuthContext: No session found');
        }
      } catch (error) {
        console.error('AuthContext: Error checking session:', error);
      } finally {
        console.log('AuthContext: Setting loading to false');
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    console.log('AuthContext: Setting up auth state listener...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthContext: Auth state change event:', event, session);
        if (session?.user) {
          console.log('AuthContext: User authenticated, loading profile...');
          await loadUserProfile(session.user.id);
        } else {
          console.log('AuthContext: User not authenticated');
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      console.log('AuthContext: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      console.log('AuthContext: Loading profile for user ID:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      console.log('AuthContext: Profile query result:', { data, error });

      if (error) {
        console.error('AuthContext: Error loading user profile:', error);
        
        // If profile doesn't exist, create it
        if (error.code === 'PGRST116') {
          console.log('AuthContext: Profile not found, creating new profile...');
          await createUserProfile(userId);
        }
        return;
      }

      if (data) {
        console.log('AuthContext: Profile loaded successfully:', data);
        setUser(data);
      }
    } catch (error) {
      console.error('AuthContext: Error loading user profile:', error);
    }
  };

  const createUserProfile = async (userId: string) => {
    try {
      console.log('AuthContext: Creating new profile for user:', userId);
      
      // Get user info from auth
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        console.error('AuthContext: No auth user found');
        return;
      }

      const newProfile = {
        id: userId,
        name: authUser.user_metadata?.name || 'User',
        email: authUser.email || '',
        sheet_id: generateSheetId(authUser.user_metadata?.name || 'User'),
      };

      console.log('AuthContext: Creating profile with data:', newProfile);

      const { data, error } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select()
        .single();

      if (error) {
        console.error('AuthContext: Error creating profile:', error);
        return;
      }

      console.log('AuthContext: Profile created successfully:', data);
      setUser(data);
    } catch (error) {
      console.error('AuthContext: Error creating profile:', error);
    }
  };

  const generateSheetId = (userName: string): string => {
    return `SpaceDiary_${userName.replace(/\s+/g, '_')}_${Date.now()}`;
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile
        const sheetId = generateSheetId(name);
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ 
            id: data.user.id, 
            name, 
            email,
            sheet_id: sheetId
          }]);

        if (profileError) throw profileError;
      }
    } catch (error) {
      console.error('Error during sign up:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error during sign in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Error during sign out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};