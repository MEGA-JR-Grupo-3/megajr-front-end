"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../firebaseConfig";
import ButtonLogout from "../../components/ButtonLogout";
import AddTaskButton from "../../components/ButtonAddTask";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [loading, user, router]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="flex flex-col h-screen p-2 transition-all duration-300">
      <ButtonLogout />
      <h1 className="text-[22px] font-[700] text-start pt-[58px]">
        Suas JubiTasks
      </h1>
      <div className="flex flex-col items-start justify-items-center h-auto transition-all duration-300">
        <h2>Olá, {user ? user.displayName : "parceiro!"} </h2>
        <AddTaskButton />
      </div>
    </div>
  );
}

export default Dashboard;
