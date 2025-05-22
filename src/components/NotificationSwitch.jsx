'use client';

import { useState, useEffect } from 'react';

export default function NotificationSwitch() {
  const [enabled, setEnabled] = useState(false);
  

  useEffect(() => {
    const saved = localStorage.getItem('notificationsEnabled');
    if (saved !== null) {
      setEnabled(saved === 'true');
    }
  }, []);

  const toggleNotification = () => {
    const newValue = !enabled;
    setEnabled(newValue);
    localStorage.setItem('notificationsEnabled', newValue.toString());
  };

  const handleNotificationChange = (isEnabled) => {
  console.log('Notificações:', isEnabled ? 'Ativadas' : 'Desativadas');
  localStorage.setItem('notificationsEnabled', JSON.stringify(isEnabled));
};


  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={enabled}
        onChange={toggleNotification}
      />
      <div
        className={`group peer ring-0 rounded-full outline-none duration-1000 after:duration-300 w-16 h-8 shadow-md peer-focus:outline-none
        after:content-[''] after:rounded-full after:absolute after:outline-none after:h-6 after:w-6 after:top-1 after:left-1
        peer-hover:after:scale-95
        ${enabled
          ? 'bg-gradient-to-r from-green-500 to-green-700 peer-checked:after:translate-x-8 after:[background:#ffffff]'
          : 'bg-gradient-to-r from-red-500 to-red-700 after:[background:#ffffff]'
        }
        `}
      >
      </div>
    </label>
  );
}
