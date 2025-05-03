import { NextResponse } from "next/server";
//import { auth } from "./firebaseConfig";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    try {
      const sessionCookie = request.cookies.get("session")?.value;
      if (!sessionCookie) {
        throw new Error("No session cookie");
      }
      // Use Firebase Admin SDK para verificar a validade do cookie de sessão
      // (Requer configuração do Firebase Admin SDK no seu backend)
      // const decodedToken = await auth.verifySessionCookie(sessionCookie);
      // if (decodedToken) {
      //   return NextResponse.next();
      // } else {
      //   return NextResponse.redirect(new URL('/login', request.url));
      // }

      // Uma abordagem mais simples (se você confia no token no localStorage):
      const token = request.cookies.get("authToken")?.value;
      if (!token) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      // Você pode adicionar uma chamada para verificar a validade do token no seu backend aqui
      return NextResponse.next();
    } catch (error) {
      console.error("Erro ao verificar autenticação no middleware:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard"],
};
