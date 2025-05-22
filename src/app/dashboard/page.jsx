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
import Logo from "../../../public/assets/splash-pato.png";
import Image from "next/image";
import Sidebar from "../../components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

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
  const [registeredName, setRegisteredName] = useState("");
  const [allTasks, setAllTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isAddTaskFormVisible, setIsAddTaskFormVisible] = useState(false);

  // ESTADOS PARA OS FILTROS
  const [filterType, setFilterType] = useState(null); // 'priority', 'date', 'title', 'description'
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' ou 'desc'
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");

  // NOVO ESTADO para controlar a visibilidade das opções de filtro
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

    if (filterType) {
      switch (filterType) {
        case "priority":
          tasksToFilter.sort((a, b) => {
            const valA = priorityOrder[a.prioridade];
            const valB = priorityOrder[b.prioridade];

            if (sortOrder === "asc") {
              return valA - valB;
            } else {
              return valB - valA;
            }
          });
          break;
        case "date":
          tasksToFilter.sort((a, b) => {
            const dateA = new Date(a.data_prazo);
            const dateB = new Date(b.data_prazo);
            if (sortOrder === "asc") {
              return dateA.getTime() - dateB.getTime();
            } else {
              return dateB.getTime() - dateA.getTime();
            }
          });
          break;
        case "title":
          tasksToFilter.sort((a, b) => {
            const titleA = a.titulo.toLowerCase();
            const titleB = b.titulo.toLowerCase();
            if (sortOrder === "asc") {
              return titleA.localeCompare(titleB);
            } else {
              return titleB.localeCompare(a.titulo); // Correção aqui: deve ser titleB.localeCompare(titleA)
            }
          });
          break;
        case "description":
          tasksToFilter.sort((a, b) => {
            const descA = a.descricao.toLowerCase();
            const descB = b.descricao.toLowerCase();
            if (sortOrder === "asc") {
              return descA.localeCompare(descB);
            } else {
              return descB.localeCompare(descA);
            }
          });
          break;
        default:
          break;
      }
    }
    setFilteredTasks(tasksToFilter);
  }, [allTasks, filterType, sortOrder, currentSearchTerm]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [allTasks, filterType, sortOrder, currentSearchTerm, applyFiltersAndSort]);

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
    fetchTasks();
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
    if (user) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`${backendUrl}/user-data`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: user.email }),
          });

          if (response.ok) {
            const data = await response.json();
            setRegisteredName(data.name);
          } else {
            console.error("Erro ao buscar dados do usuário");
          }
        } catch (error) {
          console.error("Erro ao comunicar com o backend:", error);
        }
      };

      fetchUserData();
    }
  }, [user, backendUrl]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [loading, user, router]);

  const handleTaskAdded = (newTaskId) => {
    fetchTasks();
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
    <div className="flex flex-col h-screen w-screen lg:w-[calc(100vw-320px)] justify-self-end items-center p-2 transition-all duration-300 text-[var(--text)]">
      <nav className="w-full flex flex-row items-center justify-between pr-3">
        <Image
          src={Logo}
          className="lg:hidden h-14 w-auto"
          alt="Logo Jubileu"
          priority
        />
        <h2 className="lg:hidden text-xl font-bold">
          Olá, {registeredName || user?.displayName || "parceiro(a)!"}
        </h2>
        <Sidebar />
      </nav>
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
              buttonStyle="w-full text-left p-2 rounded-md hover:bg-gray-100 text-gray-100"
              onClick={() => handleApplyFilter("priority")}
            />
            <Button
              buttonText="Data"
              buttonStyle="w-full text-left p-2 rounded-md hover:bg-gray-100 text-gray-100"
              onClick={() => handleApplyFilter("date")}
            />
            <Button
              buttonText="Título"
              buttonStyle="w-full text-left p-2 rounded-md hover:bg-gray-100 text-gray-100"
              onClick={() => handleApplyFilter("title")}
            />
            <Button
              buttonText="Descrição"
              buttonStyle="w-full text-left p-2 rounded-md hover:bg-gray-100 text-gray-100"
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
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredTasks.map((t) => t.id_tarefa)}
              strategy={rectSortingStrategy}
            >
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
                filteredTasks.map((tarefa) => (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-[30px] w-full px-4 justify-items-center">
                    <li
                      key={tarefa.id_tarefa}
                      className="w-full flex justify-center"
                    >
                      <TaskCard
                        tarefa={tarefa}
                        onTaskDeleted={handleTaskDeleted}
                        onTaskUpdated={handleTaskUpdated}
                        isDraggable={true}
                        id={tarefa.id_tarefa}
                      />
                    </li>
                  </ul>
                ))
              )}
            </SortableContext>
          </DndContext>
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
