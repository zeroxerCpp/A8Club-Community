<template>
  <div class="hero-section-wrapper">
    <div class="hero-bg-animation" v-if="!heroImage"></div>
    <!-- 底层：模糊延伸，颜色自然扩展填满两侧 -->
    <img v-if="heroImage" class="hero-bg-blur" :src="heroImage" alt="" />
    <!-- 上层：完整清晰显示 -->
    <div v-if="heroImage" class="hero-bg-img-wrapper">
      <img class="hero-bg-img" :src="heroImage" alt="" />
    </div>
    <div class="hero-particles">
      <span v-for="i in 15" :key="i" class="particle"></span>
    </div>
    <div class="hero-overlay"></div>
    <div class="hero-inner">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { statsAPI } from '../api'

const heroImage = ref('')



onMounted(async () => {
  try {
    const data = await statsAPI.getLatest()
    if (data?.heroImage) {
      heroImage.value = data.heroImage
    }
  } catch (e) {
    // 静默失败
  }
})
</script>

<style scoped>
.hero-section-wrapper {
  background-color: #0a0a1a;
  background-image: radial-gradient(ellipse at 20% 30%, rgba(120, 40, 200, 0.3) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 70%, rgba(30, 100, 200, 0.25) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(100, 50, 150, 0.2) 0%, transparent 50%),
    linear-gradient(180deg, #050510 0%, #0a0a1a 50%, #050510 100%);
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: scroll;
  padding: 80px 24px 70px;
  text-align: center;
  color: #fff;
  position: relative;
  overflow: hidden;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-bg-blur {
  position: absolute;
  inset: -20px;          /* 略超出边界，避免模糊边缘露白 */
  width: calc(100% + 40px);
  height: calc(100% + 40px);
  object-fit: cover;
  filter: blur(24px) brightness(0.75) saturate(1.2);
  z-index: 0;
  transform: scale(1.05); /* 确保模糊边缘不露出 */
}

.hero-bg-img-wrapper {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0;
}

.hero-bg-img {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  display: block;
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 8%,
    black 92%,
    transparent 100%
  );
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 8%,
    black 92%,
    transparent 100%
  );
}

/* 手机端：图片铺满容器，改为上下渐变淡出 */
@media (max-width: 768px) {
  .hero-section-wrapper {
    min-height: 320px;
    padding: 60px 16px 50px;
  }

  .hero-bg-img-wrapper {
    inset: 0;
  }

  .hero-bg-img {
    width: 100%;
    height: 100%;
    max-width: none;
    max-height: none;
    object-fit: cover;
    -webkit-mask-image: linear-gradient(
      to bottom,
      transparent 0%,
      black 8%,
      black 92%,
      transparent 100%
    );
    mask-image: linear-gradient(
      to bottom,
      transparent 0%,
      black 8%,
      black 92%,
      transparent 100%
    );
  }

  .hero-bg-blur {
    inset: -10px;
    width: calc(100% + 20px);
    height: calc(100% + 20px);
  }
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.25) 100%);
  z-index: 1;
}

.hero-inner {
  position: relative;
  z-index: 2;
  width: 100%;
}

.hero-bg-animation {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 30%, rgba(120, 40, 200, 0.25) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 70%, rgba(30, 100, 200, 0.2) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(100, 50, 150, 0.15) 0%, transparent 50%),
    linear-gradient(180deg, #050510 0%, #0a0a1a 50%, #050510 100%);
  animation: cosmicShift 20s ease infinite alternate;
}

@keyframes cosmicShift {
  0%   { transform: scale(1) rotate(0deg); opacity: 1; }
  50%  { transform: scale(1.05) rotate(2deg); opacity: 0.95; }
  100% { transform: scale(1.1) rotate(-2deg); opacity: 1; }
}

.hero-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: float 20s infinite;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.5);
}

.particle:nth-child(odd) { animation-delay: -10s; }
.particle:nth-child(1)  { left: 5%;  top: 20%; animation-duration: 25s; }
.particle:nth-child(2)  { left: 12%; top: 80%; animation-duration: 30s; }
.particle:nth-child(3)  { left: 20%; top: 40%; animation-duration: 22s; }
.particle:nth-child(4)  { left: 28%; top: 70%; animation-duration: 28s; }
.particle:nth-child(5)  { left: 35%; top: 30%; animation-duration: 26s; }
.particle:nth-child(6)  { left: 42%; top: 60%; animation-duration: 24s; }
.particle:nth-child(7)  { left: 50%; top: 50%; animation-duration: 27s; }
.particle:nth-child(8)  { left: 57%; top: 40%; animation-duration: 23s; }
.particle:nth-child(9)  { left: 65%; top: 25%; animation-duration: 29s; }
.particle:nth-child(10) { left: 72%; top: 65%; animation-duration: 21s; }
.particle:nth-child(11) { left: 80%; top: 35%; animation-duration: 26s; }
.particle:nth-child(12) { left: 87%; top: 75%; animation-duration: 24s; }
.particle:nth-child(13) { left: 92%; top: 55%; animation-duration: 28s; }
.particle:nth-child(14) { left: 15%; top: 45%; animation-duration: 32s; }
.particle:nth-child(15) { left: 60%; top: 85%; animation-duration: 20s; }

@keyframes float {
  0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateY(-100vh) translateX(30px); opacity: 0; }
}</style>
