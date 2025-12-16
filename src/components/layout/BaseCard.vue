<template>
  <v-card class="hf-card" rounded="xl" elevation="0">
    <v-card-text class="hf-base-card-body">
      <slot />
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'BaseCard'
}
</script>
