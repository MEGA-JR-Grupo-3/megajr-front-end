"use client";

import React, { useState, useEffect } from "react";
import BackButton from "../../components/BackButton";
import ConfirmModal from "../../components/ConfirmModal";
export default function EditarPerfil({
  loggedInUserEmail,
  backendUrl,
  onUserUpdate,
  onUserDelete,
}) {
  const [userData, setUserData] = useState(null);
  const [currentProfilePhoto, setCurrentProfilePhoto] = useState(
    "/assets/default-avatar.png"
  );
  const [newProfilePhotoPreview, setNewProfilePhotoPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null);

  const displayPhoto = newProfilePhotoPreview || currentProfilePhoto;

  return (
    <div className="flex flex-col w-screen lg:w-[calc(100vw-320px)] justify-self-end items-center p-2 transition-all duration-300 text-[var(--text)]">
      <div className="font-semibold text-xl absolute top-24 left-5 lg:right-[calc(100vw-770px)] flex flex-row gap-4 justify-center items-center">
        <BackButton /> Voltar
      </div>
      <div className="flex flex-col justify-center text-center container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold bg-gradient-to-b from-[var(--primary)] to-[var(--secondary)] text-transparent bg-clip-text pb-4 mb-4 mt-18">
          Editar Perfil
        </h1>

        {/* Mensagens de Feedback */}
        {loading && <div className="text-blue-500 mb-4">Carregando...</div>}
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
          className="w-full max-w-sm p-6 bg-gray-800 rounded-lg shadow-md mb-8"
        >
          <h2 className="text-xl font-semibold mb-4 text-white">
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
              className="block text-gray-300 text-sm font-bold mb-2 cursor-pointer"
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
                         file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-300 file:text-blue-700
                         hover:file:bg-blue-100"
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
        <form className="w-full max-w-sm p-6 bg-gray-800 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Alterar Email
          </h2>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 "
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={
              loading || !email || (userData && email === userData.email)
            }
          >
            Atualizar Email
          </button>
        </form>

        {/* Formulário de Mudança de Senha */}
        <form className="w-full max-w-sm p-6 bg-gray-800 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white">Mudar Senha</h2>
          <div className="mb-4">
            <label
              htmlFor="currentPassword"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Senha Atual:
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 "
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Nova Senha:
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 "
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="confirmNewPassword"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Confirmar Nova Senha:
            </label>
            <input
              type="password"
              id="confirmNewPassword"
              name="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 "
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
        <div className="w-full max-w-sm p-6 bg-gray-800 rounded-lg shadow-md mb-8 text-left text-white">
          <h2 className="text-xl font-semibold mb-4">Informações da Conta</h2>
          <p className="mb-2">
            <span className="font-bold">Email Atual:</span>{" "}
            {userData?.email || "N/A"}
          </p>
          <p className="mb-2">
            <span className="font-bold">Membro Desde:</span>
          </p>
        </div>

        {/* Botão Deletar Conta */}
        <div className="w-full max-w-sm p-6 bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Deletar Conta
          </h2>
          <p className="text-red-400 mb-4">
            Esta ação é irreversível e deletará todos os seus dados.
          </p>
          <button
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            Deletar Minha Conta
          </button>
        </div>
      </div>
    </div>
  );
}
