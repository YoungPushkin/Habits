<script>
import TaskModalMixin from '../mixins/TaskModal.mixin'
import TaskCard from '../components/TaskCard.vue'
import TaskModal from '../components/TaskModal.vue'
import HfCarousel from '../components/global/HfCarousel.vue'
import BaseCard from '../components/global/BaseCard.vue'
import PageHeader from '../components/global/PageHeader.vue'

export default {
  name: 'TasksView',
  mixins: [TaskModalMixin],
  components: { TaskCard, TaskModal, HfCarousel, BaseCard, PageHeader },
  data() {
    return { priorityIndex: 0 }
  },
  computed: {
    hasActive() { return this.tasksStore.hasActive },
    activeHigh() { return this.tasksStore.activeHigh },
    activeMedium() { return this.tasksStore.activeMedium },
    activeLow() { return this.tasksStore.activeLow },
    prioritySlides() {
      return [
        { key: 'high', label: 'High priority', color: 'error', tasks: this.activeHigh },
        { key: 'medium', label: 'Medium priority', color: 'warning', tasks: this.activeMedium },
        { key: 'low', label: 'Low priority', color: 'info', tasks: this.activeLow }
      ].filter(s => Array.isArray(s.tasks) && s.tasks.length)
    },
    priorityTotal() { return this.prioritySlides.length },
    currentSlide() { return this.prioritySlides[this.priorityIndex] || null }
  },
  watch: {
    prioritySlides(list) {
      const max = (Array.isArray(list) ? list.length : 0) - 1
      if (max < 0) this.priorityIndex = 0
      else if (this.priorityIndex > max) this.priorityIndex = 0
    }
  },
  methods: {
    priorityPrev() {
      if (this.priorityIndex <= 0) return
      const c = this.$refs.priorityCarousel
      if (c && c.prev) c.prev()
      this.priorityIndex -= 1
    },
    priorityNext() {
      const max = this.priorityTotal - 1
      if (this.priorityIndex >= max) return
      const c = this.$refs.priorityCarousel
      if (c && c.next) c.next()
      this.priorityIndex += 1
    }
  }
}
</script>

<template>
  <section class="app-page">
    <PageHeader title="Tasks" subtitle="Plan and complete your key actions.">
      <template #meta>
        <v-btn variant="tonal" rounded="pill" color="primary" @click="openTaskCreate">
          <i class="bi bi-plus-lg" style="margin-right:8px;"></i>
          Add task
        </v-btn>
      </template>
    </PageHeader>

    <v-alert
      v-if="!hasActive"
      type="info"
      variant="tonal"
      density="comfortable"
      class="tasks-empty"
    >
      You have no active tasks yet. Create your first task to start moving forward.
    </v-alert>

    <BaseCard v-else title="Tasks by priority" body-class="card-scroll">
      <template #meta>
        <div class="carousel-controls">
          <v-btn
            icon
            size="small"
            variant="tonal"
            class="btn-icon act-gold"
            :disabled="priorityIndex <= 0"
            @click="priorityPrev"
          >
            <i class="bi bi-chevron-left"></i>
          </v-btn>

          <v-chip
            v-if="currentSlide"
            size="small"
            variant="tonal"
            :color="currentSlide.color || 'primary'"
          >
            {{ currentSlide.label }} & {{ currentSlide.tasks.length }} tasks
          </v-chip>

          <v-btn
            icon
            size="small"
            variant="tonal"
            class="btn-icon act-gold"
            :disabled="priorityIndex >= priorityTotal - 1"
            @click="priorityNext"
          >
            <i class="bi bi-chevron-right"></i>
          </v-btn>
        </div>
      </template>

      <div v-if="!prioritySlides.length" class="t-body">
        No active tasks to show.
      </div>

      <template v-else>
        <HfCarousel ref="priorityCarousel" :items="prioritySlides">
          <template #default="{ item }">
            <div class="stack">
              <TaskCard
                v-for="t in item.tasks"
                :key="t.id"
                :task="t"
                @complete="completeTask"
                @edit="openTaskEdit"
                @delete="deleteTask"
              />
            </div>
          </template>
        </HfCarousel>
      </template>
    </BaseCard>

    <TaskModal
      v-if="showModal && modalType === 'task'"
      :mode="modalMode"
      :task="selectedItem"
      @close="closeModal"
      @save="submitTask"
    />
  </section>
</template>






