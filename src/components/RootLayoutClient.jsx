"use client";

import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import SplashScreen from "../components/SplashScreen"; 
import Sidebar from "../components/Sidebar"; 

export default function RootLayoutClient({ children, dosis }) {
  const [mounted, setMounted] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    setMounted(true);
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 1500); // Garanta que este tempo seja igual ou maior que o da SplashScreen

    return () => clearTimeout(splashTimer);
  }, []);

  if (!mounted) {
    return (
      <body
        className={`${dosis.className} antialiased bg-[var(--background)] text-[var(--text)] min-h-screen`}
      >
        {children}
      </body>
    );
  }

  if (showSplash) {
    return (
      <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
        <body
          className={`${dosis.className} antialiased bg-[var(--background)] text-[var(--text)] min-h-screen`}
        >
          <SplashScreen />
        </body>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
      <body
        className={`${dosis.className} antialiased bg-[var(--background)] text-[var(--text)] min-h-screen`}
      >
        <div className="flex min-h-screen">
          <Sidebar />

          <main className="flex-1"> 
            {children}
          </main>
        </div>
      </body>
    </ThemeProvider>
  );
}