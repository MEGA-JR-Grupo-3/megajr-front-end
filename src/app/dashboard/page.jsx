"use client";

import React, { useState, useEffect } from "react";
import Login from "../login/page";
import Logout from "../logout/page";
import { auth } from "../../firebaseConfig";
import ButtonLogout from "../../components/ButtonLogout";

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged(setUser);
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
