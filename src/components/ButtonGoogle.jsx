"use client";

import React from "react";
import GoogleIcon from "../../public/assets/googleIcon.svg";
import Image from "next/image";
import { auth, googleAuthProvider, signInWithPopup } from "../firebaseConfig"; // Importe signInWithPopup
import { useRouter } from "next/navigation";

function GoogleLoginButton({ onSuccess, onError }) {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider); // Use signInWithPopup importado
      // O usuário fez login com sucesso
      console.log("Login com Google bem-sucedido:", result.user);
      if (onSuccess) {
        onSuccess(result.user);
      }
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao fazer login com o Google:", error);
      if (onError) {
        onError(error);
      }
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="relative flex items-center justify-center bg-[radial-gradient(circle_at_center,var(--primary)_0%,var(--secondary)_70%)] rounded-4xl p-2 text-[#ffffff] font-[600] w-[312px]"
    >
      <Image className="absolute left-[10px]" src={GoogleIcon} alt="" />
      <span>Entre com sua conta Google</span>
    </button>
  );
}

export default GoogleLoginButton;
