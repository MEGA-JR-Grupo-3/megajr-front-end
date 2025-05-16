import { Dosis } from "next/font/google";
import "./globals.css";
import RootLayoutClient from "./layout.client";

const dosis = Dosis({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const link = [
  {
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: "/apple-touch-icon.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "512x512",
    href: "/android-chrome-512x512.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "192x192",
    href: "/android-chrome-192x192.png",
  },
];

export const metadata = {
  title: "JubiTasks",
  description: "Gerencie suas tarefas com o seu amigo Jubileu!",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  openGraph: {
    title: "JubiTasks",
    description: "Gerencie suas tarefas com o seu amigo Jubileu!",
    images: [
      {
        url: "./favicon.ico",
        width: 500,
        height: 500,
        alt: "JubiTasks",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={dosis.className}>
        <RootLayoutClient dosis={dosis}>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
