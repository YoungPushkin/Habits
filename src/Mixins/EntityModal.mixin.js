export default {
  data() {
    return {
      showModal: false,
      modalMode: 'create', // 'create' | 'edit'
      modalType: '', // 'task' | 'habit'
      selectedItem: null
    }
  },
  methods: {
    openCreate(type = '') {
      this.modalType = type
      this.modalMode = 'create'
      this.selectedItem = null
      this.showModal = true
    },
    openEdit(type = '', item) {
      this.modalType = type
      this.modalMode = 'edit'
      this.selectedItem = item || null
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.modalMode = 'create'
      this.modalType = ''
      this.selectedItem = null
    }
  }
}
