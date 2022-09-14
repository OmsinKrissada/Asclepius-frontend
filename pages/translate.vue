<script setup lang="ts">
import { io } from "socket.io-client";
import Chevron from "~~/components/svg/Chevron.vue";
// import { VideoCameraIcon, VideoCameraSlashIcon } from '@heroicons/vue/20/solid';

const config = useRuntimeConfig().public;

/* Modes */
const modes = {
	word: 'holistic',
	letter: 'hand',
	illness: 'holistic',
	number: 'hand',
};
let modesArray = [];
for (const mode in modes) modesArray.push(mode);
const currentMode = ref<keyof typeof modes | ''>('');



/* Camera Handling */
const currentCamera = ref<string>('');

// Pre-check camera permission
const camPermission = usePermission('camera');
const { videoInputs: cameras } = useDevicesList({
	requestPermissions: true,
	onUpdated() {
		// Assign default camera
		if (!cameras.value.find(i => i.deviceId === currentCamera.value))
			currentCamera.value = cameras.value[0]?.deviceId;
	},
});

const mediaError = ref('Checking permissions...');
const camEnabled = ref(false);
const isCamAllowed = computed(() => camPermission.value === 'granted');
const isSelfieMode = ref(false);

function checkMediaPerm() {
	console.log('checking media perm');
	console.log(camPermission.value);
	watchEffect(() => {
		if (camPermission.value === 'prompt' || camPermission.value === 'denied')
			mediaError.value = "Please allow camera on your browser.";
		console.log(camPermission.value);
	});
	watch(isCamAllowed, newValue => {
		if (newValue) mediaError.value = '';
		else mediaError.value = "Please allow camera on your browser.";
	});
}


function changeSource(event: any) {
	currentCamera.value = event.target.value;
	console.log("changeSource: " + event.target.value);
}

/* Result callbacks */

const guess = reactive<{ str: string, confidence: number; }>({ str: '', confidence: 0 });
const transcription = ref<string[]>(['the', 'first', 'phrase']);
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
			transcription.value[transcription.value.length - 1] += letter;
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

/* WebSocket */
const loadingText = ref('');
const wsReady = ref(false);
const servers = [
	{ id: 'OMSIN_1', url: 'https://asclepiusapi.krissada.com' },
	{ id: 'SPAC_1', url: 'https://asclepiusapi.spaceac.net' },
];
let socket = io(servers[0].url, { path: config.wsPath, autoConnect: false });
let tryCount = 1;
function registerSocket(server: { id: string, url: string; }) {
	socket = io(server.url, { path: config.wsPath, autoConnect: false });
	// Handle socket.io internal functions
	let tryCountPerAttempt = 1;
	socket.on("connect_error", (err) => {
		console.error('connect_error');
		tryCountPerAttempt++;
		loadingText.value = `Attempting reconnect, trying alternate server [${server.id}] (${tryCount})...`;
		if (tryCountPerAttempt > 4) {
			socket.disconnect();
			socket.removeAllListeners();
			registerSocket(servers[tryCount++ % servers.length]);
		}

	});
	socket.on("connect", () => {
		console.log("Connected to socket.io server");
		loadingText.value = '';
		wsReady.value = true;
		tryCount = 1;
	});
	socket.on("disconnect", () => {
		console.log('WebSocket disconnected.');
		loadingText.value = 'Disconnected. Reconnecting...';
		wsReady.value = false;
	});

	// Result events
	socket.on("letter", ({ letter, confidence }) => {
		addLetter(letter, confidence);
		// updated();
	});
	socket.on("word", ({ word, confidence }) => {
		addWord(word, confidence);
		// updated();
	});

	socket.connect();
}
onMounted(() => {
	checkMediaPerm();
	socket.connect();
	loadingText.value = 'Establishing Web Socket connection...';

	registerSocket(servers[0]);

	camEnabled.value = true;
});

function onHolisOutput(result: any) {
	if (currentMode.value === 'word') socket.emit("holis_word", result);
	else if (currentMode.value === 'illness') socket.emit("holis_ill", result);
}

function onHandOutput(result: any) {
	if (currentMode.value === 'letter') socket.emit("mh_letter", result);
	else if (currentMode.value === 'number') socket.emit("mh_num", result);
}

onBeforeUnmount(() => {
	console.log('Unmount triggered');
	console.log("Closing socket.io client");
	camEnabled.value = false;
	socket.disconnect();
});
</script>

<template>
	<div class="relative flex-grow flex justify-evenly items-center">

		<ErrorBox :message="mediaError" />
		<LoadingOverlay :message="loadingText" />

		<section v-if="isCamAllowed && wsReady" class="flex flex-col self-stretch justify-evenly items-center">
			<div class="relative">
				<TheCanvas :mode="modes[currentMode]??''" :currentCamera="currentCamera" :enabled="camEnabled"
					:flip="isSelfieMode" @holis="onHolisOutput" @mh="onHandOutput"
					class="border-2 border-black rounded-lg shadow-xl" />
				<p v-if="guess.str !== ''"
					class="absolute z-50 left-0 right-0 bottom-0 py-5 rounded-lg from-black/50 to-transparent bg-gradient-to-t font-mono font-medium text-center text-2xl text-white">
					{{guess.str }} {{guess.confidence.toFixed(2)}}%
				</p>
			</div>

			<!-- Menus -->
			<div class="flex flex-col space-y-5 w-full p-5 justify-self-end bg-slate-200 rounded-lg">
				<h3 class="p-3 font-medium text-xl text-slate-800">Settings</h3>
				<div class="relative">
					<select name="cam" @change="changeSource"
						class="h-10 pl-3 pr-6 text-base bg-sky-600 text-white border rounded-lg appearance-none focus:shadow-outline">
						<option v-for="cam in cameras" :key="cam.deviceId" :value="cam.deviceId">{{ cam.label }}
						</option>
					</select>
					<Chevron class="fill-white" />
				</div>

				<Switch v-model="camEnabled">Camera</Switch>
				<Switch v-model="isSelfieMode">Selfie Mode</Switch>

			</div>

			<!-- End of Menus -->
		</section>

		<div v-if="isCamAllowed && wsReady" class="h-full w-0.5 bg-slate-600" />

		<!-- Transcription section -->
		<section v-if="isCamAllowed && wsReady"
			class="flex flex-col justify-center items-center p-5 bg-slate-200 rounded-lg">
			<div class="relative">
				<ul class="flex space-x-2">
					<li v-for="mode in modesArray" :value="mode">
						<button @click="currentMode=mode"
							class="px-3 py-2 bg-sky-700 bg-gradient-to-br font-medium text-white rounded transition-shadow shadow-black/50"
							:class="{'to-sky-500':currentMode === mode, 'from-emerald-400':currentMode===mode,'shadow-md':currentMode===mode}">{{mode.toUpperCase()}}</button>
					</li>
				</ul>
			</div>
			<Transcription :transcription="transcription" />
		</section>
	</div>
</template>
