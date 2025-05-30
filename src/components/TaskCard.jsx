// Importa o React e hooks específicos (useState, useCallback, useMemo)
import React, { useState, useCallback, useMemo } from "react";
// Importa hooks e utilitários da biblioteca `@dnd-kit/sortable` para funcionalidade de arrastar e soltar.
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
// Importa ícones específicos do pacote `react-icons/md` para uso visual.
import {
  MdOutlineDragIndicator, // Ícone de arrastar
  MdExpandMore, // Ícone para expandir
  MdExpandLess, // Ícone para recolher
  MdDeleteOutline, // Ícone para deletar
} from "react-icons/md";
// Função `getPriorityColor` determina as classes de cor e texto do Tailwind CSS
// com base na prioridade da tarefa.
const getPriorityColor = (priority) => {
  switch (priority) {
    case "Urgente":
      return "bg-red-500 text-white"; // Vermelho para urgente
    case "Alta":
      return "bg-orange-500 text-white"; // Laranja para alta
    case "Normal":
      return "bg-green-300 text-gray-800"; // Verde claro para normal
    case "Baixa":
      return "bg-blue-400 text-white"; // Azul para baixa
    default:
      return "bg-gray-200 text-gray-700"; // Cinza padrão
  }
};

// Função `getDueDateStatus` calcula o status da data de prazo de uma tarefa
// e retorna um objeto com texto e classes de estilo.
const getDueDateStatus = (dueDate) => {
  // Se não houver data de prazo, retorna "Indefinido".
  if (!dueDate)
    return { text: "Indefinido", className: "text-gray-400 bg-gray-100" };

  // Cria objetos de data para hoje e para a data de prazo da tarefa,
  // zerando as horas para comparação apenas pela data.
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const taskDueDate = new Date(dueDate);
  taskDueDate.setHours(0, 0, 0, 0);

  // Calcula a diferença em dias entre as datas.
  const oneDay = 24 * 60 * 60 * 1000; // Milissegundos em um dia
  const daysDifference = Math.round(
    (taskDueDate.getTime() - today.getTime()) / oneDay
  );

  // Retorna o status e classes de estilo com base na diferença de dias.
  if (daysDifference < 0)
    return {
      text: `Atrasada (${taskDueDate.toLocaleDateString("pt-BR")})`, // Tarefa atrasada
      className: "bg-red-200 text-red-700 font-semibold",
    };
  if (daysDifference <= 3)
    return {
      text: `Próxima (${taskDueDate.toLocaleDateString("pt-BR")})`, // Prazo próximo (até 3 dias)
      className: "bg-yellow-200 text-yellow-700",
    };
  return {
    text: `Prazo: ${taskDueDate.toLocaleDateString("pt-BR")}`, // Prazo futuro
    className: "bg-green-100 text-green-700",
  };
};

// --- Componente Principal TaskCardComponent --------------------------------

// `TaskCardComponent` é o componente React para exibir e interagir com uma tarefa individual.
// Ele recebe várias props para exibir dados da tarefa e lidar com ações.
function TaskCardComponent({
  tarefa, // Objeto da tarefa a ser exibida
  onTaskDeleted, // Função de callback para quando uma tarefa é deletada
  onTaskUpdated, // Função de callback para quando uma tarefa é atualizada
  isDraggable, // Booleano que indica se a tarefa pode ser arrastada
  id, // ID único da tarefa, usado para dnd-kit
  firebaseIdToken, // Token de autenticação do Firebase para requisições API
  taskSize, // Tamanho da exibição da tarefa ('small', 'medium', 'large')
}) {
  // Estados para controlar o loading e o UI da tarefa.
  const [isDeleting, setIsDeleting] = useState(false); // Indica se a tarefa está sendo deletada
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false); // Indica se o status está sendo atualizado
  const [isSavingEdit, setIsSavingEdit] = useState(false); // Indica se as edições estão sendo salvas
  const [isExpanded, setIsExpanded] = useState(false); // Controla a expansão do card para mostrar mais detalhes
  const [isEditing, setIsEditing] = useState(false); // Controla o modo de edição do card

  // URL do backend obtida das variáveis de ambiente.
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // `initialFormData` é um objeto memoizado que armazena os dados originais da tarefa,
  // usado para resetar o formulário de edição ou iniciar a edição.
  const initialFormData = useMemo(
    () => ({
      titulo: tarefa.titulo,
      descricao: tarefa.descricao || "", // Garante que seja string vazia se nulo
      data_prazo: tarefa.data_prazo
        ? new Date(tarefa.data_prazo).toISOString().split("T")[0] // Formata a data para input HTML
        : "",
      prioridade: tarefa.prioridade,
    }),
    [tarefa.titulo, tarefa.descricao, tarefa.data_prazo, tarefa.prioridade]
  );

  // `editFormData` é o estado que armazena os dados do formulário de edição,
  // inicializado com os dados da tarefa.
  const [editFormData, setEditFormData] = useState(initialFormData);

  // Hook `useSortable` para habilitar a funcionalidade de arrastar e soltar.
  // Retorna `attributes` (para acessibilidade), `listeners` (para eventos de arrastar),
  // `setNodeRef` (para o elemento arrastável), `transform` (para a posição),
  // `transition` (para animação) e `isDragging` (para estado de arrasto).
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  // `style` é um objeto de estilo memoizado para aplicar transformações CSS
  // durante o arrasto, como transição, opacidade e sombra.
  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform), // Aplica a transformação de arrasto
      transition, // Aplica a transição de arrasto
      opacity: isDragging ? 0.8 : 1, // Reduz a opacidade ao arrastar
      boxShadow: isDragging ? "0px 4px 10px rgba(0, 0, 0, 0.2)" : "none", // Adiciona sombra ao arrastar
    }),
    [transform, transition, isDragging]
  );

  // --- Funções para aplicar classes de tamanho (memoizadas com useCallback) ---
  // Essas funções retornam classes Tailwind CSS dinamicamente com base na prop `taskSize`.

  const getCardSizeClasses = useCallback(() => {
    switch (taskSize) {
      case "small":
        return "w-[235px] min-h-[120px] p-3"; // Menor largura e altura mínima, menos padding
      case "medium":
      default:
        return "w-[335px] sm:w-[340px] xl:w-[300px] min-h-[100px] p-4"; // Padrão
      case "large":
        return "w-[400px] min-h-[220px] p-6"; // Maior largura e altura mínima, mais padding
    }
  }, [taskSize]);

  const getTitleSizeClasses = useCallback(() => {
    switch (taskSize) {
      case "small":
        return "text-base"; // Título menor
      case "large":
        return "text-2xl"; // Título maior
      case "medium":
      default:
        return "text-lg"; // Título padrão
    }
  }, [taskSize]);

  const getDescriptionSizeClasses = useCallback(() => {
    switch (taskSize) {
      case "small":
        return "text-xs"; // Descrição menor
      case "large":
        return "text-base"; // Descrição maior
      case "medium":
      default:
        return "text-sm"; // Descrição padrão
    }
  }, [taskSize]);

  const getDatePrioritySizeClasses = useCallback(() => {
    switch (taskSize) {
      case "small":
        return "text-xs px-1.5 py-0.5"; // Texto menor, padding menor
      case "large":
        return "text-base px-3 py-1.5"; // Texto maior, padding maior
      case "medium":
      default:
        return "text-xs px-2 py-1"; // Padrão
    }
  }, [taskSize]);

  // --- Fim das funções para aplicar classes de tamanho ---

  // `makeApiRequest` é uma função genérica e memoizada para fazer requisições à API.
  // Ela lida com autenticação, estados de loading, sucesso e erro.
  const makeApiRequest = useCallback(
    async (
      endpoint, // URL do endpoint da API
      method, // Método HTTP (GET, POST, PUT, DELETE)
      body, // Corpo da requisição (para POST/PUT)
      successCallback, // Callback a ser executado em caso de sucesso
      errorMsgPrefix, // Prefixo para mensagens de erro
      setLoadingState // Função para atualizar o estado de loading
    ) => {
      // Verifica se o token Firebase ID está disponível.
      if (!firebaseIdToken) {
        console.error(
          "Firebase ID Token não disponível. Não é possível completar a ação."
        );
        alert("Sessão expirada ou não autenticada. Faça login novamente.");
        return false; // Indica falha
      }

      setLoadingState(true); // Ativa o estado de loading
      try {
        // Faz a requisição fetch.
        const response = await fetch(`${backendUrl}${endpoint}`, {
          method, // Método HTTP
          headers: {
            "Content-Type": "application/json", // Tipo de conteúdo
            Authorization: `Bearer ${firebaseIdToken}`, // Token de autorização
          },
          body: body ? JSON.stringify(body) : undefined, // Converte o corpo para JSON se existir
        });

        // Se a resposta for OK (status 2xx).
        if (response.ok) {
          // Analisa a resposta JSON, ou retorna um objeto vazio para DELETE/204.
          const responseData =
            method === "DELETE" || response.status === 204
              ? {}
              : await response.json().catch(() => ({}));
          successCallback(responseData); // Chama o callback de sucesso
          return true; // Indica sucesso
        } else {
          // Lida com erros da API.
          const errorData = await response
            .json()
            .catch(() => ({ message: response.statusText }));
          console.error(`${errorMsgPrefix}:`, errorData);
          alert(
            `${errorMsgPrefix}: ${errorData.message || response.statusText}`
          );
          // Lida com erros de autenticação/autorização.
          if (response.status === 401 || response.status === 403) {
            alert("Sessão expirada ou não autorizada. Faça login novamente.");
          }
          return false; // Indica falha
        }
      } catch (error) {
        // Lida com erros de conexão.
        console.error("Erro ao comunicar com o backend:", error);
        alert(`Erro de conexão: ${errorMsgPrefix.toLowerCase()}.`);
        return false; // Indica falha
      } finally {
        setLoadingState(false); // Desativa o estado de loading no final
      }
    },
    [backendUrl, firebaseIdToken] // Dependências do useCallback
  );

  // `handleDelete` é uma função memoizada para deletar uma tarefa.
  // Usa `makeApiRequest` e chama `onTaskDeleted` em caso de sucesso.
  const handleDelete = useCallback(async () => {
    if (isDeleting) return; // Evita múltiplas deleções
    await makeApiRequest(
      `/tasks/${tarefa.id_tarefa}`, // Endpoint da API
      "DELETE", // Método HTTP
      null, // Sem corpo para DELETE
      () => {
        onTaskDeleted(tarefa.id_tarefa); // Callback de sucesso
      },
      "Erro ao deletar tarefa", // Prefixo de erro
      setIsDeleting // Função para gerenciar o estado de loading
    );
  }, [isDeleting, makeApiRequest, tarefa.id_tarefa, onTaskDeleted]);

  // `handleStatusChange` é uma função memoizada para atualizar o status de uma tarefa.
  // Usa `makeApiRequest` e chama `onTaskUpdated` em caso de sucesso.
  const handleStatusChange = useCallback(
    async (event) => {
      if (isUpdatingStatus) return; // Evita múltiplas atualizações
      const newStatus = event.target.checked ? "Finalizada" : "Pendente"; // Determina o novo status
      await makeApiRequest(
        `/tasks/${tarefa.id_tarefa}/status`, // Endpoint da API
        "PUT", // Método HTTP
        { estado_tarefa: newStatus }, // Corpo da requisição
        () => {
          onTaskUpdated({
            id_tarefa: tarefa.id_tarefa,
            estado_tarefa: newStatus,
          }); // Callback de sucesso
        },
        "Erro ao atualizar estado", // Prefixo de erro
        setIsUpdatingStatus // Função para gerenciar o estado de loading
      );
    },
    [isUpdatingStatus, makeApiRequest, tarefa.id_tarefa, onTaskUpdated]
  );

  // `handleEditSave` é uma função memoizada para salvar as edições de uma tarefa.
  // Usa `makeApiRequest` e chama `onTaskUpdated` em caso de sucesso, além de sair do modo de edição.
  const handleEditSave = useCallback(async () => {
    if (isSavingEdit) return; // Evita múltiplos salvamentos
    const payload = {
      ...editFormData, // Dados do formulário de edição
      data_prazo: editFormData.data_prazo || null, // Garante que data_prazo seja null se vazio
      estado_tarefa: tarefa.estado_tarefa, // Mantém o estado da tarefa
    };
    const success = await makeApiRequest(
      `/tasks/${tarefa.id_tarefa}`, // Endpoint da API
      "PUT", // Método HTTP
      payload, // Corpo da requisição
      () => {
        onTaskUpdated({ id_tarefa: tarefa.id_tarefa, ...payload }); // Callback de sucesso
        setIsEditing(false); // Sai do modo de edição
      },
      "Erro ao atualizar tarefa", // Prefixo de erro
      setIsSavingEdit // Função para gerenciar o estado de loading
    );
  }, [
    isSavingEdit,
    makeApiRequest,
    tarefa.id_tarefa,
    tarefa.estado_tarefa,
    editFormData,
    onTaskUpdated,
  ]);

  // `handleEditChange` é uma função memoizada para atualizar o estado do formulário de edição.
  const handleEditChange = useCallback((e) => {
    const { name, value } = e.target; // Obtém o nome e valor do input
    setEditFormData((prev) => ({ ...prev, [name]: value })); // Atualiza o estado
  }, []);

  // `resetFormAndExitEdit` é uma função memoizada para resetar o formulário e sair do modo de edição.
  const resetFormAndExitEdit = useCallback(() => {
    setIsEditing(false); // Sai do modo de edição
    setEditFormData(initialFormData); // Reseta os dados do formulário para os iniciais
  }, [initialFormData]);

  // `handleEditCancel` é uma função memoizada para cancelar a edição.
  const handleEditCancel = useCallback(
    (e) => {
      e.stopPropagation(); // Impede a propagação do evento de clique
      resetFormAndExitEdit(); // Reseta o formulário e sai do modo de edição
    },
    [resetFormAndExitEdit]
  );

  // `toggleExpand` é uma função memoizada para expandir/recolher o card.
  // Se estiver em modo de edição e for recolhido, também reseta o formulário.
  const toggleExpand = useCallback(
    (e) => {
      e.stopPropagation(); // Impede a propagação do evento de clique
      setIsExpanded((prev) => !prev); // Alterna o estado de expansão
      if (isEditing && isExpanded) {
        resetFormAndExitEdit(); // Reseta se estiver editando e for recolhido
      }
    },
    [isEditing, isExpanded, resetFormAndExitEdit]
  );

  // `openEditMode` é uma função memoizada para entrar no modo de edição.
  // Também expande o card se não estiver expandido.
  const openEditMode = useCallback(
    (e) => {
      e.stopPropagation(); // Impede a propagação do evento de clique
      setEditFormData(initialFormData); // Define os dados iniciais para edição
      setIsEditing(true); // Entra no modo de edição
      if (!isExpanded) setIsExpanded(true); // Expande se não estiver expandido
    },
    [initialFormData, isExpanded]
  );

  // `dueDateInfo` e `priorityClasses` são valores memoizados
  // para evitar recalculos desnecessários.
  const dueDateInfo = useMemo(
    () => getDueDateStatus(tarefa.data_prazo),
    [tarefa.data_prazo]
  );
  const priorityClasses = useMemo(
    () => getPriorityColor(tarefa.prioridade),
    [tarefa.prioridade]
  );

  // `isLoading` é um booleano que indica se alguma operação assíncrona está em andamento.
  const isLoading = isDeleting || isUpdatingStatus || isSavingEdit;

  // Classes base do card.
  const cardBaseClasses =
    "flex flex-col items-start bg-[var(--bgcard)] shadow-md rounded-md p-4 mb-2 w-[335px] sm:w-[340px] xl:w-[300px] min-h-[100px]";
  // Classes para animação do card.
  const cardAnimationClasses = isDragging
    ? ""
    : "transition-shadow duration-300";
  // Classe para indicar que o card é arrastável.
  const cardDraggableClass = isDraggable ? "touch-action-none" : "";

  // Variável para verificar se a tarefa está finalizada.
  const isTaskCompleted = tarefa.estado_tarefa === "Finalizada";

  // --- Renderização do Componente --------------------------------------------

  return (
    <div
      ref={setNodeRef} // Associa a referência do nó para o dnd-kit
      style={style} // Aplica os estilos de arrasto
      {...attributes} // Adiciona atributos de acessibilidade do dnd-kit
      className={`relative rounded-lg shadow-lg flex flex-col justify-between transition-all duration-300 ease-in-out ${getCardSizeClasses()} ${
        isTaskCompleted
          ? "bg-[var(--taskcompleted)] opacity-60" // Estilo para tarefa finalizada
          : "bg-[var(--subbackground)]" // Estilo padrão
      } border border-[var(--details)] ${cardAnimationClasses} $`}
      // Permite abrir o modo de edição ao clicar se não for arrastável, não estiver editando e não estiver expandido
      onClick={
        !isDraggable && !isEditing && !isExpanded ? openEditMode : undefined
      }
    >
      <div className="flex flex-row w-full justify-between items-start gap-2">
        {isDraggable && (
          // Botão de arrastar, visível apenas se a tarefa for arrastável
          <div
            className={`flex items-center justify-center cursor-grab text-gray-400 hover:text-gray-600 active:text-blue-500 py-1 flex-shrink-0 ${cardDraggableClass}`}
            {...listeners} // Adiciona listeners de arrasto
          >
            <MdOutlineDragIndicator size={24} /> {/* Ícone de arrastar */}
          </div>
        )}
        {!isDraggable && <div className="w-[24px] mr-2 flex-shrink-0"></div>} {/* Espaçamento para alinhamento quando não é arrastável */}

        <div
          className="flex-grow min-w-0"
          // Permite abrir o modo de edição ao clicar no título se não for arrastável e não estiver editando
          onClick={!isDraggable && !isEditing ? openEditMode : undefined}
        >
          {isEditing ? (
            // Input para edição do título
            <input
              type="text"
              name="titulo"
              value={editFormData.titulo}
              onChange={handleEditChange}
              className={`font-semibold text-[var(--text)] border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent w-full ${getTitleSizeClasses()}`}
              placeholder="Título da Tarefa"
              disabled={isLoading} // Desabilita se alguma operação estiver em andamento
              onClick={(e) => e.stopPropagation()} // Impede a propagação do clique
            />
          ) : (
            // Título da tarefa em modo de visualização
            <h3
              className={`font-semibold  text-start ${getTitleSizeClasses()} ${
                !isExpanded ? "truncate-text" : "" // Trunca texto se não expandido
              } ${
                isTaskCompleted
                  ? "line-through text-gray-500" // Riscado se finalizada
                  : "text-[var(--text)]"
              }`}
            >
              {tarefa.titulo}
            </h3>
          )}
        </div>

        {!isEditing && (
          // Botões de ação (checkbox, deletar, expandir/recolher), visíveis apenas fora do modo de edição
          <div className="flex items-center gap-1 flex-shrink-0">
            <label
              className="flex items-center cursor-pointer p-1"
              onClick={(e) => e.stopPropagation()} // Impede a propagação do clique
            >
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                checked={isTaskCompleted} // Estado do checkbox baseado no status da tarefa
                onChange={handleStatusChange} // Lida com a mudança de status
                disabled={isUpdatingStatus || isDeleting} // Desabilita se estiver atualizando ou deletando
              />
            </label>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Impede a propagação do clique
                handleDelete(); // Chama a função para deletar
              }}
              className="p-1 text-red-500 hover:text-red-700 disabled:text-gray-400"
              disabled={isLoading} // Desabilita se alguma operação estiver em andamento
            >
              <MdDeleteOutline size={22} /> {/* Ícone de deletar */}
            </button>
            <button
              onClick={toggleExpand} // Chama a função para expandir/recolher
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? (
                <MdExpandLess size={24} /> // Ícone para recolher
              ) : (
                <MdExpandMore size={24} /> // Ícone para expandir
              )}
            </button>
          </div>
        )}
      </div>
      <div
        className={`w-full mt-2 ${isDraggable ? "pl-[calc(24px+0.5rem)]" : ""}`} // Ajusta o padding se for arrastável
        onClick={(e) => e.stopPropagation()} // Impede a propagação do clique
      >
        {/* Seção Expandida/Edição */}
        {(isExpanded || isEditing) && (
          <>
            {isEditing ? (
              // Textarea para edição da descrição
              <textarea
                name="descricao"
                value={editFormData.descricao}
                onChange={handleEditChange}
                className={`text-[var(--subText)] w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 mt-1 resize-y max-h-40 min-h-[60px] overflow-y-auto bg-transparent ${getDescriptionSizeClasses()}`}
                rows={3}
                placeholder="Descrição da Tarefa"
                disabled={isLoading} // Desabilita se alguma operação estiver em andamento
              />
            ) : (
              // Descrição da tarefa em modo de visualização (se existir)
              tarefa.descricao && (
                <p
                  className={`text-[var(--subText)] mt-1 break-words text-start whitespace-pre-wrap max-h-24 overflow-y-auto w-full ${getDescriptionSizeClasses()}`}
                >
                  {tarefa.descricao}
                </p>
              )
            )}
          </>
        )}

        {/* Condição para esconder Data Prazo e Prioridade se a tarefa estiver finalizada */}
        {!isTaskCompleted && (
          <div className="flex gap-2 mt-2 items-center">
            {isEditing ? (
              // Input para edição da data de prazo
              <input
                type="date"
                name="data_prazo"
                value={editFormData.data_prazo}
                onChange={handleEditChange}
                className={`text-gray-500 border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent flex-grow ${getDatePrioritySizeClasses()}`}
                disabled={isLoading} // Desabilita se alguma operação estiver em andamento
              />
            ) : (
              // Exibição da data de prazo em modo de visualização
              <p
                className={`rounded-md inline-block flex-grow ${
                  dueDateInfo.className
                } ${getDatePrioritySizeClasses()}`}
              >
                {dueDateInfo.text}
              </p>
            )}

            {isEditing ? (
              // Select para edição da prioridade
              <select
                name="prioridade"
                value={editFormData.prioridade}
                onChange={handleEditChange}
                className={`text-gray-500 border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent w-2/5 ${getDatePrioritySizeClasses()}`}
                disabled={isLoading} // Desabilita se alguma operação estiver em andamento
              >
                <option value="Baixa">Baixa</option>{" "}
                <option value="Normal">Normal</option>
                <option value="Alta">Alta</option>{" "}
                <option value="Urgente">Urgente</option>
              </select>
            ) : (
              // Exibição da prioridade em modo de visualização
              <p
                className={`rounded-md inline-block font-medium w-2/5 text-center ${priorityClasses} ${getDatePrioritySizeClasses()}`}
              >
                {tarefa.prioridade}
              </p>
            )}
          </div>
        )}

        {/* Botões de ação para modo expandido ou edição */}
        {(isExpanded || isEditing) && (
          <div className="flex items-center gap-2 mt-4">
            {isEditing ? (
              // Botões Salvar e Cancelar em modo de edição
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Impede a propagação do clique
                    handleEditSave(); // Chama a função para salvar
                  }}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-xs focus:outline-none focus:shadow-outline disabled:bg-gray-400"
                  disabled={isLoading} // Desabilita se alguma operação estiver em andamento
                >
                  Salvar
                </button>
                <button
                  onClick={handleEditCancel} // Chama a função para cancelar
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded text-xs focus:outline-none focus:shadow-outline disabled:bg-gray-300"
                  disabled={isLoading} // Desabilita se alguma operação estiver em andamento
                >
                  Cancelar
                </button>
                {isExpanded && (
                  // Botão para fechar detalhes em modo de edição e expandido
                  <button
                    onClick={toggleExpand}
                    className="p-1 text-gray-500 hover:text-gray-700 ml-auto"
                    title="Fechar detalhes"
                  >
                    <MdExpandLess size={24} />
                  </button>
                )}
              </>
            ) : (
              // Botão Editar Tarefa em modo expandido (não em edição)
              isExpanded && (
                <button
                  onClick={openEditMode}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs focus:outline-none focus:shadow-outline"
                >
                  Editar Tarefa
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Exporta o componente envolvido em `React.memo` para otimização de performance,
// evitando re-renderizações desnecessárias se as props não mudarem.
export default React.memo(TaskCardComponent);