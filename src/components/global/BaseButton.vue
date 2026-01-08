<template>
  <v-btn
    :class="kindClass"
    :variant="resolvedVariant"
    :rounded="resolvedRounded"
    :size="size"
    :color="color"
    :icon="icon"
    v-bind="$attrs"
  >
    <slot />
  </v-btn>
</template>

<script>
export default {
  name: 'BaseButton',
  inheritAttrs: false,
  props: {
    kind: {
      type: String,
      default: '',
      validator: v => ['', 'primary', 'action', 'icon'].includes(v)
    },
    variant: { type: String, default: '' },
    rounded: { type: String, default: '' },
    size: { type: [String, Number], default: undefined },
    color: { type: String, default: undefined },
    icon: { type: Boolean, default: false }
  },
  computed: {
    kindClass() {
      if (this.kind === 'primary') return 'btn-primary'
      if (this.kind === 'action') return 'btn-action'
      if (this.kind === 'icon') return 'btn-icon'
      return ''
    },
    resolvedVariant() {
      if (this.variant) return this.variant
      if (this.kind === 'primary') return 'flat'
      if (this.kind === 'action') return 'tonal'
      if (this.kind === 'icon') return 'tonal'
      return undefined
    },
    resolvedRounded() {
      if (this.rounded) return this.rounded
      if (this.kind === 'primary' || this.kind === 'action') return 'pill'
      if (this.kind === 'icon') return 'pill'
      return undefined
    }
  }
}
</script>
