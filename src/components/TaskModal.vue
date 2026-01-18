<template>
  <BaseModal
    :title="mode === 'create' ? 'Create task' : 'Edit task'"
    :max-width="750"
    :max-height="800"
    body-class="pt-4"
    actions-class="pa-4"
    close-class="icon-close"
    :primary-label="buttonLabels.save"
    :secondary-label="buttonLabels.cancel"
    @primary="save"
    @secondary="$emit('close')"
    @close="$emit('close')"
  >
    <v-text-field
      v-model="form.title"
      label="Title"
      variant="outlined"
      density="comfortable"
      :placeholder="error && !form.title ? error : ''"
      :error="!!error"
      hide-details="auto"
      @update:modelValue="clearError"
    />

    <div class="mt-4">
      <div class="t-label mb-2">Priority</div>

      <OptionToggle
        v-model="form.priority"
        :options="priorityOptions"
        mandatory
        divided
        rounded="lg"
        variant="tonal"
      />
    </div>

    <div class="mt-5">
      <div class="t-label mb-2">Deadline</div>

      <BaseChip size="small" variant="tonal" class="mb-3">
        Selected: {{ deadlineText }}
      </BaseChip>

      <v-card variant="tonal" class="panel">
        <CalendarPicker v-model="form.deadlineDate" />
      </v-card>
    </div>

  </BaseModal>
</template>

<script>
import CalendarPicker from './global/CalendarPicker.vue'
import { validateTaskPayload } from '../utils/validators.js'
import BaseModal from './global/BaseModal.vue'
import BaseChip from './global/BaseChip.vue'
import { BUTTON_LABELS } from '../constants/buttons.js'
import { TASK_PRIORITY_OPTIONS } from '../constants/options.js'
import { formatISODate } from '../utils/date.js'
import OptionToggle from './global/OptionToggle.vue'

export default {
  name: 'TaskModal',
  components: { CalendarPicker, BaseModal, BaseChip, OptionToggle },
  props: {
    mode: { type: String, default: 'create' },
    task: { type: Object, default: null }
  },
  emits: ['close', 'save'],
  data() {
    return {
      error: '',
      form: {
        title: '',
        deadlineDate: '',
        priority: 'medium'
      }
    }
  },
  watch: {
    task: {
      immediate: true,
      handler(val) {
        this.clearError()
        if (!val) {
          this.form.title = ''
          this.form.deadlineDate = ''
          this.form.priority = 'medium'
          return
        }
        const raw = val.deadlineDate || val.deadline || val.date || ''
        this.form.title = val.title || ''
        this.form.deadlineDate = raw
        this.form.priority = val.priority || 'medium'
      }
    }
  },
  computed: {
    deadlineText() {
      if (!this.form.deadlineDate) return 'No deadline'
      const text = formatISODate(this.form.deadlineDate)
      return text || 'No deadline'
    },
    buttonLabels() { return BUTTON_LABELS },
    priorityOptions() { return TASK_PRIORITY_OPTIONS }
  },
  methods: {
    setError(msg) {
      this.error = msg || 'Check the fields'
    },
    clearError() {
      this.error = ''
    },
    save() {
      const res = validateTaskPayload({
        title: this.form.title,
        deadlineDate: this.form.deadlineDate,
        priority: this.form.priority
      })

      if (!res.ok) {
        this.setError(res.error || 'Check the fields')
        return
      }

      this.clearError()
      this.$emit('save', res.payload)
    }
  }
}
</script>

<style scoped>
.panel{
  padding:14px;
  border-radius:var(--r-md);
  border:1px solid var(--border2);
  background:rgba(255,255,255,.03);
}
</style>
