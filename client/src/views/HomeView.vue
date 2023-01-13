<template>
  <div class="fixed-center" :style="{ width: size }">
    <div v-if="isPlaying">
      <q-responsive :ratio="16 / 9">
        <video-component :onEnded="onEnded" :src="src" />
      </q-responsive>
    </div>
    <div v-else class="text-center">
      <q-btn label="Click to link" class="button" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import VideoComponent from '@/components/VideoComponent.vue'
import { onMounted, ref } from 'vue';
import VideoApi from '@/api/video'
const isPlaying = ref(true)
const size = ref('1080px')

const videoId = ref(1)
let timer: number;
let videoNumber: number = 0;

const src = ref(`${import.meta.env.VITE_ENV == 'PROD' ? '' : 'http://localhost:3001'}` + '/api/video/all')

onMounted(async () => {
  videoNumber = await (await VideoApi.videoLength()).length
  const screenHeight = window.screen.height;
  const screenWidth = window.screen.width;
  if (screenHeight > screenWidth) {
    size.value = screenWidth + 'px';
  }
  else {
    size.value = (screenWidth * 0.6) + 'px'
  }
  rndVideo()
})

function rndVideo() {
  videoId.value = Math.floor(Math.random() * videoNumber) + 1;
}

function onEnded() {
  isPlaying.value = false
  timer = setTimeout(() => {
    isPlaying.value = true
    rndVideo()
    clearTimeout(timer);
  }, 3000)
}

</script>

<style scoped>
.button {
  padding: 15px 25px;
  font-size: 24px;
  text-align: center;
  cursor: pointer;
  outline: none;
  color: #fff;
  background-color: #04AA6D;
  border: none;
  border-radius: 15px;
  box-shadow: 0 9px #999;
}

.button:hover {
  background-color: #3e8e41
}

.button:active {
  background-color: #3e8e41;
  box-shadow: 0 5px #666;
  transform: translateY(4px);
}
</style>