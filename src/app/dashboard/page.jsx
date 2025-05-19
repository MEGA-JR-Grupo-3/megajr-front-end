"use client";

import React, { useState, useEffect } from "react";
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
          setFilteredTasks(data);
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

  const handleSearch = async (searchTerm) => {
    if (searchTerm) {
      setLoadingTasks(true);
      try {
        const response = await fetch(
          `${backendUrl}/tasks/search?query=${searchTerm}`,
          {
            method: "GET",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setFilteredTasks(data);
        } else {
          console.error("Erro ao buscar tarefas com filtro");
          setErrorMessage("Nenhuma task encontrada para sua busca.");
        }
      } catch (error) {
        console.error("Erro ao comunicar com o backend para pesquisa:", error);
        setErrorMessage("Erro de conexão ao pesquisar.");
      } finally {
        setLoadingTasks(false);
      }
    } else {
      setFilteredTasks(allTasks);
      setErrorMessage("");
    }
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
    setFilteredTasks((prev) =>
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
    setFilteredTasks(updateTaskInList);
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
      <InputSearch tarefas={allTasks} onSearch={handleSearch} />
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
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-[30px] w-full px-4 justify-items-center">
                {filteredTasks.length === 0 ? (
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
                ) : (
                  filteredTasks.map((tarefa) => (
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
                  ))
                )}
              </ul>
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
