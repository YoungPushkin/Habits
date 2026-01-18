<template>
  <div v-if="message" :class="['form-error-text', alertClass]">
    {{ message }}
  </div>
</template>

<script>
export default {
  name: 'FormErrorAlert',
  props: {
    message: { type: String, default: '' },
    alertClass: { type: [String, Array, Object], default: '' }
  }
}
</script>

<style scoped>
.form-error-text{
  font-size:12px;
  line-height:1.35;
  color:rgb(var(--v-theme-error));
  margin-top:4px;
}
</style>
