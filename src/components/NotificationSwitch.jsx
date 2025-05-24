"use client";

import React, { useState, useEffect } from 'react';

export default function NotificationSwitch({ checked, onChange }) {
  // The 'enabled' state in NotificationSwitch now reflects the 'checked' prop
  // It's still useful internally for visual updates that might debounce
  // but the primary source of truth is the 'checked' prop from the parent.
  const [internalEnabled, setInternalEnabled] = useState(checked);

  useEffect(() => {
    setInternalEnabled(checked); // Keep internal state in sync with prop
  }, [checked]);

  const handleToggle = () => {
    const newValue = !internalEnabled;
    setInternalEnabled(newValue); // Optimistic update for UI

    // Call the onChange prop to communicate the new value to the parent
    if (onChange) {
      onChange(newValue);
    }
    // localStorage will be handled by the parent based on this onChange event
  };

  return (
    <label
      className="group relative inline-flex cursor-pointer items-center justify-start"
    >
      <input
        className="peer sr-only"
        type="checkbox"
        checked={internalEnabled} // Use internal state for visual representation
        onChange={handleToggle}
      />
      <span
        className="mr-4 text-xl font-semibold tracking-wider text-[var(--primary)] transition-all duration-300 group-hover:text-[var(--primary)] peer-checked:text-[var(--primary)]"
      >
        {internalEnabled ? "Permitir" : "Não permitir"}
      </span>
      <div
        className="relative h-6 w-12 rounded-full bg-[var(--primary)] shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] transition-all duration-500
                after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-[2px_2px_8px_rgba(0,0,0,0.3)] after:transition-all after:duration-500
                peer-checked:bg-gradient-to-r peer-checked:from-[var(--primary)] peer-checked:to-[var(--secondary)] peer-checked:after:translate-x-6 peer-checked:after:from-white peer-checked:after:to-[var(--primary)]
                hover:after:scale-95 active:after:scale-90"
      >
        <span
          className="absolute inset-0.5 rounded-full bg-gradient-to-tr from-white/20 via-transparent to-transparent"
        ></span>

        <span
          className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 peer-checked:animate-glow peer-checked:opacity-100 [box-shadow:0_0_15px_var(--primary)]"
        ></span>
      </div>
    </label>
  );
}