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
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import ConfirmModal from "../../components/ConfirmModal";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [allTasks, setAllTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmModal, setConfirmModal] = useState(null);
  const [isAddTaskFormVisible, setIsAddTaskFormVisible] = useState(false);
  const [completedTasksCount, setCompletedTasksCount] = useState(0);
  const [taskDisplaySize, setTaskDisplaySize] = useState('medium'); // Novo estado para o tamanho de exibição da tarefa

  // ESTADOS PARA OS FILTROS
  const [filterType, setFilterType] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");

  const [showFilterOptions, setShowFilterOptions] = useState(false);

  const priorityOrder = {
    Urgente: 1,
    Alta: 2,
    Normal: 3,
    Baixa: 4,
  };

  // FUNÇÃO DE APLICAÇÃO DE FILTROS E ORDENAÇÃO

  const applyFiltersAndSort = useCallback(() => {
    let tasksToFilter = [...allTasks];

    if (currentSearchTerm) {
      const lowerCaseSearchTerm = currentSearchTerm.toLowerCase();
      tasksToFilter = tasksToFilter.filter(
        (task) =>
          task.titulo.toLowerCase().includes(lowerCaseSearchTerm) ||
          task.descricao.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    let pendingTasks = tasksToFilter.filter(
      (task) => task.estado_tarefa === "Pendente"
    );
    let completedTasks = tasksToFilter.filter(
      (task) => task.estado_tarefa === "Finalizada"
    );

    setCompletedTasksCount(completedTasks.length);

    if (filterType) {
      switch (filterType) {
        case "priority":
          pendingTasks.sort((a, b) => {
            const valA = priorityOrder[a.prioridade];
            const valB = priorityOrder[b.prioridade];
            return sortOrder === "asc" ? valA - valB : valB - valA;
          });
          break;
        case "date":
          pendingTasks.sort((a, b) => {
            const dateA = new Date(a.data_prazo);
            const dateB = new Date(b.data_prazo);
            if (!a.data_prazo && !b.data_prazo) return 0;
            if (!a.data_prazo) return sortOrder === "asc" ? 1 : -1;
            if (!b.data_prazo) return sortOrder === "asc" ? -1 : 1;
            return sortOrder === "asc"
              ? dateA.getTime() - dateB.getTime()
              : dateB.getTime() - dateA.getTime();
          });
          break;
        case "title":
          pendingTasks.sort((a, b) => {
            const titleA = a.titulo.toLowerCase();
            const titleB = b.titulo.toLowerCase();
            return sortOrder === "asc"
              ? titleA.localeCompare(titleB)
              : titleB.localeCompare(titleA);
          });
          break;
        case "description":
          pendingTasks.sort((a, b) => {
            const descA = (a.descricao || "").toLowerCase();
            const descB = (b.descricao || "").toLowerCase();
            return sortOrder === "asc"
              ? descA.localeCompare(descB)
              : descB.localeCompare(descA);
          });
          break;
        default:
          break;
      }
    } else {
      pendingTasks.sort((a, b) => {
        const priorityA = priorityOrder[a.prioridade];
        const priorityB = priorityOrder[b.prioridade];

        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }
        const dateA = new Date(a.data_prazo);
        const dateB = new Date(b.data_prazo);

        if (!a.data_prazo && !b.data_prazo) return 0;
        if (!a.data_prazo) return 1;
        if (!b.data_prazo) return -1;

        return dateA.getTime() - dateB.getTime();
      });
    }
    completedTasks.sort(() => {
      return 0;
    });

    setFilteredTasks([...pendingTasks, ...completedTasks]);
  }, [allTasks, filterType, sortOrder, currentSearchTerm]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [allTasks, filterType, sortOrder, currentSearchTerm, applyFiltersAndSort]);

  //Carregar o taskSise
  useEffect(() => {
    const savedTaskSize = localStorage.getItem("taskSize");
    if (savedTaskSize) {
      setTaskDisplaySize(savedTaskSize);
    }

    //Listener se for alterado
    const handleStorageChange = (event) => {
      if (event.key === "taskSize") {
        setTaskDisplaySize(event.newValue || 'medium');
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const fetchTasks = async () => {
    if (user?.email) {
      setLoadingTasks(true);
      try {
        const response = await fetch(`${backendUrl}/tasks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: user.email }),
        });

        if (response.ok) {
          const data = await response.json();
          setAllTasks(data);
        } else {
          console.error("Erro ao buscar tarefas");
        }
      } catch (error) {
        console.error("Erro ao comunicar com o backend:", error);
      } finally {
        setLoadingTasks(false);
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [backendUrl, user]);

  const handleSearch = (searchTerm) => {
    setCurrentSearchTerm(searchTerm);
  };

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

  const handleTaskAdded = (newTaskId) => {
    fetchTasks();
    setIsAddTaskFormVisible(false);
  };

  const handleTaskDeleted = (deletedTaskId) => {
    setAllTasks((prev) =>
      prev.filter((task) => task.id_tarefa !== deletedTaskId)
    );
  };

  const handleTaskUpdated = (updatedTask) => {
    const updateTaskInList = (list) =>
      list.map((task) =>
        task.id_tarefa === updatedTask.id_tarefa
          ? { ...task, ...updatedTask }
          : task
      );
    setAllTasks(updateTaskInList);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = filteredTasks.findIndex(
        (task) => task.id_tarefa === active.id
      );
      const newIndex = filteredTasks.findIndex(
        (task) => task.id_tarefa === over.id
      );

      const newOrder = arrayMove(filteredTasks, oldIndex, newIndex);
      setFilteredTasks(newOrder);
    }
  };

  const handleDeleteAllCompleted = async () => {
    if (!user?.email) {
      setErrorMessage("Voce precisa estar logado para deletar tarefas.");
      return;
    }

    setConfirmModal({
      isVisible: true,
      message: "Tem certeza que deseja deletar todas as tarefas concluídas?",
      onConfirm: async () => {
        setConfirmModal(null);
        setLoadingTasks(true);
        try {
          const response = await fetch(
            `${backendUrl}/tasks/delete-completed?email=${user.email}`,
            {
              method: "DELETE",
            }
          );

          if (response.ok) {
            fetchTasks();
            setErrorMessage("Sucesso ao deletar tarefas concluidas.");
          } else {
            const errorData = await response.json();
            setErrorMessage(
              `Erro ao deletar tarefas concluidas: ${errorData.message}`
            );
          }
        } catch (error) {
          setErrorMessage("Erro ao comunicar com o backend:");
        } finally {
          setLoadingTasks(false);
        }
      },
      onCancel: () => {
        setConfirmModal(null);
      },
    });
  };

  const handleApplyFilter = (type) => {
    setFilterType(type);
    setSortOrder("asc");
    setShowFilterOptions(false);
  };

  const handleRemoveFilter = () => {
    setFilterType(null);
    setSortOrder("asc");
  };

  const getFilterLabel = (type) => {
    switch (type) {
      case "priority":
        return "Prioridade";
      case "date":
        return "Data";
      case "title":
        return "Título";
      case "description":
        return "Descrição";
      default:
        return "";
    }
  };

  const getSortOrderLabel = (order) => {
    return order === "asc" ? "Crescente" : "Decrescente";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LineSpinner size="40" stroke="3" speed="1" color="black" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-screen lg:w-[calc(100vw-320px)] justify-self-end items-center p-2 transition-all duration-300 text-[var(--text)]">
      <div className="flex flex-row items-center w-full gap-2 px-4 relative justify-center">
        <InputSearch tarefas={allTasks} onSearch={handleSearch} />

        <button
          onClick={() => setShowFilterOptions(!showFilterOptions)}
          className="p-2 mt-[20px]  text-gray-800 rounded-md  transition-colors duration-200"
          aria-label="Abrir opções de filtro"
        >
          <FontAwesomeIcon
            icon={faFilter}
            className="text-xl text-gray-700 hover:text-gray-400 cursor-pointer"
          />
        </button>
        {showFilterOptions && (
          <div className="absolute top-full right-4 lg:right-32 mt-2 w-48 bg-white border border-gray-200 gap-2 rounded-md shadow-lg z-10 flex flex-col p-2">
            <h4 className="text-sm font-semibold text-gray-700 mb-1">
              Filtrar por:
            </h4>
            <Button
              buttonText="Prioridade"
              buttonStyle="w-full text-left p-2 rounded-md hover:bg-gray-100 text-gray-100 "
              onClick={() => handleApplyFilter("priority")}
            />
            <Button
              buttonText="Data"
              buttonStyle="w-full text-left p-2 rounded-md hover:bg-gray-100 text-gray-100 "
              onClick={() => handleApplyFilter("date")}
            />
            <Button
              buttonText="Título"
              buttonStyle="w-full text-left p-2 rounded-md hover:bg-gray-100 text-gray-100 "
              onClick={() => handleApplyFilter("title")}
            />
            <Button
              buttonText="Descrição"
              buttonStyle="w-full text-left p-2 rounded-md hover:bg-gray-100 text-gray-100 "
              onClick={() => handleApplyFilter("description")}
            />
          </div>
        )}
      </div>

      {/* Área de exibição do filtro ativo e botões de ordem */}
      {filterType && (
        <div className="flex flex-col lg:flex-row items-center gap-2 mt-4 p-2 bg-purple-100 rounded-md shadow-sm">
          <span className="bg-purple-600 text-white text-sm font-semibold py-1 px-3 rounded-full flex items-center gap-1">
            Filtrado por: {getFilterLabel(filterType)}
            <button
              onClick={handleRemoveFilter}
              className="ml-1 text-white hover:text-gray-200 text-lg leading-none focus:outline-none"
            >
              &times;
            </button>
          </span>
          <Button
            buttonText={getSortOrderLabel("asc")}
            buttonStyle={`p-1.5 rounded-md text-sm ${
              sortOrder === "asc"
                ? "bg-purple-700 text-white"
                : "bg-purple-300 text-gray-300"
            }`}
            onClick={() => setSortOrder("asc")}
          />
          <Button
            buttonText={getSortOrderLabel("desc")}
            buttonStyle={`p-1.5 rounded-md text-sm ${
              sortOrder === "desc"
                ? "bg-purple-700 text-white"
                : "bg-purple-300 text-gray-300"
            }`}
            onClick={() => setSortOrder("desc")}
          />
        </div>
      )}

      <div className="flex flex-col items-center justify-start h-full transition-all duration-300">
        <h1 className="text-[22px] font-[700] pt-[30px]">Suas JubiTasks</h1>
        {loadingTasks ? (
          <div className="flex justify-center items-center mt-[30px]">
            <LineSpinner size="30" stroke="3" speed="1" color="gray" />
          </div>
        ) : (
          <>
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={filteredTasks.map((t) => t.id_tarefa)}
                strategy={rectSortingStrategy}
              >
                {completedTasksCount > 1 && (
                  <div className="flex justify-end items-center mt-[30px] w-full px-4">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline mb-2 transition-all duration-300"
                      onClick={handleDeleteAllCompleted}
                    >
                      Deletar Todas as Concluídas
                    </button>
                  </div>
                )}
                {filteredTasks.length === 0 && !errorMessage ? (
                  <ul className="flex justify-center items-center mt-[30px] w-full px-4 justify-items-center">
                    <li className="flex flex-col justify-center items-center text-center mt-[100px] gap-14 h-full w-full">
                      <p className="text-[22px] font-[700] pt-[30px]">
                        Bora organizar sua vida!
                      </p>
                      <Image
                        src="/assets/pato-triste.png"
                        alt="Sem Tarefas"
                        width={250}
                        height={250}
                      />
                    </li>
                  </ul>
                ) : (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pt-[30px] pb-[80px] w-full px-4 justify-items-center">
                    {filteredTasks.map((tarefa) => (
                      <li
                        key={tarefa.id_tarefa}
                        className=" flex justify-center"
                      >
                        <TaskCard
                          tarefa={tarefa}
                          onTaskDeleted={handleTaskDeleted}
                          onTaskUpdated={handleTaskUpdated}
                          isDraggable={true}
                          id={tarefa.id_tarefa}
                          taskSize={taskDisplaySize}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </SortableContext>
            </DndContext>
          </>
        )}
        {errorMessage && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
            <div className="h-[200px] w-[340px] bg-[var(--subbackground)] rounded-2xl border border-[#ffffff] p-4 flex flex-col justify-center text-center text-red-600">
              <h3>{errorMessage}</h3>
              <Button
                buttonText="Fechar"
                buttonStyle="mt-[20px] self-center"
                onClick={() => setErrorMessage("")}
              />
            </div>
          </div>
        )}
        {confirmModal && confirmModal.isVisible && (
          <ConfirmModal
            message={confirmModal.message}
            onConfirm={confirmModal.onConfirm}
            onCancel={confirmModal.onCancel}
          />
        )}
        <ButtonAddTask onClick={() => setIsAddTaskFormVisible(true)} />
        {isAddTaskFormVisible && (
          <AddTaskForm
            onClose={() => setIsAddTaskFormVisible(false)}
            onTaskAdded={handleTaskAdded}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;