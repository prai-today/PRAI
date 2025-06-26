/*
  # Enhanced Website Analysis Edge Function with Intelligent Site Selection

  1. Function Purpose
    - Comprehensively scrapes website content including metadata, text, images, and structure
    - Uses Google Gemini 2.0 Flash for intelligent analysis and structured output
    - Intelligently selects the best-fitting 3 sites from available options
    - Returns detailed core message, keywords, and selected sites in a structured format

  2. Security
    - Only accessible to authenticated users
    - Validates input URL format
    - Protects Google Gemini API key
    - Handles CORS properly
*/

import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface AnalysisRequest {
  url: string;
}

interface AnalysisResponse {
  success: boolean;
  analysis?: {
    core_message: string;
    keywords: string[];
    selected_sites: number[];
  };
  error?: string;
}

interface ScrapedData {
  title: string;
  metaDescription: string;
  headings: string[];
  bodyText: string;
  images: string[];
  links: string[];
  structuredData: any[];
  socialMedia: {
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    twitterTitle?: string;
    twitterDescription?: string;
  };
}

interface PublastSite {
  id: number;
  name: string;
  domain: string;
  description?: string;
  category: string;
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

    const { url }: AnalysisRequest = await req.json();
    
    if (!url || !isValidUrl(url)) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid URL provided" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Starting comprehensive analysis for: ${url}`);

    // Step 1: Get available sites from database
    const { data: availableSites, error: sitesError } = await supabaseClient
      .from('publast_sites')
      .select('id, name, domain, description, category')
      .order('id');

    if (sitesError || !availableSites || availableSites.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "No publication sites available. Please contact support." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Step 2: Scrape comprehensive website data
    const scrapedData = await scrapeWebsiteData(url);
    
    // Step 3: Analyze with Google Gemini 2.0 Flash including intelligent site selection
    const geminiAnalysis = await analyzeWithGemini(scrapedData, url, availableSites);

    const response: AnalysisResponse = {
      success: true,
      analysis: geminiAnalysis,
    };

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error analyzing website:", error);
    
    const response: AnalysisResponse = {
      success: false,
      error: error.message || "Failed to analyze website",
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

function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

async function scrapeWebsiteData(url: string): Promise<ScrapedData> {
  console.log(`Scraping data from: ${url}`);
  
  // Fetch the main page
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; PRAI-Bot/1.0; +https://prai.ai)',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate',
      'Connection': 'keep-alive',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch website: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  
  // Parse and extract comprehensive data
  const scrapedData: ScrapedData = {
    title: extractTitle(html),
    metaDescription: extractMetaDescription(html),
    headings: extractHeadings(html),
    bodyText: extractBodyText(html),
    images: extractImages(html, url),
    links: extractLinks(html, url),
    structuredData: extractStructuredData(html),
    socialMedia: extractSocialMediaMeta(html),
  };

  // Try to scrape additional pages for more context
  try {
    const additionalPages = await scrapeAdditionalPages(url, scrapedData.links);
    scrapedData.bodyText += '\n\n' + additionalPages;
  } catch (error) {
    console.log('Could not scrape additional pages:', error.message);
  }

  return scrapedData;
}

function extractTitle(html: string): string {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return titleMatch ? titleMatch[1].trim() : '';
}

function extractMetaDescription(html: string): string {
  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  return metaDescMatch ? metaDescMatch[1].trim() : '';
}

function extractHeadings(html: string): string[] {
  const headings: string[] = [];
  const headingMatches = html.matchAll(/<h[1-6][^>]*>([^<]+)<\/h[1-6]>/gi);
  
  for (const match of headingMatches) {
    const text = match[1].replace(/\s+/g, ' ').trim();
    if (text && text.length > 2) {
      headings.push(text);
    }
  }
  
  return headings;
}

function extractBodyText(html: string): string {
  // Remove scripts, styles, and other non-content elements
  let cleanHtml = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');

  // Extract text from main content areas
  const contentSelectors = [
    /<main[^>]*>([\s\S]*?)<\/main>/gi,
    /<article[^>]*>([\s\S]*?)<\/article>/gi,
    /<section[^>]*>([\s\S]*?)<\/section>/gi,
    /<div[^>]*class=["'][^"']*content[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi,
    /<div[^>]*class=["'][^"']*main[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi,
  ];

  let contentText = '';
  
  for (const selector of contentSelectors) {
    const matches = cleanHtml.matchAll(selector);
    for (const match of matches) {
      contentText += match[1] + '\n';
    }
  }

  // If no specific content areas found, extract from body
  if (!contentText.trim()) {
    const bodyMatch = cleanHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    contentText = bodyMatch ? bodyMatch[1] : cleanHtml;
  }

  // Clean up the text
  return contentText
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 4000); // Increased to 4000 characters for better analysis
}

function extractImages(html: string, baseUrl: string): string[] {
  const images: string[] = [];
  const imgMatches = html.matchAll(/<img[^>]*src=["']([^"']+)["'][^>]*>/gi);
  
  for (const match of imgMatches) {
    try {
      const imgUrl = new URL(match[1], baseUrl).href;
      images.push(imgUrl);
    } catch {
      // Skip invalid URLs
    }
  }
  
  return images.slice(0, 10); // Limit to 10 images
}

function extractLinks(html: string, baseUrl: string): string[] {
  const links: string[] = [];
  const linkMatches = html.matchAll(/<a[^>]*href=["']([^"']+)["'][^>]*>/gi);
  
  for (const match of linkMatches) {
    try {
      const linkUrl = new URL(match[1], baseUrl);
      // Only include internal links
      if (linkUrl.hostname === new URL(baseUrl).hostname) {
        links.push(linkUrl.href);
      }
    } catch {
      // Skip invalid URLs
    }
  }
  
  return [...new Set(links)].slice(0, 20); // Unique links, limit to 20
}

function extractStructuredData(html: string): any[] {
  const structuredData: any[] = [];
  
  // Extract JSON-LD structured data
  const jsonLdMatches = html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  
  for (const match of jsonLdMatches) {
    try {
      const data = JSON.parse(match[1]);
      structuredData.push(data);
    } catch {
      // Skip invalid JSON
    }
  }
  
  return structuredData;
}

function extractSocialMediaMeta(html: string): ScrapedData['socialMedia'] {
  const socialMedia: ScrapedData['socialMedia'] = {};
  
  // Open Graph tags
  const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
  if (ogTitleMatch) socialMedia.ogTitle = ogTitleMatch[1];
  
  const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
  if (ogDescMatch) socialMedia.ogDescription = ogDescMatch[1];
  
  const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
  if (ogImageMatch) socialMedia.ogImage = ogImageMatch[1];
  
  // Twitter tags
  const twitterTitleMatch = html.match(/<meta[^>]*name=["']twitter:title["'][^>]*content=["']([^"']+)["']/i);
  if (twitterTitleMatch) socialMedia.twitterTitle = twitterTitleMatch[1];
  
  const twitterDescMatch = html.match(/<meta[^>]*name=["']twitter:description["'][^>]*content=["']([^"']+)["']/i);
  if (twitterDescMatch) socialMedia.twitterDescription = twitterDescMatch[1];
  
  return socialMedia;
}

async function scrapeAdditionalPages(baseUrl: string, links: string[]): Promise<string> {
  const importantPages = links.filter(link => {
    const path = new URL(link).pathname.toLowerCase();
    return path.includes('about') || 
           path.includes('product') || 
           path.includes('service') || 
           path.includes('feature') ||
           path === '/' ||
           path.includes('home');
  }).slice(0, 3); // Limit to 3 additional pages

  let additionalContent = '';
  
  for (const pageUrl of importantPages) {
    try {
      const response = await fetch(pageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; PRAI-Bot/1.0; +https://prai.ai)',
        },
      });
      
      if (response.ok) {
        const html = await response.text();
        const pageText = extractBodyText(html);
        additionalContent += `\n\nPage: ${pageUrl}\n${pageText.substring(0, 1000)}`;
      }
    } catch (error) {
      console.log(`Failed to scrape ${pageUrl}:`, error.message);
    }
  }
  
  return additionalContent;
}

async function analyzeWithGemini(scrapedData: ScrapedData, url: string, availableSites: PublastSite[]): Promise<{
  core_message: string;
  keywords: string[];
  selected_sites: number[];
}> {
  const apiKey = Deno.env.get('GOOGLE_GEMINI_API_KEY');
  
  if (!apiKey) {
    throw new Error('Google Gemini API key not configured. Please add GOOGLE_GEMINI_API_KEY to your environment variables.');
  }

  // Prepare sites information for Gemini
  const sitesInfo = availableSites.map(site => ({
    id: site.id,
    name: site.name,
    domain: site.domain,
    description: site.description || 'No description available',
    category: site.category
  }));

  const prompt = `
You are an expert content analyst, marketing strategist, and publication specialist. Analyze the following comprehensive website data and provide a structured analysis for content marketing and PR purposes, including intelligent site selection.

Website URL: ${url}

COMPREHENSIVE SCRAPED DATA:
Title: ${scrapedData.title}
Meta Description: ${scrapedData.metaDescription}

Headings (${scrapedData.headings.length} total):
${scrapedData.headings.slice(0, 10).join('\n')}

Main Content (${scrapedData.bodyText.length} characters):
${scrapedData.bodyText}

Social Media Meta:
- OG Title: ${scrapedData.socialMedia.ogTitle || 'N/A'}
- OG Description: ${scrapedData.socialMedia.ogDescription || 'N/A'}
- Twitter Title: ${scrapedData.socialMedia.twitterTitle || 'N/A'}
- Twitter Description: ${scrapedData.socialMedia.twitterDescription || 'N/A'}

Structured Data Found: ${scrapedData.structuredData.length} items
${scrapedData.structuredData.length > 0 ? JSON.stringify(scrapedData.structuredData[0], null, 2) : 'None'}

Images Found: ${scrapedData.images.length}
Internal Links Found: ${scrapedData.links.length}

AVAILABLE PUBLICATION SITES:
${sitesInfo.map(site => `
ID: ${site.id}
Name: ${site.name}
Domain: ${site.domain}
Category: ${site.category}
Description: ${site.description}
`).join('\n')}

TASK:
Based on this comprehensive scraped data and the available publication sites, provide a JSON response with exactly this structure:

{
  "core_message": "A comprehensive, detailed core message (6-8 sentences minimum) that thoroughly explains this product/service, its unique value proposition, target audience, key features, benefits, and market positioning. This should be publication-ready content that journalists and content creators can use directly in articles.",
  "keywords": ["exactly 10 highly relevant keywords that best represent this product/service for SEO and content marketing"],
  "selected_sites": [array of exactly 3 site IDs that are the best fit for this product/service based on category, audience, and content relevance]
}

CORE MESSAGE REQUIREMENTS:
The core_message must be comprehensive and include:
1. What the product/service is and what it does (2 sentences)
2. Who the target audience is and what problems it solves (2 sentences)
3. Key unique features, benefits, or competitive advantages (2 sentences)
4. Market positioning, business model, or industry context (1-2 sentences)
5. Call to action or future vision (1 sentence)

The core message should be:
- DETAILED and COMPREHENSIVE (minimum 6-8 sentences, aim for 200-400 words)
- Publication-ready for press releases and articles
- Newsworthy and engaging for journalists
- Include specific details about features, benefits, and value proposition
- Mention target audience and use cases
- Highlight what makes it unique in the market
- Professional tone suitable for business publications
- Rich with context and industry insights

KEYWORDS REQUIREMENTS:
The keywords should be:
- EXACTLY 10 highly relevant terms (no more, no less)
- Mix of product features, benefits, industry terms, and target audience descriptors
- Specific enough to be meaningful for SEO
- Include both broad and niche terms
- Consider competitor analysis and market positioning
- Include industry-specific terminology

SITE SELECTION REQUIREMENTS:
You must select EXACTLY 3 sites from the available options based on:
1. **Category Relevance**: Choose sites whose categories best match the product/service type
2. **Audience Alignment**: Consider which sites would reach the most relevant audience
3. **Content Fit**: Evaluate which sites would be most appropriate for this type of content
4. **Domain Authority**: Consider the quality and reputation of the publication sites
5. **Industry Focus**: Prioritize sites that focus on the relevant industry or sector

ANALYSIS GUIDELINES:
1. Extract the core business value and unique selling proposition
2. Identify specific target audience segments and their pain points
3. Highlight key features, benefits, and competitive advantages
4. Consider the business model, pricing, and market positioning
5. Look for industry context, partnerships, or notable achievements
6. Make it compelling for business journalists and content creators
7. Include specific details that make the story newsworthy
8. Focus on what makes this product/service unique and valuable
9. Intelligently match the product/service with the most suitable publication sites
10. Consider the publication sites' audiences and content focus when selecting

Return ONLY the JSON object, no additional text or formatting.
`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 3072, // Increased for longer, more detailed responses
      }
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Gemini API error: ${response.status} - ${errorText}`);
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!generatedText) {
    throw new Error('No response from Gemini API');
  }

  console.log('Gemini response:', generatedText);

  // Extract JSON from the response
  const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not extract JSON from Gemini response. Response was: ' + generatedText);
  }

  let analysis;
  try {
    analysis = JSON.parse(jsonMatch[0]);
  } catch (parseError) {
    throw new Error('Failed to parse JSON from Gemini response: ' + parseError.message);
  }
  
  // Validate the response structure
  if (!analysis.core_message || !analysis.keywords || !analysis.selected_sites) {
    throw new Error('Invalid response structure from Gemini. Missing core_message, keywords, or selected_sites.');
  }

  // Ensure core message is substantial
  if (analysis.core_message.length < 200) {
    throw new Error('Core message from Gemini is too short. Expected at least 200 characters, got: ' + analysis.core_message.length);
  }

  // Ensure keywords array is valid and exactly 10 items
  if (!Array.isArray(analysis.keywords) || analysis.keywords.length !== 10) {
    throw new Error(`Invalid keywords from Gemini. Expected exactly 10 keywords, got: ${analysis.keywords?.length || 0}`);
  }

  // Ensure selected_sites array is valid and exactly 3 items
  if (!Array.isArray(analysis.selected_sites) || analysis.selected_sites.length !== 3) {
    throw new Error(`Invalid selected_sites from Gemini. Expected exactly 3 site IDs, got: ${analysis.selected_sites?.length || 0}`);
  }

  // Validate that selected site IDs exist in available sites
  const availableSiteIds = availableSites.map(site => site.id);
  const invalidSiteIds = analysis.selected_sites.filter(id => !availableSiteIds.includes(id));
  
  if (invalidSiteIds.length > 0) {
    console.warn(`Gemini selected invalid site IDs: ${invalidSiteIds.join(', ')}. Using fallback selection.`);
    // Fallback to first 3 available sites
    analysis.selected_sites = availableSiteIds.slice(0, 3);
  }

  return {
    core_message: analysis.core_message,
    keywords: analysis.keywords,
    selected_sites: analysis.selected_sites,
  };
}