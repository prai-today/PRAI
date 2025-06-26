import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ArrowLeft, Globe, Sparkles, Edit3, Check, X, ExternalLink, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AnalysisResult {
  core_message: string;
  keywords: string[];
}

interface PublastSite {
  id: number;
  name: string;
  domain: string;
  description?: string;
  category: string;
}

export function AnalyzePage() {
  const { user, loading } = useAuth();
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [editingCoreMessage, setEditingCoreMessage] = useState(false);
  const [editingKeywords, setEditingKeywords] = useState(false);
  const [tempCoreMessage, setTempCoreMessage] = useState('');
  const [tempKeywords, setTempKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [publishing, setPublishing] = useState(false);
  
  // Site selection state
  const [availableSites, setAvailableSites] = useState<PublastSite[]>([]);
  const [selectedSites, setSelectedSites] = useState<number[]>([]);
  const [loadingSites, setLoadingSites] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/auth';
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const url = params.get('url');
    if (url) {
      setWebsiteUrl(decodeURIComponent(url));
      analyzeWebsite(decodeURIComponent(url));
      loadAvailableSites();
    }
  }, [user, loading]);

  const loadAvailableSites = async () => {
    setLoadingSites(true);
    try {
      const { data: sites, error } = await supabase
        .from('publast_sites')
        .select('id, name, domain, description, category')
        .limit(5);

      if (error) {
        throw error;
      }

      if (sites && sites.length > 0) {
        setAvailableSites(sites);
        // Pre-select first 3 sites
        setSelectedSites(sites.slice(0, Math.min(3, sites.length)).map(site => site.id));
      }
    } catch (error) {
      console.error('Error loading sites:', error);
    } finally {
      setLoadingSites(false);
    }
  };

  const analyzeWebsite = async (url: string) => {
    setAnalyzing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No authentication session');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-website`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      
      if (data.success && data.analysis) {
        setAnalysisResult(data.analysis);
        setTempCoreMessage(data.analysis.core_message);
        setTempKeywords([...data.analysis.keywords]);
      } else {
        throw new Error(data.error || 'Failed to analyze website');
      }
    } catch (error) {
      console.error('Error analyzing website:', error);
      alert(`Analysis failed: ${error.message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveCoreMessage = () => {
    if (analysisResult) {
      setAnalysisResult({
        ...analysisResult,
        core_message: tempCoreMessage
      });
    }
    setEditingCoreMessage(false);
  };

  const handleCancelCoreMessage = () => {
    setTempCoreMessage(analysisResult?.core_message || '');
    setEditingCoreMessage(false);
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !tempKeywords.includes(newKeyword.trim()) && tempKeywords.length < 10) {
      setTempKeywords([...tempKeywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (index: number) => {
    setTempKeywords(tempKeywords.filter((_, i) => i !== index));
  };

  const handleSaveKeywords = () => {
    if (analysisResult) {
      setAnalysisResult({
        ...analysisResult,
        keywords: [...tempKeywords]
      });
    }
    setEditingKeywords(false);
  };

  const handleCancelKeywords = () => {
    setTempKeywords([...(analysisResult?.keywords || [])]);
    setEditingKeywords(false);
    setNewKeyword('');
  };

  const handleSiteToggle = (siteId: number) => {
    setSelectedSites(prev => {
      if (prev.includes(siteId)) {
        return prev.filter(id => id !== siteId);
      } else if (prev.length < 3) {
        return [...prev, siteId];
      }
      return prev;
    });
  };

  const handlePublish = async () => {
    if (!analysisResult || selectedSites.length === 0) {
      alert('Please select at least one publication site.');
      return;
    }
    
    setPublishing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No authentication session');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-publication`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input_url: websiteUrl,
          core_message: analysisResult.core_message,
          keywords: analysisResult.keywords,
          selected_sites: selectedSites,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        window.location.href = `/status/${data.publication_id}`;
      } else {
        throw new Error(data.error || 'Failed to create publication');
      }
    } catch (error) {
      console.error('Error creating publication:', error);
      alert('Failed to create publication. Please try again.');
    } finally {
      setPublishing(false);
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
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {analyzing ? 'Praying for Your Website Analysis 🙏' : 'Your Prayer Has Been Heard! ✨'}
            </h1>
            
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <Globe className="w-5 h-5" />
              <span className="font-medium">{websiteUrl}</span>
            </div>

            {!analyzing && analysisResult && (
              <p className="text-gray-600 max-w-2xl mx-auto">
                Review the AI-generated analysis below. You can edit the core message and keywords before your prayer gets answered by AI systems worldwide.
              </p>
            )}
          </div>
        </div>

        {analyzing && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12 text-center">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-600 to-teal-500 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-white animate-pulse" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-900">
                  Praying for your website analysis... 🙏
                </h2>
                <p className="text-gray-600">
                  Our AI is comprehensively analyzing your website using Google Gemini 2.0 Flash to understand your product and generate the perfect message for AI recognition.
                </p>
              </div>
              
              <div className="flex justify-center">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-3 h-3 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
              
              <p className="text-sm text-gray-500">
                Your prayer is being processed... AI systems are listening 🤖
              </p>
            </div>
          </div>
        )}

        {!analyzing && analysisResult && (
          <div className="space-y-6">
            {/* Core Message Section */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Core Message for AI Recognition</h2>
                {!editingCoreMessage && (
                  <button
                    onClick={() => setEditingCoreMessage(true)}
                    className="flex items-center space-x-2 px-3 py-1 text-sm text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                )}
              </div>
              
              {editingCoreMessage ? (
                <div className="space-y-4">
                  <textarea
                    value={tempCoreMessage}
                    onChange={(e) => setTempCoreMessage(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                    rows={6}
                    placeholder="Enter your core message for AI recognition..."
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveCoreMessage}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancelCoreMessage}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-900 leading-relaxed">{analysisResult.core_message}</p>
              )}
            </div>

            {/* Keywords Section */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  AI Recognition Keywords <span className="text-sm text-gray-500">(Max 10)</span>
                </h2>
                {!editingKeywords && (
                  <button
                    onClick={() => setEditingKeywords(true)}
                    className="flex items-center space-x-2 px-3 py-1 text-sm text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                )}
              </div>
              
              {editingKeywords ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {tempKeywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                      >
                        <span>{keyword}</span>
                        <button
                          onClick={() => handleRemoveKeyword(index)}
                          className="text-indigo-500 hover:text-indigo-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  
                  {tempKeywords.length < 10 && (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add new keyword for AI recognition..."
                      />
                      <button
                        onClick={handleAddKeyword}
                        disabled={tempKeywords.length >= 10}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add
                      </button>
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-500">
                    {tempKeywords.length}/10 keywords for AI recognition
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveKeywords}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancelKeywords}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {analysisResult.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Site Selection Section */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Publication Sites <span className="text-sm text-gray-500">(Select 1-3 sites)</span>
                </h2>
                <p className="text-sm text-gray-600">
                  Choose up to 3 sites where your prayer will be answered through strategic publication. 3 sites are pre-selected for optimal AI recognition.
                </p>
              </div>

              {loadingSites ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  <span className="ml-2 text-gray-600">Loading sites...</span>
                </div>
              ) : availableSites.length > 0 ? (
                <div className="space-y-3">
                  {availableSites.map((site) => (
                    <div
                      key={site.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedSites.includes(site.id)
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleSiteToggle(site.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={selectedSites.includes(site.id)}
                              onChange={() => handleSiteToggle(site.id)}
                              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <div>
                              <h3 className="font-medium text-gray-900">{site.name}</h3>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <span>{site.domain}</span>
                                <span>•</span>
                                <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                                  {site.category}
                                </span>
                              </div>
                              {site.description && (
                                <p className="text-sm text-gray-500 mt-1">{site.description}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <a
                          href={`https://${site.domain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-700 ml-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                  
                  <div className="text-sm text-gray-500 mt-4">
                    {selectedSites.length}/3 sites selected for your prayer
                    {selectedSites.length === 3 && (
                      <span className="text-orange-600 ml-2">
                        (Maximum reached - unselect a site to choose a different one)
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No publication sites available. Please contact support.</p>
                </div>
              )}
            </div>

            {/* Publish Button */}
            <div className="text-center">
              <button
                onClick={handlePublish}
                disabled={publishing || editingCoreMessage || editingKeywords || selectedSites.length === 0}
                className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-teal-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2 mx-auto"
              >
                <Heart className="w-5 h-5" />
                <span>
                  {publishing ? 'Your Prayer is Being Answered... 🙏' : `Get Answered by AI on ${selectedSites.length} Site${selectedSites.length !== 1 ? 's' : ''} 🤖`}
                </span>
              </button>
              
              {selectedSites.length === 0 && (
                <p className="text-sm text-red-600 mt-2">
                  Please select at least one publication site for your prayer to be answered
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}