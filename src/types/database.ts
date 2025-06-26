export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  free_publications_remaining: number;
  created_at: string;
  updated_at: string;
}

export interface PublastSite {
  id: number;
  name: string;
  domain: string;
  description?: string;
  category: string;
  language_code?: string;
  created_at: string;
  updated_at: string;
}

export interface Publication {
  id: string;
  user_id: string;
  input_url: string;
  core_message: string;
  keywords: string[];
  publast_publication_id?: number;
  status: 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}