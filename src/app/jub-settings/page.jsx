"use client";

import BackButton from "../../components/BackButton";
import NotificationSwitch from "../../components/NotificationSwitch";
import ThemeButton from "../../components/ThemeSwitch2";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import patoConfig from "../../../public/assets/pato-config.png";

export default function SettingsPage() {
  const [isNotificationAllowedByUser, setIsNotificationAllowedByUser] =
    useState(false);
  const [browserNotificationPermission, setBrowserNotificationPermission] =
    useState("default");
  const [notificationStatusMessage, setNotificationStatusMessage] =
    useState("");
  const [tasks, setTasks] = useState([]);
  const [taskSize, setTaskSize] = useState("medium");

  useEffect(() => {
    const savedPreference = localStorage.getItem("notificationsEnabled");
    if (savedPreference !== null) {
      setIsNotificationAllowedByUser(savedPreference === "true");
    }

    const savedTaskSize = localStorage.getItem("taskSize");
    if (savedTaskSize !== null) {
      setTaskSize(savedTaskSize);
    }

    if ("Notification" in window) {
      setBrowserNotificationPermission(Notification.permission);
    } else {
      setNotificationStatusMessage(
        "Este navegador não suporta notificações de desktop."
      );
    }

    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }

    const handleStorageChange = () => {
      const updatedPreference = localStorage.getItem("notificationsEnabled");
      setIsNotificationAllowedByUser(updatedPreference === "true");
      if ("Notification" in window) {
        setBrowserNotificationPermission(Notification.permission);
      }
      const updatedTasks = localStorage.getItem("tasks");
      if (updatedTasks) {
        setTasks(JSON.parse(updatedTasks));
      }
      const updatedTaskSize = localStorage.getItem("taskSize");
      if (updatedTaskSize) {
        setTaskSize(updatedTaskSize);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleNotificationToggle = async (newValue) => {
    setIsNotificationAllowedByUser(newValue);
    localStorage.setItem("notificationsEnabled", newValue.toString());
    console.log(
      "Notificações (Preferência do Usuário):",
      newValue ? "Ativadas" : "Desativadas"
    );

    if (newValue) {
      // Se o usuário está ativando as notificações, solicita a permissão do navegador
      if ("Notification" in window) {
        const permission = await Notification.requestPermission();
        setBrowserNotificationPermission(permission);

        if (permission === "granted") {
          setNotificationStatusMessage(
            "Permissão de notificação concedida pelo navegador."
          );
        } else if (permission === "denied") {
          setNotificationStatusMessage(
            "Permissão de notificação negada pelo navegador. Por favor, ative nas configurações do seu navegador."
          );
        } else if (permission === "default") {
          setNotificationStatusMessage(
            "Permissão de notificação pendente ou bloqueada. Por favor, aceite a solicitação do navegador."
          );
        }
      }
    } else {
      setNotificationStatusMessage("Notificações desativadas pelo botão.");
    }
  };

  // Função para lidar com a mudança do tamanho da tarefa
  const handleTaskSizeChange = (event) => {
    const newSize = event.target.value;
    setTaskSize(newSize);
    localStorage.setItem("taskSize", newSize);
  };

  //Funções de notificação
  const sendNotification = (title, options = {}) => {
    if (Notification.permission === "granted") {
      new Notification(title, options);
    }
  };

  //Função para enviar notificações de tarefas urgentes e com prazo próximo
  const sendUrgentAndDueNotifications = () => {
    if (!isNotificationAllowedByUser) {
      setNotificationStatusMessage("Notificações desativadas pelo botão.");
      return;
    }

    if (!("Notification" in window)) {
      setNotificationStatusMessage(
        "Este navegador não suporta notificações de desktop."
      );
      return;
    }

    if (browserNotificationPermission !== "granted") {
      setNotificationStatusMessage(
        "Permissão de notificação não concedida pelo navegador."
      );
      return;
    }

    let notificationsSentCount = 0;
    const now = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 3);

    tasks.forEach((task) => {
      const dueDate = task.dueDate ? new Date(task.dueDate) : null;

      //Para tarefas com prioridade "urgente" que ainda não foram feitas
      if (task.priority === "urgente" && !task.completed) {
        sendNotification(`Tarefa Urgente: ${task.titulo}`, {
          body: "Esta tarefa tem prioridade urgente e ainda não foi concluída!",
          icon: pato,
          tag: `urgent-task-${task.id_tarefa}`,
          renotify: true,
        });
        notificationsSentCount++;
      }

      // Para tarefas com menos de 3 dias para o prazo final e que ainda não foram feitas
      if (
        !task.completed &&
        dueDate &&
        dueDate <= threeDaysFromNow &&
        dueDate >= now
      ) {
        const diffTime = Math.abs(dueDate.getTime() - now.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        sendNotification(
          `Prazo Próximo: ${task.titulo}`, //Alterado de task.title para task.titulo
          {
            body: `Faltam ${diffDays} dia(s) para o prazo final desta tarefa!`,
            icon: pato,
            tag: `due-task-${task.id_tarefa}`, // Alterado de task.id para task.id_tarefa
            renotify: true,
          }
        );
        notificationsSentCount++;
      }
    });

    if (notificationsSentCount > 0) {
      setNotificationStatusMessage(
        `Foram enviadas ${notificationsSentCount} notificações de tarefas.`
      );
    } else {
      setNotificationStatusMessage(
        "Nenhuma tarefa urgente ou com prazo próximo encontrada no momento."
      );
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen lg:w-[calc(100vw-320px)] justify-self-end items-center p-2 transition-all duration-300 text-[var(--text)]">
      <div className="font-semibold text-xl absolute top-24 left-5 lg:right-[calc(100vw-770px)] flex flew-col gap-4 justify-center items-center">
        <BackButton /> Voltar
      </div>
      <div className="flex flex-col justify-center text-center container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold bg-gradient-to-b from-[var(--primary)] to-[var(--secondary)] text-transparent bg-clip-text pb-4 mb-4 mt-18">
          Configurações
        </h1>
        <p className="text-lg mb-10 font-semibold">
          Opa! Vamos configurar seu JubiTasks! Vamos dar uma olhada em algumas
          alterações possíveis?
        </p>
        <div className="flex flex-col justify-center items-center">
          <Image
            src={patoConfig}
            className="h-auto w-40 mb-10 object-cover"
            alt="pato"
            priority
          />
        </div>

        <div className="flex flex-col items-center justify-center w-full gap-14 mb-14 bg-[var(--subbackground)] rounded-lg shadow-md p-2 py-4">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl font-semibold">Tema</span>
            </div>
            <div>
              <ThemeButton />
            </div>
          </div>

          <div className="w-full flex items-center justify-between">
            <span className="text-2xl font-semibold">Notificações</span>
            <NotificationSwitch
              checked={isNotificationAllowedByUser}
              onChange={handleNotificationToggle}
            />
          </div>
          {notificationStatusMessage && (
            <p className="font-semibold mt-4 text-sm text-[var(--text-secondary)]">
              {notificationStatusMessage}
            </p>
          )}
          <button
            onClick={sendUrgentAndDueNotifications}
            className="mt-6 py-2 px-4 rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
          >
            Mostrar minhas notificações
          </button>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <span className="text-2xl font-semibold">
                Tamanho das Tarefas
              </span>
            </div>
            <div className="relative">
              <select
                className="block appearance-none w-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white py-2 px-4 pr-8 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-opacity-50 transition-all duration-300 ease-in-out cursor-pointer"
                value={taskSize}
                onChange={handleTaskSizeChange}
              >
                <option value="small" className="text-black bg-white">
                  Pequeno
                </option>
                <option value="medium" className="text-black bg-white">
                  Médio
                </option>
                <option value="large" className="text-black bg-white">
                  Grande
                </option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
