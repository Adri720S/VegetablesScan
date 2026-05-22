import { logError } from '../core/utils.js';

class FunFactService {
	constructor() {
		this.generator = null;
		this.isModelLoaded = false;
		this.isGenerating = false;
	}

	// Load model Generative AI
	async loadModel(progressCallback = null) {
		try {
			// ambil pipeline dari global window
			const pipeline = window.pipeline;

			if (!pipeline) {
				throw new Error('Transformers pipeline tidak ditemukan');
			}

			// callback progress loading
			this.generator = await pipeline(
				'text-generation',
				'Xenova/distilgpt2',
				{
					progress_callback: (progress) => {
						if (progressCallback && progress.progress) {
							progressCallback(Math.round(progress.progress * 100));
						}
					}
				}
			);

			this.isModelLoaded = true;

			console.log('✅ Generative AI model loaded');
		} catch (error) {
			logError('❌ Error loading AI model:', error);
			throw new Error(`Failed to load FunFact model: ${error.message}`);
		}
	}

	// Generate AI Fun Fact
	async generateFunFact(vegetable, tone = 'normal') {
		if (!this.isModelLoaded || this.isGenerating) {
			throw new Error('Model belum siap');
		}

		this.isGenerating = true;

		try {
			// sanitasi input
			const cleanVeg = vegetable
				.replace(/[^a-zA-Z ]/g, '')
				.trim()
				.substring(0, 30);

			if (!cleanVeg) {
				throw new Error('Input sayuran tidak valid');
			}

			// variasi tone prompt
			const tones = {
				normal: 'Give a short fun fact about',
				funny: 'Give a funny fun fact about',
				professional: 'Give a professional nutrition fact about',
				casual: 'Give a casual fun fact about'
			};

			const basePrompt =
				tones[tone] || tones.normal;

			const prompt = `${basePrompt} ${cleanVeg} in 1 short sentence.`;

			console.log('PROMPT:', prompt);

			// generate text AI
			const result = await this.generator(prompt, {
				max_new_tokens: 30,
				temperature: 0.7,
				do_sample: true,
				top_k: 50,
				top_p: 0.95
			});

			console.log(result);

			let generatedText = result[0].generated_text;

			// hapus prompt dari output
			generatedText = generatedText.replace(prompt, '').trim();

			// fallback kalau output kosong
			if (!generatedText) {
				generatedText = `${cleanVeg} is healthy and rich in nutrients.`;
			}

			// filter kata sensitif
			const bannedWords = [
				'atheist',
				'religion',
				'racist',
				'violence',
				'politics'
			];

			const containsBadWord = bannedWords.some(word =>
				generatedText.toLowerCase().includes(word)
			);

			if (containsBadWord) {
				generatedText = `${cleanVeg} contains beneficial nutrients for the body.`;
			}

			return generatedText;

		} catch (error) {
			logError('❌ Error generating fun fact:', error);

			return `${vegetable} is a nutritious vegetable that is good for your health.`;

		} finally {
			this.isGenerating = false;
		}
	}

	isReady() {
		return this.isModelLoaded && !this.isGenerating;
	}
}

export default FunFactService;