<template>
  <div v-if="visible" class="habit-modal-backdrop" @click.self="onClose">
    <div class="habit-modal">
      <div class="habit-modal-header">
        <h3 class="habit-modal-title">
          {{ mode === 'create' ? 'Create habit' : 'Edit habit' }}
        </h3>
        <button type="button" class="habit-modal-close" @click="onClose">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <div class="habit-modal-body">
        <div class="habit-modal-field">
          <label class="habit-modal-label">Name</label>
          <input
            v-model="localForm.name"
            type="text"
            class="habit-modal-input"
            required
          />
        </div>

        <div class="habit-modal-field">
          <label class="habit-modal-label">Category</label>
          <div class="habit-modal-categories">
            <button
              v-for="c in categories"
              :key="c.value"
              type="button"
              class="habit-modal-cat-btn"
              :class="{ active: localForm.category === c.value }"
              @click="localForm.category = c.value"
            >
              <span class="habit-modal-cat-color" :style="{ backgroundColor: c.color }"></span>
              <span>{{ c.label }}</span>
            </button>
          </div>
        </div>

        <div class="habit-modal-field">
          <label class="habit-modal-label">Repeat</label>
          <div class="habit-modal-toggle">
            <button
              type="button"
              class="habit-modal-toggle-btn"
              :class="{ active: localForm.isDaily }"
              @click="localForm.isDaily = true"
            >
              Every day
            </button>
            <button
              type="button"
              class="habit-modal-toggle-btn"
              :class="{ active: !localForm.isDaily }"
              @click="localForm.isDaily = false"
            >
              Specific days
            </button>
          </div>
        </div>

        <div v-if="!localForm.isDaily" class="habit-modal-field">
          <label class="habit-modal-label">Days of week</label>
          <div class="habit-modal-days">
            <button
              v-for="(d, idx) in days"
              :key="idx"
              type="button"
              class="habit-modal-day"
              :class="{ active: localForm.days[idx] }"
              @click="toggleDay(idx)"
            >
              {{ d }}
            </button>
          </div>
        </div>
      </div>

      <div class="habit-modal-footer">
        <button type="button" class="habit-modal-btn ghost" @click="onClose">
          Cancel
        </button>
        <button type="button" class="habit-modal-btn primary" @click="onSave">
          {{ mode === 'create' ? 'Save habit' : 'Save changes' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HabitModal',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    mode: {
      type: String,
      default: 'create'
    },
    habit: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'save'],
  data() {
    return {
      localForm: {
        name: '',
        category: 'other',
        isDaily: true,
        days: [true, true, true, true, true, false, false]
      },
      categories: [
        { value: 'sport', label: 'Sport', color: '#ef4444' },
        { value: 'study', label: 'Study', color: '#d4af37' },
        { value: 'health', label: 'Health', color: '#22c55e' },
        { value: 'work', label: 'Work', color: '#3b82f6' },
        { value: 'other', label: 'Other', color: '#a855f7' }
      ],
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  },
  watch: {
    habit: {
      handler(val) {
        if (val) {
          this.localForm.name = val.name || ''
          this.localForm.category = val.category || 'other'
          this.localForm.isDaily = val.isDaily !== undefined ? val.isDaily : true
          this.localForm.days = Array.isArray(val.days)
            ? val.days.slice(0, 7)
            : [true, true, true, true, true, false, false]
        } else {
          this.resetLocal()
        }
      },
      immediate: true
    },
    visible(val) {
      if (!val) this.resetLocal()
    }
  },
  methods: {
    resetLocal() {
      this.localForm.name = ''
      this.localForm.category = 'other'
      this.localForm.isDaily = true
      this.localForm.days = [true, true, true, true, true, false, false]
    },
    toggleDay(idx) {
      const arr = this.localForm.days.slice()
      arr[idx] = !arr[idx]
      this.localForm.days = arr
    },
    onClose() {
      this.$emit('close')
    },
    onSave() {
      const name = (this.localForm.name || '').trim()
      if (!name) return
      this.$emit('save', {
        name: name,
        category: this.localForm.category,
        isDaily: this.localForm.isDaily,
        days: this.localForm.days.slice()
      })
    }
  }
}
</script>
