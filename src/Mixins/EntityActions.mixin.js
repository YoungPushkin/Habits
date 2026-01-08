import EntityModalMixin from './EntityModal.mixin'
import { useUiStore } from '../stores/settings'

export function createEntityActionsMixin(options = {}) {
  const {
    type = '',
    store,
    storeKey = '',
    methodsPrefix = '',
    actions = {},
    messages = {},
    toggle,
    extraMethods = {}
  } = options

  const openCreateName = methodsPrefix ? `open${methodsPrefix}Create` : 'openCreateEntity'
  const openEditName = methodsPrefix ? `open${methodsPrefix}Edit` : 'openEditEntity'
  const submitName = methodsPrefix ? `submit${methodsPrefix}` : 'submitEntity'
  const deleteName = methodsPrefix ? `delete${methodsPrefix}` : 'deleteEntity'

  return {
    mixins: [EntityModalMixin],
    data() {
      const storeInstance = store ? store() : null
      return {
        ui: useUiStore(),
        entityStore: storeInstance,
        ...(storeKey ? { [storeKey]: storeInstance } : {})
      }
    },
    methods: {
      [openCreateName]() {
        this.openCreate(type)
      },
      [openEditName](item) {
        this.openEdit(type, item)
      },
      [submitName](payload) {
        if (!payload || !this.entityStore) return

        if (this.modalMode === 'create') {
          const res = this.entityStore[actions.add]?.(payload)
          if (res?.ok) this.ui.showToast(messages.created || 'Created', 'success')
          else if (res && res.error) this.ui.showToast(res.error, 'error')
        } else if (this.selectedItem) {
          const res = this.entityStore[actions.edit]?.(this.selectedItem.id, payload)
          if (res?.ok) this.ui.showToast(messages.updated || 'Updated', 'success')
          else if (res && res.error) this.ui.showToast(res.error, 'error')
        }

        this.closeModal()
      },
      [deleteName](id) {
        if (!this.entityStore) return
        const res = this.entityStore[actions.delete]?.(id)
        if (res?.ok) this.ui.showToast(messages.deleted || 'Deleted', 'success')
        else if (res && res.error) this.ui.showToast(res.error, 'error')
        if (this.selectedItem && this.selectedItem.id === id) this.closeModal()
      },
      ...(toggle
        ? {
            [toggle.name](id) {
              if (!this.entityStore) return
              const res = this.entityStore[toggle.action]?.(id)
              if (res?.ok) {
                const msg = typeof toggle.success === 'function'
                  ? toggle.success(res)
                  : (toggle.success || 'Updated')
                this.ui.showToast(msg, 'success')
              } else if (res && res.error) {
                this.ui.showToast(res.error, 'error')
              }
            }
          }
        : {}),
      ...Object.fromEntries(
        Object.entries(extraMethods).map(([name, cfg]) => [
          name,
          function(id) {
            if (!this.entityStore) return
            const res = this.entityStore[cfg.action]?.(id)
            if (res?.ok) this.ui.showToast(cfg.success || 'Updated', 'success')
            else if (res && res.error) this.ui.showToast(res.error, 'error')
          }
        ])
      )
    }
  }
}
