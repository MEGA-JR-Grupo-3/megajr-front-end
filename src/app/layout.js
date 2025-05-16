import { Dosis } from "next/font/google";
import "./globals.css";
import RootLayoutClient from "./layout.client";
import Head from "next/head"; // Importe o componente Head

const dosis = Dosis({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "JubiTasks",
  description: "Gerencie suas tarefas com o seu amigo Jubileu!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <Head>
        {/* Favicon padrão */}
        <link rel="icon" href="/favicon.ico" sizes="any" />

        {/* Ícone para dispositivos iOS */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />

        {/* Ícones para Android Chrome */}
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-chrome-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/android-chrome-512x512.png"
        />
      </Head>
      <body className={dosis.className}>
        <RootLayoutClient dosis={dosis}>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
