import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "./service/authService";
import { jwtDecode } from "jwt-decode";

const SIGN_IN_URL = "/signin";

export async function middleware(request: NextRequest) {
  const token = await getCurrentUser();

  if (!token) {
    return NextResponse.redirect(new URL(SIGN_IN_URL, request.url));
  }

  try {
    const decoded: any = jwtDecode(token);

    if (decoded?.role !== "ADMIN") {
      return NextResponse.redirect(new URL(SIGN_IN_URL, request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Invalid token:", error);
    return NextResponse.redirect(new URL(SIGN_IN_URL, request.url));
  }
}

export const config = {
  matcher: [
    "/",
    "/users",
    "/bookingList",
    "/settings",
    "/court",
    "/cart",
    "/checkout",
  ],
};
