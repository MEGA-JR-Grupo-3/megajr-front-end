export const cadastrarUsuario = async ({ name, email, senha }) => {
  try {
    const response = await fetch(
      "https://megajr-back-end.vercel.app/cadastro",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, senha }),
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao cadastrar usuário");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
