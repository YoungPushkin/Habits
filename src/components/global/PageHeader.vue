<template>
  <div class="page-head">
    <div class="page-title">
      <h1 class="t-h1 text-gold">{{ title }}</h1>
      <p class="t-sub text-gold">{{ subtitle }}</p>
    </div>

    <div class="page-meta">
      <slot name="meta" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageHeader',
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, default: '' }
  }
}
</script>

<style scoped>
.page-head{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:16px;
  margin-bottom:18px;
}
.page-title{display:flex;flex-direction:column;gap:6px}
.page-meta{display:flex;gap:10px;flex-wrap:wrap}
.page-actions{display:flex;justify-content:flex-end;margin:6px 0 16px}

@media (max-width:900px){
  .page-head{flex-direction:column}
  .page-actions{justify-content:flex-start}
}
</style>
