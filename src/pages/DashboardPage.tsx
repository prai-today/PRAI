import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Plus, Clock, CheckCircle, XCircle, ExternalLink, Sparkles, TrendingUp, Heart, Globe, ArrowRight } from 'lucide-react';
import { Publication } from '../types/database';
import { supabase } from '../lib/supabase';

export function DashboardPage() {
  const { user, profile, loading } = useAuth();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loadingPublications, setLoadingPublications] = useState(true);
  const [url, setUrl] = useState('');
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    if (!loading) {
      setHasCheckedAuth(true);
      
      if (!user) {
        console.log('No user found, redirecting to auth');
        window.location.href = '/auth';
        return;
      }

      if (user) {
        fetchPublications();
      }
    }
  }, [user, loading]);

  const fetchPublications = async () => {
    try {
      const { data, error } = await supabase
        .from('publications')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setPublications(data || []);
    } catch (error) {
      console.error('Error fetching publications:', error);
    } finally {
      setLoadingPublications(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      const encodedUrl = encodeURIComponent(url.trim());
      window.location.href = `/analyze?url=${encodedUrl}`;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'failed':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed ✨';
      case 'failed':
        return 'Failed';
      default:
        return 'PRAI-ing 🙏';
    }
  };

  // Show loading while checking auth
  if (loading || !hasCheckedAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Don't render anything if no user (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Your PR Dashboard</h1>
          </div>
          <p className="text-gray-600 text-sm sm:text-lg">
            Welcome back, <span className="font-semibold">{profile?.full_name || user?.email}</span>! 
            Track your Publications and AI Recognitions.
          </p>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl sm:text-3xl font-bold text-green-600">
                  {profile?.free_publications_remaining || 0}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">Available</p>
              </div>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">PRAI Credits 🙏</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              {profile?.free_publications_remaining === 0 
                ? "Get more credits to PRAI"
                : "Ready to PRAI for more AI recognition"
              }
            </p>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl sm:text-3xl font-bold text-purple-600">
                  {publications.length}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">Publications</p>
              </div>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">PRAI Progress</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              {publications.length === 0 
                ? "Start your first PR today"
                : `${publications.filter(p => p.status === 'completed').length} PR completed by AI`
              }
            </p>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-all sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-right">
                <span className="inline-flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-indigo-500 via-purple-600 to-teal-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm">
                  <span>Ready</span>
                </span>
              </div>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">AI Recognition</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Start a new PRAI below
            </p>
          </div>
        </div>

        {/* New PRAI Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 mb-6 sm:mb-8">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
              <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Start New PRAI</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              Enter your website URL to begin AI recognition process
            </p>
          </div>

          <div className="p-4 sm:p-6">
            {profile?.free_publications_remaining === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No PRAI Credits Left</h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-4">
                  You've used all your free PRAI credits. Contact us to get more credits.
                </p>
                <a
                  href="mailto:help@prai.today"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all text-xs sm:text-sm"
                >
                  <span>Contact Support</span>
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-600 to-teal-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                  <div className="relative bg-white rounded-xl p-1.5 border border-gray-200 shadow-lg">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                      <div className="flex items-center space-x-3 flex-1 px-3 sm:px-0">
                        <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 ml-0 sm:ml-4" />
                        <input
                          type="url"
                          placeholder="Enter your website URL here"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          className="flex-1 py-3 sm:py-4 px-1 sm:px-2 text-sm sm:text-base bg-transparent border-none outline-none placeholder-gray-400"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-indigo-500 via-purple-600 to-teal-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:from-indigo-600 hover:via-purple-700 hover:to-teal-600 transition-all transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg text-xs sm:text-sm"
                      >
                        <span>PRAI 🙏</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <p className="text-xs sm:text-sm text-gray-500 text-center">
                  Ready to PRAI for your product's AI recognition today!
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Publications List */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Your Publications</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Track the status of your PRAI publications
            </p>
          </div>

          {loadingPublications ? (
            <div className="p-8 sm:p-12 text-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm sm:text-base">Loading your PRAI...</p>
            </div>
          ) : publications.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Ready to PRAI?</h3>
              <p className="text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base">
                Start your first PRAI above and watch AI recognize and answer your product.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {publications.map((publication) => (
                <div key={publication.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-3 sm:space-y-0">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {publication.core_message}
                      </h3>
                      <p className="text-gray-600 mb-3 truncate text-sm sm:text-base">
                        {publication.input_url}
                      </p>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-3">
                        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(publication.status)} w-fit`}>
                          {getStatusIcon(publication.status)}
                          <span className="font-medium text-xs sm:text-sm">{getStatusText(publication.status)}</span>
                        </div>
                        
                        <span className="text-xs sm:text-sm text-gray-500">
                          {new Date(publication.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {publication.keywords.slice(0, 5).map((keyword, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs"
                          >
                            {keyword}
                          </span>
                        ))}
                        {publication.keywords.length > 5 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            +{publication.keywords.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <a
                        href={`/status/${publication.id}`}
                        className="inline-flex items-center space-x-2 px-3 sm:px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-xs sm:text-sm w-full sm:w-auto justify-center"
                      >
                        <span>View Detail</span>
                        <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}