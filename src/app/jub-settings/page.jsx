"use client";
import "ldrs/react/LineSpinner.css";
import Logo from "../../../public/assets/splash-pato.png";
import Sidebar from "../../components/Sidebar";
import Image from "next/image";
import Button from "../../components/Button";
import ThemeButton from "../../components/SwitchButton";
import ThemeSwitch from "../../components/ThemeSwitch";


function settings() {

  return (
    <div className="flex flex-col h-screen w-screen lg:w-[calc(100vw-320px)] justify-self-end items-center p-2 transition-all duration-300 text-[var(--text)]">
      <nav className="w-full h-auto flex flex-row items-center justify-between pr-3">
        <Image
          src={Logo}
          className="lg:hidden h-14 w-auto"
          alt="Logo Jubileu"
          priority
        />
        <h2 className="lg:hidden text-xl font-bold">Olá, parceiro</h2>
        <Sidebar />
      </nav>
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-8">Configurações</h1>

        <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="font-semibold">Tema</span>
              </div>
              <div className="h-full w-full">
                <ThemeButton/>
                <ThemeSwitch/>
              </div>
            </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="font-semibold">Notificações</span>
            </div>
            <div className="h-full w-full">
              <ThemeButton/>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="font-semibold">Tamanho das Tarefas</span>
            </div>
            <select className="shadow appearance-none border rounded w-auto py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option value="small">Pequeno</option>
              <option value="medium">Médio</option>
              <option value="large">Grande</option>
            </select>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-end h-full">
        <Button buttonText="Voltar" buttonLink="/dashboard" />
      </div>
    </div>
  );
}

export default settings;
