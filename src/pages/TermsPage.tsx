import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { FileText, Mail, AlertTriangle, Shield, Users, Gavel } from 'lucide-react';

export function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-3 mb-4">
              <FileText className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
            </div>
            <p className="text-gray-600">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Users className="w-6 h-6 text-indigo-600" />
                <span>About Our Service</span>
              </h2>
              <p className="text-gray-700 leading-relaxed">
                PRAI.TODAY is a non-profit, open-source project that helps builders, SMB owners, and startup founders get their products recognized by AI systems and search engines. By using our service, you agree to these Terms of Service ("Terms"). Please read them carefully.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Shield className="w-6 h-6 text-indigo-600" />
                <span>User Responsibilities</span>
              </h2>
              
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-medium text-red-900 mb-2 flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span>Critical User Obligations</span>
                  </h3>
                  <ul className="list-disc list-inside text-red-800 space-y-1 text-sm">
                    <li>You are solely responsible for all content you submit, including core messages and keywords</li>
                    <li>You must not enter any illegal, harmful, defamatory, or inappropriate content</li>
                    <li>You must own or have proper rights to the website URL you submit</li>
                    <li>You are responsible for ensuring your product information is accurate and legal</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Website Ownership and Rights</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>The website URL you submit must be about YOUR product or service</li>
                    <li>You must have all necessary rights and permissions for the product being promoted</li>
                    <li>You are responsible for any intellectual property claims related to your submissions</li>
                    <li>You warrant that your use of our service does not violate any laws or third-party rights</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Content Standards</h3>
                  <p className="text-gray-700 mb-2">You agree that all content you provide will NOT contain:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Illegal, harmful, threatening, abusive, or defamatory material</li>
                    <li>Spam, misleading information, or fraudulent content</li>
                    <li>Content that violates intellectual property rights</li>
                    <li>Adult content, hate speech, or discriminatory material</li>
                    <li>Malware, viruses, or other harmful code</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Description</h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  PRAI.TODAY provides AI-powered content analysis and publication services. Our service includes:
                </p>
                
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Website content analysis using AI technology</li>
                  <li>Generation of optimized core messages and keywords</li>
                  <li>Publication of content on selected third-party websites</li>
                  <li>Status tracking and reporting of publications</li>
                </ul>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Service Availability</h4>
                  <p className="text-blue-800 text-sm">
                    We provide our service on a best-effort basis. We do not guarantee continuous availability, specific publication outcomes, or permanent retention of published content by third-party sites.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Gavel className="w-6 h-6 text-indigo-600" />
                <span>Limitation of Liability</span>
              </h2>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <h3 className="font-medium text-yellow-900 mb-2">IMPORTANT DISCLAIMER</h3>
                <p className="text-yellow-800 text-sm font-medium">
                  PRAI.TODAY IS NOT RESPONSIBLE FOR ANY OUTCOMES, DAMAGES, OR CONSEQUENCES RESULTING FROM THE USE OF OUR SERVICE.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Liability for Published Content</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Published content may be modified or deleted by website owners at their discretion</li>
                    <li>We cannot guarantee the permanence or visibility of published content</li>
                    <li>We are not responsible for how third-party sites handle your content</li>
                    <li>Publication results may vary and are not guaranteed</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">General Limitations</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>We provide our service "as is" without warranties of any kind</li>
                    <li>We are not liable for any direct, indirect, or consequential damages</li>
                    <li>Our total liability is limited to the amount you paid for our services (currently $0)</li>
                    <li>We are not responsible for third-party actions or decisions</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Account and Usage</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Account Security</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>You are responsible for maintaining the security of your account</li>
                    <li>You must notify us immediately of any unauthorized access</li>
                    <li>You are liable for all activities under your account</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Service Credits</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Free credits are provided as a courtesy and may be limited</li>
                    <li>Credits have no monetary value and cannot be transferred or refunded</li>
                    <li>We reserve the right to modify credit policies at any time</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Prohibited Uses</h2>
              <p className="text-gray-700 mb-4">You may not use our service to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Promote illegal activities or products</li>
                <li>Spam or distribute unsolicited content</li>
                <li>Violate intellectual property rights</li>
                <li>Impersonate others or provide false information</li>
                <li>Attempt to reverse engineer or compromise our systems</li>
                <li>Use our service for competitive analysis or to build competing services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Termination</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to suspend or terminate your account at any time for violation of these Terms or for any other reason. You may also terminate your account at any time. Upon termination, your access to the service will cease, but these Terms will continue to apply to your prior use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Intellectual Property</h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  PRAI.TODAY is an open-source project. While our code is open source, you retain ownership of the content you submit. By using our service, you grant us a license to process and publish your content as part of our service.
                </p>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Your Content License</h3>
                  <p className="text-gray-700">
                    You grant PRAI.TODAY a non-exclusive, worldwide license to use, modify, and publish your submitted content for the purpose of providing our services. This license terminates when you delete your content or close your account.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update these Terms from time to time. We will notify you of material changes by posting the updated Terms on our website. Your continued use of our service after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms are governed by and construed in accordance with applicable laws. Any disputes will be resolved through binding arbitration or in courts of competent jurisdiction.
              </p>
            </section>

            <section className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Mail className="w-6 h-6 text-indigo-600" />
                <span>Contact and Support</span>
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  For any questions about these Terms or issues with our service, please contact us:
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Support Contact</h4>
                  <p className="text-blue-800 text-sm mb-2">
                    <strong>For all issues, questions, or support needs, please contact:</strong>
                  </p>
                  <p className="text-blue-800">
                    <strong>Email:</strong> <a href="mailto:jay@prai.today" className="text-indigo-600 hover:text-indigo-700">jay@prai.today</a>
                  </p>
                  <p className="text-blue-800 text-sm mt-2">
                    You are responsible for contacting help@prai.today for any issues related to our service.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-red-900 mb-3 flex items-center space-x-2">
                <AlertTriangle className="w-6 h-6" />
                <span>Final Reminder</span>
              </h2>
              <p className="text-red-800 font-medium">
                By using PRAI.TODAY, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. You accept full responsibility for your use of our service and any content you submit.
              </p>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}