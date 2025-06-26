/*
  # Create Publication Edge Function

  1. Function Purpose
    - Creates a new publication record in the database
    - Calls Publast API to initiate content generation
    - Uses user-selected sites for publication
    - Accepts keywords from the analysis
    - Validates user has a full name for publication

  2. Security
    - Only accessible to authenticated users
    - Validates user has publication credits
    - Validates user has a full name for authorship
    - Protects Publast API key
*/

import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface CreatePublicationRequest {
  input_url: string;
  core_message: string;
  keywords?: string[];
  selected_sites?: number[];
}

interface CreatePublicationResponse {
  success: boolean;
  publication_id?: string;
  error?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Get user from authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: "Authorization required" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid authorization" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { input_url, core_message, keywords, selected_sites }: CreatePublicationRequest = await req.json();
    
    if (!input_url || !core_message) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check user profile and credits
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('free_publications_remaining, full_name')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ success: false, error: "User profile not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate user has a full name for publication authorship
    if (!profile.full_name || !profile.full_name.trim()) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Full name is required for publishing articles. Please update your profile in Settings." 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (profile.free_publications_remaining <= 0) {
      return new Response(
        JSON.stringify({ success: false, error: "No publication credits remaining" }),
        {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Use provided keywords or generate from core message
    const finalKeywords = keywords && keywords.length > 0 ? keywords : generateKeywords(core_message);

    // Determine site IDs to use
    let siteIds: number[] = [];
    
    if (selected_sites && selected_sites.length > 0) {
      // Use user-selected sites (validate they exist)
      const { data: validSites, error: sitesError } = await supabaseClient
        .from('publast_sites')
        .select('id')
        .in('id', selected_sites);

      if (sitesError) {
        return new Response(
          JSON.stringify({ success: false, error: "Error validating selected sites" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      siteIds = validSites?.map(site => site.id) || [];
    } else {
      // Fallback: get available sites from database
      const { data: sites, error: sitesError } = await supabaseClient
        .from('publast_sites')
        .select('id')
        .limit(3);

      if (sitesError || !sites || sites.length === 0) {
        return new Response(
          JSON.stringify({ success: false, error: "No publication sites available. Please contact support." }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      siteIds = sites.map(site => site.id);
    }

    if (siteIds.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "No valid publication sites selected" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create publication record first
    const { data: publication, error: pubError } = await supabaseClient
      .from('publications')
      .insert({
        user_id: user.id,
        input_url,
        core_message,
        keywords: finalKeywords,
        status: 'processing'
      })
      .select()
      .single();

    if (pubError || !publication) {
      return new Response(
        JSON.stringify({ success: false, error: "Failed to create publication record" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Decrement user's publication credits immediately
    await supabaseClient
      .from('profiles')
      .update({ 
        free_publications_remaining: profile.free_publications_remaining - 1 
      })
      .eq('id', user.id);

    // Call Publast API if configured
    const publastApiKey = Deno.env.get('PUBLAST_API_KEY');
    const publastBaseUrl = Deno.env.get('PUBLAST_BASE_URL');

    if (publastApiKey && publastBaseUrl) {
      try {
        const publastResponse = await callPublastAPI({
          core_message,
          keywords: finalKeywords,
          site_ids: siteIds,
          source_urls: [input_url],
          author: profile.full_name.trim()
        });

        // Update publication with Publast publication ID
        await supabaseClient
          .from('publications')
          .update({ 
            publast_publication_id: publastResponse.publication_id,
            status: 'processing'
          })
          .eq('id', publication.id);

      } catch (publastError) {
        console.error('Publast API error:', publastError);
        
        // Update publication status to failed
        await supabaseClient
          .from('publications')
          .update({ status: 'failed' })
          .eq('id', publication.id);

        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Failed to initiate publication: ${publastError.message}` 
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    } else {
      // No Publast API configured - mark as failed
      await supabaseClient
        .from('publications')
        .update({ status: 'failed' })
        .eq('id', publication.id);

      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Publication service not configured. Please contact support." 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const response: CreatePublicationResponse = {
      success: true,
      publication_id: publication.id,
    };

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating publication:", error);
    
    const response: CreatePublicationResponse = {
      success: false,
      error: error.message || "Failed to create publication",
    };

    return new Response(
      JSON.stringify(response),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function generateKeywords(coreMessage: string): string[] {
  const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'a', 'an'];
  
  const words = coreMessage
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.includes(word));
  
  // Get unique words and take top 10 (limited to max 10)
  const uniqueWords = [...new Set(words)];
  return uniqueWords.slice(0, 10);
}

async function callPublastAPI(data: {
  core_message: string;
  keywords: string[];
  site_ids: number[];
  source_urls: string[];
  author: string;
}) {
  const apiKey = Deno.env.get('PUBLAST_API_KEY');
  const baseUrl = Deno.env.get('PUBLAST_BASE_URL') || 'https://app.publast.com/api/v1';
  
  if (!apiKey) {
    throw new Error('Publast API key not configured');
  }

  const response = await fetch(`${baseUrl}/publast`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...data,
      test_mode: false
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Publast API error: ${response.status} ${errorText}`);
  }

  return await response.json();
}