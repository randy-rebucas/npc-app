import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getLogtoContext } from '@logto/next/server-actions';
import { logtoConfig } from '@/app/logto';

export async function authMiddleware(request: NextRequest) {
  try {
    const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);
    console.log(isAuthenticated);
    // Protected routes pattern
    const protectedPaths = ['/nurse', '/physician', '/docs'];
    const path = request.nextUrl.pathname;

    // Check if the path is protected
    const isProtectedPath = protectedPaths.some(prefix => path.startsWith(prefix));
    console.log(isProtectedPath);
    // if (isProtectedPath && !isAuthenticated) {
    //   return NextResponse.redirect(new URL('/login', request.url));
    // }

    // Add user info to headers for downstream use
    const requestHeaders = new Headers(request.headers);
    if (claims?.sub) {
      requestHeaders.set('x-user-id', claims.sub);
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    // Handle authentication errors gracefully
    console.error('Auth middleware error:', error);
    // return NextResponse.redirect(new URL('/login', request.url));
  }
} 