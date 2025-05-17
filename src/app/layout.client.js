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

export default function RootLayoutClient({ children }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        setIsAuthenticated(!!user);
        setIsLoading(false);
        if (user) {
          router.push("/dashboard");
        } else {
          router.push("/");
        }
      }, 1000);

      return () => clearTimeout(timer);
    }, 1000);

    return () => unsubscribe();
  }, [router]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Providers>
      <ToastContainer autoClose={3000} position="bottom-left" />
      {children}
    </Providers>
  );
}
