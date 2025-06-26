import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ArrowLeft, User, Mail, Save, AlertCircle, CheckCircle, Settings } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function SettingsPage() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/auth';
      return;
    }

    if (profile) {
      setFullName(profile.full_name || '');
      setEmail(profile.email || '');
    }
  }, [user, loading, profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName.trim()) {
      setMessage({ type: 'error', text: 'Full name is required for publishing articles.' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user!.id);

      if (error) {
        throw error;
      }

      // Refresh the profile to get updated data
      await refreshProfile();
      
      setMessage({ type: 'success', text: 'Settings updated successfully!' });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to update settings. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 transition-colors mb-4 sm:mb-6 text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center space-x-3 mb-4">
            <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Account Settings</h1>
          </div>
          <p className="text-gray-600 text-sm sm:text-base">
            Update your account information and preferences
          </p>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
          {message && (
            <div className={`mb-6 p-4 rounded-lg border flex items-center space-x-2 ${
              message.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-700' 
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="text-sm sm:text-base">{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm sm:text-base"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                Your name will be used as the author for published articles. This field is required for creating publications.
              </p>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  className="w-full pl-9 sm:pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed text-sm sm:text-base"
                  disabled
                />
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                Email address cannot be changed. Contact support if you need to update your email.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Account Information</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p><strong>Account Type:</strong> Free Account</p>
                <p><strong>Publication Credits:</strong> {profile?.free_publications_remaining || 0} remaining</p>
                <p><strong>Member Since:</strong> {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                type="submit"
                disabled={saving || !fullName.trim()}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-500 via-purple-600 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-600 hover:via-purple-700 hover:to-teal-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
              >
                <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setFullName(profile?.full_name || '');
                  setMessage(null);
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                Reset
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <strong>Support:</strong>{' '}
                <a href="mailto:help@prai.today" className="text-indigo-600 hover:text-indigo-700">
                  help@prai.today
                </a>
              </p>
              <p>
                <strong>Privacy:</strong>{' '}
                <a href="mailto:privacy@prai.today" className="text-indigo-600 hover:text-indigo-700">
                  privacy@prai.today
                </a>
              </p>
              <p>
                <strong>Terms:</strong>{' '}
                <a href="/terms" className="text-indigo-600 hover:text-indigo-700">
                  Terms of Service
                </a>{' '}
                |{' '}
                <a href="/privacy" className="text-indigo-600 hover:text-indigo-700">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}