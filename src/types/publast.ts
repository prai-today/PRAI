export interface Site {
  id: number;
  name: string;
  domain: string;
  description?: string;
  category: string;
  language_code?: string;
}

export interface CreditsResponse {
  credits: number;
  as_of: string;
}

export interface PublicationRequest {
  core_message: string;
  keywords: string[];
  author?: string;
  site_ids: number[];
  source_urls?: string[];
  test_mode?: boolean;
}

export type PublicationStatus = 'processing' | 'completed' | 'failed';
export type ArticleStatus = 'pending' | 'generating' | 'published' | 'failed';

export interface ArticleDetails {
  article_id: number;
  site_id: number;
  site_name: string;
  site_domain: string;
  status: ArticleStatus;
  published_url?: string;
  error_message?: string;
  published_at?: string;
}

export interface PublicationResponse {
  publication_id: number;
  status: PublicationStatus;
  created_at: string;
  updated_at?: string;
  core_input_data: Omit<PublicationRequest, 'site_ids' | 'source_urls' | 'test_mode'>;
  source_urls?: string[];
  articles: ArticleDetails[];
}