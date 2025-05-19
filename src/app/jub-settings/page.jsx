"use client";
import "ldrs/react/LineSpinner.css";
import Logo from "../../../public/assets/splash-pato.png";
import Image from "next/image";

function settings() {
  const registeredName = "NomeDoParceiro"; 
  const user = { displayName: "NomeDeExibicao" }; 

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
          Olá, {registeredName || user?.displayName || "parceiro(a)!"}{" "}
        </h2>
      </nav>
    </div>
  );
}

export default settings