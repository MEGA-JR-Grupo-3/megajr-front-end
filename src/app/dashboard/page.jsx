"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { auth } from "../../firebaseConfig";
import ButtonLogout from "../../components/ButtonLogout";

// Importe Login como um componente cliente dinâmico para evitar problemas de SSR se ele usar hooks
const Login = dynamic(() => import("../login/page"), { ssr: false });
const Logout = dynamic(() => import("../logout/page"), { ssr: false });

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe(); // Clean up the listener
  }, []);

  return (
    <div className="flex flex-col h-screen p-2 transition-all duration-300">
      <ButtonLogout />
      <h1 className="text-[22px] font-[700] text-start pt-[58px]">
        Suas JubiTasks
      </h1>
      {user ? <Logout user={user} /> : <Login />}
    </div>
  );
}

export default Dashboard;
