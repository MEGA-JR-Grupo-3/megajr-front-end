"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import Input from "../../components/Input";
import InputPassword from "../../components/InputPassword";
import GoogleLoginButton from "../../components/ButtonGoogle";
import PatoImg from "../../../public/assets/pato.png";
import Button from "../../components/Button";
import { auth, googleAuthProvider } from "../../firebaseConfig";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import Link from "next/link";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailFilled, setIsEmailFilled] = useState(false);
  const [isPasswordFilled, setIsPasswordFilled] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Novo estado para a mensagem de erro
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/dashboard");
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Função para verificar se o usuário já existe no banco de dados
  const checkIfUserExists = async (email) => {
    try {
      const response = await fetch(
        `http://localhost:8800/check-user?email=${email}`
      );
      const data = await response.json();
      return data.exists; // Retorna o valor da propriedade 'exists' do JSON
    } catch (error) {
      console.error("Erro ao verificar usuário:", error);
      return false; // Em caso de erro na requisição, considera que o usuário não existe
    }
  };

  // Função para fazer o login com e-mail e senha
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(""); // Limpa qualquer mensagem de erro anterior

    try {
      // Verificar se o usuário existe no banco de dados
      const userExists = await checkIfUserExists(email);
      if (!userExists) {
        console.log("Usuário não encontrado:", email);
        setErrorMessage("Erro ao fazer login. Usuário não encontrado.");
        return; // Interrompe a tentativa de login
      }

      // Se o usuário existir, continua com o login
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
      setErrorMessage("Erro ao fazer login. Verifique seu e-mail e senha.");
    }
  };

  const handleGoogleLoginSuccess = async (user) => {
    console.log("Login com Google Sucesso:", user);
    if (user) {
      const token = await user.getIdToken();
      localStorage.setItem("authToken", token);

      // Pegando os dados do usuário (nome e e-mail)
      const userName = user.displayName;
      const userEmail = user.email;

      // Enviar esses dados para o backend para salvar/verificar no banco de dados
      try {
        const response = await fetch("/cadastro-google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: userName,
            email: userEmail,
          }),
        });

        if (response.ok) {
          console.log("Dados do usuário do Google enviados ao backend");

          // Verifica se já tem o provedor 'password' vinculado
          const providers = user.providerData.map((p) => p.providerId);
          const hasPasswordProvider = providers.includes("password");
          console.log("Provedores:", providers); // Adicione este log
          console.log("hasPasswordProvider:", hasPasswordProvider); // Adicione este log

          if (!hasPasswordProvider) {
            console.log("Não tem provedor de senha, exibindo prompt..."); // Adicione este log
            const password = prompt(
              "Para maior segurança, crie uma senha para sua conta (será usada para logins futuros com e-mail/senha):"
            );
            // ... (o restante do seu código)
          } else {
            console.log("Usuário já tem login por senha vinculado.");
            router.push("/dashboard");
          }
        } else {
          console.error("Erro ao comunicar dados do Google com o backend");
          router.push("/dashboard");
        }
      } catch (error) {
        console.error(
          "Erro ao fazer requisição para cadastro/verificação do Google:",
          error
        );
        router.push("/dashboard");
      }
    }
  };

  const loginGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const user = result.user;
      console.log("Usuário logado:", result.user);
      handleGoogleLoginSuccess(result.user);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
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
            buttonText="Entrar"
            buttonStyle="mt-[20px]"
            type="submit"
            disabled={!isEmailFilled || !isPasswordFilled}
          />
        </form>
        <GoogleLoginButton onClick={loginGoogle} />
        <Link href="/register">
          <button className="mt-[20px] self-center underline text-[#676767]">
            cadastrar-se
          </button>
        </Link>
      </div>

      {/* Renderização condicional da mensagem de erro */}
      {errorMessage && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
          <div className="h-[200px] w-[340px] bg-zinc-900 rounded-2xl border border-[#ffffff] p-4 flex flex-col justify-center text-center text-red-600">
            <h3>{errorMessage}</h3>
            <Button
              buttonText="Fechar"
              buttonStyle="mt-[20px] self-center"
              onClick={() => setErrorMessage("")}
            />
            <Link href="/register">
              <button className="mt-[20px] self-center underline text-[#676767]">
                cadastrar-se
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
