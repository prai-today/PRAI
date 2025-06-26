/*
  # Publication Status Edge Function

  1. Function Purpose
    - Fetches publication status from Publast API
    - Returns article details and publication progress
    - Updates local database with latest status

  2. Security
    - Only accessible to authenticated users
    - Users can only access their own publications
    - Protects Publast API key
*/

import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface StatusResponse {
  success: boolean;
  status?: string;
  articles?: any[];
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

    const url = new URL(req.url);
    const publicationId = url.searchParams.get('id');

    if (!publicationId) {
      return new Response(
        JSON.stringify({ success: false, error: "Publication ID required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get publication from database
    const { data: publication, error: pubError } = await supabaseClient
      .from('publications')
      .select('*')
      .eq('id', publicationId)
      .eq('user_id', user.id)
      .single();

    if (pubError || !publication) {
      return new Response(
        JSON.stringify({ success: false, error: "Publication not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Try to fetch status from Publast API if we have a publication ID and API is configured
    let publastStatus = null;
    const publastApiKey = Deno.env.get('PUBLAST_API_KEY');
    const publastBaseUrl = Deno.env.get('PUBLAST_BASE_URL');
    
    if (publication.publast_publication_id && publastApiKey && publastBaseUrl) {
      try {
        publastStatus = await getPublastStatus(publication.publast_publication_id);
        
        // Update our database with the latest status
        if (publastStatus && publastStatus.status !== publication.status) {
          await supabaseClient
            .from('publications')
            .update({ status: publastStatus.status })
            .eq('id', publicationId);
        }
      } catch (error) {
        console.error('Error fetching Publast status:', error);
        // Don't fail the request, just log the error
      }
    }

    // Prepare response with real data from Publast API or database status
    const response: StatusResponse = {
      success: true,
      status: publastStatus?.status || publication.status,
      articles: publastStatus?.articles || [],
    };

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in publication status function:", error);
    
    const response: StatusResponse = {
      success: false,
      error: error.message || "Failed to fetch publication status",
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

async function getPublastStatus(publicationId: number) {
  const apiKey = Deno.env.get('PUBLAST_API_KEY');
  const baseUrl = Deno.env.get('PUBLAST_BASE_URL') || 'https://app.publast.com/api/v1';
  
  if (!apiKey) {
    throw new Error('Publast API key not configured');
  }

  const response = await fetch(`${baseUrl}/publications/${publicationId}`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Publast API error: ${response.status}`);
  }

  return await response.json();
}