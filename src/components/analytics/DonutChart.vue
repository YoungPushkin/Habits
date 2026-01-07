<template>
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
</template>

<script>
export default {
  name: 'DonutChart',
  props: {
    segments: {
      type: Array,
      default: () => [] // [{ key, percent, className }]
    }
  },
  computed: {
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
