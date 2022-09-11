<script setup lang="ts">
import { io, Socket } from "socket.io-client";
import DetectRTC from "detectrtc";
import { notify } from '@kyvg/vue3-notification';

const endpoint = useLocalStorage('endpoint', 'main');
const config = useRuntimeConfig().public;

const useMode = ref(0);
const isCanvasReady = ref(false);

function changeSource(event: any) {
	this.currentSourceId = event.target.value;
	console.log("changeSource() " + event.target.value);
}

const transcriptionElement = ref<HTMLDivElement>(null);
function isOverflowing() {
	if (!transcriptionElement) {
		console.warn("Cannot find transcription element");
		return;
	}
	return transcriptionElement.value.offsetHeight < transcriptionElement.value.scrollHeight || transcriptionElement.value.offsetWidth < transcriptionElement.value.scrollWidth;
}

function reload() {
	location.reload();
}

function updated() {
	if (isOverflowing()) {
		previousTranscription.value = transcription.value.slice(0, -1);
		transcription.value = [latest.value];
	}
}

const mediaError = ref('');
const selectedSourceId = ref('');
const cameras = ref<MediaDeviceInfo[]>([]);
function checkMediaPerm() {
	if (DetectRTC.hasWebcam) {
		if (!DetectRTC.isWebsiteHasWebcamPermissions) {
			mediaError.value = "Please allow camera permission on your web browser.";
			navigator.mediaDevices
				.getUserMedia({ video: true })
				.then((stream) => {
					mediaError.value = "";
					stream.getTracks()[0].stop();
				})
				.catch(() => {
					mediaError.value = "Please allow camera permission on your web browser.";
				});
		} else {
			navigator.mediaDevices.enumerateDevices().then((devices) => {
				cameras.value = devices.filter((device) => device.kind === "videoinput");
				selectedSourceId.value = cameras.value[0].deviceId;
			});
		}
	} else {
		mediaError.value = "Unfortunately, we do not detect webcam on your browser.";
		navigator.mediaDevices
			.getUserMedia({ video: true })
			.then(() => location.reload())
			.catch(() => {
				mediaError.value = "Please allow camera permission on your web browser.";
			});
	}
}

const guess = reactive<{ str: string, confidence: number; }>({ str: '', confidence: 0 });
const transcription = ref<string[]>([]);
const previousTranscription = ref([]);
const latest = ref('');
const currentType = ref('');

const letter_predictions = ref<string[]>([]);
function addLetter(letter: string, confidence: number) {
	console.debug(`Received letter: ${letter}`);
	guess.str = letter;
	guess.confidence = confidence * 100;
	letter_predictions.value.push(letter);
	letter_predictions.value = letter_predictions.value.slice(-5);

	if (
		letter_predictions.value.length >= 5 &&
		letter_predictions.value.every((p) => p === letter_predictions.value[0])
	) {
		if (letter != latest.value) {
			transcription.value.push(letter);
			currentType.value = "letter";
			latest.value = letter;
		}
	}
}

const word_predictions = ref<string[]>([]);
function addWord(word: string, confidence: number) {
	console.debug(`Received word: ${word}`);
	guess.str = word;
	guess.confidence = confidence * 100;
	word_predictions.value.push(word);
	word_predictions.value = word_predictions.value.slice(-5);

	if (
		word_predictions.value.length >= 5 &&
		word_predictions.value.every((p) => p === word_predictions[0])
	) {
		if (word != latest.value) {
			transcription.value.push(word);
			currentType.value = "word";
			latest.value = word;
		}
	}
}

const socket = io(`${config.wsHost}:${config.wsPort}`, { port: 8081, path: config.wsPath });
onMounted(() => {
	DetectRTC.load(checkMediaPerm);
	socket.connect();

	// Handle socket.io internal functions
	socket.on("connect_error", (err) => {
		notify({
			title: `WebSocket failed: ${err}`,
			type: 'error'
		});
	});
	socket.on("connect", () => {
		console.log("Connected to socket.io server");
		notify({
			title: `WebSocket connected`
		});
	});
	socket.on("disconnect", () => {
		notify({
			title: `Disconnected from server`,
			type: 'error'
		});
	});

	// User-defined events
	socket.on("letter", ({ letter, confidence }) => {
		addLetter(letter, confidence);
		updated();
	});
	socket.on("word", ({ word, confidence }) => {
		addWord(word, confidence);
		updated();
	});
});

function onHolisOutput(result: any) {
	if (useMode.value === 1) socket.emit("holis_word", result);
	else if (useMode.value === 3) socket.emit("holis_ill", result);
}

function onHandOutput(result: any) {
	if (useMode.value === 2) socket.emit("mh_letter", result);
	else if (useMode.value === 4) socket.emit("mh_num", result);
}

onBeforeUnmount(() => {
	console.log("Closing socket.io client");
	socket.disconnect();
});
</script>

<template>
	<div class="flex-grow flex flex-col justify-evenly">
		<div v-if="mediaError">
			<p class="m-2 text-3xl text-center font-mitr">{{ mediaError }}</p>
			<p class="m-5 text-lg text-center font-inter">Press reload if you think the problem is fixed.</p>
			<button @click="reload"
				class="block mx-auto mt-10 px-8 py-3 rounded-lg bg-teal-500 font-fahkwang text-white shadow-xl shadow-teal-300/30 hover:shadow-teal-600/40 hover:bg-teal-600 transition-all">
				RELOAD NOW
			</button>
		</div>
		<div v-if="!mediaError" class="flex flex-col justify-evenly items-center">
			<Canvas v-if="useMode" :mode="useMode % 2 == 0 ? 'hand' : 'holistic'" :camId="selectedSourceId"
				@holis="onHolisOutput" @mh="onHandOutput" @ready="isCanvasReady = true"
				class="border-2 border-black rounded-3xl shadow-xl overflow-hidden" />
			<div v-if="useMode != 0" class="relative mt-3">
				<select name="cam" @change="changeSource" :disabled="!isCanvasReady"
					class="h-10 pl-3 pr-6 text-base placeholder-gray-600 border rounded-lg appearance-none focus:shadow-outline">
					<option v-for="cam in cameras" :key="cam.deviceId" :value="cam.deviceId">{{ cam.label }}</option>
				</select>
				<div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
					<svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
						<path
							d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
							clip-rule="evenodd" fill-rule="evenodd"></path>
					</svg>
				</div>
			</div>
			<h3 v-if="useMode == 0" class="font-krub font-semibold">Choose your translation mode</h3>
			<div class="m-5 rounded-3xl bg-slate-400 text-white flex justify-center shadow-md">
				<button @click="useMode = 1"
					class="px-4 py-2 rounded-3xl hover:bg-slate-500 font-semibold transition-colors"
					:class="useMode == 1 ? 'bg-slate-600' : ''">
					WORD
				</button>
				<button @click="useMode = 2"
					class="px-4 py-2 rounded-3xl hover:bg-slate-500 font-semibold transition-colors"
					:class="useMode == 2 ? 'bg-slate-600' : ''">
					LETTER
				</button>
				<button @click="useMode = 3"
					class="px-4 py-2 rounded-3xl hover:bg-slate-500 font-semibold transition-colors"
					:class="useMode == 3 ? 'bg-slate-600' : ''">
					ILLNESS
				</button>
				<button @click="useMode = 4"
					class="px-4 py-2 rounded-3xl hover:bg-slate-500 font-semibold transition-colors"
					:class="useMode == 4 ? 'bg-slate-600' : ''">
					NUMBER
				</button>
			</div>
			<p v-if="guess.str !== ''" class="font-mono">{{ guess }} {{ guess.confidence.toFixed(2) }}%</p>
		</div>
		<div v-if="useMode" class="md:m-10">
			<div
				class="p-5 self-stretch md:w-auto md:rounded-lg border-turmeric bg-orange-300/5 text-amber-700/20 font-extrabold font-inter text-6xl whitespace-nowrap overflow-hidden">
				<span v-for="(chunk, i) in previousTranscription" :key="i"
					:class="currentType == 'letter' ? '' : 'ml-5'">{{
					chunk
					}}</span>
			</div>
			<div ref="transcriptionElement"
				class="p-5 self-stretch md:w-auto md:rounded-lg border-turmeric bg-orange-300/20 shadow-amber-700/60 shadow-md text-amber-700 font-extrabold font-inter text-6xl whitespace-nowrap overflow-hidden">
				<span v-for="(chunk, i) in transcription.slice(0,-1)" :key="i"
					:class="currentType == 'letter' ? '' : 'ml-5'">{{
					chunk
					}}</span>
				<span class="text-amber-600" :class="currentType == 'letter' ? '' : 'ml-5'">{{ latest }}</span>
				<span></span>
			</div>
		</div>
	</div>
</template>


<style scoped>
.container {
	position: absolute;
	background-color: #596e73;
	width: 100%;
	max-height: 100%;
}

.input_video {
	display: none;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;

}

.input_video .selfie {
	transform: scale(-1, 1);
}

.input_image {
	position: absolute;
}

.canvas-container {
	display: flex;
	height: 100%;
	width: 100%;
	justify-content: center;
	align-items: center;
	/* //   transform: scale(-1, 1); */
}

#cam-container {
	min-width: 80vw;
	min-height: 80vh;
}
</style>
