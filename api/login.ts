export default {
  async fetch(request: Request) {
    const data = await request.formData();

    if (data.get('password') !== process.env.RT_AUTH_PASSWORD) {
      return Response.redirect(
        new URL('/login/?error=1', request.url),
        302
      );
    }

    return new Response(null, {
      status: 302,
      headers: {
        Location: '/private/',
        'Set-Cookie': [
          `auth=${process.env.RT_AUTH_TOKEN}`,
          'Path=/',
          'HttpOnly',
          'SameSite=Lax',
          'Max-Age=86400'
        ].join('; ')
      }
    });
  }
};