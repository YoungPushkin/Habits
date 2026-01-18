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
        ...(storeKey ? { [storeKey]: storeInstance } : { entityStore: storeInstance })
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
        const storeRef = storeKey ? this[storeKey] : this.entityStore
        if (!payload || !storeRef) return

        if (this.modalMode === 'create') {
          const res = storeRef[actions.add]?.(payload)
          if (res?.ok) this.ui.showToast(messages.created || 'Created', 'success')
          else if (res && res.error) this.ui.showToast(res.error, 'error')
        } else if (this.selectedItem) {
          const res = storeRef[actions.edit]?.(this.selectedItem.id, payload)
          if (res?.ok) this.ui.showToast(messages.updated || 'Updated', 'success')
          else if (res && res.error) this.ui.showToast(res.error, 'error')
        }

        this.closeModal()
      },
      [deleteName](id) {
        const storeRef = storeKey ? this[storeKey] : this.entityStore
        if (!storeRef) return
        const res = storeRef[actions.delete]?.(id)
        if (res?.ok) this.ui.showToast(messages.deleted || 'Deleted', 'success')
        else if (res && res.error) this.ui.showToast(res.error, 'error')
        if (this.selectedItem && this.selectedItem.id === id) this.closeModal()
      },
      ...(toggle
        ? {
            [toggle.name](id) {
              const storeRef = storeKey ? this[storeKey] : this.entityStore
              if (!storeRef) return
              const res = storeRef[toggle.action]?.(id)
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
            const storeRef = storeKey ? this[storeKey] : this.entityStore
            if (!storeRef) return
            const res = storeRef[cfg.action]?.(id)
            if (res?.ok) this.ui.showToast(cfg.success || 'Updated', 'success')
            else if (res && res.error) this.ui.showToast(res.error, 'error')
          }
        ])
      )
    }
  }
}
