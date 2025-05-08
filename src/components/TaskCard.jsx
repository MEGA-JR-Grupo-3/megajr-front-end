import React from "react";
import { auth } from "../firebaseConfig";
import { useState } from "react";

function TaskCard({ tarefa, onTaskDeleted, onTaskUpdated }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { prioridade } = tarefa;

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);

    const user = auth.currentUser;
    if (!user?.email) {
      console.error("Usuário não autenticado.");
      setIsDeleting(false);
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/tasks/${tarefa.id_tarefa}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Tarefa deletada com sucesso:", tarefa.id_tarefa);
        onTaskDeleted(tarefa.id_tarefa);
      } else {
        const errorData = await response.json();
        console.error("Erro ao deletar tarefa:", errorData);
      }
    } catch (error) {
      console.error("Erro ao comunicar com o backend:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getPriorityColor = (prioridade) => {
    switch (prioridade) {
      case "Urgente":
        return "bg-red-500 text-white";
      case "Alta":
        return "bg-orange-500 text-white";
      case "Normal":
        return "bg-yellow-500 text-gray-800";
      case "Baixa":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-300 text-gray-800";
    }
  };

  const handleStatusChange = async (event) => {
    if (isUpdating) return;
    setIsUpdating(true);

    const newStatus = event.target.checked ? "Finalizada" : "Pendente";

    const user = auth.currentUser;
    if (!user?.email) {
      console.error("Usuário não autenticado.");
      setIsUpdating(false);
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/tasks/${tarefa.id_tarefa}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado_tarefa: newStatus }),
      });

      if (response.ok) {
        console.log(
          "Estado da tarefa atualizado:",
          tarefa.id_tarefa,
          newStatus
        );
        onTaskUpdated({
          id_tarefa: tarefa.id_tarefa,
          estado_tarefa: newStatus,
        });
      } else {
        const errorData = await response.json();
        console.error("Erro ao atualizar estado da tarefa:", errorData);
      }
    } catch (error) {
      console.error("Erro ao comunicar com o backend:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-md p-4 mb-2 flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold">{tarefa.titulo}</h3>
        {tarefa.descricao && (
          <p className="text-gray-600 text-sm">{tarefa.descricao}</p>
        )}
        {tarefa.data_prazo && (
          <p className="text-gray-500 text-xs">Prazo: {tarefa.data_prazo}</p>
        )}
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-semibold">Prioridade:</span>
          <span
            className={`rounded-full px-2 py-1 text-xs ${getPriorityColor(
              prioridade
            )}`}
          >
            {prioridade}
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <label className="flex items-center text-sm text-gray-700">
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
            checked={tarefa.estado_tarefa === "Finalizada"}
            onChange={handleStatusChange}
            disabled={isUpdating}
          />
          <span className="ml-2">
            {tarefa.estado_tarefa === "Finalizada" ? "Finalizada" : "Pendente"}
          </span>
        </label>
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded text-xs focus:outline-none focus:shadow-outline"
          disabled={isDeleting}
        >
          Deletar
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
