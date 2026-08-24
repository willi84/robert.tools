import { next } from '@vercel/functions';

export const config = {
    matcher: '/private/:path*'
};

export default function middleware(request: Request) {
    const host = request.headers.get('host') ?? '';

    if (host.startsWith('localhost')) {
        return next();
    }

    const cookies = request.headers.get('cookie') ?? '';

    const authenticated =
        cookies.includes(`auth=${process.env.LOGIN_TOKEN}`);

    if (!authenticated) {
        return Response.redirect(
        new URL('/login/', request.url),
        302,
        );
    }

    return next();

}