import { NextResponse, type NextRequest } from "next/server";

/**
 * The old FlexiFunnels site used capitalised paths (/Home, /AboutUs …).
 * next.config redirects match case-insensitively, which would make
 * /Projects -> /projects redirect onto itself, so the mapping lives here
 * where the lookup is exact-case and a loop is impossible.
 */
const legacyPaths: Record<string, string> = {
  "/Home": "/",
  "/AboutUs": "/about",
  "/Our-Services": "/services",
  "/Projects": "/projects",
  "/Careers": "/careers",
  "/Contact": "/contact",
};

export default function proxy(request: NextRequest) {
  const destination = legacyPaths[request.nextUrl.pathname];
  if (!destination) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = destination;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/Home", "/AboutUs", "/Our-Services", "/Projects", "/Careers", "/Contact"],
};
