<template>
  <div class="carousel">
    <div class="carousel-nav">
      <v-btn
        icon
        size="small"
        variant="tonal"
        class="btn-icon act-gold"
        :disabled="isEmpty || atStart"
        @click="prev"
      >
        <i class="bi bi-chevron-left"></i>
      </v-btn>

      <v-chip v-if="!isEmpty" size="small" variant="tonal" color="primary">
        {{ currentIndex + 1 }} / {{ items.length }}
      </v-chip>

      <v-btn
        icon
        size="small"
        variant="tonal"
        class="btn-icon act-gold"
        :disabled="isEmpty || atEnd"
        @click="next"
      >
        <i class="bi bi-chevron-right"></i>
      </v-btn>
    </div>

    <div class="carousel-stage">
      <div v-if="!isEmpty" class="carousel-slide">
        <slot :item="currentItem" :index="currentIndex" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HfCarousel',
  props: {
    items: { type: Array, required: true }
  },
  data() {
    return { currentIndex: 0 }
  },
  computed: {
    isEmpty() {
      return !this.items || this.items.length === 0
    },
    currentItem() {
      return this.isEmpty ? null : this.items[this.currentIndex]
    },
    atStart() {
      return this.currentIndex <= 0
    },
    atEnd() {
      return this.isEmpty ? true : this.currentIndex >= this.items.length - 1
    }
  },
  methods: {
    prev() {
      if (this.atStart) return
      this.currentIndex -= 1
    },
    next() {
      if (this.atEnd) return
      this.currentIndex += 1
    }
  },
  watch: {
    items: {
      deep: true,
      handler() {
        const max = (this.items?.length || 1) - 1
        if (this.currentIndex > max) this.currentIndex = Math.max(0, max)
      }
    }
  }
}
</script>
