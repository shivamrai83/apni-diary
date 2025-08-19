import Starfield from './components/Starfield';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DiaryProvider } from './context/DiaryContext';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-300 font-space">Loading apni diary...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Starfield />
      {user ? <Dashboard /> : <LoginPage />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <DiaryProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
          <AppContent />
        </div>
      </DiaryProvider>
    </AuthProvider>
  );
}

export default App;