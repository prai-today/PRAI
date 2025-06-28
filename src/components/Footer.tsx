import { Heart, Sparkles, Globe, Mail, X, Github } from 'lucide-react';
import { FaXTwitter } from "react-icons/fa6";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              {/* Simple prayer hands logo - white on dark background */}
              
              <div className="flex flex-col">
                <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-teal-400 bg-clip-text text-transparent">
                  PRAI.TODAY
                </h3>
                <span className="text-xs sm:text-sm text-gray-400 font-medium -mt-1">
                  Get answered by AI
                </span>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm sm:text-lg leading-relaxed mb-4 sm:mb-6 max-w-md">
              We help builders, SMB owners, and startup founders get their products recognized by AI and search engines through intelligent content publication.
            </p>
            
            <div className="flex items-center space-x-2 text-gray-400">
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
              <span className="text-xs sm:text-sm">
                Bolted with love and prayers for builders worldwide 🙏
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-white">Get Started</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a href="/" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                  <span>PR AI for Recognition</span>
                </a>
              </li>
              <li>
                <a href="/auth?mode=signup" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                  Sign Up for Free
                </a>
              </li>
              <li>
                <a href="/auth" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                  Sign In to PR AI
                </a>
              </li>
            </ul>
          </div>

          {/* Resources & Support */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-white">Get Connected</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a href="mailto:jay@prai.today" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2 text-sm sm:text-base">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>jay@prai.today</span>
                </a>
              </li>
              <li>
                <a href="https://twitter.com/prai_today" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2 text-sm sm:text-base">
                  <FaXTwitter className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>@PRAI_TODAY</span>
                </a>
              </li>
              <li>
                <a href="https://github.com/prai-today/PRAI" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2 text-sm sm:text-base">
                  <Github className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Open Source</span>
                </a>
              </li>
              <li>
                <a href="https://www.producthunt.com/products/prai-today-get-recognized-by-ai?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-prai&#0045;today&#0045;get&#0045;recognized&#0045;by&#0045;ai" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=985001&theme=light&t=1751091443953" alt="PRAI&#0046;TODAY&#0032;&#0045;&#0032;Get&#0032;Recognized&#0032;by&#0032;AI - PR&#0032;AI&#0032;agent&#0032;that&#0032;does&#0032;research&#0044;&#0032;optimization&#0044;&#0032;and&#0032;publishing | Product Hunt" className="w-[256px] h-[54px]" width="250" height="54" /></a>
              </li>
            </ul>
            
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 sm:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 sm:space-y-4 md:space-y-0">
            <div className="text-gray-400 text-xs sm:text-sm text-center md:text-left">
              © {currentYear} PRAI.TODAY. All rights reserved. 
              <span className="ml-2 text-gray-500 block sm:inline">
                Helping products get answered by AI.
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm">
              <div className="flex items-center space-x-4">
                <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </div>
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>AI systems listening 🤖</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}