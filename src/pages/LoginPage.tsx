import React, { useState } from 'react';
import { Rocket, Stars, Globe, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, name);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setEmail('');
    setPassword('');
    setName('');
  };

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

        {/* Right side - Auth Form */}
        <div className="glass rounded-3xl p-8 border-2 border-purple-500/30">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-space font-bold text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Join the Journey'}
            </h2>
            <p className="text-purple-300">
              {isLogin ? 'Sign in to access your personal apni diary' : 'Create your account to start your cosmic journey'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-purple-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-purple-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-purple-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-purple-900/30 border border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-xl">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full cosmic-btn py-4 px-6 rounded-xl font-semibold text-white text-lg flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <User className="w-6 h-6" />
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <button
              onClick={toggleMode}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>

          <div className="mt-8 p-4 bg-purple-900/20 rounded-xl border border-purple-500/20">
            <p className="text-xs text-purple-300 text-center">
              <strong>Secure:</strong> Your data is securely stored in Supabase with end-to-end encryption.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;