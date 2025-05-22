"use client";
import "ldrs/react/LineSpinner.css";
import Logo from "../../../public/assets/splash-pato.png";
import Sidebar from "../../components/Sidebar";
import Image from "next/image";
import Button from "../../components/Button";
import ThemeSwitch2 from "../../components/ThemeSwitch2";
import NotificationSwitch from '../../components/NotificationSwitch';
import BackButton from "../../components/BackButton"

export default function settings() {

  const handleNotificationChange = (isEnabled) => {
    console.log('Notificações:', isEnabled ? 'Ativadas' : 'Desativadas');
  }

  return (
    <div className="flex flex-col h-screen w-screen lg:w-[calc(100vw-320px)] justify-self-end items-center p-2 transition-all duration-300 text-[var(--text)]">
      <nav className="w-full h-auto flex flex-row items-center justify-between pr-3">
        <Image
          src={Logo}
          className="lg:hidden h-14 w-auto"
          alt="Logo Jubileu"
          priority
        />
        <h2 className="lg:hidden text-2xl font-bold">Olá, parceiro</h2>
        <Sidebar />
      </nav>
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Configurações</h1>

        <div className="mb-14">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl font-semibold">Tema</span>
              </div>
              <div>
                <ThemeSwitch2/>
              </div>
            </div>
        </div>
        <div className="mb-14">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-semibold">Notificações</span>
                <NotificationSwitch initialValue={true} onChange={handleNotificationChange} />
              </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl font-semibold">Tamanho das Tarefas</span>
            </div>
            <select
              className="text-1xl shadow appearance-none border-none rounded w-auto py-2 px-3 text-white text-center bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] focus:outline-none focus:shadow-outline"
            >
              <option value="small" className="text-black text-center">Pequeno</option>
              <option value="medium" className="text-black text-center">Médio</option>
              <option value="large" className="text-black text-center">Grande</option>
            </select>
          </div>
        </div>
      </div>
      <div className="text-2xl flex flex-col items-center justify-end h-full mb-10">
        <Button buttonText="Voltar" buttonLink="/dashboard" />
      </div>
    </div>
  );
}
