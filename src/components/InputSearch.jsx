import React, { useState, useCallback } from "react";

function InputSearch({ tarefas, onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = useCallback(() => {
    const resultadosFiltrados = tarefas.filter((tarefa) =>
      tarefa.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    onSearch(resultadosFiltrados);
  }, [searchTerm, tarefas, onSearch]);

  const handleClearClick = () => {
    setSearchTerm("");
    onSearch(tarefas); // Exibe todas as tarefas novamente
  };

  return (
    <div className="relative flex items-center justify-center">
      <input
        type="text"
        placeholder="Pesquisar tarefas..."
        value={searchTerm}
        onChange={handleInputChange}
        className="bg-[#D9D9D9] w-[320px] px-4 py-2 border rounded-3xl mt-5 focus:outline-none focus:ring focus:var(--primary) pr-10" // Espaço para os ícones
      />
      <div className="absolute right-10 top-[40px] transform -translate-y-1/2 flex items-center space-x-2">
        {searchTerm && (
          <button
            onClick={handleClearClick}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
        <button
          onClick={handleSearchClick}
          className="text-var(--secondary) hover:text-var(--primary) focus:outline-none"
        >
          <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default InputSearch;
