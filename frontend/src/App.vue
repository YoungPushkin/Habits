<script>
import WelcomeView from './views/WelcomeView.vue'
import RegisterView from './views/RegisterView.vue'

export default {
  name: 'App',
  components: { WelcomeView, RegisterView },
  data() {
    return {
      screen: 'welcome'
    }
  }
}
</script>

<template>
  <div class="app-root">
    <WelcomeView
      v-if="screen === 'welcome'"
      @start="screen = 'register'"
    />

    <RegisterView
      v-if="screen === 'register'"
      @back="screen = 'welcome'"
      @complete="screen = 'main'"
    />

    <div
      class="app-main-placeholder"
      v-if="screen === 'main'"
    >
      MAIN APP LAYOUT IS COMING SOON
    </div>
  </div>
</template>

<style>
.app-root {
  min-height: 100vh;
  width: 100%;
  background: #050505;
  color: white;
}

.app-main-placeholder {
  padding: 40px;
  font-size: 24px;
  text-align: center;
}
</style>
