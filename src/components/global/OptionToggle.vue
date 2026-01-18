<template>
  <v-btn-toggle
    :model-value="modelValue"
    :mandatory="mandatory"
    :density="density"
    :variant="variant || undefined"
    :divided="divided"
    :rounded="rounded"
    v-bind="$attrs"
    @update:modelValue="$emit('update:modelValue', $event)"
  >
    <v-btn
      v-for="opt in options"
      :key="opt.value"
      :value="opt.value"
      :variant="buttonVariant || undefined"
      :class="buttonClass"
    >
      {{ opt.label }}
    </v-btn>
  </v-btn-toggle>
</template>

<script>
export default {
  name: 'OptionToggle',
  inheritAttrs: false,
  props: {
    modelValue: { type: [String, Number, Boolean], default: undefined },
    options: { type: Array, default: () => [] },
    mandatory: { type: Boolean, default: true },
    density: { type: String, default: 'comfortable' },
    variant: { type: String, default: undefined },
    divided: { type: Boolean, default: false },
    rounded: { type: String, default: '' },
    buttonVariant: { type: String, default: undefined },
    buttonClass: { type: [String, Array, Object], default: '' }
  },
  emits: ['update:modelValue']
}
</script>
