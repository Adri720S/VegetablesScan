const CACHE_NAME = 'rootfacts-v1';

const urlsToCache = [
	'/',
	'/index.html',
	'/manifest.json',
	'/assets/css/styles.css',
	'/assets/js/core/app.js',
	'/assets/js/core/config.js',
	'/assets/js/core/utils.js',
	'/assets/js/services/camera.service.js',
	'/assets/js/services/detection.service.js',
	'/assets/js/services/facts.service.js',
	'/assets/js/ui/ui.handler.js',
	'/model/model.json',
	'/model/metadata.json'
];

// INSTALL
self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then(cache => cache.addAll(urlsToCache))
	);
});

// ACTIVATE
self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then(keys =>
			Promise.all(
				keys.map(key => {
					if (key !== CACHE_NAME) {
						return caches.delete(key);
					}
				})
			)
		)
	);
});

// FETCH
self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches.match(event.request)
			.then(response => response || fetch(event.request))
	);
});