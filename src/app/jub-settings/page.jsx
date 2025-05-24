"use client"
import BackButton from '../../components/BackButton';
import React, { useState, useEffect } from 'react';

// O componente NotificationSwitch que você forneceu, AGORA ACEITA A PROP 'onChange'
function NotificationSwitch({ onChange }) { // Adicionada a prop 'onChange'
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Carrega o estado salvo do localStorage quando o componente é montado
    const saved = localStorage.getItem("notificationsEnabled");
    if (saved !== null) {
      setEnabled(saved === "true"); // O localStorage salva como string, converte para booleano
    }
  }, []);

  // Esta função será chamada quando o checkbox for alterado
  const handleToggle = () => {
    const newValue = !enabled; // Inverte o valor atual
    setEnabled(newValue); // Atualiza o estado
    localStorage.setItem("notificationsEnabled", newValue.toString()); // Salva no localStorage como string
    console.log("Notificações:", newValue ? "Ativadas" : "Desativadas"); // Log para depuração

    // Chama a função onChange passada como prop, se ela existir
    if (onChange && typeof onChange === 'function') {
      onChange(newValue);
    }
  };

  return (
    <label
      className="group relative inline-flex cursor-pointer items-center justify-start"
    >
      <input
        className="peer sr-only"
        type="checkbox"
        checked={enabled} // Usando 'enabled' aqui
        onChange={handleToggle} // Chamando a função de toggle
      />
      <span
        className="mr-4 text-xl font-semibold tracking-wider text-[var(--primary)] transition-all duration-300 group-hover:text-[var(--primary)] peer-checked:text-[var(--primary)]"
      >
        {enabled ? "Permitir" : "Não permitir"}
      </span>
      <div
        className="relative h-6 w-12 rounded-full bg-[var(--primary)] shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] transition-all duration-500
                after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-[2px_2px_8px_rgba(0,0,0,0.3)] after:transition-all after:duration-500
                peer-checked:bg-gradient-to-r peer-checked:from-[var(--primary)] peer-checked:to-[var(--secondary)] peer-checked:after:translate-x-6 peer-checked:after:from-white peer-checked:after:to-[var(--primary)]
                hover:after:scale-95 active:after:scale-90"
      >
        <span
          className="absolute inset-0.5 rounded-full bg-gradient-to-tr from-white/20 via-transparent to-transparent"
        ></span>

        <span
          className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 peer-checked:animate-glow peer-checked:opacity-100 [box-shadow:0_0_15px_var(--primary)]"
        ></span>
      </div>
    </label>
  );
}
import ThemeButton from '../../components/ThemeSwitch2';

// Componente principal da sua aplicação (ex: App.js ou page.js no Next.js)
export default function App() {
  const [notificationStatus, setNotificationStatus] = useState('');
  const [isNotificationAllowed, setIsNotificationAllowed] = useState(false);

  useEffect(() => {
    // Função para verificar o estado atual das notificações no localStorage
    const checkNotificationPreference = () => {
      const saved = localStorage.getItem("notificationsEnabled");
      setIsNotificationAllowed(saved === "true");
    };

    // Verifica o estado inicial
    checkNotificationPreference();

    // Adiciona um listener para o evento 'storage' para reagir a mudanças em outras abas/janelas
    // ou para reagir a mudanças feitas pelo próprio NotificationSwitch se ele não for um filho direto
    window.addEventListener('storage', checkNotificationPreference);

    // Limpa o listener quando o componente é desmontado
    return () => {
      window.removeEventListener('storage', checkNotificationPreference);
    };
  }, []);

  // Função para solicitar permissão e mostrar uma notificação
  const showTestNotification = () => {
    // Primeiro, verifica se as notificações estão permitidas pelo usuário no localStorage
    const notificationsEnabledByToggle = localStorage.getItem("notificationsEnabled") === "true";

    if (!notificationsEnabledByToggle) {
      setNotificationStatus("Notificações desativadas pelo botão.");
      return;
    }

    // Verifica se a API de Notificações é suportada pelo navegador
    if (!("Notification" in window)) {
      setNotificationStatus("Este navegador não suporta notificações de desktop.");
      return;
    }

    // Solicita permissão se ainda não foi concedida ou negada
    if (Notification.permission === "default") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification("Notificação de Teste!", {
            body: "Esta é uma notificação de exemplo do seu aplicativo.",
            icon: "https://placehold.co/64x64/3b82f6/ffffff?text=N", // Ícone de exemplo
          });
          setNotificationStatus("Notificação de teste enviada!");
        } else {
          setNotificationStatus("Permissão de notificação negada pelo navegador.");
        }
      });
    } else if (Notification.permission === "granted") {
      // Se a permissão já foi concedida, pode enviar a notificação diretamente
      new Notification("Notificação de Teste!", {
        body: "Esta é uma notificação de exemplo do seu aplicativo.",
        icon: "https://placehold.co/64x64/3b82f6/ffffff?text=N", // Ícone de exemplo
      });
      setNotificationStatus("Notificação de teste enviada!");
    } else {
      // Se a permissão foi negada (e não é 'default'), o usuário precisa reativar manualmente nas configurações do navegador
      setNotificationStatus("Permissão de notificação bloqueada. Por favor, ative nas configurações do seu navegador.");
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
            <NotificationSwitch />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl font-semibold">Tamanho das Tarefas</span>
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
  );}
