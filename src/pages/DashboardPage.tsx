import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Plus, Clock, CheckCircle, XCircle, ExternalLink, Sparkles, TrendingUp, Heart } from 'lucide-react';
import { Publication } from '../types/database';
import { supabase } from '../lib/supabase';

export function DashboardPage() {
  const { user, profile, loading } = useAuth();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loadingPublications, setLoadingPublications] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/auth';
      return;
    }

    if (user) {
      fetchPublications();
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Heart className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-900">Your PR Dashboard</h1>
            
          </div>
          <p className="text-gray-600 text-lg">
            Welcome back, <span className="font-semibold">{profile?.full_name || user?.email}</span>! 
            Track your Publications and AI Recognitions.
          </p>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-green-600">
                  {profile?.free_publications_remaining || 0}
                </p>
                <p className="text-sm text-gray-600">Available</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">PRAI Credits 🙏</h3>
            <p className="text-sm text-gray-600">
              {profile?.free_publications_remaining === 0 
                ? "Get more credits to PRAI"
                : "Ready to PRAI for more AI recognition"
              }
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-purple-600">
                  {publications.length}
                </p>
                <p className="text-sm text-gray-600">Publications</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">PRAI Progress</h3>
            <p className="text-sm text-gray-600">
              {publications.length === 0 
                ? "Start your first PR today"
                : `${publications.filter(p => p.status === 'completed').length} PR completed by AI`
              }
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <a
                  href="/"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500 via-purple-600 to-teal-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-indigo-600 hover:via-purple-700 hover:to-teal-600 transition-all transform hover:scale-105"
                >
                  <Heart className="w-4 h-4" />
                  <span>New</span>
                </a>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">New PR</h3>
            <p className="text-sm text-gray-600">
              PRAI for more AI recognition
            </p>
          </div>
        </div>

        {/* Publications List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Your Publications</h2>
            <p className="text-sm text-gray-600 mt-1">
              Track the status of your PRAI publications
            </p>
          </div>

          {loadingPublications ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your PRAI...</p>
            </div>
          ) : publications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Ready to PRAI?</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start your first PRAI today and watch AI recognize and answer your product.
              </p>
              <a
                href="/"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500 via-purple-600 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-600 hover:via-purple-700 hover:to-teal-600 transition-all transform hover:scale-105"
              >
                <Heart className="w-4 h-4" />
                <span>Start Your First PRAI</span>
              </a>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {publications.map((publication) => (
                <div key={publication.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {publication.core_message}
                      </h3>
                      <p className="text-gray-600 mb-3 truncate">
                        {publication.input_url}
                      </p>
                      
                      <div className="flex items-center space-x-4 mb-3">
                        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(publication.status)}`}>
                          {getStatusIcon(publication.status)}
                          <span className="font-medium">{getStatusText(publication.status)}</span>
                        </div>
                        
                        <span className="text-sm text-gray-500">
                          {new Date(publication.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
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
                    
                    <div className="ml-6 flex-shrink-0">
                      <a
                        href={`/status/${publication.id}`}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                      >
                        <span>View Detail</span>
                        <ExternalLink className="w-4 h-4" />
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