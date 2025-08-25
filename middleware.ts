// import { updateSession } from "@/lib/supabase/middleware"
// import type { NextRequest } from "next/server"

// export async function middleware(request: NextRequest) {
//   return await updateSession(request)
// }

// export const config = {
//   matcher: [
//     "/((?!_next/static|_next/image|favicon.ico|.*.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
//   ],
// }

// Middleware disabled - app now works without authentication
export function middleware() {
  // No middleware needed for local storage based app
}
