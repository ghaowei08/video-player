<template>
  <div class="q-ma-md">
    <video-player :src="`http://localhost:3001/video`" controls :loop="true" :volume="0.6" @ended="handleEnded" />
  </div>
</template>

<script lang="ts" setup>
import { VideoPlayer } from '@videojs-player/vue'
import 'video.js/dist/video-js.css'

function handleEnded() {
  console.log("Herer")
}
</script>