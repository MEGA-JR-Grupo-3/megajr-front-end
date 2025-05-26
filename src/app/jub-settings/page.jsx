"use client";

import BackButton from '../../components/BackButton';
import NotificationSwitch from '../../components/NotificationSwitch';
import ThemeButton from '../../components/ThemeSwitch2';
import React, { useState, useEffect } from 'react';
import pato from '../../../public/assets/pato.png'

export default function SettingsPage() {
  const [isNotificationAllowedByUser, setIsNotificationAllowedByUser] = useState(false);
  const [browserNotificationPermission, setBrowserNotificationPermission] = useState('default');
  const [notificationStatusMessage, setNotificationStatusMessage] = useState('');
  const [tasks, setTasks] = useState([]);
  const [taskSize, setTaskSize] = useState('medium'); // Novo estado para o tamanho da tarefa

  useEffect(() => {
    // Carrega do localStorage as preferências do usuário para notificações
    const savedPreference = localStorage.getItem("notificationsEnabled");
    if (savedPreference !== null) {
      setIsNotificationAllowedByUser(savedPreference === "true");
    }

    // Carrega do localStorage a preferência do usuário para o tamanho da tarefa
    const savedTaskSize = localStorage.getItem("taskSize");
    if (savedTaskSize !== null) {
      setTaskSize(savedTaskSize);
    }


    // Verifica se o navegador tem permissão para enviar notificações
    if ("Notification" in window) {
      setBrowserNotificationPermission(Notification.permission);
    } else {
      setNotificationStatusMessage("Este navegador não suporta notificações de desktop.");
    }

    // Carrega as tarefas (EXEMPLO: Supondo que você as tenha no localStorage como JSON)
    const storedTasks = localStorage.getItem("tasks"); // Adapte isso à sua forma de salvar tarefas
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }


    // Adiciona um listener para o evento 'storage' para reagir a mudanças em outras abas/janelas
    const handleStorageChange = () => {
      const updatedPreference = localStorage.getItem("notificationsEnabled");
      setIsNotificationAllowedByUser(updatedPreference === "true");
      if ("Notification" in window) {
        setBrowserNotificationPermission(Notification.permission);
      }
      // Atualiza as tarefas também se elas mudarem em outra aba
      const updatedTasks = localStorage.getItem("tasks");
      if (updatedTasks) {
        setTasks(JSON.parse(updatedTasks));
      }
      // Atualiza o tamanho da tarefa
      const updatedTaskSize = localStorage.getItem("taskSize");
      if (updatedTaskSize) {
        setTaskSize(updatedTaskSize);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Função para lidar com a mudança do botão de alternância (toggle) do NotificationSwitch
  const handleNotificationToggle = async (newValue) => {
    setIsNotificationAllowedByUser(newValue);
    localStorage.setItem("notificationsEnabled", newValue.toString());
    console.log("Notificações (Preferência do Usuário):", newValue ? "Ativadas" : "Desativadas");

    if (newValue) {
      // Se o usuário está ativando as notificações, solicita a permissão do navegador
      if ("Notification" in window) {
        const permission = await Notification.requestPermission();
        setBrowserNotificationPermission(permission);

        if (permission === "granted") {
          setNotificationStatusMessage("Permissão de notificação concedida pelo navegador.");
        } else if (permission === "denied") {
          setNotificationStatusMessage("Permissão de notificação negada pelo navegador. Por favor, ative nas configurações do seu navegador.");
        } else if (permission === "default") {
          setNotificationStatusMessage("Permissão de notificação pendente ou bloqueada. Por favor, aceite a solicitação do navegador.");
        }
      }
    } else {
      //Se o usuário está desativando as notificações, limpa o status
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
      setNotificationStatusMessage("Este navegador não suporta notificações de desktop.");
      return;
    }

    if (browserNotificationPermission !== "granted") {
      setNotificationStatusMessage("Permissão de notificação não concedida pelo navegador.");
      return;
    }

    let notificationsSentCount = 0;
    const now = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 3);

    tasks.forEach(task => {

      const dueDate = task.dueDate ? new Date(task.dueDate) : null;

      //Para tarefas com prioridade "urgente" que ainda não foram feitas
      if (task.priority === 'urgente' && !task.completed) {
        sendNotification(
          `Tarefa Urgente: ${task.titulo}`, //Alterado de task.title para task.titulo
          {
            body: "Esta tarefa tem prioridade urgente e ainda não foi concluída!",
            icon: pato,
            tag: `urgent-task-${task.id_tarefa}`,// Alterado de task.id para task.id_tarefa
            renotify: true
          }
        );
        notificationsSentCount++;
      }

      // Para tarefas com menos de 3 dias para o prazo final e que ainda não foram feitas
      if (!task.completed && dueDate && dueDate <= threeDaysFromNow && dueDate >= now) {
        const diffTime = Math.abs(dueDate.getTime() - now.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        sendNotification(
          `Prazo Próximo: ${task.titulo}`, //Alterado de task.title para task.titulo
          {
            body: `Faltam ${diffDays} dia(s) para o prazo final desta tarefa!`,
            icon: pato,
            tag: `due-task-${task.id_tarefa}`,// Alterado de task.id para task.id_tarefa
            renotify: true
          }
        );
        notificationsSentCount++;
      }
    });

    if (notificationsSentCount > 0) {
      setNotificationStatusMessage(`Foram enviadas ${notificationsSentCount} notificações de tarefas.`);
    } else {
      setNotificationStatusMessage("Nenhuma tarefa urgente ou com prazo próximo encontrada no momento.");
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

        <div className="mb-14">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl font-semibold">Tema</span>
            </div>
            <div>
              <ThemeButton />
            </div>
          </div>
        </div>
        <div className="mb-14">
          <div className="flex items-center justify-between">
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
        </div>


        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl font-semibold">Tamanho das Tarefas</span>
            </div>
            <select
              className="text-1xl shadow appearance-none border-none rounded w-auto py-2 px-3 text-white text-center bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] focus:outline-none focus:shadow-outline"
              value={taskSize} 
              onChange={handleTaskSizeChange}
            >
              <option value="small" className="text-black text-center">
                Pequeno
              </option>
              <option value="medium" className="text-black text-center">
                Médio
              </option>
              <option value="large" className="text-black text-center">
                Grande
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}