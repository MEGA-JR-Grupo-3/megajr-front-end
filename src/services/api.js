export const cadastrarUsuario = async ({ name, email, senha }) => {
  try {
    const response = await fetch("https://megajr-back.netlify.app/cadastro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, senha }),
    });

    return response; // Retorna o objeto response completo

    // A linha abaixo não é mais necessária aqui, pois o tratamento do sucesso
    // e de erros (incluindo o status 409) será feito no componente Register.
    // if (!response.ok) {
    //   throw new Error("Erro ao cadastrar usuário");
    // }

    // const data = await response.json();
    // return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
