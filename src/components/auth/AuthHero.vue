<template>
  <div :class="['auth-hero', wrapperClass]">
    <img :src="logo" alt="Habit Flow logo" :class="imgClass" />
    <div class="logo-text text-gold">Habit Flow</div>
  </div>
</template>

<script>
import logo from '../../assets/images/logo.png'

export default {
  name: 'AuthHero',
  props: {
    wrapperClass: { type: [String, Array, Object], default: '' },
    imgClass: { type: String, default: 'auth-logo' }
  },
  data() {
    return { logo }
  }
}
</script>

<style scoped>
.auth-logo{
  width:200px;
  height:200px;
  display:block;
  object-fit:contain;
  border-radius:50%;
  image-rendering:auto;
}
.auth-hero{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:20px;
  margin:0 auto 10px auto;
}
.logo-text{
  font-family:var(--font-accent);
  letter-spacing:.7em;
  text-transform:uppercase;
  font-size:50px;
}
</style>
