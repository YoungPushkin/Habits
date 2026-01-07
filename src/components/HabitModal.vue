<template>
  <BaseModal
    :title="mode === 'create' ? 'Create habit' : 'Edit habit'"
    :max-width="520"
    body-class="pt-2"
    @close="$emit('close')"
  >
    <div>
      <div class="t-label mb-2">Name</div>
      <v-text-field
        v-model="form.name"
        variant="outlined"
        density="comfortable"
        :error="!!error"
        :error-messages="error ? [error] : []"
        hide-details="auto"
        @keydown.enter.prevent="save"
      />
    </div>

    <div class="mt-4">
      <div class="t-label mb-2">Category</div>
      <v-row dense>
        <v-col v-for="c in categories" :key="c.value" cols="12" sm="6">
          <v-btn
            block
            variant="tonal"
            :color="form.category === c.value ? 'primary' : undefined"
            @click="form.category = c.value"
          >
            <span
              :style="{
                width: '10px',
                height: '10px',
                borderRadius: '999px',
                background: c.color,
                display: 'inline-block',
                marginRight: '8px'
              }"
            ></span>
            {{ c.label }}
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <div class="mt-4">
      <div class="t-label mb-2">Repeat</div>
      <v-btn-toggle v-model="repeatMode" mandatory density="comfortable">
        <v-btn value="daily">Every day</v-btn>
        <v-btn value="days">Specific days</v-btn>
      </v-btn-toggle>
    </div>

    <div v-if="repeatMode === 'days'" class="mt-4">
      <div class="t-label mb-2">Days of week</div>

      <div class="d-flex flex-wrap ga-2">
        <v-btn
          v-for="(d, idx) in weekLabels"
          :key="idx"
          size="small"
          :variant="isSelected(idx) ? 'flat' : 'tonal'"
          :color="isSelected(idx) ? 'primary' : undefined"
          class="day-chip"
          @click="toggleIdx(idx)"
        >
          {{ d }}
        </v-btn>
      </div>

      <FormErrorAlert :message="daysError ? error : ''" alert-class="mt-3" />
    </div>

    <template #actions>
      <v-btn variant="tonal" rounded="pill" @click="$emit('close')">
        Cancel
      </v-btn>
      <v-btn class="btn-primary" variant="flat" @click="save">
        {{ mode === 'create' ? 'Save habit' : 'Save changes' }}
      </v-btn>
    </template>
  </BaseModal>
</template>

<script>
import { validateHabitPayload } from '../utils/validators.js'
import BaseModal from './global/BaseModal.vue'
import { HABIT_CATEGORIES } from '../constants/habitCategories.js'
import FormErrorAlert from './form/FormErrorAlert.vue'

export default {
  name: 'HabitModal',
  components: { BaseModal, FormErrorAlert },
  props: {
    mode: { type: String, default: 'create' },
    habit: { type: Object, default: null }
  },
  emits: ['close', 'save'],
  data() {
    return {
      error: '',
      weekLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      categories: HABIT_CATEGORIES,
      repeatMode: 'daily',
      daysError: false,
      form: {
        name: '',
        category: 'other',
        daysIdx: [] 
      }
    }
  },
  watch: {
    habit: {
      immediate: true,
      handler(val) {
        this.clearError()

        if (!val) {
          this.form = { name: '', category: 'other', daysIdx: [] }
          this.repeatMode = 'daily'
          return
        }

        this.form.name = val.name || ''
        this.form.category = val.category || 'other'
        this.form.daysIdx = this.toDaysIdx(val.days)

        this.repeatMode = val.isDaily ? 'daily' : 'days'
      }
    },
    repeatMode() {
      this.daysError = false
    }
  },
  methods: {
    setError(msg, code) {
      this.error = msg || 'Check the fields'
      this.daysError = code === 'DAYS'
    },
    clearError() {
      this.error = ''
      this.daysError = false
    },
    isSelected(idx) {
      return Array.isArray(this.form.daysIdx) && this.form.daysIdx.includes(idx)
    },

    toggleIdx(idx) {
      const arr = Array.isArray(this.form.daysIdx) ? this.form.daysIdx.slice() : []
      const pos = arr.indexOf(idx)
      if (pos >= 0) arr.splice(pos, 1)
      else arr.push(idx)
      arr.sort((a, b) => a - b)
      this.form.daysIdx = arr
      if (this.daysError && arr.length > 0) this.daysError = false
    },

    toDaysIdx(days) {
      if (Array.isArray(days) && days.length === 7 && days.every(v => typeof v === 'boolean')) {
        const out = []
        for (let i = 0; i < 7; i++) if (days[i]) out.push(i)
        return out
      }
      if (Array.isArray(days) && days.every(v => Number.isInteger(v))) {
        return days.filter(i => i >= 0 && i < 7).sort((a, b) => a - b)
      }
      return []
    },

    toDaysBool(idxArr) {
      const out = [false, false, false, false, false, false, false]
      const arr = Array.isArray(idxArr) ? idxArr : []
      arr.forEach(i => {
        if (Number.isInteger(i) && i >= 0 && i < 7) out[i] = true
      })
      return out
    },

    save() {
      const isDaily = (this.repeatMode === 'daily')
      const days = isDaily
        ? [false, false, false, false, false, false, false] 
        : this.toDaysBool(this.form.daysIdx)

      const res = validateHabitPayload({
        name: this.form.name,
        category: this.form.category,
        isDaily,
        days
      })

      if (!res.ok) {
        this.setError(res.error || 'Check the fields', res.code)
        return
      }

      this.clearError()
      this.$emit('save', res.payload)
    }
  }
}
</script>

<style scoped>
.day-chip{border:1px solid rgba(212,175,55,.16)}
</style>
