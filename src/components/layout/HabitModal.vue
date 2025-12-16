<template>
  <v-dialog :model-value="true" max-width="520" @update:modelValue="$emit('close')">
    <v-card class="hf-modal-card" rounded="xl">
      <v-card-title class="hf-modal-title d-flex align-center justify-space-between">
        <span class="t-h2">{{ mode === 'create' ? 'Create habit' : 'Edit habit' }}</span>
        <v-btn class="hf-icon-btn" icon variant="text" @click="$emit('close')">
          <i class="bi bi-x-lg"></i>
        </v-btn>
      </v-card-title>

      <v-card-text class="hf-modal-body pt-2">
        <div class="d-flex flex-column ga-4">
          <div>
            <div class="t-label mb-2">Name</div>
            <v-text-field v-model="localForm.name" variant="outlined" density="comfortable" hide-details />
          </div>

          <div>
            <div class="t-label mb-2">Category</div>
            <v-row dense>
              <v-col v-for="c in categories" :key="c.value" cols="12" sm="6">
                <v-btn
                  block
                  variant="tonal"
                  :color="localForm.category === c.value ? 'primary' : undefined"
                  @click="localForm.category = c.value"
                >
                  <span class="me-2" :style="{width:'10px',height:'10px',borderRadius:'999px',background:c.color,display:'inline-block'}"></span>
                  {{ c.label }}
                </v-btn>
              </v-col>
            </v-row>
          </div>

          <div>
            <div class="t-label mb-2">Repeat</div>
            <v-btn-toggle v-model="repeatMode" mandatory density="comfortable">
              <v-btn value="daily">Every day</v-btn>
              <v-btn value="days">Specific days</v-btn>
            </v-btn-toggle>
          </div>

          <div v-if="repeatMode === 'days'">
            <div class="t-label mb-2">Days of week</div>
            <v-btn-toggle multiple>
              <v-btn
                v-for="(d, idx) in days"
                :key="idx"
                :variant="localForm.days[idx] ? 'flat' : 'tonal'"
                color="primary"
                @click="toggleDay(idx)"
              >
                {{ d }}
              </v-btn>
            </v-btn-toggle>
          </div>
        </div>
      </v-card-text>

      <v-card-actions class="hf-modal-actions justify-end d-flex">
        <v-btn variant="text" @click="$emit('close')">Cancel</v-btn>
        <v-btn color="primary" variant="flat" @click="onSave">
          {{ mode === 'create' ? 'Save habit' : 'Save changes' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'HabitModal',
  props: { mode: { type: String, default: 'create' }, habit: { type: Object, default: null } },
  emits: ['close', 'save'],
  data() {
    return {
      localForm: { name: '', category: 'other', isDaily: true, days: [true, true, true, true, true, false, false] },
      categories: [
        { value: 'sport', label: 'Sport', color: '#ef4444' },
        { value: 'study', label: 'Study', color: '#d4af37' },
        { value: 'health', label: 'Health', color: '#22c55e' },
        { value: 'work', label: 'Work', color: '#3b82f6' },
        { value: 'other', label: 'Other', color: '#a855f7' }
      ],
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      repeatMode: 'daily'
    }
  },
  watch: {
    habit: {
      immediate: true,
      handler(val) {
        if (!val) {
          this.localForm = { name: '', category: 'other', isDaily: true, days: [true, true, true, true, true, false, false] }
        } else {
          this.localForm.name = val.name || ''
          this.localForm.category = val.category || 'other'
          this.localForm.isDaily = val.isDaily !== undefined ? val.isDaily : true
          this.localForm.days = Array.isArray(val.days) ? val.days.slice(0, 7) : [true, true, true, true, true, false, false]
        }
        this.repeatMode = this.localForm.isDaily ? 'daily' : 'days'
      }
    },
    repeatMode(v) {
      this.localForm.isDaily = (v === 'daily')
    }
  },
  methods: {
    toggleDay(idx) {
      const arr = this.localForm.days.slice()
      arr[idx] = !arr[idx]
      this.localForm.days = arr
    },
    onSave() {
      const name = (this.localForm.name || '').trim()
      if (!name) return
      this.$emit('save', {
        name,
        category: this.localForm.category,
        isDaily: this.localForm.isDaily,
        days: this.localForm.days.slice()
      })
    }
  }
}
</script>
