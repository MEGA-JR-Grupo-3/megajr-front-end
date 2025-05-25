export const cadastrarUsuario = async ({ name, email, senha }) => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  try {
    const response = await fetch(`${backendUrl}/cadastro`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, senha }),
    });

    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
