import { logError } from '../core/utils.js';

class FunFactService {
	constructor() {
		this.isModelLoaded = false;
		this.isGenerating = false;
	}

	// Simulasi load model AI
	async loadModel() {
		try {
			await new Promise(resolve => setTimeout(resolve, 800));

			this.isModelLoaded = true;

		} catch (error) {
			logError('Error loading fun fact model', error);
			throw new Error(`Failed to load FunFact model: ${error.message}`);
		}
	}

	// Generate fun fact aman & relevan
	async generateFunFact(vegetable, tone = 'normal') {
		if (!this.isModelLoaded || this.isGenerating) {
			throw new Error('Model belum siap');
		}

		this.isGenerating = true;

		try {
			// Sanitasi input
			const cleanVeg = vegetable
				.replace(/[^a-zA-Z ]/g, '')
				.trim();

			// Database fakta aman
			const factsDatabase = {
				Broccoli: {
					normal: 'Brokoli kaya vitamin C dan baik untuk daya tahan tubuh.',
					funny: 'Brokoli mungkin hijau dan kecil, tapi gizinya luar biasa 😄',
					professional: 'Brokoli mengandung antioksidan dan nutrisi penting untuk kesehatan.',
					casual: 'Brokoli enak dimasak tumis dan sehat buat tubuh!'
				},

				Carrot: {
					normal: 'Wortel mengandung beta karoten yang baik untuk kesehatan mata.',
					funny: 'Katanya makan wortel bikin mata makin tajam 👀',
					professional: 'Wortel merupakan sumber vitamin A yang sangat baik.',
					casual: 'Wortel cocok dijadikan sup atau camilan sehat.'
				},

				Tomato: {
					normal: 'Tomat mengandung likopen yang baik untuk kesehatan jantung.',
					funny: 'Tomat itu buah yang sering menyamar jadi sayur 🍅',
					professional: 'Tomat kaya antioksidan dan baik untuk metabolisme tubuh.',
					casual: 'Tomat segar enak banget buat sambal atau salad.'
				},

				Potato: {
					normal: 'Kentang merupakan sumber energi karena kaya karbohidrat.',
					funny: 'Kentang bisa jadi french fries favorit semua orang 🍟',
					professional: 'Kentang menyediakan karbohidrat kompleks untuk energi.',
					casual: 'Kentang gampang diolah jadi banyak makanan enak.'
				},

				Cabbage: {
					normal: 'Kubis kaya serat dan baik untuk sistem pencernaan.',
					funny: 'Kubis sering diremehkan padahal gizinya keren 😎',
					professional: 'Kubis mengandung vitamin dan serat penting bagi tubuh.',
					casual: 'Kubis cocok buat tumisan dan makanan rumahan.'
				},

				Vegetable: {
					normal: 'Sayuran mengandung banyak vitamin dan mineral penting.',
					funny: 'Makan sayur bikin tubuh lebih happy 🥦',
					professional: 'Sayuran penting untuk pola makan sehat dan seimbang.',
					casual: 'Rajin makan sayur bikin badan lebih segar.'
				}
			};

			// Cari fakta sesuai label
			const vegData = factsDatabase[cleanVeg] || factsDatabase['Vegetable'];

			// Pilih tone
			const fact = vegData[tone] || vegData.normal;

			// Simulasi proses AI
			await new Promise(resolve => setTimeout(resolve, 500));

			return fact;

		} catch (error) {
			logError('Generate fun fact error', error);
			return 'Sayuran sangat baik untuk kesehatan tubuh.';
		} finally {
			this.isGenerating = false;
		}
	}

	// Status model
	isReady() {
		return this.isModelLoaded && !this.isGenerating;
	}
}

export default FunFactService;