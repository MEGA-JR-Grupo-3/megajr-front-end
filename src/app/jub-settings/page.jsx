"use client";

import BackButton from "../../components/BackButton";
import NotificationSwitch from "../../components/NotificationSwitch";
import ThemeButton from "../../components/ThemeSwitch2";
import React, { useState, useEffect } from "react";

export default function SettingsPage() {
  const [isNotificationAllowedByUser, setIsNotificationAllowedByUser] =
    useState(false);
  const [browserNotificationPermission, setBrowserNotificationPermission] =
    useState("default");
  const [notificationStatusMessage, setNotificationStatusMessage] =
    useState("");

  useEffect(() => {
    const savedPreference = localStorage.getItem("notificationsEnabled");
    if (savedPreference !== null) {
      setIsNotificationAllowedByUser(savedPreference === "true");
    }

    if ("Notification" in window) {
      setBrowserNotificationPermission(Notification.permission);
    } else {
      setNotificationStatusMessage(
        "Este navegador não suporta notificações de desktop."
      );
    }

    const handleStorageChange = () => {
      const updatedPreference = localStorage.getItem("notificationsEnabled");
      setIsNotificationAllowedByUser(updatedPreference === "true");
      if ("Notification" in window) {
        setBrowserNotificationPermission(Notification.permission);
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
      "Notificações (User Preference):",
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
          showTestNotification();
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

  const showTestNotification = () => {
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

    if (browserNotificationPermission === "granted") {
      new Notification("Notificação de Teste!", {
        body: "Esta é uma notificação de exemplo do seu aplicativo.",
        icon: "https://placehold.co/64x64/3b82f6/ffffff?text=N",
        vibrate: [200, 100, 200],
      });
      setNotificationStatusMessage("Notificação de teste enviada!");
    } else if (browserNotificationPermission === "denied") {
      setNotificationStatusMessage(
        "Permissão de notificação bloqueada. Por favor, ative nas configurações do seu navegador."
      );
    } else if (browserNotificationPermission === "default") {
      setNotificationStatusMessage(
        "Permissão de notificação pendente. Ative no pop-up do navegador."
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
          {/* Display notification status */}
          {notificationStatusMessage && (
            <p className="mt-4 text-sm text-[var(--text-secondary)]">
              {notificationStatusMessage}
            </p>
          )}
          <button
            onClick={showTestNotification}
            className=" py-2 px-4 rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 ease-in-out max-w-60"
          >
            Testar Notificação
          </button>
        </div>

        <div className="bg-[var(--subbackground)] rounded-lg shadow-md p-2 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl font-semibold">
                Tamanho das Tarefas
              </span>
            </div>
            <select className="text-1xl shadow appearance-none border-none rounded w-auto py-2 px-3 text-white text-center bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] focus:outline-none focus:shadow-outline">
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
