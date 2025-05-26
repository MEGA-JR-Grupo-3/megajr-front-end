// layout.client.js
"use client";
import React from "react";
import { useEffect, useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Providers } from "./providers";
import { auth } from "../firebaseConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SplashScreen from "../components/SplashScreen";
import Image from "next/image";
import Logo from "../../public/assets/splash-pato.png";
import Sidebar from "../components/Sidebar";

export default function RootLayoutClient({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [firebaseIdToken, setFirebaseIdToken] = useState(null);
  const [registeredName, setRegisteredName] = useState("");
  const [user, setUser] = useState(null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const publicPaths = useMemo(() => ["/", "/login", "/register"], []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const idToken = await currentUser.getIdToken();
          setFirebaseIdToken(idToken);
          localStorage.setItem("jwt_token", idToken);
        } catch (error) {
          console.error("Erro ao obter Firebase ID Token:", error);
          auth.signOut();
        }
      } else {
        setFirebaseIdToken(null);
        localStorage.removeItem("jwt_token");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setIsAuthenticated(!!currentUser);
      setIsLoading(false);
      if (currentUser && publicPaths.includes(pathname)) {
        router.push("/dashboard");
      } else if (!currentUser && !publicPaths.includes(pathname)) {
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [router, pathname, publicPaths]);

  useEffect(() => {
    if (user && isAuthenticated && firebaseIdToken) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`${backendUrl}/user-data`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${firebaseIdToken}`,
            },
            body: JSON.stringify({ email: user.email }),
          });

          if (response.ok) {
            const data = await response.json();
            setRegisteredName(data.name);
          } else {
            console.error("Erro ao buscar dados do usuário:", response.status);
            setRegisteredName("");
            if (response.status === 401 || response.status === 403) {
              console.error(
                "Sessão expirada ou não autorizada. Faça login novamente."
              );
              auth.signOut();
              router.push("/");
            }
          }
        } catch (error) {
          console.error("Erro ao comunicar com o backend:", error);
          setRegisteredName("");
        }
      };

      fetchUserData();
    } else if (!user) {
      setRegisteredName("");
    }
  }, [user, isAuthenticated, backendUrl, firebaseIdToken, router]);

  if (isLoading) {
    return <SplashScreen />;
  }

  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <Providers>
      <ToastContainer autoClose={3000} position="bottom-left" />
      {isAuthenticated && (
        <nav className="w-full flex flex-row items-center justify-between pr-5 px-3.5 ">
          <Image
            src={Logo}
            className="lg:hidden h-14 w-auto"
            alt="Logo Jubileu"
            onClick={() => reloadPage()}
            priority
          />
          <h2 className="lg:hidden text-xl font-bold">
            Olá, {registeredName || user?.displayName || "parceiro(a)!"}
          </h2>
          <Sidebar />
        </nav>
      )}
      {children}
    </Providers>
  );
}
