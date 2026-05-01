import UIHandler from '../ui/ui.handler.js';
import { APP_CONFIG } from './config.js';
import { logError } from './utils.js';

class RootFactsApp {
	constructor() {
		this.detector = null;
		this.camera = null;
		this.funFactGenerator = null;
		this.ui = new UIHandler();
		this.isRunning = false;
		this.currentLoopId = null;
		this.config = APP_CONFIG;
		this.currentFunFact = '';
		this.currentTone = 'normal';

		// TODO [Advanced] Tambahkan properti untuk tone yang dipilih

		this.ui.disableButton();

		this.bindEvents();
		this.init();
		this.registerServiceWorker();	// TODO [Basic] Panggil registerServiceWorker()
	}

	// TODO [Basic] Bind toggle camera event dengan nama onToggleCamera
	// TODO [Basic] Bind camera change event dengan nama onCameraChange
	// TODO [Skilled] Bind FPS change event dengan nama onFPSChange
	// TODO [Skilled] Bind copy fun fact event dengan nama onCopy
	// TODO [Advanced] Bind tone change event dengan nama onToneChange
	bindEvents() {
		this.ui.bindEvents({
			onToggleCamera: this.toggleCamera.bind(this),
			onToneChange: (tone) => {
				this.currentTone = tone;
			}
		});
	}
	
	// TODO [Skilled] Perbarui status header UI menjadi 'Memuat model...' saat memulai inisialisasi
	// TODO [Basic] Lengkapi inisialisasi kemampuan aplikasi
	// TODO [Skilled] Perbarui status header UI menjadi 'Siap'
	async init() {
		try {
			this.ui.updateHeaderStatus('Memuat model...', true);

			this.camera = new (await import('../services/camera.service.js')).default();
			this.detector = new (await import('../services/detection.service.js')).default();
			this.funFactGenerator = new (await import('../services/facts.service.js')).default();

			await this.detector.loadModel();
			await this.funFactGenerator.loadModel();

			this.ui.updateHeaderStatus('Siap', true);
			this.ui.enableButton();
		} catch (error) {
			logError('Gagal menginisialisasi aplikasi', error);
			// TODO [Skilled] Perbarui status header UI menjadi 'Error' jika inisialisasi gagal
			this.ui.updateHeaderStatus('Error', false);
			// this.ui.showError(`Gagal menginisialisasi: ${error.message}`);
			// this.ui.disableButton();
		}
	}


	// TODO [Basic] Buatlah berkas sw.js di root project dan konfigurasikan precaching di dalamnya menggunakan Workbox
	// TODO [Basic] Registrasikan Service Worker

	registerServiceWorker() {
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.register('/sw.js')
				.then(() => console.log('Service Worker registered'))
				.catch(err => console.error('SW gagal', err));
		}
	}

	// TODO [Skilled] Buatlah metode untuk menyalin fun fact ke clipboard

	// TODO [Basic] Implementasikan metode untuk mengaktifkan atau menonaktifkan kamera
	async toggleCamera() {
		if (this.camera.isActive()) {
			this.stopCamera();
		} else {
			await this.startCamera();
		}
	}

	// TODO [Basic] Implementasikan metode untuk memulai kamera
	async startCamera() {
		await this.camera.startCamera();
		this.startDetection();
	}

	// TODO [Basic] Implementasikan metode untuk menghentikan kamera
	stopCamera() {
		this.stopDetection();
		this.camera.stopCamera();
	}

	// TODO [Basic] Implementasikan metode untuk memulai deteksi
	startDetection() {
		this.isRunning = true;
		this.currentLoopId = Date.now();
		this.detectLoop(this.currentLoopId);
	}

	// TODO [Basic] Implementasikan metode untuk menghentikan deteksi
	stopDetection() {}

	// TODO [Basic] Implementasikan metode deteksi utama
	async detectLoop(loopId) {
		if (!this.isRunning || loopId !== this.currentLoopId) return;

		if (this.camera.isReady()) {
			const result = await this.detector.predict(this.camera.video);

			if (result.confidence > 70) {
				await this.generateAndShowResults(result);
			}
		}

		requestAnimationFrame(() => this.detectLoop(loopId));
	}

	// TODO [Basic] Implementasikan metode untuk menghasilkan dan menampilkan fun fact
//	async generateAndShowResults(detectionResult) {
//		try { } catch (error) {
//			logError('Gagal menampilkan hasil', error);
//			this.ui.updateFunFactState('error');
//		}
//	}

	async generateAndShowResults(result) {
		try {
			this.ui.switchToState('loading');

			const fact = await this.funFactGenerator.generateFunFact(
				result.label,
				this.currentTone
			);

			this.ui.showResults(
				{
					className: result.label,
					confidence: result.confidence
				},
				{ funFact: fact }
			);

		} catch (error) {
			logError('Gagal menampilkan hasil', error);
		}
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const app = new RootFactsApp();

	if (typeof lucide !== 'undefined') {
		lucide.createIcons();
	}
});

export default RootFactsApp;
