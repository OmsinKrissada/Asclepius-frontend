<template>
	<div class="flex flex-col justify-evenly">
		<div class="flex flex-col justify-evenly items-center sm:flex-row">
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
			<div class="text-blue font-bold">
				<p>ASL Mode</p>
				<div>
					<button @click="useMode = 1">WORD</button>
					<button @click="useMode = 2">LETTER</button>
					<p>{{ `ws://${hostParts[0]}:${$config.wsPort}` }}</p>
					<p>{{ hostParts.slice(1).join("/") }}</p>
				</div>
				<p v-if="guess_letter">{{ guess_letter }} {{ guess_confidence }}%</p>
			</div>
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
	guess_letter: string | null = null;
	guess_confidence: number | null = null;

	hostParts: string[] = this.$config.wsHost.split("/");
	socket?: Socket;

	mounted() {
		console.log(`ws://${this.hostParts[0]}:${this.$config.wsPort}`);
		this.socket = io(`ws://${this.hostParts[0]}:${this.$config.wsPort}`, {
			path: "/" + (this.hostParts.slice(1).join("/") || "socket.io"),
		});
		this.socket.on("char", (char) => {
			this.transcription += char;
			console.log(`Received character: ${char}`);
		});
		this.socket.on("word", (word) => {
			this.transcription += " " + word;
			console.log(`Received word: ${word}`);
		});
		this.socket.on("guess", (guess) => {
			this.guess_letter = guess.letter;
			this.guess_confidence = guess.confidence * 100;
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
