<template>
  <div :class="['carousel-controls', alignClass, wrapperClass]">
    <BaseButton
      kind="icon"
      icon
      size="small"
      class="act-gold"
      :disabled="atStart"
      @click="$emit('prev')"
    >
      <i class="bi bi-chevron-left"></i>
    </BaseButton>

    <slot name="center">
      <v-chip v-if="showCounter" size="small" variant="tonal" color="primary">
        {{ index }} / {{ total }}
      </v-chip>
    </slot>

    <BaseButton
      kind="icon"
      icon
      size="small"
      class="act-gold"
      :disabled="atEnd"
      @click="$emit('next')"
    >
      <i class="bi bi-chevron-right"></i>
    </BaseButton>
  </div>
</template>

<script>
import BaseButton from './BaseButton.vue'

export default {
  name: 'CarouselControls',
  components: { BaseButton },
  props: {
    index: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    atStart: { type: Boolean, default: false },
    atEnd: { type: Boolean, default: false },
    showCounter: { type: Boolean, default: true },
    align: {
      type: String,
      default: 'start',
      validator: v => ['start', 'center', 'end'].includes(v)
    },
    wrapperClass: { type: [String, Array, Object], default: '' }
  },
  emits: ['prev', 'next'],
  computed: {
    alignClass() {
      if (this.align === 'center') return 'carousel-controls--center'
      if (this.align === 'end') return 'carousel-controls--end'
      return 'carousel-controls--start'
    }
  }
}
</script>
