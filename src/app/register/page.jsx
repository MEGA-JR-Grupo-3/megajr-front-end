"use client";

import Image from "next/image";
import React, { useState } from "react";
import Input from "../../components/Input";
import PatoImg from "../../../public/assets/splashPato.png";
import Button from "../../components/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { cadastrarUsuario } from "../../services/api";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import InputPassword from "../../components/InputPassword";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isEmailFilled, setIsEmailFilled] = useState(false);
  const [isPasswordFilled, setIsPasswordFilled] = useState(false);
  const [isNameFilled, setIsNameFilled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log("handleFormSubmit chamado");

    setIsLoading(true);
    console.log("isLoading:", isLoading);
    try {
      console.log("Chamando cadastrarUsuario com:", {
        name,
        email,
        senha: password,
      });
      const response = await cadastrarUsuario({
        name: name,
        email,
        senha: password,
      });

      if (response.status === 409) {
        toast.error(
          <div>
            Este e-mail já está cadastrado.
            <Button
              buttonText="Fazer Login"
              buttonLink="/login"
              buttonStyle="mt-[20px]"
            />
          </div>,
          {
            duration: 5000,
            position: "top-center",
            closeOnClick: true,
            draggable: true,
            pauseOnHover: true,
          }
        );
        return; // Interrompe o processo de cadastro
      }

      if (!response.ok) {
        toast.error("Erro ao cadastrar. Tente novamente.");
        return;
      }

      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Cadastro realizado com sucesso!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Erro ao cadastrar. Tente novamente.");
      console.error("Erro no cadastro:", error);
    } finally {
      setIsLoading(false);
      console.log("isLoading:", isLoading);
    }
  };

  return (
    <div className="flex flex-col items-center gap-24 justify-center px-8 min-h-screen">
      <h2 className="text-[32px] font-[700] text-center pt-[30px]">
        Organize suas tarefas com Jubitasks!
      </h2>
      <div className="flex flex-col lg:flex-row justify-center lg:gap-24">
        <Image
          src={PatoImg}
          className="h-[200px] w-auto object-contain"
          alt="Pato"
          priority
        />

        <div className="flex flex-col items-center lg:mr-15">
          <form onSubmit={handleFormSubmit}>
            <Input
              type="text"
              id="name"
              name="name"
              label="Nome"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setIsNameFilled(e.target.value.trim() !== "");
              }}
              placeholder="seu nome"
            />
            <Input
              type="email"
              id="email"
              name="email"
              label="E-mail"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setIsEmailFilled(e.target.value.trim() !== "");
              }}
              placeholder="seu@email.com"
            />
            <InputPassword
              id="password"
              label="Senha"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setIsPasswordFilled(e.target.value.trim() !== "");
              }}
              placeholder="sua senha"
            />

            <Button
              buttonText={isLoading ? "Enviando..." : "Cadastrar-se"}
              buttonStyle="mt-[20px]"
              onClick={handleFormSubmit}
              disabled={
                !isNameFilled ||
                !isEmailFilled ||
                !isPasswordFilled ||
                isLoading
              }
            />
          </form>
          <Link href="/login">
            <button className="mt-[20px] self-center underline text-[#676767]">
              login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
