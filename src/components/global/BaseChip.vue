<template>
  <v-chip
    :size="size"
    :variant="variant"
    :color="color"
    v-bind="$attrs"
  >
    <slot />
  </v-chip>
</template>

<script>
export default {
  name: 'BaseChip',
  inheritAttrs: false,
  props: {
    size: { type: String, default: undefined },
    variant: { type: String, default: '' },
    color: { type: String, default: undefined }
  }
}
</script>
