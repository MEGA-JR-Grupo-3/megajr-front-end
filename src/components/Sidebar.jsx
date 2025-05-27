import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faPencilAlt,
  faCog,
  faInfoCircle,
  faQuestionCircle,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useRouter } from "next/navigation";

// Variantes para animações do menu
const sidebarVariants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      duration: 0.3,
    },
  },
  closed: {
    x: "100%",
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      duration: 0.3,
    },
  },
};

const MenuHamburguer = ({ profilePicture }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [userName, setUserName] = useState(null);
  const [creationDate, setCreationDate] = useState(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(
    "/assets/default-avatar.png"
  );
  const menuRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserName(user.displayName || "Usuário Anônimo");
        setProfilePhotoUrl(user.photoURL || "/assets/default-avatar.png");
        const creationTime = user.metadata?.creationTime;
        if (creationTime) {
          const date = new Date(creationTime);
          const formattedDate = date.toLocaleDateString();
          setCreationDate(formattedDate);
        }
      } else {
        setUserName(null);
        setCreationDate(null);
        setProfilePhotoUrl("/assets/default-avatar.png");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isLargeScreen) {
      setIsOpen(true);
      return;
    }
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isLargeScreen]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        router.push("/");
        setIsOpen(false);
      })
      .catch((error) => {
        console.error("Erro ao fazer logout:", error);
      });
  };

  return (
    <div className="text-[#fff5ee]">
      {/* Botão do Menu Hamburguer */}
      <button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden text-[var(--primary)] hover:text-[#8b8b8b]  transition-colors cursor-pointer"
        aria-label="Abrir Menu"
      >
        <FontAwesomeIcon icon={faBars} size="2x" />
      </button>

      {/* Menu Lateral */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed top-0 right-0 lg:left-0 h-screen w-80 bg-background shadow-lg z-50 p-6 space-y-8 border-l border-gray-200 dark:border-gray-700 overflow-y-auto bg-[var(--sidebar)] overflow-hidden"
          >
            {/* Cabeçalho do Menu */}
            <div className="flex flex-row items-start justify-between mb-4">
              <div className="flex flex-row items-center justify-between gap-2">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-600 shadow-lg bg-white">
                  <img
                    src={profilePhotoUrl}
                    alt="Foto de Perfil"
                    className="w-[66px] h-[66px] object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  {userName && (
                    <h3 className="text-lg font-semiboldtext-white">
                      {userName}
                    </h3>
                  )}
                  {creationDate && (
                    <p className="text-sm text-gray-300">
                      Conta criada em: {creationDate}
                    </p>
                  )}
                </div>
              </div>
              <button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="lg:hidden text-gray-700 dark:text-gray-300 transition-colors"
                aria-label="Fechar Menu"
              >
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>
            </div>
            <div className="flex items-center justify-between ">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Menu
              </h2>
            </div>

            {/* Botões de Navegação */}
            <div className="space-y-6">
              <button
                variant="ghost"
                className="w-full justify-start text-start text-gray-700 dark:text-gray-300 hover:opacity-70 cursor-pointer"
                onClick={() => {
                  router.push("/edit-profile");
                  setIsOpen(false);
                }}
              >
                <FontAwesomeIcon icon={faPencilAlt} className="mr-2" />
                Editar Perfil
              </button>
              <button
                variant="ghost"
                className="w-full justify-start text-start text-gray-700 dark:text-gray-300 hover:opacity-70 cursor-pointer"
                onClick={() => {
                  router.push("/jub-settings");
                  setIsOpen(false);
                }}
              >
                <FontAwesomeIcon icon={faCog} className="mr-2" />
                Configurações
              </button>
              <button
                variant="ghost"
                className="w-full justify-start text-start text-gray-700 dark:text-gray-300 hover:opacity-70 cursor-pointer"
                onClick={() => {
                  router.push("/about-us");
                  setIsOpen(false);
                }}
              >
                <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                Sobre Nós
              </button>
              <button
                variant="ghost"
                className="w-full justify-start text-start text-gray-700 dark:text-gray-300 hover:opacity-70 cursor-pointer"
                onClick={() => {
                  router.push("/help");
                  setIsOpen(false);
                }}
              >
                <FontAwesomeIcon icon={faQuestionCircle} className="mr-2" />
                Central de Ajuda
              </button>
            </div>

            {/* Botão de Logout */}
            <div className="mt-auto">
              <button
                variant="ghost"
                className="w-full absolute bottom-[60px] text-start  text-gray-700 dark:text-gray-300 hover:opacity-70"
                onClick={handleLogout}
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                Sair
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuHamburguer;
