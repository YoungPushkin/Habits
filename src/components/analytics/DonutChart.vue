<template>
  <BaseCard v-if="hasCard" :title="title" :subtitle="subtitle">
    <template v-if="$slots.meta" #meta>
      <slot name="meta" />
    </template>

    <div :class="['donut-wrap', contentClass]">
      <div class="donut" :class="{ 'donut-center': !!$slots.label }">
        <svg viewBox="0 0 36 36" class="ring">
          <path
            class="ring-bg"
            d="M18 2.0845 a 15.9155 15.9155 0 1 1 0 31.831 a 15.9155 15.9155 0 1 1 0 -31.831"
          />

          <path
            v-for="seg in normalized"
            :key="seg.key"
            class="ring-seg"
            :class="seg.className"
            :stroke-dasharray="seg.percent + ', 100'"
            :stroke-dashoffset="seg.offset"
            d="M18 2.0845 a 15.9155 15.9155 0 1 1 0 31.831 a 15.9155 15.9155 0 1 1 0 -31.831"
          />
        </svg>

        <div v-if="$slots.label" class="donut-label">
          <slot name="label" />
        </div>
      </div>

      <div v-if="showExtra" class="donut-extra">
        <template v-if="empty && emptyText">
          <div class="t-cap">{{ emptyText }}</div>
        </template>
        <template v-else>
          <slot />

          <template v-if="$slots.legend">
            <slot name="legend" />
          </template>
          <div v-else-if="hasLegendItems" class="legend">
            <div
              v-for="item in legendItems"
              :key="item.key"
              class="legend-item t-cap"
              :class="item.className"
            >
              <span class="legend-dot"></span>
              {{ item.label }} ({{ item.count }})
            </div>
          </div>
        </template>
      </div>
    </div>
  </BaseCard>

  <div v-else :class="['donut-wrap', contentClass]">
    <div class="donut" :class="{ 'donut-center': !!$slots.label }">
      <svg viewBox="0 0 36 36" class="ring">
        <path
          class="ring-bg"
          d="M18 2.0845 a 15.9155 15.9155 0 1 1 0 31.831 a 15.9155 15.9155 0 1 1 0 -31.831"
        />

        <path
          v-for="seg in normalized"
          :key="seg.key"
          class="ring-seg"
          :class="seg.className"
          :stroke-dasharray="seg.percent + ', 100'"
          :stroke-dashoffset="seg.offset"
          d="M18 2.0845 a 15.9155 15.9155 0 1 1 0 31.831 a 15.9155 15.9155 0 1 1 0 -31.831"
        />
      </svg>

    <div v-if="$slots.label" class="donut-label">
      <slot name="label" />
    </div>
  </div>

    <div v-if="showExtra" class="donut-extra">
      <template v-if="empty && emptyText">
        <div class="t-cap">{{ emptyText }}</div>
      </template>
      <template v-else>
        <slot />

        <template v-if="$slots.legend">
          <slot name="legend" />
        </template>
        <div v-else-if="hasLegendItems" class="legend">
          <div
            v-for="item in legendItems"
            :key="item.key"
            class="legend-item t-cap"
            :class="item.className"
          >
            <span class="legend-dot"></span>
            {{ item.label }} ({{ item.count }})
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import BaseCard from '../global/BaseCard.vue'

export default {
  name: 'DonutChart',
  components: { BaseCard },
  props: {
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    card: { type: Boolean, default: false },
    contentClass: { type: [String, Array, Object], default: '' },
    empty: { type: Boolean, default: false },
    emptyText: { type: String, default: '' },
    segments: {
      type: Array,
      default: () => [] // [{ key, percent, className }]
    },
    legendItems: {
      type: Array,
      default: () => [] // [{ key, label, count, className }]
    }
  },
  computed: {
    hasCard() {
      return this.card || !!this.title || !!this.subtitle || !!this.$slots.meta
    },
    hasLegendItems() {
      return (this.legendItems || []).length > 0
    },
    showExtra() {
      return !!this.$slots.default || !!this.$slots.legend || this.hasLegendItems || (this.empty && !!this.emptyText)
    },
    normalized() {
      let offset = 0
      return (this.segments || []).map(seg => {
        const pct = Math.max(0, Math.min(Number(seg.percent) || 0, 100))
        const current = { ...seg, percent: pct, offset: -offset }
        offset += pct
        return current
      })
    }
  }
}
</script>

<style scoped>
.donut{
  width:130px;
  height:130px;
  display:flex;
  align-items:center;
  justify-content:center;
}

.donut-center{
  position:relative;
  width:180px;
  height:180px;
  margin:0 auto;
}

.donut-label{
  position:absolute;
  inset:0;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:2px;
}

.ring{width:100%;height:100%}
.ring-bg{
  fill:none;
  stroke:rgba(255,255,255,.08);
  stroke-width:3;
}
.ring-seg{
  fill:none;
  stroke-width:3;
  stroke-linecap:round;
  stroke:var(--p);
}
</style>
