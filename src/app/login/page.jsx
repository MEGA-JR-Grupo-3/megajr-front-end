"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import Input from "../../components/Input";
import GoogleLoginButton from "../../components/ButtonGoogle";
import PatoImg from "../../../public/assets/pato.png";
import Button from "../../components/Button";
import { auth, googleAuthProvider } from "../../firebaseConfig";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailFilled, setIsEmailFilled] = useState(false);
  const [isPasswordFilled, setIsPasswordFilled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/dashboard");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log("Enviando formulário com:", { email, password });

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      if (user) {
        const token = await user.getIdToken();
        localStorage.setItem("authToken", token);
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Erro ao fazer login com e-mail/senha:", error);
    }
  };

  const handleGoogleLoginSuccess = async (user) => {
    console.log("Login com Google Sucesso:", user);
    if (user) {
      const token = await user.getIdToken();
      localStorage.setItem("authToken", token);
      router.push("/dashboard");
    }
  };

  const handleGoogleLoginError = (error) => {
    console.error("Erro ao logar com Google:", error);
    // Aqui você exibiria uma mensagem de erro ao usuário
  };

  const loginGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const user = result.user;
      console.log("Usuário logado:", result.user);
      handleGoogleLoginSuccess(result.user);
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
            onClick={handleFormSubmit}
            disabled={!isEmailFilled || !isPasswordFilled}
          />
        </form>
        <GoogleLoginButton
          onClick={loginGoogle} // Chama a função de login do Google diretamente
        />
      </div>
    </div>
  );
}

export default Login;
