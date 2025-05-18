import { useState, useEffect } from "react";
import Image from "next/image";

const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Simula um tempo de carregamento (você pode substituir por sua lógica real)
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1400);

    return () => clearTimeout(timer); // Limpa o timer caso o componente seja desmontado
  }, []);

  return (
    isVisible && (
      <div className="fixed top-0 left-0 w-full h-full bg-[var(--background)] flex justify-center items-center z-50 ">
        <div className="flex flex-col items-center justify-center text-4xl font-bold animate-[pulse_0.75s_ease-in-out_infinite] gap-14">
          <h2 className="text-[22px] font-[700] pt-[30px] text-[var(--text)]">
            JubiTasks
          </h2>
          <Image
            src="/assets/gif-pato.gif"
            alt="Logo"
            width={200}
            height={200}
          />
        </div>
      </div>
    )
  );
};

export default SplashScreen;
