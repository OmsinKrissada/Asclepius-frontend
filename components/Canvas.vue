v
<template>
	<div class="relative">
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
	Results as HolisticResults,
	FACEMESH_FACE_OVAL,
	FACEMESH_LEFT_EYE,
	FACEMESH_LEFT_EYEBROW,
	FACEMESH_LIPS,
	FACEMESH_RIGHT_EYE,
	FACEMESH_RIGHT_EYEBROW,
	POSE_LANDMARKS_LEFT,
	POSE_LANDMARKS_RIGHT,
} from "@mediapipe/holistic";
import { Hands, Results as HandResults } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { drawLandmarks, drawConnectors, Data, lerp } from "@mediapipe/drawing_utils";

@Component({
	props: {
		mode: {
			type: String,
			default: "holistic",
		},
	},
})
export default class Canvas extends Vue {
	mode?: "holistic" | "hand";
	loading = true;
	loading_text = "Initiating . . .";
	camera = null as Camera | null;
	started = false;
	videoElement?: HTMLVideoElement;
	canvasElement!: HTMLCanvasElement;
	canvasCtx!: CanvasRenderingContext2D | null;

	onHolisticResults(results: HolisticResults) {
		if (this.canvasCtx === null) {
			console.error("canvasCtx is null");
			return;
		}

		this.canvasCtx.save();
		this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
		this.canvasCtx.drawImage(results.image, 0, 0, this.canvasElement.width, this.canvasElement.height);

		this.loading = false;

		if (results)
			this.$emit("holis", {
				pose: results.poseLandmarks,
				face: results.faceLandmarks,
				left: results.leftHandLandmarks,
				right: results.rightHandLandmarks,
			});
		this.canvasCtx.globalCompositeOperation = "source-out";
		this.canvasCtx.fillStyle = "#FFFFFF";
		this.canvasCtx.fillRect(0, 0, this.canvasElement.width, this.canvasElement.height);

		// Only overwrite missing pixels.
		this.canvasCtx.globalCompositeOperation = "destination-atop";
		this.canvasCtx.drawImage(results.image, 0, 0, this.canvasElement.width, this.canvasElement.height);

		this.canvasCtx.globalCompositeOperation = "source-over";

		// Hands...
		drawConnectors(this.canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, {
			color: "white",
		});
		drawLandmarks(this.canvasCtx, results.rightHandLandmarks, {
			color: "white",
			fillColor: "rgb(0,217,231)",
			lineWidth: 2,
			radius: (data: Data) => {
				return lerp(data.from!.z!, -0.15, 0.1, 10, 1);
			},
		});
		drawConnectors(this.canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, {
			color: "white",
		});
		drawLandmarks(this.canvasCtx, results.leftHandLandmarks, {
			color: "white",
			fillColor: "rgb(255,138,0)",
			lineWidth: 2,
			radius: (data: Data) => {
				return lerp(data.from!.z!, -0.15, 0.1, 10, 1);
			},
		});

		// Face...
		drawConnectors(this.canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, {
			color: "#C0C0C070",
			lineWidth: 1,
		});
		drawConnectors(this.canvasCtx, results.faceLandmarks, FACEMESH_RIGHT_EYE, {
			color: "rgb(0,217,231)",
		});
		drawConnectors(this.canvasCtx, results.faceLandmarks, FACEMESH_RIGHT_EYEBROW, {
			color: "rgb(0,217,231)",
		});
		drawConnectors(this.canvasCtx, results.faceLandmarks, FACEMESH_LEFT_EYE, {
			color: "rgb(255,138,0)",
		});
		drawConnectors(this.canvasCtx, results.faceLandmarks, FACEMESH_LEFT_EYEBROW, {
			color: "rgb(255,138,0)",
		});
		drawConnectors(this.canvasCtx, results.faceLandmarks, FACEMESH_FACE_OVAL, {
			color: "#E0E0E0",
			lineWidth: 5,
		});
		drawConnectors(this.canvasCtx, results.faceLandmarks, FACEMESH_LIPS, {
			color: "#E0E0E0",
			lineWidth: 5,
		});

		this.canvasCtx.restore();
	}

	onHandResults(results: HandResults) {
		if (this.canvasCtx === null) {
			console.error("canvasCtx is null");
			return;
		}
		this.canvasCtx.save();
		this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
		this.canvasCtx.drawImage(results.image, 0, 0, this.canvasElement.width, this.canvasElement.height);
		this.loading = false;
		if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0)
			this.$emit("mh", results.multiHandLandmarks);
		for (const landmarks of results.multiHandLandmarks) {
			drawConnectors(this.canvasCtx, landmarks, HAND_CONNECTIONS, {
				color: "#00FF00",
				lineWidth: 5,
			});
			drawLandmarks(this.canvasCtx, landmarks, {
				color: "#FF0000",
				lineWidth: 2,
			});
		}
		this.canvasCtx.restore();
	}

	async mounted() {
		this.videoElement = this.$refs.input_video as HTMLVideoElement;
		this.canvasElement = this.$refs.output_canvas as HTMLCanvasElement;
		this.canvasCtx = this.canvasElement.getContext("2d");
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
		holistic.onResults((results) => this.onHolisticResults(results));
		hands.onResults((results) => this.onHandResults(results));

		this.camera = new Camera(this.videoElement, {
			onFrame: async () => {
				if (this.mode == "holistic") await holistic.send({ image: this.videoElement! });
				else await hands.send({ image: this.videoElement! });
			},
			width: 1280,
			height: 720,
		});

		this.loading_text = "Loading holistic resources . . .";
		await holistic.initialize();
		this.loading_text = "Loading multi-hand resources . . .";
		await hands.initialize();

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
