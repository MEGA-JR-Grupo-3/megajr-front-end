"use client";

import React, { useState, useEffect } from "react";
import { auth } from "../../firebaseConfig";
import Image from "next/image";

// Componentes
import BackButton from "../../components/BackButton";
import NotificationSwitch from "../../components/NotificationSwitch";
import ThemeButton from "../../components/ThemeSwitch2";

// Imagens
import patoConfig from "../../../public/assets/pato-config.png";
import pato from "../../icon.png";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function SettingsPage() {
  const [tasks, setTasks] = useState([]);
  const [firebaseIdToken, setFirebaseIdToken] = useState(null);
  const [isNotificationAllowedByUser, setIsNotificationAllowedByUser] =
    useState(false);
  const [browserNotificationPermission, setBrowserNotificationPermission] =
    useState("default");
  const [notificationStatusMessage, setNotificationStatusMessage] =
    useState("");
  const [taskSize, setTaskSize] = useState("medium");

  // --- Efeito para Observar o Estado de Autenticação e Obter o Firebase ID Token ---
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        try {
          const idToken = await currentUser.getIdToken();
          setFirebaseIdToken(idToken);
        } catch (error) {
          console.error("Erro ao obter Firebase ID Token:", error);
          // Opcional: redirecionar ou mostrar erro para o usuário
        }
      } else {
        setFirebaseIdToken(null);
        setTasks([]); // Limpa as tarefas se o usuário deslogar
      }
    });
    return () => unsubscribe();
  }, []);

  // --- Efeito para Buscar Tarefas do Backend (quando o token estiver disponível) ---
  useEffect(() => {
    const fetchTasksForSettings = async () => {
      if (firebaseIdToken) {
        try {
          const response = await fetch(`${backendUrl}/tasks`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${firebaseIdToken}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setTasks(data); // Define as tarefas com os dados do backend
          } else {
            console.error(
              "Falha ao buscar tarefas para configurações:",
              response.status,
              await response.text()
            );
            // Opcional: mostrar uma mensagem de erro para o usuário
          }
        } catch (error) {
          console.error("Erro de rede ao buscar tarefas para configurações:", error);
          // Opcional: mostrar uma mensagem de erro de rede
        }
      }
    };

    fetchTasksForSettings();
    // A lista de dependências garante que a busca seja executada novamente se o token mudar
  }, [firebaseIdToken, backendUrl]); // Adicione backendUrl também por boa prática, embora raramente mude.

  // --- Efeito para Carregar Preferências do LocalStorage (exceto tarefas) ---
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

    // Listener para mudanças no localStorage (principalmente para notificações e taskSize)
    const handleStorageChange = (event) => {
      if (event.key === "notificationsEnabled") {
        setIsNotificationAllowedByUser(event.newValue === "true");
        if ("Notification" in window) {
            setBrowserNotificationPermission(Notification.permission);
        }
      } else if (event.key === "taskSize") {
        setTaskSize(event.newValue || "medium");
      }
      // Não precisamos mais do 'tasks' no localStorage aqui.
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []); // Este useEffect não precisa de dependências que causariam re-renderizações desnecessárias

  const handleNotificationToggle = async (newValue) => {
    setIsNotificationAllowedByUser(newValue);
    localStorage.setItem("notificationsEnabled", newValue.toString());
    console.log(
      "Notificações (Preferência do Usuário):",
      newValue ? "Ativadas" : "Desativadas"
    );

    if (newValue) {
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

  const handleTaskSizeChange = (event) => {
    const newSize = event.target.value;
    setTaskSize(newSize);
    localStorage.setItem("taskSize", newSize);
  };

  const sendNotification = (title, options = {}) => {
    // Agora 'tasks' no console.log deve ter os dados corretos
    // console.log({ tasks, now, threeDaysFromNow }); // Removi now/threeDaysFromNow daqui pois não estão definidos neste escopo
    if (Notification.permission === "granted") {
      new Notification(title, options);
    }
  };

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

    // Certifique-se de que a propriedade da data seja 'data_prazo' e não 'dueDate'
    // E que 'estado_tarefa' seja 'Finalizada' e não 'completed'
    // E 'prioridade' seja 'Urgente' e não 'priority'
    tasks.forEach((task) => {
      const dueDate = task.data_prazo ? new Date(task.data_prazo) : null;

      // Para tarefas com prioridade "Urgente" que ainda não foram feitas
      if (task.prioridade === "Urgente" && task.estado_tarefa !== "Finalizada") {
        sendNotification(`Tarefa Urgente: ${task.titulo}`, {
          body: "Esta tarefa tem prioridade urgente e ainda não foi concluída!",
          icon: pato.src, // Use .src para imagens estáticas importadas
          tag: `urgent-task-${task.id_tarefa}`,
          renotify: true,
        });
        notificationsSentCount++;
      }

      // Para tarefas com menos de 3 dias para o prazo final e que ainda não foram feitas
      if (
        task.estado_tarefa !== "Finalizada" &&
        dueDate &&
        dueDate <= threeDaysFromNow &&
        dueDate >= now
      ) {
        const diffTime = Math.abs(dueDate.getTime() - now.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        sendNotification(`Prazo Próximo: ${task.titulo}`, {
          body: `Faltam ${diffDays} dia(s) para o prazo final desta tarefa!`,
          icon: pato.src, // Use .src para imagens estáticas importadas
          tag: `due-task-${task.id_tarefa}`,
          renotify: true,
        });
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