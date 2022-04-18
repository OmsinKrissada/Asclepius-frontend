setInterval(() => {
	console.log('party!');
}, 1000);

// import { FACEMESH_FACE_OVAL, FACEMESH_LEFT_EYE, FACEMESH_LEFT_EYEBROW, FACEMESH_LIPS, FACEMESH_RIGHT_EYE, FACEMESH_RIGHT_EYEBROW, FACEMESH_TESSELATION, HAND_CONNECTIONS, Results } from '@mediapipe/holistic';
// import { } from '@mediapipe/camera_utils';
// import { Data, drawConnectors, drawLandmarks, lerp } from '@mediapipe/drawing_utils';

// export function onResults(results: Results, vueInstance: any) {

// 	const canvasElement = document.getElementById('output_canvas') as HTMLCanvasElement;
// 	const canvasCtx = canvasElement.getContext("2d");

// 	if (canvasCtx === null) {
// 		console.error("canvasCtx is null");
// 		return;
// 	}

// 	canvasCtx.save();
// 	canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
// 	canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

// 	vueInstance.loading = false;

// 	if (results) {
// 		console.log('holis_word', {
// 			pose: results.poseLandmarks,
// 			face: results.faceLandmarks,
// 			left: results.leftHandLandmarks,
// 			right: results.rightHandLandmarks,
// 		});
// 		// vueInstance.$emit("holis_word", {
// 		// 	pose: results.poseLandmarks,
// 		// 	face: results.faceLandmarks,
// 		// 	left: results.leftHandLandmarks,
// 		// 	right: results.rightHandLandmarks,
// 		// });
// 	}

// 	// Only overwrite existing pixels.
// 	//   if (activeEffect === "mask" || activeEffect === "both") {
// 	// canvasCtx.globalCompositeOperation = "source-in";
// 	// // This can be a color or a texture or whatever...
// 	// canvasCtx.fillStyle = "#00FF007F";
// 	// canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);
// 	canvasCtx.globalCompositeOperation = "source-out";
// 	//   canvasCtx.fillStyle = "#0000FF7F";
// 	canvasCtx.fillStyle = "#FFFFFF";
// 	canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

// 	// Only overwrite missing pixels.
// 	canvasCtx.globalCompositeOperation = "destination-atop";
// 	canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

// 	canvasCtx.globalCompositeOperation = "source-over";

// 	// Hands...
// 	drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, {
// 		color: "white",
// 	});
// 	drawLandmarks(canvasCtx, results.rightHandLandmarks, {
// 		color: "white",
// 		fillColor: "rgb(0,217,231)",
// 		lineWidth: 2,
// 		radius: (data: Data) => {
// 			return lerp(data.from!.z!, -0.15, 0.1, 10, 1);
// 		},
// 	});
// 	drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, {
// 		color: "white",
// 	});
// 	drawLandmarks(canvasCtx, results.leftHandLandmarks, {
// 		color: "white",
// 		fillColor: "rgb(255,138,0)",
// 		lineWidth: 2,
// 		radius: (data: Data) => {
// 			return lerp(data.from!.z!, -0.15, 0.1, 10, 1);
// 		},
// 	});

// 	// Face...
// 	drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, {
// 		color: "#C0C0C070",
// 		lineWidth: 1,
// 	});
// 	drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_RIGHT_EYE, {
// 		color: "rgb(0,217,231)",
// 	});
// 	drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_RIGHT_EYEBROW, {
// 		color: "rgb(0,217,231)",
// 	});
// 	drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LEFT_EYE, {
// 		color: "rgb(255,138,0)",
// 	});
// 	drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LEFT_EYEBROW, {
// 		color: "rgb(255,138,0)",
// 	});
// 	drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_FACE_OVAL, {
// 		color: "#E0E0E0",
// 		lineWidth: 5,
// 	});
// 	drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LIPS, {
// 		color: "#E0E0E0",
// 		lineWidth: 5,
// 	});

// 	canvasCtx.restore();
// }