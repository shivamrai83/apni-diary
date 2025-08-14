import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  sheetId: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (userData: Omit<User, 'sheetId'>) => void;
  signOut: () => void;
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
    // Check for existing user session
    const savedUser = localStorage.getItem('spaceDiaryUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const generateSheetId = (userName: string): string => {
    return `SpaceDiary_${userName.replace(/\s+/g, '_')}_${Date.now()}`;
  };

  const signIn = (userData: Omit<User, 'sheetId'>) => {
    const sheetId = generateSheetId(userData.name);
    const userWithSheet: User = { ...userData, sheetId };
    
    setUser(userWithSheet);
    localStorage.setItem('spaceDiaryUser', JSON.stringify(userWithSheet));
    
    // Initialize user's diary sheet if it doesn't exist
    const existingEntries = localStorage.getItem(`diary_${userWithSheet.id}`);
    if (!existingEntries) {
      localStorage.setItem(`diary_${userWithSheet.id}`, JSON.stringify([]));
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('spaceDiaryUser');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};