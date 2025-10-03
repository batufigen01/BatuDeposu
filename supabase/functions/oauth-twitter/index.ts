import { createClient } from 'npm:@supabase/supabase-js@2';
import {
  OAuthConfig,
  generateState,
  createCorsHeaders,
  createErrorResponse,
} from '../_shared/oauth-helpers.ts';

const corsHeaders = createCorsHeaders();

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname;

    if (path.includes('/start')) {
      return handleStart(url);
    } else if (path.includes('/callback')) {
      return await handleCallback(url, req);
    }

    return createErrorResponse('Invalid endpoint', 404);
  } catch (error) {
    console.error('Twitter OAuth error:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Internal server error',
      500
    );
  }
});

function handleStart(url: URL): Response {
  const clientId = Deno.env.get('TWITTER_CLIENT_ID') || '';
  const redirectUri = `${url.origin}/oauth-twitter/callback`;

  if (!clientId) {
    return createErrorResponse('Twitter OAuth not configured', 500);
  }

  const state = generateState();
  const codeChallenge = generateState();

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'tweet.read tweet.write users.read offline.access',
    state: state,
    code_challenge: codeChallenge,
    code_challenge_method: 'plain',
  });

  const authUrl = `https://twitter.com/i/oauth2/authorize?${params.toString()}`;

  return new Response(null, {
    status: 302,
    headers: {
      ...corsHeaders,
      Location: authUrl,
      'Set-Cookie': `oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`,
    },
  });
}

async function handleCallback(url: URL, req: Request): Promise<Response> {
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  if (error) {
    return createErrorResponse(`Authorization failed: ${error}`);
  }

  if (!code || !state) {
    return createErrorResponse('Missing code or state parameter');
  }

  const cookies = req.headers.get('cookie') || '';
  const storedState = cookies
    .split(';')
    .find(c => c.trim().startsWith('oauth_state='))
    ?.split('=')[1];

  if (state !== storedState) {
    return createErrorResponse('Invalid state parameter');
  }

  const clientId = Deno.env.get('TWITTER_CLIENT_ID') || '';
  const clientSecret = Deno.env.get('TWITTER_CLIENT_SECRET') || '';
  const redirectUri = `${url.origin}/oauth-twitter/callback`;

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri,
    code_verifier: storedState,
  });

  const basicAuth = btoa(`${clientId}:${clientSecret}`);

  const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${basicAuth}`,
    },
    body: params.toString(),
  });

  if (!tokenResponse.ok) {
    const error = await tokenResponse.text();
    return createErrorResponse(`Token exchange failed: ${error}`);
  }

  const tokenData = await tokenResponse.json();

  const profileResponse = await fetch('https://api.twitter.com/2/users/me', {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });

  if (!profileResponse.ok) {
    return createErrorResponse('Failed to fetch user profile');
  }

  const profileData = await profileResponse.json();
  const profile = profileData.data;

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return createErrorResponse('Unauthorized', 401);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabase = createClient(supabaseUrl, authHeader.replace('Bearer ', ''));

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return createErrorResponse('Unauthorized', 401);
  }

  const { error: insertError } = await supabase.from('social_accounts').insert({
    user_id: userData.user.id,
    platform: 'twitter',
    account_id: profile.id,
    account_name: profile.username,
    is_active: true,
  });

  if (insertError) {
    console.error('Database error:', insertError);
    return createErrorResponse('Failed to save account');
  }

  const frontendUrl = Deno.env.get('FRONTEND_URL') || url.origin;
  return new Response(null, {
    status: 302,
    headers: {
      ...corsHeaders,
      Location: `${frontendUrl}?oauth=success&platform=twitter`,
    },
  });
}
