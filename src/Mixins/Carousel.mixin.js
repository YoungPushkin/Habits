export default {
  data() {
    return {
      habitsIndex: 0,
      tasksIndex: 0
    }
  },

  watch: {
    todayHabitsForUI(list) {
      const len = Array.isArray(list) ? list.length : 0
      const max = len - 1
      if (max < 0) this.habitsIndex = 0
      else if (!Number.isFinite(this.habitsIndex) || this.habitsIndex > max) this.habitsIndex = 0
    },

    importantTasks(list) {
      const len = Array.isArray(list) ? list.length : 0
      const max = len - 1
      if (max < 0) this.tasksIndex = 0
      else if (!Number.isFinite(this.tasksIndex) || this.tasksIndex > max) this.tasksIndex = 0
    }
  },

  methods: {
    onHabitsIndex(i) {
      const idx = Number(i)
      if (Number.isFinite(idx)) this.habitsIndex = idx
    },

    onTasksIndex(i) {
      const idx = Number(i)
      if (Number.isFinite(idx)) this.tasksIndex = idx
    },

    habitsCarouselPrev() {
      if (this.habitsIndex <= 0) return
      const c = this.$refs.habitsCarousel
      if (c && c.prev) c.prev()
      this.habitsIndex -= 1
    },

    habitsCarouselNext() {
      const max = (this.todayHabitsForUI?.length || 0) - 1
      if (this.habitsIndex >= max) return
      const c = this.$refs.habitsCarousel
      if (c && c.next) c.next()
      this.habitsIndex += 1
    },

    tasksCarouselPrev() {
      if (this.tasksIndex <= 0) return
      const c = this.$refs.tasksCarousel
      if (c && c.prev) c.prev()
      this.tasksIndex -= 1
    },

    tasksCarouselNext() {
      const max = (this.importantTasks?.length || 0) - 1
      if (this.tasksIndex >= max) return
      const c = this.$refs.tasksCarousel
      if (c && c.next) c.next()
      this.tasksIndex += 1
    }
  }
}
