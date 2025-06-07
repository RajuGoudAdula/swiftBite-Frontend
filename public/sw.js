// public/sw.js

self.addEventListener('push', function (event) {
  try {
    if (!event.data) return;

    const data = event.data.json();
    const title = data.title || 'New Notification';

    const options = {
      body: data.options?.body || '',
      icon: new URL(data.options?.icon || '/favicon/apple-icon-180x180.png', self.location.origin).href,
      badge: new URL(data.options?.badge || '/favicon/ms-icon-70x70.png', self.location.origin).href,
      vibrate: data.options?.vibrate || [200, 100, 200],
      data: {
        url: new URL(data.options?.data?.url || '/', self.location.origin).href,
        ...data.options?.data,
      },
      actions: data.options?.actions || [
        { action: 'open', title: 'Open App' },
        { action: 'dismiss', title: 'Dismiss' }
      ],
      requireInteraction: true,
    };
    

    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  } catch (err) {
    console.error('Push event error:', err);
  }
});


// ✅ Handle user click on notification or actions
self.addEventListener('notificationclick', function (event) {
  const action = event.action;
  const urlToOpen = event.notification?.data?.url || '/';

  event.notification.close();

  if (action === 'dismiss') return;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        // If app is already open, just focus it
        if (client.url === urlToOpen && 'focus' in client) return client.focus();
      }
      // Otherwise open a new tab
      if (clients.openWindow) return clients.openWindow(urlToOpen);
    })
  );
});
