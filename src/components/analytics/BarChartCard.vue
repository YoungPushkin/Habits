<template>
  <BaseCard :title="title" :subtitle="subtitle">
    <div v-if="items && items.length" class="chart-bars">
      <div v-for="item in items" :key="item.label" class="chart-col">
        <div class="chart-box">
          <div class="chart-fill" :style="{ height: barHeight(item.count) + '%' }"></div>
        </div>
        <span class="t-cap">{{ item.label }}</span>
        <span class="t-cap">{{ item.count }}</span>
      </div>
    </div>
    <div v-else class="t-cap">No data</div>
  </BaseCard>
</template>

<script>
import { percentOfMax } from '../../utils/chart.js'
import BaseCard from '../global/BaseCard.vue'

export default {
  name: 'BarChartCard',
  components: { BaseCard },
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    items: { type: Array, default: () => [] }
  },
  methods: {
    barHeight(count) {
      return percentOfMax(count, (this.items || []).map(i => i.count))
    }
  }
}
</script>

<style scoped>
.chart-bars{
  display:flex;
  align-items:flex-end;
  gap:12px;
  height:150px;
}
.chart-col{
  flex:1;
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:6px;
  min-width:0;
}
.chart-box{
  width:100%;
  height:110px;
  border-radius:var(--r-md);
  border:1px solid var(--border2);
  background:rgba(255,255,255,.03);
  overflow:hidden;
  display:flex;
  align-items:flex-end;
}
.chart-fill{
  width:100%;
  background:linear-gradient(180deg,var(--gold2),var(--gold));
}
</style>
