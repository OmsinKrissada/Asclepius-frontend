<script setup lang="ts">

// holistic -> word
// multihand -> char

import {
	FACEMESH_TESSELATION,
	HAND_CONNECTIONS,
	Results as HolisticResults,
	FACEMESH_FACE_OVAL,
	FACEMESH_LEFT_EYE,
	FACEMESH_LEFT_EYEBROW,
	FACEMESH_LIPS,
	FACEMESH_RIGHT_EYE,
	FACEMESH_RIGHT_EYEBROW,
	NormalizedLandmarkList,
} from "@mediapipe/holistic";
import { Hands, NormalizedLandmarkListList, Results as HandResults } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { drawLandmarks, drawConnectors, Data, lerp } from "@mediapipe/drawing_utils";

// workaround, have to do with @mediapipe/holistic being in CommonJS
import pkg from '@mediapipe/holistic';
const { Holistic } = pkg;

const props = defineProps<{
	mode: 'holistic' | 'hand' | '';
	currentCamera: string;
	enabled: boolean;
	flip: boolean;
}>();
const reactiveProps = toRefs(props);

const emits = defineEmits<{
	(e: 'ready'): void,
	(
		e: 'holis',
		result: {
			pose: NormalizedLandmarkList,
			face: NormalizedLandmarkList,
			left: NormalizedLandmarkList,
			right: NormalizedLandmarkList,
		}
	): void,
	(e: 'mh', result: NormalizedLandmarkListList): void;
}>();

const loadingText = ref("Initializing...");
const inputVideo = ref<HTMLVideoElement>(null);
const outputCanvas = ref<HTMLCanvasElement>(null);

/* Note: can someone please explain to me why these computed ref don't work */
// const videoWidth = computed(() => inputVideo.value?.videoWidth ?? 0);
// const videoHeight = computed(() => inputVideo.value?.videoHeight ?? 0);

// Camera Manager
let camera: Camera;

const { stream, enabled: camEnabled } = useUserMedia({
	videoDeviceId: reactiveProps.currentCamera,
});

watch(() => props.enabled, async () => {
	camEnabled.value = props.enabled;
	if (props.enabled) {
		loadingText.value = 'Processing frames...';
		await camera.start();
		loadingText.value = '';
	}
	else camera.stop();
});

watchEffect(() => {
	if (inputVideo.value)
		inputVideo.value.srcObject = stream.value!;
});

onMounted(async () => {
	camEnabled.value = true;
	const canvasCtx = outputCanvas.value.getContext("2d");
	console.log(props.currentCamera);

	// this chunk for debugging the bundler
	console.log('Here is what Holistic looks like:');
	console.log(Holistic);

	const holistic = new Holistic({
		locateFile: (file) => {
			return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
		},
	});
	const hands = new Hands({
		locateFile: (file: string) => {
			return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
		},
	});
	holistic.setOptions({
		modelComplexity: 1,
		smoothLandmarks: true,
		enableSegmentation: false,
		smoothSegmentation: true,
		refineFaceLandmarks: false,
		minDetectionConfidence: 0.5,
		minTrackingConfidence: 0.5,
		selfieMode: false,
	});
	hands.setOptions({
		maxNumHands: 1,
		modelComplexity: 1,
		minDetectionConfidence: 0.5,
		minTrackingConfidence: 0.5,
		selfieMode: false,
	});

	const onHolisticResults = (results: HolisticResults) => {
		if (canvasCtx === null) {
			console.error("canvasCtx is null");
			return;
		}

		canvasCtx.save();
		canvasCtx.clearRect(0, 0, outputCanvas.value.width, outputCanvas.value.height);
		canvasCtx.drawImage(results.image, 0, 0, outputCanvas.value.width, outputCanvas.value.height);

		loadingText.value = '';

		if (results)
			emits("holis", {
				pose: results.poseLandmarks,
				face: results.faceLandmarks,
				left: results.leftHandLandmarks,
				right: results.rightHandLandmarks,
			});
		canvasCtx.globalCompositeOperation = "source-out";
		canvasCtx.fillStyle = "#FFFFFF";
		canvasCtx.fillRect(0, 0, outputCanvas.value.width, outputCanvas.value.height);

		// Only overwrite missing pixels.
		canvasCtx.globalCompositeOperation = "destination-atop";
		canvasCtx.drawImage(results.image, 0, 0, outputCanvas.value.width, outputCanvas.value.height);

		canvasCtx.globalCompositeOperation = "source-over";

		// Hands...
		drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, {
			color: "white",
		});
		drawLandmarks(canvasCtx, results.rightHandLandmarks, {
			color: "white",
			fillColor: "rgb(0,217,231)",
			lineWidth: 2,
			radius: (data: Data) => {
				return lerp(data.from!.z!, -0.15, 0.1, 10, 1);
			},
		});
		drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, {
			color: "white",
		});
		drawLandmarks(canvasCtx, results.leftHandLandmarks, {
			color: "white",
			fillColor: "rgb(255,138,0)",
			lineWidth: 2,
			radius: (data: Data) => {
				return lerp(data.from!.z!, -0.15, 0.1, 10, 1);
			},
		});

		// Face...
		drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, {
			color: "#C0C0C070",
			lineWidth: 1,
		});
		drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_RIGHT_EYE, {
			color: "rgb(0,217,231)",
		});
		drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_RIGHT_EYEBROW, {
			color: "rgb(0,217,231)",
		});
		drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LEFT_EYE, {
			color: "rgb(255,138,0)",
		});
		drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LEFT_EYEBROW, {
			color: "rgb(255,138,0)",
		});
		drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_FACE_OVAL, {
			color: "#E0E0E0",
			lineWidth: 5,
		});
		drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LIPS, {
			color: "#E0E0E0",
			lineWidth: 5,
		});

		canvasCtx.restore();
	};

	const onHandResults = (results: HandResults) => {
		if (canvasCtx === null) {
			console.error("canvasCtx is null");
			return;
		}
		canvasCtx.save();
		canvasCtx.clearRect(0, 0, outputCanvas.value.width, outputCanvas.value.height);
		// canvasCtx.drawImage(results.image, 0, 0, outputCanvas.value.width, outputCanvas.value.height);
		loadingText.value = '';
		if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0)
			emits("mh", results.multiHandLandmarks);
		for (const landmarks of results.multiHandLandmarks) {
			drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
				color: "#00FF00",
				lineWidth: 5,
			});
			drawLandmarks(canvasCtx, landmarks, {
				color: "#FF0000",
				lineWidth: 2,
			});
		}
		canvasCtx.restore();
	};

	holistic.onResults((results) => onHolisticResults(results));
	hands.onResults((results) => onHandResults(results));

	camera = new Camera(inputVideo.value, {
		onFrame: async () => {
			if (props.enabled) {
				if (props.mode === "holistic") {
					await holistic.send({ image: inputVideo.value });
					loadingText.value = '';
				}
				else if (props.mode === "hand") {
					await hands.send({ image: inputVideo.value });
					loadingText.value = '';
				};
			}
		}
	});

	loadingText.value = "Loading holistic resources...";
	await holistic.initialize();
	loadingText.value = "Loading multi-hand resources...";
	await hands.initialize();
	loadingText.value = "Starting camera...";
	await camera.start();
	loadingText.value = '';
});

watch(() => props.mode, (newValue, _oldValue) => {
	console.log("the mode has changed to " + newValue);
	if (props.enabled) loadingText.value = 'Processing frames...';
});


onBeforeUnmount(async () => {
	camEnabled.value = false;
	if (camera) {
		console.log("Destroying camera");
		await camera.stop();
	}
});
</script>

<template>
	<div class="relative">
		<LoadingOverlay :message="loadingText" />
		<LoadingBar :loading="!!loadingText" class="m-5" />
		<!-- <p v-if="!enabled" class="p-4 font-mitr text-lg">
			{{loadingText||'Camera Is Off'}}
		</p> -->
		<div class="relative flex justify-center items-center transition-all">
			<video ref="inputVideo" autoplay muted class="z-10 h-100 w-auto" :class="{flip:flip}" />
			<canvas ref="outputCanvas" class="z-20 absolute inset-0 w-full h-full rounded-3xl m-0 max-w-full"
				:class="{flip:flip}" :width="inputVideo?.videoWidth??0" :height="inputVideo?.videoHeight??0" />
		</div>
		<!-- {{inputVideo?inputVideo.videoWidth:0}} -->
	</div>
</template>

<style scoped>
.flip {
	transform: rotateY(180deg);
}
</style>