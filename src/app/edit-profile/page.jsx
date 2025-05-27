"use client";

import React, { useState, useEffect } from "react";
import BackButton from "../../components/BackButton";
import ConfirmModal from "../../components/ConfirmModal";
import {
  auth,
  storage,
  updateProfile,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  deleteUser,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "../../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Image from "next/image";
import patoConfig from "../../../public/assets/pato-config.png";
import { LineSpinner } from "ldrs/react";
import "ldrs/react/LineSpinner.css";

export default function EditarPerfil() {
  const [userData, setUserData] = useState(null);
  const [currentProfilePhoto, setCurrentProfilePhoto] = useState(
    "/assets/default-avatar.png"
  );
  const [newProfilePhotoPreview, setNewProfilePhotoPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [creationDate, setCreationDate] = useState(null);
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserData(user);
        setEmail(user.email || "");
        setCurrentProfilePhoto(user.photoURL || "/assets/default-avatar.png");

        const creationTime = user.metadata?.creationTime;
        if (creationTime) {
          const date = new Date(creationTime);
          const formattedDate = date.toLocaleDateString("pt-BR");
          setCreationDate(formattedDate);
        }

        try {
          setLoading(true);
          const idToken = await user.getIdToken();
          const response = await fetch(`${backendUrl}/user-data`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          });
          const data = await response.json();
          if (response.ok) {
            if (data.foto_perfil) {
              setCurrentProfilePhoto(data.foto_perfil);
            }
            if (data.email !== user.email) {
              const updateEmailBackendResponse = await fetch(
                `${backendUrl}/update-email`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                  },
                  body: JSON.stringify({ newEmail: user.email }),
                }
              );
              const updateEmailBackendData =
                await updateEmailBackendResponse.json();
              if (!updateEmailBackendResponse.ok) {
                console.error(
                  "Erro ao sincronizar email com o backend após verificação:",
                  updateEmailBackendData.message
                );
              } else {
                console.log(
                  "Email sincronizado com o backend após verificação."
                );
              }
            }
          } else {
            console.error(
              "Erro ao buscar dados do usuário no backend:",
              data.message
            );
            setErrorMessage(
              `Erro ao carregar dados do perfil: ${data.message}`
            );
          }
        } catch (error) {
          console.error("Erro na requisição de dados do usuário:", error);
          setErrorMessage("Erro de rede ao carregar dados do perfil.");
        } finally {
          setLoading(false);
        }
      } else {
        setUserData(null);
        setEmail("");
        setCreationDate(null);
        setCurrentProfilePhoto("/assets/default-avatar.png");
      }
    });

    return () => unsubscribe();
  }, [backendUrl]);

  const displayPhoto = newProfilePhotoPreview || currentProfilePhoto;

  // Lida com a seleção de arquivo para a foto de perfil
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setNewProfilePhotoPreview(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setNewProfilePhotoPreview(null);
    }
  };

  // Lida com o upload da foto de perfil para o Firebase Storage e atualização no DB
  const handlePhotoUpload = async () => {
    if (!selectedFile || !userData) {
      setErrorMessage("Nenhuma foto selecionada ou usuário não logado.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const storageRef = ref(
        storage,
        `profile_photos/${userData.uid}/${selectedFile.name}`
      );
      await uploadBytes(storageRef, selectedFile);
      const photoURL = await getDownloadURL(storageRef);

      await updateProfile(userData, { photoURL });
      setCurrentProfilePhoto(photoURL);
      setNewProfilePhotoPreview(null);
      setSelectedFile(null);

      const idToken = await userData.getIdToken();
      const response = await fetch(`${backendUrl}/update-profile-photo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ photoURL }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || "Erro ao sincronizar foto com o backend."
        );
      }

      setSuccessMessage("Foto de perfil atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar foto de perfil:", error);
      setErrorMessage(
        `Erro ao atualizar foto de perfil: ${
          error.message || "Tente novamente."
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // Lida com a atualização do email do usuário
  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    if (!userData) {
      setErrorMessage("Usuário não logado.");
      return;
    }
    if (!email || email === userData.email) {
      setErrorMessage("Por favor, insira um novo email diferente do atual.");
      return;
    }
    if (!currentPassword) {
      setErrorMessage(
        "Por favor, digite sua senha atual para confirmar a mudança de email."
      );
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const credential = EmailAuthProvider.credential(
        userData.email,
        currentPassword
      );
      await reauthenticateWithCredential(userData, credential);

      await updateEmail(userData, email);

      setSuccessMessage(
        "Um email de verificação foi enviado para o novo endereço. Por favor, verifique sua caixa de entrada (incluindo spam) e clique no link para completar a atualização do seu email."
      );

      setCurrentPassword("");
    } catch (error) {
      console.error("Erro ao atualizar email:", error);
      if (error.code === "auth/requires-recent-login") {
        setErrorMessage(
          "Sua sessão expirou. Por favor, faça login novamente para atualizar seu email."
        );
      } else if (error.code === "auth/invalid-credential") {
        setErrorMessage(
          "Senha atual incorreta. Por favor, digite sua senha atual para confirmar."
        );
      } else if (error.code === "auth/email-already-in-use") {
        setErrorMessage("Este email já está em uso por outra conta.");
      } else {
        setErrorMessage(
          `Erro ao atualizar email: ${error.message || "Tente novamente."}`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Lida com a mudança de senha do usuário
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!userData) {
      setErrorMessage("Usuário não logado.");
      return;
    }
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setErrorMessage("Por favor, preencha todos os campos de senha.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMessage("A nova senha e a confirmação não coincidem.");
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const credential = EmailAuthProvider.credential(
        userData.email,
        currentPassword
      );
      await reauthenticateWithCredential(userData, credential);

      await updatePassword(userData, newPassword);

      setSuccessMessage("Senha atualizada com sucesso!");
      setNewPassword("");
      setConfirmNewPassword("");
      setCurrentPassword("");
    } catch (error) {
      console.error("Erro ao mudar senha:", error);
      if (error.code === "auth/requires-recent-login") {
        setErrorMessage(
          "Sua sessão expirou. Por favor, faça login novamente para mudar sua senha."
        );
      } else if (error.code === "auth/invalid-credential") {
        setErrorMessage("Senha atual incorreta.");
      } else if (error.code === "auth/weak-password") {
        setErrorMessage(
          "A nova senha é muito fraca. Ela deve ter pelo menos 6 caracteres."
        );
      } else {
        setErrorMessage(
          `Erro ao mudar senha: ${error.message || "Tente novamente."}`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Lida com a exclusão da conta do usuário
  const handleDeleteAccount = () => {
    if (!userData) {
      setErrorMessage("Usuário não logado.");
      return;
    }

    setConfirmModal({
      isVisible: true,
      message:
        "Tem certeza que deseja deletar sua conta? Esta ação é irreversível e deletará todos os seus dados.",
      onConfirm: async () => {
        setConfirmModal(null);
        setLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
          const idToken = await userData.getIdToken();
          const response = await fetch(`${backendUrl}/delete-user-data`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(
              data.message || "Erro ao deletar dados no backend."
            );
          }

          await deleteUser(userData);

          setSuccessMessage("Conta deletada com sucesso!");
        } catch (error) {
          console.error("Erro ao deletar conta:", error);
          if (error.code === "auth/requires-recent-login") {
            setErrorMessage(
              "Sua sessão expirou. Por favor, faça login novamente para deletar sua conta."
            );
          } else {
            setErrorMessage(
              `Erro ao deletar conta: ${error.message || "Tente novamente."}`
            );
          }
        } finally {
          setLoading(false);
        }
      },
      onCancel: () => setConfirmModal(null),
    });
  };

  return (
    <div className="flex flex-col w-screen lg:w-[calc(100vw-320px)] justify-self-end items-center p-2 transition-all duration-300 text-[var(--text)]">
      <div className="font-semibold text-xl absolute top-24 left-5 lg:right-[calc(100vw-770px)] flex flex-row gap-4 justify-center items-center">
        <BackButton /> Voltar
      </div>
      <div className="flex flex-col justify-center justify-items-center text-center container mx-auto py-10 px-4 sm:px-6 lg:px-12">
        <h1 className="text-3xl font-extrabold bg-gradient-to-b from-[var(--primary)] to-[var(--secondary)] text-transparent bg-clip-text pb-4 mb-4 mt-18">
          Editar Perfil
        </h1>
        <p className="text-lg mb-10 font-semibold ">
          Opa! O jubileu está aqui para te ajudar com a costumização do seu
          perfil. Vamos la?
        </p>
        <div className="flex flex-col justify-center items-center">
          <Image
            src={patoConfig}
            className="h-auto w-40 mb-10 object-cover"
            alt="pato"
            priority
          />
        </div>

        {/* Mensagens de Feedback */}
        {loading && (
          <div className="flex justify-center items-center h-screen">
            <LineSpinner size="40" stroke="3" speed="1" color="black" />
          </div>
        )}
        {errorMessage && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-50">
            <div className="h-[200px] w-[340px] bg-[var(--subbackground)] rounded-2xl border border-[#ffffff] p-4 flex flex-col justify-center text-center text-red-600">
              <h3>{errorMessage}</h3>
              <button
                className="mt-[20px] self-center bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-3xl"
                onClick={() => setErrorMessage(null)}
              >
                Fechar
              </button>
            </div>
          </div>
        )}
        {successMessage && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-50">
            <div className="h-[200px] w-[340px] bg-[var(--subbackground)] rounded-2xl border border-[#ffffff] p-4 flex flex-col justify-center text-center text-green-600">
              <h3>{successMessage}</h3>
              <button
                className="mt-[20px] self-center bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-3xl"
                onClick={() => setSuccessMessage(null)}
              >
                Fechar
              </button>
            </div>
          </div>
        )}
        {confirmModal && confirmModal.isVisible && (
          <ConfirmModal
            message={confirmModal.message}
            onConfirm={confirmModal.onConfirm}
            onCancel={confirmModal.onCancel}
          />
        )}

        {/* Formulário de Foto de Perfil */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handlePhotoUpload();
          }}
          className="flex flex-col justify-center items-center w-full p-6 bg-[var(--subbackground)] rounded-lg shadow-md mb-8"
        >
          <h2 className="text-xl font-semibold mb-4 text-[var(--text)]">
            Alterar Foto de Perfil
          </h2>
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-gray-600 shadow-lg">
              <img
                src={displayPhoto}
                alt="Foto de Perfil"
                className="w-full h-full object-cover"
              />
            </div>

            <label
              htmlFor="foto"
              className="block text-[var(--subText)] text-sm font-bold mb-2 cursor-pointer"
            >
              Escolher Foto:
            </label>
            <input
              type="file"
              id="foto"
              name="foto"
              accept="image/*"
              className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                       min-w-[300px]          file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-300 file:text-blue-700
                                hover:file:bg-blue-100"
              onChange={handleFileChange}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading || !selectedFile}
          >
            Salvar Foto
          </button>
        </form>

        {/* Formulário de Email */}
        <form
          onSubmit={handleUpdateEmail}
          className="flex flex-col justify-center items-center w-full p-6 bg-[var(--subbackground)] rounded-lg shadow-md mb-8"
        >
          <h2 className="text-xl font-semibold mb-4 text-[var(--text)]">
            Alterar Email
          </h2>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-[var(--subText)] text-sm font-bold mb-2"
            >
              Novo Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full min-w-[300px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-[var(--background)]"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="currentPasswordEmail"
              className="block text-[var(--subText)] text-sm font-bold mb-2"
            >
              Senha Atual (para confirmar):
            </label>
            <input
              type="password"
              id="currentPasswordEmail"
              name="currentPasswordEmail"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full min-w-[300px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-[var(--background)]"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={
              loading ||
              !email ||
              (userData && email === userData.email) ||
              !currentPassword
            }
          >
            Atualizar Email
          </button>
        </form>

        {/* Formulário de Mudança de Senha */}
        <form
          onSubmit={handleChangePassword}
          className="flex flex-col justify-center items-center w-full p-6 bg-[var(--subbackground)] rounded-lg shadow-md mb-8"
        >
          <h2 className="text-xl font-semibold mb-4 text-[var(--text)]">
            Mudar Senha
          </h2>
          <div className="mb-4">
            <label
              htmlFor="currentPassword"
              className="block text-[var(--subText)] text-sm font-bold mb-2"
            >
              Senha Atual:
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full min-w-[300px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-[var(--background)]"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="block text-[var(--subText)] text-sm font-bold mb-2"
            >
              Nova Senha:
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full min-w-[300px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-[var(--background)]"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="confirmNewPassword"
              className="block text-[var(--subText)] text-sm font-bold mb-2"
            >
              Confirmar Nova Senha:
            </label>
            <input
              type="password"
              id="confirmNewPassword"
              name="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full min-w-[300px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-[var(--background)]"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            Mudar Senha
          </button>
        </form>

        {/* Informações da Conta */}
        <div className="flex flex-col justify-center items-center w-full p-6 bg-[var(--subbackground)] rounded-lg shadow-md mb-8 text-left text-[var(--text)]">
          <h2 className="text-xl font-semibold mb-4">Informações da Conta</h2>
          <p className="mb-2">
            <span className="font-bold">Email Atual:</span>
            {userData?.email || "N/A"}
          </p>
          <p className="mb-2">
            {creationDate && (
              <span className="font-bold">Membro Desde: {creationDate}</span>
            )}
          </p>
        </div>

        {/* Botão Deletar Conta */}
        <div className="flex flex-col justify-center items-center w-full p-6 bg-[var(--subbackground)] rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-[var(--text)]">
            Deletar Conta
          </h2>
          <p className="text-red-400 mb-4">
            Esta ação é irreversível e deletará todos os seus dados.
          </p>
          <button
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleDeleteAccount}
            disabled={loading}
          >
            Deletar Minha Conta
          </button>
        </div>
      </div>
    </div>
  );
}
