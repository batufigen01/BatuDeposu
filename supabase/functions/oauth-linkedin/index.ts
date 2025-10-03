import { createClient } from 'npm:@supabase/supabase-js@2';
import {
  OAuthConfig,
  generateState,
  buildAuthUrl,
  exchangeCodeForToken,
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
    console.error('LinkedIn OAuth error:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Internal server error',
      500
    );
  }
});

function handleStart(url: URL): Response {
  const config: OAuthConfig = {
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
    clientId: Deno.env.get('LINKEDIN_CLIENT_ID') || '',
    clientSecret: Deno.env.get('LINKEDIN_CLIENT_SECRET') || '',
    redirectUri: `${url.origin}/oauth-linkedin/callback`,
    scope: 'openid profile w_member_social',
  };

  if (!config.clientId || !config.clientSecret) {
    return createErrorResponse('LinkedIn OAuth not configured', 500);
  }

  const state = generateState();
  const authUrl = buildAuthUrl(config, state);

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

  const config: OAuthConfig = {
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
    clientId: Deno.env.get('LINKEDIN_CLIENT_ID') || '',
    clientSecret: Deno.env.get('LINKEDIN_CLIENT_SECRET') || '',
    redirectUri: `${url.origin}/oauth-linkedin/callback`,
    scope: 'openid profile w_member_social',
  };

  const tokenData = await exchangeCodeForToken(config, code);

  const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });

  if (!profileResponse.ok) {
    return createErrorResponse('Failed to fetch user profile');
  }

  const profile = await profileResponse.json();

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
    platform: 'linkedin',
    account_id: profile.sub,
    account_name: profile.name || profile.email,
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
      Location: `${frontendUrl}?oauth=success&platform=linkedin`,
    },
  });
}
