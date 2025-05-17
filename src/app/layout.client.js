// layout.client.js
"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Providers } from "./providers";
import { auth } from "../firebaseConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SplashScreen from "../components/SplashScreen";

export default function RootLayoutClient({ children, dosis }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
    setIsAuthenticated(!!user);
    setIsLoading(false)
      if (user) {
        router.push("/dashboard");
      }
    });

    return () => unsubscribe();
  }, [router]);
  
  return (
    <html lang="pt-BR" className={dosis.className} suppressHydrationWarning>
      <body className="antialiased bg-[var(--background)] text-[var(--text)] lg:px-[50px]">

        <Providers>
          <ToastContainer autoClose={3000} position="bottom-left" />
          {isLoading ? <SplashScreen /> : children}
        </Providers>
      </body>
    </html>
  );
}
