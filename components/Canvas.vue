<template>
	<div class="relative">
		<div v-if="loadingText!==''"
			class="flex flex-col justify-center items-center absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
			<LoadingBar :loading="true" class="m-5" />
			<p class="font-mitr text-lg">
				{{ loadingText }}
			</p>
		</div>
		<video ref="inputVideo" class="hidden" />
		<canvas ref="outputCanvas" class="bg-gray-200 rounded-3xl m-0 max-w-full" width="640" height="360" />
	</div>
</template>

<script setup lang="ts">
// holistic -> word
// multihand -> char
import {
	Holistic,
	POSE_CONNECTIONS,
	FACEMESH_TESSELATION,
	HAND_CONNECTIONS,
	Results as HolisticResults,
	FACEMESH_FACE_OVAL,
	FACEMESH_LEFT_EYE,
	FACEMESH_LEFT_EYEBROW,
	FACEMESH_LIPS,
	FACEMESH_RIGHT_EYE,
	FACEMESH_RIGHT_EYEBROW,
	POSE_LANDMARKS_LEFT,
	POSE_LANDMARKS_RIGHT,
	NormalizedLandmarkList,
} from "@mediapipe/holistic";
import { Hands, NormalizedLandmarkListList, Results as HandResults } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { drawLandmarks, drawConnectors, Data, lerp } from "@mediapipe/drawing_utils";
import { notify } from "@kyvg/vue3-notification";

const props = defineProps<{
	mode: 'holistic' | 'hand',
	camId: string;
}>();

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

const loadingText = ref("Initiating . . .");
const started = false;
const inputVideo = ref<HTMLVideoElement>(null);
const outputCanvas = ref<HTMLCanvasElement>(null);

let camera: Camera;

onMounted(async () => {
	const canvasCtx = outputCanvas.value.getContext("2d");
	console.log(props.camId);

	const stream = navigator.mediaDevices.getUserMedia({
		video: { deviceId: { exact: props.camId }, width: 1280, height: 720 },
	});
	inputVideo.value.srcObject = await stream;

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
		selfieMode: true,
	});
	hands.setOptions({
		maxNumHands: 1,
		modelComplexity: 1,
		minDetectionConfidence: 0.5,
		minTrackingConfidence: 0.5,
		selfieMode: true,
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
		canvasCtx.drawImage(results.image, 0, 0, outputCanvas.value.width, outputCanvas.value.height);
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

	watch(() => props.camId, (newValue, _oldValue) => {
		console.log("cam changed!");
		console.log(props.camId);
		navigator.mediaDevices
			.getUserMedia({
				video: { deviceId: { exact: newValue }, width: 1280, height: 720 },
			})
			.then((stream) => {
				inputVideo.value.srcObject = stream;
				if (holistic) holistic.reset();
				if (hands) hands.reset();
			});
	});

	camera = new Camera(inputVideo.value, {
		onFrame: async () => {
			if (props.mode === "holistic") await holistic.send({ image: inputVideo.value });
			else await hands.send({ image: inputVideo.value });
		},
		width: 1280,
		height: 720,
	});

	loadingText.value = "Loading holistic resources . . .";
	await holistic.initialize();
	loadingText.value = "Loading multi-hand resources . . .";
	await hands.initialize();

	try {
		loadingText.value = "Opening camera . . .";
		await camera.start();
		console.log("started");
		emits('ready');
		loadingText.value = "Starting . . .";
	} catch (err) {
		loadingText.value = "Cannot open camera";
		notify({
			title: 'Please allow permission to camera',
			type: 'error'
		});
	}
});

watch(() => props.mode, (newValue, _oldValue) => {
	console.log("the mode has changed to " + newValue);
});


onBeforeUnmount(() => {
	if (camera) {
		console.log("Destroying camera");
		camera.stop();
	}
});
</script>
