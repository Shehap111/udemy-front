import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;

  // نجيب اللغة من أول جزء في الـ path
  const locale = req.nextUrl.pathname.split("/")[1] || "en";

  // لو المستخدم داخل على /[locale]/dashboard و مفيش توكن → نوديه على /[locale]/login
  if (!token) {
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/(en|ar|de|es)/dashboard/:path*"], // نحمي كل اللغات
};
