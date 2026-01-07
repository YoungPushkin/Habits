<template>
  <v-dialog :model-value="true" :max-width="maxWidth" @update:modelValue="$emit('close')">
    <v-card class="modal" rounded="xl">
      <v-card-title class="modal-pad-title d-flex align-center justify-space-between">
        <div class="t-h2">{{ title }}</div>
        <v-btn :class="closeClass" icon size="small" variant="tonal" @click="$emit('close')">
          <v-icon icon="mdi-close" />
        </v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text class="modal-pad-body" :class="bodyClass">
        <slot />
      </v-card-text>

      <v-divider />

      <v-card-actions class="modal-pad-actions d-flex justify-end" :class="actionsClass">
        <slot name="actions" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'BaseModal',
  props: {
    title: { type: String, required: true },
    maxWidth: { type: [Number, String], default: 680 },
    bodyClass: { type: [String, Array, Object], default: '' },
    actionsClass: { type: [String, Array, Object], default: '' },
    closeClass: { type: [String, Array, Object], default: 'btn-icon' }
  },
  emits: ['close']
}
</script>
