<template>
  <v-card class="hf-card" variant="tonal">
    <v-card-title class="d-flex align-center justify-space-between">
      <v-btn variant="tonal" icon size="small" @click="prevMonth">
        <v-icon icon="mdi-chevron-left" />
      </v-btn>

      <div class="cal-title">
        {{ monthLabel }} {{ currentYear }}
      </div>

      <v-btn variant="tonal" icon size="small" @click="nextMonth">
        <v-icon icon="mdi-chevron-right" />
      </v-btn>
    </v-card-title>

    <v-divider />

    <v-card-text class="pt-4">
      <!-- Weekdays -->
      <v-row class="cal-weekdays" dense>
        <v-col v-for="d in weekdays" :key="d" cols="12" sm="auto" class="cal-weekday-col">
          <div class="cal-weekday">{{ d }}</div>
        </v-col>
      </v-row>

      <!-- Grid -->
      <v-row class="cal-grid" dense>
        <v-col
          v-for="cell in cells"
          :key="cell.key"
          cols="12"
          sm="auto"
          class="cal-cell-col"
        >
          <v-btn
            block
            :disabled="!cell.inMonth"
            :variant="cellVariant(cell)"
            :color="cellColor(cell)"
            :class="cellBtnClass(cell)"
            size="small"
            @click="selectCell(cell)"
          >
            {{ cell.day }}
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'CalendarPicker',
  props: {
    modelValue: { type: String, default: '' }
  },
  emits: ['update:modelValue'],
  data() {
    const base = this.modelValue
      ? new Date(this.modelValue + 'T00:00:00')
      : new Date()

    return {
      currentYear: base.getFullYear(),
      currentMonth: base.getMonth()
    }
  },
  computed: {
    weekdays() {
      return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    monthLabel() {
      return [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ][this.currentMonth]
    },
    cells() {
      const first = new Date(this.currentYear, this.currentMonth, 1)
      const last = new Date(this.currentYear, this.currentMonth + 1, 0)
      const daysInMonth = last.getDate()

      // Monday-start calendar
      const jsDay = first.getDay() // 0..6 (Sun..Sat)
      const offset = (jsDay + 6) % 7 // -> 0..6 (Mon..Sun)

      const total = 42
      const out = []

      for (let i = 0; i < total; i++) {
        const dayNumber = i - offset + 1
        const inMonth = dayNumber >= 1 && dayNumber <= daysInMonth
        const dateObj = inMonth
          ? new Date(this.currentYear, this.currentMonth, dayNumber)
          : new Date(this.currentYear, this.currentMonth, 1)

        const iso = inMonth ? this.toISO(dateObj) : ''

        out.push({
          key: `${this.currentYear}-${this.currentMonth}-${i}`,
          day: inMonth ? dayNumber : '',
          inMonth,
          iso
        })
      }

      return out
    }
  },
  watch: {
    modelValue(v) {
      if (!v) return
      const d = new Date(v + 'T00:00:00')
      if (Number.isNaN(d.getTime())) return
      this.currentYear = d.getFullYear()
      this.currentMonth = d.getMonth()
    }
  },
  methods: {
    toISO(d) {
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${y}-${m}-${day}`
    },
    isToday(cell) {
      if (!cell.iso) return false
      return cell.iso === this.toISO(new Date())
    },
    isSelected(cell) {
      return !!(this.modelValue && cell.iso && cell.iso === this.modelValue)
    },
    prevMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11
        this.currentYear -= 1
      } else {
        this.currentMonth -= 1
      }
    },
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0
        this.currentYear += 1
      } else {
        this.currentMonth += 1
      }
    },
    selectCell(cell) {
      if (!cell.inMonth) return
      this.$emit('update:modelValue', cell.iso)
    },

    cellVariant(cell) {
      if (!cell.inMonth) return 'text'
      if (this.isSelected(cell)) return 'flat'
      if (this.isToday(cell)) return 'tonal'
      return 'text'
    },
    cellColor(cell) {
      if (!cell.inMonth) return undefined
      if (this.isSelected(cell)) return 'primary'
      if (this.isToday(cell)) return 'warning'
      return undefined
    },
    cellBtnClass(cell) {
      return {
        'cal-empty': !cell.inMonth,
        'cal-selected': this.isSelected(cell)
      }
    }
  }
}
</script>

<style scoped>

.cal-title {
  font-family: "Playfair Display", serif;
  font-size: 16px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}



.cal-weekdays,
.cal-grid {
  margin: 0;
}

.cal-weekday-col,
.cal-cell-col {
  flex: 0 0 calc(100% / 7);
  max-width: calc(100% / 7);
}

.cal-weekday {
  text-align: center;
  font-size: 12px;
  color: rgba(245, 245, 245, 0.55);
  padding: 6px 0;
}


.cal-empty {
  opacity: 0;
  pointer-events: none;
}

.cal-selected :deep(.v-btn__content) {
  color: #050505;
  font-weight: 700;
}

@media (max-width: 520px) {
  .cal-title { font-size: 15px; }
}
</style>
