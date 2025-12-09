<script>
import WelcomeView from './views/WelcomeView.vue'

export default {
  name: 'App',
  components: {
    WelcomeView
  }
}
</script>

<template>
  <div class="app-root">
    <WelcomeView />
  </div>
</template>



<style>
.app-root {
  min-height: 100vh;
}
</style>