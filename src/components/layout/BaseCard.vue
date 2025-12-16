<template>
  <v-card class="card" variant="tonal" elevation="0">
    <v-card-text>
      <slot />
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'BaseCard'
}
</script>
