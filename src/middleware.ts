import { getSessionCookie } from "better-auth/cookies"
import { NextResponse, type NextRequest } from "next/server"

// Everything requires a session except /sign-in and the auth API itself
// (INV-T4 names the one deliberate exception to this, the public shared
// quote at /q/[token], which does not exist yet in this phase). This is a
// cookie-presence check only — cheap, no DB round trip — so a forged or
// expired cookie still reaches the session check inside the Server Action
// wrapper (lib/safe-action.ts), which is the actual authorisation boundary.
const PUBLIC_PATHS = ["/sign-in"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    PUBLIC_PATHS.some((path) => pathname.startsWith(path)) ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next()
  }

  const sessionCookie = getSessionCookie(request)

  if (!sessionCookie) {
    const signInUrl = new URL("/sign-in", request.url)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
