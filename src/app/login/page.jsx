"use client";

import Image from "next/image";
import React, { useState } from "react";
import Input from "../../components/Input";
import GoogleLoginButton from "../../components/ButtonGoogle";
import PatoImg from "../../../public/assets/pato.png";
import Button from "../../components/Button";
import { auth } from "../../firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

function page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailFilled, setIsEmailFilled] = useState(false);
  const [isPasswordFilled, setIsPasswordFilled] = useState(false);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    console.log("Enviando formulário com:", { email, password });
    // Aqui você faria a lógica de autenticação tradicional
  };

  const handleGoogleLoginSuccess = (credentialResponse) => {
    console.log("Login com Google Sucesso:", credentialResponse);
    // Aqui você enviaria o token do Google para o seu backend para autenticação
  };

  const handleGoogleLoginError = () => {
    console.error("Erro ao logar com Google");
    // Aqui você exibiria uma mensagem de erro ao usuário
  };
  ("use client");

  const loginGoogle = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Usuário logdo:", result.user);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  return (
    <div className="flex flex-col items-center px-8">
      <h2 className="text-[32px] font-[700] text-center pt-[58px]">
        Jubileu está esperando sua próxima tarefa!
      </h2>
      <Image src={PatoImg} className="h-[347px] w-auto" alt="Pato" priority />

      <div className="flex flex-col items-center">
        <form onSubmit={handleFormSubmit} className="mb-6">
          <Input
            type="email"
            id="email"
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
            label="Senha"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setIsPasswordFilled(e.target.value.trim() !== "");
            }}
            placeholder="sua senha"
          />
          <Button
            buttonText="Entrar"
            buttonStyle="mt-[20px]"
            buttonLink={
              isEmailFilled && isPasswordFilled ? "/dashboard" : undefined
            }
            disabled={!isEmailFilled || !isPasswordFilled}
          />
        </form>
        <GoogleLoginButton
          onClick={loginGoogle}
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginError}
        />
      </div>
    </div>
  );
}

export default page;
