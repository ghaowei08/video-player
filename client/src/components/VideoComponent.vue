<template>
  <video-player :options="playerOption" :onEnded="onEnded" v-if="src" />
</template>

<script lang="ts" setup>
import { VideoPlayer } from '@videojs-player/vue'
import 'video.js/dist/video-js.css'
import { defineEmits } from 'vue'

const emit = defineEmits(['onEnded'])
const props = defineProps({
  src: String
})

const controlBar = {
  fullscreenToggle: false,
  pictureInPictureToggle: false,
  playToggle: false,
  progressControl: false
}

const breakpoints = {
  tiny: 300,
  xsmall: 400,
  small: 500,
  medium: 600,
  large: 700,
  xlarge: 800,
  huge: 900
}


const playerOption = {
  autoplay: true,
  loop: false,
  muted: true,
  responsive: true,
  language: "en",
  controls: true,
  playsinline: true,
  sources: [
    {
      type: "video/mp4",
      src:
        props.src
    }
  ],
  breakpoints: breakpoints,
  controlBar: controlBar,
  userActions: {
    click: false,
    doubleClick: false,
    hotkeys: false,
  }
}

function onEnded() {
  emit('onEnded')
}

</script>
 