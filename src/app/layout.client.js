// layout.client.js
"use client";

import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Providers } from "./providers";
import ThemeSwitch from "../components/ThemeSwitch";
import { auth } from "../firebaseConfig";

export default function RootLayoutClient({ children, dosis }) {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/dashboard");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <html lang="pt-BR" className={dosis.className} suppressHydrationWarning>
      <body className="antialiased bg-[var(--background)] text-[var(--text)]">
        <Providers>
          <ThemeSwitch />
          {children}
        </Providers>
      </body>
    </html>
  );
}
