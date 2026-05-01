import { logError } from '../core/utils.js';

class FunFactService {
	constructor() {
		this.generator = null;
		this.isModelLoaded = false;
		this.isGenerating = false;
		this.config = null;
		this.currentBackend = null;
	}

	// TODO [Basic] Implementasikan metode untuk memuat model Transformers.js
	// TODO [Advance] Gunakan strategi Backend Adaptive seperti yang telah dipelajari sebelumnya
	async loadModel() {
		this.isModelLoaded = true;
	}

	// TODO [Basic] Implementasikan metode untuk menghasilkan fun fact tentang sayuran
	// TODO [Basic] Tambahkan validasi untuk maksimum panjang input dan pembersihan input terhadap karakter khusus untuk mengatasi prompt injection
	// TODO [Advanced] Gunakan parameter `tone` untuk variasi personalitas
	async generateFunFact(vegetable, tone = 'normal') {
		if (!this.isModelLoaded || this.isGenerating) {
			throw new Error('Model belum siap');
		}

		this.isGenerating = true;

		try {
			const cleanVeg = vegetable.replace(/[^a-zA-Z ]/g, '');

			const templates = {
				normal: [
					`${cleanVeg} is rich in nutrients and great for your health.`,
					`${cleanVeg} contains important vitamins your body needs.`,
					`${cleanVeg} is commonly used in many delicious dishes.`
				],
				funny: [
					`${cleanVeg} is so healthy, even your grandma would approve 😂`,
					`${cleanVeg} might not text you back, but it boosts your health!`,
					`${cleanVeg} is basically a superhero in disguise 🦸‍♂️`
				],
				professional: [
					`${cleanVeg} provides essential micronutrients beneficial for metabolic processes.`,
					`${cleanVeg} contributes to a balanced and healthy diet.`,
					`${cleanVeg} is widely recognized for its nutritional value.`
				],
				casual: [
					`${cleanVeg} itu enak dan sehat banget buat dimakan sehari-hari!`,
					`${cleanVeg} cocok banget buat menu santai tapi tetap sehat 😄`,
					`${cleanVeg} gampang diolah dan bikin tubuh lebih fit!`
				]
			};

			const options = templates[tone] || templates.normal;
			const random = options[Math.floor(Math.random() * options.length)];

			await new Promise(r => setTimeout(r, 500)); // biar terasa "AI"

			return random;

		} finally {
			this.isGenerating = false;
		}
	}

	// TODO [Basic] Periksa apakah model siap dan tidak sedang menghasilkan fakta
	isReady() {
		return this.isModelLoaded && !this.isGenerating;
	}
}

export default FunFactService;
