import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simula um tempo de carregamento (você pode substituir por sua lógica real)
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000); // 2 segundos

    return () => clearTimeout(timer); // Limpa o timer caso o componente seja desmontado
  }, []);

  // Opcional: Adicionar uma transição suave para o desaparecimento
  const transitionStyles = isVisible
    ? { opacity: 1, visibility: 'visible', transition: 'opacity 0.5s ease-out, visibility 0.5s' }
    : { opacity: 0, visibility: 'hidden', transition: 'opacity 0.5s ease-out, visibility 0.5s' };

  return (
    isVisible && (
      <div
        className="fixed top-0 left-0 w-full h-full bg-indigo-600 flex justify-center items-center z-50"
        style={transitionStyles}
      >
        <div className="text-white text-4xl font-bold animate-pulse">
        <Image src="/splashPato.png" alt="Logo" width={200} height={200} />
        </div>
        <div className="absolute bottom-8 w-3/4 bg-indigo-200 h-2 rounded-full overflow-hidden">
          <div className="bg-white h-full animate-loading-bar"></div>
        </div>
      </div>
    )
  );
};

export default SplashScreen;
