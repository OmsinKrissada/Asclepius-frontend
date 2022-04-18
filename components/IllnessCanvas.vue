<template>
	<div id="cam-container" class="relative">
		<div
			v-if="loading"
			class="flex flex-col justify-center items-center absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
		>
			<LoadingBar :loading="true" class="m-5" />
			<p class="font-mitr text-lg">
				{{ loading_text }}
			</p>
		</div>
		<video ref="input_video" class="hidden" />
		<canvas ref="output_canvas" class="bg-gray-200 rounded-3xl m-0 max-w-full" width="640" height="360" />
	</div>
</template>

<script lang="ts">
// holistic -> word
// multihand -> char
import { Vue, Component } from "vue-property-decorator";
import {
	Holistic,
	POSE_CONNECTIONS,
	FACEMESH_TESSELATION,
	HAND_CONNECTIONS,
	Results,
	FACEMESH_FACE_OVAL,
	FACEMESH_LEFT_EYE,
	FACEMESH_LEFT_EYEBROW,
	FACEMESH_LIPS,
	FACEMESH_RIGHT_EYE,
	FACEMESH_RIGHT_EYEBROW,
	POSE_LANDMARKS_LEFT,
	POSE_LANDMARKS_RIGHT,
	POSE_LANDMARKS,
} from "@mediapipe/holistic";
import { Camera } from "@mediapipe/camera_utils";
import { drawLandmarks, drawConnectors, Data, lerp } from "@mediapipe/drawing_utils";

@Component
export default class IllnessCanvas extends Vue {
	loading = true;
	loading_text = "Initiating . . .";
	camera = null as Camera | null;
	started = false;

	async mounted() {
		const videoElement = this.$refs.input_video as HTMLVideoElement;
		const canvasElement = this.$refs.output_canvas as HTMLCanvasElement;
		const canvasCtx = canvasElement.getContext("2d");

		const stream = await navigator.mediaDevices.getUserMedia({ video: true });
		if (stream.getVideoTracks().length > 0) console.log("camera NOT available");
		else console.log("camera available");

		function onResults(results: Results, vueInstance: any) {
			if (canvasCtx === null) {
				console.error("canvasCtx is null");
				return;
			}

			canvasCtx.save();
			canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
			canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

			vueInstance.loading = false;

			if (results) {
				vueInstance.$emit("holis_ill", {
					pose: results.poseLandmarks,
					face: results.faceLandmarks,
					left: results.leftHandLandmarks,
					right: results.rightHandLandmarks,
				});
			}

			// Only overwrite existing pixels.
			//   if (activeEffect === "mask" || activeEffect === "both") {
			// canvasCtx.globalCompositeOperation = "source-in";
			// // This can be a color or a texture or whatever...
			// canvasCtx.fillStyle = "#00FF007F";
			// canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);
			canvasCtx.globalCompositeOperation = "source-out";
			//   canvasCtx.fillStyle = "#0000FF7F";
			canvasCtx.fillStyle = "#FFFFFF";
			canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

			// Only overwrite missing pixels.
			canvasCtx.globalCompositeOperation = "destination-atop";
			canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

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

			// drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
			// 	color: "#E0E0E0",
			// 	lineWidth: 5,
			// });

			canvasCtx.restore();
		}

		const holistic = new Holistic({
			locateFile: (file) => {
				return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
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
		holistic.onResults((results) => onResults(results, this));

		this.camera = new Camera(videoElement, {
			onFrame: async () => {
				await holistic.send({ image: videoElement });
			},
			width: 1280,
			height: 720,
		});

		this.loading_text = "Loading resources . . .";
		await holistic.initialize();

		try {
			this.loading_text = "Opening camera . . .";
			await this.camera.start();
			console.log("started");
			this.loading_text = "Starting . . .";
		} catch (err) {
			this.loading_text = "Cannot open camera";
			this.$toast.error("Please allow permission to camera", {
				position: "bottom-right",
				duration: 5000,
				iconPack: "fontawesome",
				icon: "camera",
				containerClass: "toast",
			});
		}
	}

	beforeDestroy() {
		if (this.camera) {
			console.log("Destroying camera");
			this.camera.stop();
		}
	}
}
</script>
