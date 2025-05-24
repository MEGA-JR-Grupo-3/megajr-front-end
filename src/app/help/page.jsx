"use client";

import React, { useState } from 'react';
import BackButton from '../../components/BackButton'; // Assuming you have this component

export default function HelpPage() {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const faqItems = [
    {
      question: "Como faço para criar uma nova tarefa?",
      answer: "Para criar uma nova tarefa, vá para a tela inicial, clique no botão flutuante 'Adicionar Nova Tarefa' (geralmente um '+' no canto inferior direito) e preencha os detalhes como título, descrição e prazo."
    },
    {
      question: "Como ativo as notificações?",
      answer: "Você pode ativar as notificações na página de **Configurações**. Basta ir até a seção 'Notificações' e ligar o interruptor. O navegador pode pedir permissão, por favor, aceite para receber os alertas."
    },
    {
      question: "Posso alterar o tema do aplicativo?",
      answer: "Sim! Na página de **Configurações**, você encontrará a opção 'Tema'. Clique no botão para alternar entre os temas claro e escuro, ou outros temas disponíveis."
    },
    {
      question: "Onde minhas tarefas são salvas?",
      answer: "Suas tarefas são salvas localmente no seu navegador. Isso significa que elas são acessíveis mesmo offline e privadas para o seu dispositivo. Lembre-se que se você limpar os dados do navegador, suas tarefas podem ser perdidas."
    },
    {
      question: "Existe um limite para o número de tarefas?",
      answer: "Não há um limite estrito imposto pelo aplicativo, mas o desempenho pode variar dependendo da quantidade de tarefas e da capacidade do seu dispositivo."
    },
    {
      question: "Como entrar em contato com o suporte?",
      answer: "Atualmente, o suporte é feito através de nossa documentação e seções de ajuda. Se tiver uma dúvida específica que não encontrou aqui, por favor, verifique futuras atualizações para opções de contato direto."
    }
  ];

  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  return (
    <div className="flex flex-col h-screen w-screen lg:w-[calc(100vw-320px)] justify-self-end items-center p-2 transition-all duration-300 text-[var(--text)]">
      <div className="font-semibold text-xl absolute top-24 left-5 lg:right-[calc(100vw-770px)] flex flew-col gap-4 justify-center items-center">
        <BackButton /> Voltar
      </div>
      <div className="flex flex-col justify-center text-center container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold bg-gradient-to-b from-[var(--primary)] to-[var(--secondary)] text-transparent bg-clip-text pb-4 mb-4 mt-18">
          Central de Ajuda
        </h1>

        <p className="text-lg mb-8">
          Encontre respostas para as perguntas mais frequentes sobre como usar nosso aplicativo.
        </p>

        {/* --- */}

        <section className="mb-14 text-left">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-transparent bg-clip-text">
            Perguntas Frequentes (FAQ)
          </h2>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="bg-[var(--background-secondary)] rounded-lg shadow-md overflow-hidden"
              >
                <button
                  className="flex justify-between items-center w-full p-4 text-left focus:outline-none"
                  onClick={() => toggleQuestion(index)}
                >
                  <span className="font-semibold text-lg text-[var(--primary)]">
                    {item.question}
                  </span>
                  <span className={`text-xl transition-transform duration-300 ${activeQuestion === index ? 'rotate-90' : ''}`}>
                    ▶
                  </span>
                </button>
                {activeQuestion === index && (
                  <div className="p-4 pt-0 text-[var(--text-secondary)]">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* --- */}

        <section className="text-left mb-14">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-transparent bg-clip-text">
            Dicas Rápidas
          </h2>
          <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
            <li>Mantenha o aplicativo atualizado para as últimas funcionalidades.</li>
            <li>Use a função de pesquisa para encontrar tarefas rapidamente.</li>
            <li>Organize suas tarefas com prazos para melhor gestão.</li>
            <li>Explore as **Configurações** para personalizar sua experiência.</li>
          </ul>
        </section>

        {/* --- */}

        <section className="text-left">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-transparent bg-clip-text">
            Ainda Precisa de Ajuda?
          </h2>
          <p className="text-lg text-[var(--text-secondary)]">
            Se você não encontrou a resposta para sua pergunta, considere verificar a documentação completa do aplicativo (se disponível) ou aguarde futuras atualizações para mais opções de suporte.
          </p>
          {/* You can add a link to a contact form or email here if you set one up */}
          {/* <a href="mailto:support@example.com" className="mt-4 inline-block py-2 px-4 rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 ease-in-out">
            Enviar um E-mail
          </a> */}
        </section>
      </div>
    </div>
  );
}