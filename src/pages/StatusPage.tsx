import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { PublicationStatus } from '../components/PublicationStatus';
import { supabase } from '../lib/supabase';

export function StatusPage() {
  const { user, loading } = useAuth();
  const [publicationData, setPublicationData] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/auth';
      return;
    }

    const pathParts = window.location.pathname.split('/');
    const publicationId = pathParts[pathParts.length - 1];
    
    if (publicationId && user) {
      fetchPublicationData(publicationId);
    }
  }, [user, loading]);

  const fetchPublicationData = async (publicationId: string) => {
    try {
      const { data: publication, error } = await supabase
        .from('publications')
        .select('*')
        .eq('id', publicationId)
        .eq('user_id', user!.id)
        .single();

      if (error || !publication) {
        throw new Error('Publication not found');
      }

      setPublicationData({
        publicationId: publication.id,
        coreMessage: publication.core_message,
        keywords: publication.keywords,
        inputUrl: publication.input_url
      });
    } catch (error) {
      console.error('Error fetching publication data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!publicationData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Publication Not Found</h1>
            <p className="text-gray-600">The publication you're looking for doesn't exist or you don't have access to it.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <PublicationStatus
        publicationId={publicationData.publicationId}
        coreMessage={publicationData.coreMessage}
        keywords={publicationData.keywords}
        inputUrl={publicationData.inputUrl}
      />
      <Footer />
    </div>
  );
}