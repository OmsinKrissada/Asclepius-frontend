<template>
	<div class="flex flex-col justify-evenly">
		<div v-if="media_error">
			<p class="m-2 text-3xl text-center font-mitr">{{ media_error }}</p>
			<p class="m-5 text-lg text-center font-inter">Press reload if you think the problem is fixed.</p>
			<button
				@click="reload"
				class="block mx-auto mt-10 px-8 py-3 rounded-lg bg-teal-500 font-fahkwang text-white shadow-xl shadow-teal-300/30 hover:shadow-teal-600/40 hover:bg-teal-600 transition-all"
			>
				RELOAD NOW
			</button>
		</div>
		<div v-if="!media_error" class="flex flex-col justify-evenly items-center">
			<Canvas
				v-if="useMode"
				:mode="useMode % 2 == 0 ? 'hand' : 'holistic'"
				@holis="onHolisOutput"
				@mh="onHandOutput"
				class="border-2 border-black rounded-3xl shadow-xl overflow-hidden"
			/>
			<h3 v-if="useMode == 0" class="font-krub font-semibold">Choose your translation mode</h3>
			<div class="m-5 rounded-3xl bg-slate-400 text-white flex justify-center shadow-md">
				<button
					@click="useMode = 1"
					class="px-4 py-2 rounded-3xl hover:bg-slate-600 font-semibold transition-colors"
					:class="useMode == 1 ? 'bg-slate-500' : ''"
				>
					WORD
				</button>
				<button
					@click="useMode = 2"
					class="px-4 py-2 rounded-3xl hover:bg-slate-600 font-semibold transition-colors"
					:class="useMode == 2 ? 'bg-slate-500' : ''"
				>
					LETTER
				</button>
				<button
					@click="useMode = 3"
					class="px-4 py-2 rounded-3xl hover:bg-slate-600 font-semibold transition-colors"
					:class="useMode == 3 ? 'bg-slate-500' : ''"
				>
					ILLNESS
				</button>
				<button
					@click="useMode = 4"
					class="px-4 py-2 rounded-3xl hover:bg-slate-600 font-semibold transition-colors"
					:class="useMode == 4 ? 'bg-slate-500' : ''"
				>
					NUMBER
				</button>
			</div>
			<p v-if="guess_str != null" class="font-mono">{{ guess_str }} {{ guess_confidence.toFixed(2) }}%</p>
			<!-- </div> -->
		</div>
		<div v-if="!media_error" class="m-10">
			<!-- <h3 class="font-krub text-xl font-bold">Transcription</h3> -->
			<p class="p-5 border-turmeric border-2 bg-gray-100 font-inter break-words text-6xl">
				{{ transcription }}
			</p>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { io, Socket } from "socket.io-client";
import DetectRTC from "detectrtc";

@Component
export default class Camera extends Vue {
	[x: string]: any;
	useMode = 0;
	transcription = "";
	guess_str: string | null = null;
	guess_confidence: number | null = null;

	letter_predictions: string[] = [];
	word_predictions: string[] = [];
	latest_letter_prediction = "";
	latest_word_prediction = "";

	socket?: Socket;

	media_error = "";

	checkMediaPerm() {
		if (DetectRTC.hasWebcam) {
			if (!DetectRTC.isWebsiteHasWebcamPermissions) {
				this.media_error = "Please allow camera permission on your web browser.";
				navigator.mediaDevices
					.getUserMedia({ video: true })
					.then((stream) => {
						this.media_error = "";
						stream.getTracks()[0].stop();
					})
					.catch(() => {
						this.media_error = "Please allow camera permission on your web browser.";
					});
			}
		} else {
			this.media_error = "Unfortunately, we do not detect webcam on your browser.";
			navigator.mediaDevices
				.getUserMedia({ video: true })
				.then(() => location.reload())
				.catch(() => {
					this.media_error = "Please allow camera permission on your web browser.";
				});
		}
	}

	reload() {
		location.reload();
	}

	async mounted() {
		DetectRTC.load(this.checkMediaPerm);

		// Handle socket.io internal functions
		this.socket = this.$nuxtSocket({
			path: this.$config.wsPath,
			reconnection: true,
			reconnectionAttempts: Infinity,
			reconnectionDelay: 1000,
			reconnectionDelayMax: 5000,
		});
		if (!this.socket) {
			console.error("Socket not initialized");
			return;
		}
		this.socket.on("connect_error", (err) => {
			this.$toast.error(`socket.io failed: ${err}`, {
				position: "bottom-right",
				duration: 5000,
				iconPack: "fontawesome",
				icon: "camera",
				containerClass: "toast",
			});
		});
		this.socket.on("connect", () => {
			console.log("Connected to socket.io server");
			this.$toast.success(`Connected to server`, {
				position: "bottom-right",
				duration: 3000,
				iconPack: "fontawesome",
				icon: "camera",
				containerClass: "toast",
			});
		});
		this.socket.on("disconnect", () => {
			this.$toast.error(`Disconnected from server`, {
				position: "bottom-right",
				duration: 5000,
				iconPack: "fontawesome",
				icon: "camera",
				containerClass: "toast",
			});
		});

		// User-defined events
		this.socket.on("letter", ({ letter, confidence }) => {
			console.log(`Received letter: ${letter}`);
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
			console.log(`Received word: ${word}`);
			this.guess_str = word;
			this.guess_confidence = confidence * 100;
			this.word_predictions.push(word);
			this.word_predictions = this.word_predictions.slice(-5);

			if (
				this.word_predictions.length >= 5 &&
				this.word_predictions.every((p) => p === this.word_predictions[0])
			) {
				if (word != this.latest_word_prediction) {
					this.transcription += word + " ";
				}
				this.latest_word_prediction = word;
			}
		});
	}

	onHolisOutput(result: any) {
		if (this.useMode == 1) this.socket!.emit("holis_word", result);
		else if (this.useMode == 3) this.socket!.emit("holis_ill", result);
	}

	onHandOutput(result: any) {
		if (this.useMode == 2) this.socket!.emit("mh_letter", result);
		else if (this.useMode == 4) this.socket!.emit("mh_num", result);
	}

	beforeDestroy() {
		console.log("Closing socket.io client");
		if (this.socket?.connected) {
			this.socket.close();
		}
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
