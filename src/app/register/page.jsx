"use client";

import Image from "next/image";
import React, { useState } from "react";
import Input from "../../components/Input";
import PatoImg from "../../../public/assets/pato.png";
import Button from "../../components/Button";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { cadastrarUsuario } from "../../services/api";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";

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

    setIsLoading(true);
    try {
      await cadastrarUsuario({ name: name, email, senha: password });
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Cadastro realizado com sucesso!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Erro ao cadastrar. Tente novamente.");
      console.error("Erro no cadastro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center px-8">
      <h2 className="text-[32px] font-[700] text-center pt-[30px]">
        Organize suas tarefas com Jubitasks!
      </h2>
      <Image src={PatoImg} className="h-[347px] w-auto" alt="Pato" priority />

      <div className="flex flex-col items-center">
        <form onSubmit={handleFormSubmit} className="mb-6">
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
          <Input
            type="password"
            id="password"
            name="password"
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
              !isNameFilled || !isEmailFilled || !isPasswordFilled || isLoading
            }
          />
        </form>
      </div>
    </div>
  );
}
