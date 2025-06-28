import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Shield, Mail, Database, Lock, Eye, UserCheck } from 'lucide-react';

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-3 mb-4">
              <Shield className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
            </div>
            <p className="text-gray-600">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <UserCheck className="w-6 h-6 text-indigo-600" />
                <span>About PRAI.TODAY</span>
              </h2>
              <p className="text-gray-700 leading-relaxed">
                PRAI.TODAY is a non-profit, open-source project designed to help builders, SMB owners, and startup founders get their products recognized by AI systems and search engines through intelligent content generation and strategic publication. We are committed to protecting your privacy while providing this valuable service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Database className="w-6 h-6 text-indigo-600" />
                <span>Information We Collect</span>
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Account Information</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Email address (required for account creation)</li>
                    <li>Full name (optional, for personalization)</li>
                    <li>Profile picture (if provided via Google OAuth)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Content Information</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Website URLs you submit for analysis</li>
                    <li>Core messages and keywords you provide or edit</li>
                    <li>Publication preferences and selected sites</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Usage Information</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Publication history and status</li>
                    <li>Account activity and preferences</li>
                    <li>Technical information for service improvement</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Eye className="w-6 h-6 text-indigo-600" />
                <span>How We Use Your Information</span>
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>To provide and improve our AI recognition services</li>
                <li>To analyze your website content and generate optimized publications</li>
                <li>To publish content about your product on selected publication sites</li>
                <li>To track publication status and provide updates</li>
                <li>To communicate with you about your account and our services</li>
                <li>To ensure compliance with our Terms of Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Lock className="w-6 h-6 text-indigo-600" />
                <span>Data Storage and Security</span>
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Your information is securely stored using Supabase, a trusted database platform with enterprise-grade security measures. We implement appropriate technical and organizational safeguards to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Data Minimization</h4>
                  <p className="text-blue-800 text-sm">
                    We collect and store only the minimal information necessary to provide our services. We do not collect unnecessary personal data or track your browsing behavior outside of our platform.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information Sharing</h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  We do not sell, trade, or otherwise transfer your personal information to third parties, except as described below:
                </p>
                
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Publication Partners:</strong> Content you create is published on selected third-party sites as part of our service</li>
                  <li><strong>Service Providers:</strong> We may share information with trusted service providers who assist in operating our platform (e.g., Supabase, Publast API)</li>
                  <li><strong>Legal Requirements:</strong> We may disclose information when required by law or to protect our rights and safety</li>
                </ul>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-900 mb-2">Important Notice</h4>
                  <p className="text-yellow-800 text-sm">
                    Published content may be deleted by the website owners at their discretion. PRAI.TODAY is not responsible for the retention or removal of published content by third-party sites.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights and Choices</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Access:</strong> You can view and edit your account information at any time</li>
                <li><strong>Deletion:</strong> You can request deletion of your account and associated data</li>
                <li><strong>Correction:</strong> You can update or correct your personal information</li>
                <li><strong>Portability:</strong> You can request a copy of your data in a portable format</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies and Tracking</h2>
              <p className="text-gray-700 leading-relaxed">
                We use minimal cookies and local storage to maintain your login session and improve your experience. We do not use tracking cookies for advertising or analytics purposes. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Your continued use of our services after any changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Mail className="w-6 h-6 text-indigo-600" />
                <span>Contact Us</span>
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>Email:</strong> <a href="mailto:jay@prai.today" className="text-indigo-600 hover:text-indigo-700">jay@prai.today</a>
                </p>
                
              </div>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}