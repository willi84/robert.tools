const allowedOrigins = [
  'http://localhost:8080',
  'https://robert-tools.vercel.app',
];

function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('origin');

  return {
    'Access-Control-Allow-Origin':
      origin && allowedOrigins.includes(origin)
        ? origin
        : 'https://robert-tools.vercel.app',

    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

export default {
  async fetch(request: Request) {
    const corsHeaders = getCorsHeaders(request);
    const origin = request.headers.get('origin');

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    const data = await request.formData();

    const authenticated =
      data.get('password') === process.env.RT_AUTH_PASSWORD;

    const isLocalRequest =
      origin === 'http://localhost:8080';

    if (!authenticated) {
      if (isLocalRequest) {
        return Response.json(
          {
            success: false,
            error: 'INVALID_PASSWORD',
          },
          {
            status: 401,
            headers: corsHeaders,
          },
        );
      }

      return Response.redirect(
        new URL('/login/?error=1', request.url),
        302,
      );
    }

    const cookie = [
      `auth=${process.env.RT_AUTH_SECRET}`,
      'Path=/',
      'HttpOnly',
      'Secure',
      isLocalRequest ? 'SameSite=None' : 'SameSite=Lax',
      'Max-Age=86400',
    ].join('; ');

    if (isLocalRequest) {
      return Response.json(
        {
          success: true,
        },
        {
          status: 200,
          headers: {
            ...corsHeaders,
            'Set-Cookie': cookie,
          },
        },
      );
    }

    return Response.json(
        {
            success: true,
        },
        {
            status: 200,
            headers: {
            ...corsHeaders,
            'Set-Cookie': cookie,
            },
        },
    );
  },
};