<template>
  <div>
    <v-row justify="center" align="center">
      <video ref="video" id="video" width="500" height="500" autoplay></video>
    </v-row>
    <v-row justify="center" align="center">
      <v-btn color="primary" @click=capture>Take A Picture of You</v-btn>
    </v-row>
    <v-row justify="center" align="center">
      <canvas ref="canvas" id="canvas" width="500" height="500"></canvas>
    </v-row>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class HelloWorld extends Vue {
  video = document.getElementById('video')

  mounted () {
    this.video = document.getElementById('video')
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      this.video.srcObject = stream
    })
  }

  capture () {
    console.log("test")
    document.getElementById('canvas').getContext('2d').drawImage(this.video, 0, 0, 500, 500)
    // this.canvas.toDataURL('image/png')でリクエスト
  }
}
</script>

<style>
</style>
