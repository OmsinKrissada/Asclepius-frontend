<template>
  <div class="flex flex-col justify-evenly">
    <div class="flex flex-col justify-evenly items-center sm:flex-row">
      <Canvas @lh="onLeftHand" @rh="onRightHand" @result="onResult" />
      <div class="text-blue font-bold">
        <p>Switch language</p>
      </div>
    </div>
    <div class="m-10">
      <h3 class="font-krub text-xl font-bold">Transcription</h3>
      <p class="p-5 bg-gray-100 font-mitr border-turmeric border-2">
        {{ transcription }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import { io } from "socket.io-client";
const socket = io("ws://localhost:8081");

@Component
export default class Camera extends Vue {
  transcription = "";
  // socket: null as SocketIOClient.Socket | null
  mounted() {
    socket.on("char", (char) => {
      this.transcription += char;
      console.log(`Received character: ${char}`);
    });
    socket.on("word", (word) => {
      this.transcription += " " + word;
      console.log(`Received word: ${word}`);
    });
  }

  onResult(result: any) {
    socket.emit("result", result);
  }

  onLeftHand(landmarks: string[]) {
    socket.emit("lh", landmarks);
  }

  onRightHand(landmarks: string[]) {
    socket.emit("rh", landmarks);
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
