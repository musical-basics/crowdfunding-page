import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Only run on the root path
    if (request.nextUrl.pathname === '/') {
        // Check for existing cookie
        const variantCookie = request.cookies.get('landing_page_variant')
        let variant = variantCookie?.value

        // If no cookie, assign one randomly
        if (!variant) {
            variant = Math.random() < 0.5 ? 'a' : 'b'
        }

        // Determine destination based on variant
        // Variant A: Internal Campaign Page (/dreamplay-one)
        // Variant B: External Checkout Page
        let destination = '/dreamplay-one'

        if (variant === 'b') {
            destination = 'https://www.dreamplaypianos.com/checkout-pages/customize'
        }

        // Create response with redirect
        const response = NextResponse.redirect(new URL(destination, request.url))

        // Set cookie if it didn't exist
        if (!variantCookie) {
            response.cookies.set('landing_page_variant', variant, {
                path: '/',
                maxAge: 60 * 60 * 24 * 30, // 30 days
                sameSite: 'lax',
            })
        }

        return response
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
