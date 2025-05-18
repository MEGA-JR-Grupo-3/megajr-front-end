"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../firebaseConfig";
import ButtonAddTask from "../../components/ButtonAddTask";
import Button from "../../components/Button";
import { LineSpinner } from "ldrs/react";
import "ldrs/react/LineSpinner.css";
import InputSearch from "../../components/InputSearch";
import TaskCard from "../../components/TaskCard";
import AddTaskForm from "../../components/AddTaskForm";
import Logo from "../../../public/assets/splashPato.png";
import Image from "next/image";
import Sidebar from "../../components/Sidebar";

// Dnd-kit imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [registeredName, setRegisteredName] = useState("");
  const [allTasks, setAllTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isAddTaskFormVisible, setIsAddTaskFormVisible] = useState(false);

  // Dnd-kit sensors: configura os sensores para detecção de arraste
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoadingAuth(false);
      if (!user) {
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchUserData = useCallback(async () => {
    if (currentUser?.email) {
      try {
        const response = await fetch(`${backendUrl}/user-data`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: currentUser.email }),
        });
        if (response.ok) {
          const data = await response.json();
          setRegisteredName(data.name);
        } else {
          console.error(
            "Erro ao buscar dados do usuário:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Erro ao comunicar com o backend (user-data):", error);
      }
    }
  }, [currentUser, backendUrl]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const saveTaskOrderToBackend = useCallback(
    async (tasksToSave) => {
      if (!currentUser?.email) {
        console.error(
          "Usuário não autenticado. Não é possível salvar a ordem."
        );
        setErrorMessage(
          "Você precisa estar logado para salvar a ordem das tarefas."
        );
        return;
      }

      setLoadingTasks(true);
      try {
        // Cria um array com apenas o id_tarefa e a nova ordem
        const orderData = tasksToSave.map((task) => ({
          id_tarefa: task.id_tarefa,
          ordem: task.ordem,
        }));

        const response = await fetch(`${backendUrl}/tasks/reorder`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: currentUser.email, tasks: orderData }),
        });

        if (response.ok) {
          console.log("Ordem das tarefas salva com sucesso!");
          setErrorMessage("");
        } else {
          const errorData = await response.json();
          console.error("Erro ao salvar a ordem das tarefas:", errorData);
          setErrorMessage(
            `Erro ao salvar a nova ordem: ${
              errorData.message || response.statusText
            }`
          );
        }
      } catch (error) {
        console.error("Erro de conexão ao salvar a ordem das tarefas:", error);
        setErrorMessage("Erro de conexão ao salvar a nova ordem das tarefas.");
      } finally {
        setLoadingTasks(false);
      }
    },
    [currentUser, backendUrl]
  );

  const fetchAllTasks = useCallback(async () => {
    if (currentUser?.email) {
      setLoadingTasks(true);
      try {
        const response = await fetch(`${backendUrl}/tasks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: currentUser.email }),
        });
        if (response.ok) {
          const data = await response.json();
          const sortedData = data.sort(
            (a, b) => (a.ordem || 0) - (b.ordem || 0)
          );
          setAllTasks(data);
          setFilteredTasks(data);
        } else {
          console.error("Erro ao buscar tarefas:", response.statusText);
          setErrorMessage("Não foi possível carregar suas tarefas.");
        }
      } catch (error) {
        console.error("Erro ao comunicar com o backend (tasks):", error);
        setErrorMessage("Erro de conexão ao buscar tarefas.");
      } finally {
        setLoadingTasks(false);
      }
    } else {
      // Se não há usuário, limpa as tarefas
      setAllTasks([]);
      setFilteredTasks([]);
    }
  }, [currentUser, backendUrl]);

  useEffect(() => {
    fetchAllTasks();
  }, [fetchAllTasks]);

  const handleSearch = async (searchTerm) => {
    if (!searchTerm) {
      setFilteredTasks(allTasks); // Se a busca estiver vazia, mostra todas as tarefas
      setErrorMessage("");
      return;
    }
    setLoadingTasks(true);
    try {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const results = allTasks.filter(
        (task) =>
          task.titulo.toLowerCase().includes(lowerSearchTerm) ||
          (task.descricao &&
            task.descricao.toLowerCase().includes(lowerSearchTerm))
      );
      setFilteredTasks(results);
      if (results.length === 0) {
        setErrorMessage("Nenhuma tarefa encontrada com este termo.");
      } else {
        setErrorMessage("");
      }
    } catch (error) {
      console.error("Erro ao buscar tarefas com filtro:", error);
      setErrorMessage("Erro ao tentar filtrar tarefas.");
    } finally {
      setLoadingTasks(false);
    }
  };

  // Callback quando uma nova tarefa é adicionada
  const handleTaskAdded = () => {
    fetchAllTasks(); // Recarrega todas as tarefas
    setIsAddTaskFormVisible(false); // Fecha o formulário
  };

  // Callback quando uma tarefa é deletada
  const handleTaskDeleted = (deletedTaskId) => {
    setAllTasks((prevTasks) =>
      prevTasks.filter((task) => task.id_tarefa !== deletedTaskId)
    );
    setFilteredTasks((prevTasks) =>
      prevTasks.filter((task) => task.id_tarefa !== deletedTaskId)
    );
  };

  // Callback quando uma tarefa é atualizada (status ou conteúdo)
  const handleTaskUpdated = (updatedTask) => {
    const updateLogic = (tasks) =>
      tasks.map((task) =>
        task.id_tarefa === updatedTask.id_tarefa
          ? { ...task, ...updatedTask }
          : task
      );
    setAllTasks(updateLogic);
    setFilteredTasks(updateLogic);
  };

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setFilteredTasks((items) => {
        const oldIndex = items.findIndex(
          (item) => item.id_tarefa === active.id
        );
        const newIndex = items.findIndex((item) => item.id_tarefa === over.id);

        const newOrderedItems = arrayMove(items, oldIndex, newIndex);

        const updatedOrdertasks = newOrderedItems.map((task, index) => ({
          ...task,
          ordem: index,
        }));

        saveTaskOrderToBackend(updatedOrdertasks);

        return updatedOrdertasks;
      });
    }
  }

  if (loadingAuth) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-100">
        <LineSpinner size="40" stroke="3" speed="1" color="black" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen lg:w-[calc(100vw-320px)] justify-self-end items-center p-2 md:p-4 transition-all duration-300 text-[var(--text)] bg-[var(--background)]">
      <nav className="w-full flex flex-row items-center justify-between pr-3 mb-4 md:mb-6">
        <Image
          src={Logo}
          className="lg:hidden h-12 w-auto sm:h-14 cursor-pointer"
          onClick={() => router.push("/dashboard")}
          alt="Logo Jubileu"
          priority
        />
        <h2 className="lg:hidden text-lg sm:text-xl font-bold">
          Olá, {registeredName || currentUser?.displayName || "parceiro(a)!"}
        </h2>
        <Sidebar />
      </nav>
      <InputSearch onSearch={handleSearch} />
      <div className="flex flex-col items-center justify-start w-full h-full transition-all duration-300 px-2">
        <h1 className="text-xl sm:text-2xl font-bold pt-6 pb-4 ">
          Suas JubiTasks
        </h1>

        {loadingTasks ? (
          <div className="flex justify-center items-center mt-8">
            <LineSpinner size="30" stroke="3" speed="1" color="gray" />
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredTasks.map((task) => task.id_tarefa)}
              strategy={verticalListSortingStrategy}
            >
              <ul className="flex flex-col justify-center text-center w-full max-w-2xl mt-2 space-y-3">
                {filteredTasks.length === 0 ? (
                  <li className="flex flex-col justify-center items-center text-center mt-10 sm:mt-16 gap-8 sm:gap-14 h-full w-full p-4  rounded-lg ">
                    <p className="text-lg sm:text-xl font-semibold text-[var(--text)]">
                      {errorMessage ? errorMessage : "Bora organizar sua vida!"}
                    </p>
                    {!errorMessage && (
                      <Image
                        src="/assets/pato-triste.png"
                        alt="Sem Tarefas"
                        width={200}
                        height={200}
                        className="opacity-75"
                      />
                    )}
                    <ButtonAddTask
                      onClick={() => setIsAddTaskFormVisible(true)}
                    />
                  </li>
                ) : (
                  filteredTasks.map((tarefa) => (
                    <li
                      key={tarefa.id_tarefa}
                      className="flex flex-col justify-center items-center text-center w-full"
                    >
                      <TaskCard
                        key={tarefa.id_tarefa}
                        id={tarefa.id_tarefa}
                        tarefa={tarefa}
                        onTaskDeleted={handleTaskDeleted}
                        onTaskUpdated={handleTaskUpdated}
                        currentUser={currentUser}
                        isDraggable={true}
                      />
                    </li>
                  ))
                )}
              </ul>
            </SortableContext>
          </DndContext>
        )}
      </div>
      {errorMessage && filteredTasks.length > 0 && (
        <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="h-auto min-h-[150px] w-[90%] max-w-sm bg-white rounded-2xl border border-gray-300 p-6 flex flex-col justify-center text-center shadow-xl">
            <h3 className="text-lg font-semibold text-red-600 mb-4">
              {errorMessage}
            </h3>
            <Button
              buttonText="Fechar"
              buttonStyle="mt-4 self-center bg-red-500 hover:bg-red-600 text-white"
              onClick={() => setErrorMessage("")}
            />
          </div>
        </div>
      )}
      {!isAddTaskFormVisible && filteredTasks.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40">
          <ButtonAddTask onClick={() => setIsAddTaskFormVisible(true)} />
        </div>
      )}
      {isAddTaskFormVisible && (
        <AddTaskForm
          onClose={() => setIsAddTaskFormVisible(false)}
          onTaskAdded={handleTaskAdded}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}

export default Dashboard;
