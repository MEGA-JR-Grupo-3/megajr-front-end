import React from "react";
import GoogleIcon from "../../public/assets/googleIcon.svg";
import Image from "next/image";
import Link from "next/link";
// Importações relacionadas à sua biblioteca de autenticação do Google
// Por exemplo: import { useGoogleLogin } from '@react-oauth/google';

function GoogleLoginButton({ onSuccess, onError, onClick }) {
  // Aqui você colocaria a lógica real para iniciar o login com Google
  // Usando a biblioteca de sua escolha.
  /*const handleGoogleLogin = () => {
    console.log("Iniciando login com Google...");
    // Simulação de um fluxo de login bem-sucedido após um tempo
    setTimeout(() => {
      const mockResponse = {
         ... dados do usuário do Google ... 
      };
      onSuccess(mockResponse);
    }, 1000);
    // Em um cenário real, você chamaria uma função da sua biblioteca de autenticação
    // que abriria a janela de login do Google.
  };*/

  return (
    <Link href="/dashboard">
      <button
        onClick={onClick}
        className="relative flex items-center justify-center bg-[radial-gradient(circle_at_center,var(--primary)_0%,var(--secondary)_70%)] rounded-4xl p-2 text-[#ffffff] font-[600] w-[312px]"
      >
        <Image className="absolute left-[10px]" src={GoogleIcon} alt="" />
        <span>Entre com sua conta Google</span>
      </button>
    </Link>
  );
}

export default GoogleLoginButton;
