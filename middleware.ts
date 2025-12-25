import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';

  // Agar user 'nehira.space' se aaya hai, toh seedha Terminal dikhao
  if (hostname.includes('nehira.space')) {
    const url = request.nextUrl.clone();
    if (url.pathname === '/') {
      url.pathname = '/terminal';
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

