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
		<video ref="input_video" class="input_video selfie hidden" />
		<canvas ref="output_canvas" class="output_canvas bg-gray-200 m-0 max-w-full" width="640" height="360" />
	</div>
</template>

<script lang="ts">
// holistic -> word
// multihand -> char
import { Vue, Component } from "vue-property-decorator";
import { Hands, HAND_CONNECTIONS, Results } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { drawLandmarks, drawConnectors, Data, lerp } from "@mediapipe/drawing_utils";

@Component
export default class HandCanvas extends Vue {
	loading = true;
	loading_text = "Initiating . . .";
	camera = null as Camera | null;
	started = false;

	async mounted() {
		const videoElement = this.$refs.input_video as HTMLVideoElement;
		const canvasElement = this.$refs.output_canvas as HTMLCanvasElement;
		const canvasCtx = canvasElement.getContext("2d");

		function onResults(results: Results, vueInstance: any) {
			if (canvasCtx === null) {
				console.error("canvasCtx is null");
				return;
			}
			canvasCtx.save();
			canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
			canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
			vueInstance.loading = false;
			if (results.multiHandLandmarks) {
				if (results.multiHandLandmarks.length > 0) vueInstance.$emit("mh_num", results.multiHandLandmarks);
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
			}
			canvasCtx.restore();
		}

		const hands = new Hands({
			locateFile: (file: string) => {
				return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
			},
		});
		hands.setOptions({
			maxNumHands: 1,
			modelComplexity: 1,
			minDetectionConfidence: 0.5,
			minTrackingConfidence: 0.5,
			selfieMode: true,
		});
		hands.onResults((results) => onResults(results, this));

		this.camera = new Camera(videoElement, {
			onFrame: async () => {
				await hands.send({ image: videoElement });
			},
			width: 1280,
			height: 720,
		});

		this.loading_text = "Loading resources . . .";
		await hands.initialize();

		try {
			this.loading_text = "Opening camera  . . .";
			await this.camera.start();
			this.loading_text = "Starting  . . .";
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
