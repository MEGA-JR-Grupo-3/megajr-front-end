"use client";

import { FiSun, FiMoon } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  if (resolvedTheme === "dark") {
    return (
      <div
        className=" text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-row justify-center gap-1"
        onClick={() => setTheme("light")}
      >
        <FiSun />
        Mudar tema
      </div>
    );
  } else {
    return (
      <div
        className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-row justify-center gap-1"
        onClick={() => setTheme("dark")}
      >
        <FiMoon />
        Mudar tema
      </div>
    );
  }
}
