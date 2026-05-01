import {
	getCameraErrorMessage,
	logError
} from '../core/utils.js';

class CameraService {
	constructor() {
		this.stream = null;
		this.video = null;
		this.canvas = null;
		this.config = null;

		this.initializeElements();
		this.init();
	}

	// TODO [Basic] Implementasikan metode untuk menginisialisasi elemen DOM yang diperlukan
	initializeElements() {
		this.video = document.getElementById('videoElement');
		this.canvas = document.getElementById('canvasElement');
	}

	async init() {
		await this.loadCameras();
	}

	// TODO [Basic] Implementasikan metode untuk memuat daftar kamera yang tersedia
	async loadCameras() {
		const devices = await navigator.mediaDevices.enumerateDevices();
		this.cameras = devices.filter(d => d.kind === 'videoinput');

		try { } catch (error) {
			logError('Gagal memuat kamera', error);
			throw new Error(`Akses kamera gagal: ${error.message}`);
		}
	}

	// TODO [Basic] Implementasikan metode untuk memulai kamera dengan constraints yang sesuai
	async startCamera(deviceId = null) {
		const constraints = {
			video: deviceId
				? { deviceId: { exact: deviceId } }
				: { facingMode: 'environment' }
		};

		this.stream = await navigator.mediaDevices.getUserMedia(constraints);
		this.video.srcObject = this.stream;

		await this.video.play();

		try { } catch (error) {
			logError('Gagal memulai kamera', error);
			const errorMessage = getCameraErrorMessage(error);
			throw new Error(errorMessage);
		}
	}

	// TODO [Basic] Implementasikan metode untuk menghentikan kamera
	stopCamera() {
		if (this.stream) {
			this.stream.getTracks().forEach(track => track.stop());
			this.stream = null;
		}
	}

	// TODO [Skilled] Implementasikan metode untuk mengatur FPS kamera
	setFPS(fps) {}

	// TODO [Basic] Periksa apakah kamera sedang aktif
	isActive() {
		return !!this.stream;
	}

	// TODO [Basic] Periksa apakah kamera siap untuk digunakan
	isReady() {
		return this.video && this.video.readyState === 4;
	}
}

export default CameraService;
