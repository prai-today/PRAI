import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ArrowRight, Globe, Sparkles, Zap, Target, TrendingUp, Clock, CheckCircle, SearchCheck, SquarePen, Heart, MessageCircle, Router } from 'lucide-react';

export function Hero() {
  const { user } = useAuth();
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      const encodedUrl = encodeURIComponent(url.trim());
      if (user) {
        // User is authenticated, proceed to analyze
        window.location.href = `/analyze?url=${encodedUrl}`;
      } else {
        // User is not authenticated, redirect to auth page with the URL
        window.location.href = `/auth?mode=signup&redirect=${encodeURIComponent(`/analyze?url=${encodedUrl}`)}`;
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center overflow-hidden">
      
      <div className="fixed top-16 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 xl:top-10 xl:right-10 z-[9999] pointer-events-auto">
  <a href="https://bolt.new/" target="_blank" rel="noopener noreferrer">
    <img
      src="/bolt.png"
      alt="Bolt.new"
      className="w-20 md:w-22 lg:w-24 xl:w-28 2xl:w-32 hover:animate-spin duration-4000 transition-transform"
    />
  </a>
</div>
      {/* Enhanced background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center space-y-6 sm:space-y-8">
          {/* Enhanced logo and tagline */}
          <div className="space-y-4 sm:space-y-6">
            <div className="inline-flex items-center space-x-2 sm:space-x-3 bg-white/80 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 border border-purple-200/50 shadow-lg">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 animate-pulse" />
                <span className="text-xs sm:text-sm font-medium text-purple-700">PRAI Today</span>
                <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                <span className="text-xs sm:text-sm font-medium text-blue-600">Get Answered by AI</span>
              </div>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                  🙏
                </span>
                <br />
                <span className="text-gray-900 text-2xl sm:text-4xl md:text-5xl">PR AI agent helps you</span>
                <br />
                <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent text-2xl sm:text-4xl md:text-5xl">
                  Get Recognized by AI
                </span>
              </h1>
              
              <p className="text-base sm:text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4">
                <strong>Prai.Today</strong> is non-profit & open-source project to help builders, founders, and SMB owners get their products 
                recognized by AI and search engines through optimized content generation and strategic publication.
              </p>
              <p className="text-xs sm:text-sm font-semibold text-gray-400 px-4">
                Powered by <a href="https://bolt.new/" target="_blank" rel="noopener noreferrer" className="text-yellow-700">Bolt.new</a> + <a href="https://supabase.com/" target="_blank" rel="noopener noreferrer\" className="text-emerald-500">Supabase</a> + <a href="https://www.netlify.com/" target="_blank" rel="noopener noreferrer\" className="text-teal-500">Netlify</a> + <a href="https://publast.com" target="_blank" rel="noopener noreferrer\" className="text-blue-500">Publast</a> + <a href="https://www.entri.com/" target="_blank" rel="noopener noreferrer\" className="text-stone-500">Entri</a> + <a href="https://www.ionos.com/" target="_blank" rel="noopener noreferrer\" className="text-blue-800">IONOS</a>
              </p>
              
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 max-w-3xl mx-auto border border-indigo-200 mx-4">
                <p className="text-sm sm:text-lg text-gray-700 font-medium mb-2 sm:mb-3">
                  <strong>Published via PRAI.TODAY</strong> → <strong>Get recognized by AI in a week</strong>
                </p>
                <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                    <span>AI recognizes your product</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                    <span>Search engines find you</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                    <span>Customers discover you</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced URL Input Form - Only show for non-authenticated users */}
          {!user && (
            <div className="max-w-2xl mx-auto px-4">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-600 to-teal-500 rounded-xl sm:rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                  <div className="relative bg-white rounded-xl sm:rounded-2xl p-1.5 sm:p-2 border border-gray-200 shadow-xl">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                      <div className="flex items-center space-x-3 flex-1 px-3 sm:px-0">
                        <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 ml-0 sm:ml-4" />
                        <input
                          type="url"
                          placeholder="Enter your website URL here"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          className="flex-1 py-3 sm:py-4 px-1 sm:px-2 text-base sm:text-lg bg-transparent border-none outline-none placeholder-gray-400"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-indigo-500 via-purple-600 to-teal-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold hover:from-indigo-600 hover:via-purple-700 hover:to-teal-600 transition-all transform hover:animate-pulse flex items-center justify-center space-x-2 shadow-lg text-sm sm:text-base"
                      >
                        <span>PRAI 🙏</span>
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <p className="text-xs sm:text-sm text-gray-500 px-4">
                  Sign up with Google to get 1 free PRAI credit!
                </p>
              </form>
            </div>
          )}

          {/* For authenticated users, show a different CTA */}
          {user && (
            <div className="max-w-2xl mx-auto px-4">
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-green-200">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Welcome back! 🙏</h3>
                <p className="text-gray-600 mb-4 sm:mb-6">
                  Ready to start a new PRAI? Head to your dashboard to begin.
                </p>
                <a
                  href="/dashboard"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500 via-purple-600 to-teal-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:from-indigo-600 hover:via-purple-700 hover:to-teal-600 transition-all transform hover:scale-105 shadow-lg"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              </div>
            </div>
          )}

          {/* Enhanced Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16 max-w-6xl mx-auto px-4">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200/50 hover:shadow-xl transition-all hover:scale-105 group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform mx-auto sm:mx-0">
                <SearchCheck className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 text-center sm:text-left">Analyze</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-center sm:text-left">
                PRAI analyzes your website and suggests you effective key message and keywords.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200/50 hover:shadow-xl transition-all hover:scale-105 group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform mx-auto sm:mx-0">
                <SquarePen className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 text-center sm:text-left">Edit</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-center sm:text-left">
                PRAI edits your input into optimized contents for LLMs and AI models.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200/50 hover:shadow-xl transition-all hover:scale-105 group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-teal-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform mx-auto sm:mx-0">
                <Router className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 text-center sm:text-left">Publish</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-center sm:text-left">
                PRAI publishes online, ensuring AI can find and understand your product.
              </p>
            </div>
          </div>

          {/* Call to Action - Only show for non-authenticated users */}
          {!user && (
            <div className="mt-12 sm:mt-16 bg-gradient-to-r from-indigo-500 via-purple-600 to-teal-500 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden mx-4">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-teal-600/20"></div>
              <div className="relative">
                <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to PRAI for Recognition?</h2>
                <p className="text-lg sm:text-xl mb-4 sm:mb-6 text-indigo-100">
                  PRAI Today and Get Answered!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                  <a
                    href="/auth?mode=signup"
                    className="bg-white text-indigo-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2 text-sm sm:text-base w-full sm:w-auto justify-center"
                  >
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Start PRAI Today</span>
                  </a>
                  <span className="text-indigo-200 text-xs sm:text-sm text-center">
                    • Free PRAI credit with Google signup • No credit card required • AI answers in a week - month
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}