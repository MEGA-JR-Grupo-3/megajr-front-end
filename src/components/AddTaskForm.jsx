import React, { useState } from "react";
import { auth } from "../firebaseConfig";

function AddTaskForm({ onClose, onTaskAdded }) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataPrazo, setDataPrazo] = useState("");
  const [prioridade, setPrioridade] = useState("");
  const [estadoTarefa, setEstadoTarefa] = useState("");
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const user = auth.currentUser;
    if (!user?.email) {
      console.error("Usuário não autenticado.");
      return;
    }

    const newTask = {
      titulo,
      descricao,
      data_prazo: dataPrazo === "" ? null : dataPrazo,
      prioridade,
      estado_tarefa: estadoTarefa,
      email: user.email,
    };

    try {
      console.log("Dados a serem enviados:", {
        titulo,
        descricao,
        data_prazo: dataPrazo,
        prioridade,
        estado_tarefa: estadoTarefa,
        email: user.email,
      });
      const response = await fetch(`${backendUrl}/tasks/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Tarefa adicionada:", data);
        onTaskAdded(data.insertId);
        onClose();
      } else {
        const errorData = await response.json();
        console.error("Erro ao adicionar tarefa:", errorData);
      }
    } catch (error) {
      console.error("Erro ao comunicar com o backend:", error);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-[#000000a5] bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-md p-6 w-[330px]">
        <h2 className="text-xl font-semibold mb-4">Adicionar Nova Tarefa</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          <div>
            <label
              htmlFor="titulo"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Título:
            </label>
            <input
              type="text"
              id="titulo"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="descricao"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Descrição:
            </label>
            <textarea
              id="descricao"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="dataPrazo"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Data Prazo:
            </label>
            <input
              type="date"
              id="dataPrazo"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={dataPrazo}
              onChange={(e) => setDataPrazo(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="prioridade"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Prioridade:
            </label>
            <select
              id="prioridade"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={prioridade}
              onChange={(e) => setPrioridade(e.target.value)}
              required
            >
              <option value="Baixa">Baixa</option>
              <option value="Normal">Normal</option>
              <option value="Alta">Alta</option>
              <option value="Urgente">Urgente</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="estadoTarefa"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Estado:
            </label>
            <select
              id="estadoTarefa"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={estadoTarefa}
              onChange={(e) => setEstadoTarefa(e.target.value)}
              required
            >
              <option value="Pendente">Pendente</option>
              <option value="Finalizada">Finalizada</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleCancel}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTaskForm;
