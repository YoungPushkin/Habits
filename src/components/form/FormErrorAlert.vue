<template>
  <v-alert
    v-if="message"
    type="error"
    variant="tonal"
    density="comfortable"
    :class="['mb-4', 'form-error-alert', alertClass]"
  >
    {{ message }}
  </v-alert>
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
.form-error-alert :deep(.v-alert__content) {
  font-size: 5px;
  line-height: 1.35;
}
.form-error-alert :deep(.v-alert__wrapper) {
  padding: 8px 12px;
}
</style>
