"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { auth } from "../../firebaseConfig";
import ButtonLogout from "../../components/ButtonLogout";
import AddTaskButton from "../../components/ButtonAddTask";

// Importe Login como um componente cliente dinâmico para evitar problemas de SSR se ele usar hooks
const Login = dynamic(() => import("../login/page"), { ssr: false });

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
      {user ? (
        <div className="flex flex-col items-start justify-items-center h-auto transition-all duration-300">
          <h2>Olá, {user ? user.displayName : "parceiro!"} </h2>
          <AddTaskButton />
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default Dashboard;
