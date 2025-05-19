import React from 'react';
import { BellIcon } from '@heroicons/react/24/outline';

function NotificationControl({ enabled, onToggle }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <BellIcon className="h-6 w-6 mr-2 text-gray-500" />
          <span className="font-semibold">Notificações</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            value=""
            className="sr-only peer"
            checked={enabled}
            onChange={onToggle}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 dark:bg-gray-700 rounded-full peer dark:peer-checked:bg-purple-600 transition-all duration-300"></div>
          <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{enabled ? 'Permitir' : 'Desativado'}</span>
        </label>
      </div>
    </div>
  );
}

export default NotificationControl;

let notificationsEnabled = true;

export const getNotificationsEnabled = () => notificationsEnabled;
export const setNotificationsEnabled = (value) => {
  notificationsEnabled = value;
};