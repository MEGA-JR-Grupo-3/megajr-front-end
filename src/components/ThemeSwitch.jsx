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
      <div className="fixed top-[20px] right-[20px]">
        <FiSun onClick={() => setTheme("light")} />
      </div>
    );
  } else {
    return (
      <div className="fixed top-[20px] right-[20px]">
        <FiMoon onClick={() => setTheme("dark")} />
      </div>
    );
  }
}
