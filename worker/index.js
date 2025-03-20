self.addEventListener('push', (event) => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/logo.png',
  });
});


self.addEventListener('notificationclick', function (event) { 
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }
        return client.focus();
      }
      return clients.openWindow('/');
    })
  )
});


self.addEventListener('pushsubscriptionchange', function (event) {
  const conv = (val) =>
    self.btoa(String.fromCharCode.apply(null, new Uint8Array(val))
  );

  const getPayload = (subscription) => ({
    endpoint: subscription.endpoint,
    keys: {
      auth: conv(subscription.getKey('auth')),
      p256dh: conv(subscription.getKey('p256dh')),
    }
  });

  const subscription = self.registration.pushManager
    .subscribe(event.oldSubscription.options)
    .then((subscription) => {
      fetch('api/notification/webpush/subscription', {
        method: 'put',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          old: getPayload(event.oldSubscription),
          new: getPayload(subscription),
        }),
      });
      console.log('Subscription has been renewed after expired.');
    });

  event.waitUntil(subscription);
}, false);