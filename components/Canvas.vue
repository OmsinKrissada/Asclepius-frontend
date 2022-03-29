<template>
  <div id="cam-container" class="relative">
    <div v-if="loading" class="flex flex-col justify-center items-center absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <LoadingBar :loading="true" class="m-5" />
      <p class="font-mitr text-lg">
        {{ text }}
      </p>
    </div>
    <video ref="input_video" class="input_video selfie hidden" />
    <canvas
      ref="output_canvas"
      class="output_canvas bg-gray-200 rounded-3xl m-0 max-w-full"
      width="400px"
      height="400px"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
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
  POSE_LANDMARKS_RIGHT
} from '@mediapipe/holistic'
import { Camera } from '@mediapipe/camera_utils'
import {
  drawLandmarks,
  drawConnectors,
  Data,
  lerp
} from '@mediapipe/drawing_utils'

import { io } from 'socket.io-client'
const socket = io('ws://localhost:8081')

export default Vue.extend({
  name: 'Canvas',
  data () {
    return {
      loading: true,
      text: 'Loading  . . .',
      camera: null as Camera | null,
      started: false
    };
  },
  async mounted () {
    socket.emit('hand', 'mounted')
    const videoElement = this.$refs.input_video as HTMLVideoElement
    const canvasElement = this.$refs.output_canvas as HTMLCanvasElement
    const canvasCtx = canvasElement.getContext('2d')

    let loading = this.loading

    function onResults (results: Results) {
      if (canvasCtx === null) {
        console.error('canvasCtx is null')
        return
      }

      canvasCtx.save()
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height)
      canvasCtx.drawImage(
        results.segmentationMask,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      )

      loading = false

      // Only overwrite existing pixels.
      //   if (activeEffect === "mask" || activeEffect === "both") {
      // canvasCtx.globalCompositeOperation = "source-in";
      // // This can be a color or a texture or whatever...
      // canvasCtx.fillStyle = "#00FF007F";
      // canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.globalCompositeOperation = 'source-out'
      //   canvasCtx.fillStyle = "#0000FF7F";
      canvasCtx.fillStyle = '#FFFFFF'
      canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height)

      // Only overwrite missing pixels.
      canvasCtx.globalCompositeOperation = 'destination-atop'
      canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      )

      canvasCtx.globalCompositeOperation = 'source-over'

      //   drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
      //     color: "#00FF00",
      //     lineWidth: 4,
      //   });
      //   drawLandmarks(canvasCtx, results.poseLandmarks, {
      //     color: "#FF0000",
      //     lineWidth: 2,
      //   });

      //   // Pose...
      //   drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
      //     color: "white",
      //   });
      //   drawLandmarks(
      //     canvasCtx,
      //     Object.values(POSE_LANDMARKS_LEFT).map(
      //       (index) => results.poseLandmarks[index]
      //     ),
      //     { visibilityMin: 0.65, color: "white", fillColor: "rgb(255,138,0)" }
      //   );
      //   drawLandmarks(
      //     canvasCtx,
      //     Object.values(POSE_LANDMARKS_RIGHT).map(
      //       (index) => results.poseLandmarks[index]
      //     ),
      //     { visibilityMin: 0.65, color: "white", fillColor: "rgb(0,217,231)" }
      //   );

      // Hands...
      drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, {
        color: 'white'
      })
      drawLandmarks(canvasCtx, results.rightHandLandmarks, {
        color: 'white',
        fillColor: 'rgb(0,217,231)',
        lineWidth: 2,
        radius: (data: Data) => {
          return lerp(data.from!.z!, -0.15, 0.1, 10, 1)
        }
      })
      drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, {
        color: 'white'
      })
      drawLandmarks(canvasCtx, results.leftHandLandmarks, {
        color: 'white',
        fillColor: 'rgb(255,138,0)',
        lineWidth: 2,
        radius: (data: Data) => {
          return lerp(data.from!.z!, -0.15, 0.1, 10, 1)
        }
      })

      // Face...
      drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, {
        color: '#C0C0C070',
        lineWidth: 1
      })
      drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_RIGHT_EYE, {
        color: 'rgb(0,217,231)'
      })
      drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_RIGHT_EYEBROW, {
        color: 'rgb(0,217,231)'
      })
      drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LEFT_EYE, {
        color: 'rgb(255,138,0)'
      })
      drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LEFT_EYEBROW, {
        color: 'rgb(255,138,0)'
      })
      drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_FACE_OVAL, {
        color: '#E0E0E0',
        lineWidth: 5
      })
      drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LIPS, {
        color: '#E0E0E0',
        lineWidth: 5
      })

      canvasCtx.restore()
    }

    const holistic = new Holistic({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`
      }
    })
    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: false,
      refineFaceLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    })
    holistic.onResults(onResults)

    this.camera = new Camera(videoElement, {
      onFrame: async () => {
        await holistic.send({ image: videoElement })
      },
      width: 700,
      height: 700
    })

    console.log(this.camera);

    // this.loading = false;
    try {
      await this.camera.start()
      console.log('started')
    } catch (err) {
      this.text = 'Unable to start camera'
      console.log('ohnoooooo');
      alert('pls dont')
    }
  },
  beforeDestroy () {
    // if (this.camera) { 
    console.log(this.loading)
    // }
  }
  
})
</script>
