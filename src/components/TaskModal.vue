<template>
  <v-dialog :model-value="true" max-width="680" @update:modelValue="$emit('close')">
    <v-card class="modal" rounded="xl">
      <v-card-title class="modal-pad-title d-flex align-center justify-space-between">
        <div class="t-h2">
          {{ mode === 'create' ? 'Create task' : 'Edit task' }}
        </div>

        <v-btn class="icon-close" icon size="small" variant="tonal" @click="$emit('close')">
          <v-icon icon="mdi-close" />
        </v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text class="modal-pad-body pt-4">
        <v-text-field
          v-model="form.title"
          label="Title"
          variant="outlined"
          density="comfortable"
          :error="!!error"
          :error-messages="error ? [error] : []"
          hide-details="auto"
        />

        <div class="mt-4">
          <div class="t-label mb-2">Priority</div>

          <v-btn-toggle
            v-model="form.priority"
            mandatory
            divided
            rounded="lg"
            variant="tonal"
          >
            <v-btn value="high">High</v-btn>
            <v-btn value="medium">Medium</v-btn>
            <v-btn value="low">Low</v-btn>
          </v-btn-toggle>
        </div>

        <div class="mt-5">
          <div class="t-label mb-2">Deadline</div>

          <v-chip size="small" variant="tonal" class="mb-3">
            Selected: {{ deadlineText }}
          </v-chip>

          <v-card variant="tonal" class="panel">
            <CalendarPicker v-model="form.deadlineDate" />
          </v-card>
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions class="modal-pad-actions pa-4 d-flex justify-end">
        <v-btn variant="tonal" rounded="pill" @click="$emit('close')">
          Cancel
        </v-btn>
        <v-btn color="primary" variant="flat" rounded="pill" @click="save">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import CalendarPicker from './layout/CalendarPicker.vue'
import { validateTaskPayload } from '../utils/validators.js'

export default {
  name: 'TaskModal',
  components: { CalendarPicker },
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
        this.error = ''
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
      const d = new Date(this.form.deadlineDate + 'T00:00:00')
      if (isNaN(d.getTime())) return 'No deadline'
      return d.toLocaleDateString()
    }
  },
  methods: {
    save() {
      const res = validateTaskPayload({
        title: this.form.title,
        deadlineDate: this.form.deadlineDate,
        priority: this.form.priority
      })

      if (!res.ok) {
        this.error = res.error || 'Check the fields'
        return
      }

      this.error = ''
      this.$emit('save', res.payload)
    }
  }
}
</script>
