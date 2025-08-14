import React, { useState } from 'react';
import { Rocket, Stars, Globe, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const { signIn } = useAuth();
  const [showSimulatedLogin, setShowSimulatedLogin] = useState(false);

  const handleGoogleSignIn = () => {
    setShowSimulatedLogin(true);
  };

  const handleSimulatedLogin = (userData: { name: string; email: string }) => {
    const avatarUrl = `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face`;
    
    signIn({
      id: `user_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      avatar: avatarUrl,
    });
  };

  const demoUsers = [
    { name: 'John Doe', email: 'john.doe@apnidiary.com' },
    { name: 'Alex Carter', email: 'alex.carter@apnidiary.com' },
  ];

  if (showSimulatedLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass rounded-3xl p-8 max-w-md w-full border-2 border-purple-500/30">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-space font-bold gradient-text mb-2">
              Choose Your Space Identity
            </h2>
            <p className="text-purple-300">Select a demo user to continue</p>
          </div>

          <div className="space-y-3">
            {demoUsers.map((user, index) => (
              <button
                key={index}
                onClick={() => handleSimulatedLogin(user)}
                className="w-full p-4 glass rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-105 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                      {user.name}
                    </p>
                    <p className="text-sm text-purple-400">{user.email}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowSimulatedLogin(false)}
            className="w-full mt-6 py-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            ← Back to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Hero Content */}
        <div className="text-center lg:text-left">
          <div className="float mb-8">
            <div className="w-24 h-24 mx-auto lg:mx-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center pulse-glow">
              <Rocket className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-space font-bold gradient-text mb-6 leading-tight">
            Apni Diary
          </h1>
          
          <p className="text-xl text-purple-300 mb-8 leading-relaxed">
            Your personal galaxy of memories. Write your daily thoughts among the stars 
            and let the cosmos keep your secrets safe.
          </p>
          
          <div className="flex items-center justify-center lg:justify-start space-x-8 text-purple-400">
            <div className="flex items-center space-x-2">
              <Stars className="w-5 h-5" />
              <span>Cosmic Writing</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>Universal Access</span>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="glass rounded-3xl p-8 border-2 border-purple-500/30">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-space font-bold text-white mb-2">
              Welcome Aboard
            </h2>
            <p className="text-purple-300">
              Sign in to access your personal apni diary
            </p>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full cosmic-btn py-4 px-6 rounded-xl font-semibold text-white text-lg flex items-center justify-center space-x-3 mb-6"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="text-center">
            <p className="text-sm text-purple-400">
              Your data is securely stored in your personal Google Sheet
            </p>
          </div>

          <div className="mt-8 p-4 bg-purple-900/20 rounded-xl border border-purple-500/20">
            <p className="text-xs text-purple-300 text-center mb-2">
              <strong>Demo Mode:</strong> This is a demonstration version using simulated Google authentication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;