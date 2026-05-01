import { logError } from '../core/utils.js';

class DetectionService {
	constructor() {
		this.model = null;
		this.labels = [];
		this.config = null;
	}

	// TODO [Basic] Implementasikan metode untuk memuat model TensorFlow.js
	// TODO [Basic] Gunakan validateModelMetadata() untuk memeriksa metadata model
	// TODO [Advance] Gunakan strategi Backend Adaptive seperti yang telah dipelajari sebelumnya
	async loadModel() {
//		const modelURL = './model/model.json';
//		const metadataURL = './model/metadata.json';

		try {
			const modelURL = '../../model/model.json';
			const metadataURL = '../../model/metadata.json'; 

			this.model = await tmImage.load(modelURL, metadataURL);
			this.labels = this.model.getClassLabels();

		} catch (error) {
			logError('Failed to load model', error);
			throw new Error(`Failed to load model: ${error.message}`);
		}
	}

	// TODO [Basic] Implementasikan metode untuk melakukan prediksi pada elemen gambar
	async predict(imageElement) {
		try {
			const predictions = await this.model.predict(imageElement);

			let best = predictions.reduce((prev, curr) =>
				curr.probability > prev.probability ? curr : prev
			);

			return {
				label: best.className,
				confidence: Math.round(best.probability * 100),
				isValid: true
			};
			
		} catch (error) {
			logError('Prediction error', error);
			throw new Error(`Prediksi gagal: ${error.message}`);
		} finally {
			// TODO [Basic] Dispose tensor dan predictions untuk menghindari memory leak
		}
	}

	// TODO [Basic] Periksa apakah model sudah dimuat
	isLoaded() {
		return !!this.model;
	}
}

export default DetectionService;
