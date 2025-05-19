"use client";
import "ldrs/react/LineSpinner.css";
import Logo from "../../../public/assets/splash-pato.png";
import Sidebar from "../../components/Sidebar";
import Button from "../../components/Button";
import Image from "next/image";

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
        <h2 className="lg:hidden text-xl font-bold">Olá, parceiro(a)</h2>
        <Sidebar />
      </nav>
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-8">Configurações</h1>

        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="font-semibold">Tema</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 dark:bg-gray-700 rounded-full peer dark:peer-checked:bg-purple-600 transition-all duration-300"></div>
            </label>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="font-semibold">Notificações</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 dark:bg-gray-700 rounded-full peer dark:peer-checked:bg-purple-600 transition-all duration-300"></div>
              <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
            </label>
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
      <div className="flex flex-col items-center justify-center w-screen">
        <Button buttonText="Voltar" buttonLink="/dashboard" />
      </div>
    </div>
  );
}

export default settings;
