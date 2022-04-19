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
				:camId="currentSourceId"
				@holis="onHolisOutput"
				@mh="onHandOutput"
				@ready="ready = true"
				class="border-2 border-black rounded-3xl shadow-xl overflow-hidden"
			/>
			<div v-if="useMode != 0" class="relative mt-3">
				<select
					name="cam"
					@change="changeSource"
					:disabled="!ready"
					class="h-10 pl-3 pr-6 text-base placeholder-gray-600 border rounded-lg appearance-none focus:shadow-outline"
				>
					<option v-for="cam in cameras" :key="cam.deviceId" :value="cam.deviceId">{{ cam.label }}</option>
				</select>
				<div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
					<svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
						<path
							d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
							clip-rule="evenodd"
							fill-rule="evenodd"
						></path>
					</svg>
				</div>
			</div>
			<h3 v-if="useMode == 0" class="font-krub font-semibold">Choose your translation mode</h3>
			<div class="m-5 rounded-3xl bg-slate-400 text-white flex justify-center shadow-md">
				<button
					@click="useMode = 1"
					class="px-4 py-2 rounded-3xl hover:bg-slate-500 font-semibold transition-colors"
					:class="useMode == 1 ? 'bg-slate-600' : ''"
				>
					WORD
				</button>
				<button
					@click="useMode = 2"
					class="px-4 py-2 rounded-3xl hover:bg-slate-500 font-semibold transition-colors"
					:class="useMode == 2 ? 'bg-slate-600' : ''"
				>
					LETTER
				</button>
				<button
					@click="useMode = 3"
					class="px-4 py-2 rounded-3xl hover:bg-slate-500 font-semibold transition-colors"
					:class="useMode == 3 ? 'bg-slate-600' : ''"
				>
					ILLNESS
				</button>
				<button
					@click="useMode = 4"
					class="px-4 py-2 rounded-3xl hover:bg-slate-500 font-semibold transition-colors"
					:class="useMode == 4 ? 'bg-slate-600' : ''"
				>
					NUMBER
				</button>
			</div>
			<p v-if="guess_str != null" class="font-mono">{{ guess_str }} {{ guess_confidence.toFixed(2) }}%</p>
		</div>
		<div v-if="useMode" class="md:m-10">
			<div
				class="p-5 self-stretch md:w-auto md:rounded-lg border-turmeric bg-orange-300/5 text-amber-700/20 font-extrabold font-inter text-6xl whitespace-nowrap overflow-hidden"
			>
				<span v-for="(chunk, i) in previous_transcription" :key="i" :class="isNaN(chunk) ? 'ml-5' : ''">{{
					chunk
				}}</span>
			</div>
			<div
				ref="transcription"
				class="p-5 self-stretch md:w-auto md:rounded-lg border-turmeric bg-orange-300/20 shadow-amber-700/60 shadow-md text-amber-700 font-extrabold font-inter text-6xl whitespace-nowrap overflow-hidden"
			>
				<span v-for="(chunk, i) in transcription.slice(0, -1)" :key="i" :class="isNaN(chunk) ? 'ml-5' : ''">{{
					chunk
				}}</span>
				<span class="text-amber-600" :class="current_type == 'letter' ? '' : 'ml-5'">{{ latest }}</span>
				<span></span>
			</div>
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
	cameras: MediaDeviceInfo[] = [];
	currentSourceId: string = "";
	useMode = 0;
	previous_transcription: string[] = [];
	transcription: string[] = [];
	guess_str: string | null = null;
	guess_confidence: number | null = null;

	letter_predictions: string[] = [];
	word_predictions: string[] = [];
	latest = "";
	current_type = "";

	socket?: Socket;

	media_error = "";

	changeSource(event: any) {
		this.currentSourceId = event.target.value;
		console.log("changeSource() " + event.target.value);
	}

	isOverflowing() {
		var element = this.$refs.transcription as HTMLParagraphElement;
		if (!element) {
			// this.$toast.error(`Cannot find transcription element`, {
			// 	position: "bottom-right",
			// 	duration: 5000,
			// 	iconPack: "fontawesome",
			// 	icon: "camera",
			// 	containerClass: "toast",
			// });
			console.warn("Cannot find transcription element");
			return;
		}
		return element.offsetHeight < element.scrollHeight || element.offsetWidth < element.scrollWidth;
	}

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
			} else {
				navigator.mediaDevices.enumerateDevices().then((devices) => {
					this.cameras = devices.filter((device) => device.kind === "videoinput");
					this.currentSourceId = this.cameras[0].deviceId;
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

	updated() {
		if (this.isOverflowing()) {
			this.previous_transcription = this.transcription.slice(0, -1);
			this.transcription = [this.latest];
		}
	}

	async mounted() {
		if (!localStorage.getItem("endpoint")) localStorage.setItem("endpoint", "main");
		DetectRTC.load(this.checkMediaPerm);

		// Handle socket.io internal functions
		this.socket = this.$nuxtSocket({
			name: localStorage.getItem("endpoint"),
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
				if (letter != this.latest) {
					this.transcription.push(letter);
					this.current_type = "letter";
					this.latest = letter;
				}
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
				if (word != this.latest) {
					this.transcription.push(word);
					this.current_type = "word";
					this.latest = word;
				}
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
