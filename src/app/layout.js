import { Dosis } from "next/font/google";
import "./globals.css";
import RootLayoutClient from "./layout.client";

const dosis = Dosis({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "JubiTasks",
  description: "Gerencie suas tarefas com o seu amigo Jubileu!",
};

export default function RootLayout({ children }) {
  return <RootLayoutClient dosis={dosis}>{children}</RootLayoutClient>;
}
