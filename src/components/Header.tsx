import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogOut, Menu, X, LayoutDashboard } from 'lucide-react';

export function Header() {
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navigation = [
    ...(user ? [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }
    ] : []),
  ];

  return (
    <header className="bg-white/90 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <a href="/" className="flex items-center space-x-3 group">
              {/* Simple prayer hands logo */}
              <div className="text-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 bg-clip-text text-transparent group-hover:from-indigo-700 group-hover:scale-110 transition-transform duration-300">
                🙏
              </div>
              
              <div className="flex flex-col">
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 bg-clip-text text-transparent group-hover:from-indigo-700 group-hover:via-purple-400 group-hover:to-teal-400 transition-all duration-300">
                  PRAI.TODAY
                </h1>
                <span className="text-xs text-gray-500 font-medium -mt-1 group-hover:text-gray-600 transition-colors duration-300">
                  Get Answered by AI
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            {navigation.length > 0 && (
              <nav className="hidden md:flex space-x-6">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-indigo-50"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </a>
                  );
                })}
              </nav>
            )}
          </div>

          {user ? (
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600 bg-gradient-to-r from-green-50 to-teal-50 px-3 py-1 rounded-full border border-green-200">
                  <span className="text-green-700 font-semibold">
                    {profile?.free_publications_remaining || 0} PR left
                  </span>
                </div>
                <div className="text-sm text-gray-800 font-medium">
                  {profile?.full_name || user.email}
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <a
                href="/auth"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
              >
                Sign In
              </a>
              <a
                href="/auth?mode=signup"
                className="bg-gradient-to-r from-indigo-500 via-purple-600 to-teal-500 text-white px-6 py-2 rounded-lg text-sm font-medium hover:from-indigo-600 hover:via-purple-700 hover:to-teal-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Meet PR AI agent
              </a>
            </div>
          )}

          {/* Mobile menu button */}
          {navigation.length > 0 && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          )}
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && navigation.length > 0 && (
          <div className="md:hidden border-t border-gray-200 py-4">
            {/* Mobile Navigation */}
            <nav className="space-y-2 mb-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-indigo-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </a>
                );
              })}
            </nav>

            {user ? (
              <div className="space-y-4 border-t border-gray-200 pt-4">
                <div className="text-sm text-gray-800 font-medium">
                  {profile?.full_name || user.email}
                </div>
                <div className="text-sm text-gray-600 bg-gradient-to-r from-green-50 to-teal-50 px-3 py-1 rounded-full border border-green-200 inline-block">
                  <span className="text-green-700 font-semibold">
                    {profile?.free_publications_remaining || 0} prayers left
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3 border-t border-gray-200 pt-4">
                <a
                  href="/auth"
                  className="block text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </a>
                <a
                  href="/auth?mode=signup"
                  className="block bg-gradient-to-r from-indigo-500 via-purple-600 to-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-indigo-600 hover:via-purple-700 hover:to-teal-600 transition-all text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pray Today 🙏
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}