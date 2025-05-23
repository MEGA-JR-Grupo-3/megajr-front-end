"use client";
import "ldrs/react/LineSpinner.css";
import ThemeSwitch2 from "../../components/ThemeSwitch2";
import NotificationSwitch from "../../components/NotificationSwitch";
import BackButton from "../../components/BackButton";

export default function settings() {
  const handleNotificationChange = (isEnabled) => {
    console.log("Notificações:", isEnabled ? "Ativadas" : "Desativadas");
  };

  return (
    <div className="flex flex-col h-screen w-screen lg:w-[calc(100vw-320px)] justify-self-end items-center p-2 transition-all duration-300 text-[var(--text)]">
      <div className="absolute top-24 left-5 lg:right-[calc(100vw-770px)] flex flew-col gap-4 justify-center items-center">
        <BackButton /> Voltar
      </div>
      <div className="flex flex-col justify-center text-center container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold bg-gradient-to-b from-[var(--primary)] to-[var(--secondary)] text-transparent bg-clip-text pb-4 mb-4 mt-18">
          Configurações
        </h1>

        <div className="mb-14">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-xl font-semibold">Tema</span>
            </div>
            <div>
              <ThemeSwitch2 />
            </div>
          </div>
        </div>
        <div className="mb-14">
          <div className="flex items-center justify-between">
            <span className="text-xl font-semibold">Notificações</span>
            <NotificationSwitch
              initialValue={true}
              onChange={handleNotificationChange}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-xl font-semibold">Tamanho das Tarefas</span>
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
