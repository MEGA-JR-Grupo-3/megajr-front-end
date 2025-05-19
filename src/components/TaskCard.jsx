// components/TaskCard.jsx
import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  MdOutlineDragIndicator,
  MdExpandMore,
  MdExpandLess,
} from "react-icons/md";

function TaskCard({ tarefa, onTaskDeleted, onTaskUpdated, isDraggable, id }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    titulo: tarefa.titulo,
    descricao: tarefa.descricao || "",
    data_prazo: tarefa.data_prazo
      ? new Date(tarefa.data_prazo).toISOString().split("T")[0]
      : "", // Formata para input type="date"
    prioridade: tarefa.prioridade,
  });

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // dnd-kit integration
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    boxShadow: isDragging ? "0px 4px 10px rgba(0, 0, 0, 0.2)" : "none",
  };

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
        alert(
          `Erro ao deletar tarefa: ${errorData.message || response.statusText}`
        );
      }
    } catch (error) {
      console.error("Erro ao comunicar com o backend:", error);
      alert("Erro de conexão ao deletar tarefa.");
    } finally {
      setIsDeleting(false);
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
      const response = await fetch(
        `${backendUrl}/tasks/${tarefa.id_tarefa}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ estado_tarefa: newStatus }),
        }
      );

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
        alert(
          `Erro ao atualizar estado da tarefa: ${
            errorData.message || response.statusText
          }`
        );
      }
    } catch (error) {
      console.error("Erro ao comunicar com o backend:", error);
      alert("Erro de conexão ao atualizar estado da tarefa.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSave = async () => {
    if (isUpdating) return;
    setIsUpdating(true);

    const user = auth.currentUser;
    if (!user?.email) {
      console.error("Usuário não autenticado.");
      setIsUpdating(false);
      return;
    }

    const payload = {
      ...editFormData,
      data_prazo: editFormData.data_prazo || null,
      estado_tarefa: tarefa.estado_tarefa,
    };

    try {
      const response = await fetch(`${backendUrl}/tasks/${tarefa.id_tarefa}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log("Tarefa atualizada com sucesso:", tarefa.id_tarefa);
        onTaskUpdated({
          id_tarefa: tarefa.id_tarefa,
          ...payload,
        });
        setIsEditing(false); // Sai do modo de edição
        setIsExpanded(false); // Colapsa o card após a edição
      } else {
        const errorData = await response.json();
        console.error("Erro ao atualizar tarefa:", errorData);
        alert(
          `Erro ao atualizar tarefa: ${
            errorData.message || response.statusText
          }`
        );
      }
    } catch (error) {
      console.error("Erro ao comunicar com o backend (edição):", error);
      alert("Erro de conexão ao atualizar tarefa.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditFormData({
      titulo: tarefa.titulo,
      descricao: tarefa.descricao || "",
      data_prazo: tarefa.data_prazo
        ? new Date(tarefa.data_prazo).toISOString().split("T")[0]
        : "",
      prioridade: tarefa.prioridade,
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`bg-[var(--bgcard)] shadow-md rounded-md p-4 mb-2 flex justify-between w-[360px] min-h-24 cursor-pointer 
      ${isExpanded ? "flex-col justify-between w-[320px]" : "items-center"}
      ${isDragging ? "" : "transition-all duration-300"} ${
        isDraggable ? "touch-action-none" : ""
      }`}
    >
      <div className="flex w-full">
        {isDraggable && (
          <div
            className="flex items-center justify-center cursor-grab text-gray-400 hover:text-gray-600 active:text-blue-500 "
            {...listeners}
          >
            <MdOutlineDragIndicator size={24} />
          </div>
        )}

        <div className="flex flex-col justify-start text-start gap-1 flex-grow">
          {isEditing ? (
            <input
              type="text"
              name="titulo"
              value={editFormData.titulo}
              onChange={handleEditChange}
              className="text-lg font-semibold border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent w-full"
              placeholder="Título da Tarefa"
            />
          ) : (
            <h3 className="text-lg font-semibold">{tarefa.titulo}</h3>
          )}

          {isExpanded && (
            <>
              {isEditing ? (
                <textarea
                  name="descricao"
                  value={editFormData.descricao}
                  onChange={handleEditChange}
                  className="text-gray-600 text-sm w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 mt-1 resize-y max-h-40 overflow-y-auto bg-transparent"
                  rows={3}
                  placeholder="Descrição da Tarefa"
                ></textarea>
              ) : (
                tarefa.descricao && (
                  <p className="text-gray-600 text-sm mt-1 break-words whitespace-pre-wrap max-h-24 overflow-auto w-[295px]">
                    {tarefa.descricao}
                  </p>
                )
              )}

              {isEditing ? (
                <input
                  type="date"
                  name="data_prazo"
                  value={editFormData.data_prazo}
                  onChange={handleEditChange}
                  className="text-gray-500 text-xs mt-1 border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent w-full"
                />
              ) : (
                <p className="text-gray-500 text-xs mt-1">
                  Prazo:{" "}
                  {tarefa.data_prazo
                    ? new Date(tarefa.data_prazo).toLocaleDateString("pt-BR")
                    : "Indefinido"}
                </p>
              )}

              {isEditing ? (
                <select
                  name="prioridade"
                  value={editFormData.prioridade}
                  onChange={handleEditChange}
                  className="text-gray-500 text-xs mt-1 border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent w-full"
                >
                  <option value="Baixa">Baixa</option>
                  <option value="Normal">Normal</option>
                  <option value="Alta">Alta</option>
                  <option value="Urgente">Urgente</option>
                </select>
              ) : (
                <p className="text-[var(--text)] text-xs mt-1">
                  Prioridade: {tarefa.prioridade}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      <div
        className={`flex ${
          isExpanded
            ? "flex-row items-center justify-between w-full"
            : "items-center"
        } mt-2 gap-2`}
      >
        {!isEditing && (
          <>
            <label className="flex items-center text-sm text-gray-700">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                checked={tarefa.estado_tarefa === "Finalizada"}
                onChange={handleStatusChange}
                disabled={isUpdating}
              />
            </label>
            {isExpanded && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs focus:outline-none focus:shadow-outline w-16"
              >
                Editar
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs focus:outline-none focus:shadow-outline w-16"
              disabled={isDeleting}
            >
              Deletar
            </button>
          </>
        )}

        {!isEditing && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="ml-auto p-1 rounded-full hover:bg-gray-200 text-gray-500 flex-shrink-0"
          >
            {isExpanded ? (
              <MdExpandLess size={24} />
            ) : (
              <MdExpandMore size={24} />
            )}
          </button>
        )}

        {isEditing && (
          <div className="flex space-x-2 mt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEditSave();
              }}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-xs focus:outline-none focus:shadow-outline w-16"
              disabled={isUpdating}
            >
              Salvar
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEditCancel();
              }}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded text-xs focus:outline-none focus:shadow-outline w-16"
              disabled={isUpdating}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskCard;
