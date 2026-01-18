<template>
  <v-dialog :model-value="true" :max-width="maxWidth" @update:modelValue="$emit('close')">
    <v-card class="modal" rounded="xl">
      <v-card-title class="modal-pad-title d-flex align-center justify-space-between">
        <div class="t-h2">{{ title }}</div>
        <BaseButton :class="closeClass" kind="icon" icon size="small" @click="$emit('close')">
          <v-icon icon="mdi-close" />
        </BaseButton>
      </v-card-title>

      <v-divider />

      <v-card-text class="modal-pad-body" :class="bodyClass">
        <slot />
      </v-card-text>

      <v-divider />

      <v-card-actions class="modal-pad-actions d-flex justify-end" :class="actionsClass">
        <slot name="actions" v-if="hasActionsSlot" />
        <template v-else>
          <BaseButton
            v-if="secondaryLabel"
            :kind="secondaryKind"
            :color="secondaryColor"
            :variant="secondaryVariant"
            :disabled="secondaryDisabled"
            @click="$emit('secondary')"
          >
            {{ secondaryLabel }}
          </BaseButton>
          <BaseButton
            v-if="primaryLabel"
            :kind="primaryKind"
            :color="primaryColor"
            :variant="primaryVariant"
            :disabled="primaryDisabled"
            @click="$emit('primary')"
          >
            {{ primaryLabel }}
          </BaseButton>
        </template>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import BaseButton from './BaseButton.vue'

export default {
  name: 'BaseModal',
  components: { BaseButton },
  props: {
    title: { type: String, required: true },
    maxWidth: { type: [Number, String], default: 680 },
    bodyClass: { type: [String, Array, Object], default: '' },
    actionsClass: { type: [String, Array, Object], default: '' },
    closeClass: { type: [String, Array, Object], default: 'btn-icon' },
    primaryLabel: { type: String, default: '' },
    secondaryLabel: { type: String, default: '' },
    primaryKind: { type: String, default: 'primary' },
    secondaryKind: { type: String, default: 'action' },
    primaryVariant: { type: String, default: '' },
    secondaryVariant: { type: String, default: '' },
    primaryColor: { type: String, default: undefined },
    secondaryColor: { type: String, default: undefined },
    primaryDisabled: { type: Boolean, default: false },
    secondaryDisabled: { type: Boolean, default: false }
  },
  emits: ['close', 'primary', 'secondary'],
  computed: {
    hasActionsSlot() {
      return !!this.$slots.actions
    }
  }
}
</script>
