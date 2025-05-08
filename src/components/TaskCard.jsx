import React from "react";

function TaskCard({ tarefa }) {
  const {
    titulo,
    descricao,
    data_prazo,
    prioridade,
    estado_tarefa,
    data_criacao,
  } = tarefa;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getPriorityColor = () => {
    switch (prioridade) {
      case "Alta":
        return "bg-red-500";
      case "Media":
        return "bg-yellow-500";
      case "Baixa":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="bg-white rounded-md shadow-md p-4 mb-4">
      <h3 className="text-xl font-semibold mb-2">{titulo}</h3>
      {descricao && <p className="text-gray-600 mb-2">{descricao}</p>}
      {data_prazo && (
        <p className="text-gray-500 mb-1">Prazo: {formatDate(data_prazo)}</p>
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
      <p className="text-gray-500">Estado: {estado_tarefa}</p>
      <p className="text-gray-400 text-xs mt-2">
        Criado em: {formatDate(data_criacao)}
      </p>
      {/* Adicione aqui botões para editar, deletar, marcar como concluída, etc. */}
    </div>
  );
}

export default TaskCard;
