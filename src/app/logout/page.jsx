import React from "react";
import AddTaskButton from "../../components/ButtonAddTask";

function Logout({ user }) {
  return (
    <div className="flex flex-col items-start justify-items-center h-auto transition-all duration-300">
      <h2>Olá, {user.displayName} </h2>
      <AddTaskButton />
    </div>
  );
}

export default Logout;
