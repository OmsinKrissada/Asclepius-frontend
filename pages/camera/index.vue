<template>
	<div class="flex flex-col justify-evenly">
		<div class="flex flex-col justify-evenly items-center">
			<HolisticCanvas
				v-if="useMode == 1"
				@holis="onHolis"
				class="border-2 border-black rounded-3xl shadow-xl overflow-hidden"
			/>
			<HandCanvas
				v-else-if="useMode == 2"
				@mh="onMultiHand"
				class="border-2 border-black rounded-3xl shadow-xl overflow-hidden"
			/>
			<h3 v-if="useMode == 0" class="font-krub font-semibold">Choose your translation mode</h3>
			<!-- <div class="text-blue font-bold"> -->
			<div class="m-5 rounded-3xl bg-slate-400 text-white flex justify-center shadow-md">
				<button
					@click="useMode = 1"
					class="px-4 py-2 rounded-3xl hover:bg-slate-600 transition-colors"
					:class="useMode == 1 ? 'bg-slate-500' : ''"
				>
					WORD
				</button>
				<button
					@click="useMode = 2"
					class="px-4 py-2 rounded-3xl hover:bg-slate-600 transition-colors"
					:class="useMode == 2 ? 'bg-slate-500' : ''"
				>
					LETTER
				</button>
			</div>
			<p v-if="guess_str" class="font-mono">{{ guess_str }} {{ guess_confidence }}%</p>
			<!-- </div> -->
		</div>
		<div class="m-10">
			<h3 class="font-krub text-xl font-bold">Transcription</h3>
			<p class="p-5 bg-gray-100 font-mitr border-turmeric border-2 break-words">
				{{ transcription }}
			</p>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { io, Socket } from "socket.io-client";

@Component
export default class Camera extends Vue {
	useMode = 0;
	transcription = "";
	guess_str: string | null = null;
	guess_confidence: number | null = null;

	letter_predictions: string[] = [];
	word_predictions: string[] = [];
	latest_letter_prediction = "";
	latest_word_prediction = "";

	socket?: Socket;

	mounted() {
		// console.log(`ws://${this.hostParts[0]}:${this.$config.wsPort}`);
		const fullUrl: string = this.$config.wsHost;
		const protocol = fullUrl.match(/https?:\/\//)?.shift();
		const [hostname, ...path] = fullUrl.slice(protocol?.length ?? 0).split("/");
		this.socket = io(`${protocol}${hostname}:${this.$config.wsPort}`, {
			path: "/" + (path.join("/") || "socket.io"),
		});
		this.socket.on("letter", ({ letter, confidence }) => {
			console.log(`Received character: ${letter}`);
			this.guess_str = letter;
			this.guess_confidence = confidence * 100;
			this.letter_predictions.push(letter);
			this.letter_predictions = this.letter_predictions.slice(-5);

			if (
				this.letter_predictions.length >= 5 &&
				this.letter_predictions.every((p) => p === this.letter_predictions[0])
			) {
				if (letter != this.latest_letter_prediction) {
					this.transcription += letter;
				}
				this.latest_letter_prediction = letter;
			}
		});
		this.socket.on("word", ({ word, confidence }) => {
			console.log(`Received character: ${word}`);
			this.guess_str = word;
			this.guess_confidence = confidence * 100;
			this.word_predictions.push(word);
			this.word_predictions = this.word_predictions.slice(-5);

			if (
				this.word_predictions.length >= 5 &&
				this.word_predictions.every((p) => p === this.word_predictions[0])
			) {
				if (word != this.latest_word_prediction) {
					this.transcription += word;
				}
				this.latest_word_prediction = word;
			}
		});
	}

	onHolis(result: any) {
		this.socket!.emit("holis", result);
	}

	onMultiHand(landmarks: string[]) {
		this.socket!.emit("mh", landmarks);
	}

	beforeDestroy() {
		this.socket!.close();
	}
}
</script>

<style lang="scss" scoped>
// .container {
//   position: absolute;
//   background-color: #596e73;
//   width: 100%;
//   max-height: 100%;
// }

// .input_video {
//   display: none;
//   position: absolute;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   &.selfie {
//     transform: scale(-1, 1);
//   }
// }

// .input_image {
//   position: absolute;
// }

// .canvas-container {
//   display: flex;
//   height: 100%;
//   width: 100%;
//   justify-content: center;
//   align-items: center;
//   //   transform: scale(-1, 1);
// }

// #cam-container{
//   min-width: 80vw;
//   min-height:80vh;
// }
</style>
