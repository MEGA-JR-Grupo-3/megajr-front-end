"use client";

import Image from "next/image";
import React, { useState } from "react";
import Input from "../../components/Input";
import GoogleLoginButton from "../../components/ButtonGoogle";
import PatoImg from "../../../public/assets/pato.png";
import Button from "../../components/Button";
import { auth, googleAuthProvider } from "../../firebaseConfig";
import { useRouter } from "next/navigation";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailFilled, setIsEmailFilled] = useState(false);
  const [isPasswordFilled, setIsPasswordFilled] = useState(false);
  const router = useRouter(); // Inicialize o useRouter

  const handleFormSubmit = (event) => {
    event.preventDefault();
    console.log("Enviando formulário com:", { email, password });
    // Aqui você faria a lógica de autenticação tradicional com e-mail e senha
  };

  const handleGoogleLoginSuccess = (user) => {
    console.log("Login com Google Sucesso:", user);
    // Redireciona para o dashboard após o sucesso
    router.push("/dashboard");
    // Você pode querer fazer algo mais aqui, como salvar o usuário em um estado global
  };

  const handleGoogleLoginError = (error) => {
    console.error("Erro ao logar com Google:", error);
    // Aqui você exibiria uma mensagem de erro ao usuário
  };

  const loginGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider); // Use googleAuthProvider importado
      console.log("Usuário logado:", result.user);
      handleGoogleLoginSuccess(result.user); // Chama a função de sucesso e redireciona
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      handleGoogleLoginError(error); // Chama a função de erro
    }
  };

  return (
    <div className="flex flex-col items-center px-8">
      <h2 className="text-[32px] font-[700] text-center pt-[30px]">
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
          onClick={loginGoogle} // Chama a função de login do Google diretamente
          // As props onSuccess e onError agora são tratadas dentro de loginGoogle
        />
      </div>
    </div>
  );
}

export default Login;
