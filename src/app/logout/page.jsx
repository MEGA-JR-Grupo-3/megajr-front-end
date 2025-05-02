import React from "react";
import AddTaskButton from "../../components/ButtonAddTask";

export default function Logout({ user }) {
  return (
    <div className="flex flex-col items-start justify-items-center h-auto transition-all duration-300">
      <h2>Olá, {user ? user.displayName : "parceiro!"} </h2>
      <AddTaskButton />
    </div>
  );
}
