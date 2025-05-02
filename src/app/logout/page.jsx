import React from "react";
import AddTaskButton from "../../components/ButtonAddTask";

export default function Logout() {
  // Aqui você pode buscar as informações do usuário,
  // seja de um estado global, context ou outra fonte de dados.
  // Por exemplo, se você tiver um estado global chamado 'user',
  // você o acessaria aqui.

  // Exemplo simulado (você precisará adaptar à sua lógica):
  const user = { displayName: "Nome do Usuário" };

  return (
    <div className="flex flex-col items-start justify-items-center h-auto transition-all duration-300">
      <h2>Olá, {user ? user.displayName : "parceiro!"} </h2>
      <AddTaskButton />
    </div>
  );
}
