import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, ExternalLink, ArrowLeft } from 'lucide-react';
import { ArticleDetails } from '../types/publast';
import { supabase } from '../lib/supabase';

interface PublicationStatusProps {
  publicationId: string;
  coreMessage: string;
  keywords: string[];
  inputUrl: string;
}

export function PublicationStatus({ 
  publicationId, 
  coreMessage, 
  keywords, 
  inputUrl 
}: PublicationStatusProps) {
  const [articles, setArticles] = useState<ArticleDetails[]>([]);
  const [overallStatus, setOverallStatus] = useState<'processing' | 'completed' | 'failed'>('processing');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error('No authentication session');
        }

        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/publication-status?id=${publicationId}`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setArticles(data.articles || []);
          setOverallStatus(data.status);
          setError(null);
        } else {
          throw new Error(data.error || 'Failed to fetch status');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching publication status:', error);
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
        setLoading(false);
      }
    };

    fetchStatus();
    
    // Poll for updates every 30 seconds if still processing
    const interval = setInterval(() => {
      if (overallStatus === 'processing' && !error) {
        fetchStatus();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [publicationId, overallStatus, error]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'failed':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading publication status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Status</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">Publication Status</h1>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Publication Details</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-600">Original URL:</span>
                <p className="text-gray-900">{inputUrl}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Core Message:</span>
                <p className="text-gray-900">{coreMessage}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Keywords:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Article Status</h2>
            <div className={`px-4 py-2 rounded-full border ${getStatusColor(overallStatus)}`}>
              <div className="flex items-center space-x-2">
                {getStatusIcon(overallStatus)}
                <span className="font-medium capitalize">{overallStatus}</span>
              </div>
            </div>
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No articles found for this publication.</p>
              <p className="text-sm text-gray-500 mt-2">
                This could mean the publication is still being processed or there was an issue with the publication service.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {articles.map((article) => (
                <div
                  key={article.article_id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {article.site_name}
                      </h3>
                      <p className="text-gray-600 mb-3">{article.site_domain}</p>
                      
                      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(article.status)}`}>
                        {getStatusIcon(article.status)}
                        <span className="font-medium capitalize">{article.status}</span>
                      </div>
                      
                      {article.published_at && (
                        <p className="text-sm text-gray-500 mt-2">
                          Published on {new Date(article.published_at).toLocaleDateString()}
                        </p>
                      )}
                      
                      {article.error_message && (
                        <p className="text-sm text-red-600 mt-2">
                          Error: {article.error_message}
                        </p>
                      )}
                    </div>
                    
                    {article.published_url && (
                      <a
                        href={article.published_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                      >
                        <span>View Article</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}