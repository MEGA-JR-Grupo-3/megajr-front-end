
"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ThemeButton() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  if (!mounted) return null;

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={isDark}
        onChange={() => setTheme(isDark ? "light" : "dark")}
      />
      <div className="group peer ring-0 bg-gradient-to-bl from-[var(--button)] [via-[var(--button)] to-[#998b94da] rounded-full outline-none duration-1000 after:duration-300 w-16 h-8 shadow-md peer-focus:outline-none after:content-[''] after:rounded-full after:absolute after:[background:#0D2B39] peer-checked:after:rotate-180 after:[background:conic-gradient(from_135deg,_#ffffff,_#ffffff,_#ffffff,_#ffffff,_#ffffff,_#ffffff)] after:outline-none after:h-6 after:w-6 after:top-1 after:left-1 peer-checked:after:translate-x-8 peer-hover:after:scale-95 peer-checked:bg-gradient-to-r peer-checked:from-#e03618 peer-checked:to-#e9227b">
      </div>

    </label>
  );
}
