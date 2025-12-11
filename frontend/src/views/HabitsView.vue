<template>
  <section class="habits">
    <div class="habits-header">
      <div>
        <h1 class="habits-title">Habits</h1>
        <p class="habits-subtitle">Create, edit and manage your habits.</p>
      </div>
      <div class="habits-meta">
        <span class="habits-count">
          Total: {{ habits.length }}
        </span>
      </div>
    </div>

    <div class="habits-actions-center">
      <button type="button" class="habits-btn primary" @click="openCreate">
        ADD+
      </button>
    </div>

    <div class="habits-list-card">
      <div class="habits-list-header">
        <h2 class="habits-form-title">All habits</h2>
      </div>

      <div v-if="habits.length === 0" class="habits-empty">
        No habits yet. Click "Добавить привычку" to create one.
      </div>

      <div v-else class="habits-list">
        <HabitCard
          v-for="h in habits"
          :key="h.id"
          :habit="h"
          @toggle="toggleHabit"
          @edit="startEdit"
          @delete="deleteHabit"
        />
      </div>
    </div>

    <HabitModal
      :visible="modalVisible"
      :mode="modalMode"
      :habit="editingHabit"
      @close="closeModal"
      @save="handleSave"
    />
  </section>
</template>

<script>
import HabitCard from '../components/layout/HabitCard.vue'
import HabitModal from '../components/layout/HabitModal.vue'
import { useHabitsStore } from '../stores/habits.js'
import '../assets/styles/habits.css'

export default {
  name: 'HabitsView',
  components: {
    HabitCard,
    HabitModal
  },
  data() {
    return {
      store: null,
      modalVisible: false,
      modalMode: 'create',
      editingHabit: null
    }
  },
  created() {
    this.store = useHabitsStore()
    this.store.initFromStorage()
  },
  computed: {
    habits() {
      return this.store.habits
    }
  },
  methods: {
    openCreate() {
      this.modalMode = 'create'
      this.editingHabit = null
      this.modalVisible = true
    },
    startEdit(habit) {
      this.modalMode = 'edit'
      this.editingHabit = habit
      this.modalVisible = true
    },
    closeModal() {
      this.modalVisible = false
    },
    handleSave(payload) {
      if (this.modalMode === 'create') {
        this.store.addHabit(
          payload.name,
          '',
          'custom',
          payload.category,
          payload.isDaily,
          payload.days
        )
      } else if (this.modalMode === 'edit' && this.editingHabit) {
        this.store.editHabit(this.editingHabit.id, {
          name: payload.name,
          category: payload.category,
          isDaily: payload.isDaily,
          days: payload.days
        })
      }
      this.modalVisible = false
      this.editingHabit = null
    },
    toggleHabit(id) {
      this.store.toggleHabit(id)
    },
    deleteHabit(id) {
      this.store.deleteHabit(id)
      if (this.editingHabit && this.editingHabit.id === id) {
        this.modalVisible = false
        this.editingHabit = null
      }
    }
  }
}
</script>
