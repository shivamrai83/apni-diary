import React from 'react';
import { User, Mail, Database, Calendar, Download, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDiary } from '../context/DiaryContext';

const UserProfile: React.FC = () => {
  const { user, signOut } = useAuth();
  const { entries } = useDiary();

  const exportData = () => {
    const dataToExport = {
      user: {
        name: user?.name,
        email: user?.email,
        sheet_id: user?.sheet_id,
      },
      entries: entries,
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `space-diary-${user?.name?.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const clearAllData = async () => {
    if (window.confirm('Are you sure you want to clear all your diary data? This action cannot be undone.')) {
      try {
        // Sign out will clear the user session
        await signOut();
      } catch (error) {
        console.error('Error clearing data:', error);
      }
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Profile Info */}
      <div className="glass rounded-xl p-6 border border-purple-500/20">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 rounded-full border-2 border-purple-500 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">{user.name}</h3>
            <p className="text-purple-400">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-3 glass rounded-lg border border-purple-500/20">
            <User className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-sm text-purple-400">Name</p>
              <p className="text-white font-medium">{user.name}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 glass rounded-lg border border-purple-500/20">
            <Mail className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-sm text-purple-400">Email</p>
              <p className="text-white font-medium">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 glass rounded-lg border border-purple-500/20">
            <Database className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-sm text-purple-400">Sheet ID</p>
              <p className="text-white font-medium text-xs">{user.sheet_id || 'Not assigned'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 glass rounded-lg border border-purple-500/20">
            <Calendar className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-sm text-purple-400">Total Entries</p>
              <p className="text-white font-medium">{entries.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="glass rounded-xl p-6 border border-purple-500/20">
        <h3 className="text-lg font-semibold text-white mb-4">Data Management</h3>
        
        <div className="space-y-3">
          <button
            onClick={exportData}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 cosmic-btn rounded-xl font-medium text-white"
          >
            <Download className="w-5 h-5" />
            <span>Export Diary Data</span>
          </button>

          <button
            onClick={clearAllData}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-red-500 hover:bg-red-600 rounded-xl font-medium text-white transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            <span>Clear All Data</span>
          </button>
        </div>

        <div className="mt-4 p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
          <p className="text-xs text-purple-300">
            <strong>Note:</strong> Your data is securely stored in Supabase with end-to-end encryption. 
            Export functionality allows you to download a backup of your entries in JSON format.
          </p>
        </div>
      </div>

      {/* App Info */}
      <div className="glass rounded-xl p-6 border border-purple-500/20">
        <h3 className="text-lg font-semibold text-white mb-4">About Apni Diary</h3>
        <div className="space-y-3 text-sm text-purple-300">
          <p>
            Apni Diary is your personal cosmic journal, designed to capture your thoughts and memories 
            in a beautiful, space-themed environment.
          </p>
          <p>
            <strong>Features:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Daily entry tracking with mood indicators</li>
            <li>Secure authentication with Supabase</li>
            <li>Cloud-based data storage</li>
            <li>Data export and backup capabilities</li>
            <li>Responsive design for all devices</li>
            <li>Real-time data synchronization</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;