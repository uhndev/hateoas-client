
//Service worker used to keep track of notifications and subscription

console.log('Started', self);

self.addEventListener('install', function(event) {
  self.skipWaiting();
});
self.addEventListener('activate', function(event) {
});
self.addEventListener('push', function(event) {
  var title = 'Notes added/updated';
  event.waitUntil(
    self.registration.showNotification(title, {
      body: 'A note has been updated/created',
      icon: '../../../../assets/img/AltumLogo.png',
      tag: 'Notification'
    }));
});
