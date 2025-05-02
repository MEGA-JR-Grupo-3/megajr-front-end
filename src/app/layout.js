import { Dosis } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import ThemeSwitch from "../components/ThemeSwitch";

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
    <html lang="pt-BR" className={dosis.className} suppressHydrationWarning>
      <body className="antialiased bg-[var(--background)] text-[var(--text)]">
        <Providers>
          <ThemeSwitch />
          {children}
        </Providers>
      </body>
    </html>
  );
}
