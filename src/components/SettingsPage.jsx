import React, { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [theme, setTheme] = useState('light');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [taskSize, setTaskSize] = useState('medium'); // 'small', 'medium', 'large'

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) setTheme(storedTheme);

    const storedNotifications = localStorage.getItem('notificationsEnabled');
    if (storedNotifications) setNotificationsEnabled(storedNotifications === 'true');

    const storedTaskSize = localStorage.getItem('taskSize');
    if (storedTaskSize) setTaskSize(storedTaskSize);

    document.documentElement.className = theme;
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.className = theme;
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('notificationsEnabled', notificationsEnabled);
    
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const storedNotifications = localStorage.getItem('notificationsEnabled');
    if (storedNotifications) setNotificationsEnabled(storedNotifications === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('notificationsEnabled', notificationsEnabled);
    console.log('Notificações:', notificationsEnabled ? 'Ativadas' : 'Desativadas');
  }, [notificationsEnabled]);

  const toggleNotifications = () => {
    setNotificationsEnabled(prev => !prev);
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* ... outras configurações ... */}
      <NotificationControl enabled={notificationsEnabled} onToggle={toggleNotifications} />
      {/* ... */}
      {/* Em outras páginas/componentes onde você exibe notificações: */}
      { <NotificationDisplayer message={someNotificationMessage} enabled={notificationsEnabled} /> }
    </div>
  );

    console.log('Notificações:', notificationsEnabled ? 'Ativadas' : 'Desativadas');
  }, [notificationsEnabled]);

  useEffect(() => {
    localStorage.setItem('taskSize', taskSize);
    // Aqui você precisaria aplicar a classe CSS correspondente ao tamanho da tarefa
    // em seus componentes de tarefa. Por exemplo, adicionar uma classe como
    // `task-small`, `task-medium`, `task-large` dinamicamente.
    console.log('Tamanho da Tarefa:', taskSize);
  }, [taskSize]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(prev => !prev);
  };

  const handleTaskSizeChange = (event) => {
    setTaskSize(event.target.value);
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-8">Configurações</h1>

      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MoonIcon className="h-6 w-6 mr-2 text-gray-500" />
            <span className="font-semibold">Tema</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              value=""
              className="sr-only peer"
              checked={theme === 'dark'}
              onChange={toggleTheme}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 dark:bg-gray-700 rounded-full peer dark:peer-checked:bg-purple-600 transition-all duration-300"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{theme === 'dark' ? 'Modo escuro' : 'Modo claro'}</span>
          </label>
        </div>
      </div>

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
              checked={notificationsEnabled}
              onChange={toggleNotifications}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 dark:bg-gray-700 rounded-full peer dark:peer-checked:bg-purple-600 transition-all duration-300"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{notificationsEnabled ? 'Permitir' : 'Desativado'}</span>
          </label>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ArrowsExpandIcon className="h-6 w-6 mr-2 text-gray-500" />
            <span className="font-semibold">Tamanho das Tarefas</span>
          </div>
          <select
            value={taskSize}
            onChange={handleTaskSizeChange}
            className="shadow appearance-none border rounded w-auto py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="small">Pequeno</option>
            <option value="medium">Médio</option>
            <option value="large">Grande</option>
          </select>
        </div>
      </div>
    </div>
  );
}