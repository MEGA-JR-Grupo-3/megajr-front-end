
import React, { useEffect } from 'react';

function NotificationDisplayer({ message, type, enabled }) {
  useEffect(() => {
    if (message && enabled) {
      console.log(`Notificação (${type}): ${message}`);
    }
  }, [message, type, enabled]);

  return null;
}

export default NotificationDisplayer;
