"use client";
import "ldrs/react/LineSpinner.css";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import patoDiferente from "../../../public/assets/pato-diferente.png";
import BackButton from "../../components/BackButton";
import enzoImg from "../../../public/assets/enzo.png";
import jeanImg from "../../../public/assets/jean.png";
import jonImg from "../../../public/assets/jon.png";
import nicolasImg from "../../../public/assets/nicolas.png"
import laraImg from "../../../public/assets/lara.png"
const originalTeamMembers = [
  {
    name: "Edilson Enzo",
    role: "Front-end Developer",
    image: enzoImg,
  },
  {
    name: "Nicolas",
    role: "Designer Developer",
    image: nicolasImg,
  },
  {
    name: "Jean Flávio",
    role: "Front-end developer",
    image: jeanImg,
  },
  {
    name: "Lara Eridan",
    role: "Back-end Developer",
    image: laraImg,
  },
  {
    name: "Jonathan Amaral",
    role: "Mobile Developer",
    image: jonImg,
  },
];

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function about() {
  const [page, setPage] = useState(0);
  const [teamMembers] = useState(() => shuffleArray(originalTeamMembers));
  const totalPages = Math.ceil(teamMembers.length / 3);
  const paginate = (direction) => {
    setPage((prev) => {
      const newPage = prev + direction;
      return Math.max(0, Math.min(newPage, totalPages - 1));
    });
  };

  const currentMembers = teamMembers.slice(page * 3, page * 3 + 3);

  return (
    <div className="flex flex-col min-h-screen w-screen lg:w-[calc(100vw-320px)] justify-self-end items-center p-8 transition-all duration-300 [var(--subText)]">
      <div className="absolute top-24 left-5 lg:right-[calc(100vw-770px)] flex flew-col gap-4 justify-center items-center">
        <BackButton /> Voltar
      </div>

      <section className="flex flex-col justfy-center items-center text-center max-w-4xl">
        <h1 className="text-3xl font-extrabold bg-gradient-to-b from-[var(--primary)] to-[var(--secondary)] text-transparent bg-clip-text pb-4  mt-18">
          Sobre nós
        </h1>
        <h2 className="text-xl font-semibold mb-10">
          O que acontece quando 6 programadores, motivados pelo Mega P.S., se
          juntam para encarar esse desafio?
        </h2>
        <Image
          src={patoDiferente}
          className="h-auto w-40 mb-10 object-cover"
          alt="pato"
          priority
        />
      </section>

      <section className="max-w-5xl w-full p-6 bg-[var(--subbackground)] /70 backdrop-blur rounded-xl shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => paginate(-1)}
            disabled={page === 0}
            className="disabled:opacity-30 [var(--subText)] hover:text-black transition"
          >
            <ArrowLeft size={32} />
          </button>
          <h2 className="text-3xl font-bold text-center flex-1 text-[var(--text)]">
            Nome da equipe
          </h2>
          <button
            onClick={() => paginate(1)}
            disabled={page >= totalPages - 1}
            className="disabled:opacity-30 [var(--subText)] hover:text-black transition"
          >
            <ArrowRight size={32} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <AnimatePresence initial={false} mode="wait">
            {currentMembers.map((member) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl transition-shadow"
              >
                <div className="w-36 h-36 rounded-full p-1 mx-auto mb-6 bg-gradient-to-b from-[var(--primary)] to-[var(--secondary)]">
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={128}
                      height={128}
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-gray-600">{member.role}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      <section className="max-w-4xl w-full mb-16 mt-16 bg-[var(--subbackground)] backdrop-blur rounded-xl p-6 shadow-md space-y-6 ">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-[var(--secondary)] mb-2">
            📌 Descrição do Projeto
          </h3>
          <p className="text-[var(--text)]"></p>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-[var(--secondary)] mb-2">
            🎯 Desafio
          </h3>
          <p className="text-[var(--text)]">
            [Explicar o projeto de forma geral e como entendemos que deveria ser
            feito]
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-[var(--secondary)] mb-2">
            🛠️ Processo
          </h3>
          <p className="text-[var(--text)]">
            [Conte como foi a organização, ferramentas usadas, etc]
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-[var(--secondary)] mb-2">
            📚 Aprendizados e desafios individuais
          </h3>
          <p className="text-[var(--text)]">
            [Relatar o quanto cada um de nós evoluímos]
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-[var(--secondary)] mb-2">
            🙏 Agradecimento
          </h3>
          <p className="text-[var(--text)] ">[Gratiluz]</p>
        </div>
      </section>
      <div className="text-2xl flex flex-col items-center justify-end h-full mb-10">
        <button buttonText="Voltar" buttonLink="/dashboard" />
      </div>
    </div>
  );
}
