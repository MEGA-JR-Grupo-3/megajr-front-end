"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../firebaseConfig";
import AddTaskButton from "../../components/ButtonAddTask";
import { LineSpinner } from "ldrs/react";
import "ldrs/react/LineSpinner.css";
import Menu from "../../components/Menu";

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
    return (
      <div className="flex justify-center items-center h-screen">
        <LineSpinner size="40" stroke="3" speed="1" color="black" />;
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen p-2 transition-all duration-300">
      <Menu />

      <div className="flex flex-col items-start justify-items-center h-auto transition-all duration-300">
        <h2 className="pt-[40px]">
          Olá, {user ? user.displayName : "parceiro!"}{" "}
        </h2>
        <h1 className="text-[22px] font-[700] text-start ">Suas JubiTasks</h1>

        <AddTaskButton />
      </div>
    </div>
  );
}

export default Dashboard;
