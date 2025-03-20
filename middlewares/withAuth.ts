import { MiddlewareFactory } from './stackHandler';
import {
  NextFetchEvent,
  NextRequest,
  NextResponse,
} from "next/server";


export const withAuth: MiddlewareFactory = (next) => {
  return async(req: NextRequest, _next: NextFetchEvent) => {
    const publicPaths = [
      '/_next/static',
      '/_next/image',
      '/public/logo.png',
      '/public/favicon.ico',
      '/manifest.json',
      '/register/verify-pin',
      '/register/new-profile',
    ];
    if (!publicPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
      const secureCookie = process.env.NEXTAUTH_URL?.startsWith("https://") ?? !!process.env.VERCEL;
      const cookieName = secureCookie ? "__Secure-next-auth.session-token" : "next-auth.session-token";
      const authUrl = `${process.env.NEXTAUTH_URL}/api/auth/session`;
      const session = await (await fetch(authUrl, { 
        method: 'GET', 
        headers: { 
          'Cookie': `${cookieName}=${req.cookies.get(cookieName)?.value}` 
        } 
      })).json();
  
      if (!!session.user) {
        return next(req, _next);
      } else {
        const path = req.nextUrl.pathname === '/' ? '' : req.nextUrl.pathname;
        const callbackUrl = `${process.env.BASE_URL}${path}`;
        return NextResponse.redirect(new URL(`/user/login?callbackUrl=${callbackUrl}`, process.env.NEXTAUTH_URL));
      }
    } else {
      return next(req, _next);
    } 
  };
}


//export const config = { matcher: ['/((?!api/auth|api/trpc|_next/static|_next/image|logo.png|favicon.ico|user/login|user/register).*)', '/'] }