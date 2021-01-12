<template>
  <v-container>
    <v-row class="camera-style elevation-3" justify="center">
      <video v-show="false" class="camera-style" ref="video" id="video" width="100%" height="100%" autoplay
             playsinline></video>
      <canvas class="camera-style" ref="canvas" id="canvas"></canvas>
    </v-row>

    <v-row class="camera-style elevation-3 justify-center align-center">
      <v-col class="mt-2" align="center">
        <input
            style="display: none"
            id="file"
            ref="input"
            type="file"
            accept="image/jpeg, image/jpg, image/png"
            @change="select"
        >
        <v-btn color="secondary" v-show="!taken" icon large @click="openFileSelector">
          <v-icon large>mdi-file</v-icon>
        </v-btn>
      </v-col>
      <v-col class="mt-3" align="center">
        <v-btn color="secondary" v-show="!taken" :disabled="!cameraOn" icon outlined large @click="capture">
          <v-icon large>mdi-checkbox-blank-circle</v-icon>
        </v-btn>
        <v-btn large outlined rounded v-show="taken" block @click="retake">
          撮り直し
        </v-btn>
      </v-col>
      <v-col class="mt-2" align="center">
        <v-btn :color="!cameraOn ? 'secondary' : ''" v-show="!taken" icon large @click="toggleCameraOnOff">
          <v-icon large>mdi-camera-off</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue} from "vue-property-decorator";
import Canvas from "@/modules/infrastructure/canvas";
import CanvasBuilder from "@/modules/infrastructure/canvasBuilder";

@Component
export default class Camera extends Vue {

  @Prop() imageData!: string;
  video!: HTMLVideoElement;
  canvas!: Canvas;
  taken = false;
  animationId = 0;
  cameraOn = true;

  mounted() {
    this.video = document.getElementById('video') as HTMLVideoElement
    this.canvas = CanvasBuilder
        .withCanvas(document.getElementById('canvas') as HTMLCanvasElement)
        .withWidth(720)
        .withHeight(540)
        .build();
    this.stopStreamingVideo();
    this.startStreamingVideo();
  }

  private beforeDestroy() {
    this.stopStreamingVideo();
  }

  private capture() {
    this.pauseStreamingVideo()
    this.canvas.drawImage(this.video);
    this.image = this.canvas.toDataURL()
  }

  private retake() {
    this.image = '';
    this.startStreamingVideo();
  }

  private toggleCameraOnOff() {
    if (this.cameraOn) {
      this.stopStreamingVideo();
    } else {
      this.startStreamingVideo();
    }
  }

  private select() {

    const file = (this.$refs.input as any).files[0]
    const selectedImage = new Image()
    const reader = new FileReader();

    reader.onload = (evt: any) => {
      selectedImage.onload = () => {

        const canvasWidth = this.canvas.getWidth;
        const canvasHeight = this.canvas.getHeight;

        // canvasより大きい場合収まるようにリサイズする
        if (selectedImage.width > canvasWidth) {
          selectedImage.height = selectedImage.height * (canvasWidth / selectedImage.width)
          selectedImage.width = canvasWidth
        }
        if (selectedImage.height > canvasHeight) {
          selectedImage.width = selectedImage.width * (canvasHeight / selectedImage.height)
          selectedImage.height = canvasHeight
        }

        this.pauseStreamingVideo();
        this.canvas.drawImageCenter(selectedImage);
        this.image = selectedImage.src
      }
      selectedImage.src = evt.target.result;
    }
    reader.readAsDataURL(file)
  }

  private openFileSelector() {
    (this.$refs.input as any).click()
  }

  private startStreamingVideo() {

    const fileObj: HTMLDataElement = document.getElementById('file') as HTMLDataElement;
    fileObj.value = '';
    this.taken = false;

    navigator.mediaDevices.getUserMedia({video: true}).then((stream) => {
      this.video.srcObject = stream;
      const canvasUpdate = () => {
        this.canvas.drawImage(this.video);
        if (!this.taken) {
          this.animationId = requestAnimationFrame(canvasUpdate);
        }
      }
      canvasUpdate();
    });

    this.cameraOn = true;
  }

  private pauseStreamingVideo() {
    this.taken = true;
    cancelAnimationFrame(this.animationId);
    this.canvas.clearRect();
  }

  public stopStreamingVideo() {

    const videoElem = this.video;

    if (videoElem.srcObject) {

      const stream = videoElem.srcObject as MediaStream;
      const tracks = stream.getTracks();

      tracks.forEach(function (track: MediaStreamTrack) {
        track.stop();
      });

      videoElem.srcObject = null;
    }

    cancelAnimationFrame(this.animationId);
    this.canvas.clearRect();

    this.cameraOn = false;
  }

  @Emit()
  public input(image: string) {
    /* tslint:disable:no-empty */
  }

  private get image(): string {
    return this.imageData
  }

  private set image(image: string) {
    this.input(image)
  }
}
</script>

<style scoped>
.camera-style {
  background: #F5F5F5;
  max-width: 720px;
}

#canvas {
  width: 100%;
}
</style>