import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ArrowRight, Globe, Sparkles, Zap, Target, TrendingUp, Clock, CheckCircle, Heart, MessageCircle } from 'lucide-react';

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
        // User is not authenticated, redirect to auth page
        window.location.href = `/auth?mode=signup&redirect=/analyze?url=${encodedUrl}`;
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center overflow-hidden">
      {/* Enhanced background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-8">
          {/* Enhanced logo and tagline */}
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 border border-purple-200/50 shadow-lg">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-500 animate-pulse" />
                <span className="text-sm font-medium text-purple-700">PRAI Today</span>
                <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                <MessageCircle className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-600">Get Answered by AI</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                  🙏
                </span>
                <br />
                <span className="text-gray-900 text-4xl md:text-5xl">PR AI agent helps you</span>
                <br />
                <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent text-4xl md:text-5xl">
                  Get Recognized by AI
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                <strong>Prai.Today</strong> is non-profit & open-source project to help builders, founders, and SMB owners get their products 
                recognized by AI and search engines through optimized content generation and strategic publication.
              </p>
              <p className="text-sm font-semibold text-gray-400">Powered by <span className="text-yellow-700">Bolt.new</span> + <span className="text-green-400">Supabase</span> + <span>Netlify</span> + <span>Entri / IONOS</span></p>
              
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 max-w-3xl mx-auto border border-indigo-200">
                <p className="text-lg text-gray-700 font-medium mb-3">
                  🙏 <strong>Pray today</strong> → 🤖 <strong>Get answered by AI tomorrow</strong>
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>AI recognizes your product</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Search engines find you</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Customers discover you</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced URL Input Form */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-600 to-teal-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative bg-white rounded-2xl p-2 border border-gray-200 shadow-xl">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-6 h-6 text-gray-400 ml-4" />
                    <input
                      type="url"
                      placeholder="Enter your website URL and pray for AI recognition 🙏"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="flex-1 py-4 px-2 text-lg bg-transparent border-none outline-none placeholder-gray-400"
                      required
                    />
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-indigo-500 via-purple-600 to-teal-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-indigo-600 hover:via-purple-700 hover:to-teal-600 transition-all transform hover:scale-105 flex items-center space-x-2 shadow-lg"
                    >
                      <span>Pray Today 🙏</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-500">
                {user ? 
                  "Ready to pray for your product's AI recognition today!" :
                  "Sign up to get 1 free prayer with Google Auth - start today!"
                }
              </p>
            </form>
          </div>

          {/* Enhanced Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-6xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 hover:shadow-xl transition-all hover:scale-105 group">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Pray for Analysis 🙏</h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI comprehensively analyzes your website and generates compelling messages that help AI systems understand and recognize your product's unique value.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 hover:shadow-xl transition-all hover:scale-105 group">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-teal-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Get Answered by AI 🤖</h3>
              <p className="text-gray-600 leading-relaxed">
                Your prayers are answered through strategic publication to premium sites, ensuring AI systems and search engines can find, understand, and recommend your product.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 hover:shadow-xl transition-all hover:scale-105 group">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Watch Results Grow ✨</h3>
              <p className="text-gray-600 leading-relaxed">
                Monitor your prayers being answered in real-time. Track where your content is published and see your AI recognition improve day by day.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 bg-gradient-to-r from-indigo-500 via-purple-600 to-teal-500 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-teal-600/20"></div>
            <div className="relative">
              <h2 className="text-3xl font-bold mb-4">Ready to Pray for AI Recognition? 🙏</h2>
              <p className="text-xl mb-6 text-indigo-100">
                Join thousands of founders whose prayers have been answered by AI systems worldwide
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href={user ? "/" : "/auth?mode=signup"}
                  className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
                >
                  <Heart className="w-5 h-5" />
                  <span>{user ? "Pray for Another Product" : "Start Praying Today"}</span>
                </a>
                <span className="text-indigo-200 text-sm">
                  • Free prayer with Google signup • No credit card required • AI answers in 24 hours
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}